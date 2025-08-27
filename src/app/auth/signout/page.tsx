'use client'

import { useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { LogOut, Loader2 } from 'lucide-react'

export default function SignOutPage() {
  useEffect(() => {
    const handleSignOut = async () => {
      await signOut({ 
        redirect: true,
        callbackUrl: '/' 
      })
    }

    // Delay para mostrar a interface antes de fazer logout
    const timer = setTimeout(handleSignOut, 1500)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center">
      <div className="card p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <LogOut className="h-8 w-8 text-destructive" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Saindo da plataforma</h1>
        
        <p className="text-muted-foreground mb-6">
          Aguarde enquanto finalizamos sua sessão com segurança...
        </p>
        
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Processando logout
        </div>
        
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Obrigado por usar o FinanceCouple! 
            <br />
            Volte sempre que precisar gerenciar suas finanças.
          </p>
        </div>
      </div>
    </div>
  )
}