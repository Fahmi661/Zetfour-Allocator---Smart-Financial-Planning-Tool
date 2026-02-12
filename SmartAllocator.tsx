import React, { useState } from 'react';
import { ArrowRight, Coins, Wallet, AlertOctagon, RefreshCw } from 'lucide-react';
import { GOLD_PRICE_PER_GRAM } from '../constants';

export const SmartAllocator: React.FC = () => {
  // Store values as formatted strings (e.g. "1.000.000")
  const [incomeStr, setIncomeStr] = useState('');
  const [expensesStr, setExpensesStr] = useState('');
  const [isCalculated, setIsCalculated] = useState(false);

  // Helper: Format number to IDR string
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  // Helper: Parse formatted string to number
  const parseCurrency = (str: string) => {
    return parseInt(str.replace(/\./g, '') || '0', 10);
  };

  const handleInputChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, '');
    if (digits === '') {
      setter('');
      return;
    }
    const num = parseInt(digits, 10);
    setter(formatCurrency(num));
    setIsCalculated(false); // Reset result on change
  };

  const income = parseCurrency(incomeStr);
  const expenses = parseCurrency(expensesStr);
  const remaining = income - expenses;
  const isDeficit = remaining < 0;

  // Allocation Logic
  const cashFund = Math.floor(remaining * 0.6);
  const goldFund = Math.floor(remaining * 0.4);
  const goldGrams = goldFund / GOLD_PRICE_PER_GRAM;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 animate-fade-in">
      {/* Main Glass Card */}
      <div className="glass-panel rounded-3xl shadow-2xl overflow-hidden p-8 md:p-10 transition-all duration-300">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-deepBlue to-vividPurple mb-2 tracking-tight">
            Zetfour
          </h1>
          <p className="text-slate-500 font-medium tracking-wide uppercase text-sm">Smart Allocator</p>
        </div>

        {/* Input Section */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Pemasukan Bulan Ini
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-0 text-slate-400 font-bold text-xl">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={incomeStr}
                  onChange={(e) => handleInputChange(e.target.value, setIncomeStr)}
                  placeholder="0"
                  className="w-full bg-transparent border-b-2 border-slate-200 py-3 pl-10 pr-4 text-2xl font-bold text-slate-800 placeholder-slate-300 focus:outline-none focus:border-vividPurple transition-colors"
                />
              </div>
            </div>

            <div className="group relative">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Pengeluaran Rutin
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-0 text-slate-400 font-bold text-xl">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={expensesStr}
                  onChange={(e) => handleInputChange(e.target.value, setExpensesStr)}
                  placeholder="0"
                  className="w-full bg-transparent border-b-2 border-slate-200 py-3 pl-10 pr-4 text-2xl font-bold text-slate-800 placeholder-slate-300 focus:outline-none focus:border-vividPurple transition-colors"
                />
              </div>
            </div>
          </div>

          {!isCalculated ? (
            <button
              onClick={() => setIsCalculated(true)}
              className="w-full bg-vividPurple hover:bg-indigo-600 text-white font-bold text-lg py-5 rounded-xl shadow-lg shadow-indigo-500/30 transform transition-all duration-200 hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Hitung Alokasi
              <ArrowRight className="w-6 h-6" />
            </button>
          ) : (
            <div className="animate-fade-in-up">
              <div className="border-t border-slate-100 pt-8 mt-4">
                {isDeficit ? (
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4">
                    <div className="bg-red-100 p-3 rounded-full shrink-0">
                      <AlertOctagon className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-red-700">Warning: Defisit Anggaran</h3>
                      <p className="text-red-600/80 mt-1">
                        Pengeluaranmu lebih besar dari pemasukan sebesar <span className="font-bold">Rp {formatCurrency(Math.abs(remaining))}</span>.
                        Segera kurangi pengeluaran tidak penting!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="text-center">
                      <p className="text-slate-400 font-medium text-sm uppercase tracking-widest mb-1">Total Sisa Dana</p>
                      <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
                        <span className="text-2xl font-bold text-slate-400 mr-1">Rp</span>
                        {formatCurrency(remaining)}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Cash Card */}
                      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 relative overflow-hidden group hover:shadow-lg transition-shadow">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Wallet className="w-24 h-24 text-blue-600" />
                        </div>
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                               <Wallet className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="font-bold text-blue-900">Dana Darurat (60%)</span>
                          </div>
                          <p className="text-3xl font-bold text-blue-700">Rp {formatCurrency(cashFund)}</p>
                          <p className="text-xs text-blue-500 mt-2 font-medium">Simpan di Rekening Terpisah</p>
                        </div>
                      </div>

                      {/* Gold Card */}
                      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 relative overflow-hidden group hover:shadow-lg transition-shadow">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Coins className="w-24 h-24 text-amber-600" />
                        </div>
                        <div className="relative z-10">
                           <div className="flex items-center gap-2 mb-3">
                            <div className="bg-amber-100 p-2 rounded-lg">
                               <Coins className="w-5 h-5 text-amber-600" />
                            </div>
                            <span className="font-bold text-amber-900">Investasi Emas (40%)</span>
                          </div>
                          <p className="text-3xl font-bold text-amber-700">Rp {formatCurrency(goldFund)}</p>
                          <p className="text-sm text-amber-600 mt-2 font-medium bg-amber-100/50 inline-block px-2 py-1 rounded">
                            ≈ {goldGrams.toFixed(3)} gram
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => setIsCalculated(false)}
                  className="w-full mt-8 py-3 text-slate-400 hover:text-vividPurple font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Hitung Ulang
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <p className="text-center text-white/40 text-xs mt-8 font-medium">
        &copy; Zetfour Allocator • Professional Finance Tool
      </p>
    </div>
  );
};