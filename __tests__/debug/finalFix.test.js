// Teste da correção final

describe('Final Fix Test', () => {
  // Função corrigida
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

  // Função de exibição corrigida
  function getMonthDisplay(key) {
    const [year, month] = key.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, 1)
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  }

  test('should fix month grouping', () => {
    const testDates = [
      '2024-08-15T10:00:00.000Z',
      '2024-09-09T10:00:00.000Z', 
      '2024-10-20T10:00:00.000Z'
    ]

    testDates.forEach(date => {
      const month = formatDateToMonth(date)
      const display = getMonthDisplay(month)
      console.log(`Date: ${date} -> Month: ${month} -> Display: ${display}`)
    })

    expect(formatDateToMonth('2024-09-09T10:00:00.000Z')).toBe('2024-09')
    expect(getMonthDisplay('2024-09')).toBe('setembro de 2024')
  })

  test('should show all months with transactions', () => {
    const mockTransactions = [
      { date: '2024-08-15T10:00:00.000Z' },
      { date: '2024-09-09T10:00:00.000Z' },
      { date: '2024-10-20T10:00:00.000Z' },
      { date: '2024-11-05T10:00:00.000Z' },
      { date: '2024-12-25T10:00:00.000Z' }
    ]

    const grouped = mockTransactions.reduce((acc, transaction) => {
      const month = formatDateToMonth(transaction.date)
      if (!acc[month]) acc[month] = []
      acc[month].push(transaction)
      return acc
    }, {})

    const months = Object.keys(grouped).sort((a, b) => b.localeCompare(a))
    
    console.log('All months found:', months)
    console.log('Total months:', months.length)

    expect(months.length).toBe(5)
    expect(months).toContain('2024-12')
    expect(months).toContain('2024-09')
  })
})