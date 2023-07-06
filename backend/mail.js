const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.MAIL_SERVER_PASSWORD,
    },
});

const sendEmail = (receiverEmail, subject, data) => {
    let mailDetails = {
        from: process.env.EMAIL_ID,
        to: receiverEmail,
        subject: subject,
        text: data,
    };
    transporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log("Email sent successfully");
        }
    });
};

module.exports = {
    sendEmail,
};
