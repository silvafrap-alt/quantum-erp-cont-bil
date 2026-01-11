
import React from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { SubscriptionPlan } from '../types';

interface OnboardingGateProps {
    children: React.ReactNode;
}

const OnboardingTask: React.FC<{ title: string; description: string; isComplete: boolean; icon: string; }> = ({ title, description, isComplete, icon }) => {
    return (
        <div className="flex items-start p-4 border border-slate-200 rounded-lg">
            <div className={`mr-4 text-xl h-8 w-8 flex items-center justify-center rounded-full ${isComplete ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                <i className={`fa-solid ${isComplete ? 'fa-check' : icon}`}></i>
            </div>
            <div>
                <h4 className={`font-bold ${isComplete ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{title}</h4>
                <p className="text-sm text-slate-500">{description}</p>
            </div>
        </div>
    )
}

const OnboardingGate: React.FC<OnboardingGateProps> = ({ children }) => {
    const { user, onboardingStatus } = useSubscription();

    const needsOnboarding = user.subscription === SubscriptionPlan.BASIC && !user.onboardingComplete;

    if (!needsOnboarding) {
        return <>{children}</>;
    }

    return (
        <div className="bg-white p-8 rounded-xl shadow-md max-w-3xl mx-auto">
            <div className="text-center">
                <i className="fa-solid fa-rocket text-5xl text-indigo-500 mb-4"></i>
                <h2 className="text-3xl font-bold text-slate-800">Quase pronto para começar!</h2>
                <p className="text-slate-500 mt-2">
                    Complete os seguintes passos para desbloquear o acesso total ao seu painel Quantum.
                </p>
            </div>
            <div className="mt-8 space-y-4">
                <OnboardingTask 
                    title="Complete seu Perfil"
                    description="Informações básicas como nome e NIF são essenciais."
                    isComplete={onboardingStatus.profileComplete}
                    icon="fa-user"
                />
                <OnboardingTask 
                    title="Crie seu Primeiro Cliente"
                    description="Adicione o primeiro cliente para começar a organizar suas finanças."
                    isComplete={onboardingStatus.hasClient}
                    icon="fa-users"
                />
                <OnboardingTask 
                    title="Faça o Primeiro Lançamento"
                    description="Registre uma receita ou despesa para ver a mágica acontecer."
                    isComplete={onboardingStatus.hasTransaction}
                    icon="fa-calculator"
                />
            </div>
            <div className="mt-6 text-center text-sm text-slate-400">
                <p>Assim que todas as tarefas forem concluídas, esta tela desaparecerá automaticamente.</p>
            </div>
        </div>
    );
};

export default OnboardingGate;
