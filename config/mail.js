import nodemailer from 'nodemailer'
import Brevo from "nodemailer-brevo-transport"

export default (email, token, req) => {
    return nodemailer.createTransport(new Brevo({
        apiKey: process.env.BREVO_API_KEY
    })).sendMail({
        from: `"Cartwheels: A Geospatial Tracker For Street Vendors" <plogic9@gmail.com>`,
        to: email,
        subject: `Reset Password`,
        html: `<b>Click this <a href="http://${req.headers["host"]}/forgotpassword?token=${token}">link</a> to reset password of your account.</b>`
    })
}