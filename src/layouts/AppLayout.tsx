import { Link, Outlet } from "react-router-dom";
import { getAuth } from "firebase/auth";

export default function AppLayout() {
  const handleLogout = async () => {
    await getAuth().signOut();
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Menu lateral */}
      <aside
        style={{
          width: 220,
          padding: 20,
          background: "#f4f4f4",
        }}
      >
        <h3>Quantum</h3>

        <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/clients">Clientes</Link>
          <Link to="/reports">Relatórios</Link>

          <button onClick={handleLogout} style={{ marginTop: 20 }}>
            Logout
          </button>
        </nav>
      </aside>

      {/* Conteúdo das páginas */}
      <main style={{ flex: 1, padding: 40 }}>
        <Outlet />
      </main>
    </div>
  );
}
