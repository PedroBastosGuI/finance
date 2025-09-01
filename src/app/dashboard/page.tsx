'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { LayoutDashboard, BarChart3, TrendingUp, LogOut, Menu } from 'lucide-react'
import TransactionForm from '@/components/TransactionForm'
import TransactionTabs from '@/components/TransactionTabs'
import EditTransactionModal from '@/components/EditTransactionModal'
import CoupleSetup from '@/components/CoupleSetup'
import DashboardStats from '@/components/DashboardStats'
import QuickStats from '@/components/QuickStats'
import PredictionPreview from '@/components/PredictionPreview'
import InvitePartner from '@/components/InvitePartner'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [hasCouple, setHasCouple] = useState<boolean | null>(null)
  const [refreshTransactions, setRefreshTransactions] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<any>(null)
  const [selectedMonth, setSelectedMonth] = useState<string>('')

  useEffect(() => {
    if (status === 'authenticated') {
      checkCouple()
    }
  }, [status])

  const checkCouple = async () => {
    try {
      const res = await fetch('/api/categories')
      setHasCouple(res.ok)
    } catch {
      setHasCouple(false)
    }
  }

  if (status === 'loading' || hasCouple === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    redirect('/auth/login')
  }

  if (!hasCouple) {
    return <CoupleSetup onSuccess={() => setHasCouple(true)} />
  }

  const handleTransactionSuccess = () => {
    setRefreshTransactions(!refreshTransactions)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <LayoutDashboard className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">Dashboard</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-1">
                <a
                  href="/dashboard"
                  className="px-3 py-2 text-sm font-medium bg-primary/10 text-primary rounded-md"
                >
                  Dashboard
                </a>
                <a
                  href="/reports"
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md flex items-center gap-1"
                >
                  <BarChart3 className="h-4 w-4" />
                  Relatórios
                </a>
                <a
                  href="/predictions"
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md flex items-center gap-1"
                >
                  <TrendingUp className="h-4 w-4" />
                  Previsões
                </a>
              </nav>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground hidden sm:block">
                  Olá, {session?.user?.name}
                </span>
                <a
                  href="/auth/signout"
                  className="btn btn-destructive p-2"
                  title="Sair"
                >
                  <LogOut className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats refresh={refreshTransactions} selectedMonth={selectedMonth} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <TransactionForm onSuccess={handleTransactionSuccess} />
            <InvitePartner />
            <QuickStats refresh={refreshTransactions} />
            <PredictionPreview refresh={refreshTransactions} />
          </div>
          
          <div className="lg:col-span-2">
            <TransactionTabs 
              refresh={refreshTransactions} 
              onEdit={setEditingTransaction}
              onMonthChange={setSelectedMonth}
            />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditTransactionModal
        transaction={editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onSuccess={handleTransactionSuccess}
      />
    </div>
  )
}