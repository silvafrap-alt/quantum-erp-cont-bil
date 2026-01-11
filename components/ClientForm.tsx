import React, { useState, useEffect } from 'react';
import { Client, ClientType } from '../types';
import { useBranding } from '../contexts/BrandingContext';

interface ClientFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (client: Partial<Client>) => Promise<void>;
    client: Client | null; // null for creating, Client object for editing
}

const ClientForm: React.FC<ClientFormProps> = ({ isOpen, onClose, onSave, client }) => {
    const { primaryColor } = useBranding();
    const [formData, setFormData] = useState<Partial<Client>>({
        name: '',
        type: ClientType.INDIVIDUAL,
        nif: '',
        email: '',
        phone: '',
        address: '',
        economicActivity: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (client) {
                setFormData(client);
            } else {
                setFormData({
                    name: '',
                    type: ClientType.INDIVIDUAL,
                    nif: '',
                    email: '',
                    phone: '',
                    address: '',
                    economicActivity: ''
                });
            }
            setError('');
        }
    }, [client, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = (): boolean => {
        if (!formData.name?.trim() || !formData.nif?.trim()) {
            setError('Nome e NIF são campos obrigatórios.');
            return false;
        }
        if (formData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                setError('O formato do email é inválido.');
                return false;
            }
        }
        // Em um app real, adicionar validações mais complexas para NIF/CPF/CNPJ.
        return true;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setError('');
        setLoading(true);
        try {
            // Em um app de produção, a validação final ocorreria no backend (ex: Supabase Function)
            // para garantir a integridade dos dados, independentemente do cliente.
            await onSave(formData);
        } catch (err) {
            setError('Ocorreu um erro ao salvar o cliente. Tente novamente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full transform transition-all" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">{client ? 'Editar Cliente' : 'Novo Cliente'}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Nome Completo / Razão Social</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2" style={{'--tw-ring-color': primaryColor} as React.CSSProperties} />
                        </div>
                         <div>
                            <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                            <select name="type" id="type" value={formData.type} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2" style={{'--tw-ring-color': primaryColor} as React.CSSProperties}>
                                <option value={ClientType.INDIVIDUAL}>Pessoa Física</option>
                                <option value={ClientType.CORPORATE}>Pessoa Jurídica</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="nif" className="block text-sm font-medium text-slate-700 mb-1">NIF / CPF / CNPJ</label>
                            <input type="text" name="nif" id="nif" value={formData.nif} onChange={handleChange} required className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2" style={{'--tw-ring-color': primaryColor} as React.CSSProperties} />
                        </div>
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2" style={{'--tw-ring-color': primaryColor} as React.CSSProperties} />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                            <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2" style={{'--tw-ring-color': primaryColor} as React.CSSProperties} />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">Endereço</label>
                            <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2" style={{'--tw-ring-color': primaryColor} as React.CSSProperties} />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="economicActivity" className="block text-sm font-medium text-slate-700 mb-1">Atividade Económica</label>
                        <input type="text" name="economicActivity" id="economicActivity" value={formData.economicActivity} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2" style={{'--tw-ring-color': primaryColor} as React.CSSProperties} />
                    </div>
                    
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="font-bold py-2 px-6 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="font-bold py-2 px-6 rounded-lg text-white transition disabled:opacity-50" style={{backgroundColor: primaryColor}}>
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientForm;