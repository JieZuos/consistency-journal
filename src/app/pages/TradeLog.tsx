import { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { Trade } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Plus, Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { cn } from '../components/ui/utils';

export function TradeLog() {
  const { trades, setTrades } = useTrading();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [sortField, setSortField] = useState<keyof Trade>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [formData, setFormData] = useState<Partial<Trade>>({
    date: new Date().toISOString().split('T')[0],
    market: '',
    direction: 'Buy',
    entry: 0,
    stopLoss: 0,
    takeProfit: 0,
    riskPercent: 1,
    lotSize: 0.01,
    profitLoss: 0,
    notes: '',
    status: 'Win',
  });

  const handleInputChange = (field: keyof Trade, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (editingTrade) {
      setTrades(prev => prev.map(t => t.id === editingTrade.id ? { ...formData, id: editingTrade.id } as Trade : t));
    } else {
      const newTrade: Trade = {
        ...formData,
        id: Date.now().toString(),
      } as Trade;
      setTrades(prev => [...prev, newTrade]);
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (trade: Trade) => {
    setEditingTrade(trade);
    setFormData(trade);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this trade?')) {
      setTrades(prev => prev.filter(t => t.id !== id));
    }
  };

  const resetForm = () => {
    setEditingTrade(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      market: '',
      direction: 'Buy',
      entry: 0,
      stopLoss: 0,
      takeProfit: 0,
      riskPercent: 1,
      lotSize: 0.01,
      profitLoss: 0,
      notes: '',
      status: 'Win',
    });
  };

  const handleSort = (field: keyof Trade) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedTrades = trades
    .filter(trade => filterStatus === 'all' || trade.status === filterStatus)
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      return sortDirection === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Trade Log</h1>
          <p className="text-gray-400">Manage and track all your trades</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Trade
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTrade ? 'Edit Trade' : 'Add New Trade'}</DialogTitle>
              <DialogDescription className="text-gray-400">
                Enter the details of your trade
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-gray-300">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="market" className="text-gray-300">Market</Label>
                <Input
                  id="market"
                  value={formData.market}
                  onChange={(e) => handleInputChange('market', e.target.value)}
                  placeholder="e.g., EUR/USD, NQ"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="direction" className="text-gray-300">Direction</Label>
                <Select value={formData.direction} onValueChange={(val) => handleInputChange('direction', val)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Buy">Buy</SelectItem>
                    <SelectItem value="Sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status" className="text-gray-300">Status</Label>
                <Select value={formData.status} onValueChange={(val) => handleInputChange('status', val)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Win">Win</SelectItem>
                    <SelectItem value="Loss">Loss</SelectItem>
                    <SelectItem value="BE">Break Even</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="entry" className="text-gray-300">Entry Price</Label>
                <Input
                  id="entry"
                  type="number"
                  step="0.00001"
                  value={formData.entry}
                  onChange={(e) => handleInputChange('entry', parseFloat(e.target.value))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="stopLoss" className="text-gray-300">Stop Loss</Label>
                <Input
                  id="stopLoss"
                  type="number"
                  step="0.00001"
                  value={formData.stopLoss}
                  onChange={(e) => handleInputChange('stopLoss', parseFloat(e.target.value))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="takeProfit" className="text-gray-300">Take Profit</Label>
                <Input
                  id="takeProfit"
                  type="number"
                  step="0.00001"
                  value={formData.takeProfit}
                  onChange={(e) => handleInputChange('takeProfit', parseFloat(e.target.value))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="riskPercent" className="text-gray-300">Risk %</Label>
                <Input
                  id="riskPercent"
                  type="number"
                  step="0.1"
                  value={formData.riskPercent}
                  onChange={(e) => handleInputChange('riskPercent', parseFloat(e.target.value))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="lotSize" className="text-gray-300">Lot Size</Label>
                <Input
                  id="lotSize"
                  type="number"
                  step="0.01"
                  value={formData.lotSize}
                  onChange={(e) => handleInputChange('lotSize', parseFloat(e.target.value))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="profitLoss" className="text-gray-300">Profit/Loss ($)</Label>
                <Input
                  id="profitLoss"
                  type="number"
                  step="0.01"
                  value={formData.profitLoss}
                  onChange={(e) => handleInputChange('profitLoss', parseFloat(e.target.value))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="notes" className="text-gray-300">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Add your trade notes..."
                  className="bg-gray-800 border-gray-700 text-white"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button onClick={handleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {editingTrade ? 'Update Trade' : 'Add Trade'}
              </Button>
              <Button 
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(false);
                }} 
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">All Trades</CardTitle>
              <CardDescription className="text-gray-400">
                {filteredAndSortedTrades.length} trades found
              </CardDescription>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Trades</SelectItem>
                <SelectItem value="Win">Wins</SelectItem>
                <SelectItem value="Loss">Losses</SelectItem>
                <SelectItem value="BE">Break Even</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-gray-800/50">
                  <TableHead className="text-gray-400">
                    <button onClick={() => handleSort('date')} className="flex items-center gap-1 hover:text-white">
                      Date <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-gray-400">Market</TableHead>
                  <TableHead className="text-gray-400">Direction</TableHead>
                  <TableHead className="text-gray-400">Entry</TableHead>
                  <TableHead className="text-gray-400">SL</TableHead>
                  <TableHead className="text-gray-400">TP</TableHead>
                  <TableHead className="text-gray-400">Risk %</TableHead>
                  <TableHead className="text-gray-400">Lot</TableHead>
                  <TableHead className="text-gray-400">
                    <button onClick={() => handleSort('profitLoss')} className="flex items-center gap-1 hover:text-white">
                      P&L <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedTrades.map((trade) => (
                  <TableRow key={trade.id} className="border-gray-800 hover:bg-gray-800/50">
                    <TableCell className="text-white">{new Date(trade.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-white">{trade.market}</TableCell>
                    <TableCell>
                      <Badge className={cn(
                        trade.direction === 'Buy' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      )}>
                        {trade.direction}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">{trade.entry.toFixed(5)}</TableCell>
                    <TableCell className="text-white">{trade.stopLoss.toFixed(5)}</TableCell>
                    <TableCell className="text-white">{trade.takeProfit.toFixed(5)}</TableCell>
                    <TableCell className="text-white">{trade.riskPercent}%</TableCell>
                    <TableCell className="text-white">{trade.lotSize}</TableCell>
                    <TableCell className={cn(
                      "font-semibold",
                      trade.profitLoss >= 0 ? "text-green-400" : "text-red-400"
                    )}>
                      ${trade.profitLoss.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        trade.status === 'Win' 
                          ? 'bg-green-500/20 text-green-400' 
                          : trade.status === 'Loss'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-gray-500/20 text-gray-400'
                      )}>
                        {trade.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(trade)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(trade.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAndSortedTrades.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center text-gray-400 py-8">
                      No trades found. Add your first trade to get started!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
