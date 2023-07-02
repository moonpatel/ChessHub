const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "chessroyalemail@gmail.com",
        pass: process.env.MAIL_SERVER_PASSWORD,
    },
});

const sendEmail = (receiverEmail, subject, data) => {
    let mailDetails = {
        from: "chessroyalemail@gmail.com",
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
