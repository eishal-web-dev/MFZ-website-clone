import nodemailer from 'nodemailer';

function getTransporter() {
  const host = process.env.EMAIL_HOST;
  const port = Number(
    process.env.EMAIL_PORT ?? 465,
  );
  const secure =
    process.env.EMAIL_SECURE === 'true';
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      'Email configuration is incomplete.',
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendVerificationEmail(
  email: string,
  name: string,
  code: string,
): Promise<void> {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify your MFZ account',
    text:
      `Hi ${name},\n\n` +
      `Your MFZ verification code is: ${code}\n\n` +
      'This code expires in 15 minutes.',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
        <h1>Verify your MFZ account</h1>
        <p>Hi ${name},</p>
        <p>Your verification code is:</p>
        <div style="font-size:34px;font-weight:800;letter-spacing:10px">
          ${code}
        </div>
        <p>This code expires in 15 minutes.</p>
      </div>
    `,
  });
}

export async function sendResetEmail(
  email: string,
  name: string,
  resetUrl: string,
): Promise<void> {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset your MFZ password',
    text:
      `Hi ${name},\n\n` +
      `Reset your password here:\n${resetUrl}\n\n` +
      'This link expires in one hour.',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
        <h1>Reset your MFZ password</h1>
        <p>Hi ${name},</p>
        <p>
          <a href="${resetUrl}">Click here to reset your password</a>
        </p>
        <p>This link expires in one hour.</p>
      </div>
    `,
  });
}