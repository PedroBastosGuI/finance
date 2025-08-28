// Arquivo para testar conexão com banco de dados
import { prisma } from './prisma'

export async function testDatabaseConnection() {
  try {
    console.log('🔍 Testando conexão com banco de dados...')
    
    // Teste simples de conexão
    await prisma.$connect()
    console.log('✅ Conexão com banco estabelecida')
    
    // Teste de query simples
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Query de teste executada:', result)
    
    return { success: true, message: 'Conexão OK' }
  } catch (error) {
    console.error('💥 Erro na conexão com banco:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  } finally {
    await prisma.$disconnect()
  }
}