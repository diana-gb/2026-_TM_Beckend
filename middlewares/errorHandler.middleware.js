const errorHandlerMiddleware = (err, req, res, next) => {
    /* console.error(err.stack); */

    // Check if the error has a status code, otherwise default to 500
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    return res.status(status).json({
        status: status,
        ok: false,
        message: message,
        data: null
    })
}

export default errorHandlerMiddleware
