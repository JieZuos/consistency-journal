export interface Trade {
  id: string;
  date: string;
  market: string;
  direction: 'Buy' | 'Sell';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskPercent: number;
  lotSize: number;
  profitLoss: number;
  notes: string;
  status: 'Win' | 'Loss' | 'BE';
}

export interface ConsistencyData {
  totalProfit: number;
  highestDayProfit: number;
  cycleStartDate: string;
  consistencyPercentage: number;
}

export interface Settings {
  darkMode: boolean;
  consistencyPercentage: number;
}

export interface DailyPnL {
  date: string;
  pnl: number;
}
