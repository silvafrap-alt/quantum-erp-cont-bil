import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

type Lancamento = {
  tipo: "entrada" | "saida";
  valor: number;
  descricao: string;
  data: string; // "2026-01-15"
  userId: string;
};

export async function addLancamento(companyId: string, lancamento: Lancamento) {
  const ref = collection(db, "companies", companyId, "lancamentos");
  await addDoc(ref, {
    ...lancamento,
    createdAt: serverTimestamp(),
  });
}
