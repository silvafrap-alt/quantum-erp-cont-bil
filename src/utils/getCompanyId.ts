import { query, where, getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";

export async function getCompanyIdByOwnerUid(ownerUid: string) {
  const q = query(collection(db, "companies"), where("ownerUid", "==", ownerUid));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    return snapshot.docs[0].id; // devolve o ID do documento da empresa
  }

  return null;
}
