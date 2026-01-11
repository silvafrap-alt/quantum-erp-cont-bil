import React, { useState, useMemo, useEffect } from 'react';
import { AuditLog, AuditLogSeverity } from '../types';
import { useCompany } from '../contexts/CompanyContext';
import { supabase } from '../supabase';

const PAGE_SIZE = 15;

const AuditLogRow: React.FC<{ log: AuditLog }> = ({ log }) => {
    const severityClasses = {
        [AuditLogSeverity.HIGH]: 'bg-red-100 text-red-700',
        [AuditLogSeverity.MEDIUM]: 'bg-yellow-100 text-yellow-700',
        [AuditLogSeverity.LOW]: 'bg-blue-100 text-blue-700',
    };
    
    return (
        <tr className={`border-b border-slate-200 ${log.severity === AuditLogSeverity.HIGH ? 'bg-red-50' : 'hover:bg-slate-50'}`}>
            <td className="py-4 px-6 text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
            <td className="py-4 px-6 font-medium text-slate-800">{log.entity}</td>
            <td className="py-4 px-6 text-slate-600">{log.issue}</td>
            <td className="py-4 px-6">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${severityClasses[log.severity]}`}>
                    {log.severity}
                </span>
            </td>
             <td className="py-4 px-6">
                <button className="text-blue-500 hover:text-blue-700 text-sm font-semibold">Detalhes</button>
            </td>
        </tr>
    );
};

const AuditLogPage: React.FC = () => {
    const [filterSeverity, setFilterSeverity] = useState<AuditLogSeverity | 'all'>('all');
    const { activeCompanyId } = useCompany();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalLogs, setTotalLogs] = useState(0);

    useEffect(() => {
        if (!activeCompanyId) return;

        const fetchLogs = async () => {
            setLoading(true);
            setError(null);
            
            const from = (currentPage - 1) * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;

            try {
                let query = supabase
                    .from('audit_logs')
                    .select('*', { count: 'exact' })
                    .eq('companyId', activeCompanyId);
                
                if (filterSeverity !== 'all') {
                    query = query.eq('severity', filterSeverity);
                }

                const { data, error, count } = await query
                    .order('createdAt', { ascending: false })
                    .range(from, to);

                if (error) throw error;
                
                setLogs(data as AuditLog[]);
                setTotalLogs(count || 0);
            } catch (err) {
                console.error("Error fetching audit logs", err);
                setError("Não foi possível carregar os logs de auditoria.");
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [activeCompanyId, currentPage, filterSeverity]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filterSeverity]);
    
    const totalPages = Math.ceil(totalLogs / PAGE_SIZE);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-800">Relatório de Auditoria</h2>
                <p className="text-slate-500 mt-1">Acompanhe problemas, inconsistências e potenciais fraudes detetadas pelo sistema.</p>
            </div>
             <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Eventos de Auditoria</h3>
                     <div>
                        <label htmlFor="severity-filter" className="text-sm font-medium text-slate-700 mr-2">Filtrar por Severidade:</label>
                        <select
                            id="severity-filter"
                            value={filterSeverity}
                            onChange={(e) => setFilterSeverity(e.target.value as AuditLogSeverity | 'all')}
                            className="p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">Todas</option>
                            <option value={AuditLogSeverity.HIGH}>Alta</option>
                            <option value={AuditLogSeverity.MEDIUM}>Média</option>
                            <option value={AuditLogSeverity.LOW}>Baixa</option>
                        </select>
                    </div>
                </div>
                 <div className="overflow-x-auto">
                     {loading ? <div className="text-center py-10">A carregar logs de auditoria...</div> :
                      error ? <div className="text-center py-10 text-red-500">{error}</div> : (
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                <tr>
                                    <th scope="col" className="py-3 px-6">Data & Hora</th>
                                    <th scope="col" className="py-3 px-6">Entidade Afetada</th>
                                    <th scope="col" className="py-3 px-6">Problema Detetado</th>
                                    <th scope="col" className="py-3 px-6">Severidade</th>
                                    <th scope="col" className="py-3 px-6">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map(log => (
                                    <AuditLogRow key={log.id} log={log} />
                                ))}
                            </tbody>
                        </table>
                     )}
                     {!loading && !error && logs.length === 0 && (
                        <p className="text-center py-10 text-slate-500">
                            <i className="fa-solid fa-check-circle text-3xl text-green-500 mb-2"></i><br/>
                            Nenhum problema de auditoria encontrado com os filtros atuais.
                        </p>
                    )}
                </div>
                 {totalLogs > 0 && !loading && !error && (
                    <div className="flex justify-between items-center pt-4">
                        <span className="text-sm text-slate-600">
                            Página {currentPage} de {totalPages} (Total: {totalLogs} logs)
                        </span>
                        <div className="flex space-x-2">
                            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed">
                                Anterior
                            </button>
                            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed">
                                Próximo
                            </button>
                        </div>
                    </div>
                )}
             </div>
        </div>
    );
};

export default AuditLogPage;