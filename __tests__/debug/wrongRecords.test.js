// Debug de registros aparecendo no lugar errado

describe('Wrong Records Debug', () => {
  // Função atual
  function formatDateToMonth(dateInput) {
    if (typeof dateInput === 'string') {
      if (dateInput.includes('T')) {
        const datePart = dateInput.split('T')[0]
        const [year, month] = datePart.split('-')
        return `${year}-${month}`
      } else {
        const [year, month] = dateInput.split('-')
        return `${year}-${month}`
      }
    }
    return dateInput
  }

  test('should debug specific problematic dates', () => {
    // Datas que podem estar causando problema
    const problematicDates = [
      '2024-09-01T00:00:00.000Z',
      '2024-09-01T03:00:00.000Z', // Timezone -3
      '2024-09-30T21:00:00.000Z', // Final do dia
      '2024-08-31T21:00:00.000Z', // Pode virar setembro
      '2024-10-01T03:00:00.000Z', // Pode virar setembro
      '2024-09-15',               // Sem timezone
      '2024-09-15T12:30:45.123Z'  // Meio do dia
    ]

    console.log('=== DEBUGGING PROBLEMATIC DATES ===')
    problematicDates.forEach(date => {
      const month = formatDateToMonth(date)
      const jsDate = new Date(date)
      const localMonth = `${jsDate.getFullYear()}-${String(jsDate.getMonth() + 1).padStart(2, '0')}`
      
      console.log(`Input: ${date}`)
      console.log(`  -> formatDateToMonth: ${month}`)
      console.log(`  -> JS Date local: ${localMonth}`)
      console.log(`  -> JS Date: ${jsDate.toString()}`)
      console.log('---')
    })
  })

  test('should test API date range logic', () => {
    // Simulando lógica da API /api/dashboard/[month]
    function getMonthRange(monthStr) {
      const [year, month] = monthStr.split('-').map(Number)
      const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0)
      const endDate = new Date(year, month, 0, 23, 59, 59, 999)
      return { startDate, endDate }
    }

    const { startDate, endDate } = getMonthRange('2024-09')
    
    console.log('=== SEPTEMBER RANGE ===')
    console.log('Start:', startDate.toISOString())
    console.log('End:', endDate.toISOString())
    
    // Testar se datas problemáticas estão no range
    const testDates = [
      '2024-08-31T21:00:00.000Z',
      '2024-09-01T00:00:00.000Z',
      '2024-09-15T12:00:00.000Z',
      '2024-09-30T23:59:59.000Z',
      '2024-10-01T00:00:00.000Z'
    ]

    testDates.forEach(dateStr => {
      const date = new Date(dateStr)
      const inRange = date >= startDate && date <= endDate
      console.log(`${dateStr} in September range: ${inRange}`)
    })
  })

  test('should check transaction grouping vs API filtering', () => {
    // Simulando transações com datas problemáticas
    const mockTransactions = [
      { id: '1', date: '2024-08-31T21:00:00.000Z', description: 'Late August' },
      { id: '2', date: '2024-09-01T00:00:00.000Z', description: 'Early September' },
      { id: '3', date: '2024-09-15T12:00:00.000Z', description: 'Mid September' },
      { id: '4', date: '2024-09-30T23:59:59.000Z', description: 'Late September' },
      { id: '5', date: '2024-10-01T00:00:00.000Z', description: 'Early October' }
    ]

    // Agrupamento no frontend
    const grouped = mockTransactions.reduce((acc, transaction) => {
      const month = formatDateToMonth(transaction.date)
      if (!acc[month]) acc[month] = []
      acc[month].push(transaction)
      return acc
    }, {})

    console.log('=== FRONTEND GROUPING ===')
    Object.keys(grouped).forEach(month => {
      console.log(`${month}:`, grouped[month].map(t => t.description))
    })

    // Simulando filtro da API para setembro
    function getMonthRange(monthStr) {
      const [year, month] = monthStr.split('-').map(Number)
      const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0)
      const endDate = new Date(year, month, 0, 23, 59, 59, 999)
      return { startDate, endDate }
    }

    const { startDate, endDate } = getMonthRange('2024-09')
    const apiFiltered = mockTransactions.filter(t => {
      const date = new Date(t.date)
      return date >= startDate && date <= endDate
    })

    console.log('=== API FILTERING FOR SEPTEMBER ===')
    console.log('API filtered:', apiFiltered.map(t => t.description))

    // Verificar se há inconsistência
    const frontendSeptember = grouped['2024-09'] || []
    console.log('Frontend September:', frontendSeptember.map(t => t.description))
    console.log('API September:', apiFiltered.map(t => t.description))
    
    const consistent = frontendSeptember.length === apiFiltered.length
    console.log('Frontend vs API consistent:', consistent)
  })
})