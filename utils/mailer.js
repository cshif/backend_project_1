import 'dotenv/config';
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'eyc <eva.ychuang@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.content,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
