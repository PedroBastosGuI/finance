import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, getUserCouple } from '@/lib/utils'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { description, amount, type, categoryId, date, paymentMethod } = await request.json()

    const transaction = await prisma.transaction.update({
      where: {
        id: params.id,
        coupleId: couple.id
      },
      data: {
        description,
        amount: parseFloat(amount),
        type,
        paymentMethod: paymentMethod || 'PIX',
        categoryId,
        date: new Date(date)
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    await prisma.transaction.delete({
      where: {
        id: params.id,
        coupleId: couple.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}