import React from 'react';
import { Link } from 'react-router-dom';
import PublicFooter from '../components/PublicFooter';

const LegalPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">
            <header className="bg-white shadow-sm p-4 text-center">
                 <Link to="/" className="text-2xl font-bold text-slate-800">Quantum</Link>
            </header>
            <main className="flex-1 container mx-auto p-8 max-w-4xl">
                 <div className="bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-slate-900 mb-6">Aviso Legal</h1>
                    <div className="prose prose-slate max-w-none">
                        <p><strong>Última atualização:</strong> [Inserir Data]</p>
                        
                        <h2>1. Identificação do Proprietário do Website</h2>
                        <p><strong>Nome da Empresa:</strong> [Nome da Sua Empresa]</p>
                        <p><strong>NIF/VAT:</strong> [Número de Identificação Fiscal]</p>
                        <p><strong>Endereço:</strong> [Endereço da Empresa]</p>
                        <p><strong>Email de Contacto:</strong> [Email de Suporte/Legal]</p>

                        <h2>2. Propriedade Intelectual e Industrial</h2>
                        <p>O conteúdo deste website, incluindo textos, imagens, design gráfico, códigos-fonte, logos, e marcas, é propriedade exclusiva da [Nome da Sua Empresa] ou de terceiros que autorizaram o seu uso, e está protegido pelas leis de propriedade intelectual.</p>

                        <h2>3. Responsabilidade</h2>
                        <p>O Quantum não se responsabiliza pelo uso indevido das informações contidas no website. O conteúdo é oferecido com fins informativos e a [Nome da Sua Empresa] não garante a sua exatidão ou atualização completa.</p>

                        <h2>4. Lei Aplicável e Jurisdição</h2>
                        <p>Qualquer litígio relacionado com o website Quantum será regido pela lei de [País da Empresa] e submetido à jurisdição exclusiva dos tribunais da cidade de [Cidade da Empresa].</p>
                        
                        <h2>5. Links para Terceiros</h2>
                        <p>Este website pode conter links para websites de terceiros. A [Nome da Sua Empresa] não se responsabiliza pelo conteúdo ou pelas políticas de privacidade desses websites.</p>
                    </div>
                 </div>
            </main>
            <PublicFooter />
        </div>
    );
};

export default LegalPage;