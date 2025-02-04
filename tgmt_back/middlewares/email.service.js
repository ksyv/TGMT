const nodemailer = require('nodemailer');

const sendResetMail = (req, res, next) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
                user: process.env.GMAIL_USER,  // Utilise la variable d'environnement pour l'adresse Gmail
                pass: process.env.GMAIL_APP_PASSWORD 
        }
    });

    // Construisez le message de réinitialisation de mot de passe
    const resetUrl = `http://localhost:4200/reset-password?token=${req.body.token}`;
    const message = `
        <p>Vous avez demandé une réinitialisation de mot de passe. Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <a href="${resetUrl}">Réinitialiser le mot de passe</a>
    `;

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: req.body.email,
        subject: "Réinitialisez votre mot de passe",
        html: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email:", error);
            req.flash('error', error.message);
            return res.redirect('/users/forgot-password');
        } else {
            console.log("Email sent successfully:", info);
            req.flash('success', 'Un mail de réinitialisation de mot de passe a été envoyé à votre adresse e-mail');
            return res.redirect('/users/forgot-password');
        }
    });
}

module.exports = sendResetMail;
