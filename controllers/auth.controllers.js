
import userRepository from "../repository/user.repository.js"
import jwt from 'jsonwebtoken'
import ENVIRONMENT from "../config/environment.config.js"
import bcrypt from 'bcrypt'
import mail_transporter from "../config/mail.config.js"
import serverError from "../helpers/error.helper.js"

class AuthController {
    async register(request, response, next) {
        
        const { email, password, username } = request.body

        if (!email || !password || !username) {
            throw new serverError('Debes ingresar todos los datos', 400)
        }

        const user = await userRepository.buscarUnoPorEmail(email)
        if (user) {
            throw new serverError('mail ya registrado', 400)
        }

        let hashed_password = await bcrypt.hash(password, 10)
        await userRepository.crear(email, hashed_password, username)

        const verification_email_token = jwt.sign(
            {
                email: email 
            },
            ENVIRONMENT.JWT_SECRET_KEY
            
        )

        mail_transporter.sendMail(
            {
                from: ENVIRONMENT.GMAIL,
                to: email,
                subject: 'verificacion de email',
                html: `
                        <h1>Bienvenido ${username}</h1>
                        <p>Neceitamos que verifiques tu email</p>
                        <br/>
                        <p>Haz click en verificar</p>
                        <a
                        href='http://localhost:8080/api/auth/verify-email?verification_email_token=${verification_email_token}'> Verificar </a> 
                        <br/>
                        <span>Si desconoces este registro desestima este mail</span>
                        `
            }
        )


        return response.json({
            ok: true,
            message: 'Usuario creado exitosamente',
            status: 201,
            data: null
        })
    }

    async login(request, response, next) {
        const { email, password } = request.body


        if (!email) {
            throw new serverError('Debes ingresar un email', 400)
        }

        else if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))) {
            throw new serverError('El mail no es valido', 400)
        }

        const usuario_encontrado = await userRepository.buscarUnoPorEmail(email)


        if (!usuario_encontrado) {
            throw new serverError('credenciales invalidas', 401)

        }


        if (!(await bcrypt.compare(password, usuario_encontrado.password))) {
            throw new serverError('credenciales invalidas', 401)
        }

        if (!usuario_encontrado.email_verified) {
            throw new serverError('No haz verificado el email', 401)
        }

        const datos_del_token = {
            username: usuario_encontrado.username,
            email: usuario_encontrado.email,
            id: usuario_encontrado.id
        }

        const auth_token = jwt.sign(datos_del_token, ENVIRONMENT.JWT_SECRET_KEY)
        return response.json({
            message: 'inicio de sesion exitoso',
            ok: true,
            status: 200,
            data: {
                auth_token: auth_token
            }
        })
    }

    async verifyEmail(request, response, next) {
        const { verification_email_token } = request.query


        if (!verification_email_token) {
            throw new serverError('Debes enviar el tokern de verificacion', 400)
        }


        const { email } = jwt.verify(
            verification_email_token,
            ENVIRONMENT.JWT_SECRET_KEY
        )

        const user_found = await userRepository.buscarUnoPorEmail(email)

        if (!user_found) {
            throw new serverError('NO EXISTE EL USUARIO CON ESE MAIL', 404)

        }

        if (user_found.email_verified) {
            throw new serverError('Usuario ya verificado', 400)

        }

        await userRepository.actualizarPorId(
            user_found._id,
            {
                email_verified: true
            }
        )


        return response.redirect(
            ENVIRONMENT.URL_FRONTEND + '/login?from=email-validated' 
        )

        
    }
}



const authController = new AuthController()

export default authController

