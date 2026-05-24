import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import SalesInvoice from './pages/SalesInvoice';
import SalesRegister from './pages/SalesRegister';
import LedgerBook from './pages/LedgerBook';
import Vouchers from './pages/Vouchers';
import ChartOfAccounts from './pages/ChartOfAccounts';
import Items from './pages/Items';
import StockManagement from './pages/StockManagement';
import Customers from './pages/Customers';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import GenericPage from './pages/GenericPage';
import type { NavPage } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
      case 'sales-invoice': return <SalesInvoice />;
      case 'sales-register': return <SalesRegister onNavigate={setCurrentPage} />;
      case 'delivery-challan': return <GenericPage title="Delivery Challan" description="Create and manage delivery challans for outbound shipments." />;
      case 'purchase-invoice': return <GenericPage title="Purchase Invoice" description="Record and track supplier purchase invoices." />;
      case 'purchase-register': return <GenericPage title="Purchase Register" description="View complete history of all purchase invoices." />;
      case 'ledger': return <LedgerBook />;
      case 'vouchers': return <Vouchers />;
      case 'chart-of-accounts': return <ChartOfAccounts />;
      case 'items': return <Items />;
      case 'stock-management': return <StockManagement />;
      case 'warehouses': return <GenericPage title="Warehouses" description="Manage warehouse locations, capacity, and configurations." />;
      case 'customers': return <Customers />;
      case 'suppliers': return <Customers />;
      case 'payments': return <Payments />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      default: return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100" style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}>
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="flex-1 overflow-hidden flex flex-col min-h-0">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
