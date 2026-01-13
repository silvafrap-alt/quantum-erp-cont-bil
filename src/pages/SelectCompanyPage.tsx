import { useNavigate } from "react-router-dom";
import { useCompany } from "../contexts/CompanyContext";

export default function SelectCompanyPage() {
  const { companies, setActiveCompanyId, loading } = useCompany();
  const navigate = useNavigate();

  if (loading) return <h1>A carregar empresas...</h1>;

  if (companies.length === 0) {
    return <h1>Nenhuma empresa encontrada</h1>;
  }

  return (
    <div>
      <h1>Seleciona uma empresa</h1>
      <ul>
        {companies.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => {
                setActiveCompanyId(c.id);
                navigate("/dashboard");
              }}
            >
              {c.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

