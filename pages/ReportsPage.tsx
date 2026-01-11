import React from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { SubscriptionPlan } from '../types';
import FeatureLock from '../components/FeatureLock';
import { useBranding } from '../contexts/BrandingContext';

const ReportCard: React.FC<{ title: string; description: string; icon: string; }> = ({ title, description, icon }) => {
    const { primaryColor } = useBranding();
    return (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col items-start hover:shadow-lg hover:border-[var(--primary-color)] transition-all cursor-pointer">
            <i className={`${icon} text-3xl mb-4`} style={{color: primaryColor}}></i>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 flex-1 mb-4">{description}</p>
            <button className="text-sm font-semibold hover:opacity-75" style={{color: primaryColor}}>Gerar Relatório <i className="fa-solid fa-arrow-right ml-1"></i></button>
        </div>
    );
}


const ReportsPage: React.FC = () => {
    const { planDetails } = useSubscription();
    const { primaryColor } = useBranding();
    const isBasicPlan = planDetails.name === SubscriptionPlan.BASIC;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-800">Central de Relatórios</h2>
                <p className="text-slate-500 mt-1">Gere e exporte relatórios financeiros e contábeis detalhados.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Gerar Novo Relatório</h3>
                <p className="text-slate-500 mb-6">Selecione o tipo de relatório e o período desejado.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Relatório</label>
                        <select className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2" style={{'--tw-ring-color': primaryColor} as React.CSSProperties}>
                            <option>Demonstração de Resultados (DRE)</option>
                            <option disabled={isBasicPlan}>Balancete</option>
                            <option disabled={isBasicPlan}>Razão Contábil</option>
                            <option disabled={isBasicPlan}>Fluxo de Caixa</option>
                        </select>
                         {isBasicPlan && <p className="text-xs text-slate-500 mt-1">Relatórios avançados disponíveis no plano Standard ou superior.</p>}
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Data Início</label>
                        <input type="date" className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2" style={{'--tw-ring-color': primaryColor} as React.CSSProperties} />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Data Fim</label>
                        <input type="date" className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2" style={{'--tw-ring-color': primaryColor} as React.CSSProperties} />
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <button className="text-white font-bold py-3 px-6 rounded-lg transition flex items-center space-x-2" style={{backgroundColor: primaryColor}}>
                        <i className="fa-solid fa-file-pdf"></i>
                        <span>Exportar PDF</span>
                    </button>
                    <FeatureLock requiredPlan={SubscriptionPlan.STANDARD} requiredAddon="relatorios-avancados">
                        <button className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition flex items-center space-x-2">
                            <i className="fa-solid fa-file-excel"></i>
                            <span>Exportar Excel</span>
                        </button>
                    </FeatureLock>
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ReportCard 
                    title="Demonstração de Resultados (DRE)" 
                    description="Visualize a performance financeira da sua empresa em um período específico, detalhando receitas, custos e despesas."
                    icon="fa-solid fa-chart-line"
                />
                 <ReportCard 
                    title="Balancete de Verificação" 
                    description="Confira a igualdade entre os débitos e créditos das contas, garantindo a consistência dos seus lançamentos contábeis."
                    icon="fa-solid fa-scale-balanced"
                />
                 <ReportCard 
                    title="Histórico Fiscal" 
                    description="Acesse um resumo de todas as declarações fiscais enviadas, com datas, status e documentos associados."
                    icon="fa-solid fa-landmark"
                />
            </div>

        </div>
    );
};

export default ReportsPage;