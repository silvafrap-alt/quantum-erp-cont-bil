import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import { Provider } from "react-redux";
import store from "../store";
import * as addLancamento from "../utils/addLancamento";
import * as deleteLancamento from "../utils/deleteLancamento";
import * as updateLancamento from "../utils/updateLancamento";
import * as exportLancamentos from "../utils/exportLancamentos";

// Mock Firebase user
jest.mock("../store/hooks", () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: (fn: any) =>
    fn({
      auth: { user: { uid: "testUser" } },
      dashboard: { data: [], isLoading: false, error: null },
    }),
}));

describe("Dashboard Component", () => {
  test("renderiza título do Dashboard", () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  test("adiciona lançamento", async () => {
    const spy = jest.spyOn(addLancamento, "addLancamento").mockResolvedValueOnce(undefined);

    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Descrição"), {
      target: { value: "Teste entrada" },
    });
    fireEvent.change(screen.getByPlaceholderText("Valor"), {
      target: { value: "1000" },
    });
    fireEvent.click(screen.getByText("Adicionar"));

    expect(spy).toHaveBeenCalled();
  });

  test("apaga lançamento", async () => {
    const spy = jest.spyOn(deleteLancamento, "deleteLancamento").mockResolvedValueOnce(undefined);

    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    // Simula um lançamento existente
    const lancamento = { id: "abc123", descricao: "Venda", valor: 500, tipo: "entrada" };
    store.dispatch({
      type: "dashboard/setData",
      payload: [lancamento],
    });

    fireEvent.click(screen.getByText("Apagar"));
    expect(spy).toHaveBeenCalledWith(expect.any(String), "abc123");
  });

  test("edita lançamento", async () => {
    const spy = jest.spyOn(updateLancamento, "updateLancamento").mockResolvedValueOnce(undefined);

    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    const lancamento = { id: "abc123", descricao: "Venda", valor: 500, tipo: "entrada" };
    store.dispatch({
      type: "dashboard/setData",
      payload: [lancamento],
    });

    fireEvent.click(screen.getByText("Editar"));
    fireEvent.change(screen.getByDisplayValue("Venda"), {
      target: { value: "Venda atualizada" },
    });
    fireEvent.click(screen.getByText("Guardar"));

    expect(spy).toHaveBeenCalled();
  });

  test("exporta CSV", () => {
    const spy = jest.spyOn(exportLancamentos, "exportLancamentosCSV").mockImplementation(() => {});

    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    fireEvent.click(screen.getByText("Exportar CSV"));
    expect(spy).toHaveBeenCalled();
  });
});
