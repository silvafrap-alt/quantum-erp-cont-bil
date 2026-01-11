import React, { useState, useMemo, useEffect } from 'react';
import { Invoice, InvoiceStatus } from '../types';
import { useCompany } from '../contexts/CompanyContext';
import { useBranding } from '../contexts/BrandingContext';
import { useCountry } from '../contexts/CountryContext';
import { formatCurrency } from '../utils/currency';
import { supabase } from '../supabase';

const PAGE_SIZE = 10;

const InvoiceRow: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
    const { activeCountry } = useCountry();
    const statusClasses = {
        [InvoiceStatus.PAID]: 'bg-green-100 text-green-700',
        [InvoiceStatus.PENDING]: 'bg-yellow-100 text-yellow-700',
        [InvoiceStatus.OVERDUE]: 'bg-red-100 text-red-700',
    };
    
    const handleGeneratePdf = () => {
        alert(`Iniciando geração de PDF para a fatura ${invoice.invoiceNumber}...`);
    };

    return (
        <tr className="border-b border-slate-200 hover:bg-slate-50">
            <td className="py-4 px-6 font-medium text-slate-900">{invoice.invoiceNumber}</td>
            <td className="py-4 px-6 text-slate-600">{invoice.clientName}</td>
            <td className="py-4 px-6 text-slate-500">{new Date(invoice.issueDate).toLocaleDateString()}</td>
            <td className="py-4 px-6 text-slate-500">{new Date(invoice.dueDate).toLocaleDateString()}</td>
            <td className="py-4 px-6 font-semibold text-slate-800">{formatCurrency(invoice.amount, activeCountry?.currency)}</td>
            <td className="py-4 px-6">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClasses[invoice.status]}`}>
                    {invoice.status}
                </span>
            </td>
            <td className="py-4 px-6">
                <div className="flex items-center space-x-2">
                    <button onClick={handleGeneratePdf} className="text-red-500 hover:text-red-700 p-1" title="Gerar PDF"><i className="fa-solid fa-file-pdf"></i></button>
                    <button className="text-slate-500 hover:text-slate-700 p-1" title="Download"><i className="fa-solid fa-download"></i></button>
                    <button className="text-blue-500 hover:text-blue-700 p-1" title="Enviar por Email"><i className="fa-solid fa-paper-plane"></i></button>
                    <button className="text-slate-600 hover:text-slate-800 p-1" title="Excluir"><i className="fa-solid fa-trash"></i></button>
                </div>
            </td>
        </tr>
    );
};

const BillingPage: React.FC = () => {
    const [filterStatus, setFilterStatus] = useState<InvoiceStatus | 'all'>('all');
    const { activeCompanyId } = useCompany();
    const { primaryColor } = useBranding();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalInvoices, setTotalInvoices] = useState(0);

    useEffect(() => {
        if (!activeCompanyId) return;

        const fetchInvoices = async () => {
            setLoading(true);
            setError(null);
            
            const from = (currentPage - 1) * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;

            try {
                let query = supabase
                    .from('invoices')
                    .select('*', { count: 'exact' })
                    .eq('companyId', activeCompanyId);
                
                if (filterStatus !== 'all') {
                    query = query.eq('status', filterStatus);
                }

                const { data, error, count } = await query
                    .order('issueDate', { ascending: false })
                    .range(from, to);

                if (error) throw error;

                setInvoices(data as Invoice[]);
                setTotalInvoices(count || 0);

            } catch (err: any) {
                console.error("Error fetching invoices", err);
                setError("Não foi possível carregar as faturas. Por favor, tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [activeCompanyId, currentPage, filterStatus]);

    useEffect(() => {
        // Reset page to 1 when filter changes
        setCurrentPage(1);
    }, [filterStatus]);

    const totalPages = Math.ceil(totalInvoices / PAGE_SIZE);

    return (
        <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800">Faturação e Pagamentos</h2>
                    <p className="text-slate-500">Emita e controle as faturas dos seus clientes.</p>
                </div>
                <button 
                    className="text-white font-bold py-2 px-4 rounded-lg transition flex items-center space-x-2"
                    style={{backgroundColor: primaryColor}}
                >
                    <i className="fa-solid fa-plus"></i>
                    <span>Nova Fatura</span>
                </button>
            </div>

            <div className="mb-6">
                <label htmlFor="status-filter" className="block text-sm font-medium text-slate-700 mb-1">Filtrar por Status</label>
                <select
                    id="status-filter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as InvoiceStatus | 'all')}
                    className="w-full md:w-1/3 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{'--tw-ring-color': primaryColor} as React.CSSProperties}
                >
                    <option value="all">Todos os Status</option>
                    <option value={InvoiceStatus.PAID}>Pago</option>
                    <option value={InvoiceStatus.PENDING}>Pendente</option>
                    <option value={InvoiceStatus.OVERDUE}>Em Atraso</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                {loading ? <div className="text-center py-10">A carregar faturas...</div> : 
                 error ? <div className="text-center py-10 text-red-500">{error}</div> : (
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th scope="col" className="py-3 px-6">Nº Fatura</th>
                                <th scope="col" className="py-3 px-6">Cliente</th>
                                <th scope="col" className="py-3 px-6">Data Emissão</th>
                                <th scope="col" className="py-3 px-6">Data Venc.</th>
                                <th scope="col" className="py-3 px-6">Valor</th>
                                <th scope="col" className="py-3 px-6">Status</th>
                                <th scope="col" className="py-3 px-6">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.length > 0 ? invoices.map(invoice => (
                                <InvoiceRow key={invoice.id} invoice={invoice} />
                            )) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-10 text-slate-500">
                                        Nenhuma fatura encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
             {totalInvoices > 0 && !loading && !error && (
                <div className="flex justify-between items-center pt-4">
                    <span className="text-sm text-slate-600">
                        Página {currentPage} de {totalPages} (Total: {totalInvoices} faturas)
                    </span>
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => setCurrentPage(p => p - 1)} 
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Anterior
                        </button>
                        <button 
                            onClick={() => setCurrentPage(p => p + 1)} 
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Próximo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillingPage;