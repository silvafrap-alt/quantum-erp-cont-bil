import React, { useState } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { PLANS } from '../data/mockData';
import { SubscriptionPlan, PlanDetails } from '../types';

const PlanCard: React.FC<{ plan: PlanDetails, isCurrent: boolean, onSelect: () => void, isUpgrading: boolean }> = ({ plan, isCurrent, onSelect, isUpgrading }) => {
    
    const cardClasses = isCurrent 
        ? "border-indigo-500 border-2" 
        : "border-slate-200 hover:border-indigo-400";

    const buttonClasses = isCurrent
        ? "bg-slate-500 text-white cursor-not-allowed"
        : "bg-indigo-600 text-white hover:bg-indigo-700";
    
    return (
        <div className={`bg-white rounded-xl shadow-md p-8 flex flex-col ${cardClasses} transition`}>
            <h3 className="text-2xl font-bold text-slate-800">{plan.name}</h3>
            <p className="text-slate-500 mt-1">
                {plan.billingCycle === 'vitalício' ? 'Pagamento único' : 'Cobrança mensal'}
            </p>
            
            <div className="my-6">
                <span className="text-5xl font-extrabold text-slate-900">${plan.price}</span>
                <span className="text-slate-500 font-medium"> {plan.billingCycle === 'mensal' ? '/mês' : ''}</span>
            </div>

            <ul className="space-y-4 text-slate-600 flex-1">
                {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                        <i className="fa-solid fa-check-circle text-green-500 mr-3"></i>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <button 
                onClick={onSelect} 
                disabled={isCurrent || isUpgrading}
                className={`w-full mt-8 font-bold py-3 px-4 rounded-lg transition ${buttonClasses} disabled:opacity-50`}
            >
                {isCurrent ? 'Plano Atual' : (isUpgrading ? 'Redirecionando...' : 'Fazer Upgrade')}
            </button>
        </div>
    )
}


const PlansPage: React.FC = () => {
    const { user, initiateCheckout } = useSubscription();
    const [isUpgrading, setIsUpgrading] = useState<SubscriptionPlan | null>(null);

    const handleSelectPlan = async (plan: PlanDetails) => {
        setIsUpgrading(plan.name);
        await initiateCheckout(plan);
        // The user will be redirected, so we don't need to reset the state unless there's an error.
        // In case of an error, the initiateCheckout function will handle it.
    };
    
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-4xl font-extrabold text-slate-800">Planos Flexíveis para o seu Negócio</h2>
                <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
                    Escolha o plano que melhor se adapta ao tamanho e às necessidades do seu escritório de contabilidade.
                    Faça upgrade a qualquer momento.
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <PlanCard 
                    plan={PLANS[SubscriptionPlan.BASIC]} 
                    isCurrent={user.subscription === SubscriptionPlan.BASIC}
                    onSelect={() => handleSelectPlan(PLANS[SubscriptionPlan.BASIC])}
                    isUpgrading={isUpgrading === SubscriptionPlan.BASIC}
                />
                <PlanCard 
                    plan={PLANS[SubscriptionPlan.STANDARD]} 
                    isCurrent={user.subscription === SubscriptionPlan.STANDARD}
                    onSelect={() => handleSelectPlan(PLANS[SubscriptionPlan.STANDARD])}
                    isUpgrading={isUpgrading === SubscriptionPlan.STANDARD}
                />
                <PlanCard 
                    plan={PLANS[SubscriptionPlan.PREMIUM]} 
                    isCurrent={user.subscription === SubscriptionPlan.PREMIUM}
                    onSelect={() => handleSelectPlan(PLANS[SubscriptionPlan.PREMIUM])}
                    isUpgrading={isUpgrading === SubscriptionPlan.PREMIUM}
                />
            </div>
        </div>
    );
};

export default PlansPage;