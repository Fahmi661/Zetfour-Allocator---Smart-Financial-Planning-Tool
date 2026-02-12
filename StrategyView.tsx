import React, { useState, useMemo } from 'react';
import { FinancialData, PlanType } from '../types';
import { GOLD_PRICE_PER_GRAM, PLAN_DESCRIPTIONS } from '../constants';
import { ArrowLeft, CheckCircle2, AlertTriangle, TrendingUp, Briefcase, ShieldCheck, Info } from 'lucide-react';

interface StrategyViewProps {
  data: FinancialData;
  onBack: () => void;
}

export const StrategyView: React.FC<StrategyViewProps> = ({ data, onBack }) => {
  const [activeTab, setActiveTab] = useState<PlanType>(PlanType.PLAN_A);

  const calculations = useMemo(() => {
    // Plan A: OJK (6x Expenses)
    // Gap Logic: Target - Current. If negative, it's surplus.
    const planATarget = data.monthlyExpenses * 6;
    const planAGap = planATarget - data.currentSavings;
    const planAIsSurplus = planAGap <= 0;
    const planAProgress = Math.min((data.currentSavings / planATarget) * 100, 100);

    // Plan B: Gold (3x Expenses Cash + Gold Value)
    const planBTargetCash = data.monthlyExpenses * 3;
    const goldValue = data.goldGrams * GOLD_PRICE_PER_GRAM;
    const totalAsset = data.currentSavings + goldValue;
    const assetToCashRatio = planBTargetCash > 0 ? (totalAsset / planBTargetCash) * 100 : 0;

    // Plan C: Freelance (1x Expenses Buffer + Capital)
    const planCTargetBuffer = data.monthlyExpenses * 1;
    const workingCapital = data.currentSavings - planCTargetBuffer;
    const hasCapital = workingCapital > 0;

    return {
      [PlanType.PLAN_A]: {
        target: planATarget,
        gap: Math.abs(planAGap),
        isSurplus: planAIsSurplus,
        progress: planAProgress,
      },
      [PlanType.PLAN_B]: {
        targetCash: planBTargetCash,
        goldValue: goldValue,
        totalAsset: totalAsset,
        coverageRatio: assetToCashRatio,
      },
      [PlanType.PLAN_C]: {
        targetBuffer: planCTargetBuffer,
        workingCapital: workingCapital,
        hasCapital: hasCapital,
      },
    };
  }, [data]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="animate-fade-in space-y-8 pt-4">
      <div className="flex items-center justify-between">
         <button
          onClick={onBack}
          className="flex items-center text-gray-500 hover:text-gray-900 transition-colors gap-2 text-sm font-medium group"
        >
          <div className="p-2 rounded-full bg-white border border-gray-200 group-hover:border-gray-300 shadow-sm">
             <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="group-hover:translate-x-1 transition-transform">Back to Input</span>
        </button>
        <div className="text-right">
           <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Financial Health</div>
           <div className="text-lg font-bold text-gray-900">
             {calculations[PlanType.PLAN_A].isSurplus ? 'Excellent' : 'Building'}
           </div>
        </div>
      </div>

      {/* Corporate Tab System */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden min-h-[500px] flex flex-col">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab(PlanType.PLAN_A)}
            className={`flex-1 py-5 text-sm font-medium transition-all relative ${
              activeTab === PlanType.PLAN_A ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Core Safety
            {activeTab === PlanType.PLAN_A && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 animate-slide-in-left" />}
          </button>
          <button
            onClick={() => setActiveTab(PlanType.PLAN_B)}
            className={`flex-1 py-5 text-sm font-medium transition-all relative ${
              activeTab === PlanType.PLAN_B ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Asset Growth
            {activeTab === PlanType.PLAN_B && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 animate-slide-in-left" />}
          </button>
          <button
            onClick={() => setActiveTab(PlanType.PLAN_C)}
            className={`flex-1 py-5 text-sm font-medium transition-all relative ${
              activeTab === PlanType.PLAN_C ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Working Capital
            {activeTab === PlanType.PLAN_C && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 animate-slide-in-left" />}
          </button>
        </div>

        <div className="p-8 md:p-10 flex-grow">
          {activeTab === PlanType.PLAN_A && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <ShieldCheck className="text-primary-600 w-6 h-6" />
                    OJK Emergency Standard
                  </h3>
                  <p className="text-gray-500 mt-2 max-w-lg">{PLAN_DESCRIPTIONS.A}</p>
                </div>
              </div>

              <div className={`p-6 rounded-xl border ${calculations.PLAN_A.isSurplus ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-4 mb-4">
                   {calculations.PLAN_A.isSurplus ? (
                     <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                       <CheckCircle2 className="w-6 h-6" />
                     </div>
                   ) : (
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                       <Info className="w-6 h-6" />
                     </div>
                   )}
                   <div>
                     <h4 className={`text-lg font-bold ${calculations.PLAN_A.isSurplus ? 'text-green-800' : 'text-gray-900'}`}>
                       {calculations.PLAN_A.isSurplus ? 'Fully Secure' : 'Action Required'}
                     </h4>
                     <p className={`text-sm ${calculations.PLAN_A.isSurplus ? 'text-green-700' : 'text-gray-500'}`}>
                       {calculations.PLAN_A.isSurplus 
                         ? `You have a surplus of ${formatCurrency(calculations.PLAN_A.gap)} above the OJK standard.`
                         : `You are short by ${formatCurrency(calculations.PLAN_A.gap)} to reach the safety net.`}
                     </p>
                   </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-gray-500">Coverage Progress</span>
                    <span className="text-gray-900">{calculations.PLAN_A.progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${calculations.PLAN_A.isSurplus ? 'bg-green-500' : 'bg-primary-600'}`} 
                      style={{ width: `${calculations.PLAN_A.progress}%` }} 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                 <div>
                   <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Current Cash</p>
                   <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(data.currentSavings)}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Target (6 Months)</p>
                   <p className="text-2xl font-bold text-primary-600 mt-1">{formatCurrency(calculations.PLAN_A.target)}</p>
                 </div>
              </div>
            </div>
          )}

          {activeTab === PlanType.PLAN_B && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <TrendingUp className="text-primary-600 w-6 h-6" />
                    Portfolio Builder
                  </h3>
                  <p className="text-gray-500 mt-2 max-w-lg">{PLAN_DESCRIPTIONS.B}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm font-medium text-gray-500 mb-2">Liquid Cash Target (3 Mo)</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(calculations.PLAN_B.targetCash)}</p>
                </div>
                <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-subtle">
                   <p className="text-sm font-medium text-gray-500 mb-2">Gold Asset Value</p>
                   <p className="text-2xl font-bold text-yellow-600">{formatCurrency(calculations.PLAN_B.goldValue)}</p>
                   <p className="text-xs text-gray-400 mt-1">{data.goldGrams}g @ {formatCurrency(GOLD_PRICE_PER_GRAM)}</p>
                </div>
              </div>

              <div className="p-8 rounded-xl bg-gray-900 text-white shadow-card">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm uppercase tracking-widest font-semibold">Total Net Worth</span>
                    <TrendingUp className="text-green-400 w-5 h-5" />
                 </div>
                 <div className="text-4xl font-bold tracking-tight">
                   {formatCurrency(calculations.PLAN_B.totalAsset)}
                 </div>
                 <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between text-sm text-gray-400">
                    <span>Combined Liquid + Fixed</span>
                    <span>{calculations.PLAN_B.coverageRatio.toFixed(0)}% of 3-Mo Cash Target</span>
                 </div>
              </div>
            </div>
          )}

          {activeTab === PlanType.PLAN_C && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Briefcase className="text-primary-600 w-6 h-6" />
                    Capital Allocation
                  </h3>
                  <p className="text-gray-500 mt-2 max-w-lg">{PLAN_DESCRIPTIONS.C}</p>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                   <span className="text-gray-600 font-medium">Monthly Survival Buffer</span>
                   <span className="text-gray-900 font-bold">{formatCurrency(calculations.PLAN_C.targetBuffer)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                   <div className="bg-gray-400 h-1.5 rounded-full w-full opacity-50"></div>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-right italic">Reserved for personal survival</p>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-gray-200 shadow-card">
                 <div className={`p-8 ${calculations.PLAN_C.hasCapital ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <div className="relative z-10">
                      <p className={`text-sm font-semibold uppercase tracking-widest mb-2 ${calculations.PLAN_C.hasCapital ? 'text-blue-100' : 'text-gray-400'}`}>
                        Available Capital
                      </p>
                      <p className={`text-4xl font-bold ${calculations.PLAN_C.hasCapital ? 'text-white' : 'text-gray-400'}`}>
                        {calculations.PLAN_C.workingCapital > 0 ? formatCurrency(calculations.PLAN_C.workingCapital) : 'Rp 0'}
                      </p>
                      <div className="mt-6 flex items-start gap-3">
                        {calculations.PLAN_C.hasCapital ? (
                           <CheckCircle2 className="w-5 h-5 text-blue-200 mt-0.5" />
                        ) : (
                           <AlertTriangle className="w-5 h-5 text-gray-400 mt-0.5" />
                        )}
                        <p className={`text-sm leading-relaxed ${calculations.PLAN_C.hasCapital ? 'text-blue-50' : 'text-gray-500'}`}>
                           {calculations.PLAN_C.hasCapital 
                             ? "You have free capital available. This amount can be safely invested in inventory, tools, or ads without affecting your 1-month survival buffer."
                             : "Deficit warning. All your current cash is required for your 1-month survival buffer. You do not have safe capital for business expenses yet."}
                        </p>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};