import { TrendingUp, PieChart, Calculator, BarChart3, Shield, Users } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">FinanceCouple</span>
            </div>
            <a 
              href="/auth/login"
              className="btn btn-primary px-6 py-2"
            >
              Entrar
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">
            Controle Financeiro
            <span className="block text-muted-foreground">para Casais</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Gerencie suas finanças em conjunto, tome decisões inteligentes e construam um futuro próspero juntos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a 
              href="/auth/register"
              className="btn btn-primary px-8 py-3 text-lg"
            >
              Começar Gratuitamente
            </a>
            <a 
              href="/auth/login"
              className="btn btn-secondary px-8 py-3 text-lg"
            >
              Já tenho conta
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Controle de Transações</h3>
            <p className="text-muted-foreground text-sm">
              Registre receitas e despesas com categorização automática e controle total.
            </p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-success" />
            </div>
            <h3 className="font-semibold mb-2">Relatórios Visuais</h3>
            <p className="text-muted-foreground text-sm">
              Gráficos interativos e relatórios detalhados para análise completa.
            </p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-warning" />
            </div>
            <h3 className="font-semibold mb-2">Previsões Inteligentes</h3>
            <p className="text-muted-foreground text-sm">
              Algoritmos que preveem suas finanças para os próximos 12 meses.
            </p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <PieChart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Análise por Categoria</h3>
            <p className="text-muted-foreground text-sm">
              Entenda onde seu dinheiro está sendo gasto com análises detalhadas.
            </p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-success" />
            </div>
            <h3 className="font-semibold mb-2">Colaboração</h3>
            <p className="text-muted-foreground text-sm">
              Ambos os parceiros podem gerenciar as finanças em tempo real.
            </p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-warning" />
            </div>
            <h3 className="font-semibold mb-2">Segurança Total</h3>
            <p className="text-muted-foreground text-sm">
              Seus dados financeiros protegidos com criptografia de ponta.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 FinanceCouple. Construído para casais que planejam juntos.</p>
          </div>
        </div>
      </div>
    </main>
  )
}