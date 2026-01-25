import { fetchLancamentos } from "../dashboardSlice";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

// Mock Firestore
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}));

describe("fetchLancamentos", () => {
  it("deve devolver lançamentos reais da empresa", async () => {
    // Mock de snapshot com dados
    (getDocs as jest.Mock).mockResolvedValueOnce({
      empty: false,
      docs: [{ id: "company123" }],
    });

    (getDocs as jest.Mock).mockResolvedValueOnce({
      docs: [
        { id: "l1", data: () => ({ tipo: "entrada", valor: 100 }) },
        { id: "l2", data: () => ({ tipo: "saida", valor: 40 }) },
      ],
    });

    const result = await fetchLancamentos("user123")(jest.fn(), jest.fn(), {});
    expect(result).toEqual([
      { id: "l1", tipo: "entrada", valor: 100 },
      { id: "l2", tipo: "saida", valor: 40 },
    ]);
  });

  it("deve devolver [] se não houver empresa", async () => {
    (getDocs as jest.Mock).mockResolvedValueOnce({ empty: true });
    const result = await fetchLancamentos("user123")(jest.fn(), jest.fn(), {});
    expect(result).toEqual([]);
  });
});
