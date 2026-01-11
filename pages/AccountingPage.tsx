import React, { useState, useMemo, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useCompany } from '../contexts/CompanyContext';
import UpgradeModal from '../components/UpgradeModal';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useBranding } from '../contexts/BrandingContext';
import { useCountry } from '../contexts/CountryContext';
import { formatCurrency } from '../utils/currency';
import { supabase } from '../supabase';

const PAGE_SIZE = 10;

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const { activeCountry } = useCountry();
    const typeClasses = {
        [TransactionType.REVENUE]: 'bg-green-100 text-green-700',
        [TransactionType.EXPENSE]: 'bg-red-100 text-red-700',
        [TransactionType.TAX]: 'bg-yellow-100 text-yellow-700',
    };

    return (
        <tr className="border-b border-slate-200 hover:bg-slate-50">
            <td className="py-4 px-6 text-slate-500">{new Date(transaction.date).toLocaleDateString()}</td>
            <td className="py-4 px-6 font-medium text-slate-900">{transaction.description}</td>
            <td className="py-4 px-6 text-slate-600">{transaction.clientName || 'N/A'}</td>
            <td className="py-4 px-6 text-slate-500">{transaction.account}</td>
            <td className="py-4 px-6">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${typeClasses[transaction.type]}`}>
                    {transaction.type}
                </span>
            </td>
            <td className={`py-4 px-6 font-semibold text-right ${transaction.type === TransactionType.REVENUE ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.type === TransactionType.REVENUE ? '+' : '-'} {formatCurrency(transaction.amount, activeCountry?.currency)}
            </td>
            <td className="py-4 px-6">
                <div className="flex items-center justify-end space-x-2">
                    <button className="text-green-500 hover:text-green-700 p-1"><i className="fa-solid fa-pencil"></i></button>
                    <button className="text-red-500 hover:text-red-700 p-1"><i className="fa-solid fa-trash"></i></button>
                </div>
            </td>
        </tr>
    );
};


