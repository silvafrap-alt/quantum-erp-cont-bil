import { useCompany } from "../contexts/CompanyContext";
import { Navigate } from "react-router-dom";

export default function CompanyGate({ children }: { children: React.ReactNode }) {
  const { activeCompany, loading } = useCompany();

  if (loading) return <p>A carregar empresa...</p>;

  if (!activeCompany) {
    return <Navigate to="/select-company" replace />;
  }

  return <>{children}</>;
}
