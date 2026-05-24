import { useState } from 'react';
import { Plus, Trash2, Save, Printer, CheckSquare } from 'lucide-react';
import { Btn, Input, Select, StatusBadge, formatCurrency } from '../components/ui';
import { mockVouchers, mockAccounts } from '../data/mockData';
import type { Voucher, VoucherEntry, VoucherType } from '../types';

const allAccounts = mockAccounts.flatMap(a => [a, ...(a.children ?? [])]);

function VoucherForm({ voucher, onClose }: { voucher?: Voucher; onClose: () => void }) {
  const [type, setType] = useState<VoucherType>(voucher?.type ?? 'JV');
  const [entries, setEntries] = useState<VoucherEntry[]>(voucher?.entries ?? [
    { id: '1', account: '', party: '', description: '', debit: 0, credit: 0 },
    { id: '2', account: '', party: '', description: '', debit: 0, credit: 0 },
  ]);

  const totalDebit = entries.reduce((s, e) => s + e.debit, 0);
  const totalCredit = entries.reduce((s, e) => s + e.credit, 0);
  const difference = totalDebit - totalCredit;
  const balanced = Math.abs(difference) < 0.01;

  const addEntry = () => setEntries(p => [...p, { id: String(p.length + 1), account: '', party: '', description: '', debit: 0, credit: 0 }]);
  const removeEntry = (idx: number) => setEntries(p => p.filter((_, i) => i !== idx));
  const updateEntry = (idx: number, key: keyof VoucherEntry, val: string | number) => {
    setEntries(p => { const n = [...p]; n[idx] = { ...n[idx], [key]: val }; return n; });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded border border-gray-200 p-4 mb-3 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-3">
            {voucher ? `Edit Voucher -- ${voucher.voucherNo}` : 'New Voucher'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <Input label="Voucher No" defaultValue={voucher?.voucherNo ?? 'JV-003'} readOnly className="bg-gray-50" />
            <Select label="Type" value={type} onChange={e => setType(e.target.value as VoucherType)}>
              <option value="JV">Journal (JV)</option>
              <option value="SV">Sales (SV)</option>
              <option value="PV">Payment (PV)</option>
              <option value="RV">Receipt (RV)</option>
              <option value="OP">Opening (OP)</option>
            </Select>
            <Input label="Date" type="date" defaultValue={voucher?.date ?? '2024-01-24'} />
            <Input label="Reference No" defaultValue={voucher?.referenceNo} placeholder="Ref / PO No" />
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-medium text-gray-600 uppercase tracking-wide">Status</label>
              <StatusBadge status={voucher?.status ?? 'Draft'} />
            </div>
          </div>
          <div className="mt-2">
            <label className="text-[10px] font-medium text-gray-600 uppercase tracking-wide block mb-0.5">Narration</label>
            <textarea
              defaultValue={voucher?.narration}
              placeholder="Voucher narration / description"
              rows={2}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        <div className="bg-white rounded border border-gray-200 shadow-sm mb-3">
          <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Voucher Entries</h3>
            <Btn variant="secondary" size="xs" onClick={addEntry}><Plus size={11} />Add Line</Btn>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  {['Account', 'Party', 'Description', 'Debit (Dr)', 'Credit (Cr)', ''].map(h => (
                    <th key={h} className="bg-gray-50 px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase border-b border-gray-200 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr key={idx} className="group hover:bg-blue-50/30">
                    <td className="px-2 py-1.5 border-b border-gray-100 min-w-[200px]">
                      <select
                        value={entry.account}
                        onChange={e => updateEntry(idx, 'account', e.target.value)}
                        className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select Account</option>
                        {allAccounts.filter(a => a.accountCode.length > 3).map(a => (
                          <option key={a.id} value={`${a.accountCode} - ${a.accountName}`}>
                            {a.accountCode} - {a.accountName}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-1.5 border-b border-gray-100 min-w-[140px]">
                      <input value={entry.party} onChange={e => updateEntry(idx, 'party', e.target.value)}
                        placeholder="Party name"
                        className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </td>
                    <td className="px-2 py-1.5 border-b border-gray-100 min-w-[180px]">
                      <input value={entry.description} onChange={e => updateEntry(idx, 'description', e.target.value)}
                        placeholder="Description"
                        className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </td>
                    <td className="px-2 py-1.5 border-b border-gray-100 w-32">
                      <input type="number" value={entry.debit || ''}
                        onChange={e => updateEntry(idx, 'debit', parseFloat(e.target.value) || 0)}
                        className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-right focus:outline-none focus:ring-1 focus:ring-blue-500 text-blue-700 font-medium"
                        placeholder="0.00" />
                    </td>
                    <td className="px-2 py-1.5 border-b border-gray-100 w-32">
                      <input type="number" value={entry.credit || ''}
                        onChange={e => updateEntry(idx, 'credit', parseFloat(e.target.value) || 0)}
                        className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-right focus:outline-none focus:ring-1 focus:ring-blue-500 text-green-700 font-medium"
                        placeholder="0.00" />
                    </td>
                    <td className="px-2 py-1.5 border-b border-gray-100 w-8">
                      {entries.length > 2 && (
                        <button onClick={() => removeEntry(idx)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-0.5">
                          <Trash2 size={12} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-3 py-2 text-xs font-semibold text-gray-700 border-t border-gray-300">Totals</td>
                  <td className="px-3 py-2 text-right border-t border-gray-300"><span className="font-bold text-blue-700 text-xs">Rs {formatCurrency(totalDebit)}</span></td>
                  <td className="px-3 py-2 text-right border-t border-gray-300"><span className="font-bold text-green-700 text-xs">Rs {formatCurrency(totalCredit)}</span></td>
                  <td className="border-t border-gray-300"></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
            <div className={`px-2 py-1 rounded text-[10px] font-semibold ${balanced ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {balanced ? 'Balanced' : `Difference: Rs ${formatCurrency(Math.abs(difference))}`}
            </div>
            <div className="flex-1" />
            <Btn variant="secondary" size="sm" onClick={onClose}>Cancel</Btn>
            <Btn variant="secondary" size="sm"><Save size={12} />Save Draft</Btn>
            <Btn variant="primary" size="sm" className={!balanced ? 'opacity-50 cursor-not-allowed' : ''}>
              <CheckSquare size={12} />Post Voucher
            </Btn>
            <Btn variant="secondary" size="sm"><Printer size={12} />Print</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Vouchers() {
  const [view, setView] = useState<'list' | 'new' | { voucher: Voucher }>('list');

  if (view === 'new') return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-shrink-0">
        <button onClick={() => setView('list')} className="text-xs text-blue-600 hover:underline">-- Voucher List</button>
        <span className="text-gray-300">/</span>
        <span className="text-xs text-gray-600">New Voucher</span>
      </div>
      <VoucherForm onClose={() => setView('list')} />
    </div>
  );

  if (typeof view === 'object') return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-shrink-0">
        <button onClick={() => setView('list')} className="text-xs text-blue-600 hover:underline">-- Voucher List</button>
        <span className="text-gray-300">/</span>
        <span className="text-xs text-gray-600">{view.voucher.voucherNo}</span>
      </div>
      <VoucherForm voucher={view.voucher} onClose={() => setView('list')} />
    </div>
  );

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-shrink-0">
        <Btn variant="primary" size="sm" onClick={() => setView('new')}><Plus size={12} />New Voucher</Btn>
        <div className="flex-1" />
        <span className="text-[10px] text-gray-500">{mockVouchers.length} vouchers</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Journal Vouchers', count: 2, color: 'border-l-gray-500' },
            { label: 'Sales Vouchers', count: 3, color: 'border-l-blue-500' },
            { label: 'Payment Vouchers', count: 1, color: 'border-l-orange-500' },
            { label: 'Receipt Vouchers', count: 2, color: 'border-l-green-500' },
          ].map(c => (
            <div key={c.label} className={`bg-white rounded border border-gray-200 border-l-4 ${c.color} p-3 shadow-sm`}>
              <div className="text-[10px] text-gray-500 uppercase font-medium">{c.label}</div>
              <div className="text-xl font-bold text-gray-900">{c.count}</div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-100"><h3 className="text-xs font-semibold text-gray-700">All Vouchers</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  {['Voucher No', 'Type', 'Date', 'Reference', 'Narration', 'Total Debit', 'Total Credit', 'Status', 'Actions'].map(h => (
                    <th key={h} className="bg-gray-50 px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase border-b border-gray-200 whitespace-nowrap sticky top-0">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockVouchers.map(v => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-3 py-1.5 border-b border-gray-100 font-medium text-blue-600">
                      <button onClick={() => setView({ voucher: v })} className="hover:underline">{v.voucherNo}</button>
                    </td>
                    <td className="px-3 py-1.5 border-b border-gray-100">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                        v.type === 'SV' ? 'bg-blue-100 text-blue-700' :
                        v.type === 'RV' ? 'bg-green-100 text-green-700' :
                        v.type === 'PV' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{v.type}</span>
                    </td>
                    <td className="px-3 py-1.5 border-b border-gray-100 text-gray-600">{v.date}</td>
                    <td className="px-3 py-1.5 border-b border-gray-100 text-gray-500">{v.referenceNo}</td>
                    <td className="px-3 py-1.5 border-b border-gray-100 text-gray-700 max-w-xs"><div className="truncate">{v.narration}</div></td>
                    <td className="px-3 py-1.5 border-b border-gray-100 text-right font-semibold text-blue-700">Rs {formatCurrency(v.totalDebit)}</td>
                    <td className="px-3 py-1.5 border-b border-gray-100 text-right font-semibold text-green-700">Rs {formatCurrency(v.totalCredit)}</td>
                    <td className="px-3 py-1.5 border-b border-gray-100"><StatusBadge status={v.status} /></td>
                    <td className="px-3 py-1.5 border-b border-gray-100">
                      <div className="flex gap-2">
                        <button onClick={() => setView({ voucher: v })} className="text-[10px] text-blue-600 hover:underline">Edit</button>
                        <button className="text-[10px] text-gray-500 hover:underline">Print</button>
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
