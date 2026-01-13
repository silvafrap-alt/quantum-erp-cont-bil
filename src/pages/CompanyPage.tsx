import { useCompany } from "../contexts/CompanyContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const { user } = useAuth();
console.log("UID REAL:", user?.uid);

export default function SelectCompanyPage() {
  const { companies, selectCompany } = useCompany();
  const navigate = useNavigate();

  if (companies.length === 0) {
    return <p>Nenhuma empresa encontrada.</p>;
  }

  const handleSelect = (id: string) => {
    selectCompany(id);
    navigate("/dashboard");
  };

  return (
    <div>
      <h1>Selecione uma empresa</h1>

      {companies.map((company) => (
        <button key={company.id} onClick={() => handleSelect(company.id)}>
          {company.name}
        </button>
      ))}
    </div>
  );
}

