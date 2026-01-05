
import React, { useState } from 'react';
import { ServiceOrder, DeliveryStatus, Customer } from '../types';
import { formatCurrency, calculateServiceMetrics } from '../utils/calculations';
import { Language, translations } from '../services/i18n';

interface OrdersProps {
  orders: ServiceOrder[];
  manualCustomers: Customer[];
  onAddOrder: (order: ServiceOrder) => void;
  onUpdateStatus: (orderId: string, status: DeliveryStatus) => void;
  lang: Language;
}

const Orders: React.FC<OrdersProps> = ({ orders, manualCustomers, onAddOrder, onUpdateStatus, lang }) => {
  const t = translations[lang];
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    description: '',
    quantity: 1,
    purchaseCost: 0,
    printingCost: 0,
    sellingPrice: 0,
    status: DeliveryStatus.ON_WAY
  });

  const [inputs, setInputs] = useState({
    purchaseCost: '',
    printingCost: '',
    sellingPrice: ''
  });

  const evaluateMath = (input: string): number => {
    if (!input || !input.trim()) return 0;
    try {
      const sanitized = input.replace(/[^-0-9+*/(). ]/g, '');
      if (!sanitized.trim()) return 0;
      const result = new Function(`return (${sanitized})`)();
      return typeof result === 'number' && isFinite(result) ? result : 0;
    } catch {
      const val = parseFloat(input);
      return isNaN(val) ? 0 : val;
    }
  };

  const handleInputChange = (field: 'purchaseCost' | 'printingCost' | 'sellingPrice', value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    const result = evaluateMath(value);
    setFormData(prev => ({ ...prev, [field]: result }));
  };

  const handleBlur = (field: 'purchaseCost' | 'printingCost' | 'sellingPrice') => {
    const result = evaluateMath(inputs[field]);
    setInputs(prev => ({ ...prev, [field]: result.toString() }));
  };

  const metrics = calculateServiceMetrics(
    formData.quantity,
    formData.purchaseCost,
    formData.printingCost,
    formData.sellingPrice
  );

  const handleSave = () => {
    if (!formData.customerName || !formData.description) return;
    
    const newOrder: ServiceOrder = {
      id: `ORD-${Date.now()}`,
      customerName: formData.customerName,
      description: formData.description,
      quantity: formData.quantity,
      totalPurchaseCost: formData.purchaseCost,
      printingCost: formData.printingCost,
      totalSellingPrice: formData.sellingPrice,
      date: new Date().toISOString(),
      profit: metrics.profit,
      margin: metrics.margin,
      status: formData.status
    };

    onAddOrder(newOrder);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      description: '',
      quantity: 1,
      purchaseCost: 0,
      printingCost: 0,
      sellingPrice: 0,
      status: DeliveryStatus.ON_WAY
    });
    setInputs({
      purchaseCost: '',
      printingCost: '',
      sellingPrice: ''
    });
  };

  const allExistingNames = Array.from(new Set([
    ...manualCustomers.map(c => c.name),
    ...orders.map(o => o.customerName)
  ]));

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-emerald-900">{t.orders}</h2>
          <p className="text-emerald-700/60">{t.totalOrders}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-emerald-700 transition-all font-semibold flex items-center gap-2"
        >
          <span>+</span> {t.newOrder}
        </button>
      </div>

      <div className="glass rounded-3xl shadow-sm overflow-hidden border border-white/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-emerald-50 text-emerald-700 text-xs uppercase font-bold tracking-wider">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">{t.customer}</th>
                <th className="px-6 py-4">{t.service}</th>
                <th className="px-6 py-4">{t.price}</th>
                <th className="px-6 py-4">{t.profit}</th>
                <th className="px-6 py-4">{t.fundStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-emerald-700/40 font-medium">No orders yet.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-emerald-50/30 transition-colors group">
                    <td className="px-6 py-4 text-xs text-emerald-500 font-medium">{new Date(order.date).toLocaleDateString(lang)}</td>
                    <td className="px-6 py-4 font-bold text-emerald-900">{order.customerName}</td>
                    <td className="px-6 py-4 text-emerald-800 text-sm">
                      <div className="font-semibold">{order.description}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-900">{formatCurrency(order.totalSellingPrice)}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">{formatCurrency(order.profit)}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value as DeliveryStatus)}
                        className={`text-[10px] font-black uppercase rounded-xl px-4 py-2 border-0 cursor-pointer ${
                          order.status === DeliveryStatus.COLLECTED ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {Object.values(DeliveryStatus).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-900/40 backdrop-blur-sm">
          <div className="glass w-full max-w-xl max-h-[90vh] rounded-3xl shadow-2xl animate-scaleIn overflow-hidden border border-white/40 flex flex-col">
            <div className="p-6 border-b border-emerald-50 flex justify-between items-center bg-white/50">
              <h3 className="text-xl font-bold text-emerald-900">{t.recordNewService}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl text-emerald-300">×</button>
            </div>
            
            <div className="p-8 space-y-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-emerald-700 uppercase">{t.customer}</label>
                  <input list="names" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3" />
                  <datalist id="names">{allExistingNames.map(n => <option key={n} value={n} />)}</datalist>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-emerald-700 uppercase">{t.service}</label>
                  <input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-emerald-700 uppercase">{t.buyCost}</label>
                  <input value={inputs.purchaseCost} onBlur={() => handleBlur('purchaseCost')} onChange={e => handleInputChange('purchaseCost', e.target.value)} className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-emerald-700 uppercase">{t.printCost}</label>
                  <input value={inputs.printingCost} onBlur={() => handleBlur('printingCost')} onChange={e => handleInputChange('printingCost', e.target.value)} className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-emerald-700 uppercase">{t.sellingPrice}</label>
                  <input value={inputs.sellingPrice} onBlur={() => handleBlur('sellingPrice')} onChange={e => handleInputChange('sellingPrice', e.target.value)} className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3" />
                </div>
              </div>

              <div className="p-6 bg-emerald-600 rounded-3xl text-white flex justify-between">
                <div>
                   <p className="text-[10px] uppercase opacity-70">{t.profit}</p>
                   <p className="text-2xl font-black">{formatCurrency(metrics.profit)}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] uppercase opacity-70">{t.margin}</p>
                   <p className="text-2xl font-black">{metrics.margin.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-emerald-50 border-t border-emerald-100 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-emerald-700">Cancel</button>
              <button onClick={handleSave} className="bg-emerald-600 text-white px-10 py-3 rounded-2xl font-black">{t.recordOrder}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
