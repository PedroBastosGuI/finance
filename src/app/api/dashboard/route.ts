import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, getUserCouple } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { TransactionType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const couple = await getUserCouple(user.id)
    if (!couple) {
      return NextResponse.json({ error: 'Casal não encontrado' }, { status: 404 })
    }

    const currentMonth = new Date()
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

    const transactions = await prisma.transaction.findMany({
      where: {
        coupleId: couple.id,
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    })

    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const expense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const balance = income - expense

    return NextResponse.json({
      income,
      expense,
      balance,
      transactionCount: transactions.length
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}