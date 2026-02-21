import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useTrading } from '../context/TradingContext';
import { AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { cn } from './ui/utils';

export function ConsistencyTracker() {
  const { consistency, setConsistency, trades } = useTrading();

  const consistencyUsed = consistency.highestDayProfit > 0
    ? (consistency.highestDayProfit / consistency.totalProfit) * 100
    : 0;

  const isViolated = consistencyUsed > consistency.consistencyPercentage;
  const allowedPercentage = consistency.consistencyPercentage;

  const handlePayoutReset = () => {
    if (confirm('Are you sure you want to mark a payout day? This will reset the consistency tracking cycle.')) {
      setConsistency({
        ...consistency,
        totalProfit: 0,
        highestDayProfit: 0,
        cycleStartDate: new Date().toISOString(),
      });
    }
  };

  const handlePercentageChange = (value: number) => {
    if (value >= 0 && value <= 100) {
      setConsistency({
        ...consistency,
        consistencyPercentage: value,
      });
    }
  };

  // Calculate daily profits from trades
  const calculateDailyProfits = () => {
    const dailyMap = new Map<string, number>();
    
    trades.forEach(trade => {
      const date = trade.date;
      const current = dailyMap.get(date) || 0;
      dailyMap.set(date, current + trade.profitLoss);
    });

    return dailyMap;
  };

  // Update consistency based on trades
  const updateConsistency = () => {
    const dailyProfits = calculateDailyProfits();
    let total = 0;
    let highest = 0;

    dailyProfits.forEach(profit => {
      total += profit;
      if (profit > highest) {
        highest = profit;
      }
    });

    setConsistency(prev => ({
      ...prev,
      totalProfit: total,
      highestDayProfit: highest,
    }));
  };

  // Update on mount and when trades change
  React.useEffect(() => {
    updateConsistency();
  }, [trades]);

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <CardTitle className="text-white">Consistency Rule Tracker</CardTitle>
          </div>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
            isViolated 
              ? "bg-red-500/20 text-red-400" 
              : "bg-green-500/20 text-green-400"
          )}>
            {isViolated ? (
              <>
                <AlertCircle className="w-4 h-4" />
                <span>Rule Violated</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Within Rule</span>
              </>
            )}
          </div>
        </div>
        <CardDescription className="text-gray-400">
          Funded account consistency requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Total Profit</p>
            <p className={cn(
              "text-2xl font-bold",
              consistency.totalProfit >= 0 ? "text-green-400" : "text-red-400"
            )}>
              ${consistency.totalProfit.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Highest Day</p>
            <p className="text-2xl font-bold text-blue-400">
              ${consistency.highestDayProfit.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Consistency Used</p>
            <p className={cn(
              "text-2xl font-bold",
              isViolated ? "text-red-400" : "text-white"
            )}>
              {consistencyUsed.toFixed(1)}%
            </p>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col gap-2">
            <p className="text-xs text-gray-400">Allowed %</p>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={consistency.consistencyPercentage}
                onChange={(e) => handlePercentageChange(Number(e.target.value))}
                className="h-8 w-20 bg-gray-900 border-gray-700 text-white"
                min="0"
                max="100"
              />
              <span className="text-sm text-gray-400">%</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Consistency Progress</span>
            <span className={cn(
              "font-medium",
              isViolated ? "text-red-400" : "text-white"
            )}>
              {consistencyUsed.toFixed(1)}% / {allowedPercentage}%
            </span>
          </div>
          <Progress 
            value={Math.min(consistencyUsed, 100)} 
            className={cn(
              "h-3",
              isViolated ? "[&>div]:bg-red-500" : "[&>div]:bg-green-500"
            )}
          />
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={handlePayoutReset}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Mark Payout Day
          </Button>
          <div className="text-xs text-gray-400 flex items-center">
            Cycle start: {new Date(consistency.cycleStartDate).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import * as React from 'react';
