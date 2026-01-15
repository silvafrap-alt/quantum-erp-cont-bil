import { useCompany } from "../contexts/CompanyContext";
import { useNavigate } from "react-router-dom";

export default function SelectCompanyPage() {
  const { companies, setActiveCompany } = useCompany();
  const navigate = useNavigate();

  if (companies.length === 0) {
    return <p>Nenhuma empresa encontrada</p>;
  }

  return (
    <div>
      <h1>Selecione uma empresa</h1>

      {companies.map((company) => (
        <button
          key={company.id}
          onClick={() => {
            setActiveCompany(company);
            navigate("/dashboard");
          }}
        >
          {company.name}
        </button>
      ))}
    </div>
  );
}
