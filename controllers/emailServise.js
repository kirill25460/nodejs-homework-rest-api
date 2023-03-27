const nodemailer = require('nodemailer');

const { EMAIL, META_PASSWORD, BASE_URL } = process.env;

const sendEmail = (email, verificationToken) => {
  console.log('EMAIL', EMAIL, META_PASSWORD);

  const transporter = nodemailer.createTransport({
    host: 'smtp.ukr.net',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL,
      pass: META_PASSWORD,
    },
    authMethod: 'LOGIN',
  });

  const message = {
    from: EMAIL,
    to: email,
    subject: 'Verification email',
    text: `Please verify your email address.`,
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click verify email</a>`
  };

  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take our messages');
    }
  });

  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = { sendEmail };