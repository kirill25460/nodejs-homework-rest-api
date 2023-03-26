const nodemailer = require("nodemailer");
require("dotenv").config();

const {META_PASSWORD} = process.env;

const nodemailerConfig = {
     host: " smtp.meta.ua",
     port: 465, // 25, 465, 2525
     secure: true,
     auth:{
        user:"mallet25460@meta.ua",
        pass: META_PASSWORD
     }
};

const transport = nodemailer.createTransport(nodemailerConfig);
const email = {
    to:"tokav60731@etondy.com",
    from:"mallet25460@meta.ua",
    subject:"Test email",
    html:"<p><strong>Test email</strong> from localhost:3000</p>"
};
transport.sendMail(email)
   .then(()=> console.log("email send success"))
   .catch(error => console.log(error.message));