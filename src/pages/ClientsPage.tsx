import { useCompany } from "../contexts/CompanyContext";

export default function ClientsPage() {
  const { activeCompany } = useCompany();

  if (!activeCompany) {
    return <p>Selecione uma empresa para ver os clientes.</p>;
  }

  const activeCompanyId = activeCompany.id;

  return (
    <div style={{ padding: 40 }}>
      <h2>Clientes</h2>

      <p>
        Empresa ativa: <strong>{activeCompany.name}</strong>
      </p>

      <p>
        (ID interno: {activeCompanyId})
      </p>

      <p>
        A gestão completa de clientes será ativada numa fase posterior.
      </p>
    </div>
  );
}
