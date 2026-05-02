const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,     // your Gmail address
    pass: process.env.EMAIL_PASS      // Gmail App Password (NOT your real password)
  }
});

const sendEmail = async (options) => {
  const mailOptions = {
    from: `OpenSocialM <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || options.message
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info.messageId);
};

/**
 * Builds a beautiful HTML email for password reset OTP.
 */
const buildOtpEmailHtml = (otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset OTP</title>
</head>
<body style="margin:0;padding:0;background:#f0f4ff;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4ff;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(26,35,126,0.12);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1A237E 0%,#3949AB 100%);padding:40px 48px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:1px;">OpenSocialM</h1>
              <p style="margin:8px 0 0;color:#c5cae9;font-size:14px;letter-spacing:2px;">PASSWORD RESET</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 48px;">
              <p style="margin:0 0 16px;color:#37474f;font-size:16px;line-height:1.6;">Hello,</p>
              <p style="margin:0 0 24px;color:#37474f;font-size:16px;line-height:1.6;">
                We received a request to reset your password. Use the OTP below to proceed. It expires in <strong>10 minutes</strong>.
              </p>
              <!-- OTP Box -->
              <div style="text-align:center;margin:32px 0;">
                <div style="display:inline-block;background:#f0f4ff;border:2px dashed #3949AB;border-radius:16px;padding:24px 48px;">
                  <p style="margin:0 0 4px;color:#7986cb;font-size:12px;letter-spacing:3px;text-transform:uppercase;">Your OTP Code</p>
                  <p style="margin:0;color:#1A237E;font-size:42px;font-weight:800;letter-spacing:12px;">${otp}</p>
                </div>
              </div>
              <p style="margin:24px 0 0;color:#78909c;font-size:14px;line-height:1.6;">
                If you did not request a password reset, please ignore this email. Your account remains secure.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8f9ff;padding:24px 48px;text-align:center;border-top:1px solid #e8eaf6;">
              <p style="margin:0;color:#9e9e9e;font-size:12px;">© ${new Date().getFullYear()} OpenSocialM · All rights reserved</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * Fallback: wraps a plain text message in minimal HTML.
 */
const buildPlainHtml = (text) => `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:40px auto;padding:32px;background:#fff;border-radius:12px;border:1px solid #e0e0e0;">
  <pre style="white-space:pre-wrap;color:#37474f;font-family:inherit;font-size:15px;line-height:1.7;">${text}</pre>
</div>
`;

module.exports = { sendEmail, buildOtpEmailHtml };
