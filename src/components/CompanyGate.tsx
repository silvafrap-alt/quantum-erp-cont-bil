import { Navigate } from "react-router-dom";
import { useCompany } from "../contexts/CompanyContext";

export default function CompanyGate({ children }: { children: JSX.Element }) {
  const { activeCompany } = useCompany();

  if (!activeCompany) {
    return <Navigate to="/select-company" replace />;
  }

  return children;
}
