import { TransactionType } from '@prisma/client'

export interface Transaction {
  id: string
  description: string
  amount: number
  type: TransactionType
  date: Date
  categoryId: string
  category: {
    name: string
    color: string
    icon: string
  }
  user: {
    name: string
  }
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string
  type: TransactionType
}

export interface MonthlyBalance {
  month: string
  income: number
  expense: number
  balance: number
}

export interface Prediction {
  month: string
  predictedIncome: number
  predictedExpense: number
  predictedBalance: number
}