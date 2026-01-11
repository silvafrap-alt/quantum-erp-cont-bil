import React from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { SubscriptionPlan } from '../types';
import { Link } from 'react-router-dom';
import { useCompany } from '../contexts/CompanyContext';

interface FeatureLockProps {
    children: React.ReactElement;
    requiredPlan: SubscriptionPlan;
    requiredAddon?: string;
}

const FeatureLock: React.FC<FeatureLockProps> = ({ children, requiredPlan, requiredAddon }) => {
    const { planDetails } = useSubscription();
    const { activeCompany } = useCompany();

    const planHierarchy = {
        [SubscriptionPlan.BASIC]: 1,
        [SubscriptionPlan.STANDARD]: 2,
        [SubscriptionPlan.PREMIUM]: 3,
    };

    const hasPlanAccess = planHierarchy[planDetails.name] >= planHierarchy[requiredPlan];
    const hasAddonAccess = !requiredAddon || (activeCompany?.activeAddons.includes(requiredAddon) ?? false);
    
    const hasAccess = hasPlanAccess && hasAddonAccess;

    if (hasAccess) {
        return children;
    }

    let tooltipMessage = `Requer o plano ${requiredPlan} ou superior.`;
    if (requiredAddon && !hasAddonAccess) {
        tooltipMessage = `Requer o addon '${requiredAddon}'.`;
    }

    return (
        <div className="relative group">
            <div className="absolute inset-0 bg-slate-200 bg-opacity-70 rounded-lg flex items-center justify-center z-10 cursor-not-allowed">
                 <i className="fa-solid fa-lock text-slate-500"></i>
            </div>
            <div style={{ filter: 'grayscale(80%)', opacity: 0.8 }}>
                 {React.cloneElement(children, { disabled: true, onClick: (e: React.MouseEvent) => e.preventDefault() })}
            </div>
            <div className="absolute bottom-full mb-2 w-max bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                {tooltipMessage}
                <Link to={requiredAddon && !hasAddonAccess ? "/addons" : "/planos"} className="font-bold underline ml-1">Ver opções</Link>
            </div>
        </div>
    );
};

export default FeatureLock;