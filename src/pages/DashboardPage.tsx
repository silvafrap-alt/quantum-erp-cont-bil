import { useCompany } from "../contexts/CompanyContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function DashboardPage() {
  const { activeCompany, clearCompany } = useCompany();

  return (
    <div style={{ padding: 40 }}>
      <h2>Dashboard</h2>
      <p>Empresa ativa: {activeCompany?.name}</p>
      <button
        onClick={async () => {
          clearCompany();
          await signOut(auth);
        }}
      >
        Logout
      </button>
    </div>
  );
}
