const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: 'peacesllr@gmail.com',
        pass: 'vypa bepv rele ybui', 
        authMethod: 'PLAIN' 
    },
});

module.exports = transporter;
