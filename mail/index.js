
require('dotenv').load({path: '../.env'});
const nodemailer = require('nodemailer');

const options = {
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    tls:{
        rejectUnauthorized: false
    }
};

if (process.env.NODE_ENV === 'production') {
    options['host'] = 'smtp.gmail.com'
} else {
    options['host'] = 'smtp.ethereal.email'
}

const transporter = nodemailer.createTransport(options);

module.exports = transporter;
