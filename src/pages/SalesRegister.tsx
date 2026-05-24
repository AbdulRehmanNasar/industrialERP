import { useState } from 'react';
import { Download, Printer, Search } from 'lucide-react';
import { StatusBadge, formatCurrency, Btn } from '../components/ui';
import { mockInvoices } from '../data/mockData';
import type { NavPage } from '../types';

interface Props {
  onNavigate: (page: NavPage) => void;
}

export default function SalesRegister({ onNavigate }: Props) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = mockInvoices.filter(inv => {
    if (statusFilter !== 'All' && inv.status !== statusFilter) return false;
    if (search && !inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) && !inv.customer.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-shrink-0">
        <Btn variant="primary" size="sm" onClick={() => onNavigate('sales-invoice')}>+ New Invoice</Btn>
        <div className="flex-1" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
          {['All', 'Draft', 'Unpaid', 'Paid', 'Overdue'].map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="relative">
          <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search invoices..."
            className="pl-6 pr-2 py-1 text-xs border border-gray-200 rounded w-44 focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
        <Btn variant="secondary" size="sm"><Download size={12} />Export</Btn>
        <Btn variant="secondary" size="sm"><Printer size={12} />Print</Btn>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Total Invoices', val: String(mockInvoices.length), color: 'border-l-blue-500' },
            { label: 'Total Amount', val: `Rs ${formatCurrency(mockInvoices.reduce((s, i) => s + i.grandTotal, 0))}`, color: 'border-l-green-500' },
            { label: 'Collected', val: `Rs ${formatCurrency(mockInvoices.reduce((s, i) => s + i.paidAmount, 0))}`, color: 'border-l-teal-500' },
            { label: 'Outstanding', val: `Rs ${formatCurrency(mockInvoices.reduce((s, i) => s + i.remainingBalance, 0))}`, color: 'border-l-red-500' },
          ].map(c => (
            <div key={c.label} className={`bg-white rounded border border-gray-200 border-l-4 ${c.color} p-3 shadow-sm`}>
              <div className="text-[10px] text-gray-500 uppercase font-medium mb-1">{c.label}</div>
              <div className="text-lg font-bold text-gray-900">{c.val}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  {['Invoice No', 'Date', 'Due Date', 'Customer', 'Terms', 'Subtotal', 'Tax', 'Grand Total', 'Paid', 'Balance', 'Status', 'Actions'].map(h => (
                    <th key={h} className="bg-gray-50 px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase border-b border-gray-200 whitespace-nowrap sticky top-0">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-3 py-1.5 border-b border-gray-100 font-medium text-blue-600">
                      <button onClick={() => onNavigate('sales-invoice')} className="hover:underline">{inv.invoiceNo}</button>
                    </td>
                    <td className="px-3 py-1.5 border-b border-gray-100 text-gray-600">{inv.date}</td>
                    <td className="px-3 py-1.5 border-b border-gray-100 text-gray-600">{inv.dueDate}</td>
                    <td className="px-3 py-1.5 border-b border-gray-100 font-medium text-gray-800 max-w-[160px]">
                      <div className="truncate">{inv.customer.name}</div>
                    </td>
                    <td className="px-3 py-1.5 border-b border-gray-100 text-gray-500">{inv.terms}</td>
                    <td className="px-3 py-1.5 border-b border-gray-100 text-right text-gray-700">Rs {formatCurrency(inv.subtotal)}</td>
                    <td className="px-3 py-1.5 border-b border-gray-100 text-right text-blue-600">Rs {formatCurrency(inv.taxTotal)}</td>
                    <td className="px-3 py-1.5 border-b border-gray-100 text-right font-semibold text-gray-900">Rs {formatCurrency(inv.grandTotal)}</td>
                    <td className="px-3 py-1.5 border-b border-gray-100 text-right text-green-700">
                      {inv.paidAmount > 0 ? `Rs ${formatCurrency(inv.paidAmount)}` : '--'}
                    </td>
                    <td className={`px-3 py-1.5 border-b border-gray-100 text-right font-semibold ${inv.remainingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {inv.remainingBalance > 0 ? `Rs ${formatCurrency(inv.remainingBalance)}` : 'Clear'}
                    </td>
                    <td className="px-3 py-1.5 border-b border-gray-100"><StatusBadge status={inv.status} /></td>
                    <td className="px-3 py-1.5 border-b border-gray-100">
                      <div className="flex gap-2">
                        <button onClick={() => onNavigate('sales-invoice')} className="text-[10px] text-blue-600 hover:underline">View</button>
                        <button className="text-[10px] text-gray-500 hover:underline">PDF</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
