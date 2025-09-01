import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, getUserCouple } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { TransactionType } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { month: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const couple = await getUserCouple(user.id)
    if (!couple) {
      return NextResponse.json({ error: 'Casal não encontrado' }, { status: 404 })
    }

    // Parse month (format: YYYY-MM) - usando UTC para consistência
    const [year, month] = params.month.split('-').map(Number)
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0))
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999))

    // Filtrar transações usando mesmo critério do frontend
    const allTransactions = await prisma.transaction.findMany({
      where: {
        coupleId: couple.id
      },
      include: {
        category: true,
        user: { select: { name: true } }
      }
    })

    // Filtrar usando mesma lógica do frontend
    const transactions = allTransactions.filter(transaction => {
      const transactionMonth = transaction.date.toISOString().split('T')[0].slice(0, 7)
      return transactionMonth === params.month
    })

    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const expense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const balance = income - expense
    const transactionCount = transactions.length

    return NextResponse.json({
      income,
      expense,
      balance,
      transactionCount
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}