'use client'

import { formatCurrency } from '@/lib/utils'

interface Recommendation {
  type: 'warning' | 'success' | 'info'
  title: string
  message: string
  months?: string[]
  trend?: string
  surplus?: number
}

interface RecommendationCardsProps {
  recommendations: Recommendation[]
}

export default function RecommendationCards({ recommendations }: RecommendationCardsProps) {
  const getCardStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-l-4 border-yellow-400 bg-yellow-50'
      case 'success':
        return 'border-l-4 border-green-400 bg-green-50'
      case 'info':
        return 'border-l-4 border-blue-400 bg-blue-50'
      default:
        return 'border-l-4 border-gray-400 bg-gray-50'
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return '⚠️'
      case 'success': return '✅'
      case 'info': return 'ℹ️'
      default: return '📋'
    }
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recomendações</h3>
        <div className="text-center py-8 text-gray-500">
          <p>🎯 Suas finanças estão equilibradas!</p>
          <p className="text-sm mt-2">Continue monitorando suas transações para manter o controle.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Recomendações Inteligentes</h3>
      
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className={`p-4 rounded-lg ${getCardStyle(rec.type)}`}>
            <div className="flex items-start">
              <span className="text-2xl mr-3">{getIcon(rec.type)}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">{rec.title}</h4>
                <p className="text-gray-700 mb-3">{rec.message}</p>
                
                {rec.months && (
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-600 mb-1">Meses afetados:</p>
                    <div className="flex flex-wrap gap-1">
                      {rec.months.map(month => (
                        <span key={month} className="px-2 py-1 bg-white rounded text-xs font-medium">
                          {month}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {rec.trend && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Tendência:</span> +{rec.trend}
                  </p>
                )}
                
                {rec.surplus && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Excedente previsto:</span> {formatCurrency(rec.surplus)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Dicas Gerais</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Revise suas previsões mensalmente</li>
          <li>• Mantenha uma reserva de emergência</li>
          <li>• Considere investir excedentes</li>
          <li>• Monitore gastos variáveis</li>
        </ul>
      </div>
    </div>
  )
}