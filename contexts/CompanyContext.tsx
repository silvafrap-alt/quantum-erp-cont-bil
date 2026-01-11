import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserCompany } from '../types';

interface CompanyContextType {
    userCompanies: UserCompany[];
    activeCompanyId: string | null;
    activeCompany: UserCompany | null;
    switchCompany: (companyId: string) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ userCompanies: UserCompany[], children: React.ReactNode }> = ({ userCompanies, children }) => {
    const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);

    useEffect(() => {
        // Set the first company as active by default when the component mounts or companies change
        if (userCompanies && userCompanies.length > 0 && !activeCompanyId) {
            setActiveCompanyId(userCompanies[0].companyId);
        }
    }, [userCompanies, activeCompanyId]);

    const switchCompany = (companyId: string) => {
        console.log(`Switching active company to: ${companyId}`);
        setActiveCompanyId(companyId);
        // In a real app, you might want to refetch data here or clear existing state
    };

    const activeCompany = userCompanies.find(c => c.companyId === activeCompanyId) || null;

    const value = {
        userCompanies,
        activeCompanyId,
        activeCompany,
        switchCompany,
    };

    return (
        <CompanyContext.Provider value={value}>
            {children}
        </CompanyContext.Provider>
    );
};

export const useCompany = (): CompanyContextType => {
    const context = useContext(CompanyContext);
    if (context === undefined) {
        throw new Error('useCompany must be used within a CompanyProvider');
    }
    return context;
};
