import React from 'react';
import { Link } from 'react-router-dom';
import PublicFooter from '../components/PublicFooter';

const LandingPage: React.FC = () => {
    const primaryColor = '#6366f1';
    const brandName = 'Quantum';
    const logoUrl = 'fa-solid fa-atom';

    return (
         <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            <header className="p-8 flex justify-between items-center">
                <div className="flex items-center">
                    <i className={`${logoUrl} text-3xl`} style={{color: primaryColor}}></i>
                    <h1 className="text-2xl font-bold ml-3">{brandName}</h1>
                </div>
                <nav>
                    <Link to="/login" className="font-semibold py-2 px-4 rounded-lg hover:bg-slate-800 transition">
                        Entrar
                    </Link>
                </nav>
            </header>
            <main className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <h2 className="text-5xl md:text-7xl font-extrabold mb-4">
                    A Plataforma de Gestão Contábil Inteligente
                </h2>
                <p className="max-w-3xl text-lg md:text-xl text-slate-300 mb-8">
                    Eficiência, conformidade e insights para governos, bancos e grandes escritórios. Unifique todas as operações contábeis, fiscais e financeiras numa única plataforma SaaS, potenciada por IA.
                </p>
                <Link 
                    to="/login" 
                    className="text-white font-bold py-4 px-8 rounded-lg transition-transform transform hover:scale-105 text-lg"
                    style={{backgroundColor: primaryColor}}
                >
                    Comece Agora
                </Link>
            </main>
            <PublicFooter />
        </div>
    );
};

export default LandingPage;
