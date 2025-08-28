'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Heart, User, Lock, Mail, Loader2, CheckCircle } from 'lucide-react'

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [formData, setFormData] = useState({
    name: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          name: formData.name,
          password: formData.password
        })
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/auth/login?message=Conta criada! Faça login para acessar.')
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Erro ao aceitar convite')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              Você foi convidado!
            </h1>
            <p className="text-muted-foreground">
              Complete seu cadastro para gerenciar as finanças do casal
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-6 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <User className="h-4 w-4" />
                Seu nome completo
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                placeholder="Seu nome completo"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Lock className="h-4 w-4" />
                Criar senha
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                placeholder="Sua senha"
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
                  Criando conta...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Aceitar Convite
                </>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-1">
              <Heart className="h-4 w-4 text-primary" />
              O que acontece agora?
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Sua conta será criada automaticamente</li>
              <li>• Você terá acesso às finanças do casal</li>
              <li>• Poderá adicionar e visualizar transações</li>
              <li>• Compartilhará relatórios e previsões</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-4">
          <a href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Voltar ao início
          </a>
        </div>
      </div>
    </div>
  )
}