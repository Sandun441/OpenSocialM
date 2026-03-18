const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'resend',
      pass: process.env.RESEND_API_KEY,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'OpenSocialM'} <${process.env.FROM_EMAIL || 'onboarding@resend.dev'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
