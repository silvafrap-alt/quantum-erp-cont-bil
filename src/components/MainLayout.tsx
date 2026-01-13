import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useCompany } from "../contexts/CompanyContext";
import { useNavigate } from "react-router-dom";

const { clearCompany } = useCompany();
const navigate = useNavigate();

const handleLogout = async () => {
  await signOut(auth);
  clearCompany();
  navigate("/login");
};
