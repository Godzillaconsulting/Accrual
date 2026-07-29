// c:\Users\GODZILLA.IA\Accrual\Dashboard\server\middleware\errorHandler.js

class ApiError extends Error {
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message
        });
    }

    // Errores inesperados silenciosos
    // console.error('Unexpected error:', err);

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Internal server error'
    });
};

module.exports = { ApiError, errorHandler };
