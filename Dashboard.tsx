import React, { useState } from 'react';
import {
  LayoutDashboard,
  PieChart,
  Wallet,
  Coins,
  ArrowRight,
  AlertOctagon,
  TrendingUp,
  CreditCard,
  Target,
  ShieldCheck,
  Calendar,
  Activity
} from 'lucide-react';
import { GOLD_PRICE_PER_GRAM } from '../constants';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics'>('dashboard');
  const [incomeStr, setIncomeStr] = useState('');
  const [expenseStr, setExpenseStr] = useState('');
  const [goldRatio, setGoldRatio] = useState(40); // Default 40% Gold, 60% Cash

  // Helpers
  const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num);
  const parseNumber = (str: string) => parseInt(str.replace(/\./g, '') || '0', 10);
  
  // Short format for charts (e.g. 1.2M, 2.5Milyar)
  const formatShort = (num: number) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'M'; // Milyar
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(0) + 'jt'; // Juta
    return (num / 1000).toFixed(0) + 'k';
  };

  const handleInput = (val: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const digits = val.replace(/\D/g, '');
    if (!digits) {
      setter('');
      return;
    }
    setter(formatNumber(parseInt(digits, 10)));
  };

  // --- CORE LOGIC ---
  const income = parseNumber(incomeStr);
  const expense = parseNumber(expenseStr);
  const surplus = income - expense;
  const isDeficit = surplus < 0;
  const hasData = income > 0;
  
  // Allocation Logic
  const effectiveSurplus = Math.max(0, surplus);
  const goldAlloc = Math.floor(effectiveSurplus * (goldRatio / 100));
  const cashAlloc = effectiveSurplus - goldAlloc;
  const goldGrams = goldAlloc / GOLD_PRICE_PER_GRAM;

  // --- ANALYTICS PROJECTIONS ---
  const annualSavings = effectiveSurplus * 12;
  const fiveYearSavings = annualSavings * 5;
  const tenYearSavings = annualSavings * 10;
  const annualGoldGrams = goldGrams * 12;
  const runwayMonths = expense > 0 ? (cashAlloc / expense) : 0; // Assuming accumulated cash is used

  // Chart Percentages (Visuals)
  let expensePct = 0;
  let cashPct = 0;
  let goldPct = 0;

  if (income > 0) {
    if (isDeficit) {
      expensePct = 100;
    } else {
      expensePct = (expense / income) * 100;
      const surplusPct = 100 - expensePct;
      goldPct = surplusPct * (goldRatio / 100);
      cashPct = surplusPct - goldPct;
    }
  }

  // Projection Chart Heights (Normalized to 100%)
  const maxVal = tenYearSavings || 1;
  const h1 = (annualSavings / maxVal) * 100;
  const h5 = (fiveYearSavings / maxVal) * 100;
  const h10 = 100;

  // Conic Gradient for Donut
  const chartGradient = income === 0
    ? '#e2e8f0 0% 100%'
    : isDeficit
      ? '#ef4444 0% 100%'
      : `conic-gradient(
          #ef4444 0% ${expensePct}%,
          #4318FF ${expensePct}% ${expensePct + cashPct}%,
          #F59E0B ${expensePct + cashPct}% 100%
        )`;

  // Financial Health Status
  const savingsRate = income > 0 ? (effectiveSurplus / income) * 100 : 0;
  let healthStatus = { label: 'Unknown', color: 'text-slate-400', bg: 'bg-slate-100' };
  if (isDeficit) healthStatus = { label: 'Bahaya (Defisit)', color: 'text-red-600', bg: 'bg-red-100' };
  else if (savingsRate < 10) healthStatus = { label: 'Warning (Tipis)', color: 'text-orange-600', bg: 'bg-orange-100' };
  else if (savingsRate < 30) healthStatus = { label: 'Sehat (Cukup)', color: 'text-blue-600', bg: 'bg-blue-100' };
  else healthStatus = { label: 'Sangat Sehat (Kaya)', color: 'text-emerald-600', bg: 'bg-emerald-100' };

  return (
    <div className="flex h-screen bg-[#F4F7FE] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white h-full hidden xl:flex flex-col py-8 px-6 border-r border-slate-200/50">
        <div className="flex items-center gap-3 mb-10 px-2">
           <div className="w-10 h-10 rounded-xl bg-[#4318FF] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#4318FF]/30">Z</div>
           <span className="text-2xl font-bold text-[#2B3674] tracking-tight">Zetfour Vision</span>
        </div>
        <nav className="space-y-4">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={PieChart} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
        </nav>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
           <div>
             <p className="text-sm text-[#707EAE] font-medium mb-1">Hi, Investor</p>
             <div className="flex items-center gap-3">
                {/* Mobile/Tablet Logo (Visible when Sidebar is hidden) */}
                <div className="xl:hidden w-8 h-8 rounded-lg bg-[#4318FF] flex items-center justify-center text-white font-bold text-lg shadow-md">Z</div>
                <h1 className="text-3xl font-bold text-[#2B3674]">Zetfour Vision</h1>
             </div>
           </div>
           {/* Simple Date/Profile Placeholder */}
           <div className="hidden md:flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-sm font-bold text-[#2B3674]">IDR Mode</span>
              <div className="w-8 h-8 rounded-full bg-[#4318FF] text-white flex items-center justify-center text-xs font-bold">ID</div>
           </div>
        </header>

        {activeTab === 'dashboard' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1600px] animate-fade-in">
            {/* LEFT COLUMN: Input & Config */}
            <div className="space-y-6">
              {/* Card 1: Inputs */}
              <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-[0px_20px_27px_0px_rgba(0,0,0,0.05)]">
                 <h3 className="text-xl font-bold text-[#2B3674] mb-6">Financial Input</h3>
                 <div className="space-y-5">
                   <div>
                     <label className="text-sm font-bold text-[#A3AED0] mb-2 block">Monthly Income</label>
                     <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4318FF] font-bold">Rp</span>
                       <input
                         type="text"
                         inputMode="numeric"
                         value={incomeStr}
                         onChange={(e) => handleInput(e.target.value, setIncomeStr)}
                         className="w-full bg-[#F4F7FE] rounded-2xl py-4 pl-12 pr-4 text-[#2B3674] font-bold text-xl outline-none focus:ring-2 focus:ring-[#4318FF] transition-all"
                         placeholder="0"
                       />
                     </div>
                   </div>
                   <div>
                     <label className="text-sm font-bold text-[#A3AED0] mb-2 block">Monthly Expense</label>
                     <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#EF4444] font-bold">Rp</span>
                       <input
                         type="text"
                         inputMode="numeric"
                         value={expenseStr}
                         onChange={(e) => handleInput(e.target.value, setExpenseStr)}
                         className="w-full bg-[#F4F7FE] rounded-2xl py-4 pl-12 pr-4 text-[#2B3674] font-bold text-xl outline-none focus:ring-2 focus:ring-[#EF4444] transition-all"
                         placeholder="0"
                       />
                     </div>
                   </div>
                 </div>
              </div>

              {/* Card 2: Strategy Config (Slider) */}
              <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-[0px_20px_27px_0px_rgba(0,0,0,0.05)]">
                 <div className="flex justify-between items-center mb-8">
                   <h3 className="text-xl font-bold text-[#2B3674]">Strategy Config</h3>
                   <span className="px-3 py-1 bg-[#F4F7FE] text-[#4318FF] rounded-lg text-xs font-bold">
                     Auto-Balance
                   </span>
                 </div>

                 {/* Slider UI */}
                 <div className="bg-[#F4F7FE] rounded-2xl p-6 md:p-8">
                    <div className="flex justify-between text-sm font-bold text-[#A3AED0] mb-6">
                      <span className={goldRatio < 50 ? 'text-[#4318FF]' : ''}>Cash Priority</span>
                      <span className={goldRatio > 50 ? 'text-[#F59E0B]' : ''}>Gold Priority</span>
                    </div>

                    <div className="relative h-6 mb-6">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goldRatio}
                        onChange={(e) => setGoldRatio(parseInt(e.target.value))}
                        className="w-full absolute z-20 opacity-0 cursor-pointer h-full"
                      />
                      {/* Visual Track */}
                      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#4318FF] to-[#F59E0B]" 
                          style={{ width: `${goldRatio}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-2 items-center">
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#4318FF]"></div>
                          <span className="text-sm font-bold text-[#2B3674]">Cash: {100 - goldRatio}%</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
                          <span className="text-sm font-bold text-[#2B3674]">Gold: {goldRatio}%</span>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Results & Analytics */}
            <div className="space-y-6">
               {/* Result Card */}
               <div className="bg-[#4318FF] rounded-[24px] p-8 text-white shadow-xl shadow-[#4318FF]/20 relative overflow-hidden transition-all hover:scale-[1.01]">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  
                  <p className="text-white/70 font-medium mb-1">Total Surplus (Sisa Uang)</p>
                  <h2 className="text-5xl font-bold mb-8 tracking-tight">
                     {isDeficit ? '-' : ''}Rp {formatNumber(Math.abs(surplus))}
                  </h2>

                  <div className="grid grid-cols-2 gap-4 relative z-10">
                     <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                           <CreditCard className="w-4 h-4 text-blue-200" />
                           <span className="text-sm font-bold text-blue-100">Target Cash</span>
                        </div>
                        <p className="text-xl font-bold">Rp {formatNumber(cashAlloc)}</p>
                     </div>
                     <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                           <Coins className="w-4 h-4 text-amber-200" />
                           <span className="text-sm font-bold text-amber-100">Target Gold</span>
                        </div>
                        <p className="text-xl font-bold">Rp {formatNumber(goldAlloc)}</p>
                     </div>
                  </div>
               </div>

               {/* Deep Analytics */}
               <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-[0px_20px_27px_0px_rgba(0,0,0,0.05)] h-fit">
                  <h3 className="text-xl font-bold text-[#2B3674] mb-8">Deep Analytics</h3>
                  
                  <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                     {/* Donut Chart */}
                     <div className="relative w-56 h-56 shrink-0">
                        <div 
                           className="absolute inset-0 rounded-full transition-all duration-700 ease-out shadow-lg"
                           style={{ background: chartGradient }}
                        ></div>
                        <div className="absolute inset-6 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                           <span className="text-[#A3AED0] text-xs font-bold uppercase tracking-wider">Health</span>
                           <span className={`text-3xl font-bold ${isDeficit ? 'text-red-500' : 'text-emerald-500'}`}>
                             {isDeficit ? '!' : `${savingsRate.toFixed(0)}%`}
                           </span>
                        </div>
                     </div>

                     {/* Detail List */}
                     <div className="flex-1 w-full space-y-4">
                        <div className="flex justify-between items-center p-4 bg-[#F4F7FE] rounded-2xl">
                           <div className="flex items-center gap-3">
                              <div className="w-2 h-8 rounded-full bg-[#EF4444]"></div>
                              <div>
                                 <p className="text-xs text-[#A3AED0] font-bold uppercase">Living Cost</p>
                                 <p className="text-sm font-bold text-[#2B3674]">Rp {formatNumber(expense)}</p>
                              </div>
                           </div>
                           <span className="text-sm font-bold text-[#A3AED0]">{expensePct.toFixed(0)}%</span>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-[#F4F7FE] rounded-2xl">
                           <div className="flex items-center gap-3">
                              <div className="w-2 h-8 rounded-full bg-[#4318FF]"></div>
                              <div>
                                 <p className="text-xs text-[#A3AED0] font-bold uppercase">Safety Cash</p>
                                 <p className="text-sm font-bold text-[#2B3674]">Rp {formatNumber(cashAlloc)}</p>
                              </div>
                           </div>
                           <span className="text-sm font-bold text-[#A3AED0]">{cashPct.toFixed(0)}%</span>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-[#F4F7FE] rounded-2xl">
                           <div className="flex items-center gap-3">
                              <div className="w-2 h-8 rounded-full bg-[#F59E0B]"></div>
                              <div>
                                 <p className="text-xs text-[#A3AED0] font-bold uppercase">Gold Asset</p>
                                 <p className="text-sm font-bold text-[#2B3674]">Rp {formatNumber(goldAlloc)}</p>
                              </div>
                           </div>
                           <span className="text-sm font-bold text-[#A3AED0]">{goldPct.toFixed(0)}%</span>
                        </div>
                     </div>
                  </div>

                  {/* Conclusion */}
                  <div className={`p-5 rounded-2xl ${healthStatus.bg} border-l-8 ${healthStatus.color.replace('text', 'border')} flex items-center gap-4 transition-colors duration-300`}>
                     <Target className={`w-8 h-8 ${healthStatus.color}`} />
                     <div>
                        <p className={`text-base font-bold ${healthStatus.color}`}>Kondisi Keuangan: {healthStatus.label}</p>
                        {!isDeficit && goldGrams > 0 && (
                           <p className="text-sm text-[#2B3674]/70 mt-1 font-medium">Potensi emas: <span className="text-[#F59E0B] font-bold">{goldGrams.toFixed(2)} gram</span> bulan ini.</p>
                        )}
                        {isDeficit && (
                          <p className="text-sm text-red-600/80 mt-1 font-medium">Segera kurangi pengeluaran atau cari tambahan income.</p>
                        )}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          /* --- ANALYTICS TAB REAL IMPLEMENTATION --- */
          <div className="animate-fade-in max-w-[1600px]">
            {!hasData ? (
               <div className="flex flex-col items-center justify-center h-[50vh] text-center bg-white rounded-[24px] shadow-sm p-10">
                  <PieChart className="w-20 h-20 text-[#A3AED0] mb-6 opacity-50" />
                  <h3 className="text-2xl font-bold text-[#2B3674] mb-2">No Data Available</h3>
                  <p className="text-[#A3AED0] max-w-md">Please enter your Income and Expenses in the Dashboard tab to see your Future Wealth Projections.</p>
                  <button 
                     onClick={() => setActiveTab('dashboard')} 
                     className="mt-8 px-8 py-3 bg-[#4318FF] text-white rounded-xl font-bold hover:bg-[#3311CC] transition-colors"
                  >
                     Go to Dashboard
                  </button>
               </div>
            ) : (
               <div className="space-y-8">
                  {/* Row 1: Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-white p-6 rounded-[24px] shadow-[0px_10px_20px_0px_rgba(0,0,0,0.03)] border border-slate-50">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="p-2 bg-[#4318FF]/10 rounded-full text-[#4318FF]"><Target className="w-5 h-5"/></div>
                           <p className="text-[#A3AED0] text-sm font-bold">Annual Savings Potential</p>
                        </div>
                        <h3 className="text-2xl font-bold text-[#2B3674]">Rp {formatShort(annualSavings)}</h3>
                        <p className="text-xs text-[#4318FF] mt-1 font-medium">Based on current monthly surplus</p>
                     </div>

                     <div className="bg-white p-6 rounded-[24px] shadow-[0px_10px_20px_0px_rgba(0,0,0,0.03)] border border-slate-50">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="p-2 bg-[#F59E0B]/10 rounded-full text-[#F59E0B]"><Coins className="w-5 h-5"/></div>
                           <p className="text-[#A3AED0] text-sm font-bold">Projected Gold (1 Year)</p>
                        </div>
                        <h3 className="text-2xl font-bold text-[#2B3674]">{annualGoldGrams.toFixed(1)} grams</h3>
                        <p className="text-xs text-[#F59E0B] mt-1 font-medium">Asset protection strategy</p>
                     </div>

                     <div className="bg-white p-6 rounded-[24px] shadow-[0px_10px_20px_0px_rgba(0,0,0,0.03)] border border-slate-50">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="p-2 bg-emerald-100 rounded-full text-emerald-600"><ShieldCheck className="w-5 h-5"/></div>
                           <p className="text-[#A3AED0] text-sm font-bold">Financial Runway</p>
                        </div>
                        <h3 className="text-2xl font-bold text-[#2B3674]">{runwayMonths.toFixed(1)} Months</h3>
                        <p className="text-xs text-emerald-600 mt-1 font-medium">Survival time per month saved</p>
                     </div>
                  </div>

                  {/* Row 2: Wealth Projection & Risk */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     
                     {/* Wealth Chart */}
                     <div className="lg:col-span-2 bg-white rounded-[24px] p-8 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.03)]">
                        <div className="flex items-center justify-between mb-8">
                           <h3 className="text-xl font-bold text-[#2B3674] flex items-center gap-2">
                              <TrendingUp className="w-6 h-6 text-[#4318FF]" />
                              Wealth Growth Forecast
                           </h3>
                           <div className="flex gap-4 text-xs font-bold text-[#A3AED0]">
                              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#4318FF]"></span> Cash</span>
                              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span> Gold</span>
                           </div>
                        </div>

                        {/* Custom Bar Chart */}
                        <div className="h-64 flex items-end justify-around gap-4 md:gap-12 pb-6 border-b border-gray-100">
                           {/* 1 Year */}
                           <div className="flex flex-col items-center gap-3 w-20 group cursor-pointer">
                              <div className="w-full bg-[#F4F7FE] rounded-t-xl overflow-hidden flex flex-col-reverse relative hover:scale-105 transition-transform" style={{ height: '220px' }}>
                                 <div className="bg-[#4318FF] w-full transition-all duration-1000" style={{ height: `${h1 * (1 - goldRatio/100)}%` }}></div>
                                 <div className="bg-[#F59E0B] w-full transition-all duration-1000 delay-100" style={{ height: `${h1 * (goldRatio/100)}%` }}></div>
                              </div>
                              <div className="text-center">
                                 <p className="text-sm font-bold text-[#2B3674]">1 Year</p>
                                 <p className="text-[10px] text-[#A3AED0] font-bold">Rp {formatShort(annualSavings)}</p>
                              </div>
                           </div>

                           {/* 5 Years */}
                           <div className="flex flex-col items-center gap-3 w-20 group cursor-pointer">
                              <div className="w-full bg-[#F4F7FE] rounded-t-xl overflow-hidden flex flex-col-reverse relative hover:scale-105 transition-transform" style={{ height: '220px' }}>
                                 <div className="bg-[#4318FF] w-full transition-all duration-1000" style={{ height: `${h5 * (1 - goldRatio/100)}%` }}></div>
                                 <div className="bg-[#F59E0B] w-full transition-all duration-1000 delay-100" style={{ height: `${h5 * (goldRatio/100)}%` }}></div>
                              </div>
                              <div className="text-center">
                                 <p className="text-sm font-bold text-[#2B3674]">5 Years</p>
                                 <p className="text-[10px] text-[#A3AED0] font-bold">Rp {formatShort(fiveYearSavings)}</p>
                              </div>
                           </div>

                           {/* 10 Years */}
                           <div className="flex flex-col items-center gap-3 w-20 group cursor-pointer">
                              <div className="w-full bg-[#F4F7FE] rounded-t-xl overflow-hidden flex flex-col-reverse relative hover:scale-105 transition-transform" style={{ height: '220px' }}>
                                 <div className="bg-[#4318FF] w-full transition-all duration-1000" style={{ height: `${h10 * (1 - goldRatio/100)}%` }}></div>
                                 <div className="bg-[#F59E0B] w-full transition-all duration-1000 delay-100" style={{ height: `${h10 * (goldRatio/100)}%` }}></div>
                              </div>
                              <div className="text-center">
                                 <p className="text-sm font-bold text-[#2B3674]">10 Years</p>
                                 <p className="text-[10px] text-[#A3AED0] font-bold">Rp {formatShort(tenYearSavings)}</p>
                              </div>
                           </div>
                        </div>
                        <p className="text-xs text-[#A3AED0] mt-4 text-center">*Linear projection without inflation adjustment</p>
                     </div>

                     {/* Risk Profile Card */}
                     <div className="bg-[#1B254B] rounded-[24px] p-8 text-white shadow-lg flex flex-col justify-between">
                        <div>
                           <h3 className="text-lg font-bold mb-1">Risk Profile</h3>
                           <p className="text-gray-400 text-sm">Based on savings rate</p>
                           
                           <div className="mt-8 text-center">
                              <div className="relative inline-block">
                                 <Activity className={`w-12 h-12 mx-auto mb-2 ${savingsRate > 20 ? 'text-emerald-400' : 'text-orange-400'}`} />
                              </div>
                              <div className={`text-5xl font-bold mb-2 ${savingsRate < 20 ? 'text-orange-400' : 'text-emerald-400'}`}>
                                 {savingsRate.toFixed(0)}%
                              </div>
                              <p className="text-xs uppercase tracking-widest font-bold opacity-70">Savings Rate</p>
                           </div>

                           <div className="mt-8 space-y-4">
                              <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                                 <span className="opacity-70">Status</span>
                                 <span className="font-bold text-white">
                                    {savingsRate > 50 ? 'Aggressive' : savingsRate > 20 ? 'Moderate' : 'Risky'}
                                 </span>
                              </div>
                              <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                                 <span className="opacity-70">Monthly Burn</span>
                                 <span className="font-bold text-white">Rp {formatShort(expense)}</span>
                              </div>
                           </div>
                        </div>
                        
                        <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors">
                           Export Report
                        </button>
                     </div>

                  </div>
               </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

// Sidebar Helper
const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${
       active 
       ? 'bg-[#4318FF] text-white shadow-lg shadow-[#4318FF]/30 font-bold' 
       : 'text-[#A3AED0] hover:bg-[#F4F7FE] hover:text-[#2B3674] font-medium'
    }`}
  >
    <Icon className={`w-6 h-6 ${active ? 'text-white' : ''}`} />
    <span className="text-base">{label}</span>
  </button>
);