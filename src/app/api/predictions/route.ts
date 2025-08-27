import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, getUserCouple } from '@/lib/utils'
import { generatePredictions, generateRecommendations } from '@/lib/predictions'

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

    const predictions = await generatePredictions(couple.id)
    const recommendations = generateRecommendations(predictions)

    return NextResponse.json({
      predictions,
      recommendations,
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erro ao gerar previsões:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}