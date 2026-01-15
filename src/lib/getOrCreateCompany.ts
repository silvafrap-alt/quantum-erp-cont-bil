import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export async function getOrCreateCompany(userUid: string) {
  const q = query(
    collection(db, "companies"),
    where("ownerUid", "==", userUid)
  );

  const snap = await getDocs(q);

  if (!snap.empty) {
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
  }

  const docRef = await addDoc(collection(db, "companies"), {
    name: "Minha Empresa",
    ownerUid: userUid,
    createdAt: serverTimestamp(),
  });

  return { id: docRef.id, name: "Minha Empresa", ownerUid: userUid };
}
