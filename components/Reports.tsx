
import React from 'react';
import { ServiceOrder, TillTransaction } from '../types';
import { getFinancialSummary, formatCurrency } from '../utils/calculations';
import { Language, translations } from '../services/i18n';

interface ReportsProps {
  orders: ServiceOrder[];
  transactions: TillTransaction[];
  lang: Language;
}

const Reports: React.FC<ReportsProps> = ({ orders, transactions, lang }) => {
  const summary = getFinancialSummary(orders, transactions);
  const t = translations[lang];
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'Collected at the delivery company').length;
  const successRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-emerald-900">{t.businessReports}</h2>
        <p className="text-emerald-700/60">{t.reports}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl border border-white/50 space-y-6">
          <h3 className="text-lg font-bold text-emerald-900 border-b border-emerald-50 pb-4">{t.financialHealth}</h3>
          <div className="space-y-4">
            <div className="flex justify-between"><span className="text-emerald-700/60 font-medium">{t.grossRevenue}</span><span className="font-bold text-emerald-900">{formatCurrency(summary.totalCollectedRevenue)}</span></div>
            <div className="flex justify-between"><span className="text-emerald-700/60 font-medium">{t.totalExpenses}</span><span className="font-bold text-rose-600">-{formatCurrency(summary.totalCosts)}</span></div>
            <div className="pt-4 border-t border-emerald-50 flex justify-between"><span className="text-emerald-900 font-black">{t.netCashInHand}</span><span className="text-xl font-black text-emerald-600">{formatCurrency(summary.netCashInTill)}</span></div>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border border-white/50 space-y-6">
          <h3 className="text-lg font-bold text-emerald-900 border-b border-emerald-50 pb-4">{t.successRate}</h3>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-emerald-700/60 text-xs font-bold uppercase">{t.successRate}</p>
              <p className="text-3xl font-black text-emerald-900">{successRate.toFixed(1)}%</p>
            </div>
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-2xl">✓</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
