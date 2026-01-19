import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

type Lancamento = {
  id: string;
  tipo: "receita" | "despesa";
  valor: number;
  descricao?: string;
  data: string;
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
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

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Lancamento, "id">),
        }));

        setLancamentos(data);
      } catch (e) {
        console.error(e);
        setErro("Erro ao carregar lançamentos.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  /* ─────────── RENDERIZAÇÕES SEGURAS ─────────── */

  if (loading) {
    return <p style={{ padding: 20 }}>A carregar dashboard…</p>;
  }

  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <p>Utilizador não autenticado.</p>
        <button onClick={() => navigate("/login")}>Ir para Login</button>
      </div>
    );
  }

  if (erro) {
    return (
      <div style={{ padding: 20 }}>
        <p>{erro}</p>
      </div>
    );
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Bem-vindo, {user.email}</p>

      <button onClick={() => navigate("/novo-lancamento")}>
        ➕ Novo Lançamento
      </button>

      <hr />

      {lancamentos.length === 0 && <p>Sem lançamentos ainda.</p>}

      {lancamentos.length > 0 && (
        <ul>
          {lancamentos.map((l) => (
            <li key={l.id}>
              {l.data} — {l.tipo} — {l.descricao || "Sem descrição"} —{" "}
              {l.valor}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
