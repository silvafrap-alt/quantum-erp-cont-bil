import React from 'react';
import { Link } from 'react-router-dom';
import PublicFooter from '../components/PublicFooter';

const PrivacyPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">
            <header className="bg-white shadow-sm p-4 text-center">
                 <Link to="/" className="text-2xl font-bold text-slate-800">Quantum</Link>
            </header>
            <main className="flex-1 container mx-auto p-8 max-w-4xl">
                 <div className="bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-slate-900 mb-6">Política de Privacidade</h1>
                    <div className="prose prose-slate max-w-none">
                        <p><strong>Última atualização:</strong> [Inserir Data]</p>

                        <h2>1. Introdução</h2>
                        <p>A sua privacidade é importante para nós. Esta política de privacidade explica que dados pessoais recolhemos dos nossos utilizadores, como os usamos e os seus direitos em relação a esses dados, em conformidade com as leis de proteção de dados aplicáveis.</p>

                        <h2>2. Dados que Recolhemos</h2>
                        <p>Recolhemos informações que você nos fornece diretamente, como nome, email e dados de faturação ao criar uma conta. Também recolhemos dados operacionais que você insere na plataforma (dados de clientes, faturas, transações).</p>

                        <h2>3. Como Usamos os Seus Dados</h2>
                        <p>Utilizamos os seus dados para:</p>
                        <ul>
                            <li>Fornecer, operar e manter o nosso Serviço.</li>
                            <li>Processar transações e enviar informações relacionadas.</li>
                            <li>Comunicar consigo, incluindo para fins de suporte ao cliente.</li>
                            <li>Melhorar e personalizar o nosso Serviço.</li>
                        </ul>

                        <h2>4. Partilha de Dados</h2>
                        <p>Não partilhamos os seus dados pessoais com terceiros, exceto quando necessário para fornecer o Serviço (ex: processadores de pagamento como o Stripe) ou quando exigido por lei.</p>

                        <h2>5. Segurança dos Dados</h2>
                        <p>Implementamos medidas de segurança técnicas e organizacionais para proteger os seus dados pessoais contra acesso, alteração, divulgação ou destruição não autorizados.</p>

                        <h2>6. Os Seus Direitos</h2>
                        <p>Você tem o direito de aceder, corrigir ou eliminar os seus dados pessoais. Pode exercer estes direitos contactando-nos através do nosso suporte.</p>

                         <h2>7. Contacto</h2>
                        <p>Se tiver alguma questão sobre esta Política de Privacidade, por favor, contacte-nos através de [Email de Suporte].</p>
                    </div>
                 </div>
            </main>
            <PublicFooter />
        </div>
    );
};

export default PrivacyPage;
