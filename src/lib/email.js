import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendEmail({ to, subject, html, text }) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_EMAIL}>`,
      to,
      subject,
      html,
      text,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}

export async function sendVerificationEmail(to, otp) {
  const subject = 'Verify your MuniDrip account';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to MuniDrip!</h2>
      <p style="color: #666; font-size: 16px;">Your verification code is:</p>
      <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
        ${otp}
      </div>
      <p style="color: #999; font-size: 14px;">This code expires in 10 minutes.</p>
      <p style="color: #999; font-size: 14px;">If you didn't request this, please ignore this email.</p>
    </div>
  `;
  return sendEmail({ to, subject, html });
}

export async function sendPasswordResetEmail(to, resetToken) {
  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password?token=${resetToken}`;
  const subject = 'Reset your MuniDrip password';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Reset Your Password</h2>
      <p style="color: #666; font-size: 16px;">Click the button below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; background: #000; color: #fff; padding: 15px 30px; text-decoration: none; margin: 20px 0;">Reset Password</a>
      <p style="color: #999; font-size: 14px;">This link expires in 1 hour.</p>
      <p style="color: #999; font-size: 14px;">If you didn't request this, please ignore this email.</p>
    </div>
  `;
  return sendEmail({ to, subject, html });
}

export async function sendWelcomeEmail(to, firstName) {
  const subject = 'Welcome to MuniDrip!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome, ${firstName}!</h2>
      <p style="color: #666; font-size: 16px;">Thanks for joining MuniDrip!</p>
      <p style="color: #666; font-size: 16px;">Start browsing our latest collection at <a href="${process.env.NEXT_PUBLIC_SITE_URL}">munidrip.com</a></p>
    </div>
  `;
  return sendEmail({ to, subject, html });
}

export default transporter;