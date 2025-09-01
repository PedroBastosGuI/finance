// Simulação de envio de email - substitua por Resend, SendGrid, etc.
export async function sendPasswordResetEmail(email: string, resetLink: string) {
  // Em produção, use um serviço real como Resend
  console.log(`📧 Email enviado para: ${email}`)
  console.log(`🔗 Link de reset: ${resetLink}`)
  
  // Simulação de sucesso
  return { success: true }
  
  // Exemplo com Resend:
  /*
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  return await resend.emails.send({
    from: 'noreply@financecouple.com',
    to: email,
    subject: 'Recuperar senha - FinanceCouple',
    html: `
      <h2>Recuperar sua senha</h2>
      <p>Clique no link abaixo para criar uma nova senha:</p>
      <a href="${resetLink}">Redefinir Senha</a>
      <p>Este link expira em 1 hora.</p>
    `
  })
  */
}