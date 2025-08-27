'use client'

import { useState } from 'react'
import { Users, Heart, CheckCircle, Loader2 } from 'lucide-react'

interface CoupleSetupProps {
  onSuccess: () => void
}

export default function CoupleSetup({ onSuccess }: CoupleSetupProps) {
  const [coupleName, setCoupleName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/couples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: coupleName })
      })

      if (res.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error('Erro ao criar casal:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              Configure seu Casal
            </h1>
            <p className="text-muted-foreground">
              Vamos criar o perfil financeiro do seu casal para começar
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Nome do Casal
              </label>
              <input
                type="text"
                placeholder="Ex: João & Maria"
                value={coupleName}
                onChange={(e) => setCoupleName(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-2.5 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4" />
                  Criar Casal
                </>
              )}
            </button>
          </form>

          {/* Features */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <p className="font-medium mb-3 text-sm">Será criado automaticamente:</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                Categorias padrão de receitas e despesas
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                Estrutura para controle financeiro
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                Dashboard personalizado
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}