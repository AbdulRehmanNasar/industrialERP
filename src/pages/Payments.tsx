import { useState } from 'react';
import { Plus, Printer, RotateCcw, AlertTriangle } from 'lucide-react';
import { Btn, StatusBadge, formatCurrency } from '../components/ui';
import { mockPayments } from '../data/mockData';

export default function Payments() {
  const [methodFilter, setMethodFilter] = useState('All');
  const filtered = methodFilter === 'All' ? mockPayments : mockPayments.filter(p => p.paymentMethod === methodFilter);
  const totalCompleted = mockPayments.filter(p => p.status === 'Completed').reduce((s, p) => s + p.amount, 0);
  const totalPending = mockPayments.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-shrink-0">
        <Btn variant="primary" size="sm"><Plus size={12} />Record Payment</Btn>
        <div className="flex-1" />
        <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)}
          className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="All">All Methods</option><option>Cash</option><option>Bank Transfer</option><option>Cheque</option><option>Online</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Total Received', val: `Rs ${formatCurrency(totalCompleted)}`, color: 'border-l-green-500', textColor: 'text-green-700' },
            { label: 'Pending', val: `Rs ${formatCurrency(totalPending)}`, color: 'border-l-yellow-500', textColor: 'text-yellow-700' },
            { label: 'Transactions', val: String(mockPayments.length), color: 'border-l-blue-500', textColor: 'text-gray-800' },
            { label: 'Overdue Invoices', val: '1', color: 'border-l-red-500', textColor: 'text-red-600' },
          ].map(c => (
            <div key={c.label} className={`bg-white rounded border border-gray-200 border-l-4 ${c.color} p-3 shadow-sm`}>
              <div className="text-[10px] text-gray-500 uppercase font-medium mb-1">{c.label}</div>
              <div className={`text-xl font-bold ${c.textColor}`}>{c.val}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden mb-3">
          <div className="px-3 py-2 border-b border-gray-100"><h3 className="text-xs font-semibold text-gray-700">Payment Register</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr>
                {['Payment ID', 'Party', 'Invoice', 'Method', 'Amount', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="bg-gray-50 px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase border-b border-gray-200 whitespace-nowrap sticky top-0">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map(pmt => (
                  <tr key={pmt.id} className="hover:bg-gray-50">
                    <td className="px-3 py-1.5 border-b border-gray-100 font-medium text-blue-600">{pmt.paymentId}</td>
                    <td className="px-3 py-1.5 border-b border-gray-100 font-medium text-gray-800">{pmt.party}</td>
                    <td className="px-3 py-1.5 border-b border-gray-100 text-blue-600">{pmt.invoice}</td>
                    <td className="px-3 py-1.5 border-b border-gray-100">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${
                        pmt.paymentMethod === 'Bank Transfer' ? 'bg-blue-50 text-blue-700' :
                        pmt.paymentMethod === 'Cash' ? 'bg-green-50 text-green-700' :
                        pmt.paymentMethod === 'Cheque' ? 'bg-orange-50 text-orange-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{pmt.paymentMethod}</span>
                    </td>
                    <td className="px-3 py-1.5 border-b border-gray-100 text-right font-semibold text-green-700">Rs {formatCurrency(pmt.amount)}</td>
                    <td className="px-3 py-1.5 border-b border-gray-100"><StatusBadge status={pmt.status} /></td>
                    <td className="px-3 py-1.5 border-b border-gray-100 text-gray-500">{pmt.date}</td>
                    <td className="px-3 py-1.5 border-b border-gray-100">
                      <div className="flex gap-2">
                        <button className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"><Printer size={10} />Receipt</button>
                        <button className="text-[10px] text-orange-500 hover:underline flex items-center gap-0.5"><RotateCcw size={10} />Refund</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded border border-gray-200 shadow-sm p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={13} className="text-red-500" />
            <h3 className="text-xs font-semibold text-red-600">Overdue / Outstanding Balances</h3>
          </div>
          <table className="w-full text-xs">
            <thead><tr>
              {['Party', 'Invoice', 'Due Date', 'Amount', 'Days Overdue', 'Action'].map(h => (
                <th key={h} className="bg-red-50 px-3 py-1.5 text-left text-[10px] font-semibold text-red-500 uppercase border-b border-red-100">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              <tr className="hover:bg-red-50/50">
                <td className="px-3 py-1.5 border-b border-gray-100 font-medium text-gray-800">Rauf & Sons Trading</td>
                <td className="px-3 py-1.5 border-b border-gray-100 text-blue-600">INV-2024-0893</td>
                <td className="px-3 py-1.5 border-b border-gray-100 text-red-600 font-medium">2024-01-01</td>
                <td className="px-3 py-1.5 border-b border-gray-100 text-right font-bold text-red-700">Rs 147,950</td>
                <td className="px-3 py-1.5 border-b border-gray-100 text-center">
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[9px] font-bold">23 days</span>
                </td>
                <td className="px-3 py-1.5 border-b border-gray-100"><Btn variant="primary" size="xs">Record Payment</Btn></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
