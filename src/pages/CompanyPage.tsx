import { useCompany } from "../contexts/CompanyContext";
import type { Company } from "../contexts/CompanyContext";
import { useNavigate } from "react-router-dom";

export default function CompanyPage() {
  const { companies, setActiveCompany } = useCompany();
  const navigate = useNavigate();

  const handleSelect = (company: Company) => {
  setActiveCompany(company);
  navigate("/dashboard");
};

  if (companies.length === 0) {
    return <p>Nenhuma empresa encontrada.</p>;
  }

  return (
    <div>
      <h1>Empresas</h1>

      {companies.map((company) => (
        <button onClick={() => handleSelect(company)}>
          {company.name}
        </button>
      ))}
    </div>
  );
}
