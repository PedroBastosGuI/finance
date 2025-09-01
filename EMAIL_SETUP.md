# 📧 Configuração de Email

## Status Atual
- **Desenvolvimento**: Emails simulados (aparecem no console)
- **Produção**: Precisa configurar serviço real

## Opções de Serviços de Email

### 1. Resend (Recomendado - Mais Fácil)
```bash
npm install resend
```

**Vantagens:**
- ✅ Gratuito até 3.000 emails/mês
- ✅ Setup super simples
- ✅ Boa entregabilidade
- ✅ Dashboard moderno

**Como configurar:**
1. Acesse: https://resend.com
2. Crie conta gratuita
3. Vá em API Keys
4. Copie a chave

### 2. SendGrid
```bash
npm install @sendgrid/mail
```

**Vantagens:**
- ✅ Gratuito até 100 emails/dia
- ✅ Muito confiável
- ✅ Usado por grandes empresas

### 3. Nodemailer + Gmail
```bash
npm install nodemailer
```

**Vantagens:**
- ✅ Gratuito
- ✅ Usa sua conta Gmail
- ❌ Mais complexo de configurar

## Configuração Recomendada: Resend

### Passo 1: Instalar
```bash
npm install resend
```

### Passo 2: Obter API Key
1. Acesse https://resend.com
2. Faça cadastro
3. Vá em "API Keys"
4. Clique "Create API Key"
5. Copie a chave (começa com `re_`)

### Passo 3: Configurar .env
```env
RESEND_API_KEY=re_sua_chave_aqui
```

### Passo 4: Domínio (Opcional)
- **Desenvolvimento**: Use `onboarding@resend.dev`
- **Produção**: Configure seu domínio

## Email Corporativo

### Opção 1: Usar Resend com Domínio Próprio
1. No painel Resend, vá em "Domains"
2. Adicione seu domínio: `financecouple.com`
3. Configure DNS conforme instruções
4. Use: `noreply@financecouple.com`

### Opção 2: Usar Gmail Corporativo
Se você tem Gmail corporativo (`contato@suaempresa.com`):

```bash
npm install nodemailer
```

Configure com App Password do Gmail.

## Implementação Atual

O sistema está preparado para Resend. Basta:

1. Instalar: `npm install resend`
2. Configurar API key no `.env`
3. O código já está pronto!

## Custos

### Resend
- **Gratuito**: 3.000 emails/mês
- **Pro**: $20/mês = 50.000 emails

### SendGrid  
- **Gratuito**: 100 emails/dia
- **Essentials**: $19.95/mês = 50.000 emails

### Gmail
- **Gratuito**: Limitado
- **Workspace**: $6/usuário/mês

## Recomendação

Para seu projeto: **Use Resend**
- Fácil de configurar
- Gratuito para começar
- Boa entregabilidade
- Não precisa email corporativo