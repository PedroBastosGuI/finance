'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (res.ok) {
        setSent(true)
        toast.success('Email enviado com sucesso!')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Erro ao enviar email')
      }
    } catch (error) {
      toast.error('Erro ao enviar email')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Email Enviado!</h1>
            <p className="text-muted-foreground mb-6">
              Se o email <strong>{email}</strong> estiver cadastrado, você receberá instruções para redefinir sua senha.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Verifique sua caixa de entrada e spam.
            </p>
            <a href="/auth/login" className="btn btn-primary w-full py-2">
              Voltar ao Login
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Esqueceu sua senha?</h1>
            <p className="text-muted-foreground">
              Digite seu email e enviaremos instruções para redefinir sua senha
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                placeholder="seu@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-2.5 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Enviar Instruções
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a 
              href="/auth/login" 
              className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}