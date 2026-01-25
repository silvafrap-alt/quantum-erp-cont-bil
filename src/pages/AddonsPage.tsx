import AddonsManager from "../components/AddonsManager";
import { useAppSelector } from "../store/hooks";

export default function AddonsPage() {
  const activeCompanyId = useAppSelector((s) => s.companies.activeId);
  if (!activeCompanyId) return <p>Selecione uma empresa primeiro.</p>;

  return <AddonsManager companyId={activeCompanyId} />;
}
