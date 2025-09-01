'use client'

import { useState, useEffect } from 'react'
import { TransactionType, PaymentMethod } from '@prisma/client'
import { toast } from 'react-toastify'
import { X, Save, Calendar, DollarSign, FileText, Tag, CreditCard, Loader2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  type: TransactionType
}

interface Transaction {
  id: string
  description: string
  amount: number
  type: TransactionType
  paymentMethod?: PaymentMethod
  date: string
  category: {
    name: string
    icon: string
  }
  categoryId?: string
}

interface EditTransactionModalProps {
  transaction: Transaction | null
  onClose: () => void
  onSuccess: () => void
}

export default function EditTransactionModal({ transaction, onClose, onSuccess }: EditTransactionModalProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: TransactionType.EXPENSE as TransactionType,
    paymentMethod: PaymentMethod.PIX as PaymentMethod,
    categoryId: '',
    date: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: transaction.amount.toString(),
        type: transaction.type,
        paymentMethod: transaction.paymentMethod || PaymentMethod.PIX,
        categoryId: transaction.categoryId || '',
        date: transaction.date.split('T')[0]
      })
      fetchCategories()
    }
  }, [transaction])

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
    if (!transaction) return

    setLoading(true)

    try {
      const res = await fetch(`/api/transactions/${transaction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success('Transação atualizada com sucesso!')
        onSuccess()
        onClose()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Erro ao atualizar transação')
      }
    } catch (error) {
      toast.error('Erro ao atualizar transação')
    } finally {
      setLoading(false)
    }
  }

  if (!transaction) return null

  const filteredCategories = categories.filter(cat => cat.type === formData.type)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="font-semibold">Editar Transação</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Descrição
            </label>
            <input
              type="text"
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

          {/* Payment Method - Only for expenses */}
          {formData.type === TransactionType.EXPENSE && (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <CreditCard className="h-4 w-4" />
                Meio de Pagamento
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              >
                <option value={PaymentMethod.PIX}>PIX</option>
                <option value={PaymentMethod.DEBIT}>Cartão de Débito</option>
                <option value={PaymentMethod.CREDIT}>Cartão de Crédito</option>
                <option value={PaymentMethod.CASH}>Dinheiro</option>
                <option value={PaymentMethod.TRANSFER}>Transferência</option>
              </select>
            </div>
          )}

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

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-secondary py-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn btn-primary py-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}