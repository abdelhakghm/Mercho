
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import Till from './components/Till';
import Customers from './components/Customers';
import Reports from './components/Reports';
import { ServiceOrder, TillTransaction, DeliveryStatus, Customer } from './types';
import { INITIAL_ORDERS, INITIAL_TILL, INITIAL_CUSTOMERS } from './services/mockData';
import { getFinancialSummary, formatCurrency } from './utils/calculations';
import { Language, translations } from './services/i18n';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lang, setLang] = useState<Language>('fr');
  const t = translations[lang];
  
  // Centralized State
  const [orders, setOrders] = useState<ServiceOrder[]>(INITIAL_ORDERS);
  const [transactions, setTransactions] = useState<TillTransaction[]>(INITIAL_TILL);
  const [manualCustomers, setManualCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);

  const handleAddOrder = (order: ServiceOrder) => setOrders([order, ...orders]);
  const handleUpdateStatus = (orderId: string, status: DeliveryStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
  };
  const handleAddTransaction = (tx: TillTransaction) => setTransactions([tx, ...transactions]);
  const handleAddManualCustomer = (cust: Customer) => setManualCustomers([cust, ...manualCustomers]);

  const summary = getFinancialSummary(orders, transactions);

  // Apply RTL direction when language is Arabic
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard orders={orders} transactions={transactions} lang={lang} />;
      case 'orders':
        return (
          <Orders 
            orders={orders} 
            manualCustomers={manualCustomers}
            onAddOrder={handleAddOrder} 
            onUpdateStatus={handleUpdateStatus} 
            lang={lang}
          />
        );
      case 'customers':
        return (
          <Customers 
            orders={orders} 
            manualCustomers={manualCustomers}
            onAddCustomer={handleAddManualCustomer}
            lang={lang}
          />
        );
      case 'till':
        return <Till transactions={transactions} onAddTransaction={handleAddTransaction} lang={lang} />;
      case 'reports':
        return <Reports orders={orders} transactions={transactions} lang={lang} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[70vh] text-emerald-700/40">
            <span className="text-6xl mb-4">🚧</span>
            <h2 className="text-2xl font-bold">Feature Coming Soon</h2>
          </div>
        );
    }
  };

  const isRtl = lang === 'ar';

  return (
    <div className={`min-h-screen flex bg-[#f8faf9] ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} lang={lang} setLang={setLang} />
      
      <main className={`flex-1 ${isRtl ? 'mr-64' : 'ml-64'} p-10 min-h-screen relative`}>
        {/* Top Navbar */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
             <div className="glass px-6 py-2 rounded-2xl border border-white/60">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">{t.tillBalance}: </span>
                <span className="text-sm font-black text-emerald-600 ml-2">{formatCurrency(summary.netCashInTill)}</span>
             </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex bg-white/50 border border-white/50 px-4 py-2 rounded-2xl shadow-sm items-center gap-3">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">{t.systemsActive}</span>
            </div>
            <div className="flex items-center gap-3 glass px-4 py-2 rounded-2xl border border-white/60">
              <span className="text-xs font-black text-emerald-900 uppercase">DZD</span>
              <span className="text-lg">🇩🇿</span>
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        {renderContent()}

        {/* Floating Operational Hub */}
        <div className={`fixed bottom-8 ${isRtl ? 'left-8' : 'right-8'} z-[60]`}>
          <div className="glass-dark p-6 rounded-3xl shadow-2xl border border-emerald-800/20 w-80 backdrop-blur-xl">
            <div className="flex justify-between items-center mb-4">
               <h5 className="text-white text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Operational Hub</h5>
               <span className="text-emerald-400 text-xs font-bold">LIVE</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-xs">{t.uncollected}</span>
                <span className="text-amber-400 font-bold text-sm">{formatCurrency(summary.totalPendingCollection)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-xs">{t.totalOrders}</span>
                <span className="text-emerald-400 font-bold text-sm">{orders.length}</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                <span className="text-white text-xs font-bold uppercase">{t.netCash}</span>
                <span className="text-white text-lg font-black">{formatCurrency(summary.netCashInTill)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
