export interface FinancialData {
  monthlySalary: number;
  monthlyExpenses: number;
  currentSavings: number;
  goldGrams: number;
}

export enum PlanType {
  PLAN_A = 'PLAN_A',
  PLAN_B = 'PLAN_B',
  PLAN_C = 'PLAN_C',
}

export interface CalculationResult {
  planA: {
    target: number;
    progress: number;
    description: string;
  };
  planB: {
    targetCash: number;
    totalAsset: number;
    description: string;
  };
  planC: {
    targetBuffer: number;
    remainingCapital: number;
    description: string;
  };
}