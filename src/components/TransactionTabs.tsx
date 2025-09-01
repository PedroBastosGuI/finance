'use client'

import { useState, useEffect } from 'react'
import { TransactionType, PaymentMethod } from '@prisma/client'
import { formatCurrency } from '@/lib/utils'
import { formatDateToMonth, getCurrentMonth } from '@/lib/dateUtils'
import { toast } from 'react-toastify'
import ConfirmModal from './ConfirmModal'
import { Calendar, Edit, Trash2, CreditCard, Smartphone, Banknote, ArrowLeftRight, DollarSign, CheckSquare, Square } from 'lucide-react'

interface Transaction {
  id: string
  description: string
  amount: number
  type: TransactionType
  paymentMethod?: PaymentMethod
  date: string
  category: {
    name: string
    icon: string
  }
  user: {
    name: string
  }
}

interface TransactionTabsProps {
  refresh: boolean
  onEdit: (transaction: Transaction) => void
  onMonthChange?: (month: string) => void
}

export default function TransactionTabs({ refresh, onEdit, onMonthChange }: TransactionTabsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('')
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set())
  const [groupBy, setGroupBy] = useState<'month' | 'category'>('month')
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; transactionId: string; description: string }>({ 
    isOpen: false, 
    transactionId: '', 
    description: '' 
  })
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [refresh])

  useEffect(() => {
    // Quando novas transações são adicionadas, recalcular abas
    if (transactions.length > 0) {
      const newMonths = Object.keys(transactionsByMonth).sort((a, b) => b.localeCompare(a))
      if (newMonths.length > 0 && !activeTab) {
        const latestMonth = newMonths[0]
        setActiveTab(latestMonth)
        onMonthChange?.(latestMonth)
      }
    }
  }, [transactions.length])

  useEffect(() => {
    if (transactions.length > 0 && !activeTab) {
      const currentMonth = getCurrentMonth()
      setActiveTab(currentMonth)
      onMonthChange?.(currentMonth)
    }
  }, [transactions, activeTab, onMonthChange])

  useEffect(() => {
    if (activeTab) {
      onMonthChange?.(activeTab)
    }
  }, [activeTab, onMonthChange])

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transactions')
      const data = await res.json()
      setTransactions(data.transactions || [])
    } catch (error) {
      console.error('Erro ao carregar transações:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id: string, description: string) => {
    setDeleteConfirm({ isOpen: true, transactionId: id, description })
  }

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/transactions/${deleteConfirm.transactionId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Transação excluída com sucesso!')
        fetchTransactions()
        setDeleteConfirm({ isOpen: false, transactionId: '', description: '' })
      } else {
        toast.error('Erro ao excluir transação')
      }
    } catch (error) {
      toast.error('Erro ao excluir transação')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, transactionId: '', description: '' })
  }

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedTransactions)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedTransactions(newSelected)
  }

  const getPaymentMethodIcon = (method?: PaymentMethod) => {
    switch (method) {
      case 'CREDIT': return <CreditCard className="h-3 w-3" />
      case 'DEBIT': return <CreditCard className="h-3 w-3" />
      case 'PIX': return <Smartphone className="h-3 w-3" />
      case 'CASH': return <Banknote className="h-3 w-3" />
      case 'TRANSFER': return <ArrowLeftRight className="h-3 w-3" />
      default: return <DollarSign className="h-3 w-3" />
    }
  }

  const getPaymentMethodLabel = (method?: PaymentMethod) => {
    switch (method) {
      case 'CREDIT': return 'Crédito'
      case 'DEBIT': return 'Débito'
      case 'PIX': return 'PIX'
      case 'CASH': return 'Dinheiro'
      case 'TRANSFER': return 'Transferência'
      default: return 'N/A'
    }
  }

  // Agrupar transações por mês usando utilitário corrigido
  const transactionsByMonth = transactions.reduce((acc, transaction) => {
    const month = formatDateToMonth(transaction.date)
    if (!acc[month]) acc[month] = []
    acc[month].push(transaction)
    return acc
  }, {} as Record<string, Transaction[]>)

  // Agrupar transações por categoria
  const transactionsByCategory = transactions.reduce((acc, transaction) => {
    const category = transaction.category.name
    if (!acc[category]) acc[category] = []
    acc[category].push(transaction)
    return acc
  }, {} as Record<string, Transaction[]>)

  // Recalcular sempre que transactions mudar
  const months = Object.keys(transactionsByMonth).sort((a, b) => b.localeCompare(a))
  const categories = Object.keys(transactionsByCategory).sort()

  const selectedTotal = Array.from(selectedTransactions)
    .map(id => transactions.find(t => t.id === id))
    .filter(Boolean)
    .reduce((sum, t) => sum + Number(t!.amount), 0)

  if (loading) {
    return (
      <div className="card p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-muted rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      {/* Header with controls */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Transações</h3>
          <div className="flex items-center gap-2">
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as 'month' | 'category')}
              className="px-3 py-1 border border-input rounded-md text-sm bg-background"
            >
              <option value="month">Por Mês</option>
              <option value="category">Por Categoria</option>
            </select>
          </div>
        </div>

        {/* Selected transactions summary */}
        {selectedTransactions.size > 0 && (
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm font-medium">
              {selectedTransactions.size} transações selecionadas
            </p>
            <p className="text-lg font-bold text-primary">
              Total: {formatCurrency(selectedTotal)}
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-1 mt-4">
          {(groupBy === 'month' ? months : categories).map(key => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key)
                onMonthChange?.(key)
              }}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                activeTab === key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {groupBy === 'month' 
                ? (() => {
                    const [year, month] = key.split('-')
                    const date = new Date(parseInt(year), parseInt(month) - 1, 1)
                    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
                  })()
                : key
              }
            </button>
          ))}
        </div>
      </div>

      {/* Transaction list */}
      <div className="divide-y max-h-96 overflow-y-auto">
        {activeTab && (groupBy === 'month' ? transactionsByMonth[activeTab] : transactionsByCategory[activeTab])?.map(transaction => (
          <div key={transaction.id} className="p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              {/* Selection checkbox */}
              <button
                onClick={() => toggleSelection(transaction.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                {selectedTransactions.has(transaction.id) ? (
                  <CheckSquare className="h-4 w-4 text-primary" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
              </button>

              {/* Transaction info */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{transaction.category.name}</span>
                      {transaction.type === TransactionType.EXPENSE && transaction.paymentMethod && (
                        <span className="flex items-center gap-1">
                          {getPaymentMethodIcon(transaction.paymentMethod)}
                          {getPaymentMethodLabel(transaction.paymentMethod)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold ${
                      transaction.type === TransactionType.INCOME ? 'text-success' : 'text-destructive'
                    }`}>
                      {transaction.type === TransactionType.INCOME ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(transaction)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(transaction.id, transaction.description)}
                        className="p-1 text-muted-foreground hover:text-destructive"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeTab && !(groupBy === 'month' ? transactionsByMonth[activeTab] : transactionsByCategory[activeTab])?.length && (
        <div className="p-8 text-center text-muted-foreground">
          Nenhuma transação encontrada para este período
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Excluir Transação"
        message={`Tem certeza que deseja excluir "${deleteConfirm.description}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
        loading={deleteLoading}
      />
    </div>
  )
}