import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { User, SubscriptionPlan, AuditLogSeverity, AuditLog } from '../types';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useCompany } from '../contexts/CompanyContext';
import { useBranding } from '../contexts/BrandingContext';
import { useCountry } from '../contexts/CountryContext';
import OnboardingGate from './OnboardingGate';
import LicenseGate from './LicenseGate';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { supabase } from '../supabase';

interface MainLayoutProps {
    user: User;
    onLogout: () => void;
    children: React.ReactNode;
}

const OnlineStatusIndicator: React.FC = () => {
    const isOnline = useOnlineStatus();
    const bgColor = isOnline ? 'bg-green-500' : 'bg-red-500';
    const text = isOnline ? 'Online' : 'Offline';

    return (
        <div className="flex items-center space-x-2" title={`Status da conexão: ${text}`}>
            <span className={`h-2.5 w-2.5 rounded-full ${bgColor} relative flex`}>
                 <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${bgColor} opacity-75`}></span>
            </span>
            <span className="text-sm font-medium text-slate-600 hidden md:inline">{text}</span>
        </div>
    );
};

const AuditAlert: React.FC = () => {
    const { activeCompanyId } = useCompany();
    const [highSeverityAlerts, setHighSeverityAlerts] = useState(0);

    useEffect(() => {
        if (!activeCompanyId) return;

        const fetchAuditAlerts = async () => {
            const { count, error } = await supabase
                .from('audit_logs')
                .select('*', { count: 'exact', head: true })
                .eq('companyId', activeCompanyId)
                .eq('severity', AuditLogSeverity.HIGH);
            
            if (error) {
                console.error("Error fetching audit alerts", error);
            } else {
                setHighSeverityAlerts(count || 0);
            }
        };

        fetchAuditAlerts();
        // TODO: Implement real-time subscription for new alerts if needed
    }, [activeCompanyId]);

    if (highSeverityAlerts === 0) {
        return null;
    }

    return (
        <Link to="/auditoria" className="relative" title={`${highSeverityAlerts} alertas de auditoria de alta prioridade`}>
            <i className="fa-solid fa-shield-halved text-2xl text-slate-500 cursor-pointer text-red-500 animate-pulse"></i>
            <span className="absolute -top-1 -right-2 h-4 w-4 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">{highSeverityAlerts}</span>
        </Link>
    );
}

const Sidebar: React.FC<{ onLogout: () => void; user: User; isSidebarOpen: boolean }> = ({ onLogout, user, isSidebarOpen }) => {
    const { brandName, logoUrl, primaryColor } = useBranding();

    const navItems = [
        { path: '/dashboard', icon: 'fa-solid fa-chart-pie', label: 'Dashboard' },
        { path: '/clientes', icon: 'fa-solid fa-users', label: 'Clientes' },
        { path: '/faturacao', icon: 'fa-solid fa-file-invoice-dollar', label: 'Faturação' },
        { path: '/contabilidade', icon: 'fa-solid fa-calculator', label: 'Contabilidade' },
        { path: '/relatorios', icon: 'fa-solid fa-file-contract', label: 'Relatórios' },
        { path: '/auditoria', icon: 'fa-solid fa-shield-halved', label: 'Auditoria' },
    ];
    
    const settingsItems = [
        { path: '/licenca', icon: 'fa-solid fa-id-card', label: 'Licença e Faturação' },
        { path: '/integracoes', icon: 'fa-solid fa-code-merge', label: 'API & Integrações' },
        { path: '/addons', icon: 'fa-solid fa-puzzle-piece', label: 'Add-ons & Módulos' },
        { path: '/planos', icon: 'fa-solid fa-gem', label: 'Planos e Assinatura' },
    ];

    return (
        <aside className={`bg-slate-800 text-slate-100 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
            <div className="flex items-center justify-center h-20 border-b border-slate-700">
                <i className={`${logoUrl} text-3xl`} style={{ color: primaryColor }}></i>
                {isSidebarOpen && <h1 className="text-xl font-bold ml-3">{brandName}</h1>}
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                <p className={`px-3 pb-2 text-xs font-semibold uppercase text-slate-400 ${isSidebarOpen ? '' : 'text-center'}`}>{isSidebarOpen ? 'Menu' : '∙'}</p>
                {navItems.map(item => (
                    <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? ' text-white' : 'hover:bg-slate-700'}`} style={({ isActive }) => ({ backgroundColor: isActive ? primaryColor : 'transparent', })} >
                        <i className={`${item.icon} text-xl w-8 text-center`}></i>
                        {isSidebarOpen && <span className="ml-4 font-medium">{item.label}</span>}
                    </NavLink>
                ))}
                 <p className={`px-3 pt-4 pb-2 text-xs font-semibold uppercase text-slate-400 ${isSidebarOpen ? '' : 'text-center'}`}>{isSidebarOpen ? 'Configurações' : '∙'}</p>
                 {settingsItems.map(item => (
                    <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? ' text-white' : 'hover:bg-slate-700'}`} style={({ isActive }) => ({ backgroundColor: isActive ? primaryColor : 'transparent', })} >
                        <i className={`${item.icon} text-xl w-8 text-center`}></i>
                        {isSidebarOpen && <span className="ml-4 font-medium">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>
            <div className="px-4 py-4 border-t border-slate-700">
                <button onClick={onLogout} className="flex items-center p-3 w-full rounded-lg transition-colors hover:bg-slate-700" >
                    <i className="fa-solid fa-right-from-bracket text-xl w-8 text-center"></i>
                    {isSidebarOpen && <span className="ml-4 font-medium">Sair</span>}
                </button>
            </div>
        </aside>
    );
};


const Header: React.FC<{ user: User; toggleSidebar: () => void }> = ({ user, toggleSidebar }) => {
    const { planDetails } = useSubscription();
    const { activeCompany, userCompanies, switchCompany } = useCompany();
    const { countries, activeCountry, switchCountry } = useCountry();
    const { primaryColor } = useBranding();
    
    return (
        <header className="bg-white h-20 border-b border-slate-200 flex items-center justify-between px-8">
             <button onClick={toggleSidebar} className="text-slate-500 hover:text-indigo-600 lg:hidden">
                <i className="fa-solid fa-bars text-2xl"></i>
            </button>
            <div className="hidden lg:block">
                 <h1 className="text-2xl font-semibold text-slate-800">Bem-vindo(a), {user.name.split(' ')[0]}!</h1>
                 {planDetails.name === SubscriptionPlan.BASIC && (
                     <p className="text-sm text-slate-500">
                        Você está no Plano Básico. <Link to="/planos" className="font-semibold hover:underline" style={{color: primaryColor}}>Faça upgrade</Link> para remover os limites.
                     </p>
                 )}
            </div>
            <div className="flex items-center space-x-4 md:space-x-6">
                <OnlineStatusIndicator />
                <div className="relative">
                     <label htmlFor="country-switcher" className="sr-only">Selecionar País</label>
                     <select id="country-switcher" value={activeCountry?.code} onChange={(e) => switchCountry(e.target.value)} className="bg-slate-100 border-slate-200 text-slate-700 font-semibold rounded-lg py-2 pl-4 pr-8 focus:outline-none focus:ring-2 appearance-none" style={{'--tw-ring-color': primaryColor} as React.CSSProperties} >
                        {countries.map(c => ( <option key={c.code} value={c.code}> {c.name} ({c.code}) </option> ))}
                     </select>
                     <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                </div>

                {userCompanies.length > 1 && (
                    <div className="relative">
                         <label htmlFor="company-switcher" className="sr-only">Selecionar Empresa</label>
                         <select id="company-switcher" value={activeCompany?.companyId} onChange={(e) => switchCompany(e.target.value)} className="bg-slate-100 border-slate-200 text-slate-700 font-semibold rounded-lg py-2 pl-4 pr-8 focus:outline-none focus:ring-2 appearance-none" style={{'--tw-ring-color': primaryColor} as React.CSSProperties} >
                            {userCompanies.map(comp => ( <option key={comp.companyId} value={comp.companyId}> {comp.companyName} </option> ))}
                         </select>
                         <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                    </div>
                )}
                <div className="flex items-center space-x-4 md:space-x-6 border-l border-slate-200 pl-4 md:pl-6">
                    <AuditAlert />
                    <div className="relative" title="Notificações">
                        <i className="fa-regular fa-bell text-2xl text-slate-500 cursor-pointer hover:text-indigo-600"></i>
                        <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <img src={user.avatarUrl} alt={user.name} className="h-12 w-12 rounded-full object-cover" />
                        <div>
                            <p className="font-semibold text-slate-800">{user.name}</p>
                            <p className="text-sm text-slate-500">{user.role} ({user.subscription})</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

const MainLayout: React.FC<MainLayoutProps> = ({ user, onLogout, children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { primaryColor } = useBranding();

    useEffect(() => {
        document.documentElement.style.setProperty('--primary-color', primaryColor);
    }, [primaryColor]);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    }
    
    return (
        <div className="flex h-screen bg-slate-100">
            <div className="hidden lg:flex">
                <Sidebar onLogout={onLogout} user={user} isSidebarOpen={isSidebarOpen} />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header user={user} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-8">
                    <OnboardingGate>
                        <LicenseGate>
                            {children}
                        </LicenseGate>
                    </OnboardingGate>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
