import ENVIRONMENT from "./environment.config.js";
import nodemailer from "nodemailer"


const mail_transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: ENVIRONMENT.GMAIL,
        pass: ENVIRONMENT.PASS
    },
    tls: {
        rejectUnauthorized: false  // Esto es para el servidor porque a veces necesita este certificado, no siempre es necesario
    }
})

export default mail_transporter