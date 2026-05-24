import { useState } from 'react';
import { ArrowLeftRight, SlidersHorizontal, Printer, AlertTriangle, Warehouse } from 'lucide-react';
import { Btn, formatCurrency } from '../components/ui';
import { mockStockEntries } from '../data/mockData';

export default function StockManagement() {
  const [warehouseFilter, setWarehouseFilter] = useState('All');
  const warehouses = ['All', ...Array.from(new Set(mockStockEntries.map(s => s.warehouse)))];
  const filtered = warehouseFilter === 'All' ? mockStockEntries : mockStockEntries.filter(s => s.warehouse === warehouseFilter);
  const totalValue = mockStockEntries.reduce((s, e) => s + e.value, 0);
  const totalQty = mockStockEntries.reduce((s, e) => s + e.availableQty, 0);
  const lowStock = mockStockEntries.filter(e => e.availableQty < 20);

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-shrink-0">
        <Btn variant="secondary" size="sm"><ArrowLeftRight size={12} />Transfer Stock</Btn>
        <Btn variant="secondary" size="sm"><SlidersHorizontal size={12} />Adjust Inventory</Btn>
        <Btn variant="secondary" size="sm"><Printer size={12} />Stock Report</Btn>
        <div className="flex-1" />
        <select value={warehouseFilter} onChange={e => setWarehouseFilter(e.target.value)}
          className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
          {warehouses.map(w => <option key={w}>{w}</option>)}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="bg-white rounded border border-gray-200 border-l-4 border-l-blue-500 p-3 shadow-sm">
            <div className="text-[10px] text-gray-500 uppercase font-medium mb-1">Total Available Qty</div>
            <div className="text-xl font-bold text-gray-900">{totalQty.toLocaleString()} MT</div>
            <div className="text-[10px] text-gray-400">Across all warehouses</div>
          </div>
          <div className="bg-white rounded border border-gray-200 border-l-4 border-l-yellow-500 p-3 shadow-sm">
            <div className="text-[10px] text-gray-500 uppercase font-medium mb-1">Low Stock Items</div>
            <div className="text-xl font-bold text-yellow-600">{lowStock.length}</div>
            <div className="text-[10px] text-gray-400">Require reorder</div>
          </div>
          <div className="bg-white rounded border border-gray-200 border-l-4 border-l-teal-500 p-3 shadow-sm">
            <div className="text-[10px] text-gray-500 uppercase font-medium mb-1">Warehouse Count</div>
            <div className="text-xl font-bold text-gray-900">3</div>
            <div className="text-[10px] text-gray-400">Active locations</div>
          </div>
          <div className="bg-white rounded border border-gray-200 border-l-4 border-l-green-500 p-3 shadow-sm">
            <div className="text-[10px] text-gray-500 uppercase font-medium mb-1">Inventory Value</div>
            <div className="text-xl font-bold text-green-700">Rs {(totalValue / 1000000).toFixed(2)}M</div>
            <div className="text-[10px] text-gray-400">At sales rate</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { name: 'WH-01 Main Warehouse', items: 4, qty: 2940, val: 2103000, cap: 80 },
            { name: 'WH-02 Storage Facility', items: 2, qty: 1750, val: 3800000, cap: 65 },
            { name: 'WH-03 Special Products', items: 1, qty: 55, val: 467500, cap: 30 },
          ].map(wh => (
            <div key={wh.name} className="bg-white rounded border border-gray-200 p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Warehouse size={13} className="text-blue-500" />
                <span className="text-xs font-semibold text-gray-700">{wh.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[10px] mb-2">
                <span className="text-gray-500">Items: <strong className="text-gray-700">{wh.items}</strong></span>
                <span className="text-gray-500">Qty: <strong className="text-gray-700">{wh.qty.toLocaleString()}</strong></span>
                <span className="col-span-2 text-gray-500">Value: <strong className="text-gray-700">Rs {formatCurrency(wh.val)}</strong></span>
              </div>
              <div>
                <div className="flex justify-between text-[9px] text-gray-500 mb-0.5"><span>Capacity</span><span>{wh.cap}%</span></div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${wh.cap > 80 ? 'bg-red-500' : wh.cap > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${wh.cap}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-700">Stock Ledger</h3>
            <span className="text-[10px] text-gray-500">{filtered.length} records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr>
                {['Item Code', 'Item Name', 'Warehouse', 'Batch No', 'Available Qty', 'Reserved Qty', 'Damaged Qty', 'Total Qty', 'Value', 'Last Updated', 'Actions'].map(h => (
                  <th key={h} className="bg-gray-50 px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase border-b border-gray-200 whitespace-nowrap sticky top-0">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map(entry => {
                  const isLow = entry.availableQty < 20;
                  return (
                    <tr key={entry.id} className={`hover:bg-gray-50 ${isLow ? 'bg-yellow-50/50' : ''}`}>
                      <td className="px-3 py-1.5 border-b border-gray-100 font-medium text-blue-600">{entry.itemCode}</td>
                      <td className="px-3 py-1.5 border-b border-gray-100 font-medium text-gray-800">{entry.item}</td>
                      <td className="px-3 py-1.5 border-b border-gray-100"><span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-medium">{entry.warehouse}</span></td>
                      <td className="px-3 py-1.5 border-b border-gray-100 text-gray-500">{entry.batchNo}</td>
                      <td className="px-3 py-1.5 border-b border-gray-100 text-right">
                        <span className={`font-semibold flex items-center justify-end gap-1 ${isLow ? 'text-red-600' : 'text-gray-800'}`}>
                          {isLow && <AlertTriangle size={10} className="text-yellow-500" />}
                          {entry.availableQty.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 border-b border-gray-100 text-right text-orange-600 font-medium">{entry.reservedQty}</td>
                      <td className="px-3 py-1.5 border-b border-gray-100 text-right text-red-600">{entry.damagedQty}</td>
                      <td className="px-3 py-1.5 border-b border-gray-100 text-right font-semibold text-gray-700">{(entry.availableQty + entry.reservedQty + entry.damagedQty).toLocaleString()}</td>
                      <td className="px-3 py-1.5 border-b border-gray-100 text-right text-green-700 font-medium">Rs {formatCurrency(entry.value)}</td>
                      <td className="px-3 py-1.5 border-b border-gray-100 text-gray-500">{entry.lastUpdated}</td>
                      <td className="px-3 py-1.5 border-b border-gray-100">
                        <div className="flex gap-2">
                          <button className="text-[10px] text-blue-600 hover:underline">Adjust</button>
                          <button className="text-[10px] text-gray-500 hover:underline">Transfer</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