const AccountingPage: React.FC = () => {
    const { canAddTransaction, planDetails } = useSubscription();
    const { activeCompanyId } = useCompany();
    const { primaryColor } = useBranding();
    const isOnline = useOnlineStatus();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [allAccounts, setAllAccounts] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);
    
    const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
    const [filterAccount, setFilterAccount] = useState<string>('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchDescription, setSearchDescription] = useState('');
    const [searchClient, setSearchClient] = useState('');
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTransactions, setTotalTransactions] = useState(0);

    // Fetch all unique accounts once for the filter dropdown
    useEffect(() => {
        if (!activeCompanyId) return;
        const fetchAccounts = async () => {
            const { data, error } = await supabase
                .from('transactions')
                .select('account')
                .eq('companyId', activeCompanyId);

            if (error) {
                console.error("Error fetching accounts", error);
            } else {
                setAllAccounts([...new Set(data.map(t => t.account))]);
            }
        };
        fetchAccounts();
    }, [activeCompanyId]);

    // Fetch transactions based on filters and pagination
    useEffect(() => {
        if (!activeCompanyId) return;

        const fetchTransactions = async () => {
            setLoading(true);
            setError(null);
            
            const from = (currentPage - 1) * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;

            try {
                let query = supabase
                    .from('transactions')
                    .select('*', { count: 'exact' })
                    .eq('companyId', activeCompanyId);
                
                // Apply filters
                if (filterType !== 'all') query = query.eq('type', filterType);
                if (filterAccount !== 'all') query = query.eq('account', filterAccount);
                if (startDate) query = query.gte('date', startDate);
                if (endDate) query = query.lte('date', endDate);
                if (searchDescription) query = query.ilike('description', `%${searchDescription}%`);
                if (searchClient) query = query.ilike('clientName', `%${searchClient}%`);

                const { data, error, count } = await query
                    .order('date', { ascending: false })
                    .range(from, to);

                if (error) throw error;
                
                setTransactions(data as Transaction[]);
                setTotalTransactions(count || 0);
            } catch (err) {
                console.error("Error fetching transactions", err);
                setError("Não foi possível carregar os lançamentos. Por favor, tente novamente.");
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [activeCompanyId, currentPage, filterType, filterAccount, startDate, endDate, searchDescription, searchClient]);

    // Reset to page 1 whenever a filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filterType, filterAccount, startDate, endDate, searchDescription, searchClient]);


    const handleAddNewTransaction = () => {
        if (!canAddTransaction()) {
            setUpgradeModalOpen(true);
            return;
        }

        if (!isOnline) {
            alert('Você está offline. O lançamento foi salvo localmente e será sincronizado quando a conexão for restabelecida.');
        } else {
             alert('Navegando para o formulário de novo lançamento...');
        }
    };
    
    const totalPages = Math.ceil(totalTransactions / PAGE_SIZE);

    return (
        <>
            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setUpgradeModalOpen(false)}
                title="Limite de Lançamentos Atingido"
                message={`Você atingiu o limite de ${planDetails.limits.transactions} lançamentos do seu plano atual. Para continuar, por favor, faça o upgrade.`}
            />
            <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Lançamentos Contábeis</h2>
                        <p className="text-slate-500">Gerencie todas as transações financeiras.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition flex items-center space-x-2">
                            <i className="fa-solid fa-file-csv"></i>
                            <span>Exportar CSV</span>
                        </button>
                        <button onClick={handleAddNewTransaction} className="text-white font-bold py-2 px-4 rounded-lg transition flex items-center space-x-2" style={{backgroundColor: primaryColor}}>
                            <i className="fa-solid fa-plus"></i>
                            <span>Novo Lançamento</span>
                        </button>
                    </div>
                </div>
                
                <div className="mb-6 space-y-4 p-4 bg-slate-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="searchDescription" className="block text-sm font-medium text-slate-600 mb-1">Buscar por Descrição</label>
                            <input
                                type="text"
                                id="searchDescription"
                                placeholder="Ex: Pagamento..."
                                value={searchDescription}
                                onChange={(e) => setSearchDescription(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1"
                                style={{'--tw-ring-color': primaryColor} as React.CSSProperties}
                            />
                        </div>
                        <div>
                            <label htmlFor="searchClient" className="block text-sm font-medium text-slate-600 mb-1">Buscar por Cliente</label>
                            <input
                                type="text"
                                id="searchClient"
                                placeholder="Ex: Inovatech..."
                                value={searchClient}
                                onChange={(e) => setSearchClient(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1"
                                style={{'--tw-ring-color': primaryColor} as React.CSSProperties}
                            />
                        </div>
                         <div>
                            <label htmlFor="filterType" className="block text-sm font-medium text-slate-600 mb-1">Tipo</label>
                            <select id="filterType" value={filterType} onChange={(e) => setFilterType(e.target.value as TransactionType | 'all')} className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1" style={{'--tw-ring-color': primaryColor} as React.CSSProperties} >
                                <option value="all">Todos os Tipos</option>
                                <option value={TransactionType.REVENUE}>Receita</option>
                                <option value={TransactionType.EXPENSE}>Despesa</option>
                                <option value={TransactionType.TAX}>Imposto</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="filterAccount" className="block text-sm font-medium text-slate-600 mb-1">Conta</label>
                            <select id="filterAccount" value={filterAccount} onChange={(e) => setFilterAccount(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1" style={{'--tw-ring-color': primaryColor} as React.CSSProperties}>
                                <option value="all">Todas as Contas</option>
                                {allAccounts.map(account => (
                                    <option key={account} value={account}>{account}</option>
                                ))}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-slate-600 mb-1">Data Início</label>
                            <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1" style={{'--tw-ring-color': primaryColor} as React.CSSProperties}/>
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-slate-600 mb-1">Data Fim</label>
                            <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1" style={{'--tw-ring-color': primaryColor} as React.CSSProperties} />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? <div className="text-center py-10">A carregar lançamentos...</div> :
                     error ? <div className="text-center py-10 text-red-500">{error}</div> : (
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                <tr>
                                    <th scope="col" className="py-3 px-6">Data</th>
                                    <th scope="col" className="py-3 px-6">Descrição</th>
                                    <th scope="col" className="py-3 px-6">Cliente</th>
                                    <th scope="col" className="py-3 px-6">Plano de Contas</th>
                                    <th scope="col" className="py-3 px-6">Tipo</th>
                                    <th scope="col" className="py-3 px-6 text-right">Valor</th>
                                    <th scope="col" className="py-3 px-6 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                               {transactions.length > 0 ? transactions.map(transaction => (
                                    <TransactionRow key={transaction.id} transaction={transaction} />
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="text-center py-10 text-slate-500">
                                            Nenhum lançamento encontrado com os filtros aplicados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
                 {totalTransactions > 0 && !loading && !error && (
                    <div className="flex justify-between items-center pt-4">
                        <span className="text-sm text-slate-600">
                            Página {currentPage} de {totalPages} (Total: {totalTransactions} lançamentos)
                        </span>
                        <div className="flex space-x-2">
                            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed" >
                                Anterior
                            </button>
                            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed" >
                                Próximo
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AccountingPage;