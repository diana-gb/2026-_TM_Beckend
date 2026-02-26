import mongoose from "mongoose"
import ENVIRONMENT from "./environment.config.js"


const connection_local = `${ENVIRONMENT.MONGO_DB_URI}/${ENVIRONMENT.MONGO_DB_NAME}`

export async function connectMongoDB (){
    try{
        
        await mongoose.connect(
            connection_local
        )
        console.log ('conexion a MongoDB EXITOSA')
    }
    catch(error){
        console.error('coneccion FALLO')
    console.error(error)
    }
}