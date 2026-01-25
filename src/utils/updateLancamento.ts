import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function updateLancamento(
  companyId: string,
  lancamentoId: string,
  novosDados: Partial<{
    tipo: "entrada" | "saida";
    valor: number;
    descricao: string;
    data: string;
  }>
) {
  const ref = doc(db, "companies", companyId, "lancamentos", lancamentoId);
  await updateDoc(ref, novosDados);
}
