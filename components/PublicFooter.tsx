import React from 'react';
import { Link } from 'react-router-dom';

const PublicFooter: React.FC = () => {
    return (
        <footer className="bg-transparent text-slate-400 p-8 text-center">
            <div className="space-x-6">
                <Link to="/termos" className="text-sm hover:text-white transition">Termos de Serviço</Link>
                <Link to="/privacidade" className="text-sm hover:text-white transition">Política de Privacidade</Link>
                <Link to="/legal" className="text-sm hover:text-white transition">Aviso Legal</Link>
            </div>
            <p className="mt-4 text-sm">&copy; {new Date().getFullYear()} Quantum. Todos os direitos reservados.</p>
        </footer>
    );
};

export default PublicFooter;