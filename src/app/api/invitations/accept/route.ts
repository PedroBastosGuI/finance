import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token, name, password } = await request.json()

    if (!token || !name || !password) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 })
    }

    // Buscar convite
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: { couple: true }
    })

    if (!invitation) {
      return NextResponse.json({ error: 'Convite inválido' }, { status: 400 })
    }

    if (invitation.status !== 'PENDING') {
      return NextResponse.json({ error: 'Convite já foi usado ou expirou' }, { status: 400 })
    }

    if (new Date() > invitation.expiresAt) {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: 'EXPIRED' }
      })
      return NextResponse.json({ error: 'Convite expirado' }, { status: 400 })
    }

    // Verificar se já existe usuário com este email
    let user = await prisma.user.findUnique({
      where: { email: invitation.email }
    })

    if (user) {
      // Usuário já existe, apenas adicionar ao casal
      await prisma.coupleUser.create({
        data: {
          userId: user.id,
          coupleId: invitation.coupleId,
          role: 'member'
        }
      })
    } else {
      // Criar novo usuário
      const hashedPassword = await bcrypt.hash(password, 12)
      
      user = await prisma.user.create({
        data: {
          name,
          email: invitation.email,
          password: hashedPassword
        }
      })

      // Adicionar ao casal
      await prisma.coupleUser.create({
        data: {
          userId: user.id,
          coupleId: invitation.coupleId,
          role: 'member'
        }
      })
    }

    // Marcar convite como aceito
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: 'ACCEPTED' }
    })

    return NextResponse.json({
      message: 'Convite aceito com sucesso',
      user: { id: user.id, name: user.name, email: user.email },
      couple: invitation.couple
    })
  } catch (error) {
    console.error('Erro ao aceitar convite:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno' },
      { status: 500 }
    )
  }
}