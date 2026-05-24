import { useState } from 'react';
import { Plus, Search, Download, Upload, X, Eye } from 'lucide-react';
import { Btn, Input, Select, StatusBadge, formatCurrency } from '../components/ui';
import { mockCustomers, mockInvoices, mockPayments } from '../data/mockData';
import type { Customer } from '../types';

function CustomerDrawer({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const [tab, setTab] = useState<'info' | 'ledger' | 'invoices' | 'payments' | 'notes'>('info');
  const tabs = ['info', 'ledger', 'invoices', 'payments', 'notes'] as const;
  const customerInvoices = mockInvoices.filter(i => i.customer.id === customer.id);

  return (
    <div className="fixed inset-0 z-30 flex justify-end" onClick={onClose}>
      <div className="w-[520px] bg-white shadow-2xl flex flex-col h-full" onClick={e => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div>
            <div className="text-sm font-bold text-gray-900">{customer.name}</div>
            <div className="text-[10px] text-gray-500">{customer.partyCode} -- {customer.phone}</div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={customer.status} />
            <button onClick={onClose} className="p-1 rounded hover:bg-gray-200 text-gray-500"><X size={14} /></button>
          </div>
        </div>
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-2 text-[10px] font-medium capitalize border-b-2 transition-colors ${
                  tab === t ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}>
                {t === 'info' ? 'General Info' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'info' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Party Code" defaultValue={customer.partyCode} />
                <Input label="Full Name" defaultValue={customer.name} />
                <Input label="Phone" defaultValue={customer.phone} />
                <Input label="Email" defaultValue={customer.email ?? ''} placeholder="Email address" />
                <Input label="NTN" defaultValue={customer.ntn} />
                <Select label="Status" defaultValue={customer.status}><option>Active</option><option>Inactive</option></Select>
                <div className="col-span-2"><Input label="Address" defaultValue={customer.address} /></div>
                <div className="flex flex-col gap-0.5">
                  <label className="text-[10px] font-medium text-gray-600 uppercase tracking-wide">Credit Limit</label>
                  <input type="number" defaultValue={customer.creditLimit} className="border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <label className="text-[10px] font-medium text-gray-600 uppercase tracking-wide">Outstanding Balance</label>
                  <input readOnly value={formatCurrency(customer.outstandingBalance)} className="border border-gray-200 rounded px-2.5 py-1.5 text-xs bg-gray-50" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Btn variant="primary" size="sm">Save Changes</Btn>
                <Btn variant="danger" size="sm">Disable Customer</Btn>
              </div>
            </div>
          )}
          {tab === 'ledger' && (
            <div className="text-xs text-gray-400 text-center py-8">No ledger entries found for this view</div>
          )}
          {tab === 'invoices' && (
            customerInvoices.length === 0 ? <div className="text-xs text-gray-400 text-center py-8">No invoices found</div> : (
              <table className="w-full text-[10px]">
                <thead><tr className="bg-gray-50">
                  <th className="px-2 py-1.5 text-left text-gray-500 border-b border-gray-200">Invoice</th>
                  <th className="px-2 py-1.5 text-left text-gray-500 border-b border-gray-200">Date</th>
                  <th className="px-2 py-1.5 text-right text-gray-500 border-b border-gray-200">Amount</th>
                  <th className="px-2 py-1.5 text-left text-gray-500 border-b border-gray-200">Status</th>
                </tr></thead>
                <tbody>
                  {customerInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-gray-50 border-b border-gray-100">
                      <td className="px-2 py-1 font-medium text-blue-600">{inv.invoiceNo}</td>
                      <td className="px-2 py-1 text-gray-500">{inv.date}</td>
                      <td className="px-2 py-1 text-right font-semibold text-gray-800">Rs {formatCurrency(inv.grandTotal)}</td>
                      <td className="px-2 py-1"><StatusBadge status={inv.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
          {tab === 'payments' && (
            <table className="w-full text-[10px]">
              <thead><tr className="bg-gray-50">
                <th className="px-2 py-1.5 text-left text-gray-500 border-b border-gray-200">Payment ID</th>
                <th className="px-2 py-1.5 text-left text-gray-500 border-b border-gray-200">Date</th>
                <th className="px-2 py-1.5 text-right text-gray-500 border-b border-gray-200">Amount</th>
                <th className="px-2 py-1.5 text-left text-gray-500 border-b border-gray-200">Method</th>
              </tr></thead>
              <tbody>
                {mockPayments.filter(p => p.party === customer.name).map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 border-b border-gray-100">
                    <td className="px-2 py-1 font-medium text-blue-600">{p.paymentId}</td>
                    <td className="px-2 py-1 text-gray-500">{p.date}</td>
                    <td className="px-2 py-1 text-right font-semibold text-green-700">Rs {formatCurrency(p.amount)}</td>
                    <td className="px-2 py-1 text-gray-600">{p.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === 'notes' && (
            <textarea placeholder="Add notes about this customer..." rows={8}
              className="w-full border border-gray-200 rounded p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function Customers() {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filtered = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.partyCode.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-shrink-0">
        <Btn variant="primary" size="sm"><Plus size={12} />Add Customer</Btn>
        <Btn variant="secondary" size="sm"><Upload size={12} />Import</Btn>
        <Btn variant="secondary" size="sm"><Download size={12} />Export</Btn>
        <div className="flex-1" />
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, code, phone..."
            className="pl-7 pr-3 py-1 text-xs border border-gray-200 rounded w-56 focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Total Customers', val: String(mockCustomers.length), color: 'border-l-blue-500' },
            { label: 'Active', val: String(mockCustomers.filter(c => c.status === 'Active').length), color: 'border-l-green-500' },
            { label: 'Total Outstanding', val: `Rs ${formatCurrency(mockCustomers.reduce((s, c) => s + c.outstandingBalance, 0))}`, color: 'border-l-orange-500' },
            { label: 'Credit Limit Utilized', val: '67%', color: 'border-l-red-500' },
          ].map(c => (
            <div key={c.label} className={`bg-white rounded border border-gray-200 border-l-4 ${c.color} p-3 shadow-sm`}>
              <div className="text-[10px] text-gray-500 uppercase font-medium mb-1">{c.label}</div>
              <div className="text-lg font-bold text-gray-900">{c.val}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-100"><span className="text-xs font-semibold text-gray-700">{filtered.length} customers</span></div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr>
                {['Party Code', 'Name', 'Address', 'Phone', 'NTN', 'Credit Limit', 'Outstanding', 'Utilization', 'Status', 'Actions'].map(h => (
                  <th key={h} className="bg-gray-50 px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase border-b border-gray-200 whitespace-nowrap sticky top-0">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map(c => {
                  const utilization = c.creditLimit > 0 ? (c.outstandingBalance / c.creditLimit) * 100 : 0;
                  return (
                    <tr key={c.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedCustomer(c)}>
                      <td className="px-3 py-1.5 border-b border-gray-100 font-medium text-blue-600">{c.partyCode}</td>
                      <td className="px-3 py-1.5 border-b border-gray-100 font-medium text-gray-800">{c.name}</td>
                      <td className="px-3 py-1.5 border-b border-gray-100 text-gray-500 max-w-[160px]"><div className="truncate">{c.address}</div></td>
                      <td className="px-3 py-1.5 border-b border-gray-100 text-gray-600">{c.phone}</td>
                      <td className="px-3 py-1.5 border-b border-gray-100 text-gray-500">{c.ntn}</td>
                      <td className="px-3 py-1.5 border-b border-gray-100 text-right font-medium text-gray-800">Rs {formatCurrency(c.creditLimit)}</td>
                      <td className={`px-3 py-1.5 border-b border-gray-100 text-right font-semibold ${c.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {c.outstandingBalance > 0 ? `Rs ${formatCurrency(c.outstandingBalance)}` : '--'}
                      </td>
                      <td className="px-3 py-1.5 border-b border-gray-100 w-24">
                        <div className="flex items-center gap-1.5">
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${utilization > 90 ? 'bg-red-500' : utilization > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                              style={{ width: `${Math.min(100, utilization)}%` }} />
                          </div>
                          <span className="text-[9px] text-gray-500 w-7">{Math.round(utilization)}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-1.5 border-b border-gray-100"><StatusBadge status={c.status} /></td>
                      <td className="px-3 py-1.5 border-b border-gray-100" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedCustomer(c)} className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"><Eye size={10} />View</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {selectedCustomer && <CustomerDrawer customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />}
    </div>
  );
}
