
import React, { useState } from 'react';
import { TillTransaction, TransactionType } from '../types';
import { formatCurrency } from '../utils/calculations';
import { Language, translations } from '../services/i18n';

interface TillProps {
  transactions: TillTransaction[];
  onAddTransaction: (tx: TillTransaction) => void;
  lang: Language;
}

const Till: React.FC<TillProps> = ({ transactions, onAddTransaction, lang }) => {
  const t = translations[lang];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ personName: '', amount: 0, reason: '' });

  const handleWithdrawal = () => {
    if (!formData.personName || formData.amount <= 0) return;
    onAddTransaction({ id: `TX-${Date.now()}`, personName: formData.personName, amount: formData.amount, reason: formData.reason, type: TransactionType.WITHDRAWAL, date: new Date().toISOString() });
    setIsModalOpen(false);
    setFormData({ personName: '', amount: 0, reason: '' });
  };

  const totalWithdrawals = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-emerald-900">{t.till}</h2>
          <p className="text-emerald-700/60">{t.tillBalance}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-rose-600 text-white px-6 py-3 rounded-2xl shadow-lg font-semibold flex items-center gap-2">
          <span>↓</span> {t.withdrawCash}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-3xl border border-white/50">
          <p className="text-emerald-700/60 text-sm font-bold uppercase mb-2">{t.totalExpenses}</p>
          <h3 className="text-3xl font-bold text-rose-600">{formatCurrency(totalWithdrawals)}</h3>
        </div>
        
        <div className="glass p-6 rounded-3xl border border-white/50 col-span-2">
          <h4 className="text-emerald-900 font-bold mb-4">{t.withdrawalHistory}</h4>
          <div className="space-y-3">
            {transactions.map(tx => (
              <div key={tx.id} className="flex justify-between items-center p-4 bg-white/50 rounded-2xl">
                <div><p className="font-bold text-emerald-900">{tx.personName}</p><p className="text-xs text-emerald-700/60">{tx.reason}</p></div>
                <div className="text-right"><p className="font-bold text-rose-600">-{formatCurrency(tx.amount)}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-900/40 backdrop-blur-sm">
          <div className="glass w-full max-w-md rounded-3xl p-8">
            <h3 className="text-xl font-bold text-emerald-900 mb-6">{t.withdrawCash}</h3>
            <div className="space-y-4">
              <input placeholder="Name" className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3" onChange={e => setFormData({...formData, personName: e.target.value})} />
              <input type="number" placeholder={t.amount} className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3" onChange={e => setFormData({...formData, amount: parseFloat(e.target.value) || 0})} />
              <input placeholder={t.reason} className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3" onChange={e => setFormData({...formData, reason: e.target.value})} />
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button onClick={handleWithdrawal} className="bg-rose-600 text-white px-8 py-3 rounded-xl font-bold">{t.logTransaction}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Till;
