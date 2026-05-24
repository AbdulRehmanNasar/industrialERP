import { useState } from 'react';
import { Plus, Upload, Download, X, Search, AlertTriangle } from 'lucide-react';
import { Btn, Input, Select, StatusBadge, formatCurrency } from '../components/ui';
import { mockItems } from '../data/mockData';
import type { Item } from '../types';

function ItemForm({ item, onClose }: { item?: Item; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-[520px] max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">{item ? 'Edit Item' : 'Add New Item'}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-500"><X size={14} /></button>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          <Input label="Item Code" defaultValue={item?.itemCode ?? ''} placeholder="PM-XXX" />
          <Input label="Item Name" defaultValue={item?.itemName ?? ''} placeholder="Product name" />
          <div className="col-span-2">
            <label className="text-[10px] font-medium text-gray-600 uppercase tracking-wide block mb-0.5">Description</label>
            <textarea defaultValue={item?.description} rows={2}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none" />
          </div>
          <Select label="Unit" defaultValue={item?.unit}><option>MT</option><option>KG</option><option>PCS</option><option>BAG</option><option>LTR</option></Select>
          <Select label="Category" defaultValue={item?.category}><option>Pumice</option><option>Volcanic</option><option>Perlite</option><option>Sand</option><option>Other</option></Select>
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] font-medium text-gray-600 uppercase tracking-wide">Sales Rate</label>
            <input type="number" defaultValue={item?.salesRate} className="border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] font-medium text-gray-600 uppercase tracking-wide">Purchase Rate</label>
            <input type="number" defaultValue={item?.purchaseRate} className="border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <Select label="Tax Rate %" defaultValue={String(item?.taxPct ?? 17)}><option value="0">0%</option><option value="5">5%</option><option value="17">17% (Standard)</option></Select>
          <Select label="Warehouse" defaultValue={item?.warehouse}><option>WH-01</option><option>WH-02</option><option>WH-03</option></Select>
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] font-medium text-gray-600 uppercase tracking-wide">Reorder Level</label>
            <input type="number" defaultValue={item?.reorderLevel} className="border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] font-medium text-gray-600 uppercase tracking-wide">Opening Stock</label>
            <input type="number" defaultValue={item?.currentStock} className="border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <Select label="Status" defaultValue={item?.status}><option>Active</option><option>Inactive</option></Select>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex justify-end gap-2">
          <Btn variant="secondary" size="sm" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" size="sm">Save Item</Btn>
        </div>
      </div>
    </div>
  );
}

export default function Items() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState<Item | null | 'new'>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(mockItems.map(i => i.category)))];
  const filtered = mockItems.filter(i => {
    if (categoryFilter !== 'All' && i.category !== categoryFilter) return false;
    if (search && !i.itemName.toLowerCase().includes(search.toLowerCase()) && !i.itemCode.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const lowStock = mockItems.filter(i => i.currentStock <= i.reorderLevel);

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-shrink-0">
        <Btn variant="primary" size="sm" onClick={() => setShowForm('new')}><Plus size={12} />Add Item</Btn>
        <Btn variant="secondary" size="sm"><Upload size={12} />Import</Btn>
        <Btn variant="secondary" size="sm"><Download size={12} />Export</Btn>
        <div className="flex-1" />
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..."
            className="pl-7 pr-3 py-1 text-xs border border-gray-200 rounded w-44 focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {lowStock.length > 0 && (
          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded flex items-center gap-2">
            <AlertTriangle size={13} className="text-yellow-600 flex-shrink-0" />
            <span className="text-xs text-yellow-700"><strong>{lowStock.length} item(s)</strong> below reorder level: {lowStock.map(i => i.itemCode).join(', ')}</span>
          </div>
        )}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Total Items', val: String(mockItems.length), color: 'border-l-blue-500' },
            { label: 'Active Items', val: String(mockItems.filter(i => i.status === 'Active').length), color: 'border-l-green-500' },
            { label: 'Low Stock', val: String(lowStock.length), color: 'border-l-yellow-500' },
            { label: 'Categories', val: String(categories.length - 1), color: 'border-l-teal-500' },
          ].map(c => (
            <div key={c.label} className={`bg-white rounded border border-gray-200 border-l-4 ${c.color} p-3 shadow-sm`}>
              <div className="text-[10px] text-gray-500 uppercase font-medium mb-1">{c.label}</div>
              <div className="text-xl font-bold text-gray-900">{c.val}</div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-100"><span className="text-xs font-semibold text-gray-700">{filtered.length} items</span></div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr>
                {['Item Code', 'Item Name', 'Category', 'Unit', 'Sales Rate', 'Purchase Rate', 'Tax %', 'Stock', 'Reorder', 'Warehouse', 'Status', 'Actions'].map(h => (
                  <th key={h} className="bg-gray-50 px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase border-b border-gray-200 whitespace-nowrap sticky top-0">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map(item => {
                  const isLow = item.currentStock <= item.reorderLevel;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-1.5 border-b border-gray-100 font-medium text-blue-600">{item.itemCode}</td>
                      <td className="px-3 py-1.5 border-b border-gray-100 font-medium text-gray-800">{item.itemName}</td>
                      <td className="px-3 py-1.5 border-b border-gray-100"><span className="px-1.5 py-0.5 bg-gray-100 rounded text-[9px] text-gray-600">{item.category}</span></td>
                      <td className="px-3 py-1.5 border-b border-gray-100 text-gray-600">{item.unit}</td>
                      <td className="px-3 py-1.5 border-b border-gray-100 text-right font-medium text-gray-800">Rs {formatCurrency(item.salesRate)}</td>
                      <td className="px-3 py-1.5 border-b border-gray-100 text-right text-gray-600">Rs {formatCurrency(item.purchaseRate)}</td>
                      <td className="px-3 py-1.5 border-b border-gray-100 text-center text-gray-600">{item.taxPct}%</td>
                      <td className={`px-3 py-1.5 border-b border-gray-100 text-right font-semibold ${isLow ? 'text-red-600' : 'text-gray-800'}`}>
                        <span className="flex items-center justify-end gap-1">
                          {isLow && <AlertTriangle size={10} className="text-yellow-500" />}
                          {item.currentStock} {item.unit}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 border-b border-gray-100 text-center text-gray-500">{item.reorderLevel}</td>
                      <td className="px-3 py-1.5 border-b border-gray-100 text-gray-600">{item.warehouse}</td>
                      <td className="px-3 py-1.5 border-b border-gray-100"><StatusBadge status={item.status} /></td>
                      <td className="px-3 py-1.5 border-b border-gray-100">
                        <div className="flex gap-2">
                          <button onClick={() => setShowForm(item)} className="text-[10px] text-blue-600 hover:underline">Edit</button>
                          <button className="text-[10px] text-gray-500 hover:underline">Stock</button>
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
      {showForm && <ItemForm item={showForm === 'new' ? undefined : showForm} onClose={() => setShowForm(null)} />}
    </div>
  );
}
