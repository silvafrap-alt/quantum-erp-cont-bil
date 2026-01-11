import React, { useState, useMemo, useEffect } from 'react';
import { Client } from '../types';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useCompany } from '../contexts/CompanyContext';
import UpgradeModal from '../components/UpgradeModal';
import ClientForm from '../components/ClientForm'; // Importar o novo componente
import { supabase } from '../supabase';

const PAGE_SIZE = 10;

const ClientRow: React.FC<{ client: Client, onEdit: (client: Client) => void }> = ({ client, onEdit }) => (
    <tr className="border-b border-slate-200 hover:bg-slate-50">
        <td className="py-4 px-6 font-medium text-slate-900">{client.name}</td>
        <td className="py-4 px-6 text-slate-500">{client.nif}</td>
        <td className="py-4 px-6 text-slate-500">{client.email}</td>
        <td className="py-4 px-6 text-slate-500">{client.phone}</td>
        <td className="py-4 px-6 text-slate-500">{new Date(client.createdAt).toLocaleDateString()}</td>
        <td className="py-4 px-6">
            <div className="flex items-center space-x-2">
                <button className="text-blue-500 hover:text-blue-700 p-1"><i className="fa-solid fa-eye"></i></button>
                <button onClick={() => onEdit(client)} className="text-green-500 hover:text-green-700 p-1"><i className="fa-solid fa-pencil"></i></button>
                <button className="text-red-500 hover:text-red-700 p-1"><i className="fa-solid fa-trash"></i></button>
            </div>
        </td>
    </tr>
);

const ClientsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { canAddClient, planDetails } = useSubscription();
    const { activeCompany } = useCompany();
if (!activeCompany) {
  return <p>Selecione uma empresa</p>;
}
    const activeCompanyId = activeCompany?.id;
    const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalClients, setTotalClients] = useState(0);

    const fetchClients = async () => {
        if (!activeCompanyId) return;
        setLoading(true);
        setError(null);

        const from = (currentPage - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        try {
            const { data, error, count } = await supabase
                .from('clients')
                .select('*', { count: 'exact' })
                .eq('companyId', activeCompanyId)
                .order('createdAt', { ascending: false })
                .range(from, to);
            
            if (error) throw error;
            
            setClients(data as Client[]);
            setTotalClients(count || 0);

        } catch (err: any) {
            console.error("Error fetching clients", err);
            setError("Não foi possível carregar os clientes. Por favor, tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, [activeCompanyId, currentPage]);

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.nif.includes(searchTerm)
    );

    const handleAddNewClient = () => {
        if (!canAddClient()) {
            setUpgradeModalOpen(true);
        } else {
            setEditingClient(null);
            setIsFormOpen(true);
        }
    };
    
    const handleEditClient = (client: Client) => {
        setEditingClient(client);
        setIsFormOpen(true);
    };

    const handleSaveClient = async (formData: Partial<Client>) => {
        if (!activeCompanyId) throw new Error("No active company");
        
        const dataToSave = { ...formData, companyId: activeCompanyId };

        if (editingClient?.id) {
            // Update
            const { error } = await supabase.from('clients').update(dataToSave).eq('id', editingClient.id);
            if (error) throw error;
        } else {
            // Create
            const { error } = await supabase.from('clients').insert(dataToSave);
            if (error) throw error;
        }
        await fetchClients();
        setIsFormOpen(false);
        setEditingClient(null);
    };

    const totalPages = Math.ceil(totalClients / PAGE_SIZE);

    return (
        <>
            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setUpgradeModalOpen(false)}
                title="Limite de Clientes Atingido"
                message={`Você atingiu o limite de ${planDetails.limits.clients} clientes do seu plano atual. Para adicionar mais clientes, por favor, faça o upgrade do seu plano.`}
            />
            <ClientForm 
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSave={handleSaveClient}
                client={editingClient}
            />
            <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Gestão de Clientes</h2>
                        <p className="text-slate-500">Adicione, edite e visualize os seus clientes.</p>
                    </div>
                    <button 
                        onClick={handleAddNewClient}
                        className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2"
                    >
                        <i className="fa-solid fa-plus"></i>
                        <span>Novo Cliente</span>
                    </button>
                </div>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Pesquisar por nome ou NIF..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/3 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="overflow-x-auto">
                    {loading ? <div className="text-center py-10">A carregar clientes...</div> : 
                     error ? <div className="text-center py-10 text-red-500">{error}</div> : (
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                <tr>
                                    <th scope="col" className="py-3 px-6">Nome</th>
                                    <th scope="col" className="py-3 px-6">NIF/CNPJ</th>
                                    <th scope="col" className="py-3 px-6">Email</th>
                                    <th scope="col" className="py-3 px-6">Telefone</th>
                                    <th scope="col" className="py-3 px-6">Cliente Desde</th>
                                    <th scope="col" className="py-3 px-6">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClients.length > 0 ? filteredClients.map(client => (
                                    <ClientRow key={client.id} client={client} onEdit={handleEditClient} />
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-10 text-slate-500">
                                            Nenhum cliente encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                     )}
                </div>
                {totalClients > 0 && !loading && !error && (
                    <div className="flex justify-between items-center pt-4">
                        <span className="text-sm text-slate-600">
                            Página {currentPage} de {totalPages} (Total: {totalClients} clientes)
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
        </>
    );
};

export default ClientsPage;