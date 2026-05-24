import type { Customer, Invoice, LedgerEntry, Voucher, Item, StockEntry, Account, Payment } from '../types';

export const mockCustomers: Customer[] = [
  { id: '1', partyCode: 'C-001', name: 'Al-Faisal Industries Ltd', address: 'Plot 45, SITE Area, Karachi', phone: '0300-1234567', ntn: '1234567-8', creditLimit: 500000, outstandingBalance: 125000, status: 'Active', email: 'accounts@alfaisal.pk' },
  { id: '2', partyCode: 'C-002', name: 'Pakistan Cement Works', address: '12-B Industrial Zone, Lahore', phone: '0321-9876543', ntn: '9876543-2', creditLimit: 800000, outstandingBalance: 340000, status: 'Active', email: 'purchase@pcworks.pk' },
  { id: '3', partyCode: 'C-003', name: 'Sindh Building Materials', address: 'Survey No. 23, Hub Chowki Road', phone: '0333-5551234', ntn: '5551234-6', creditLimit: 200000, outstandingBalance: 89500, status: 'Active' },
  { id: '4', partyCode: 'C-004', name: 'Metro Construction Corp', address: 'Block 14, F-7/2 Islamabad', phone: '0345-7778899', ntn: '7778899-0', creditLimit: 1000000, outstandingBalance: 0, status: 'Active', email: 'billing@metrocc.pk' },
  { id: '5', partyCode: 'C-005', name: 'Rauf & Sons Trading', address: '34-C, Gulshan-e-Iqbal, Karachi', phone: '0311-4445566', ntn: '4445566-1', creditLimit: 150000, outstandingBalance: 148000, status: 'Active' },
  { id: '6', partyCode: 'C-006', name: 'Northern Minerals Co.', address: 'Charsadda Road, Peshawar', phone: '0912-234567', ntn: '2345671-9', creditLimit: 300000, outstandingBalance: 0, status: 'Inactive' },
];

export const mockInvoices: Invoice[] = [
  {
    id: '1', invoiceNo: 'INV-2024-0891', date: '2024-01-15', dueDate: '2024-02-15',
    status: 'Unpaid', terms: 'Credit',
    customer: mockCustomers[0],
    items: [
      { srNo: 1, itemCode: 'PM-001', description: 'Pumice Stone Grade A (Fine)', unit: 'MT', quantity: 50, rate: 4500, discountPct: 2, valueExclTax: 220500, taxPct: 17, taxAmount: 37485, valueInclTax: 257985, warehouse: 'WH-01', batchNo: 'B-2024-01' },
      { srNo: 2, itemCode: 'PM-002', description: 'Pumice Powder (200 Mesh)', unit: 'MT', quantity: 20, rate: 6200, discountPct: 0, valueExclTax: 124000, taxPct: 17, taxAmount: 21080, valueInclTax: 145080, warehouse: 'WH-01', batchNo: 'B-2024-01' },
    ],
    subtotal: 344000, discountTotal: 9000, taxTotal: 58565, grandTotal: 393065, paidAmount: 0, remainingBalance: 393065
  },
  {
    id: '2', invoiceNo: 'INV-2024-0892', date: '2024-01-16', dueDate: '2024-01-16',
    status: 'Paid', terms: 'Cash',
    customer: mockCustomers[1],
    items: [
      { srNo: 1, itemCode: 'PM-003', description: 'Volcanic Ash (Bulk)', unit: 'MT', quantity: 100, rate: 2800, discountPct: 5, valueExclTax: 266000, taxPct: 17, taxAmount: 45220, valueInclTax: 311220, warehouse: 'WH-02', batchNo: 'B-2024-02' },
    ],
    subtotal: 280000, discountTotal: 14000, taxTotal: 45220, grandTotal: 311220, paidAmount: 311220, remainingBalance: 0
  },
  {
    id: '3', invoiceNo: 'INV-2024-0893', date: '2023-12-01', dueDate: '2024-01-01',
    status: 'Overdue', terms: 'Credit',
    customer: mockCustomers[4],
    items: [
      { srNo: 1, itemCode: 'PM-001', description: 'Pumice Stone Grade A (Fine)', unit: 'MT', quantity: 30, rate: 4500, discountPct: 0, valueExclTax: 135000, taxPct: 17, taxAmount: 22950, valueInclTax: 157950, warehouse: 'WH-01', batchNo: 'B-2023-12' },
    ],
    subtotal: 135000, discountTotal: 0, taxTotal: 22950, grandTotal: 157950, paidAmount: 10000, remainingBalance: 147950
  },
];

