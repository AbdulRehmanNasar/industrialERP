import { Download, Printer, FileText, BookOpen, BarChart2, Package, Users, TrendingUp } from 'lucide-react';
import { Btn, Input, Select, formatCurrency } from '../components/ui';

const reportCategories = [
  { icon: <FileText size={14} className="text-blue-500" />, title: 'Sales Reports', reports: ['Sales Summary', 'Sales by Customer', 'Sales by Item', 'Sales by Region', 'Sales Tax Register'] },
  { icon: <BookOpen size={14} className="text-green-500" />, title: 'Ledger Reports', reports: ['General Ledger', 'Party Ledger', 'Cash Book', 'Bank Book', 'Trial Balance'] },
  { icon: <BarChart2 size={14} className="text-orange-500" />, title: 'Tax Reports', reports: ['Sales Tax Return', 'Input Tax Summary', 'Output Tax Summary', 'Tax Reconciliation'] },
  { icon: <Package size={14} className="text-teal-500" />, title: 'Inventory Reports', reports: ['Stock Summary', 'Stock Ledger', 'Item Movement', 'Reorder Report', 'Batch Tracking'] },
  { icon: <Users size={14} className="text-blue-500" />, title: 'Customer Statements', reports: ['Customer Statement', 'Ageing Analysis', 'Outstanding Invoices', 'Payment History'] },
  { icon: <TrendingUp size={14} className="text-green-500" />, title: 'Financial Statements', reports: ['Profit & Loss', 'Balance Sheet', 'Cash Flow Statement', 'Income Statement'] },
];

export default function Reports() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
      <div className="bg-white rounded border border-gray-200 p-4 shadow-sm mb-4">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Quick Report</h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <Select label="Report Type">
            <option>Sales Summary</option><option>Party Ledger</option><option>Profit & Loss</option><option>Stock Summary</option><option>Trial Balance</option>
          </Select>
          <Input label="Date From" type="date" defaultValue="2024-01-01" />
          <Input label="Date To" type="date" defaultValue="2024-01-31" />
          <Select label="Party Filter"><option value="">All Parties</option><option>Al-Faisal Industries</option><option>Pakistan Cement Works</option></Select>
          <div className="flex gap-1.5">
            <Btn variant="primary" size="sm">Generate</Btn>
            <Btn variant="secondary" size="sm"><Download size={12} />PDF</Btn>
            <Btn variant="secondary" size="sm"><Download size={12} />Excel</Btn>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {reportCategories.map(cat => (
          <div key={cat.title} className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
              {cat.icon}
              <h3 className="text-xs font-semibold text-gray-700">{cat.title}</h3>
            </div>
            <div className="p-2 space-y-0.5">
              {cat.reports.map(r => (
                <div key={r} className="flex items-center justify-between px-2 py-1.5 hover:bg-gray-50 rounded group">
                  <span className="text-xs text-gray-700">{r}</span>
                  <div className="hidden group-hover:flex items-center gap-1.5">
                    <button className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"><FileText size={9} />View</button>
                    <button className="text-[10px] text-gray-500 hover:underline flex items-center gap-0.5"><Download size={9} />PDF</button>
                    <button className="text-[10px] text-gray-500 hover:underline flex items-center gap-0.5"><Printer size={9} />Print</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-gray-700">Profit & Loss -- January 2024 (Preview)</h3>
          <div className="flex gap-1.5">
            <Btn variant="secondary" size="xs"><Download size={10} />Excel</Btn>
            <Btn variant="secondary" size="xs"><Download size={10} />PDF</Btn>
            <Btn variant="secondary" size="xs"><Printer size={10} />Print</Btn>
          </div>
        </div>
        <div className="p-4">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-3">
              <div className="text-sm font-bold text-gray-900">PumiceERP Industrial Materials</div>
              <div className="text-[10px] text-gray-500">Profit & Loss Statement -- January 2024</div>
            </div>
            {[
              { section: 'REVENUE', items: [
                { label: 'Sales Revenue - Pumice Products', val: 2800000 },
                { label: 'Sales Revenue - Other', val: 450000 },
              ], total: 3250000, totalLabel: 'Gross Revenue', positive: true },
              { section: 'COST OF GOODS SOLD', items: [
                { label: 'Opening Stock', val: 6000000 },
                { label: 'Purchases', val: 850000 },
                { label: 'Less: Closing Stock', val: -6370000 },
              ], total: 480000, totalLabel: 'COGS', positive: false },
              { section: 'OPERATING EXPENSES', items: [
                { label: 'Salaries & Wages', val: 450000 },
                { label: 'Rent & Utilities', val: 180000 },
                { label: 'Transport & Logistics', val: 260000 },
              ], total: 890000, totalLabel: 'Total Expenses', positive: false },
            ].map(section => (
              <div key={section.section} className="mb-3">
                <div className="text-[10px] font-bold text-gray-500 uppercase border-b border-gray-200 pb-0.5 mb-1">{section.section}</div>
                {section.items.map(item => (
                  <div key={item.label} className="flex justify-between text-xs py-0.5">
                    <span className="text-gray-600 pl-4">{item.label}</span>
                    <span className="text-gray-800">{item.val < 0 ? '(' : ''}Rs {formatCurrency(Math.abs(item.val))}{item.val < 0 ? ')' : ''}</span>
                  </div>
                ))}
                <div className="flex justify-between text-xs font-semibold border-t border-gray-200 pt-1 mt-0.5">
                  <span className="text-gray-700">{section.totalLabel}</span>
                  <span className={section.positive ? 'text-green-700' : 'text-red-600'}>Rs {formatCurrency(section.total)}</span>
                </div>
              </div>
            ))}
            <div className="border-t-2 border-gray-300 pt-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-900">Net Profit</span>
                <span className="text-green-700">Rs {formatCurrency(3250000 - 480000 - 890000)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
