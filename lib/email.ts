import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOTP = async (email: string, otp: string) => {
  const mailOptions = {
    from: `"De Cafenta" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Kode OTP Reset Password - De Cafenta',
    html: `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #8b1c1c; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Reset Password De Cafenta</h1>
        </div>
        <div style="padding: 20px; background-color: #fdfbf2;">
          <p style="font-size: 16px; color: #333;">Halo,</p>
          <p style="font-size: 16px; color: #333;">Anda telah meminta untuk mereset password akun Anda di De Cafenta. Berikut adalah kode OTP Anda:</p>
          <div style="background-color: #f4d03f; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h2 style="margin: 0; font-size: 32px; color: #8b1c1c; letter-spacing: 5px;">${otp}</h2>
          </div>
          <p style="font-size: 14px; color: #666; font-style: italic;">Kode OTP ini berlaku selama 10 menit. Jangan bagikan kode ini kepada siapa pun.</p>
          <p style="font-size: 16px; color: #333;">Jika Anda tidak meminta reset password, silakan abaikan email ini.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
