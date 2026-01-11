import { createContext, useContext, useEffect, useState } from "react";

export type Company = { id: string; name: string };

type CompanyCtx = {
  companies: Company[];
  activeCompany: Company | null;
  selectCompany: (c: Company) => void;
  clearCompany: () => void;
};

const CompanyContext = createContext<CompanyCtx | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  // Demo (trocas por API depois)
  const [companies] = useState<Company[]>([
    { id: "1", name: "Quantum Demo" },
  ]);

  const [activeCompany, setActiveCompany] = useState<Company | null>(() => {
    const saved = localStorage.getItem("activeCompany");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (activeCompany) {
      localStorage.setItem("activeCompany", JSON.stringify(activeCompany));
    }
  }, [activeCompany]);

  const selectCompany = (c: Company) => setActiveCompany(c);
  const clearCompany = () => {
    setActiveCompany(null);
    localStorage.removeItem("activeCompany");
  };

  return (
    <CompanyContext.Provider
      value={{ companies, activeCompany, selectCompany, clearCompany }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany fora do CompanyProvider");
  return ctx;
}



