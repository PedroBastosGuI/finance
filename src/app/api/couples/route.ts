import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { TransactionType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { name } = await request.json()
    if (!name) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }

    const couple = await prisma.couple.create({
      data: { name }
    })

    await prisma.coupleUser.create({
      data: {
        userId: user.id,
        coupleId: couple.id,
        role: 'admin'
      }
    })

    // Criar categorias padrão
    const defaultCategories = [
      { name: 'Salário', icon: '💼', type: TransactionType.INCOME },
      { name: 'Freelance', icon: '💻', type: TransactionType.INCOME },
      { name: 'Investimentos', icon: '📈', type: TransactionType.INCOME },
      { name: 'Moradia', icon: '🏠', type: TransactionType.EXPENSE },
      { name: 'Alimentação', icon: '🍽️', type: TransactionType.EXPENSE },
      { name: 'Transporte', icon: '🚗', type: TransactionType.EXPENSE },
      { name: 'Saúde', icon: '🏥', type: TransactionType.EXPENSE },
      { name: 'Lazer', icon: '🎬', type: TransactionType.EXPENSE },
    ]

    await prisma.category.createMany({
      data: defaultCategories.map(cat => ({
        ...cat,
        coupleId: couple.id
      }))
    })

    return NextResponse.json({ couple })
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}