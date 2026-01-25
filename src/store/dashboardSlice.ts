import { RootState } from "./store";

// Verifica se pode criar lançamento
export const canCreateLancamento = (state: RootState): boolean => {
  const plan = state.billing.plan;
  const lancamentos = state.dashboard.data.length;

  return !(plan?.limits?.maxLancamentos && lancamentos >= plan.limits.maxLancamentos);
};

// Verifica se pode atualizar lançamento
export const canUpdateLancamento = (state: RootState, lancamentoId: string): boolean => {
  const plan = state.billing.plan;
  // Aqui podes colocar regras específicas de atualização
  return !!plan; // Exemplo simples: se tiver plano ativo, pode atualizar
};

// Verifica se pode apagar lançamento
export const canDeleteLancamento = (state: RootState, lancamentoId: string): boolean => {
  const plan = state.billing.plan;
  // Aqui podes colocar regras específicas de exclusão
  return !!plan; // Exemplo simples: se tiver plano ativo, pode apagar
};
