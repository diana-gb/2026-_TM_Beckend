import ENVIRONMENT from "./environment.config.js";
import nodemailer from "nodemailer"


const mail_transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: ENVIRONMENT.GMAIL,
        pass: ENVIRONMENT.PASS
    },
    tls: {
        rejectUnauthorized: false  
    }
})

export default mail_transporter