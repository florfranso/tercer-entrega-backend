import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config()

const adminEmail = process.env.ADMIN_EMAIL;
const adminPasswordEmail = process.env.ADMIN_EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: adminEmail,
        pass: adminPasswordEmail
    },
    secure: false,
    tls: {
        rejectUnauthorized: false,

    }
});

export {transporter, adminEmail}