export const mockLedgerEntries: LedgerEntry[] = [
  { id: '1', voucherNo: 'JV-001', voucherType: 'JV', date: '2024-01-01', narration: 'Opening Balance Entry', debit: 500000, credit: 0, runningBalance: 500000, createdBy: 'Admin' },
  { id: '2', voucherNo: 'SV-0891', voucherType: 'SV', date: '2024-01-15', narration: 'Sales Invoice INV-2024-0891 - Al-Faisal Industries', debit: 393065, credit: 0, runningBalance: 893065, createdBy: 'Saleem' },
  { id: '3', voucherNo: 'SV-0892', voucherType: 'SV', date: '2024-01-16', narration: 'Sales Invoice INV-2024-0892 - Pakistan Cement Works', debit: 311220, credit: 0, runningBalance: 1204285, createdBy: 'Saleem' },
  { id: '4', voucherNo: 'RV-0051', voucherType: 'RV', date: '2024-01-16', narration: 'Payment Received - Pakistan Cement Works', debit: 0, credit: 311220, runningBalance: 893065, createdBy: 'Accounts' },
  { id: '5', voucherNo: 'PV-0023', voucherType: 'PV', date: '2024-01-17', narration: 'Utility Bills Payment - January 2024', debit: 0, credit: 45000, runningBalance: 848065, createdBy: 'Admin' },
  { id: '6', voucherNo: 'JV-002', voucherType: 'JV', date: '2024-01-18', narration: 'Depreciation Charge - Machinery', debit: 0, credit: 25000, runningBalance: 823065, createdBy: 'Admin' },
  { id: '7', voucherNo: 'SV-0893', voucherType: 'SV', date: '2024-01-20', narration: 'Sales Invoice INV-2024-0893 - Rauf & Sons', debit: 157950, credit: 0, runningBalance: 981015, createdBy: 'Saleem' },
];

export const mockVouchers: Voucher[] = [
  {
    id: '1', voucherNo: 'JV-001', type: 'JV', date: '2024-01-01', referenceNo: 'OB-2024', narration: 'Opening Balance Entry - FY 2024',
    entries: [
      { id: '1', account: '1001 - Cash in Hand', party: '', description: 'Opening cash balance', debit: 250000, credit: 0 },
      { id: '2', account: '1002 - Bank Account - HBL', party: '', description: 'Opening bank balance', debit: 750000, credit: 0 },
      { id: '3', account: '3001 - Capital Account', party: '', description: 'Owner capital', debit: 0, credit: 1000000 },
    ],
    totalDebit: 1000000, totalCredit: 1000000, status: 'Posted'
  },
  {
    id: '2', voucherNo: 'SV-0891', type: 'SV', date: '2024-01-15', referenceNo: 'INV-2024-0891', narration: 'Sales to Al-Faisal Industries',
    entries: [
      { id: '1', account: '1101 - Accounts Receivable', party: 'Al-Faisal Industries', description: 'Invoice amount', debit: 393065, credit: 0 },
      { id: '2', account: '4001 - Sales Revenue', party: '', description: 'Sales value excl tax', debit: 0, credit: 344000 },
      { id: '3', account: '2101 - Sales Tax Payable', party: '', description: 'Sales tax 17%', debit: 0, credit: 58565 },
      { id: '4', account: '4002 - Discount Expense', party: '', description: 'Trade discount', debit: 9500, credit: 0 },
    ],
    totalDebit: 402565, totalCredit: 402565, status: 'Posted'
  },
];

