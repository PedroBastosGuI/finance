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

    // Últimos 6 meses
    const months = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      months.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        name: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
      })
    }

    const monthlyData = await Promise.all(
      months.map(async ({ year, month, name }) => {
        const startDate = new Date(year, month - 1, 1)
        const endDate = new Date(year, month, 0)

        const transactions = await prisma.transaction.findMany({
          where: {
            coupleId: couple.id,
            date: { gte: startDate, lte: endDate }
          }
        })

        const income = transactions
          .filter(t => t.type === TransactionType.INCOME)
          .reduce((sum, t) => sum + Number(t.amount), 0)

        const expense = transactions
          .filter(t => t.type === TransactionType.EXPENSE)
          .reduce((sum, t) => sum + Number(t.amount), 0)

        return { month: name, income, expense, balance: income - expense }
      })
    )

    // Dados por categoria (mês atual)
    const currentMonth = new Date()
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

    const categoryData = await prisma.transaction.findMany({
      where: {
        coupleId: couple.id,
        date: { gte: startOfMonth, lte: endOfMonth }
      },
      include: { category: true }
    })

    const categoryStats = categoryData.reduce((acc, transaction) => {
      const key = transaction.category.name
      if (!acc[key]) {
        acc[key] = {
          name: transaction.category.name,
          icon: transaction.category.icon,
          color: transaction.category.color,
          income: 0,
          expense: 0
        }
      }
      
      if (transaction.type === TransactionType.INCOME) {
        acc[key].income += Number(transaction.amount)
      } else {
        acc[key].expense += Number(transaction.amount)
      }
      
      return acc
    }, {} as Record<string, any>)

    return NextResponse.json({
      monthlyData,
      categoryData: Object.values(categoryStats)
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}