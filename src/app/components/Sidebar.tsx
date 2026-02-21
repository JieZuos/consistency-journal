import { Link, useLocation } from 'react-router';
import { LayoutDashboard, BookOpen, BarChart3, Settings, TrendingUp } from 'lucide-react';
import { cn } from './ui/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: BookOpen, label: 'Trade Log', path: '/trades' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-[#0a0a0a] border-r border-gray-800 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg">TradeJournal</h1>
            <p className="text-xs text-gray-400">Pro Trading Suite</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2">Trading Account</p>
          <p className="text-sm font-semibold text-white">Demo Account</p>
        </div>
      </div>
    </div>
  );
}
