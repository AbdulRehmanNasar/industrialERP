import { useState } from 'react';
import {
  LayoutDashboard, FileText, BookOpen, Package, Users, CreditCard,
  BarChart2, Settings, ChevronDown, ChevronRight, ShoppingCart,
  Landmark, Building2, ChevronLeft
} from 'lucide-react';
import type { NavPage } from '../types';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  page?: NavPage;
  children?: { label: string; page: NavPage }[];
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboard size={16} />, label: 'Dashboard', page: 'dashboard' },
  {
    icon: <FileText size={16} />, label: 'Sales', children: [
      { label: 'Sales Invoice', page: 'sales-invoice' },
      { label: 'Sales Register', page: 'sales-register' },
      { label: 'Delivery Challan', page: 'delivery-challan' },
    ]
  },
  {
    icon: <ShoppingCart size={16} />, label: 'Purchases', children: [
      { label: 'Purchase Invoice', page: 'purchase-invoice' },
      { label: 'Purchase Register', page: 'purchase-register' },
    ]
  },
  {
    icon: <Landmark size={16} />, label: 'Accounting', children: [
      { label: 'Ledger Book', page: 'ledger' },
      { label: 'Vouchers', page: 'vouchers' },
      { label: 'Chart of Accounts', page: 'chart-of-accounts' },
    ]
  },
  {
    icon: <Package size={16} />, label: 'Inventory', children: [
      { label: 'Items', page: 'items' },
      { label: 'Stock Management', page: 'stock-management' },
      { label: 'Warehouses', page: 'warehouses' },
    ]
  },
  {
    icon: <Users size={16} />, label: 'Parties', children: [
      { label: 'Customers', page: 'customers' },
      { label: 'Suppliers', page: 'suppliers' },
    ]
  },
  { icon: <CreditCard size={16} />, label: 'Payments', page: 'payments' },
  { icon: <BarChart2 size={16} />, label: 'Reports', page: 'reports' },
  { icon: <Settings size={16} />, label: 'Settings', page: 'settings' },
];

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['Sales', 'Accounting']);

  const toggleSection = (label: string) => {
    setExpandedSections(prev =>
      prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]
    );
  };

  const isActive = (page?: NavPage) => page === currentPage;
  const isSectionActive = (children?: { page: NavPage }[]) =>
    children?.some(c => c.page === currentPage);

  return (
    <aside className={`${collapsed ? 'w-14' : 'w-56'} bg-gray-900 text-gray-300 flex flex-col flex-shrink-0 transition-all duration-200 overflow-hidden`}>
      <div className="flex items-center justify-between px-3 py-3 border-b border-gray-700 h-12">
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
              <Building2 size={14} className="text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">PumiceERP</div>
              <div className="text-[10px] text-gray-500 truncate">Industrial Materials</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-7 h-7 bg-blue-500 rounded flex items-center justify-center mx-auto">
            <Building2 size={14} className="text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(p => !p)}
          className={`text-gray-500 hover:text-gray-300 p-1 rounded hover:bg-gray-800 flex-shrink-0 ${collapsed ? 'hidden' : ''}`}
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      {collapsed && (
        <button onClick={() => setCollapsed(false)} className="p-2 hover:bg-gray-800 flex items-center justify-center mt-1">
          <ChevronRight size={14} />
        </button>
      )}

      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.map(item => (
          <div key={item.label}>
            {item.children ? (
              <>
                <button
                  onClick={() => !collapsed && toggleSection(item.label)}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs hover:bg-gray-800 hover:text-gray-100 transition-colors ${
                    isSectionActive(item.children) ? 'text-blue-400' : ''
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left font-medium">{item.label}</span>
                      {expandedSections.includes(item.label)
                        ? <ChevronDown size={12} />
                        : <ChevronRight size={12} />}
                    </>
                  )}
                </button>
                {!collapsed && expandedSections.includes(item.label) && (
                  <div className="ml-6 border-l border-gray-700 mb-0.5">
                    {item.children.map(child => (
                      <button
                        key={child.page}
                        onClick={() => onNavigate(child.page)}
                        className={`w-full text-left pl-3 pr-2 py-1 text-xs transition-colors ${
                          isActive(child.page)
                            ? 'text-blue-400 bg-blue-900/20 border-l-2 border-blue-400 -ml-px'
                            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => item.page && onNavigate(item.page)}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs transition-colors ${
                  isActive(item.page)
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-800 hover:text-gray-100'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </button>
            )}
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-700 px-3 py-2">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white">A</div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-gray-200 truncate">Admin User</div>
              <div className="text-[10px] text-gray-500 truncate">Administrator</div>
            </div>
          </div>
        ) : (
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white mx-auto">A</div>
        )}
      </div>
    </aside>
  );
}
