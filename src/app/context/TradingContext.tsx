import { createContext, useContext, ReactNode } from 'react';
import { Trade, ConsistencyData, Settings } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface TradingContextType {
  trades: Trade[];
  setTrades: (trades: Trade[] | ((prev: Trade[]) => Trade[])) => void;
  consistency: ConsistencyData;
  setConsistency: (data: ConsistencyData | ((prev: ConsistencyData) => ConsistencyData)) => void;
  settings: Settings;
  setSettings: (settings: Settings | ((prev: Settings) => Settings)) => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export function TradingProvider({ children }: { children: ReactNode }) {
  const [trades, setTrades] = useLocalStorage<Trade[]>('trading-journal-trades', []);
  const [consistency, setConsistency] = useLocalStorage<ConsistencyData>('trading-journal-consistency', {
    totalProfit: 0,
    highestDayProfit: 0,
    cycleStartDate: new Date().toISOString(),
    consistencyPercentage: 40,
  });
  const [settings, setSettings] = useLocalStorage<Settings>('trading-journal-settings', {
    darkMode: true,
    consistencyPercentage: 40,
  });

  return (
    <TradingContext.Provider value={{ trades, setTrades, consistency, setConsistency, settings, setSettings }}>
      {children}
    </TradingContext.Provider>
  );
}

export function useTrading() {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within TradingProvider');
  }
  return context;
}
