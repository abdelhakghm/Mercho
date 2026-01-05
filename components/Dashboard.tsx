
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { formatCurrency, getFinancialSummary } from '../utils/calculations';
import { ServiceOrder, TillTransaction, DeliveryStatus } from '../types';
import { Language, translations } from '../services/i18n';

interface DashboardProps {
  orders: ServiceOrder[];
  transactions: TillTransaction[];
  lang: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ orders, transactions, lang }) => {
  const summary = getFinancialSummary(orders, transactions);
  const t = translations[lang];

  const chartData = orders.slice(-10).map(o => ({
    name: new Date(o.date).toLocaleDateString(lang, { month: 'short', day: 'numeric' }),
    val: o.totalSellingPrice,
    prof: o.profit
  }));

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-emerald-900">{t.financialPulse}</h2>
        <p className="text-emerald-700/60">{t.realTimeFunds}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-3xl border border-white/60 bg-white/40 shadow-xl shadow-emerald-900/5">
          <p className="text-emerald-700/50 text-xs font-bold uppercase tracking-widest mb-1">{t.cashInTill}</p>
          <h3 className="text-3xl font-black text-emerald-900 mb-2">
            {formatCurrency(summary.netCashInTill)}
          </h3>
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
             <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{t.systemsActive}</span>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-white/60 bg-white/40 shadow-xl shadow-emerald-900/5">
          <p className="text-amber-700/50 text-xs font-bold uppercase tracking-widest mb-1">{t.pendingCollection}</p>
          <h3 className="text-3xl font-black text-amber-900 mb-2">
            {formatCurrency(summary.totalPendingCollection)}
          </h3>
          <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">{t.uncollected}</p>
        </div>

        <div className="glass p-6 rounded-3xl border border-white/60 bg-white/40 shadow-xl shadow-emerald-900/5">
          <p className="text-emerald-700/50 text-xs font-bold uppercase tracking-widest mb-1">{t.lifetimeProfit}</p>
          <h3 className="text-3xl font-black text-emerald-900 mb-2">
            {formatCurrency(summary.totalProfit)}
          </h3>
          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">{t.profit}</p>
        </div>

        <div className="glass p-6 rounded-3xl border border-white/60 bg-white/40 shadow-xl shadow-emerald-900/5">
          <p className="text-rose-700/50 text-xs font-bold uppercase tracking-widest mb-1">{t.totalExpenses}</p>
          <h3 className="text-3xl font-black text-rose-900 mb-2">
            {formatCurrency(summary.totalCosts + summary.totalWithdrawals)}
          </h3>
          <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">Costs + Till</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-8 rounded-3xl shadow-sm border border-white/40">
          <div className="flex justify-between items-center mb-6">
             <h4 className="text-emerald-900 font-bold uppercase text-xs tracking-widest">{t.revenueFlow}</h4>
             <div className="flex gap-4 text-[10px] font-bold">
                <div className="flex items-center gap-2 text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-600"></span> {t.revenue}</div>
                <div className="flex items-center gap-2 text-emerald-300"><span className="w-2 h-2 rounded-full bg-emerald-300"></span> {t.profit}</div>
             </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              {orders.length > 0 ? (
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 10}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 10}} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px'}}
                  />
                  <Area type="monotone" dataKey="val" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                  <Area type="monotone" dataKey="prof" stroke="#6ee7b7" strokeWidth={2} fillOpacity={0} />
                </AreaChart>
              ) : (
                <div className="h-full flex items-center justify-center text-emerald-700/20 italic">
                  No data.
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl shadow-sm border border-white/40 flex flex-col justify-center text-center">
           <p className="text-emerald-700/50 text-xs font-bold uppercase tracking-widest mb-6">Operations</p>
           <div className="space-y-6 text-left">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                 <p className="text-[10px] font-bold text-emerald-500 uppercase">{t.pendingCollection}</p>
                 <p className="text-xl font-bold text-emerald-900">{orders.filter(o => o.status !== DeliveryStatus.COLLECTED).length} {t.orders}</p>
              </div>
              <div className="p-4 bg-emerald-900 text-white rounded-2xl">
                 <p className="text-[10px] font-bold opacity-60 uppercase">{t.totalOrders}</p>
                 <p className="text-xl font-bold">{orders.reduce((sum, o) => sum + o.quantity, 0)} Units</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