export const mockItems: Item[] = [
  { id: '1', itemCode: 'PM-001', itemName: 'Pumice Stone Grade A', description: 'Fine grade pumice stone for industrial use', unit: 'MT', salesRate: 4500, purchaseRate: 2800, taxPct: 17, currentStock: 450, warehouse: 'WH-01', status: 'Active', category: 'Pumice', reorderLevel: 50 },
  { id: '2', itemCode: 'PM-002', itemName: 'Pumice Powder 200 Mesh', description: 'Ultra-fine pumice powder, 200 mesh grade', unit: 'MT', salesRate: 6200, purchaseRate: 3900, taxPct: 17, currentStock: 120, warehouse: 'WH-01', status: 'Active', category: 'Pumice', reorderLevel: 20 },
  { id: '3', itemCode: 'PM-003', itemName: 'Volcanic Ash Bulk', description: 'Natural volcanic ash, bulk grade', unit: 'MT', salesRate: 2800, purchaseRate: 1500, taxPct: 17, currentStock: 800, warehouse: 'WH-02', status: 'Active', category: 'Volcanic', reorderLevel: 100 },
  { id: '4', itemCode: 'PM-004', itemName: 'Pumice Gravel Coarse', description: 'Coarse pumice gravel for construction', unit: 'MT', salesRate: 3200, purchaseRate: 1800, taxPct: 17, currentStock: 15, warehouse: 'WH-01', status: 'Active', category: 'Pumice', reorderLevel: 30 },
  { id: '5', itemCode: 'PM-005', itemName: 'Perlite Expanded', description: 'Expanded perlite for horticulture and construction', unit: 'MT', salesRate: 8500, purchaseRate: 5200, taxPct: 17, currentStock: 60, warehouse: 'WH-03', status: 'Active', category: 'Perlite', reorderLevel: 15 },
  { id: '6', itemCode: 'PM-006', itemName: 'Silica Sand Fine', description: 'Industrial grade fine silica sand', unit: 'MT', salesRate: 1800, purchaseRate: 900, taxPct: 17, currentStock: 1200, warehouse: 'WH-02', status: 'Active', category: 'Sand', reorderLevel: 200 },
  { id: '7', itemCode: 'PM-007', itemName: 'Pumice Block (Standard)', description: 'Standard size pumice blocks for masonry', unit: 'PCS', salesRate: 85, purchaseRate: 45, taxPct: 17, currentStock: 2500, warehouse: 'WH-01', status: 'Active', category: 'Pumice', reorderLevel: 500 },
];

export const mockStockEntries: StockEntry[] = [
  { id: '1', item: 'Pumice Stone Grade A', itemCode: 'PM-001', warehouse: 'WH-01 Main', batchNo: 'B-2024-01', availableQty: 350, reservedQty: 100, damagedQty: 5, lastUpdated: '2024-01-18', value: 1575000 },
  { id: '2', item: 'Pumice Powder 200 Mesh', itemCode: 'PM-002', warehouse: 'WH-01 Main', batchNo: 'B-2024-01', availableQty: 80, reservedQty: 40, damagedQty: 2, lastUpdated: '2024-01-18', value: 496000 },
  { id: '3', item: 'Volcanic Ash Bulk', itemCode: 'PM-003', warehouse: 'WH-02 Storage', batchNo: 'B-2024-02', availableQty: 650, reservedQty: 150, damagedQty: 0, lastUpdated: '2024-01-17', value: 1820000 },
  { id: '4', item: 'Pumice Gravel Coarse', itemCode: 'PM-004', warehouse: 'WH-01 Main', batchNo: 'B-2024-01', availableQty: 10, reservedQty: 5, damagedQty: 2, lastUpdated: '2024-01-15', value: 32000 },
  { id: '5', item: 'Perlite Expanded', itemCode: 'PM-005', warehouse: 'WH-03 Special', batchNo: 'B-2024-03', availableQty: 55, reservedQty: 5, damagedQty: 1, lastUpdated: '2024-01-16', value: 467500 },
  { id: '6', item: 'Silica Sand Fine', itemCode: 'PM-006', warehouse: 'WH-02 Storage', batchNo: 'B-2024-02', availableQty: 1100, reservedQty: 100, damagedQty: 10, lastUpdated: '2024-01-18', value: 1980000 },
];

