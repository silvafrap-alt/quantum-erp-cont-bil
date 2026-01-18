import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

export default function NovoLancamento() {
  const navigate = useNavigate();

  const [tipo, setTipo] = useState<"receita" | "despesa">("receita");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (!currentUser) {
      setLoading(false);
      navigate("/login");
      return;
    }

    setUser(currentUser);

    try {
      const q = query(
        collection(db, "lancamentos"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const rows = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLancamentos(rows as any[]);

      const receitas = rows
        .filter((r: any) => r.tipo === "receita")
        .reduce((s: number, r: any) => s + Number(r.valor), 0);

      const despesas = rows
        .filter((r: any) => r.tipo === "despesa")
        .reduce((s: number, r: any) => s + Number(r.valor), 0);

      setStats({
        receitas,
        despesas,
        saldo: receitas - despesas,
      });
    } catch (err) {
      console.error("Erro ao carregar lançamentos", err);
    } finally {
      setLoading(false);
    }
  });

  return () => unsubscribe();
}, [navigate]);
