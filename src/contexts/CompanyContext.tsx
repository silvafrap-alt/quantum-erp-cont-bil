import { createContext, useContext, useState } from "react";

export type Company = {
  id: string;
  name: string;
};

type CompanyContextType = {
  companies: Company[];
  activeCompany: Company | null;
  setActiveCompany: (company: Company | null) => void;
  loading: boolean;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [companies] = useState<Company[]>([
    { id: "1", name: "Quantum Demo" }
  ]);

  const [activeCompany, setActiveCompany] = useState<Company | null>(null);
  const [loading] = useState(false);

  return (
    <CompanyContext.Provider
      value={{ companies, activeCompany, setActiveCompany, loading }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within CompanyProvider");
  }
  return context;
}
