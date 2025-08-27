'use client'

import { formatCurrency } from '@/lib/utils'

interface CategoryData {
  name: string
  icon: string
  income: number
  expense: number
}

interface ReportsTableProps {
  data: CategoryData[]
}

export default function ReportsTable({ data }: ReportsTableProps) {
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0)
  const totalExpense = data.reduce((sum, item) => sum + item.expense, 0)

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">Relatório por Categoria</h3>
        <p className="text-sm text-gray-500">Dados do mês atual</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Categoria
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Receitas
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Despesas
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Saldo
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => {
              const balance = item.income - item.expense
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-green-600 font-medium">
                    {item.income > 0 ? formatCurrency(item.income) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-red-600 font-medium">
                    {item.expense > 0 ? formatCurrency(item.expense) : '-'}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right font-medium ${
                    balance >= 0 ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(balance)}
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-6 py-4 font-semibold">Total</td>
              <td className="px-6 py-4 text-right font-semibold text-green-600">
                {formatCurrency(totalIncome)}
              </td>
              <td className="px-6 py-4 text-right font-semibold text-red-600">
                {formatCurrency(totalExpense)}
              </td>
              <td className={`px-6 py-4 text-right font-semibold ${
                (totalIncome - totalExpense) >= 0 ? 'text-blue-600' : 'text-red-600'
              }`}>
                {formatCurrency(totalIncome - totalExpense)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}