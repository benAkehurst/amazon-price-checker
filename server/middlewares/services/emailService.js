const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PW,
  },
});

const sendEmail = (data) => {
  transporter.sendMail(
    {
      from: data.from,
      to: data.to,
      subject: data.subject,
      html: data.html,
    },
    (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent successfully');
        return true;
      }
    }
  );
};

module.exports = { sendEmail };
