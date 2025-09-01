import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token e senha são obrigatórios' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Senha deve ter pelo menos 6 caracteres' }, { status: 400 })
    }

    // Buscar token válido
    const resetToken = await prisma.passwordReset.findUnique({
      where: { token }
    })

    if (!resetToken || resetToken.used) {
      return NextResponse.json({ error: 'Token inválido ou já utilizado' }, { status: 400 })
    }

    if (new Date() > resetToken.expiresAt) {
      return NextResponse.json({ error: 'Token expirado' }, { status: 400 })
    }

    // Atualizar senha do usuário
    const hashedPassword = await bcrypt.hash(password, 12)
    
    await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword }
    })

    // Marcar token como usado
    await prisma.passwordReset.update({
      where: { id: resetToken.id },
      data: { used: true }
    })

    return NextResponse.json({ message: 'Senha redefinida com sucesso' })
  } catch (error) {
    console.error('Erro ao redefinir senha:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}