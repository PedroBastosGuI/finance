// Debug do bug de mês

describe('Month Bug Debug', () => {
  test('should debug month conversion', () => {
    // Simulando data de setembro
    const septemberDate = '2024-09-09T10:00:00.000Z'
    
    // Método atual (BUGADO)
    const buggedMethod = (dateStr) => {
      const datePart = dateStr.split('T')[0] // '2024-09-09'
      const [year, month] = datePart.split('-').map(Number) // [2024, 9]
      return `${year}-${String(month).padStart(2, '0')}` // '2024-09'
    }
    
    // Método correto
    const fixedMethod = (dateStr) => {
      const datePart = dateStr.split('T')[0] // '2024-09-09'
      const [year, month] = datePart.split('-') // ['2024', '09']
      return `${year}-${month}` // '2024-09'
    }
    
    console.log('September date:', septemberDate)
    console.log('Bugged result:', buggedMethod(septemberDate))
    console.log('Fixed result:', fixedMethod(septemberDate))
    
    // O bug: Number('09') = 9, mas queremos '09'
    expect(buggedMethod(septemberDate)).toBe('2024-09')
    expect(fixedMethod(septemberDate)).toBe('2024-09')
  })

  test('should debug tab display', () => {
    const months = ['2024-08', '2024-09', '2024-10']
    
    months.forEach(month => {
      const displayName = new Date(month + '-01').toLocaleDateString('pt-BR', { 
        month: 'long', 
        year: 'numeric' 
      })
      console.log(`Month: ${month} -> Display: ${displayName}`)
    })
  })
})