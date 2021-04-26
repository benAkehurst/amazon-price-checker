const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PW,
  },
});

/**
 * Sends email to the user when the price is hit
 * @param {*} data {
 *  toEmail: The person to send the email to
 *  itemName: The item name
 *  itemLink: The item URL
 * }
 */
const sendEmail = (data) => {
  const mailOptions = {
    from: `${PROCESS.env.EMAIL_USERNAME}`,
    to: `${data.toEmail}`,
    subject: `AMAZON PRICE TRACK - ${data.itemName} HAS HIT YOUR TARGET PRICE`,
    html: `<p>The ${data.itemName} you wanted to buy is now at your target price! <a href="${data.itemLink}">Buy it HERE!</a></p>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent successfully');
    }
  });
};

module.exports = { sendEmail };