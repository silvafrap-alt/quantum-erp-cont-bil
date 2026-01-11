import { createContext, useContext } from "react";

type Branding = {
  primaryColor: string;
  logoUrl?: string;
};

const BrandingContext = createContext<Branding>({
  primaryColor: "#2563eb", // azul padrão
});

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  return (
    <BrandingContext.Provider value={{ primaryColor: "#2563eb" }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  return useContext(BrandingContext);
}
