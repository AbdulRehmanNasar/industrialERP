export type InvoiceStatus = 'Draft' | 'Paid' | 'Unpaid' | 'Overdue';
export type PaymentTerms = 'Cash' | 'Credit';
export type VoucherType = 'JV' | 'SV' | 'PV' | 'RV' | 'OP';
export type AccountType = 'Assets' | 'Liabilities' | 'Income' | 'Expenses' | 'Equity';
export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'Cheque' | 'Online';
export type PaymentStatus = 'Pending' | 'Completed' | 'Refunded' | 'Failed';

export interface Customer {
  id: string;
  partyCode: string;
  name: string;
  address: string;
  phone: string;
  ntn: string;
  creditLimit: number;
  outstandingBalance: number;
  status: 'Active' | 'Inactive';
  email?: string;
}

export interface InvoiceItem {
  srNo: number;
  itemCode: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  discountPct: number;
  valueExclTax: number;
  taxPct: number;
  taxAmount: number;
  valueInclTax: number;
  warehouse: string;
  batchNo: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  terms: PaymentTerms;
  customer: Customer;
  items: InvoiceItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  paidAmount: number;
  remainingBalance: number;
}

export interface LedgerEntry {
  id: string;
  voucherNo: string;
  voucherType: VoucherType;
  date: string;
  narration: string;
  debit: number;
  credit: number;
  runningBalance: number;
  createdBy: string;
}

export interface VoucherEntry {
  id: string;
  account: string;
  party: string;
  description: string;
  debit: number;
  credit: number;
}

export interface Voucher {
  id: string;
  voucherNo: string;
  type: VoucherType;
  date: string;
  referenceNo: string;
  narration: string;
  entries: VoucherEntry[];
  totalDebit: number;
  totalCredit: number;
  status: 'Draft' | 'Posted';
}

export interface Item {
  id: string;
  itemCode: string;
  itemName: string;
  description: string;
  unit: string;
  salesRate: number;
  purchaseRate: number;
  taxPct: number;
  currentStock: number;
  warehouse: string;
  status: 'Active' | 'Inactive';
  category: string;
  reorderLevel: number;
}

export interface StockEntry {
  id: string;
  item: string;
  itemCode: string;
  warehouse: string;
  batchNo: string;
  availableQty: number;
  reservedQty: number;
  damagedQty: number;
  lastUpdated: string;
  value: number;
}

export interface Account {
  id: string;
  accountCode: string;
  accountName: string;
  parentAccount: string;
  type: AccountType;
  balance: number;
  status: 'Active' | 'Inactive';
  children?: Account[];
}

export interface Payment {
  id: string;
  paymentId: string;
  party: string;
  invoice: string;
  paymentMethod: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  date: string;
}

export type NavPage =
  | 'dashboard'
  | 'sales-invoice'
  | 'sales-register'
  | 'delivery-challan'
  | 'purchase-invoice'
  | 'purchase-register'
  | 'ledger'
  | 'vouchers'
  | 'chart-of-accounts'
  | 'items'
  | 'stock-management'
  | 'warehouses'
  | 'customers'
  | 'suppliers'
  | 'payments'
  | 'reports'
  | 'settings';
