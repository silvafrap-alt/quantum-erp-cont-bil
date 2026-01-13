import { Navigate } from "react-router-dom";
import { useCompany } from "../contexts/CompanyContext";

export default function CompanyGate({
  children,
}: {
  children: JSX.Element;
}) {
  const { activeCompany, loading } = useCompany();

  if (loading) {
    return <h1>Verificando empresa...</h1>;
  }

  if (!activeCompany) {
    return <Navigate to="/select-company" replace />;
  }

  return children;
}
