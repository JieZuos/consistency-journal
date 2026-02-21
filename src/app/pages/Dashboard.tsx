import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useTrading } from '../context/TradingContext';
import { ConsistencyTracker } from '../components/ConsistencyTracker';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Target, Activity } from 'lucide-react';
import { cn } from '../components/ui/utils';

export function Dashboard() {
  const { trades } = useTrading();

  // Calculate stats
  const totalPnL = trades.reduce((sum, trade) => sum + trade.profitLoss, 0);
  const todaysPnL = trades
    .filter(trade => trade.date === new Date().toISOString().split('T')[0])
    .reduce((sum, trade) => sum + trade.profitLoss, 0);
  
  const wins = trades.filter(t => t.status === 'Win').length;
  const winRate = trades.length > 0 ? (wins / trades.length) * 100 : 0;
  const totalTrades = trades.length;

  // Equity curve data
  const equityCurve = trades
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, trade, index) => {
      const lastEquity = index > 0 ? acc[index - 1].equity : 0;
      acc.push({
        date: new Date(trade.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        equity: lastEquity + trade.profitLoss,
      });
      return acc;
    }, [] as { date: string; equity: number }[]);

  // Daily PnL data
  const dailyPnLMap = new Map<string, number>();
  trades.forEach(trade => {
    const dateStr = new Date(trade.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dailyPnLMap.set(dateStr, (dailyPnLMap.get(dateStr) || 0) + trade.profitLoss);
  });

  const dailyPnLData = Array.from(dailyPnLMap.entries())
    .map(([date, pnl]) => ({ date, pnl }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-14); // Last 14 days

  const StatCard = ({ title, value, icon: Icon, trend, className }: any) => (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">{title}</p>
            <p className={cn("text-3xl font-bold", className)}>
              {value}
            </p>
          </div>
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
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Overview of your trading performance</p>
      </div>

      <ConsistencyTracker />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Net PnL"
          value={`$${totalPnL.toFixed(2)}`}
          icon={totalPnL >= 0 ? TrendingUp : TrendingDown}
          trend={totalPnL >= 0 ? 'up' : 'down'}
          className={totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}
        />
        <StatCard
          title="Today's PnL"
          value={`$${todaysPnL.toFixed(2)}`}
          icon={todaysPnL >= 0 ? TrendingUp : TrendingDown}
          trend={todaysPnL >= 0 ? 'up' : 'down'}
          className={todaysPnL >= 0 ? 'text-green-400' : 'text-red-400'}
        />
        <StatCard
          title="Win Rate"
          value={`${winRate.toFixed(1)}%`}
          icon={Target}
          trend="neutral"
          className="text-white"
        />
        <StatCard
          title="Total Trades"
          value={totalTrades}
          icon={Activity}
          trend="neutral"
          className="text-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Equity Curve</CardTitle>
            <CardDescription className="text-gray-400">Cumulative profit over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={equityCurve}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Line type="monotone" dataKey="equity" stroke="#3B82F6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Daily PnL</CardTitle>
            <CardDescription className="text-gray-400">Last 14 days performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyPnLData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Bar dataKey="pnl" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
