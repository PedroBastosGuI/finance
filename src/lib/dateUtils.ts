// Utilitários de data corrigidos para evitar problemas de timezone

export function formatDateToMonth(dateInput: string | Date): string {
  if (typeof dateInput === 'string') {
    // Extrair diretamente da string sem conversão de Date
    if (dateInput.includes('T')) {
      // ISO string: '2024-09-09T10:00:00.000Z' -> '2024-09'
      const datePart = dateInput.split('T')[0] // '2024-09-09'
      const [year, month] = datePart.split('-') // ['2024', '09']
      return `${year}-${month}` // '2024-09'
    } else {
      // Formato YYYY-MM-DD: '2024-09-09' -> '2024-09'
      const [year, month] = dateInput.split('-') // ['2024', '09']
      return `${year}-${month}` // '2024-09'
    }
  } else {
    // Date object
    const year = dateInput.getFullYear()
    const month = dateInput.getMonth() + 1
    return `${year}-${String(month).padStart(2, '0')}`
  }
}

export function parseMonthToDateRange(monthStr: string) {
  const [year, month] = monthStr.split('-').map(Number)
  
  // Criar datas no timezone local
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0, 23, 59, 59, 999)
  
  return { startDate, endDate }
}

export function formatDateForDisplay(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  return date.toLocaleDateString('pt-BR')
}

export function getCurrentMonth(): string {
  const now = new Date()
  return formatDateToMonth(now)
}