export const mockAccounts: Account[] = [
  {
    id: '1', accountCode: '1000', accountName: 'Current Assets', parentAccount: '', type: 'Assets', balance: 2850000, status: 'Active',
    children: [
      { id: '1-1', accountCode: '1001', accountName: 'Cash in Hand', parentAccount: '1000', type: 'Assets', balance: 125000, status: 'Active' },
      { id: '1-2', accountCode: '1002', accountName: 'Bank Account - HBL', parentAccount: '1000', type: 'Assets', balance: 1450000, status: 'Active' },
      { id: '1-3', accountCode: '1003', accountName: 'Bank Account - MCB', parentAccount: '1000', type: 'Assets', balance: 380000, status: 'Active' },
      { id: '1-4', accountCode: '1101', accountName: 'Accounts Receivable', parentAccount: '1000', type: 'Assets', balance: 895000, status: 'Active' },
    ]
  },
  {
    id: '2', accountCode: '2000', accountName: 'Current Liabilities', parentAccount: '', type: 'Liabilities', balance: 650000, status: 'Active',
    children: [
      { id: '2-1', accountCode: '2001', accountName: 'Accounts Payable', parentAccount: '2000', type: 'Liabilities', balance: 450000, status: 'Active' },
      { id: '2-2', accountCode: '2101', accountName: 'Sales Tax Payable', parentAccount: '2000', type: 'Liabilities', balance: 125000, status: 'Active' },
      { id: '2-3', accountCode: '2102', accountName: 'Income Tax Payable', parentAccount: '2000', type: 'Liabilities', balance: 75000, status: 'Active' },
    ]
  },
  {
    id: '3', accountCode: '3000', accountName: 'Equity', parentAccount: '', type: 'Equity', balance: 5000000, status: 'Active',
    children: [
      { id: '3-1', accountCode: '3001', accountName: 'Owner Capital', parentAccount: '3000', type: 'Equity', balance: 5000000, status: 'Active' },
      { id: '3-2', accountCode: '3002', accountName: 'Retained Earnings', parentAccount: '3000', type: 'Equity', balance: 0, status: 'Active' },
    ]
  },
  {
    id: '4', accountCode: '4000', accountName: 'Revenue', parentAccount: '', type: 'Income', balance: 3250000, status: 'Active',
    children: [
      { id: '4-1', accountCode: '4001', accountName: 'Sales Revenue - Pumice', parentAccount: '4000', type: 'Income', balance: 2800000, status: 'Active' },
      { id: '4-2', accountCode: '4002', accountName: 'Sales Revenue - Other', parentAccount: '4000', type: 'Income', balance: 450000, status: 'Active' },
    ]
  },
  {
    id: '5', accountCode: '5000', accountName: 'Operating Expenses', parentAccount: '', type: 'Expenses', balance: 890000, status: 'Active',
    children: [
      { id: '5-1', accountCode: '5001', accountName: 'Salaries & Wages', parentAccount: '5000', type: 'Expenses', balance: 450000, status: 'Active' },
      { id: '5-2', accountCode: '5002', accountName: 'Rent & Utilities', parentAccount: '5000', type: 'Expenses', balance: 180000, status: 'Active' },
      { id: '5-3', accountCode: '5003', accountName: 'Transport & Logistics', parentAccount: '5000', type: 'Expenses', balance: 260000, status: 'Active' },
    ]
  },
];

export const mockPayments: Payment[] = [
  { id: '1', paymentId: 'PMT-001', party: 'Pakistan Cement Works', invoice: 'INV-2024-0892', paymentMethod: 'Bank Transfer', amount: 311220, status: 'Completed', date: '2024-01-16' },
  { id: '2', paymentId: 'PMT-002', party: 'Al-Faisal Industries', invoice: 'INV-2024-0891', paymentMethod: 'Cheque', amount: 50000, status: 'Completed', date: '2024-01-20' },
  { id: '3', paymentId: 'PMT-003', party: 'Metro Construction Corp', invoice: 'INV-2024-0890', paymentMethod: 'Bank Transfer', amount: 245000, status: 'Completed', date: '2024-01-14' },
  { id: '4', paymentId: 'PMT-004', party: 'Rauf & Sons Trading', invoice: 'INV-2024-0893', paymentMethod: 'Cash', amount: 10000, status: 'Completed', date: '2024-01-22' },
  { id: '5', paymentId: 'PMT-005', party: 'Sindh Building Materials', invoice: 'INV-2024-0888', paymentMethod: 'Cheque', amount: 89500, status: 'Pending', date: '2024-01-23' },
];

export const salesChartData = [
  { month: 'Aug', sales: 1850000, expenses: 920000 },
  { month: 'Sep', sales: 2100000, expenses: 1050000 },
  { month: 'Oct', sales: 1950000, expenses: 980000 },
  { month: 'Nov', sales: 2350000, expenses: 1100000 },
  { month: 'Dec', sales: 2800000, expenses: 1250000 },
  { month: 'Jan', sales: 3250000, expenses: 1420000 },
];

export const cashFlowData = [
  { week: 'W1', inflow: 450000, outflow: 320000 },
  { week: 'W2', inflow: 680000, outflow: 410000 },
  { week: 'W3', inflow: 520000, outflow: 380000 },
  { week: 'W4', inflow: 890000, outflow: 520000 },
];
