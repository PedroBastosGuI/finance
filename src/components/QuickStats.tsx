'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface MonthlyData {
  month: string
  income: number
  expense: number
  balance: number
}

interface QuickStatsProps {
  refresh: boolean
}

export default function QuickStats({ refresh }: QuickStatsProps) {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuickStats()
  }, [refresh])

  const fetchQuickStats = async () => {
    try {
      const res = await fetch('/api/reports')
      const data = await res.json()
      setMonthlyData(data.monthlyData || [])
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Tendência (6 meses)</h3>
        <a
          href="/reports"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Ver relatórios completos →
        </a>
      </div>
      
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={monthlyData}>
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-500">Melhor mês</p>
          <p className="font-semibold text-green-600">
            {monthlyData.length > 0 
              ? Math.max(...monthlyData.map(d => d.balance)).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })
              : 'R$ 0,00'
            }
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Média</p>
          <p className="font-semibold text-blue-600">
            {monthlyData.length > 0
              ? (monthlyData.reduce((sum, d) => sum + d.balance, 0) / monthlyData.length).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })
              : 'R$ 0,00'
            }
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Atual</p>
          <p className="font-semibold text-gray-900">
            {monthlyData.length > 0 && monthlyData[monthlyData.length - 1]
              ? monthlyData[monthlyData.length - 1].balance.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })
              : 'R$ 0,00'
            }
          </p>
        </div>
      </div>
    </div>
  )
}