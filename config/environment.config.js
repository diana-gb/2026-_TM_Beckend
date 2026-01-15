import dotenv from "dotenv"

/* Esto carga las variables de entorn del archivo .env en process.env
 */

dotenv.config()

const ENVIRONMENT = {
    MONGO_DB_URI: process.env.MONGO_DB_URI,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    GMAIL: process.env.GMAIL,
    PASS: process.env.PASS,
    URL_FRONTEND: process.env.URL_FRONTEND

}

export default ENVIRONMENT