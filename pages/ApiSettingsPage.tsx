import React, { useState, useEffect } from 'react';
import { ApiKey } from '../types';
import { useBranding } from '../contexts/BrandingContext';
import { supabase } from '../supabase';
import { useCompany } from '../contexts/CompanyContext';

const ApiKeyRow: React.FC<{ apiKey: ApiKey; onRevoke: (id: string) => void }> = ({ apiKey, onRevoke }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(`(Simulated) ${apiKey.keyPreview}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <tr className="border-b border-slate-200">
            <td className="py-4 px-6 font-mono text-sm text-slate-700">{apiKey.keyPreview}</td>
            <td className="py-4 px-6 text-slate-500">
                 <span className={`px-2 py-1 text-xs font-semibold rounded-full ${apiKey.scope === 'read-write' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                    {apiKey.scope}
                </span>
            </td>
            <td className="py-4 px-6 text-slate-500">{new Date(apiKey.createdAt).toLocaleDateString()}</td>
            <td className="py-4 px-6 text-slate-500">{apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : 'Nunca'}</td>
            <td className="py-4 px-6">
                <div className="flex items-center space-x-3">
                    <button onClick={handleCopy} className="text-slate-500 hover:text-slate-800 p-1" title="Copiar chave">
                        <i className={`fa-solid ${copied ? 'fa-check text-green-500' : 'fa-copy'}`}></i>
                    </button>
                    <button onClick={() => onRevoke(apiKey.id)} className="text-red-500 hover:text-red-700 p-1" title="Revogar chave">
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    );
};

const ApiSettingsPage: React.FC = () => {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const { primaryColor } = useBranding();
    const { activeCompanyId } = useCompany();

    useEffect(() => {
        if (!activeCompanyId) return;
        setLoading(true);
        // This is a placeholder as api_keys might be protected.
        // In a real app, this would likely be a call to a secure serverless function.
        supabase.from('api_keys').select('*').eq('companyId', activeCompanyId)
            .then(({ data, error }) => {
                if (error) console.error("Error fetching API keys", error);
                else setApiKeys(data as ApiKey[]);
                setLoading(false);
            });
    }, [activeCompanyId]);

    const handleRevoke = async (id: string) => {
        if (window.confirm('Tem a certeza que deseja revogar esta chave de API? Esta ação não pode ser desfeita.')) {
            // In a real app, this would be a secure function call
            const { error } = await supabase.from('api_keys').delete().eq('id', id);
            if (error) {
                alert("Falha ao revogar a chave.");
            } else {
                setApiKeys(keys => keys.filter(key => key.id !== id));
            }
        }
    };

    const handleGenerateKey = () => {
        alert("Simulando a geração de uma nova chave de API...");
        // In a real app, a modal would appear showing the new key ONCE.
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-800">API & Integrações</h2>
                <p className="text-slate-500 mt-1">Gere e gira chaves de API para conectar aplicações externas à sua conta.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
                 <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Chaves de API</h3>
                        <p className="text-slate-500">As chaves de API não expiram, mas pode revogá-las a qualquer momento.</p>
                    </div>
                    <button onClick={handleGenerateKey} className="text-white font-bold py-2 px-4 rounded-lg transition flex items-center space-x-2" style={{backgroundColor: primaryColor}}>
                        <i className="fa-solid fa-plus"></i>
                        <span>Gerar Nova Chave</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    {loading ? <div className="text-center py-10">A carregar chaves de API...</div> : (
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                <tr>
                                    <th scope="col" className="py-3 px-6">Chave</th>
                                    <th scope="col" className="py-3 px-6">Escopo</th>
                                    <th scope="col" className="py-3 px-6">Criada em</th>
                                    <th scope="col" className="py-3 px-6">Último Uso</th>
                                    <th scope="col" className="py-3 px-6">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {apiKeys.map(key => (
                                    <ApiKeyRow key={key.id} apiKey={key} onRevoke={handleRevoke} />
                                ))}
                            </tbody>
                        </table>
                    )}
                    {!loading && apiKeys.length === 0 && <p className="text-center py-8 text-slate-500">Nenhuma chave de API foi gerada.</p>}
                </div>
            </div>
        </div>
    );
};

export default ApiSettingsPage;
