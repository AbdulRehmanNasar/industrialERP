import { Bell, Search, Plus, ChevronDown } from 'lucide-react';
import type { NavPage } from '../types';

const pageTitles: Record<NavPage, string> = {
  'dashboard': 'Dashboard',
  'sales-invoice': 'Sales Invoice',
  'sales-register': 'Sales Register',
  'delivery-challan': 'Delivery Challan',
  'purchase-invoice': 'Purchase Invoice',
  'purchase-register': 'Purchase Register',
  'ledger': 'Ledger Book',
  'vouchers': 'Voucher Management',
  'chart-of-accounts': 'Chart of Accounts',
  'items': 'Item Management',
  'stock-management': 'Stock Management',
  'warehouses': 'Warehouses',
  'customers': 'Customers',
  'suppliers': 'Suppliers',
  'payments': 'Payments',
  'reports': 'Reports',
  'settings': 'Settings',
};

interface HeaderProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-4 flex-shrink-0 z-10">
      <div className="flex-1">
        <h1 className="text-sm font-semibold text-gray-800">{pageTitles[currentPage]}</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Quick search... (Ctrl+K)"
            className="pl-8 pr-3 py-1 text-xs bg-gray-50 border border-gray-200 rounded w-52 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={() => onNavigate('sales-invoice')}
          className="flex items-center gap-1.5 bg-blue-600 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus size={13} />
          New Invoice
        </button>
        <button className="relative p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
          <Bell size={15} />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100 transition-colors">
          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[9px] font-bold text-white">A</div>
          <span className="hidden sm:block">Admin</span>
          <ChevronDown size={11} />
        </button>
      </div>
    </header>
  );
}
