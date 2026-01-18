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
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [stats, setStats] = useState({
    receitas: 0,
    despesas: 0,
    saldo: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setLoading(false);
        navigate("/login");
        return;
      }

      setUser(currentUser);

      const q = query(
        collection(db, "lancamentos"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const rows = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Lancamento, "id">),
      }));

      setLancamentos(rows);

      const receitas = rows
        .filter((r) => r.tipo === "receita")
        .reduce((s, r) => s + r.valor, 0);

      const despesas = rows
        .filter((r) => r.tipo === "despesa")
        .reduce((s, r) => s + r.valor, 0);

      setStats({
        receitas,
        despesas,
        saldo: receitas - despesas,
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const logout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  if (loading) return <p>A carregar dashboard...</p>;

  return (
    <main>
      <header>
        <h1>Quantum Contábil</h1>
        <span>Olá, {user?.email}</span>
        <button onClick={logout}>Logout</button>
      </header>

      <section>
        <h2>Resumo</h2>
        <p>Receitas: {stats.receitas}</p>
        <p>Despesas: {stats.despesas}</p>
        <p>Saldo: {stats.saldo}</p>

        <button onClick={() => navigate("/novo-lancamento")}>
          ➕ Novo Lançamento
        </button>
      </section>

      <section>
        <h3>Últimos lançamentos</h3>

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
      </section>
    </main>
  );
}
