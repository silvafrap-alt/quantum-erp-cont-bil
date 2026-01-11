import { useCompany } from "../contexts/CompanyContext";
import { useNavigate } from "react-router-dom";

export default function SelectCompanyPage() {
  const { companies, selectCompany } = useCompany();
  const nav = useNavigate();

  if (companies.length === 0) return <p>Nenhuma empresa.</p>;

  return (
    <div style={{ padding: 40 }}>
      <h2>Selecione uma empresa</h2>
      {companies.map(c => (
        <button
          key={c.id}
          style={{ display: "block", marginTop: 8 }}
          onClick={() => {
            selectCompany(c);
            nav("/dashboard");
          }}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
