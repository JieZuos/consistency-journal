import { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Settings as SettingsIcon, Download, Trash2, Moon, Sun, Percent } from 'lucide-react';
import { toast } from 'sonner';

export function Settings() {
  const { trades, setTrades, consistency, setConsistency, settings, setSettings } = useTrading();
  const [localConsistencyPercent, setLocalConsistencyPercent] = useState(consistency.consistencyPercentage);

  const handleDarkModeToggle = (checked: boolean) => {
    setSettings(prev => ({ ...prev, darkMode: checked }));
    toast.success(checked ? 'Dark mode enabled' : 'Light mode enabled');
  };

  const handleConsistencyPercentUpdate = () => {
    if (localConsistencyPercent >= 0 && localConsistencyPercent <= 100) {
      setConsistency(prev => ({
        ...prev,
        consistencyPercentage: localConsistencyPercent,
      }));
      setSettings(prev => ({
        ...prev,
        consistencyPercentage: localConsistencyPercent,
      }));
      toast.success(`Consistency percentage updated to ${localConsistencyPercent}%`);
    } else {
      toast.error('Please enter a value between 0 and 100');
    }
  };

  const handleExportTrades = () => {
    const dataStr = JSON.stringify(trades, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trading-journal-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Trades exported successfully');
  };

  const handleResetAllData = () => {
    if (confirm('Are you sure you want to reset ALL data? This action cannot be undone!')) {
      if (confirm('This will delete all trades, consistency data, and settings. Are you absolutely sure?')) {
        setTrades([]);
        setConsistency({
          totalProfit: 0,
          highestDayProfit: 0,
          cycleStartDate: new Date().toISOString(),
          consistencyPercentage: 40,
        });
        setSettings({
          darkMode: true,
          consistencyPercentage: 40,
        });
        setLocalConsistencyPercent(40);
        toast.success('All data has been reset');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your trading journal preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Percent className="w-5 h-5" />
              Consistency Settings
            </CardTitle>
            <CardDescription className="text-gray-400">
              Configure your consistency rule percentage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="consistency-percent" className="text-gray-300">
                Consistency Percentage
              </Label>
              <div className="flex gap-2">
                <Input
                  id="consistency-percent"
                  type="number"
                  min="0"
                  max="100"
                  value={localConsistencyPercent}
                  onChange={(e) => setLocalConsistencyPercent(Number(e.target.value))}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="e.g., 40"
                />
                <Button 
                  onClick={handleConsistencyPercentUpdate}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Update
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                Maximum percentage of total profit allowed from a single day (0-100%)
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-gray-400">Current Settings:</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Consistency Rule:</span>
                  <span className="text-white font-medium">{consistency.consistencyPercentage}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Cycle Start:</span>
                  <span className="text-white font-medium">
                    {new Date(consistency.cycleStartDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Appearance
            </CardTitle>
            <CardDescription className="text-gray-400">
              Customize the look and feel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode" className="text-gray-300">
                  Dark Mode
                </Label>
                <p className="text-xs text-gray-400">
                  Toggle between light and dark themes
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-gray-400" />
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={handleDarkModeToggle}
                />
                <Moon className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-sm text-gray-400">
                {settings.darkMode 
                  ? '🌙 Dark mode is currently active' 
                  : '☀️ Light mode is currently active'
                }
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Note: This app is optimized for dark mode
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Download className="w-5 h-5" />
              Data Export
            </CardTitle>
            <CardDescription className="text-gray-400">
              Download your trading data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-300">
              Export all your trades to a JSON file for backup or external analysis.
            </p>
            <Button 
              onClick={handleExportTrades}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Trades (JSON)
            </Button>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-xs text-blue-300">
                💡 Tip: Regular backups help protect your trading data
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-400" />
              Danger Zone
            </CardTitle>
            <CardDescription className="text-gray-400">
              Irreversible actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-300">
              Reset all application data including trades, consistency tracking, and settings.
            </p>
            <Button 
              onClick={handleResetAllData}
              variant="destructive"
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Reset All Data
            </Button>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-xs text-red-300">
                ⚠️ Warning: This action cannot be undone!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Storage Information</CardTitle>
          <CardDescription className="text-gray-400">
            Your data is stored locally in your browser
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Total Trades:</span>
              <span className="text-white font-medium">{trades.length}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Data Storage:</span>
              <span className="text-white font-medium">LocalStorage</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400">Auto-save:</span>
              <span className="text-green-400 font-medium">Enabled</span>
            </div>
          </div>
          <div className="mt-4 bg-gray-800/50 rounded-lg p-4">
            <p className="text-xs text-gray-400">
              All your data is stored locally in your browser using LocalStorage. Your data persists 
              between sessions and is automatically saved when you make changes. Clear your browser 
              data to remove all stored information.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
