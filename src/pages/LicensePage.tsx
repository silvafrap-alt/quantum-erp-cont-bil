import { useCompany } from "../contexts/CompanyContext";

export default function LicensePage() {
  const { activeCompany } = useCompany();

  if (!activeCompany) {
    return <p>Selecione uma empresa para ver a licença.</p>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Licença</h2>

      <p>
        Licença associada à empresa:{" "}
        <strong>{activeCompany.name}</strong>
      </p>

      <p>
        O sistema de licenciamento será ativado numa fase posterior.
      </p>
    </div>
  );
}
