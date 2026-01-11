import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCancelPage: React.FC = () => {
    return (
        <div className="bg-white p-8 md:p-12 rounded-xl shadow-md max-w-2xl mx-auto text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
                <i className="fa-solid fa-times-circle text-5xl text-red-500"></i>
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Pagamento Cancelado</h2>
            <p className="text-slate-500 mt-4 text-lg">
                O processo de pagamento foi cancelado. Você não foi cobrado.
            </p>
            <p className="text-slate-500 mt-2">
                Se você mudou de ideia, pode escolher um plano a qualquer momento.
            </p>
            <Link 
                to="/planos"
                className="mt-8 inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition"
            >
                Ver Planos
            </Link>
        </div>
    );
};

export default PaymentCancelPage;
