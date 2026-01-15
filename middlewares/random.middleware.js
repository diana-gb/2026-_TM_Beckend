function randomMiddleware(request,response,next){

    // Determina la suerte
    const numero = Math.random()

    // un middleware si quiere puede comunicarse con el controlador medianre request

    if (numero >= 0.5){
        request.suerte = true
    }
    else {
        request.suerte = false
    }

    next()
}

export default randomMiddleware