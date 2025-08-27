# 🚀 Guia de Deploy - FinanceCouple

## Pré-requisitos

1. **Conta GitHub** - Para hospedar o código
2. **Conta Vercel** - Para deploy da aplicação
3. **Banco PostgreSQL** - Supabase (gratuito) ou Vercel Postgres

## Passo 1: Preparar Repositório GitHub

```bash
# Inicializar Git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "feat: sistema financeiro completo para casais"

# Conectar ao repositório GitHub (substitua pela sua URL)
git remote add origin https://github.com/SEU_USUARIO/vida-financeira-casal.git

# Enviar código para GitHub
git push -u origin main
```

## Passo 2: Configurar Banco de Dados

### Opção A: Supabase (Recomendado - Gratuito)

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta e novo projeto
3. Vá em Settings > Database
4. Copie a Connection String (URI)

### Opção B: Vercel Postgres

1. No painel da Vercel, vá em Storage
2. Crie um novo Postgres Database
3. Copie a DATABASE_URL fornecida

## Passo 3: Deploy na Vercel

1. **Conectar Repositório:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Conecte sua conta GitHub
   - Selecione o repositório `vida-financeira-casal`

2. **Configurar Variáveis de Ambiente:**
   ```
   DATABASE_URL=sua_url_do_banco_postgresql
   NEXTAUTH_URL=https://seu-projeto.vercel.app
   NEXTAUTH_SECRET=gere_uma_chave_secreta_aleatoria
   ```

3. **Deploy:**
   - Clique em "Deploy"
   - Aguarde o build completar

## Passo 4: Configurar Banco de Dados

Após o deploy, execute os comandos do Prisma:

```bash
# Instalar Vercel CLI (se não tiver)
npm i -g vercel

# Fazer login na Vercel
vercel login

# Executar migrações no ambiente de produção
vercel env pull .env.local
npx prisma db push
```

## Passo 5: Testar Aplicação

1. Acesse a URL fornecida pela Vercel
2. Crie uma conta de teste
3. Configure um casal
4. Adicione algumas transações
5. Verifique relatórios e previsões

## Variáveis de Ambiente Necessárias

```env
# Banco de Dados
DATABASE_URL="postgresql://user:pass@host:port/database"

# Autenticação
NEXTAUTH_URL="https://seu-dominio.vercel.app"
NEXTAUTH_SECRET="chave-secreta-aleatoria-muito-segura"
```

## Comandos Úteis

```bash
# Desenvolvimento local
npm run dev

# Build de produção
npm run build

# Executar migrações
npx prisma db push

# Visualizar banco
npx prisma studio

# Deploy manual
vercel --prod
```

## Troubleshooting

### Erro de Build
- Verifique se todas as dependências estão no package.json
- Confirme se não há erros de TypeScript

### Erro de Banco
- Verifique se a DATABASE_URL está correta
- Execute `npx prisma db push` após mudanças no schema

### Erro de Autenticação
- Confirme se NEXTAUTH_URL aponta para o domínio correto
- Gere uma nova NEXTAUTH_SECRET se necessário

## Domínio Personalizado (Opcional)

1. No painel Vercel, vá em Settings > Domains
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções
4. Atualize NEXTAUTH_URL com novo domínio

## Monitoramento

- **Analytics**: Habilitado automaticamente na Vercel
- **Logs**: Disponíveis no painel da Vercel
- **Performance**: Métricas em tempo real

---

🎉 **Parabéns!** Seu sistema financeiro está no ar!