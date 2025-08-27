'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import PredictionChart from '@/components/PredictionChart'
import RecommendationCards from '@/components/RecommendationCards'
import PredictionSummary from '@/components/PredictionSummary'

interface PredictionData {
  month: string
  predictedIncome: number
  predictedExpense: number
  predictedBalance: number
  confidence: 'high' | 'medium' | 'low'
}

interface Recommendation {
  type: 'warning' | 'success' | 'info'
  title: string
  message: string
  months?: string[]
  trend?: string
  surplus?: number
}

interface PredictionsResponse {
  predictions: PredictionData[]
  recommendations: Recommendation[]
  generatedAt: string
}

export default function PredictionsPage() {
  const { data: session, status } = useSession()
  const [data, setData] = useState<PredictionsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPredictions()
    }
  }, [status])

  const fetchPredictions = async () => {
    try {
      const res = await fetch('/api/predictions')
      const predictionsData = await res.json()
      setData(predictionsData)
    } catch (error) {
      console.error('Erro ao carregar previsões:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando previsões...</div>
  }

  if (status === 'unauthenticated') {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🔮 Previsões Financeiras
              </h1>
              {data?.generatedAt && (
                <p className="text-sm text-gray-500 mt-1">
                  Atualizado em: {new Date(data.generatedAt).toLocaleString('pt-BR')}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchPredictions}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Atualizar Previsões
              </button>
              <a
                href="/dashboard"
                className="text-blue-600 hover:text-blue-800"
              >
                ← Dashboard
              </a>
              <span className="text-gray-700">Olá, {session?.user?.name}</span>
              <a
                href="/auth/signout"
                className="btn btn-destructive px-4 py-2"
              >
                Sair
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {data ? (
          <div className="space-y-8">
            <PredictionSummary predictions={data.predictions} />
            
            <PredictionChart data={data.predictions} />
            
            <RecommendationCards recommendations={data.recommendations} />
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500 mb-4">Erro ao carregar previsões</p>
            <button
              onClick={fetchPredictions}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Tentar Novamente
            </button>
          </div>
        )}
      </div>
    </div>
  )
}