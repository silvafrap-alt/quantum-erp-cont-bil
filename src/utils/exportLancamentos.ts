import Papa from "papaparse";
import { saveAs } from "file-saver";
import { Lancamento } from "../store/dashboardSlice";

export function exportLancamentosCSV(dados: Lancamento[]) {
  const csv = Papa.unparse(
    dados.map((l) => ({
      Descrição: l.descricao,
      Tipo: l.tipo,
      Valor: l.valor,
      Data: l.data,
      UserId: l.userId,
    }))
  );

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "lancamentos.csv");
}
