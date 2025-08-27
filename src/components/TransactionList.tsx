'use client'

import { useState, useEffect } from 'react'
import { TransactionType } from '@prisma/client'
import { formatCurrency } from '@/lib/utils'
import { History, TrendingUp, TrendingDown, User, Calendar } from 'lucide-react'

interface Transaction {
  id: string
  description: string
  amount: number
  type: TransactionType
  date: string
  category: {
    name: string
    icon: string
  }
  user: {
    name: string
  }
}

interface TransactionListProps {
  refresh: boolean
}

export default function TransactionList({ refresh }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [refresh])

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

  if (transactions.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="w-12 h-12 bg-muted/50 rounded-lg flex items-center justify-center mx-auto mb-4">
          <History className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground mb-2">Nenhuma transação encontrada</p>
        <p className="text-sm text-muted-foreground">Adicione sua primeira transação para começar</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Transações Recentes</h3>
          <span className="text-sm text-muted-foreground ml-auto">
            {transactions.length} {transactions.length === 1 ? 'item' : 'itens'}
          </span>
        </div>
      </div>
      
      <div className="divide-y">
        {transactions.map(transaction => (
          <div key={transaction.id} className="p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  transaction.type === TransactionType.INCOME 
                    ? 'bg-success/10' 
                    : 'bg-destructive/10'
                }`}>
                  {transaction.type === TransactionType.INCOME ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{transaction.category.name}</span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {transaction.user.name}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === TransactionType.INCOME 
                    ? 'text-success' 
                    : 'text-destructive'
                }`}>
                  {transaction.type === TransactionType.INCOME ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                  <Calendar className="h-3 w-3" />
                  {new Date(transaction.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}