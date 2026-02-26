const errorHandlerMiddleware = (err, req, res, next) => {
    console.error(err);


    const status = err.status || 500;
    const message = err.message || 'Error interno del servidor';

    return res.status(status).json({
        status: status,
        ok: false,
        message: message,
        data: null
    })
}

export default errorHandlerMiddleware
