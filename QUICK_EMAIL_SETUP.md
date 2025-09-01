# ⚡ Setup Rápido de Email

## Situação Atual
- **Desenvolvimento**: Emails aparecem no console do servidor
- **Produção**: Precisa configurar Resend

## Setup em 3 Passos

### 1. Instalar Resend
```bash
npm install resend
```

### 2. Obter API Key
1. Acesse: https://resend.com
2. Clique "Sign Up" (gratuito)
3. Vá em "API Keys" 
4. Clique "Create API Key"
5. Copie a chave (formato: `re_xxxxxxxxx`)

### 3. Configurar .env.local
```env
RESEND_API_KEY=re_sua_chave_aqui
```

## Pronto! 🎉

Agora os emails serão enviados de verdade.

## Alternativa: Continuar Simulado

Se não quiser configurar agora:
- Emails continuam aparecendo no console
- Copie o link do console para testar
- Funciona perfeitamente para desenvolvimento

## Para Produção

Configure domínio próprio no Resend:
- `noreply@seudominio.com`
- Melhor entregabilidade
- Aparência mais profissional

## Custos

- **Gratuito**: 3.000 emails/mês
- **Suficiente** para maioria dos projetos