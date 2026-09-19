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
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.postnest.in';
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

/**
 * Send Instant Newsletter Welcome Email upon subscription
 */
export async function sendNewsletterWelcomeEmail({ toEmail }: { toEmail: string }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.postnest.in';

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to PostNest Developer Digest!</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080c14; color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 580px; margin: 30px auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
    .header { padding: 36px 32px 28px; text-align: center; border-bottom: 1px solid #1e293b; background: linear-gradient(180deg, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0) 100%); }
    .badge { display: inline-block; background-color: rgba(249,115,22,0.15); border: 1px solid rgba(249,115,22,0.3); color: #f97316; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px; }
    .logo-text { font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
    .logo-orange { color: #f97316; }
    .content { padding: 32px; }
    .title { font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 16px; line-height: 1.3; }
    .text { font-size: 14px; line-height: 1.7; color: #94a3b8; margin-bottom: 20px; }
    .feature-box { background-color: #1e293b; border-radius: 14px; padding: 20px; margin-bottom: 24px; border: 1px solid #334155; }
    .feature-item { display: flex; align-items: flex-start; margin-bottom: 12px; }
    .feature-item:last-child { margin-bottom: 0; }
    .feature-bullet { color: #f97316; font-size: 16px; margin-right: 10px; line-height: 1; }
    .feature-text { font-size: 13px; color: #cbd5e1; line-height: 1.5; }
    .btn { display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff !important; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 12px; text-align: center; box-shadow: 0 4px 14px rgba(249,115,22,0.35); }
    .btn-container { text-align: center; margin: 28px 0 20px; }
    .footer { padding: 24px 32px; background-color: #090d16; border-top: 1px solid #1e293b; text-align: center; font-size: 11px; color: #64748b; line-height: 1.6; }
    .footer a { color: #f97316; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">🎉 Welcome Aboard</div>
      <div class="logo-text">Post<span class="logo-orange">Nest</span></div>
      <div style="font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-top: 6px;">Developer & Tech Digest</div>
    </div>
    <div class="content">
      <div class="title">You're officially subscribed! 🚀</div>
      <p class="text">Thank you for subscribing to the <strong>PostNest Developer Digest</strong>. We are thrilled to have you join our community of developers, technical writers, and tech enthusiasts.</p>
      
      <div class="feature-box">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #f97316; margin-bottom: 12px;">What you can expect in your inbox:</div>
        <div class="feature-item">
          <span class="feature-bullet">✨</span>
          <span class="feature-text"><strong>Weekly Handpicked Articles:</strong> The highest-quality developer tutorials, system design breakdowns, and web development insights.</span>
        </div>
        <div class="feature-item" style="margin-top: 10px;">
          <span class="feature-bullet">📢</span>
          <span class="feature-text"><strong>Free Guest Post Opportunities:</strong> Learn how to publish your technical articles for free with zero paywalls.</span>
        </div>
        <div class="feature-item" style="margin-top: 10px;">
          <span class="feature-bullet">⚙️</span>
          <span class="feature-text"><strong>Platform Updates:</strong> Early access to new PostNest features, API enhancements, and publishing tools.</span>
        </div>
      </div>

      <p class="text">Want to start reading or share your own engineering stories today?</p>

      <div class="btn-container">
        <a href="${appUrl}" class="btn">Explore PostNest Articles</a>
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px;">&copy; ${new Date().getFullYear()} PostNest.in • Publish Like a Pro. All rights reserved.</p>
      <p style="margin: 0 0 6px;">You received this email because you subscribed to the PostNest Developer Digest at <a href="${appUrl}">${appUrl}</a>.</p>
      <p style="margin: 0;">Support: <a href="mailto:contact.postnest@gmail.com">contact.postnest@gmail.com</a></p>
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
Welcome to PostNest Developer Digest!
-------------------------------------
Thank you for subscribing to PostNest Digest.

What to expect:
- Weekly handpicked articles & tutorials
- Free guest post opportunities on PostNest
- Engineering updates & platform releases

Visit PostNest: ${appUrl}

Support: contact.postnest@gmail.com
  `;

  const transporter = getEmailTransporter();

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"PostNest Digest" <${process.env.SMTP_USER || process.env.GMAIL_USER || 'contact.postnest@gmail.com'}>`,
        to: toEmail,
        subject: `🚀 Welcome to PostNest Developer Digest!`,
        text: textContent,
        html: htmlContent,
      });
      console.log(`[Email] Newsletter Welcome email sent to ${toEmail}`);
      return { success: true, method: 'smtp' };
    } catch (err: any) {
      console.error('[Email Error] Failed sending Welcome email via SMTP:', err);
      return { success: true, method: 'fallback', error: err.message };
    }
  } else {
    console.log(`\n======================================================`);
    console.log(`[POSTNEST NEWSLETTER WELCOME EMAIL LOGGED]`);
    console.log(`To: ${toEmail}`);
    console.log(`Subject: 🚀 Welcome to PostNest Developer Digest!`);
    console.log(`======================================================\n`);
    return { success: true, method: 'console_logged' };
  }
}

/**
 * Send Newsletter Broadcast email to a single recipient
 */
export async function sendNewsletterBroadcastEmail({
  toEmail,
  subject,
  previewText,
  bodyHtml,
}: {
  toEmail: string;
  subject: string;
  previewText?: string;
  bodyHtml: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.postnest.in';

  const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080c14; color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 30px auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
    .header { padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #1e293b; background: linear-gradient(180deg, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0) 100%); }
    .logo-text { font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
    .logo-orange { color: #f97316; }
    .subhead { font-size: 10px; font-weight: 700; color: #f97316; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
    .content { padding: 32px; font-size: 15px; line-height: 1.7; color: #cbd5e1; }
    .content h1, .content h2, .content h3 { color: #ffffff; margin-top: 24px; margin-bottom: 12px; }
    .content p { margin-bottom: 16px; }
    .content a { color: #f97316; text-decoration: underline; }
    .footer { padding: 24px 32px; background-color: #090d16; border-top: 1px solid #1e293b; text-align: center; font-size: 11px; color: #64748b; line-height: 1.6; }
    .footer a { color: #f97316; text-decoration: none; }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;font-size:1px;color:#333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${previewText}</div>` : ''}
  <div class="container">
    <div class="header">
      <div class="logo-text">Post<span class="logo-orange">Nest</span></div>
      <div class="subhead">Developer & Tech Digest</div>
    </div>
    <div class="content">
      ${bodyHtml}
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px;">&copy; ${new Date().getFullYear()} PostNest.in • Publish Like a Pro. All rights reserved.</p>
      <p style="margin: 0 0 6px;">You are receiving this update because you subscribed to PostNest Digest.</p>
      <p style="margin: 0;">Support: <a href="mailto:contact.postnest@gmail.com">contact.postnest@gmail.com</a></p>
    </div>
  </div>
</body>
</html>
  `;

  const transporter = getEmailTransporter();

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"PostNest Digest" <${process.env.SMTP_USER || process.env.GMAIL_USER || 'contact.postnest@gmail.com'}>`,
        to: toEmail,
        subject: subject,
        text: bodyHtml.replace(/<[^>]+>/g, ''), // Basic strip HTML for plain text
        html: fullHtml,
      });
      return { success: true, method: 'smtp' };
    } catch (err: any) {
      console.error(`[Email Error] Failed broadcasting to ${toEmail}:`, err);
      return { success: false, error: err.message };
    }
  } else {
    console.log(`[POSTNEST BROADCAST LOGGED] To: ${toEmail} | Subject: ${subject}`);
    return { success: true, method: 'console_logged' };
  }
}

