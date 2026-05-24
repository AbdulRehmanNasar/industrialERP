import { useState } from 'react';
import { Plus, ChevronRight, ChevronDown } from 'lucide-react';
import { Btn, StatusBadge, formatCurrency } from '../components/ui';
import { mockAccounts } from '../data/mockData';
import type { Account } from '../types';

function AccountRow({ account, depth = 0 }: { account: Account; depth?: number }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = account.children && account.children.length > 0;
  const typeColor: Record<string, string> = {
    Assets: 'text-blue-700 bg-blue-50', Liabilities: 'text-red-700 bg-red-50',
    Income: 'text-green-700 bg-green-50', Expenses: 'text-orange-700 bg-orange-50',
    Equity: 'text-teal-700 bg-teal-50',
  };

  return (
    <>
      <tr className={`hover:bg-gray-50 ${depth === 0 ? 'bg-gray-50/80 font-semibold' : ''}`}>
        <td className="px-3 py-1.5 border-b border-gray-100" style={{ paddingLeft: `${12 + depth * 20}px` }}>
          <div className="flex items-center gap-1.5">
            {hasChildren ? (
              <button onClick={() => setExpanded(p => !p)} className="text-gray-400 hover:text-gray-600 w-4">
                {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>
            ) : <span className="w-4" />}
            <span className={`text-xs ${depth === 0 ? 'text-gray-800 font-semibold' : 'text-blue-600'}`}>{account.accountCode}</span>
          </div>
        </td>
        <td className="px-3 py-1.5 border-b border-gray-100">
          <span className={`text-xs ${depth === 0 ? 'text-gray-800 font-semibold' : 'text-gray-700'}`}>{account.accountName}</span>
        </td>
        <td className="px-3 py-1.5 border-b border-gray-100 text-xs text-gray-500">{account.parentAccount || '--'}</td>
        <td className="px-3 py-1.5 border-b border-gray-100">
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${typeColor[account.type] ?? 'bg-gray-100 text-gray-600'}`}>{account.type}</span>
        </td>
        <td className={`px-3 py-1.5 border-b border-gray-100 text-right text-xs font-semibold ${
          account.type === 'Liabilities' || account.type === 'Expenses' ? 'text-red-600' : 'text-green-700'
        }`}>Rs {formatCurrency(account.balance)}</td>
        <td className="px-3 py-1.5 border-b border-gray-100"><StatusBadge status={account.status} /></td>
        <td className="px-3 py-1.5 border-b border-gray-100">
          <div className="flex gap-2">
            <button className="text-[10px] text-blue-600 hover:underline">Edit</button>
            {depth > 0 && <button className="text-[10px] text-gray-500 hover:underline">Ledger</button>}
          </div>
        </td>
      </tr>
      {hasChildren && expanded && account.children!.map(child => (
        <AccountRow key={child.id} account={child} depth={depth + 1} />
      ))}
    </>
  );
}

export default function ChartOfAccounts() {
  const totalAssets = mockAccounts.find(a => a.type === 'Assets')?.balance ?? 0;
  const totalLiabilities = mockAccounts.find(a => a.type === 'Liabilities')?.balance ?? 0;
  const totalEquity = mockAccounts.find(a => a.type === 'Equity')?.balance ?? 0;
  const totalIncome = mockAccounts.find(a => a.type === 'Income')?.balance ?? 0;
  const totalExpenses = mockAccounts.find(a => a.type === 'Expenses')?.balance ?? 0;

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-shrink-0">
        <Btn variant="primary" size="sm"><Plus size={12} />Add Account</Btn>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-5 gap-3 mb-4">
          {[
            { label: 'Total Assets', val: totalAssets, color: 'border-l-blue-500', textColor: 'text-blue-700' },
            { label: 'Total Liabilities', val: totalLiabilities, color: 'border-l-red-500', textColor: 'text-red-700' },
            { label: 'Total Equity', val: totalEquity, color: 'border-l-teal-500', textColor: 'text-teal-700' },
            { label: 'Total Income', val: totalIncome, color: 'border-l-green-500', textColor: 'text-green-700' },
            { label: 'Total Expenses', val: totalExpenses, color: 'border-l-orange-500', textColor: 'text-orange-700' },
          ].map(c => (
            <div key={c.label} className={`bg-white rounded border border-gray-200 border-l-4 ${c.color} p-3 shadow-sm`}>
              <div className="text-[10px] text-gray-500 uppercase font-medium mb-1">{c.label}</div>
              <div className={`text-base font-bold ${c.textColor}`}>Rs {(c.val / 1000000).toFixed(2)}M</div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-700">Account Hierarchy</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500">Net P&L: </span>
              <span className={`text-[10px] font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                Rs {formatCurrency(totalIncome - totalExpenses)}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr>
                {['Account Code', 'Account Name', 'Parent', 'Type', 'Balance', 'Status', 'Actions'].map(h => (
                  <th key={h} className="bg-gray-50 px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase border-b border-gray-200 whitespace-nowrap sticky top-0">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {mockAccounts.map(account => <AccountRow key={account.id} account={account} />)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
