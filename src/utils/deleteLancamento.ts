import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function deleteLancamento(companyId: string, lancamentoId: string) {
  const ref = doc(db, "companies", companyId, "lancamentos", lancamentoId);
  await deleteDoc(ref);
}
