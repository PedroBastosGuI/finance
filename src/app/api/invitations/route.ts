import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, getUserCouple } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

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

    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }

    // Verificar se já existe usuário com este email
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      // Verificar se já faz parte do casal
      const existingMember = await prisma.coupleUser.findFirst({
        where: {
          userId: existingUser.id,
          coupleId: couple.id
        }
      })

      if (existingMember) {
        return NextResponse.json({ error: 'Esta pessoa já faz parte do casal' }, { status: 400 })
      }
    }

    // Verificar se já existe convite pendente
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email,
        coupleId: couple.id,
        status: 'PENDING'
      }
    })

    if (existingInvitation) {
      return NextResponse.json({ error: 'Convite já enviado para este email' }, { status: 400 })
    }

    // Criar convite
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // Expira em 7 dias

    const invitation = await prisma.invitation.create({
      data: {
        email,
        token,
        coupleId: couple.id,
        invitedBy: user.id,
        expiresAt
      }
    })

    return NextResponse.json({
      message: 'Convite criado com sucesso',
      inviteLink: `${process.env.NEXTAUTH_URL}/invite/${token}`,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        expiresAt: invitation.expiresAt
      }
    })
  } catch (error) {
    console.error('Erro ao criar convite:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno' },
      { status: 500 }
    )
  }
}

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

    const invitations = await prisma.invitation.findMany({
      where: { coupleId: couple.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ invitations })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno' },
      { status: 500 }
    )
  }
}