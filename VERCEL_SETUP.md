# 🚀 Configuração Vercel - Passo a Passo

## 1. Variáveis de Ambiente na Vercel

No painel da Vercel, vá em **Settings > Environment Variables** e adicione:

### Variáveis Obrigatórias:

```
DATABASE_URL
Valor: sua_url_postgresql_completa
Environment: Production, Preview, Development
```

```
NEXTAUTH_URL  
Valor: https://seu-projeto.vercel.app
Environment: Production, Preview
```

```
NEXTAUTH_SECRET
Valor: uma_chave_secreta_muito_forte_e_aleatoria
Environment: Production, Preview, Development
```

## 2. Como Gerar NEXTAUTH_SECRET

Execute no terminal:
```bash
openssl rand -base64 32
```

Ou use um gerador online: https://generate-secret.vercel.app/32

## 3. Configurar Banco PostgreSQL

### Opção A: Supabase (Gratuito)
1. Acesse https://supabase.com
2. Crie novo projeto
3. Vá em Settings > Database
4. Copie a "Connection string"
5. Substitua `[YOUR-PASSWORD]` pela senha real

### Opção B: Vercel Postgres
1. No painel Vercel, vá em Storage
2. Create Database > Postgres
3. Copie a DATABASE_URL gerada

## 4. Verificar Build

Após configurar as variáveis:
1. Vá em Deployments
2. Clique em "Redeploy" 
3. Aguarde o build completar

## 5. Executar Migrações

Após deploy bem-sucedido:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login na Vercel
vercel login

# Puxar variáveis de ambiente
vercel env pull .env.local

# Executar migrações
npx prisma db push
```

## 6. Testar Aplicação

1. Acesse a URL da Vercel
2. Registre uma conta
3. Configure um casal
4. Adicione transações
5. Verifique se tudo funciona

## ⚠️ Problemas Comuns

### Build falha com erro de variáveis
- Verifique se todas as 3 variáveis estão configuradas
- Confirme se DATABASE_URL está correta
- Regenere NEXTAUTH_SECRET se necessário

### Erro de autenticação
- Confirme se NEXTAUTH_URL aponta para domínio correto
- Verifique se não há espaços extras nas variáveis

### Erro de banco de dados
- Teste a conexão DATABASE_URL
- Execute `npx prisma db push` após mudanças

## 📋 Checklist Final

- [ ] Repositório no GitHub
- [ ] Projeto conectado na Vercel
- [ ] DATABASE_URL configurada
- [ ] NEXTAUTH_URL configurada  
- [ ] NEXTAUTH_SECRET configurada
- [ ] Build passou sem erros
- [ ] Migrações executadas
- [ ] Aplicação testada e funcionando

---

🎉 **Sucesso!** Sua aplicação está no ar!