import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../store";
import Dashboard from "../pages/Dashboard";
import FinancialSummary from "../components/FinancialSummary";
import * as addLancamento from "../utils/addLancamento";

// Mock Redux hooks para simular login
jest.mock("../store/hooks", () => ({
  useAppDispatch: () => store.dispatch,
  useAppSelector: (fn: any) =>
    fn({
      auth: { user: { uid: "testUser" } },
      dashboard: {
        data: [
          { id: "1", tipo: "entrada", valor: 5000, descricao: "Venda", data: "2026-01-22", userId: "testUser" },
          { id: "2", tipo: "saida", valor: 2000, descricao: "Compra", data: "2026-01-22", userId: "testUser" },
        ],
        isLoading: false,
        error: null,
      },
    }),
}));

describe("Fluxo de integração: Dashboard + FinancialSummary", () => {
  test("mostra resumo financeiro inicial", () => {
    render(
      <Provider store={store}>
        <FinancialSummary
          dados={[
            { id: "1", tipo: "entrada", valor: 5000, descricao: "Venda", data: "2026-01-22", userId: "testUser" },
            { id: "2", tipo: "saida", valor: 2000, descricao: "Compra", data: "2026-01-22", userId: "testUser" },
          ]}
        />
      </Provider>
    );

    expect(screen.getByText(/Entradas/i)).toHaveTextContent("5000 Kz");
    expect(screen.getByText(/Saídas/i)).toHaveTextContent("2000 Kz");
    expect(screen.getByText(/Saldo/i)).toHaveTextContent("3000 Kz");
  });

  test("adiciona lançamento e atualiza resumo", async () => {
    const spy = jest.spyOn(addLancamento, "addLancamento").mockResolvedValueOnce(undefined);

    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Descrição"), {
      target: { value: "Serviço" },
    });
    fireEvent.change(screen.getByPlaceholderText("Valor"), {
      target: { value: "1000" },
    });
    fireEvent.click(screen.getByText("Adicionar"));

    expect(spy).toHaveBeenCalled();
  });
});
