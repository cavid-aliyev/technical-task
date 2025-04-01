/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    let status = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errorCode = err.code || 'INTERNAL_ERROR';

    console.error(`[ERROR] ${status} - ${message}`, {
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query
    });

    if (errorCode === 'INSUFFICIENT_FUNDS') {
        status = 400;
        message = 'Insufficient funds for this operation';
    }

    if (err.name === 'SequelizeValidationError') {
        status = 400;
        message = err.errors.map(e => e.message).join(', ');
        errorCode = 'VALIDATION_ERROR';
    }

    if (err.name === 'SequelizeConnectionError') {
        status = 503;
        message = 'Database service unavailable';
        errorCode = 'DB_CONNECTION_ERROR';
    }

    return res.status(status).json({
        success: false,
        error: {
            code: errorCode,
            message: message
        }
    });
};

module.exports = errorHandler;
