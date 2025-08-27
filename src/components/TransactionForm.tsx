'use client'

import { useState, useEffect } from 'react'
import { TransactionType } from '@prisma/client'
import { Plus, TrendingUp, TrendingDown, Calendar, DollarSign, FileText, Tag, Loader2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  icon: string
  type: TransactionType
}

interface TransactionFormProps {
  onSuccess: () => void
}

export default function TransactionForm({ onSuccess }: TransactionFormProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: TransactionType.EXPENSE,
    categoryId: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setFormData({
          description: '',
          amount: '',
          type: TransactionType.EXPENSE,
          categoryId: '',
          date: new Date().toISOString().split('T')[0]
        })
        onSuccess()
      }
    } catch (error) {
      console.error('Erro ao salvar transação:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter(cat => cat.type === formData.type)

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Plus className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Nova Transação</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Selection */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: TransactionType.INCOME, categoryId: '' })}
            className={`p-3 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
              formData.type === TransactionType.INCOME
                ? 'border-success bg-success/10 text-success'
                : 'border-border hover:border-success/50'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            Receita
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: TransactionType.EXPENSE, categoryId: '' })}
            className={`p-3 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
              formData.type === TransactionType.EXPENSE
                ? 'border-destructive bg-destructive/10 text-destructive'
                : 'border-border hover:border-destructive/50'
            }`}
          >
            <TrendingDown className="h-4 w-4" />
            Despesa
          </button>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Descrição
          </label>
          <input
            type="text"
            placeholder="Ex: Compra no supermercado"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            required
          />
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            Valor
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="0,00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1">
            <Tag className="h-4 w-4" />
            Categoria
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            required
          >
            <option value="">Selecione uma categoria</option>
            {filteredCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Data
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn btn-primary py-2.5 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Adicionar Transação
            </>
          )}
        </button>
      </form>
    </div>
  )
}