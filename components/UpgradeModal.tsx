
import React from 'react';
import { Link } from 'react-router-dom';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                        <i className="fa-solid fa-star text-3xl text-yellow-500"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{title}</h3>
                    <p className="text-slate-500 mb-6">{message}</p>
                    <div className="flex justify-center space-x-4">
                        <button 
                            onClick={onClose} 
                            className="font-bold py-2 px-6 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition"
                        >
                            Fechar
                        </button>
                        <Link 
                            to="/planos"
                            onClick={onClose}
                            className="font-bold py-2 px-6 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                        >
                            Fazer Upgrade
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;
