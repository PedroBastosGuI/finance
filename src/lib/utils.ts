import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { prisma } from './prisma'

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null
  
  return await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      couples: {
        include: {
          couple: true
        }
      }
    }
  })
}

export async function getUserCouple(userId: string) {
  const coupleUser = await prisma.coupleUser.findFirst({
    where: { userId },
    include: { couple: true }
  })
  
  return coupleUser?.couple || null
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}