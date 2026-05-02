const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  const { data, error } = await resend.emails.send({
    from: 'OpenSocialM <onboarding@resend.dev>',
    to: options.email,
    subject: options.subject,
    html: options.html || options.message,
    text: options.message,
  });

  if (error) {
    console.error('Resend error:', JSON.stringify(error));
    throw new Error(error.message);
  }

  console.log('Email sent:', data.id);
};