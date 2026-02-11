import { connectMongoDB } from './config/mongoDB.config.js'
import express from 'express'
import authRouter from './routes/auth.router.js'
import cors from 'cors'
import workspaceRouter from './routes/workspace.router.js'
import workspaceRepository from './repository/workspace.repository.js'
import messageRepository from './repository/message.repository.js'
import { verifyApiKey } from './middlewares/apiKey.middleware.js'
import errorHandlerMiddleware from './middlewares/errorHandler.middleware.js'




connectMongoDB()



const app = express()

/* Cors es para que otras direcciones distintas a la nuestra puedan consultar nuestro servidor */
app.use(cors())


//Habilita a mi servidor a recibir json por body

//express lee el request.headers{'content-type'} y si el valor es application/json entonces guardda en el request.body y el json transformado
app.use(express.json())

app.use(verifyApiKey)


/* app.get(
    '/api/suerte/saber',
    randomMiddleware,
    (request, response) => {
        
        if(request.suerte){
            response.send('tenes suerte esto esta muy loco..')
        }

        else{
            response.send('otra respuesta loca')
        }
    }
) */




/* 
Crear una ruta /api/auth
esta ruta tendra un endpoint que sea POST /register y hara lo que actualmente hace nuestro /auth/register
*/

app.use("/api/auth", authRouter)
app.use("/api/workspace", workspaceRouter)

app.use(errorHandlerMiddleware)

app.listen(

    8080,
    () => {
        console.log('nuestra app se escucha en puerto 8080')
    }
)

/* mail_transporter.sendMail({
    from: ENVIRONMENT.GMAIL,
    to: ENVIRONMENT.GMAIL,
    subject: 'probando nodemailer',
    html: `<h1>espero que funcioneee!!</h1>`
})
 */

//Desarrollar un endpoint
/*
POST /auth/register
Nos enviaran un username, email, password
Crear el registro en mongo DB usando el user.repository
Responder con un mensaje tipo 'Usuario creado exitosamente'
*/


//Para crear un espacio de trabajo de prueba
/* async function crearEspacioDeTrabajo() {
    const workspace = await workspaceRepository.create(
        "697222e1408c77918ba836e8", // aca va mi ID
        'Espacio de trabajo: PRUEBA',
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLTLCwh0g9W3lIyolkxJ4De6JAib45-AglGw&s",// aca va la imagen
        'esta es la descripcion del espacio de trabajo'
    )
    //Me agrego como miembro
    await workspaceRepository.addMember(workspace._id, '697222e1408c77918ba836e8', "Owner")
}

crearEspacioDeTrabajo()  */

/* messageRepository.getAllByChannelId('697b6d1611935c6644dd5ce4').then(result => console.log(JSON.stringify(result))) */