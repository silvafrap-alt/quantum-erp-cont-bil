import React from 'react';
import { useCompany } from '../contexts/CompanyContext';
import { Link } from 'react-router-dom';
import { useBranding } from '../contexts/BrandingContext';

interface LicenseGateProps {
    children: React.ReactNode;
}

const LicenseGate: React.FC<LicenseGateProps> = ({ children }) => {
    const { activeCompany } = useCompany();
    const { primaryColor } = useBranding();

    const isLicenseActive = activeCompany?.license?.active ?? true;

    if (isLicenseActive) {
        return <>{children}</>;
    }

    return (
        <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto text-center">
             <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <i className="fa-solid fa-id-card text-3xl text-red-500"></i>
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Licença Expirada</h2>
            <p className="text-slate-500 mt-2">
                A licença para a empresa <span className="font-semibold">{activeCompany?.companyName}</span> expirou em{' '}
                {new Date(activeCompany?.license.expiresAt || '').toLocaleDateString()}.
            </p>
            <p className="text-slate-500 mt-2">
                Para continuar a aceder aos dados e funcionalidades, por favor, renove a sua licença.
            </p>
            <Link 
                to="/licenca"
                className="mt-6 inline-block text-white font-bold py-3 px-6 rounded-lg transition"
                style={{backgroundColor: primaryColor}}
            >
                Renovar Licença Agora
            </Link>
        </div>
    );
};

export default LicenseGate;
