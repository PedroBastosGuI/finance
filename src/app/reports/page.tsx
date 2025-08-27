'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import MonthlyChart from '@/components/MonthlyChart'
import CategoryChart from '@/components/CategoryChart'
import ReportsTable from '@/components/ReportsTable'

interface ReportsData {
  monthlyData: Array<{
    month: string
    income: number
    expense: number
    balance: number
  }>
  categoryData: Array<{
    name: string
    icon: string
    color: string
    income: number
    expense: number
  }>
}

export default function ReportsPage() {
  const { data: session, status } = useSession()
  const [data, setData] = useState<ReportsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchReportsData()
    }
  }, [status])

  const fetchReportsData = async () => {
    try {
      const res = await fetch('/api/reports')
      const reportsData = await res.json()
      setData(reportsData)
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  if (status === 'unauthenticated') {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              📊 Relatórios Financeiros
            </h1>
            <div className="flex items-center space-x-4">
              <a
                href="/dashboard"
                className="text-blue-600 hover:text-blue-800"
              >
                ← Voltar ao Dashboard
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
            <MonthlyChart data={data.monthlyData} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CategoryChart data={data.categoryData} type="income" />
              <CategoryChart data={data.categoryData} type="expense" />
            </div>
            
            <ReportsTable data={data.categoryData} />
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500">Erro ao carregar relatórios</p>
          </div>
        )}
      </div>
    </div>
  )
}