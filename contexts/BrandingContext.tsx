import React, { createContext, useContext } from 'react';
import { BrandingSettings } from '../types';
import { useCountry } from './CountryContext';

const defaultBranding: BrandingSettings = {
    brandName: 'Quantum',
    logoUrl: 'fa-solid fa-atom',
    primaryColor: '#6366f1', // Default: indigo-500
};

const BrandingContext = createContext<BrandingSettings>(defaultBranding);

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { activeCountry } = useCountry();
    
    const branding = activeCountry?.branding || defaultBranding;

    return (
        <BrandingContext.Provider value={branding}>
            {children}
        </BrandingContext.Provider>
    );
};

export const useBranding = (): BrandingSettings => {
    const context = useContext(BrandingContext);
    if (context === undefined) {
        throw new Error('useBranding must be used within a BrandingProvider');
    }
    return context;
};
