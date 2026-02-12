import React, { useState, useEffect } from 'react';
import { FinancialData } from '../types';
import { ArrowRight, DollarSign, Wallet, PiggyBank, Coins } from 'lucide-react';

interface InputFormProps {
  initialData: FinancialData;
  onCalculate: (data: FinancialData) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ initialData, onCalculate }) => {
  const [formData, setFormData] = useState<FinancialData>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (field: keyof FinancialData, value: string) => {
    // Prevent negative numbers
    if (parseFloat(value) < 0) return;
    const numValue = value === '' ? 0 : parseFloat(value);
    setFormData((prev) => ({ ...prev, [field]: numValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  return (
    <div className="max-w-xl mx-auto animate-fade-in pt-8">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Financial Data Input</h2>
        <p className="text-gray-500">Enter your current metrics to generate a precise strategy.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 md:p-10 rounded-2xl border border-gray-200 shadow-card">
        {/* Income */}
        <div className="group">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Monthly Income</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
              <span className="text-gray-400 font-serif italic text-lg">Rp</span>
            </div>
            <input
              type="number"
              min="0"
              className="block w-full pl-8 pr-0 py-3 border-b border-gray-300 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-primary-600 focus:ring-0 sm:text-lg transition-colors bg-transparent"
              placeholder="0"
              value={formData.monthlySalary || ''}
              onChange={(e) => handleChange('monthlySalary', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Expenses */}
        <div className="group">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Monthly Expenses (Critical)</label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
              <span className="text-gray-400 font-serif italic text-lg">Rp</span>
            </div>
            <input
              type="number"
              min="0"
              className="block w-full pl-8 pr-0 py-3 border-b border-gray-300 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-primary-600 focus:ring-0 sm:text-lg transition-colors bg-transparent"
              placeholder="0"
              value={formData.monthlyExpenses || ''}
              onChange={(e) => handleChange('monthlyExpenses', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Savings */}
        <div className="group">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Current Cash Savings</label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
              <span className="text-gray-400 font-serif italic text-lg">Rp</span>
            </div>
            <input
              type="number"
              min="0"
              className="block w-full pl-8 pr-0 py-3 border-b border-gray-300 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-primary-600 focus:ring-0 sm:text-lg transition-colors bg-transparent"
              placeholder="0"
              value={formData.currentSavings || ''}
              onChange={(e) => handleChange('currentSavings', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Gold */}
        <div className="group">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Gold Assets</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              className="block w-full px-0 py-3 border-b border-gray-300 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-primary-600 focus:ring-0 sm:text-lg transition-colors bg-transparent"
              placeholder="0"
              value={formData.goldGrams || ''}
              onChange={(e) => handleChange('goldGrams', e.target.value)}
              required
            />
            <div className="absolute inset-y-0 right-0 pr-0 flex items-center pointer-events-none">
              <span className="text-gray-400 text-sm font-medium">grams</span>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg shadow-primary-600/20 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 transition-all"
          >
            Generate Analysis
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};