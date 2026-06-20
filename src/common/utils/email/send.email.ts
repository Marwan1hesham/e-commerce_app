import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export const sendEmail = async (mailOptions: Mail.Options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `Saraha App <${process.env.EMAIL}>`,
    ...mailOptions,
  });
  console.log('Message send', info.messageId);
  return info.accepted.length ? true : false;
};

export const generateOtp = async () => {
  return Math.floor(Math.random() * 900000 + 100000);
};
