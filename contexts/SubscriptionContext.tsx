import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { User, SubscriptionPlan, PlanDetails } from '../types';
import { PLANS } from '../data/mockData';
import { api } from '../services/api';
import { supabase } from '../supabase';
import { useCompany } from './CompanyContext';

interface SubscriptionContextType {
    user: User;
    planDetails: PlanDetails;
    initiateCheckout: (plan: PlanDetails) => Promise<void>;
    refetchUser: (newPlan?: SubscriptionPlan) => Promise<void>;
    canAddClient: () => boolean;
    canAddTransaction: () => boolean;
    onboardingStatus: {
        profileComplete: boolean;
        hasClient: boolean;
        hasTransaction: boolean;
    };
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ user: User, refetchUser: (newPlan?: SubscriptionPlan) => Promise<void>, children: React.ReactNode }> = ({ user, refetchUser, children }) => {
    const { activeCompanyId } = useCompany();
    const [clientCount, setClientCount] = useState(0);
    const [transactionCount, setTransactionCount] = useState(0);
    
    const planDetails = PLANS[user.subscription];

    useEffect(() => {
        if (!activeCompanyId) return;

        const fetchCounts = async () => {
            // Fetch client count
            const { count: clients, error: clientError } = await supabase
                .from('clients')
                .select('*', { count: 'exact', head: true })
                .eq('companyId', activeCompanyId);
            
            if (clientError) console.error("Error fetching client count", clientError);
            else setClientCount(clients || 0);

            // Fetch transaction count for the current month (example logic)
            const { count: transactions, error: transactionError } = await supabase
                .from('transactions')
                .select('*', { count: 'exact', head: true })
                .eq('companyId', activeCompanyId);

            if (transactionError) console.error("Error fetching transaction count", transactionError);
            else setTransactionCount(transactions || 0);
        };

        fetchCounts();

    }, [activeCompanyId]);


    const initiateCheckout = async (plan: PlanDetails) => {
        console.log(`Initiating checkout for ${user.name} to ${plan.name}`);
        try {
            const { url } = await api.createCheckoutSession(plan, user.id);
            window.location.href = url;
        } catch (error) {
            console.error("Failed to create checkout session:", error);
            alert("Não foi possível iniciar o pagamento. Tente novamente mais tarde.");
        }
    };

    const canAddClient = () => {
        if (planDetails.limits.clients === Infinity) return true;
        return clientCount < planDetails.limits.clients;
    };

    const canAddTransaction = () => {
        // This logic might be more complex (e.g., per month) in a real app
        if (planDetails.limits.transactions === Infinity) return true;
        return transactionCount < planDetails.limits.transactions;
    };

    const onboardingStatus = useMemo(() => ({
        profileComplete: !!(user.name && user.email),
        hasClient: clientCount > 0,
        hasTransaction: transactionCount > 0
    }), [user, clientCount, transactionCount]);

    useEffect(() => {
        const checkOnboarding = async () => {
            if (user.subscription === SubscriptionPlan.BASIC && !user.onboardingComplete) {
                if (onboardingStatus.profileComplete && onboardingStatus.hasClient && onboardingStatus.hasTransaction) {
                    // Update user in Supabase
                    const { error } = await supabase
                        .from('users')
                        .update({ onboardingComplete: true })
                        .eq('id', user.id);
                    
                    if (error) {
                        console.error("Failed to update onboarding status", error);
                    } else {
                        // Refetch user to get the updated state everywhere
                        await refetchUser();
                    }
                }
            }
        };
        checkOnboarding();
    }, [onboardingStatus, user, refetchUser]);


    const value = {
        user,
        planDetails,
        initiateCheckout,
        refetchUser,
        canAddClient,
        canAddTransaction,
        onboardingStatus
    };

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = (): SubscriptionContextType => {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
};