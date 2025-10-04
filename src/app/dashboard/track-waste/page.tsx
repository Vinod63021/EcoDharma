
"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChartBig, PlusCircle, Trash2, Edit3, PieChart as PieChartIcon } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { WasteItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const WASTE_CATEGORIES = ['Plastic', 'Paper', 'Organic', 'Glass', 'Metal', 'E-waste', 'Other'];
const CHART_COLORS = [
  'hsl(var(--chart-1))', 
  'hsl(var(--chart-2))', 
  'hsl(var(--chart-3))', 
  'hsl(var(--chart-4))', 
  'hsl(var(--chart-5))',
  'hsl(var(--accent))', // Using accent for 6th
  'hsl(var(--secondary))' // Using secondary for 7th
];


export default function TrackWastePage() {
  const [wasteLog, setWasteLog] = useState<WasteItem[]>([]);
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState<string>('');
  const [itemQuantity, setItemQuantity] = useState<number | string>('');
  const [editingItem, setEditingItem] = useState<WasteItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedLog = localStorage.getItem('ecoDharmaWasteLog');
    if (storedLog) {
      setWasteLog(JSON.parse(storedLog));
    } else {
      setWasteLog([
        { id: '1', name: 'Plastic Bottles', category: 'Plastic', quantity: 5, date: new Date().toISOString() },
        { id: '2', name: 'Newspapers', category: 'Paper', quantity: 2, date: new Date().toISOString() },
        { id: '3', name: 'Food Scraps', category: 'Organic', quantity: 1, date: new Date().toISOString() },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ecoDharmaWasteLog', JSON.stringify(wasteLog));
  }, [wasteLog]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !itemCategory || !itemQuantity) {
      toast({ title: "Missing Information", description: "Please fill all fields.", variant: "destructive" });
      return;
    }

    const newEntry: WasteItem = {
      id: editingItem ? editingItem.id : crypto.randomUUID(),
      name: itemName,
      category: itemCategory,
      quantity: Number(itemQuantity),
      date: new Date().toISOString(),
    };

    if (editingItem) {
      setWasteLog(wasteLog.map(item => item.id === editingItem.id ? newEntry : item));
      toast({ title: "Log Updated", description: `${itemName} updated in your waste log.` });
    } else {
      setWasteLog([...wasteLog, newEntry]);
      toast({ title: "Log Added", description: `${itemName} added to your waste log.` });
    }
    
    setItemName('');
    setItemCategory('');
    setItemQuantity('');
    setEditingItem(null);
  };

  const handleEdit = (item: WasteItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemCategory(item.category);
    setItemQuantity(item.quantity);
  };

  const handleDelete = (id: string) => {
    setWasteLog(wasteLog.filter(item => item.id !== id));
    toast({ title: "Log Entry Deleted", description: "Item removed from your waste log." });
  };
  
  const chartData = WASTE_CATEGORIES.map(category => ({
    name: category,
    value: wasteLog.filter(item => item.category === category).reduce((sum, item) => sum + item.quantity, 0),
  })).filter(data => data.value > 0);

  const chartConfig = chartData.reduce((acc, item, index) => {
    acc[item.name] = { label: item.name, color: CHART_COLORS[index % CHART_COLORS.length] };
    return acc;
  }, {} as any);


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center"><BarChartBig className="mr-3 h-7 w-7" />Waste Tracking Log</CardTitle>
          <CardDescription>Log your daily waste to understand your habits and track your progress.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-6 p-4 border rounded-lg bg-muted/30">
            <div>
              <Label htmlFor="item-name">Item Name</Label>
              <Input id="item-name" placeholder="e.g., Plastic Bottles" value={itemName} onChange={e => setItemName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="item-category">Category</Label>
              <Select value={itemCategory} onValueChange={setItemCategory} required>
                <SelectTrigger id="item-category"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {WASTE_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="item-quantity">Quantity (kg/units)</Label>
              <Input id="item-quantity" type="number" placeholder="e.g., 5" value={itemQuantity} onChange={e => setItemQuantity(e.target.value)} min="0.1" step="0.1" required/>
            </div>
            <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground self-end">
              <PlusCircle className="mr-2 h-4 w-4" /> {editingItem ? 'Update Entry' : 'Add Entry'}
            </Button>
            {editingItem && <Button variant="outline" onClick={() => { setEditingItem(null); setItemName(''); setItemCategory(''); setItemQuantity('');}} className="w-full md:w-auto self-end">Cancel Edit</Button>}
          </form>

          {wasteLog.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wasteLog.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{format(new Date(item.date), 'PP')}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">No waste logged yet. Add your first entry!</p>
          )}
        </CardContent>
      </Card>

      {wasteLog.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center"><PieChartIcon className="mr-2 h-6 w-6" />Waste Composition</CardTitle>
            <CardDescription>Visualize your waste breakdown by category.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] w-full">
             <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" label isAnimationActive={true}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
