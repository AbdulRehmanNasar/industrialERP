import { useState } from 'react';
import { Plus, Trash2, Save, Printer, Mail, FileDown, X, Eye, Search, ChevronDown } from 'lucide-react';
import { Btn, Input, Select, StatusBadge, formatCurrency } from '../components/ui';
import { mockCustomers, mockItems } from '../data/mockData';
import type { InvoiceItem, InvoiceStatus, PaymentTerms } from '../types';
import toast from 'react-hot-toast';

const emptyItem = (): InvoiceItem => ({
  srNo: 1, itemCode: '', description: '', unit: 'MT', quantity: 0, rate: 0,
  discountPct: 0, valueExclTax: 0, taxPct: 17, taxAmount: 0, valueInclTax: 0,
  warehouse: 'WH-01', batchNo: '',
});

export default function SalesInvoice() {
  const [status, setStatus] = useState<InvoiceStatus>('Draft');
  const [terms, setTerms] = useState<PaymentTerms>('Credit');
  const [customerId, setCustomerId] = useState('1');
  const [items, setItems] = useState<InvoiceItem[]>([{ ...emptyItem() }]);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [savedInvoice, setSavedInvoice] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);


  const handleSave = () => {
  const invoiceData = {
    invoiceNo: 'INV-2024-0894',
    customer,
    items,
    subtotal,
    discountTotal,
    taxTotal,
    grandTotal,
    paidAmount,
    remaining,
    status,
    terms,
    savedAt: new Date().toLocaleString(),
  };

  localStorage.setItem(
    'latestInvoice',
    JSON.stringify(invoiceData)
  );

  setSavedInvoice(invoiceData);
  setShowPreview(true);

  toast.success("Invoice saved successfully!");

};

  const customer = mockCustomers.find(c => c.id === customerId) ?? mockCustomers[0];

  const calcItem = (item: InvoiceItem): InvoiceItem => {
    const valueExclTax = item.quantity * item.rate * (1 - item.discountPct / 100);
    const taxAmount = valueExclTax * (item.taxPct / 100);
    return { ...item, valueExclTax, taxAmount, valueInclTax: valueExclTax + taxAmount };
  };

  const updateItem = (idx: number, key: keyof InvoiceItem, val: string | number) => {
    setItems(prev => {
      const next = [...prev];
      next[idx] = calcItem({ ...next[idx], [key]: val });
      return next;
    });
  };

  console.log("FORCE VERCEL TEST 123");

  const addRow = () => setItems(prev => [...prev, { ...emptyItem(), srNo: prev.length + 1 }]);
  const removeRow = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx).map((it, i) => ({ ...it, srNo: i + 1 })));

  const subtotal = items.reduce((s, i) => s + i.quantity * i.rate, 0);
  const discountTotal = items.reduce((s, i) => s + (i.quantity * i.rate * i.discountPct / 100), 0);
  const taxTotal = items.reduce((s, i) => s + i.taxAmount, 0);
  const grandTotal = items.reduce((s, i) => s + i.valueInclTax, 0);
  const remaining = grandTotal - paidAmount;

  const filteredCustomers = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.partyCode.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const statusColor: Record<InvoiceStatus, string> = {
    Draft: 'bg-gray-100 text-gray-700',
    Paid: 'bg-green-100 text-green-700',
    Unpaid: 'bg-blue-100 text-blue-700',
    Overdue: 'bg-red-100 text-red-700',
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-shrink-0">
<Btn
  variant="primary"
  size="sm"
  onClick={handleSave}
>
  <Save size={12} />
  Save
</Btn>        <Btn variant="secondary" size="sm"><Printer size={12} />Save & Print</Btn>
        <Btn variant="secondary" size="sm"><FileDown size={12} />PDF</Btn>
        <Btn variant="secondary" size="sm"><Mail size={12} />Email</Btn>
        <div className="w-px h-4 bg-gray-200 mx-1" />
<Btn
  variant="ghost"
  size="sm"
  onClick={() => setShowPreview(true)}
>
  <Eye size={12} />
  Preview
</Btn>        <div className="flex-1" />
        <Btn variant="ghost" size="sm"><X size={12} />Clear</Btn>
        <Btn variant="danger" size="sm">Delete</Btn>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white rounded border border-gray-200 p-4 mb-3 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold text-gray-900">SALES TAX INVOICE</h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${statusColor[status]}`}>{status}</span>
              </div>
              <div className="text-xs text-gray-500">
                Auto-saved <span className="text-green-500">&#9679;</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              <Input label="Invoice No" defaultValue="INV-2024-0894" readOnly className="bg-gray-50 cursor-default" />
              <Input label="Invoice Date" type="date" defaultValue="2024-01-24" />
              <Input label="Due Date" type="date" defaultValue="2024-02-24" />
              <Select label="Status" value={status} onChange={e => setStatus(e.target.value as InvoiceStatus)}>
                <option>Draft</option>
                <option>Unpaid</option>
                <option>Paid</option>
                <option>Overdue</option>
              </Select>
              <Select label="Terms" value={terms} onChange={e => setTerms(e.target.value as PaymentTerms)}>
                <option>Cash</option>
                <option>Credit</option>
              </Select>
              <Input label="Reference No" placeholder="PO / Reference" />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-3 mb-3">
            <div className="col-span-12 lg:col-span-7 bg-white rounded border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Customer Information</h3>
                <div className="flex gap-1">
                  <Btn variant="ghost" size="xs">+ New Customer</Btn>
                  <Btn variant="ghost" size="xs">View Ledger</Btn>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="col-span-2 relative">
                  <label className="text-[10px] font-medium text-gray-600 uppercase tracking-wide block mb-0.5">Buyer Name</label>
                  <div className="relative">
                    <input
                      value={customer.name}
                      readOnly
                      onClick={() => setShowCustomerSearch(true)}
                      className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-xs pr-8 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  {showCustomerSearch && (
                    <div className="absolute top-full left-0 z-20 bg-white border border-gray-200 rounded shadow-lg w-full mt-0.5">
                      <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                          <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            autoFocus
                            value={customerSearch}
                            onChange={e => setCustomerSearch(e.target.value)}
                            placeholder="Search customers..."
                            className="w-full pl-6 pr-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        {filteredCustomers.map(c => (
                          <button key={c.id} onClick={() => { setCustomerId(c.id); setShowCustomerSearch(false); setCustomerSearch(''); }}
                            className="w-full text-left px-3 py-1.5 text-xs hover:bg-blue-50 flex items-center justify-between">
                            <span className="font-medium text-gray-800">{c.name}</span>
                            <span className="text-gray-400">{c.partyCode}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Input label="Party Code" value={customer.partyCode} readOnly className="bg-gray-50" />
                <Input label="Phone" value={customer.phone} readOnly className="bg-gray-50" />
                <Input label="NTN" value={customer.ntn} readOnly className="bg-gray-50" />
                <div className="col-span-2">
                  <Input label="Address" value={customer.address} readOnly className="bg-gray-50" />
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5 bg-white rounded border border-gray-200 p-4 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Account Status</h3>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-gray-50 rounded p-2">
                  <div className="text-[9px] text-gray-500 uppercase font-medium">Credit Limit</div>
                  <div className="text-sm font-bold text-gray-800">Rs {formatCurrency(customer.creditLimit)}</div>
                </div>
                <div className="bg-red-50 rounded p-2">
                  <div className="text-[9px] text-red-500 uppercase font-medium">Outstanding</div>
                  <div className="text-sm font-bold text-red-700">Rs {formatCurrency(customer.outstandingBalance)}</div>
                </div>
                <div className="bg-blue-50 rounded p-2 col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[9px] text-blue-500 uppercase font-medium">Available Credit</div>
                    <div className="text-xs font-bold text-blue-700">Rs {formatCurrency(customer.creditLimit - customer.outstandingBalance)}</div>
                  </div>
                  <div className="mt-1 h-1.5 bg-blue-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${Math.min(100, (customer.outstandingBalance / customer.creditLimit) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              <StatusBadge status={customer.status} />
            </div>
          </div>

          <div className="bg-white rounded border border-gray-200 shadow-sm mb-3">
            <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Invoice Items</h3>
              <Btn variant="secondary" size="xs" onClick={addRow}><Plus size={11} />Add Row</Btn>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="bg-gray-50">
                    {['Sr', 'Item Code', 'Description', 'Unit', 'Qty', 'Rate', 'Disc%', 'Value Excl Tax', 'Tax%', 'Tax Amt', 'Value Incl Tax', 'WH', 'Batch', ''].map(h => (
                      <th key={h} className="px-2 py-2 text-left text-[9px] font-semibold text-gray-500 uppercase border-b border-gray-200 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/30 group">
                      <td className="px-2 py-1 border-b border-gray-100 text-gray-500 font-medium w-8">{item.srNo}</td>
                      <td className="px-1 py-1 border-b border-gray-100 w-20">
                        <select
                          value={item.itemCode}
                          onChange={e => {
                            const itm = mockItems.find(i => i.itemCode === e.target.value);
                            if (itm) {
                              setItems(prev => {
                                const next = [...prev];
                                next[idx] = calcItem({ ...next[idx], itemCode: itm.itemCode, description: itm.itemName, unit: itm.unit, rate: itm.salesRate, taxPct: itm.taxPct });
                                return next;
                              });
                            }
                          }}
                          className="w-full border border-gray-200 rounded px-1.5 py-0.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Select</option>
                          {mockItems.map(i => <option key={i.itemCode} value={i.itemCode}>{i.itemCode}</option>)}
                        </select>
                      </td>
                      <td className="px-1 py-1 border-b border-gray-100 min-w-[160px]">
                        <input value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)}
                          className="w-full border border-gray-200 rounded px-1.5 py-0.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      </td>
                      <td className="px-1 py-1 border-b border-gray-100 w-14">
                        <input value={item.unit} onChange={e => updateItem(idx, 'unit', e.target.value)}
                          className="w-full border border-gray-200 rounded px-1.5 py-0.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      </td>
                      {(['quantity', 'rate', 'discountPct'] as const).map(key => (
                        <td key={key} className="px-1 py-1 border-b border-gray-100 w-16">
                          <input type="number" value={item[key]}
                            onChange={e => updateItem(idx, key, parseFloat(e.target.value) || 0)}
                            className="w-full border border-gray-200 rounded px-1.5 py-0.5 text-[10px] text-right focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </td>
                      ))}
                      <td className="px-2 py-1 border-b border-gray-100 text-right font-medium w-20">{formatCurrency(item.valueExclTax)}</td>
                      <td className="px-1 py-1 border-b border-gray-100 w-12">
                        <input type="number" value={item.taxPct}
                          onChange={e => updateItem(idx, 'taxPct', parseFloat(e.target.value) || 0)}
                          className="w-full border border-gray-200 rounded px-1.5 py-0.5 text-[10px] text-right focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      </td>
                      <td className="px-2 py-1 border-b border-gray-100 text-right text-blue-600 w-20">{formatCurrency(item.taxAmount)}</td>
                      <td className="px-2 py-1 border-b border-gray-100 text-right font-semibold text-gray-900 w-24">{formatCurrency(item.valueInclTax)}</td>
                      <td className="px-1 py-1 border-b border-gray-100 w-16">
                        <select value={item.warehouse} onChange={e => updateItem(idx, 'warehouse', e.target.value)}
                          className="w-full border border-gray-200 rounded px-1 py-0.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500">
                          <option>WH-01</option><option>WH-02</option><option>WH-03</option>
                        </select>
                      </td>
                      <td className="px-1 py-1 border-b border-gray-100 w-20">
                        <input value={item.batchNo} onChange={e => updateItem(idx, 'batchNo', e.target.value)}
                          className="w-full border border-gray-200 rounded px-1.5 py-0.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      </td>
                      <td className="px-1 py-1 border-b border-gray-100 w-7">
                        {items.length > 1 && (
                          <button onClick={() => removeRow(idx)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-0.5">
                            <Trash2 size={11} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 lg:col-span-5 bg-white rounded border border-gray-200 p-4 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Payment</h3>
              <div className="grid grid-cols-2 gap-2">
                <Select label="Payment Method" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                  <option>Cheque</option>
                  <option>Online</option>
                </Select>
                <div className="flex flex-col gap-0.5">
                  <label className="text-[10px] font-medium text-gray-600 uppercase tracking-wide">Paid Amount</label>
                  <input type="number" value={paidAmount} onChange={e => setPaidAmount(parseFloat(e.target.value) || 0)}
                    className="border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="col-span-2">
                  <Input label="Payment Reference" placeholder="Cheque No / TT No" />
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100">
                <div className="text-[10px] text-gray-500 uppercase font-medium mb-1">Signature</div>
                <div className="h-12 border border-dashed border-gray-300 rounded flex items-center justify-center text-[10px] text-gray-400">
                  Digital Signature Area
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 bg-white rounded border border-gray-200 p-4 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Invoice Summary</h3>
              <div className="space-y-1.5">
                {[
                  { label: 'Subtotal', val: subtotal, cls: '' },
                  { label: 'Discount', val: -discountTotal, cls: 'text-orange-600' },
                  { label: 'Taxable Amount', val: subtotal - discountTotal, cls: '' },
                  { label: 'Tax (17%)', val: taxTotal, cls: 'text-blue-600' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-xs">
                    <span className="text-gray-600">{row.label}</span>
                    <span className={`font-medium ${row.cls}`}>Rs {formatCurrency(Math.abs(row.val))}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-1.5 flex justify-between text-sm font-bold">
                  <span className="text-gray-800">Grand Total</span>
                  <span className="text-gray-900">Rs {formatCurrency(grandTotal)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Paid Amount</span>
                  <span className="text-green-700 font-semibold">Rs {formatCurrency(paidAmount)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-1.5">
                  <span className={remaining > 0 ? 'text-red-600' : 'text-green-600'}>Remaining Balance</span>
                  <span className={remaining > 0 ? 'text-red-700' : 'text-green-700'}>Rs {formatCurrency(remaining)}</span>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-3 bg-white rounded border border-gray-200 p-4 shadow-sm flex flex-col items-center">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 self-start">QR Code</h3>
              <div className="w-24 h-24 border-2 border-gray-200 rounded flex items-center justify-center bg-gray-50 mb-2">
                <div className="grid grid-cols-5 gap-0.5">
                  {Array.from({ length: 25 }).map((_, i) => (
  <div
    key={i}
    className={`w-2 h-2 ${
      [0,1,2,5,6,10,12,13,17,18,20,21,22,24].includes(i)
        ? 'bg-black'
        : 'bg-white'
    }`}
  />
))}
                </div>
              </div>
              <div className="text-[9px] text-gray-400 text-center">INV-2024-0894</div>
              <div className="text-[9px] text-gray-400 text-center">Scan to verify</div>
            </div>
          </div>
        </div>
      </div>
      {showPreview && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-auto">

      <div className="flex justify-between items-center border-b px-6 py-4">
        <h2 className="text-lg font-bold">
          Invoice Preview
        </h2>

        <button
          onClick={() => setShowPreview(false)}
          className="text-gray-500 hover:text-black"
        >
          ✕
        </button>
      </div>

      <div className="p-6">

        <div className="flex justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              SALES TAX INVOICE
            </h1>

            <div className="text-sm text-gray-600">
              Invoice No: INV-2024-0894
            </div>

            <div className="text-sm text-gray-600">
              Status: {status}
            </div>
          </div>

          <div className="text-right">
            <div className="border p-3 inline-block">
              <div className="grid grid-cols-5 gap-0.5">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 ${
                      [0,1,2,5,6,10,12,13,17,18,20,21,22,24].includes(i)
                        ? 'bg-black'
                        : 'bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="text-xs mt-2">
              Scan to Verify
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">
            Customer Information
          </h3>

          <p>{customer.name}</p>
          <p>{customer.address}</p>
          <p>{customer.phone}</p>
          <p>NTN: {customer.ntn}</p>
        </div>

        <table className="w-full border text-sm mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">Item</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Rate</th>
              <th className="border p-2">Tax</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>

          <tbody>
            {items.map(item => (
              <tr key={item.srNo}>
                <td className="border p-2">
                  {item.srNo}
                </td>

                <td className="border p-2">
                  {item.description}
                </td>

                <td className="border p-2">
                  {item.quantity}
                </td>

                <td className="border p-2">
                  {formatCurrency(item.rate)}
                </td>

                <td className="border p-2">
                  {formatCurrency(item.taxAmount)}
                </td>

                <td className="border p-2">
                  {formatCurrency(item.valueInclTax)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-80 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                {formatCurrency(subtotal)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>
                {formatCurrency(taxTotal)}
              </span>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Grand Total</span>
              <span>
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
)}
    </div>
  );
}
