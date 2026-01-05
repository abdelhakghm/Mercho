
import React from 'react';
import { INITIAL_EMPLOYEES } from '../services/mockData';
import { formatCurrency } from '../utils/calculations';

const Employees: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-emerald-900">Our Team</h2>
          <p className="text-emerald-700/60">Manage employee performance and payroll metrics.</p>
        </div>
        <button className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-emerald-700 transition-all font-semibold">
          Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {INITIAL_EMPLOYEES.map((emp) => (
          <div key={emp.id} className="glass rounded-3xl overflow-hidden border border-white/50 shadow-sm flex flex-col sm:flex-row">
            <div className="p-8 flex-1">
              <div className="flex items-center gap-4 mb-6">
                <img src={emp.avatar} alt={emp.name} className="w-16 h-16 rounded-2xl shadow-md border-2 border-white" />
                <div>
                  <h3 className="text-xl font-bold text-emerald-900">{emp.name}</h3>
                  <p className="text-emerald-600 font-medium">{emp.role}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-emerald-700 uppercase mb-1">Base Salary</p>
                  <p className="text-lg font-bold text-emerald-900">{formatCurrency(emp.baseSalary)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-700 uppercase mb-1">Commission</p>
                  <p className="text-lg font-bold text-emerald-900">{(emp.commissionRate * 100)}%</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-700 uppercase mb-1">Total Earned (YTD)</p>
                  <p className="text-lg font-bold text-emerald-900">{formatCurrency(emp.baseSalary * 1.2)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-700 uppercase mb-1">Joined Date</p>
                  <p className="text-emerald-800 text-sm">{new Date(emp.joinedDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50/50 p-8 w-full sm:w-48 border-l border-emerald-100/50 flex flex-col justify-center items-center text-center">
              <div className="mb-4">
                <p className="text-[10px] font-bold text-emerald-500 uppercase mb-2">Efficiency</p>
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-emerald-100" />
                    <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={213} strokeDashoffset={213 * (1 - 0.85)} className="text-emerald-600" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-bold text-emerald-900">85%</span>
                </div>
              </div>
              <button className="text-xs font-bold text-emerald-600 hover:text-emerald-800 underline">View Full Profile</button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass p-8 rounded-3xl shadow-sm">
        <h4 className="text-emerald-900 font-bold mb-6">Payroll Summary (Current Month)</h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
            <span className="text-emerald-700">Total Base Salaries</span>
            <span className="font-bold text-emerald-900">{formatCurrency(6300)}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
            <span className="text-emerald-700">Total Commissions</span>
            <span className="font-bold text-emerald-900">{formatCurrency(840.50)}</span>
          </div>
          <div className="flex justify-between items-center p-6 bg-emerald-600 rounded-2xl shadow-lg">
            <span className="text-emerald-50 font-semibold">Total Payroll Disbursement</span>
            <span className="text-xl font-bold text-white">{formatCurrency(7140.50)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employees;
