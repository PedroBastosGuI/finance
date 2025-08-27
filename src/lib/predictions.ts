import { prisma } from './prisma'
import { TransactionType } from '@prisma/client'

interface MonthlyAverage {
  month: number
  income: number
  expense: number
}

interface PredictionData {
  month: string
  predictedIncome: number
  predictedExpense: number
  predictedBalance: number
  confidence: 'high' | 'medium' | 'low'
}

export async function generatePredictions(coupleId: string): Promise<PredictionData[]> {
  // Buscar dados dos últimos 12 meses
  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

  const transactions = await prisma.transaction.findMany({
    where: {
      coupleId,
      date: { gte: twelveMonthsAgo }
    },
    include: { category: true }
  })

  // Calcular médias mensais por categoria
  const monthlyData: Record<number, { income: number; expense: number }> = {}
  
  transactions.forEach(transaction => {
    const month = transaction.date.getMonth()
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0 }
    }
    
    if (transaction.type === TransactionType.INCOME) {
      monthlyData[month].income += Number(transaction.amount)
    } else {
      monthlyData[month].expense += Number(transaction.amount)
    }
  })

  // Calcular médias gerais
  const months = Object.keys(monthlyData).length
  const avgIncome = Object.values(monthlyData).reduce((sum, data) => sum + data.income, 0) / Math.max(months, 1)
  const avgExpense = Object.values(monthlyData).reduce((sum, data) => sum + data.expense, 0) / Math.max(months, 1)

  // Calcular tendência (crescimento/decrescimento)
  const recentMonths = Object.entries(monthlyData).slice(-3)
  const oldMonths = Object.entries(monthlyData).slice(0, 3)
  
  const recentAvgIncome = recentMonths.reduce((sum, [, data]) => sum + data.income, 0) / Math.max(recentMonths.length, 1)
  const oldAvgIncome = oldMonths.reduce((sum, [, data]) => sum + data.income, 0) / Math.max(oldMonths.length, 1)
  
  const recentAvgExpense = recentMonths.reduce((sum, [, data]) => sum + data.expense, 0) / Math.max(recentMonths.length, 1)
  const oldAvgExpense = oldMonths.reduce((sum, [, data]) => sum + data.expense, 0) / Math.max(oldMonths.length, 1)

  const incomeTrend = oldAvgIncome > 0 ? (recentAvgIncome - oldAvgIncome) / oldAvgIncome : 0
  const expenseTrend = oldAvgExpense > 0 ? (recentAvgExpense - oldAvgExpense) / oldAvgExpense : 0

  // Gerar previsões para próximos 12 meses
  const predictions: PredictionData[] = []
  const currentDate = new Date()

  for (let i = 1; i <= 12; i++) {
    const futureDate = new Date(currentDate)
    futureDate.setMonth(futureDate.getMonth() + i)
    
    const month = futureDate.getMonth()
    const monthName = futureDate.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
    
    // Aplicar sazonalidade baseada em dados históricos
    const seasonalIncome = monthlyData[month]?.income || avgIncome
    const seasonalExpense = monthlyData[month]?.expense || avgExpense
    
    // Aplicar tendência com decaimento
    const trendFactor = Math.max(0.1, 1 - (i * 0.05)) // Decaimento da tendência
    const predictedIncome = seasonalIncome * (1 + (incomeTrend * trendFactor))
    const predictedExpense = seasonalExpense * (1 + (expenseTrend * trendFactor))
    
    // Calcular confiança baseada na quantidade de dados
    let confidence: 'high' | 'medium' | 'low' = 'low'
    if (months >= 6) confidence = 'medium'
    if (months >= 12) confidence = 'high'
    
    predictions.push({
      month: monthName,
      predictedIncome: Math.max(0, predictedIncome),
      predictedExpense: Math.max(0, predictedExpense),
      predictedBalance: predictedIncome - predictedExpense,
      confidence
    })
  }

  return predictions
}

export function generateRecommendations(predictions: PredictionData[]) {
  const recommendations = []
  
  // Verificar meses com saldo negativo
  const negativeMonths = predictions.filter(p => p.predictedBalance < 0)
  if (negativeMonths.length > 0) {
    recommendations.push({
      type: 'warning',
      title: 'Atenção: Saldos Negativos Previstos',
      message: `${negativeMonths.length} meses com saldo negativo previsto. Considere reduzir gastos ou aumentar receitas.`,
      months: negativeMonths.map(m => m.month)
    })
  }
  
  // Verificar tendência de gastos
  const avgExpense = predictions.reduce((sum, p) => sum + p.predictedExpense, 0) / predictions.length
  const lastMonthExpense = predictions[predictions.length - 1].predictedExpense
  const firstMonthExpense = predictions[0].predictedExpense
  
  if (lastMonthExpense > firstMonthExpense * 1.1) {
    recommendations.push({
      type: 'warning',
      title: 'Tendência de Aumento de Gastos',
      message: 'Seus gastos tendem a aumentar ao longo do tempo. Monitore suas despesas.',
      trend: ((lastMonthExpense - firstMonthExpense) / firstMonthExpense * 100).toFixed(1) + '%'
    })
  }
  
  // Verificar oportunidades de economia
  const totalPredictedExpense = predictions.reduce((sum, p) => sum + p.predictedExpense, 0)
  const totalPredictedIncome = predictions.reduce((sum, p) => sum + p.predictedIncome, 0)
  
  if (totalPredictedIncome > totalPredictedExpense * 1.2) {
    recommendations.push({
      type: 'success',
      title: 'Oportunidade de Investimento',
      message: 'Você terá excedente financeiro. Considere investir o dinheiro extra.',
      surplus: totalPredictedIncome - totalPredictedExpense
    })
  }
  
  return recommendations
}