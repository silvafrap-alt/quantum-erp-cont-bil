import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getOrCreateCompany } from "../lib/getOrCreateCompany";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    getOrCreateCompany(user.uid).then((c) => {
      setCompany(c);
      setLoading(false);
    });
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (loading) {
    return <div style={{ padding: 40 }}>A carregar dashboard…</div>;
  }

  return (
    <div style={{ padding: 32, fontFamily: "Arial, sans-serif" }}>
      <header style={{ marginBottom: 24 }}>
  <h2 style={{ marginBottom: 4 }}>Quantum ERP</h2>
  <p style={{ color: "#666" }}>Acesso ao painel</p>
  <p style={{ color: "#555" }}>
    Empresa: <strong>{company.name}</strong>
  </p>
</header>

      {/* CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <Card title="Clientes" value="12" />
        <Card title="Faturas" value="5" />
        <Card title="Receita (Mês)" value="€ 2.450" />
        <Card title="Despesas" value="€ 1.120" />
      </div>

      {/* INFO */}
      <section style={{ marginBottom: 24 }}>
        <h3>Resumo</h3>
        <p style={{ color: "#444" }}>
          Este é um dashboard inicial. Os dados serão ligados à base real nas
          próximas etapas.
        </p>
      </section>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

/* CARD COMPONENT */
function Card({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 16,
        background: "#fafafa",
      }}
    >
      <h4 style={{ margin: 0, marginBottom: 8 }}>{title}</h4>
      <strong style={{ fontSize: 20 }}>{value}</strong>
    </div>
  );
}
