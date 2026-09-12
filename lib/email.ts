import nodemailer from 'nodemailer';

// Create transport dynamically based on available environment variables
export function getEmailTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER || process.env.GMAIL_USER || 'contact.postnest@gmail.com';
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD;

  if (!pass) {
    return null; // SMTP credentials not yet populated in .env
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendPasswordResetOtpEmail({
  toEmail,
  userName,
  otpCode,
}: {
  toEmail: string;
  userName?: string;
  otpCode: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://postnest.in';
  const greeting = userName ? `Hi ${userName},` : 'Hello,';

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your PostNest Password</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090a0f; color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 30px auto; background-color: #121622; border: 1px solid #1f2536; border-radius: 20px; overflow: hidden; }
    .header { padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #1f2536; background: linear-gradient(180deg, rgba(249,115,22,0.12) 0%, rgba(249,115,22,0) 100%); }
    .logo-text { font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
    .logo-orange { color: #f97316; }
    .content { padding: 32px; }
    .title { font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
    .text { font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px; }
    .otp-box { background-color: #1a2030; border: 2px dashed #f97316; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px; }
    .otp-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #f97316; margin-bottom: 8px; }
    .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #ffffff; margin: 0; }
    .expiry { font-size: 12px; color: #fb923c; margin-top: 8px; }
    .warning { padding: 14px; background-color: #161b27; border-radius: 12px; border-left: 4px solid #f97316; font-size: 12px; color: #cbd5e1; line-height: 1.5; margin-bottom: 24px; }
    .footer { padding: 24px 32px; background-color: #0c0e15; border-top: 1px solid #1f2536; text-align: center; font-size: 11px; color: #64748b; line-height: 1.5; }
    .footer a { color: #f97316; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">Post<span class="logo-orange">Nest</span></div>
      <div style="font-size: 10px; font-weight: 700; color: #f97316; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">Publish like a pro</div>
    </div>
    <div class="content">
      <div class="title">Password Reset Verification</div>
      <p class="text">${greeting}</p>
      <p class="text">We received a request to reset your password for your PostNest account. Use the one-time verification code (OTP) below to complete your password reset:</p>
      
      <div class="otp-box">
        <div class="otp-label">One-Time Verification Code</div>
        <div class="otp-code">${otpCode}</div>
        <div class="expiry">⏱️ Valid for 10 minutes only</div>
      </div>

      <div class="warning">
        <strong>Security Notice:</strong> If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged and your account stays secure.
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px;">&copy; ${new Date().getFullYear()} PostNest.in • Publish Like a Pro. All rights reserved.</p>
      <p style="margin: 0;">Need help? Reach our support desk at <a href="mailto:contact.postnest@gmail.com">contact.postnest@gmail.com</a> or <a href="https://wa.me/917041167089">+91 70411 67089</a></p>
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
PostNest - Password Reset Code
-----------------------------------
${greeting}

We received a request to reset your password for your PostNest account.

Your One-Time Verification Code (OTP) is:
${otpCode}

This code is valid for 10 minutes.

If you did not request this, please ignore this message. Your account remains secure.

PostNest Support: contact.postnest@gmail.com | +91 70411 67089
  `;

  const transporter = getEmailTransporter();

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"PostNest Support" <${process.env.SMTP_USER || process.env.GMAIL_USER || 'contact.postnest@gmail.com'}>`,
        to: toEmail,
        subject: `Your PostNest Password Reset Code: ${otpCode}`,
        text: textContent,
        html: htmlContent,
      });
      console.log(`[Email] Password reset OTP sent to ${toEmail}`);
      return { success: true, method: 'smtp' };
    } catch (err: any) {
      console.error('[Email Error] Failed sending email via SMTP:', err);
      // Fallback log in dev
      console.log(`[Email Dev Fallback] Password Reset OTP for ${toEmail}: ${otpCode}`);
      return { success: true, method: 'fallback', error: err.message };
    }
  } else {
    // If SMTP credentials are not yet configured in .env, log to console for instant local testability
    console.log(`\n======================================================`);
    console.log(`[POSTNEST PASSWORD RESET OTP]`);
    console.log(`To: ${toEmail}`);
    console.log(`OTP Code: ${otpCode}`);
    console.log(`Expires in: 10 minutes`);
    console.log(`======================================================\n`);
    return { success: true, method: 'console_logged' };
  }
}
