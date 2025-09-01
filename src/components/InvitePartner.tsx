'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'
import { Mail, Send, Copy, Check, UserPlus } from 'lucide-react'

interface InvitePartnerProps {
  onSuccess?: () => void
}

export default function InvitePartner({ onSuccess }: InvitePartnerProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [inviteLink, setInviteLink] = useState('')
  const [copied, setCopied] = useState(false)

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (res.ok) {
        setInviteLink(data.inviteLink)
        setEmail('')
        onSuccess?.()
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error('Erro ao enviar convite')
    } finally {
      setLoading(false)
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Erro ao copiar link')
    }
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Convidar Parceiro(a)</h3>
      </div>

      {!inviteLink ? (
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <Mail className="h-4 w-4" />
              Email do seu parceiro(a)
            </label>
            <input
              type="email"
              placeholder="parceiro@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Criar Convite
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
            <p className="text-success font-medium mb-2">✅ Convite criado!</p>
            <p className="text-sm text-muted-foreground">
              Compartilhe este link com seu parceiro(a):
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inviteLink}
              readOnly
              className="flex-1 px-3 py-2 border border-input rounded-md bg-muted text-sm"
            />
            <button
              onClick={copyLink}
              className="btn btn-secondary px-3 py-2 flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copiar
                </>
              )}
            </button>
          </div>

          <button
            onClick={() => {
              setInviteLink('')
              setCopied(false)
            }}
            className="w-full btn btn-secondary py-2"
          >
            Criar Novo Convite
          </button>
        </div>
      )}

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Como funciona:</strong> Seu parceiro(a) receberá um link para criar a conta 
          e será automaticamente adicionado(a) ao casal, tendo acesso às mesmas informações financeiras.
        </p>
      </div>
    </div>
  )
}