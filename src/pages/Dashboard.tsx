import CompanySelector from "../components/CompanySelector";
import FinancialSummary from "../components/FinancialSummary";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <CompanySelector />
      <FinancialSummary dados={[]} />
    </div>
  );
}
