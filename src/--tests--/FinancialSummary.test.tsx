import FinancialSummary from "../FinancialSummary";
import { render, screen } from "@testing-library/react";

describe("FinancialSummary", () => {
  it("calcula corretamente entradas, saídas e saldo", () => {
    const dados = [
      { id: "1", tipo: "entrada", valor: 200 },
      { id: "2", tipo: "saida", valor: 50 },
    ];

    render(<FinancialSummary dados={dados} />);

    expect(screen.getByText(/Entradas: 200 Kz/)).toBeInTheDocument();
    expect(screen.getByText(/Saídas: 50 Kz/)).toBeInTheDocument();
    expect(screen.getByText(/Saldo: 150 Kz/)).toBeInTheDocument();
  });
});
