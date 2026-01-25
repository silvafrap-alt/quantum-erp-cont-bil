type Lancamento = {
  tipo: "entrada" | "saida";
  valor: number;
};

export function calcularResumo(lancamentos: Lancamento[]) {
  const totalEntradas = lancamentos
    .filter((l) => l.tipo === "entrada")
    .reduce((acc, l) => acc + l.valor, 0);

  const totalSaidas = lancamentos
    .filter((l) => l.tipo === "saida")
    .reduce((acc, l) => acc + l.valor, 0);

  const saldo = totalEntradas - totalSaidas;

  return { totalEntradas, totalSaidas, saldo };
}
