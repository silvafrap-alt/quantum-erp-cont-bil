import React, { useState, useEffect } from 'react';
import { AiInsight } from '../types';
import { useCompany } from '../contexts/CompanyContext';
import { aiService } from '../services/aiService';
import { useBranding } from '../contexts/BrandingContext';

const AiInsightsWidget: React.FC = () => {
    const [insights, setInsights] = useState<AiInsight[]>([]);
    const [loading, setLoading] = useState(true);
    const { activeCompanyId } = useCompany();
    const { primaryColor } = useBranding();

    useEffect(() => {
        const fetchInsights = async () => {
            if (!activeCompanyId) return;
            setLoading(true);
            const generatedInsights = await aiService.getFinancialInsights(activeCompanyId);
            setInsights(generatedInsights);
            setLoading(false);
        };

        fetchInsights();
    }, [activeCompanyId]);

    const insightIcon = (type: AiInsight['type']) => {
        switch (type) {
            case 'warning': return { icon: 'fa-solid fa-triangle-exclamation', color: 'text-amber-500' };
            case 'info': return { icon: 'fa-solid fa-lightbulb', color: 'text-blue-500' };
            case 'success': return { icon: 'fa-solid fa-chart-line', color: 'text-green-500' };
            default: return { icon: 'fa-solid fa-info-circle', color: 'text-slate-500' };
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                <i className="fa-solid fa-brain mr-3" style={{color: primaryColor}}></i>
                Análises com IA
            </h3>
            {loading ? (
                <div className="text-center py-4">
                    <i className="fa-solid fa-spinner animate-spin text-2xl" style={{color: primaryColor}}></i>
                    <p className="text-sm text-slate-500 mt-2">Analisando dados...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {insights.length > 0 ? insights.map(insight => {
                         const { icon, color } = insightIcon(insight.type);
                         return (
                            <div key={insight.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                                <i className={`${icon} ${color} text-lg mt-1`}></i>
                                <div>
                                    <p className="font-semibold text-slate-700 text-sm">{insight.title}</p>
                                    <p className="text-slate-500 text-xs">{insight.description}</p>
                                </div>
                            </div>
                         );
                    }) : (
                        <div className="text-center py-4">
                            <i className="fa-solid fa-face-meh text-3xl text-slate-300 mb-2"></i>
                            <p className="text-sm text-slate-500">Não há insights suficientes no momento.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AiInsightsWidget;
