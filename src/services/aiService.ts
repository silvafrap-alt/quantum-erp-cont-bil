// This file mocks a service layer that would use a real AI model on the backend.

import { AiInsight, Transaction } from "../types";
import { supabase } from '../supabase';

export const aiService = {
  /**
   * Mocks calling a backend AI service to get financial insights.
   */
  async getFinancialInsights(companyId: string): Promise<AiInsight[]> {
    console.log('AI SERVICE: Analyzing financial data for company', { companyId });

    // Simulate network latency for AI processing
    await new Promise(resolve => setTimeout(resolve, 1200)); 

    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('companyId', companyId);

    if (error) {
        console.error("AI Service Error: Could not fetch transactions.", error);
        return [];
    }

    const companyTransactions: Transaction[] = data || [];

    if (companyTransactions.length < 3) {
        return [];
    }
    
    const insights: AiInsight[] = [];

    // Insight 1: Check for unusually large expenses
    const expenseTransactions = companyTransactions.filter(t => t.type === 'Despesa');
    const averageExpense = expenseTransactions.reduce((acc, t) => acc + t.amount, 0) / (expenseTransactions.length || 1);

    const largeExpenses = expenseTransactions.filter(t => t.amount > averageExpense * 2.5);
    
    if (largeExpenses.length > 0) {
        insights.push({
            id: 'insight-1',
            type: 'warning',
            title: 'Despesa Incomum Detectada',
            description: `A despesa "${largeExpenses[0].description}" de ${largeExpenses[0].amount.toFixed(2)} está significativamente acima da média.`
        });
    }

    // Insight 2: Revenue trend
    const recentRevenue = companyTransactions
        .filter(t => t.type === 'Receita' && new Date(t.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .reduce((acc, t) => acc + t.amount, 0);

    if (recentRevenue > 5000) {
         insights.push({
            id: 'insight-2',
            type: 'success',
            title: 'Bom Desempenho de Receitas',
            description: `As receitas nos últimos 30 dias estão fortes. Continue o bom trabalho!`
        });
    }

    // Insight 3: Suggestion for cost reduction
    const softwareExpenses = companyTransactions
        .filter(t => t.account === 'Despesas com Software');

    if (softwareExpenses.length > 0) {
        insights.push({
            id: 'insight-3',
            type: 'info',
            title: 'Oportunidade de Otimização',
            description: 'Considere revisar suas subscrições de software para potenciais reduções de custos.'
        });
    }

    console.log('AI SERVICE: Generated insights', { insights });
    return insights;
  }
};
