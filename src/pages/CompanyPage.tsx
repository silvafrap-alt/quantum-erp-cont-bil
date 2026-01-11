import { useCompany } from "../contexts/CompanyContext";

export default function SelectCompanyPage() {
  const { companies, selectCompany } = useCompany();

  if (companies.length === 0) {
    return <div>Nenhuma empresa disponível</div>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Selecione uma empresa</h2>

      <ul>
        {companies.map(company => (
          <li key={company.id}>
            <button onClick={() => selectCompany(company)}>
              {company.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

