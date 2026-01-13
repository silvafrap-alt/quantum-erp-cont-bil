import { HashRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import CompanyGate from "./components/CompanyGate";
import SelectCompanyPage from "./pages/SelectCompanyPage";
import { useAuth } from "./contexts/AuthContext";

function LoginPage() {
  return <h1>LOGIN OK</h1>;
}

function DashboardPage() {
  const { user } = useAuth();
  return (
    <div>
      <h1>DASHBOARD OK</h1>
      <p>User: {user?.email}</p>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/select-company"
          element={
            <ProtectedRoute>
              <SelectCompanyPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <CompanyGate>
                <DashboardPage />
              </CompanyGate>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </HashRouter>
  );
}
