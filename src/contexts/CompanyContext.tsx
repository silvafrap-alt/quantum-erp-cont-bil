import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

export type Company = {
  id: string;
  name: string;
  ownerUserId: string;
};

type CompanyContextType = {
  companies: Company[];
  activeCompany: Company | null;
  setActiveCompanyId: (id: string) => void;
  loading: boolean;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchCompanies = async () => {
     const q = query(collection(db, "companies"));

      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Company, "id">),
      }));

      setCompanies(data);

      const storedId = localStorage.getItem("activeCompanyId");
      const found = data.find((c) => c.id === storedId) || null;
      setActiveCompany(found);

      setLoading(false);
    };

    fetchCompanies();
  }, [user]);

  const setActiveCompanyId = (id: string) => {
    const company = companies.find((c) => c.id === id) || null;
    setActiveCompany(company);
    localStorage.setItem("activeCompanyId", id);
  };

  return (
    <CompanyContext.Provider
      value={{ companies, activeCompany, setActiveCompanyId, loading }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) {
    throw new Error("useCompany deve ser usado dentro de CompanyProvider");
  }
  return ctx;
}
