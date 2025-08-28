# 🗄️ Configuração de Banco de Dados

## Problema Atual
Erro: `Can't reach database server at localhost:5432`

## Solução: Usar Supabase (Gratuito)

### Passo 1: Criar conta no Supabase
1. Acesse https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub

### Passo 2: Criar novo projeto
1. Clique em "New Project"
2. Nome: `vida-financeira-casal`
3. Database Password: **ANOTE ESTA SENHA**
4. Region: South America (São Paulo)
5. Clique em "Create new project"

### Passo 3: Obter URL de conexão
1. Vá em Settings > Database
2. Procure por "Connection string"
3. Copie a URI (formato: `postgresql://postgres:[YOUR-PASSWORD]@...`)
4. Substitua `[YOUR-PASSWORD]` pela senha que você anotou

### Passo 4: Atualizar .env.local
Substitua a linha DATABASE_URL no arquivo `.env.local`:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@db.xxx.supabase.co:5432/postgres"
```

### Passo 5: Executar migrações
```bash
npx prisma db push
```

### Passo 6: Testar
```bash
npm run dev
```

## Alternativa: PostgreSQL Local

Se preferir instalar PostgreSQL localmente:

### Windows
1. Baixe PostgreSQL: https://www.postgresql.org/download/windows/
2. Instale com senha padrão
3. Crie banco: `vida_financeira_casal`
4. Use: `postgresql://postgres:sua_senha@localhost:5432/vida_financeira_casal`

### Docker (Mais fácil)
```bash
docker run --name postgres-dev -e POSTGRES_PASSWORD=123456 -e POSTGRES_DB=vida_financeira_casal -p 5432:5432 -d postgres:15

# URL: postgresql://postgres:123456@localhost:5432/vida_financeira_casal
```

## Recomendação
**Use Supabase** - é gratuito, rápido e não precisa instalar nada localmente!