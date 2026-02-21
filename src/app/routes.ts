import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { TradeLog } from './pages/TradeLog';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'trades', Component: TradeLog },
      { path: 'analytics', Component: Analytics },
      { path: 'settings', Component: Settings },
    ],
  },
]);
