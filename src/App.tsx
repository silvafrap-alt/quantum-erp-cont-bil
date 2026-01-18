import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NovoLancamento from "./pages/NovoLancamento";
import AuthGuard from "./components/AuthGuard";
import { getFirestore } from "firebase/firestore";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

       <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/novo-lancamento"
          element={
            <AuthGuard>
              <NovoLancamento />
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
