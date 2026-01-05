
import React from 'react';
import { Language, translations } from '../services/i18n';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, lang, setLang }) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: '📊' },
    { id: 'orders', label: t.orders, icon: '🖨️' },
    { id: 'customers', label: t.customers, icon: '👥' },
    { id: 'till', label: t.till, icon: '🏧' },
    { id: 'reports', label: t.reports, icon: '📈' },
  ];

  return (
    <div className={`w-64 h-screen fixed ${isRtl ? 'right-0' : 'left-0'} top-0 glass border-r border-white/30 flex flex-col p-6 z-50`}>
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
          H
        </div>
        <div>
          <h1 className="text-emerald-900 font-bold text-lg leading-none">Hako Merch</h1>
          <p className="text-emerald-700/60 text-xs mt-1">Professional Printing</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                : 'text-emerald-800/70 hover:bg-emerald-50'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 space-y-4">
        {/* Language Switcher */}
        <div className="flex bg-emerald-50/50 p-1 rounded-xl border border-emerald-100 gap-1">
          {(['en', 'fr', 'ar'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`flex-1 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
                lang === l ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-700/50 hover:bg-emerald-100'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 p-2 bg-emerald-50 rounded-xl border border-emerald-100">
          <img 
            src="https://picsum.photos/seed/admin/40/40" 
            alt="Admin" 
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
          />
          <div className="overflow-hidden">
            <p className="text-emerald-900 font-semibold text-sm truncate">Admin User</p>
            <p className="text-emerald-700/60 text-xs truncate">Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
