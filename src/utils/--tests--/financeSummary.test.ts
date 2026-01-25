import { calcularResumo } from "../financeSummary";

describe("Função calcularResumo", () => {
  it("deve calcular corretamente entradas, saídas e saldo", () => {
    const lancamentos = [
      { tipo: "entrada", valor: 1000 },
      { tipo: "saida", valor: 300 },
      { tipo: "entrada", valor: 500 },
      { tipo: "saida", valor: 200 },
    ];

    const resultado = calcularResumo(lancamentos);

    expect(resultado).toEqual({
      totalEntradas: 1500,
      totalSaidas: 500,
      saldo: 1000,
    });
  });

  it("deve lidar com valores inválidos ou ausentes", () => {
    const lancamentos = [
      { tipo: "entrada", valor: "abc" },
      { tipo: "saida", valor: null },
      { tipo: "entrada", valor: 700 },
    ];

    const resultado = calcularResumo(lancamentos);

    expect(resultado).toEqual({
      totalEntradas: 700,
      totalSaidas: 0,
      saldo: 700,
    });
  });

  it("deve retornar zero quando não há lançamentos", () => {
    const resultado = calcularResumo([]);

    expect(resultado).toEqual({
      totalEntradas: 0,
      totalSaidas: 0,
      saldo: 0,
    });
  });
});
