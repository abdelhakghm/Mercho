
import React, { useMemo, useState } from 'react';
import { ServiceOrder, RegularCustomer, Customer } from '../types';
import { formatCurrency } from '../utils/calculations';
import { Language, translations } from '../services/i18n';

interface CustomersProps {
  orders: ServiceOrder[];
  manualCustomers: Customer[];
  onAddCustomer: (cust: Customer) => void;
  lang: Language;
}

const Customers: React.FC<CustomersProps> = ({ orders, manualCustomers, onAddCustomer, lang }) => {
  const t = translations[lang];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  const autoDetected = useMemo(() => {
    const map = new Map<string, { count: number; spent: number; profit: number; originalName: string }>();
    orders.forEach(order => {
      const nameKey = order.customerName.trim().toLowerCase();
      const current = map.get(nameKey) || { count: 0, spent: 0, profit: 0, originalName: order.customerName };
      map.set(nameKey, {
        count: current.count + 1,
        spent: current.spent + order.totalSellingPrice,
        profit: current.profit + order.profit,
        originalName: current.originalName
      });
    });
    const regulars: RegularCustomer[] = [];
    map.forEach((data) => {
      if (data.count >= 3) {
        regulars.push({
          name: data.originalName,
          orderCount: data.count,
          totalSpent: data.spent,
          totalProfit: data.profit
        });
      }
    });
    return regulars.sort((a, b) => b.orderCount - a.orderCount);
  }, [orders]);

  const handleSave = () => {
    if (!formData.name) return;
    onAddCustomer({ id: `CUST-${Date.now()}`, name: formData.name, phone: formData.phone, email: formData.email });
    setIsModalOpen(false);
    setFormData({ name: '', phone: '', email: '' });
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-emerald-900">{t.clientDirectory}</h2>
          <p className="text-emerald-700/60">{t.customers}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold">
          {t.addCustomer}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {manualCustomers.map((cust) => (
          <div key={cust.id} className="glass p-6 rounded-3xl border border-white/50 relative">
            <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full">{t.manualEntry}</div>
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-xl font-bold text-white mb-4">{cust.name.charAt(0)}</div>
            <h3 className="text-lg font-bold text-emerald-900">{cust.name}</h3>
            <p className="text-xs text-emerald-600">{cust.phone}</p>
          </div>
        ))}
        {autoDetected.map((cust) => (
           <div key={cust.name} className="glass p-6 rounded-3xl border border-emerald-200/50 relative bg-emerald-50/20">
              <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full">{t.autoRegular}</div>
              <h3 className="text-lg font-bold text-emerald-900">{cust.name}</h3>
              <div className="mt-4 space-y-2 text-xs">
                 <div className="flex justify-between"><span className="text-emerald-700/50">{t.totalOrders}</span><span className="font-bold">{cust.orderCount}</span></div>
                 <div className="flex justify-between"><span className="text-emerald-700/50">{t.price}</span><span className="font-bold">{formatCurrency(cust.totalSpent)}</span></div>
              </div>
           </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-900/40 backdrop-blur-sm">
          <div className="glass w-full max-w-md rounded-3xl shadow-2xl p-8">
            <h3 className="text-xl font-bold text-emerald-900 mb-6">{t.addCustomer}</h3>
            <div className="space-y-4">
              <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Name" className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3" />
              <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Phone" className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3" />
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3">Cancel</button>
              <button onClick={handleSave} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold">{t.recordOrder}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
