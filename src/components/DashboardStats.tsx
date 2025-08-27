'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Wallet, Activity } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface DashboardData {
  income: number
  expense: number
  balance: number
  transactionCount: number
}

interface DashboardStatsProps {
  refresh: boolean
}

export default function DashboardStats({ refresh }: DashboardStatsProps) {
  const [data, setData] = useState<DashboardData>({
    income: 0,
    expense: 0,
    balance: 0,
    transactionCount: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [refresh])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard')
      const dashboardData = await res.json()
      setData(dashboardData)
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-8 bg-muted rounded mb-1"></div>
            <div className="h-3 bg-muted rounded w-16"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-muted-foreground">Receitas</h3>
          <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
        </div>
        <p className="text-2xl font-bold text-success mb-1">
          {formatCurrency(data.income)}
        </p>
        <p className="text-sm text-muted-foreground">Este mês</p>
      </div>
      
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-muted-foreground">Despesas</h3>
          <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
            <TrendingDown className="h-4 w-4 text-destructive" />
          </div>
        </div>
        <p className="text-2xl font-bold text-destructive mb-1">
          {formatCurrency(data.expense)}
        </p>
        <p className="text-sm text-muted-foreground">Este mês</p>
      </div>
      
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-muted-foreground">Saldo</h3>
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Wallet className="h-4 w-4 text-primary" />
          </div>
        </div>
        <p className={`text-2xl font-bold mb-1 ${
          data.balance >= 0 ? 'text-primary' : 'text-destructive'
        }`}>
          {formatCurrency(data.balance)}
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <Activity className="h-3 w-3" />
          {data.transactionCount} transações
        </p>
      </div>
    </div>
  )
}