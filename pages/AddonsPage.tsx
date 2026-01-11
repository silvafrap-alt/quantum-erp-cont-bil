import React from 'react';
import { MOCK_ADDONS } from '../data/mockData';
import { Addon } from '../types';
import { useCompany } from '../contexts/CompanyContext';
import { useBranding } from '../contexts/BrandingContext';

const AddonCard: React.FC<{ addon: Addon; isActive: boolean; onPurchase: () => void; }> = ({ addon, isActive, onPurchase }) => {
    const { primaryColor } = useBranding();
    
    return (
        <div className={`bg-white rounded-xl shadow-md p-6 flex flex-col border transition-all ${isActive ? 'border-2' : 'border-slate-200'}`} style={{borderColor: isActive ? primaryColor : undefined}}>
            {isActive && (
                <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{color: primaryColor}}>
                    <i className="fa-solid fa-check-circle mr-1"></i> Ativo
                </div>
            )}
            <div className="flex items-center mb-4">
                 <i className={`${addon.icon} text-3xl mr-4`} style={{color: primaryColor}}></i>
                 <h3 className="text-xl font-bold text-slate-800">{addon.name}</h3>
            </div>
            <p className="text-slate-500 text-sm flex-1 mb-6">{addon.description}</p>
            
            <div className="flex items-center justify-between">
                <div>
                     <span className="text-2xl font-extrabold text-slate-900">${addon.price}</span>
                     <span className="text-slate-500 font-medium">/{addon.billingCycle}</span>
                </div>
                <button
                    onClick={onPurchase}
                    disabled={isActive}
                    className="font-bold py-2 px-5 rounded-lg transition text-white disabled:bg-slate-400 disabled:cursor-not-allowed"
                    style={{backgroundColor: isActive ? undefined : primaryColor}}
                >
                    {isActive ? 'Instalado' : 'Comprar Add-on'}
                </button>
            </div>
        </div>
    );
};

const AddonsPage: React.FC = () => {
    const { activeCompany } = useCompany();

    const handlePurchase = (addon: Addon) => {
        // In a real app, this would trigger a checkout flow, similar to upgrading a plan.
        alert(`Iniciando processo de compra para o add-on: ${addon.name}.`);
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-4xl font-extrabold text-slate-800">Add-ons & Módulos</h2>
                <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
                    Potencialize seu sistema com funcionalidades extras e módulos especializados para atender às suas necessidades.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {MOCK_ADDONS.map(addon => (
                    <AddonCard 
                        key={addon.id}
                        addon={addon}
                        isActive={activeCompany?.activeAddons.includes(addon.id) || false}
                        onPurchase={() => handlePurchase(addon)}
                    />
                ))}
            </div>
        </div>
    );
};

export default AddonsPage;