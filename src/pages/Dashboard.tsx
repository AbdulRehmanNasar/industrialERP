import { FileText, Plus, UserPlus, Package, DollarSign, AlertTriangle, TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { KpiCard, StatusBadge, formatCurrency, formatCurrencyShort, Btn } from '../components/ui';
import { mockInvoices, mockPayments, salesChartData, cashFlowData } from '../data/mockData';
import type { NavPage } from '../types';

interface DashboardProps {
  onNavigate: (page: NavPage) => void;
}

function MiniBarChart({ data, xKey, bars }: { data: Record<string, unknown>[]; xKey: string; bars: { key: string; color: string }[] }) {
  const max = Math.max(...data.flatMap(d => bars.map(b => d[b.key] as number)));
  return (
    <div className="flex items-end gap-1.5 h-24">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
          <div className="flex items-end gap-0.5 h-20 w-full justify-center">
            {bars.map(b => (
              <div
                key={b.key}
                className={`flex-1 rounded-t-sm ${b.color} transition-all`}
                style={{ height: `${((d[b.key] as number) / max) * 100}%`, minHeight: 2 }}
                title={`${b.key}: ${formatCurrencyShort(d[b.key] as number)}`}
              />
            ))}
          </div>
          <span className="text-[9px] text-gray-400">{d[xKey] as string}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const overdueInvoices = mockInvoices.filter(i => i.status === 'Overdue');
  const recentInvoices = [...mockInvoices].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const recentPayments = [...mockPayments].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-4">
        <KpiCard label="Total Sales (Jan)" value="Rs 3.25M" sub="62 Invoices" trend={{ value: '12.5% vs Dec', up: true }} color="blue" />
        <KpiCard label="Monthly Revenue" value="Rs 2.89M" sub="Net of returns" trend={{ value: '8.2% vs Dec', up: true }} color="green" />
        <KpiCard label="Receivables" value="Rs 895K" sub="34 parties" trend={{ value: '5 overdue', up: false }} color="orange" />
        <KpiCard label="Customers" value="248" sub="12 new this month" trend={{ value: '4.9% growth', up: true }} color="teal" />
        <KpiCard label="Pending Payments" value="Rs 147K" sub="3 invoices" trend={{ value: 'Overdue: 1', up: false }} color="red" />
        <KpiCard label="Inventory Value" value="Rs 6.37M" sub="7 warehouses" trend={{ value: 'Low stock: 2', up: false }} color="blue" />
      </div>

      <div className="grid grid-cols-12 gap-3 mb-3">
        <div className="col-span-12 lg:col-span-5 bg-white rounded border border-gray-200 p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-700">Sales vs Expenses (6 months)</h3>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[10px] text-gray-500"><span className="w-2 h-2 bg-blue-500 rounded-sm inline-block"></span>Sales</span>
              <span className="flex items-center gap-1 text-[10px] text-gray-500"><span className="w-2 h-2 bg-red-400 rounded-sm inline-block"></span>Expenses</span>
            </div>
          </div>
          <MiniBarChart
            data={salesChartData as unknown as Record<string, unknown>[]}
            xKey="month"
            bars={[{ key: 'sales', color: 'bg-blue-500' }, { key: 'expenses', color: 'bg-red-300' }]}
          />
        </div>

        <div className="col-span-12 lg:col-span-3 bg-white rounded border border-gray-200 p-3 shadow-sm">
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Cash Flow (This Month)</h3>
          <MiniBarChart
            data={cashFlowData as unknown as Record<string, unknown>[]}
            xKey="week"
            bars={[{ key: 'inflow', color: 'bg-green-400' }, { key: 'outflow', color: 'bg-orange-400' }]}
          />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="bg-green-50 rounded p-1.5">
              <div className="text-[9px] text-green-600 font-medium uppercase">Total Inflow</div>
              <div className="text-xs font-bold text-green-700">Rs 2.54M</div>
            </div>
            <div className="bg-orange-50 rounded p-1.5">
              <div className="text-[9px] text-orange-600 font-medium uppercase">Total Outflow</div>
              <div className="text-xs font-bold text-orange-700">Rs 1.63M</div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-white rounded border border-gray-200 p-3 shadow-sm">
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Alerts & Notifications</h3>
          <div className="space-y-1.5">
            {overdueInvoices.map(inv => (
              <div key={inv.id} className="flex items-start gap-2 p-1.5 bg-red-50 rounded border border-red-100">
                <AlertTriangle size={12} className="text-red-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-red-700">Overdue: {inv.invoiceNo}</div>
                  <div className="text-[10px] text-red-600 truncate">{inv.customer.name} -- Rs {formatCurrency(inv.remainingBalance)}</div>
                </div>
              </div>
            ))}
            <div className="flex items-start gap-2 p-1.5 bg-yellow-50 rounded border border-yellow-100">
              <AlertCircle size={12} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-[10px] font-semibold text-yellow-700">Low Stock: PM-004 Pumice Gravel</div>
                <div className="text-[10px] text-yellow-600">Only 10 MT remaining (Min: 30 MT)</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-1.5 bg-yellow-50 rounded border border-yellow-100">
              <AlertCircle size={12} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-[10px] font-semibold text-yellow-700">Credit Limit Warning: Rauf & Sons</div>
                <div className="text-[10px] text-yellow-600">Rs 148K of Rs 150K limit utilized (98.7%)</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-1.5 bg-blue-50 rounded border border-blue-100">
              <CheckCircle size={12} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-[10px] font-semibold text-blue-700">Monthly Closing</div>
                <div className="text-[10px] text-blue-600">January 2024 accounts pending finalization</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 lg:col-span-3 bg-white rounded border border-gray-200 p-3 shadow-sm">
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Quick Actions</h3>
          <div className="space-y-1.5">
            <button onClick={() => onNavigate('sales-invoice')} className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors font-medium">
              <FileText size={13} /> New Sales Invoice
            </button>
            <button onClick={() => onNavigate('vouchers')} className="w-full flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-xs rounded hover:bg-gray-50 transition-colors">
              <Plus size={13} /> New Voucher
            </button>
            <button onClick={() => onNavigate('customers')} className="w-full flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-xs rounded hover:bg-gray-50 transition-colors">
              <UserPlus size={13} /> Add Customer
            </button>
            <button onClick={() => onNavigate('items')} className="w-full flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-xs rounded hover:bg-gray-50 transition-colors">
              <Package size={13} /> Add Item
            </button>
            <button onClick={() => onNavigate('payments')} className="w-full flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-xs rounded hover:bg-gray-50 transition-colors">
              <DollarSign size={13} /> Record Payment
            </button>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <h4 className="text-[10px] font-semibold text-gray-500 uppercase mb-1.5">Top Customers</h4>
            {[
              { name: 'Pakistan Cement Works', val: 850000 },
              { name: 'Al-Faisal Industries', val: 620000 },
              { name: 'Metro Construction', val: 490000 },
            ].map(c => (
              <div key={c.name} className="flex items-center justify-between py-1 text-[10px]">
                <span className="text-gray-600 truncate flex-1 mr-2">{c.name}</span>
                <span className="text-gray-800 font-semibold">{formatCurrencyShort(c.val)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 bg-white rounded border border-gray-200 shadow-sm">
          <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-700">Recent Invoices</h3>
            <button onClick={() => onNavigate('sales-register')} className="text-[10px] text-blue-600 hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-1.5 text-left text-gray-500 font-semibold border-b border-gray-100">Invoice</th>
                  <th className="px-3 py-1.5 text-left text-gray-500 font-semibold border-b border-gray-100">Party</th>
                  <th className="px-3 py-1.5 text-right text-gray-500 font-semibold border-b border-gray-100">Amount</th>
                  <th className="px-3 py-1.5 text-left text-gray-500 font-semibold border-b border-gray-100">Status</th>
                  <th className="px-3 py-1.5 text-left text-gray-500 font-semibold border-b border-gray-100">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-3 py-1.5 font-medium text-blue-600 border-b border-gray-50">{inv.invoiceNo}</td>
                    <td className="px-3 py-1.5 text-gray-600 border-b border-gray-50 max-w-[120px] truncate">{inv.customer.name}</td>
                    <td className="px-3 py-1.5 text-right text-gray-800 font-semibold border-b border-gray-50">Rs {formatCurrency(inv.grandTotal)}</td>
                    <td className="px-3 py-1.5 border-b border-gray-50"><StatusBadge status={inv.status} /></td>
                    <td className="px-3 py-1.5 text-gray-500 border-b border-gray-50">{inv.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-white rounded border border-gray-200 shadow-sm">
          <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-700">Recent Payments</h3>
            <button onClick={() => onNavigate('payments')} className="text-[10px] text-blue-600 hover:underline">View All</button>
          </div>
          <div className="p-2 space-y-1.5">
            {recentPayments.map(pmt => (
              <div key={pmt.id} className="flex items-center gap-2 p-1.5 rounded border border-gray-100">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${pmt.status === 'Completed' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                  {pmt.status === 'Completed'
                    ? <TrendingDown size={10} className="text-green-600" />
                    : <Clock size={10} className="text-yellow-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-semibold text-gray-700 truncate">{pmt.party}</div>
                  <div className="text-[9px] text-gray-400">{pmt.paymentId} -- {pmt.date}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[10px] font-bold text-green-700">Rs {formatCurrency(pmt.amount)}</div>
                  <StatusBadge status={pmt.status} />
                </div>
              </div>
            ))}
          </div>
          <div className="px-3 pt-2 pb-2 border-t border-gray-100">
            <h4 className="text-[10px] font-semibold text-gray-500 uppercase mb-1.5">Recent Activity</h4>
            <div className="space-y-1">
              {[
                { icon: <TrendingUp size={10} />, text: 'INV-2024-0891 created -- Al-Faisal', time: '2h ago', color: 'text-blue-500' },
                { icon: <CheckCircle size={10} />, text: 'PMT-001 received -- Pakistan Cement', time: '4h ago', color: 'text-green-500' },
                { icon: <FileText size={10} />, text: 'JV-002 posted by Admin', time: '6h ago', color: 'text-gray-500' },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10px]">
                  <span className={a.color}>{a.icon}</span>
                  <span className="text-gray-600 flex-1 truncate">{a.text}</span>
                  <span className="text-gray-400 flex-shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
