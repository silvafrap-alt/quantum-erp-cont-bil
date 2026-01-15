import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user, loading } = useAuth();

  // ⏳ Aguarda Firebase decidir
  if (loading) {
    return <div style={{ padding: 40 }}>A verificar sessão…</div>;
  }

  // ❌ Não autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Autenticado
  return children;
}
