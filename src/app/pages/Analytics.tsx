import { useTrading } from '../context/TradingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart, TrendingUp, TrendingDown, Target, Activity, Calendar } from 'lucide-react';
import { cn } from '../components/ui/utils';

export function Analytics() {
  const { trades } = useTrading();

  // Calculate analytics
  const wins = trades.filter(t => t.status === 'Win');
  const losses = trades.filter(t => t.status === 'Loss');
  const breakEven = trades.filter(t => t.status === 'BE');

  const winRate = trades.length > 0 ? (wins.length / trades.length) * 100 : 0;
  
  const avgWin = wins.length > 0 
    ? wins.reduce((sum, t) => sum + t.profitLoss, 0) / wins.length 
    : 0;
  
  const avgLoss = losses.length > 0 
    ? losses.reduce((sum, t) => sum + t.profitLoss, 0) / losses.length 
    : 0;

  const rrRatio = avgLoss !== 0 ? Math.abs(avgWin / avgLoss) : 0;

  const largestWin = trades.length > 0 
    ? Math.max(...trades.map(t => t.profitLoss)) 
    : 0;
  
  const largestLoss = trades.length > 0 
    ? Math.min(...trades.map(t => t.profitLoss)) 
    : 0;

  // Calculate consecutive wins/losses
  let maxConsecutiveWins = 0;
  let maxConsecutiveLosses = 0;
  let currentWinStreak = 0;
  let currentLossStreak = 0;

  trades
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .forEach(trade => {
      if (trade.status === 'Win') {
        currentWinStreak++;
        currentLossStreak = 0;
        maxConsecutiveWins = Math.max(maxConsecutiveWins, currentWinStreak);
      } else if (trade.status === 'Loss') {
        currentLossStreak++;
        currentWinStreak = 0;
        maxConsecutiveLosses = Math.max(maxConsecutiveLosses, currentLossStreak);
      } else {
        currentWinStreak = 0;
        currentLossStreak = 0;
      }
    });

  // Calendar style daily PnL
  const dailyPnLMap = new Map<string, number>();
  trades.forEach(trade => {
    const date = trade.date;
    dailyPnLMap.set(date, (dailyPnLMap.get(date) || 0) + trade.profitLoss);
  });

  const sortedDailyPnL = Array.from(dailyPnLMap.entries())
    .map(([date, pnl]) => ({ date, pnl }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 30);

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, className }: any) => (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            trend === 'up' ? "bg-green-500/20" : trend === 'down' ? "bg-red-500/20" : "bg-blue-500/20"
          )}>
            <Icon className={cn(
              "w-6 h-6",
              trend === 'up' ? "text-green-400" : trend === 'down' ? "text-red-400" : "text-blue-400"
            )} />
          </div>
        </div>
        <p className="text-sm text-gray-400 mb-1">{title}</p>
        <p className={cn("text-3xl font-bold mb-1", className)}>
          {value}
        </p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">Detailed performance metrics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Win Rate"
          value={`${winRate.toFixed(1)}%`}
          subtitle={`${wins.length} wins, ${losses.length} losses, ${breakEven.length} BE`}
          icon={Target}
          trend="neutral"
          className="text-white"
        />
        
        <StatCard
          title="Average Win"
          value={`$${avgWin.toFixed(2)}`}
          subtitle={`From ${wins.length} winning trades`}
          icon={TrendingUp}
          trend="up"
          className="text-green-400"
        />
        
        <StatCard
          title="Average Loss"
          value={`$${avgLoss.toFixed(2)}`}
          subtitle={`From ${losses.length} losing trades`}
          icon={TrendingDown}
          trend="down"
          className="text-red-400"
        />
        
        <StatCard
          title="Risk/Reward Ratio"
          value={rrRatio.toFixed(2)}
          subtitle="Average R:R per trade"
          icon={BarChart}
          trend="neutral"
          className="text-blue-400"
        />
        
        <StatCard
          title="Largest Win"
          value={`$${largestWin.toFixed(2)}`}
          subtitle="Best single trade"
          icon={TrendingUp}
          trend="up"
          className="text-green-400"
        />
        
        <StatCard
          title="Largest Loss"
          value={`$${largestLoss.toFixed(2)}`}
          subtitle="Worst single trade"
          icon={TrendingDown}
          trend="down"
          className="text-red-400"
        />
        
        <StatCard
          title="Max Consecutive Wins"
          value={maxConsecutiveWins}
          subtitle="Longest winning streak"
          icon={Activity}
          trend="up"
          className="text-green-400"
        />
        
        <StatCard
          title="Max Consecutive Losses"
          value={maxConsecutiveLosses}
          subtitle="Longest losing streak"
          icon={Activity}
          trend="down"
          className="text-red-400"
        />
        
        <StatCard
          title="Total Trades"
          value={trades.length}
          subtitle="All time"
          icon={Calendar}
          trend="neutral"
          className="text-white"
        />
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Daily PnL Summary
          </CardTitle>
          <CardDescription className="text-gray-400">
            Last 30 trading days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {sortedDailyPnL.map(({ date, pnl }) => (
              <div
                key={date}
                className={cn(
                  "p-4 rounded-lg border",
                  pnl > 0 
                    ? "bg-green-500/10 border-green-500/30" 
                    : pnl < 0 
                    ? "bg-red-500/10 border-red-500/30"
                    : "bg-gray-800 border-gray-700"
                )}
              >
                <p className="text-xs text-gray-400 mb-1">
                  {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <p className={cn(
                  "text-lg font-bold",
                  pnl > 0 ? "text-green-400" : pnl < 0 ? "text-red-400" : "text-gray-400"
                )}>
                  ${pnl.toFixed(2)}
                </p>
              </div>
            ))}
            {sortedDailyPnL.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-8">
                No trading data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Performance Breakdown</CardTitle>
            <CardDescription className="text-gray-400">Trade status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-gray-300">Wins</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">{wins.length}</span>
                  <span className="text-gray-400 text-sm">
                    ({trades.length > 0 ? ((wins.length / trades.length) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-gray-300">Losses</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">{losses.length}</span>
                  <span className="text-gray-400 text-sm">
                    ({trades.length > 0 ? ((losses.length / trades.length) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gray-500" />
                  <span className="text-gray-300">Break Even</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">{breakEven.length}</span>
                  <span className="text-gray-400 text-sm">
                    ({trades.length > 0 ? ((breakEven.length / trades.length) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Direction Analysis</CardTitle>
            <CardDescription className="text-gray-400">Buy vs Sell performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Buy', 'Sell'].map(direction => {
                const directionTrades = trades.filter(t => t.direction === direction);
                const directionWins = directionTrades.filter(t => t.status === 'Win').length;
                const directionWinRate = directionTrades.length > 0 
                  ? (directionWins / directionTrades.length) * 100 
                  : 0;
                const directionPnL = directionTrades.reduce((sum, t) => sum + t.profitLoss, 0);

                return (
                  <div key={direction} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "font-medium",
                        direction === 'Buy' ? "text-green-400" : "text-red-400"
                      )}>
                        {direction}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {directionTrades.length} trades
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Win Rate:</span>
                      <span className="text-white">{directionWinRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Total P&L:</span>
                      <span className={cn(
                        "font-medium",
                        directionPnL >= 0 ? "text-green-400" : "text-red-400"
                      )}>
                        ${directionPnL.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
