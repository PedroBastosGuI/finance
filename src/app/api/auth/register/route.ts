import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Iniciando registro de usuário...')
    
    const { name, email, password } = await request.json()
    console.log('📝 Dados recebidos:', { name, email, password: '***' })

    if (!name || !email || !password) {
      console.log('❌ Campos obrigatórios faltando')
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    console.log('🔍 Verificando se usuário já existe...')
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('❌ Email já cadastrado:', email)
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    console.log('🔐 Gerando hash da senha...')
    const hashedPassword = await bcrypt.hash(password, 12)

    console.log('💾 Criando usuário no banco...')
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    console.log('✅ Usuário criado com sucesso:', user.id)
    return NextResponse.json({
      message: 'Usuário criado com sucesso',
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (error) {
    console.error('💥 Erro ao registrar usuário:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.stack : undefined : undefined
      },
      { status: 500 }
    )
  }
}