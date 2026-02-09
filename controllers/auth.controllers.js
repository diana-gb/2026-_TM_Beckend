
import userRepository from "../repositoty/user.repository.js"
import jwt from 'jsonwebtoken'
import ENVIRONMENT from "../config/environment.config.js"
import bcrypt from 'bcrypt'
import mail_transporter from "../config/mail.config.js"
import serverError from "../helpers/error.helper.js"

class AuthController {
    async register(request, response, next) {
        try {
            // API shaping
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
                    email: email // aca guardamos el mail del usuario que se quiere registrar
                },
                ENVIRONMENT.JWT_SECRET_KEY
                /*                 {
                                    expiresIn: '7d'
                                }  para que expire en 7 dias por ejemplo si no verifico en ese plazo*/
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

        catch (error) {
            next(error)
        }
    }

    async login(request, response, next) {
        try {
            const { email, password } = request.body


            /* 
            Aplicar validaciones de mail y password 
            */

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

            /* Respondemos igual con credenciales invalidas tanto para usuario incorrecto como para contraseña asi no hay difereniacion para mayor seguridad del usuario */

            // en linea 78 hacemos comparacion de un texto con un hash mediante bcrypt
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


        catch (error) {
            next(error)
        }
    }

    async verifyEmail(request, response, next) {
        try {
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

            /* 
            Redireccionar al frontend 
            */

            return response.redirect(
                ENVIRONMENT.URL_FRONTEND + '/login?from=email-validated' // opcional querystring validated
            )

            /*     return response.json(
                    {
                            status: 200,
                            message: 'usuario verificado',
                            ok: true,
                            data : null
                }
            )
             */

        }

        catch (error) {
            next(error)
        }
    }
}



const authController = new AuthController()

export default authController

//Orden de menor a mayor COMPLEJIDAD de exigencia o de demanda de poder computacional?
/* 
condicion sobre una variable
un bucle de 100 a 1000 registros (donde no se consulta a ningun servicio externo)
una consulta a DB (Debatible porque si la DB tiene millones de registros puede ser mas costoso)
una consulta a otro servidor
*/