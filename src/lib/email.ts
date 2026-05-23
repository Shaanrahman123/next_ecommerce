import nodemailer from 'nodemailer';

const EMAIL_HOST = process.env.EMAIL_HOST || '';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_USER = process.env.EMAIL_USER || '';
// Strip single quotes if they are included in the env variable
const EMAIL_PASS = (process.env.EMAIL_PASS || '').replace(/^'|'$/g, '');
const EMAIL_FROM = process.env.EMAIL_FROM || 'no-reply@ecomm.com';

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465, // true for 465, false for 587 or other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  tls: {
    // Do not fail on invalid certificates
    rejectUnauthorized: false,
  },
});

export async function sendOTPEmail(to: string, otp: string) {
  // Always log the OTP to console for development verification
  console.log(`[AUTH] Verification OTP for ${to} is: ${otp}`);

  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
    console.warn('[AUTH] SMTP credentials are not fully configured in env. Falling back to console log.');
    return;
  }

  const mailOptions = {
    from: `"MINIMAL Vault" <${EMAIL_FROM}>`,
    to,
    subject: 'Verification Code - MINIMAL',
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; border: 1px solid #f0f0f0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 24px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #111111; margin: 0;">MINIMAL</h1>
          <div style="width: 40px; h: 1px; background-color: #000; margin: 8px auto 0;"></div>
        </div>
        
        <h2 style="font-size: 18px; font-weight: 600; color: #222222; text-align: center; margin-bottom: 10px;">Security Verification Code</h2>
        
        <p style="font-size: 14px; color: #666666; line-height: 1.6; text-align: center; margin-bottom: 30px;">
          Please use the following verification code to complete your password recovery. This code is valid for 10 minutes.
        </p>
        
        <div style="text-align: center; margin-bottom: 30px;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #111111; background-color: #f7f7f7; padding: 14px 28px; border-radius: 6px; border: 1px solid #eaeaea; display: inline-block;">
            ${otp}
          </span>
        </div>
        
        <p style="font-size: 12px; color: #999999; text-align: center; line-height: 1.5; margin-bottom: 0;">
          If you did not request this code, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[AUTH] Sent verification OTP email successfully to ${to}`);
  } catch (error) {
    console.error(`[AUTH] Failed to send email to ${to} via SMTP:`, error);
    // Do not throw error so local development doesn't crash on email failure
  }
}
