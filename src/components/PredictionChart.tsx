'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts'

interface PredictionData {
  month: string
  predictedIncome: number
  predictedExpense: number
  predictedBalance: number
  confidence: 'high' | 'medium' | 'low'
}

interface PredictionChartProps {
  data: PredictionData[]
}

export default function PredictionChart({ data }: PredictionChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value)
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return '#10B981'
      case 'medium': return '#F59E0B'
      case 'low': return '#EF4444'
      default: return '#6B7280'
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Previsões - Próximos 12 Meses</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span>Alta confiança</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
            <span>Média confiança</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            <span>Baixa confiança</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend />
          <ReferenceLine y={0} stroke="#000" strokeDasharray="2 2" />
          
          <Line
            type="monotone"
            dataKey="predictedIncome"
            stroke="#10B981"
            strokeWidth={2}
            name="Receitas Previstas"
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="predictedExpense"
            stroke="#EF4444"
            strokeWidth={2}
            name="Despesas Previstas"
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="predictedBalance"
            stroke="#3B82F6"
            strokeWidth={3}
            name="Saldo Previsto"
            dot={(props) => {
              const confidence = data[props.payload?.index]?.confidence || 'low'
              return (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={5}
                  fill={getConfidenceColor(confidence)}
                  stroke="#fff"
                  strokeWidth={2}
                />
              )
            }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>
          * As previsões são baseadas no histórico de transações e tendências identificadas.
          A confiança diminui para meses mais distantes.
        </p>
      </div>
    </div>
  )
}