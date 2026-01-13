import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <h1>Carregando sessão...</h1>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
