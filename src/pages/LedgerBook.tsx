import { useState } from 'react';
import { Search, Download, Printer, RefreshCw } from 'lucide-react';
import { Btn, Input, Select, StatusBadge, formatCurrency } from '../components/ui';
import { mockLedgerEntries, mockCustomers } from '../data/mockData';

export default function LedgerBook() {
  const [partyFilter, setPartyFilter] = useState('');
  const [voucherTypeFilter, setVoucherTypeFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState('2024-01-31');
  const [search, setSearch] = useState('');

  const filtered = mockLedgerEntries.filter(e => {
    if (voucherTypeFilter !== 'All' && e.voucherType !== voucherTypeFilter) return false;
    if (search && !e.narration.toLowerCase().includes(search.toLowerCase()) && !e.voucherNo.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalDebit = filtered.reduce((s, e) => s + e.debit, 0);
  const totalCredit = filtered.reduce((s, e) => s + e.credit, 0);
  const openingBalance = 500000;
  const closingBalance = openingBalance + totalDebit - totalCredit;

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex-shrink-0">
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] font-medium text-gray-600 uppercase tracking-wide">Party</label>
            <select
              value={partyFilter}
              onChange={e => setPartyFilter(e.target.value)}
              className="border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
            >
              <option value="">All Parties</option>
              {mockCustomers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <Input label="Date From" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          <Input label="Date To" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          <Select label="Voucher Type" value={voucherTypeFilter} onChange={e => setVoucherTypeFilter(e.target.value)}>
            <option value="All">All Types</option>
            <option value="JV">Journal Voucher (JV)</option>
            <option value="SV">Sales Voucher (SV)</option>
            <option value="PV">Payment Voucher (PV)</option>
            <option value="RV">Receipt Voucher (RV)</option>
            <option value="OP">Opening (OP)</option>
          </Select>
          <div className="flex gap-1.5 items-end pb-0">
            <Btn variant="primary" size="sm"><Search size={12} />Search</Btn>
            <Btn variant="secondary" size="sm"><RefreshCw size={12} />Reset</Btn>
            <Btn variant="secondary" size="sm"><Download size={12} />Excel</Btn>
            <Btn variant="secondary" size="sm"><Download size={12} />PDF</Btn>
            <Btn variant="secondary" size="sm"><Printer size={12} />Print</Btn>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Opening Balance', val: openingBalance, cls: 'text-gray-800', border: 'border-l-gray-400' },
            { label: 'Total Debit', val: totalDebit, cls: 'text-blue-700', border: 'border-l-blue-500' },
            { label: 'Total Credit', val: totalCredit, cls: 'text-green-700', border: 'border-l-green-500' },
            { label: 'Closing Balance', val: closingBalance, cls: closingBalance >= 0 ? 'text-gray-900' : 'text-red-700', border: closingBalance >= 0 ? 'border-l-gray-500' : 'border-l-red-500' },
          ].map(c => (
            <div key={c.label} className={`bg-white rounded border border-gray-200 border-l-4 ${c.border} p-3 shadow-sm`}>
              <div className="text-[10px] text-gray-500 uppercase font-medium mb-1">{c.label}</div>
              <div className={`text-lg font-bold ${c.cls}`}>Rs {formatCurrency(c.val)}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-2">
            <h3 className="text-xs font-semibold text-gray-700 flex-1">Ledger Transactions</h3>
            <div className="relative">
              <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search narration, voucher..."
                className="pl-6 pr-2 py-1 text-[10px] border border-gray-200 rounded w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <span className="text-[10px] text-gray-500">{filtered.length} records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  {['Voucher No', 'Type', 'Date', 'Narration', 'Debit (Dr)', 'Credit (Cr)', 'Running Balance', 'Created By', 'Actions'].map(h => (
                    <th key={h} className="bg-gray-50 px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase border-b border-gray-200 whitespace-nowrap sticky top-0">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry, i) => (
                  <tr key={entry.id} className={`hover:bg-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                    <td className="px-3 py-1.5 border-b border-gray-100 font-medium text-blue-600 cursor-pointer hover:underline">{entry.voucherNo}</td>
                    <td className="px-3 py-1.5 border-b border-gray-100">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                        entry.voucherType === 'SV' ? 'bg-blue-100 text-blue-700' :
                        entry.voucherType === 'RV' ? 'bg-green-100 text-green-700' :
                        entry.voucherType === 'PV' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{entry.voucherType}</span>
                    </td>
                    <td className="px-3 py-1.5 border-b border-gray-100 text-gray-600">{entry.date}</td>
                    <td className="px-3 py-1.5 border-b border-gray-100 text-gray-700 max-w-xs"><div className="truncate">{entry.narration}</div></td>
                    <td className="px-3 py-1.5 border-b border-gray-100 text-right">
                      {entry.debit > 0 ? <span className="font-semibold text-blue-700">Rs {formatCurrency(entry.debit)}</span> : <span className="text-gray-300">--</span>}
                    </td>
                    <td className="px-3 py-1.5 border-b border-gray-100 text-right">
                      {entry.credit > 0 ? <span className="font-semibold text-green-700">Rs {formatCurrency(entry.credit)}</span> : <span className="text-gray-300">--</span>}
                    </td>
                    <td className="px-3 py-1.5 border-b border-gray-100 text-right">
                      <span className={`font-bold ${entry.runningBalance >= 0 ? 'text-gray-800' : 'text-red-600'}`}>
                        Rs {formatCurrency(entry.runningBalance)}
                      </span>
                      <span className="text-[9px] text-gray-400 ml-1">{entry.runningBalance >= 0 ? 'Dr' : 'Cr'}</span>
                    </td>
                    <td className="px-3 py-1.5 border-b border-gray-100 text-gray-500">{entry.createdBy}</td>
                    <td className="px-3 py-1.5 border-b border-gray-100">
                      <button className="text-[10px] text-blue-600 hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100">
                  <td colSpan={4} className="px-3 py-2 text-xs font-semibold text-gray-700 border-t border-gray-300">Totals</td>
                  <td className="px-3 py-2 text-right border-t border-gray-300"><span className="font-bold text-blue-700 text-xs">Rs {formatCurrency(totalDebit)}</span></td>
                  <td className="px-3 py-2 text-right border-t border-gray-300"><span className="font-bold text-green-700 text-xs">Rs {formatCurrency(totalCredit)}</span></td>
                  <td colSpan={3} className="px-3 py-2 border-t border-gray-300"></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-between bg-white">
            <span className="text-[10px] text-gray-500">Showing {filtered.length} of {mockLedgerEntries.length} entries</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map(p => (
                <button key={p} className={`w-6 h-6 text-[10px] rounded ${p === 1 ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          {[
            { title: 'Debit vs Credit Trend', data: [
              { label: 'W1', dr: 393065, cr: 0 },
              { label: 'W2', dr: 311220, cr: 311220 },
              { label: 'W3', dr: 157950, cr: 70000 },
              { label: 'W4', dr: 0, cr: 45000 },
            ]},
            { title: 'Running Balance', data: [
              { label: '01/01', dr: 500000, cr: 0 },
              { label: '01/15', dr: 893065, cr: 0 },
              { label: '01/16', dr: 893065, cr: 0 },
              { label: '01/20', dr: 981015, cr: 0 },
            ]},
          ].map(chart => (
            <div key={chart.title} className="bg-white rounded border border-gray-200 p-3 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-700 mb-3">{chart.title}</h3>
              <div className="flex items-end gap-2 h-20">
                {chart.data.map(d => {
                  const max = Math.max(...chart.data.map(x => Math.max(x.dr, x.cr)));
                  return (
                    <div key={d.label} className="flex-1 flex flex-col items-center gap-0.5">
                      <div className="flex items-end gap-0.5 h-16 w-full justify-center">
                        <div className="flex-1 bg-blue-400 rounded-t-sm" style={{ height: `${(d.dr / max) * 100}%`, minHeight: d.dr > 0 ? 2 : 0 }} />
                        {d.cr > 0 && <div className="flex-1 bg-green-400 rounded-t-sm" style={{ height: `${(d.cr / max) * 100}%` }} />}
                      </div>
                      <span className="text-[9px] text-gray-400">{d.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
