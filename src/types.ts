
export enum UserRole {
    ADMIN = 'Administrador',
    ACCOUNTANT = 'Contabilista',
    ASSISTANT = 'Assistente',
    CLIENT = 'Cliente',
}

export enum SubscriptionPlan {
    BASIC = 'Básico',
    STANDARD = 'Standard',
    PREMIUM = 'Premium',
}

export interface PlanDetails {
    name: SubscriptionPlan;
    price: string;
    priceId: string;
    billingCycle: 'mensal' | 'vitalício';
    limits: {
        clients: number;
        transactions: number;
        documents: number;
        historyDays: number;
    };
    features: string[];
}

export interface Country {
    code: string; // 'AO', 'BR', 'PT'
    name: string;
    currency: string; // 'AOA', 'BRL', 'EUR'
    currencySymbol: string; // 'Kz', 'R$', '€'
    language: string; // 'pt-AO', 'pt-BR', 'pt-PT'
    branding: BrandingSettings;
}

export interface BrandingSettings {
    brandName: string;
    logoUrl: string;
    primaryColor: string; // Hex color
}

export interface License {
    type: 'annual' | 'lifetime';
    maxCompanies: number;
    maxUsers: number;
    expiresAt: string; // ISO Date string
    active: boolean;
}

export interface UserCompany {
    companyId: string;
    companyName: string;
    countryCode: string;
    role: 'owner' | 'admin' | 'staff';
    activeAddons: string[]; // Array of addon IDs
    branding: BrandingSettings; // Company-level branding can override country
    license: License;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
    subscription: SubscriptionPlan;
    onboardingComplete: boolean;
    companies: UserCompany[];
}

export enum ClientType {
    INDIVIDUAL = 'Pessoa Física',
    CORPORATE = 'Pessoa Jurídica',
}

export interface Client {
    id: string;
    companyId: string;
    name: string;
    type: ClientType;
    nif: string; // NIF/CPF/CNPJ
    email: string;
    phone: string;
    address: string;
    economicActivity: string;
    createdAt: string;
}

export enum InvoiceStatus {
    PAID = 'Pago',
    PENDING = 'Pendente',
    OVERDUE = 'Em Atraso',
}

export interface Invoice {
    id: string;
    invoiceNumber: string; // Fiscal invoice number
    companyId: string;
    clientId: string;
    clientName: string;
    issueDate: string;
    dueDate: string;
    amount: number;
    status: InvoiceStatus;
}

export enum TransactionType {
    REVENUE = 'Receita',
    EXPENSE = 'Despesa',
    TAX = 'Imposto',
}

export interface Transaction {
    id: string;
    companyId: string;
    date: string;
    description: string;
    clientId?: string;
    clientName?: string;
    type: TransactionType;
    amount: number;
    account: string;
}

export interface Addon {
    id: string;
    name: string;
    description: string;
    price: string; // e.g., "5.00"
    billingCycle: 'único' | 'mensal';
    icon: string;
}

export interface ApiKey {
    id: string;
    keyPreview: string; // e.g., "sk_live_...1234"
    scope: 'read-only' | 'read-write';
    createdAt: string;
    lastUsed: string | null;
}

export enum AuditLogSeverity {
    HIGH = 'Alta',
    MEDIUM = 'Média',
    LOW = 'Baixa',
}

export interface AuditLog {
    id: string;
    companyId: string;
    entity: string; // e.g., "Fatura FT-2024-001"
    issue: string; // e.g., "IVA ausente"
    severity: AuditLogSeverity;
    createdAt: string;
}

export interface AiInsight {
    id: string;
    type: 'warning' | 'info' | 'success';
    title: string;
    description: string;
}
