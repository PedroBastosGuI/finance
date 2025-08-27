'use client'

import { useState, useEffect } from 'react'
import { formatCurrency } from '@/lib/utils'

interface PredictionPreviewProps {
  refresh: boolean
}

export default function PredictionPreview({ refresh }: PredictionPreviewProps) {
  const [nextMonthPrediction, setNextMonthPrediction] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPredictionPreview()
  }, [refresh])

  const fetchPredictionPreview = async () => {
    try {
      const res = await fetch('/api/predictions')
      const data = await res.json()
      if (data.predictions && data.predictions.length > 0) {
        setNextMonthPrediction(data.predictions[0])
      }
    } catch (error) {
      console.error('Erro ao carregar preview de previsão:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!nextMonthPrediction) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">🔮 Próximo Mês</h3>
        <p className="text-gray-500 text-center py-4">
          Adicione mais transações para gerar previsões
        </p>
      </div>
    )
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getConfidenceText = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'Alta confiança'
      case 'medium': return 'Média confiança'
      case 'low': return 'Baixa confiança'
      default: return 'Sem dados'
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">🔮 Próximo Mês</h3>
        <a
          href="/predictions"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Ver todas previsões →
        </a>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">Mês</p>
          <p className="font-semibold">{nextMonthPrediction.month}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Receitas</p>
            <p className="font-semibold text-green-600">
              {formatCurrency(nextMonthPrediction.predictedIncome)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Despesas</p>
            <p className="font-semibold text-red-600">
              {formatCurrency(nextMonthPrediction.predictedExpense)}
            </p>
          </div>
        </div>
        
        <div className="pt-3 border-t">
          <p className="text-sm text-gray-500">Saldo Previsto</p>
          <p className={`text-xl font-bold ${
            nextMonthPrediction.predictedBalance >= 0 ? 'text-blue-600' : 'text-red-600'
          }`}>
            {formatCurrency(nextMonthPrediction.predictedBalance)}
          </p>
          <p className={`text-xs ${getConfidenceColor(nextMonthPrediction.confidence)}`}>
            {getConfidenceText(nextMonthPrediction.confidence)}
          </p>
        </div>
      </div>
    </div>
  )
}