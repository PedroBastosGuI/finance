import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }

    // Verificar se usuário existe
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Sempre retorna sucesso (segurança - não revelar se email existe)
    if (!user) {
      return NextResponse.json({ 
        message: 'Se o email existir, você receberá instruções para redefinir sua senha' 
      })
    }

    // Invalidar tokens anteriores
    await prisma.passwordReset.updateMany({
      where: { email, used: false },
      data: { used: true }
    })

    // Criar novo token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // Expira em 1 hora

    await prisma.passwordReset.create({
      data: {
        email,
        token,
        expiresAt
      }
    })

    // Enviar email
    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`
    await sendPasswordResetEmail(email, resetLink)

    return NextResponse.json({ 
      message: 'Se o email existir, você receberá instruções para redefinir sua senha' 
    })
  } catch (error) {
    console.error('Erro ao solicitar reset de senha:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}