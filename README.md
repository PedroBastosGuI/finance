# 💰 Vida Financeira do Casal

Sistema de controle financeiro para casais com previsões para os próximos 12 meses.

## 🚀 Tecnologias

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js
- **Deploy**: Vercel

## 📋 Funcionalidades

- ✅ Controle de entradas e saídas
- ✅ Categorização de transações
- ✅ Dashboard com gráficos
- ✅ Previsões financeiras (12 meses)
- ✅ Relatórios detalhados
- ✅ Multi-usuário (casais)

## 🛠️ Setup Local

1. **Clone e instale dependências:**
```bash
git clone <repo>
cd vida-financeira-casal
npm install
```

2. **Configure o banco de dados:**
```bash
cp .env.example .env
# Edite o .env com suas configurações
```

3. **Execute as migrações:**
```bash
npx prisma db push
npx prisma generate
```

4. **Inicie o servidor:**
```bash
npm run dev
```

## 📊 Estrutura do Banco

- **Users**: Usuários do sistema
- **Couples**: Casais (multi-tenancy)
- **Transactions**: Transações financeiras
- **Categories**: Categorias personalizáveis
- **Budgets**: Orçamentos mensais

## 🚀 Deploy na Vercel

1. Conecte o repositório GitHub à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático via Git push