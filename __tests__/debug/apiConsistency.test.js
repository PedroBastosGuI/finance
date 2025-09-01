// Teste de consistência entre frontend e API

describe('API Consistency Test', () => {
  // Simulando nova lógica da API
  function apiFilterTransactions(transactions, targetMonth) {
    return transactions.filter(transaction => {
      const transactionMonth = transaction.date.split('T')[0].slice(0, 7)
      return transactionMonth === targetMonth
    })
  }

  // Lógica do frontend
  function frontendGroupTransactions(transactions) {
    return transactions.reduce((acc, transaction) => {
      const datePart = transaction.date.split('T')[0]
      const [year, month] = datePart.split('-')
      const monthKey = `${year}-${month}`
      if (!acc[monthKey]) acc[monthKey] = []
      acc[monthKey].push(transaction)
      return acc
    }, {})
  }

  test('should have consistent filtering between frontend and API', () => {
    const mockTransactions = [
      { id: '1', date: '2024-08-31T21:00:00.000Z', description: 'Late August' },
      { id: '2', date: '2024-09-01T00:00:00.000Z', description: 'Early September' },
      { id: '3', date: '2024-09-15T12:00:00.000Z', description: 'Mid September' },
      { id: '4', date: '2024-09-30T23:59:59.000Z', description: 'Late September' },
      { id: '5', date: '2024-10-01T00:00:00.000Z', description: 'Early October' }
    ]

    // Frontend grouping
    const frontendGrouped = frontendGroupTransactions(mockTransactions)
    const frontendSeptember = frontendGrouped['2024-09'] || []

    // API filtering
    const apiSeptember = apiFilterTransactions(mockTransactions, '2024-09')

    console.log('Frontend September:', frontendSeptember.map(t => t.description))
    console.log('API September:', apiSeptember.map(t => t.description))

    // Devem ser idênticos
    expect(frontendSeptember.length).toBe(apiSeptember.length)
    expect(frontendSeptember.map(t => t.id)).toEqual(apiSeptember.map(t => t.id))

    // Verificar cada mês
    Object.keys(frontendGrouped).forEach(month => {
      const frontendMonth = frontendGrouped[month]
      const apiMonth = apiFilterTransactions(mockTransactions, month)
      
      console.log(`${month}: Frontend=${frontendMonth.length}, API=${apiMonth.length}`)
      expect(frontendMonth.length).toBe(apiMonth.length)
    })
  })

  test('should calculate correct totals', () => {
    const septemberTransactions = [
      { amount: 1000, type: 'INCOME' },
      { amount: 500, type: 'EXPENSE' },
      { amount: 200, type: 'EXPENSE' }
    ]

    const income = septemberTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const expense = septemberTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const balance = income - expense

    console.log('September totals:', { income, expense, balance })

    expect(income).toBe(1000)
    expect(expense).toBe(700)
    expect(balance).toBe(300)
  })
})