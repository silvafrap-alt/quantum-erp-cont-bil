import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Country } from '../types';
import { MOCK_COUNTRIES } from '../data/mockData';
import { useCompany } from './CompanyContext';

interface CountryContextType {
    countries: Country[];
    activeCountry: Country | null;
    switchCountry: (countryCode: string) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export const CountryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { activeCompany } = useCompany();
    const [activeCountryCode, setActiveCountryCode] = useState<string | null>(null);

    // Set the active country based on the active company, or default to the first available country
    useEffect(() => {
        if (activeCompany) {
            setActiveCountryCode(activeCompany.countryCode);
        } else if (MOCK_COUNTRIES.length > 0 && !activeCountryCode) {
            setActiveCountryCode(MOCK_COUNTRIES[0].code);
        }
    }, [activeCompany, activeCountryCode]);

    const switchCountry = (countryCode: string) => {
        console.log(`Switching active country to: ${countryCode}`);
        setActiveCountryCode(countryCode);
        // Note: In a real multi-tenant app, changing country might also imply
        // changing the active company if the user doesn't have a company in the new country.
        // This simplified version assumes the user might just be "viewing" another country's branding.
    };

    const activeCountry = useMemo(() => 
        MOCK_COUNTRIES.find(c => c.code === activeCountryCode) || null,
    [activeCountryCode]);


    const value = {
        countries: MOCK_COUNTRIES,
        activeCountry,
        switchCountry,
    };

    return (
        <CountryContext.Provider value={value}>
            {children}
        </CountryContext.Provider>
    );
};

export const useCountry = (): CountryContextType => {
    const context = useContext(CountryContext);
    if (context === undefined) {
        throw new Error('useCountry must be used within a CountryProvider');
    }
    return context;
};
