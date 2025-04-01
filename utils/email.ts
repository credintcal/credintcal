// NOTE: This is a simplified email sender.
// For production, you would use a proper email service like Sendgrid, Mailgun, etc.

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;
  
  console.log(`
    VERIFICATION EMAIL (Development Mode)
    ----------------------------------
    To: ${email}
    Subject: Verify Your Email for Credbill
    
    Hello ${name},
    
    Thank you for registering with Credbill. Please verify your email by clicking the link below:
    
    ${verificationUrl}
    
    This link will expire in 24 hours.
    
    If you did not register for Credbill, please ignore this email.
    
    Best regards,
    The Credbill Team
  `);
  
  // In production, use a proper email service
  // Example using a hypothetical email service:
  /*
  const emailService = require('your-email-service');
  await emailService.send({
    to: email,
    from: 'noreply@credbill.com',
    subject: 'Verify Your Email for Credbill',
    html: `
      <div>
        <h1>Verify Your Email</h1>
        <p>Hello ${name},</p>
        <p>Thank you for registering with Credbill. Please verify your email by clicking the link below:</p>
        <p><a href="${verificationUrl}">Verify Email</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not register for Credbill, please ignore this email.</p>
        <p>Best regards,<br>The Credbill Team</p>
      </div>
    `,
  });
  */
  
  return true;
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
  
  console.log(`
    PASSWORD RESET EMAIL (Development Mode)
    ----------------------------------
    To: ${email}
    Subject: Reset Your Password for Credbill
    
    Hello ${name},
    
    We received a request to reset your password. Click the link below to set a new password:
    
    ${resetUrl}
    
    This link will expire in 1 hour.
    
    If you did not request a password reset, please ignore this email.
    
    Best regards,
    The Credbill Team
  `);
  
  // In production, use a proper email service
  
  return true;
} 