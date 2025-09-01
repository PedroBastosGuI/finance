// Teste dos cálculos financeiros

describe('Financial Calculations - Bug Detection', () => {
  test('should calculate monthly totals correctly', () => {
    const mockTransactions = [
      { id: '1', amount: 1000, type: 'INCOME', date: '2024-10-15T10:00:00.000Z' },
      { id: '2', amount: 500, type: 'EXPENSE', date: '2024-10-16T10:00:00.000Z' },
      { id: '3', amount: 200, type: 'EXPENSE', date: '2024-10-17T10:00:00.000Z' },
      { id: '4', amount: 2000, type: 'INCOME', date: '2024-12-01T10:00:00.000Z' }
    ]

    // Agrupar por mês
    const transactionsByMonth = mockTransactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date)
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (!acc[month]) acc[month] = []
      acc[month].push(transaction)
      return acc
    }, {})

    console.log('Transactions by month:', transactionsByMonth)

    // Calcular totais para outubro
    const octoberTransactions = transactionsByMonth['2024-10'] || []
    const octoberIncome = octoberTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0)
    const octoberExpense = octoberTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0)
    const octoberBalance = octoberIncome - octoberExpense

    console.log('October calculations:', { octoberIncome, octoberExpense, octoberBalance })

    expect(octoberIncome).toBe(1000)
    expect(octoberExpense).toBe(700)
    expect(octoberBalance).toBe(300)

    // Calcular totais para dezembro
    const decemberTransactions = transactionsByMonth['2024-12'] || []
    const decemberIncome = decemberTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    expect(decemberIncome).toBe(2000)
  })

  test('should handle Decimal type correctly', () => {
    // Simulando dados do Prisma com Decimal
    const mockPrismaTransaction = {
      amount: { toString: () => '1500.50' }, // Prisma Decimal
      type: 'INCOME'
    }

    const amount = Number(mockPrismaTransaction.amount.toString())
    console.log('Decimal conversion:', amount)
    
    expect(amount).toBe(1500.50)
  })

  test('should detect empty month arrays', () => {
    const transactionsByMonth = {
      '2024-10': [],
      '2024-11': [{ amount: 100, type: 'INCOME' }]
    }

    const octoberTransactions = transactionsByMonth['2024-10'] || []
    const novemberTransactions = transactionsByMonth['2024-11'] || []

    console.log('October transactions:', octoberTransactions.length)
    console.log('November transactions:', novemberTransactions.length)

    expect(octoberTransactions.length).toBe(0)
    expect(novemberTransactions.length).toBe(1)
  })
})