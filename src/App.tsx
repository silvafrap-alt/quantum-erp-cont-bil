import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SelectCompanyPage from "./pages/SelectCompanyPage";
import DashboardPage from "./pages/DashboardPage";
import { useAuth } from "./contexts/AuthContext";
import { useCompany } from "./contexts/CompanyContext";

function Protected({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Carregando sessão…</p>;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function CompanyGate({ children }: { children: JSX.Element }) {
  const { activeCompany } = useCompany();
  if (!activeCompany) return <Navigate to="/select-company" replace />;
  return children;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/select-company"
          element={
            <Protected>
              <SelectCompanyPage />
            </Protected>
          }
        />

        <Route
          path="/dashboard"
          element={
            <Protected>
              <CompanyGate>
                <DashboardPage />
              </CompanyGate>
            </Protected>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
