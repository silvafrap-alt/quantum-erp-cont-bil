import { RootState } from "./store";

// Selector: pode criar lançamento?
export const canCreateLancamento = (state: RootState): boolean => {
  const plan = state.billing.plan;
  const lancamentos = state.dashboard.data.length;
  return !(plan?.limits?.maxLancamentos && lancamentos >= plan.limits.maxLancamentos);
};
