import { 
    SubscriptionPlan, 
    PlanDetails, 
    Country, 
    Addon
} from '../types';

export const MOCK_COUNTRIES: Country[] = [
    {
        code: 'AO',
        name: 'Angola',
        currency: 'AOA',
        currencySymbol: 'Kz',
        language: 'pt-AO',
        branding: {
            brandName: 'Quantum AO',
            logoUrl: 'fa-solid fa-atom',
            primaryColor: '#6366f1', // indigo-500
        }
    },
    {
        code: 'BR',
        name: 'Brasil',
        currency: 'BRL',
        currencySymbol: 'R$',
        language: 'pt-BR',
        branding: {
            brandName: 'Quantum BR',
            logoUrl: 'fa-solid fa-earth-americas',
            primaryColor: '#22c55e', // green-500
        }
    }
];

export const MOCK_ADDONS: Addon[] = [
    { id: 'relatorios-avancados', name: 'Relatórios Avançados', description: 'Exporte relatórios em Excel e tenha acesso a análises mais profundas.', price: '9.99', billingCycle: 'mensal', icon: 'fa-solid fa-file-excel' },
    { id: 'modulo-rh', name: 'Módulo RH', description: 'Gerencie funcionários, folhas de pagamento e benefícios diretamente no sistema.', price: '14.99', billingCycle: 'mensal', icon: 'fa-solid fa-users-gear' },
    { id: 'integracao-bancaria', name: 'Integração Bancária', description: 'Sincronize automaticamente suas transações bancárias para uma contabilidade sem esforço.', price: '19.99', billingCycle: 'mensal', icon: 'fa-solid fa-building-columns' },
];


export const PLANS: Record<SubscriptionPlan, PlanDetails> = {
    [SubscriptionPlan.BASIC]: {
        name: SubscriptionPlan.BASIC,
        price: "4.99",
        priceId: 'price_1PExampleBasic',
        billingCycle: 'mensal',
        limits: {
            clients: 5,
            transactions: 30,
            documents: 20,
            historyDays: 30,
        },
        features: ["Até 5 clientes", "30 lançamentos/mês", "20 documentos/mês", "Relatórios básicos", "Histórico de 30 dias"],
    },
    [SubscriptionPlan.STANDARD]: {
        name: SubscriptionPlan.STANDARD,
        price: "10.00",
        priceId: 'price_1PExampleStandard',
        billingCycle: 'mensal',
        limits: {
            clients: 50,
            transactions: 300,
            documents: 200,
            historyDays: 365,
        },
        features: ["Até 50 clientes", "300 lançamentos/mês", "200 documentos/mês", "Relatórios completos", "Dashboard completo", "Histórico de 12 meses"],
    },
    [SubscriptionPlan.PREMIUM]: {
        name: SubscriptionPlan.PREMIUM,
        price: "25.00",
        priceId: 'price_1PExamplePremium',
        billingCycle: 'vitalício',
        limits: {
            clients: Infinity,
            transactions: Infinity,
            documents: Infinity,
            historyDays: Infinity,
        },
        features: ["Clientes ilimitados", "Lançamentos ilimitados", "Documentos ilimitados", "Todos os relatórios e dashboards", "Acesso prioritário a novidades"],
    }
};
