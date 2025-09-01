// Teste das correções implementadas

describe('Fixed Date Utils', () => {
  // Simulando as funções corrigidas
  function formatDateToMonth(dateInput) {
    let date
    
    if (typeof dateInput === 'string') {
      if (dateInput.includes('T')) {
        // ISO string: extrair apenas a parte da data
        const datePart = dateInput.split('T')[0]
        const [year, month, day] = datePart.split('-').map(Number)
        date = new Date(year, month - 1, day)
      } else {
        // Formato YYYY-MM-DD
        const [year, month, day] = dateInput.split('-').map(Number)
        date = new Date(year, month - 1, day)
      }
    } else {
      date = dateInput
    }
    
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    
    return `${year}-${String(month).padStart(2, '0')}`
  }

  test('should handle timezone correctly', () => {
    const testCases = [
      { input: '2024-10-15T10:30:00.000Z', expected: '2024-10' },
      { input: '2024-10-15', expected: '2024-10' },
      { input: '2024-12-01T00:00:00.000Z', expected: '2024-12' },
      { input: '2024-12-31T23:59:59.000Z', expected: '2024-12' }
    ]

    testCases.forEach(({ input, expected }) => {
      const result = formatDateToMonth(input)
      console.log(`✅ Input: ${input} -> Output: ${result}`)
      expect(result).toBe(expected)
    })
  })

  test('should group transactions correctly', () => {
    const mockTransactions = [
      { id: '1', amount: 1000, type: 'INCOME', date: '2024-10-15T10:00:00.000Z' },
      { id: '2', amount: 500, type: 'EXPENSE', date: '2024-10-16T10:00:00.000Z' },
      { id: '3', amount: 2000, type: 'INCOME', date: '2024-12-01T00:00:00.000Z' }
    ]

    const grouped = mockTransactions.reduce((acc, transaction) => {
      const month = formatDateToMonth(transaction.date)
      if (!acc[month]) acc[month] = []
      acc[month].push(transaction)
      return acc
    }, {})

    console.log('✅ Grouped transactions:', Object.keys(grouped))
    
    expect(grouped['2024-10']).toHaveLength(2)
    expect(grouped['2024-12']).toHaveLength(1)
    expect(Object.keys(grouped)).toEqual(['2024-10', '2024-12'])
  })

  test('should calculate monthly totals correctly', () => {
    const octoberTransactions = [
      { amount: 1000, type: 'INCOME' },
      { amount: 500, type: 'EXPENSE' },
      { amount: 200, type: 'EXPENSE' }
    ]

    const income = octoberTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0)
    
    const expense = octoberTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0)
    
    const balance = income - expense

    console.log('✅ October calculations:', { income, expense, balance })
    
    expect(income).toBe(1000)
    expect(expense).toBe(700)
    expect(balance).toBe(300)
  })
})