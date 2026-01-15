import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useCompany } from "../contexts/CompanyContext";
import { useNavigate, Outlet } from "react-router-dom";

export default function MainLayout() {
  const { setActiveCompany } = useCompany();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    setActiveCompany(null);
    navigate("/login");
  };

  return (
    <div>
      <header>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
