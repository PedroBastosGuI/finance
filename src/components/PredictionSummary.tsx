'use client'

import { formatCurrency } from '@/lib/utils'

interface PredictionData {
  month: string
  predictedIncome: number
  predictedExpense: number
  predictedBalance: number
  confidence: 'high' | 'medium' | 'low'
}

interface PredictionSummaryProps {
  predictions: PredictionData[]
}

export default function PredictionSummary({ predictions }: PredictionSummaryProps) {
  if (predictions.length === 0) {
    return null
  }

  const totalIncome = predictions.reduce((sum, p) => sum + p.predictedIncome, 0)
  const totalExpense = predictions.reduce((sum, p) => sum + p.predictedExpense, 0)
  const totalBalance = totalIncome - totalExpense
  
  const positiveMonths = predictions.filter(p => p.predictedBalance > 0).length
  const negativeMonths = predictions.filter(p => p.predictedBalance < 0).length
  
  const bestMonth = predictions.reduce((best, current) => 
    current.predictedBalance > best.predictedBalance ? current : best
  )
  
  const worstMonth = predictions.reduce((worst, current) => 
    current.predictedBalance < worst.predictedBalance ? current : worst
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Receita Total (12 meses)</h3>
        <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
        <p className="text-sm text-gray-500 mt-1">
          Média: {formatCurrency(totalIncome / 12)}/mês
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Despesa Total (12 meses)</h3>
        <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
        <p className="text-sm text-gray-500 mt-1">
          Média: {formatCurrency(totalExpense / 12)}/mês
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Saldo Previsto</h3>
        <p className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
          {formatCurrency(totalBalance)}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {positiveMonths} meses positivos, {negativeMonths} negativos
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Melhor/Pior Mês</h3>
        <div className="space-y-2">
          <div>
            <p className="text-sm text-green-600 font-medium">
              {bestMonth.month}: {formatCurrency(bestMonth.predictedBalance)}
            </p>
          </div>
          <div>
            <p className="text-sm text-red-600 font-medium">
              {worstMonth.month}: {formatCurrency(worstMonth.predictedBalance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}