// Teste das funções de data que estão causando problemas

describe('Date Utils - Bug Detection', () => {
  test('should format date correctly for month grouping', () => {
    // Simulando diferentes formatos de data que podem vir da API
    const testDates = [
      '2024-10-15T10:30:00.000Z',
      '2024-10-15',
      '2024-12-01T00:00:00.000Z',
      new Date('2024-10-15').toISOString()
    ]

    testDates.forEach(dateStr => {
      const date = new Date(dateStr)
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      console.log(`Input: ${dateStr} -> Output: ${month}`)
      
      if (dateStr.includes('2024-10')) {
        expect(month).toBe('2024-10')
      }
      if (dateStr.includes('2024-12')) {
        expect(month).toBe('2024-12')
      }
    })
  })

  test('should handle timezone issues', () => {
    // Bug comum: timezone causing wrong month
    const date1 = new Date('2024-10-01T00:00:00.000Z')
    const date2 = new Date('2024-10-01')
    
    console.log('UTC Date:', date1.toISOString())
    console.log('Local Date:', date2.toString())
    
    const month1 = `${date1.getFullYear()}-${String(date1.getMonth() + 1).padStart(2, '0')}`
    const month2 = `${date2.getFullYear()}-${String(date2.getMonth() + 1).padStart(2, '0')}`
    
    console.log('Month from UTC:', month1)
    console.log('Month from Local:', month2)
  })

  test('should sort months correctly', () => {
    const months = ['2024-08', '2024-10', '2024-12', '2024-09']
    const sorted = months.sort((a, b) => b.localeCompare(a))
    
    console.log('Original:', months)
    console.log('Sorted:', sorted)
    
    expect(sorted).toEqual(['2024-12', '2024-10', '2024-09', '2024-08'])
  })
})