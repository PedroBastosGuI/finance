import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, getUserCouple } from '@/lib/utils'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

    const transactions = await prisma.transaction.findMany({
      where: { coupleId: couple.id },
      include: {
        category: true,
        user: { select: { name: true } }
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json({ transactions })
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const couple = await getUserCouple(user.id)
    if (!couple) {
      return NextResponse.json({ error: 'Casal não encontrado' }, { status: 404 })
    }

    const { description, amount, type, categoryId, date, paymentMethod } = await request.json()

    if (!description || !amount || !type || !categoryId || !date) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 })
    }

    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount: parseFloat(amount),
        type,
        paymentMethod: paymentMethod || 'PIX',
        categoryId,
        date: new Date(date),
        userId: user.id,
        coupleId: couple.id
      },
      include: {
        category: true,
        user: { select: { name: true } }
      }
    })

    return NextResponse.json({ transaction })
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}