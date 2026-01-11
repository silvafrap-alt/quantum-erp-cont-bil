import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Invoice, InvoiceStatus, Transaction } from '../types';
import { useCompany } from '../contexts/CompanyContext';
import { useCountry } from '../contexts/CountryContext';
import { formatCurrency } from '../utils/currency';
import AiInsightsWidget from '../components/AiInsightsWidget';
import { supabase } from '../supabase';

const chartData = [
  { name: 'Jan', receita: 4000, despesa: 2400 },
  { name: 'Fev', receita: 3000, despesa: 1398 },
  { name: 'Mar', receita: 2000, despesa: 9800 },
  { name: 'Abr', receita: 2780, despesa: 3908 },
  { name: 'Mai', receita: 1890, despesa: 4800 },
  { name: 'Jun', receita: 2390, despesa: 3800 },
  { name: 'Jul', receita: 3490, despesa: 4300 },
];

const StatCard: React.FC<{ icon: string; title: string; value: string; color: string; loading?: boolean }> = ({ icon, title, value, color, loading = false }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
        <div className={`text-3xl p-4 rounded-full ${color}`}>
            <i className={icon}></i>
        </div>
        <div>
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            {loading ? <div className="h-8 w-24 bg-slate-200 rounded animate-pulse mt-1"></div> : <p className="text-2xl font-bold text-slate-800">{value}</p>}
        </div>
    </div>
);

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const { activeCountry } = useCountry();
    const typeClasses = {
        Receita: 'bg-green-100 text-green-700',
        Despesa: 'bg-red-100 text-red-700',
        Imposto: 'bg-yellow-100 text-yellow-700',
    };
    return (
        <tr className="border-b border-slate-200 hover:bg-slate-100">
            <td className="py-3 px-4 text-slate-700">{transaction.description}</td>
            <td className="py-3 px-4 text-slate-500">{transaction.clientName || 'Interno'}</td>
            <td className="py-3 px-4 text-slate-500">{new Date(transaction.date).toLocaleDateString()}</td>
            <td className="py-3 px-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${typeClasses[transaction.type]}`}>
                    {transaction.type}
                </span>
            </td>
            <td className={`py-3 px-4 font-semibold text-right ${transaction.type === 'Receita' ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.type === 'Receita' ? '+' : '-'} {formatCurrency(transaction.amount, activeCountry?.currency)}
            </td>
        </tr>
    );
};

const DashboardPage: React.FC = () => {
    const { activeCompanyId } = useCompany();
    const { activeCountry } = useCountry();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!activeCompanyId) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const invoicePromise = supabase.from('invoices').select('*').eq('companyId', activeCompanyId);
                const transactionPromise = supabase.from('transactions').select('*').eq('companyId', activeCompanyId).limit(5).order('date', { ascending: false });

                const [invoiceResult, transactionResult] = await Promise.all([invoicePromise, transactionPromise]);

                if (invoiceResult.error) throw invoiceResult.error;
                setInvoices(invoiceResult.data as Invoice[]);

                if (transactionResult.error) throw transactionResult.error;
                setTransactions(transactionResult.data as Transaction[]);

            } catch (err: any) {
                console.error("Error fetching dashboard data", err);
                setError("Não foi possível carregar os dados do dashboard. Por favor, tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeCompanyId]);
    
    const totalRevenue = invoices.filter(i => i.status === InvoiceStatus.PAID).reduce((sum, i) => sum + i.amount, 0);
    const pendingInvoices = invoices.filter(i => i.status === InvoiceStatus.PENDING).length;
    
    if (error) {
        return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
            <p className="font-bold">Erro</p>
            <p>{error}</p>
        </div>;
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            <div className="xl:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon="fa-solid fa-hand-holding-dollar" title="Receita Total (Pago)" value={formatCurrency(totalRevenue, activeCountry?.currency)} color="bg-green-100 text-green-600" loading={loading} />
                    <StatCard icon="fa-solid fa-clock" title="Faturas Pendentes" value={`${pendingInvoices}`} color="bg-yellow-100 text-yellow-600" loading={loading} />
                    <StatCard icon="fa-solid fa-file-excel" title="Próximo Imposto" value="DAS - 20/08" color="bg-red-100 text-red-600" />
                    <StatCard icon="fa-solid fa-user-plus" title="Novos Clientes (Mês)" value="0" color="bg-blue-100 text-blue-600" />
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">Receitas vs. Despesas</h3>
                     {loading ? <div className="h-[300px] flex items-center justify-center text-slate-500">A carregar dados do gráfico...</div> : (
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#84cc16" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" tickFormatter={(value) => formatCurrency(value as number, activeCountry?.currency, 0)} />
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <Tooltip formatter={(value) => formatCurrency(value as number, activeCountry?.currency)} />
                                    <Area type="monotone" dataKey="receita" stroke="#84cc16" fillOpacity={1} fill="url(#colorReceita)" />
                                    <Area type="monotone" dataKey="despesa" stroke="#ef4444" fillOpacity={1} fill="url(#colorDespesa)" />
                                 </AreaChart>
                            </ResponsiveContainer>
                        </div>
                     )}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">Últimos Lançamentos</h3>
                    <div className="overflow-x-auto">
                        {loading ? <div className="text-center py-8 text-slate-500">A carregar lançamentos...</div> : (
                            transactions.length > 0 ? (
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                        <tr>
                                            <th className="py-3 px-4">Descrição</th>
                                            <th className="py-3 px-4">Cliente</th>
                                            <th className="py-3 px-4">Data</th>
                                            <th className="py-3 px-4">Tipo</th>
                                            <th className="py-3 px-4 text-right">Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map(t => <TransactionRow key={t.id} transaction={t} />)}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-8">
                                    <i className="fa-solid fa-file-circle-question text-4xl text-slate-300 mb-4"></i>
                                    <p className="text-slate-500">Nenhum lançamento encontrado para esta empresa.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
            <div className="xl:col-span-1 space-y-8">
                <AiInsightsWidget />
            </div>
        </div>
    );
};

export default DashboardPage;