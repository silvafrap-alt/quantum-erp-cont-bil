import { createContext, useContext } from "react";

const CountryContext = createContext<string | null>(null);

export function CountryProvider({ children }: { children: React.ReactNode }) {
  return (
    <CountryContext.Provider value={null}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  return useContext(CountryContext);
}
