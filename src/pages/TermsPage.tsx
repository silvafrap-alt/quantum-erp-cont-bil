import React from 'react';
import { Link } from 'react-router-dom';
import PublicFooter from '../components/PublicFooter';

const TermsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">
            <header className="bg-white shadow-sm p-4 text-center">
                 <Link to="/" className="text-2xl font-bold text-slate-800">Quantum</Link>
            </header>
            <main className="flex-1 container mx-auto p-8 max-w-4xl">
                 <div className="bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-slate-900 mb-6">Termos e Condições de Uso</h1>
                    <div className="prose prose-slate max-w-none">
                        <p><strong>Última atualização:</strong> [Inserir Data]</p>
                        
                        <h2>1. Aceitação dos Termos</h2>
                        <p>Ao aceder e utilizar a plataforma Quantum ("Serviço"), você concorda em cumprir e estar vinculado por estes Termos e Condições de Uso. Se não concordar com estes termos, não utilize o Serviço.</p>

                        <h2>2. Descrição do Serviço</h2>
                        <p>O Quantum é uma plataforma de Software-as-a-Service (SaaS) que fornece ferramentas de gestão contábil, fiscal e financeira. A licença de uso é concedida de forma não exclusiva, intransmissível e limitada ao plano subscrito.</p>

                        <h2>3. Contas de Utilizador</h2>
                        <p>Você é responsável por manter a confidencialidade da sua conta e palavra-passe. Todas as atividades que ocorram sob a sua conta são da sua responsabilidade.</p>

                        <h2>4. Pagamentos e Renovações</h2>
                        <p>As subscrições são faturadas anualmente e renovam-se automaticamente, salvo cancelamento prévio de acordo com os termos do contrato de licenciamento.</p>

                        <h2>5. Propriedade Intelectual</h2>
                        <p>O Serviço e todo o seu conteúdo original, funcionalidades e tecnologia são e continuarão a ser propriedade exclusiva da [Nome da Sua Empresa] e dos seus licenciantes.</p>

                        {/* Adicionar mais cláusulas conforme necessário */}

                        <h2>6. Limitação de Responsabilidade</h2>
                        <p>Em nenhuma circunstância a [Nome da Sua Empresa] será responsável por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos resultantes do seu acesso ou uso do Serviço.</p>

                        <h2>7. Contacto</h2>
                        <p>Se tiver alguma questão sobre estes Termos, por favor, contacte-nos através de [Email de Suporte].</p>
                    </div>
                 </div>
            </main>
            <PublicFooter />
        </div>
    );
};

export default TermsPage;
