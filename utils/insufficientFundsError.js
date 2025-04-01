/**
 * Custom error class for insufficient funds
 */
class InsufficientFundsError extends Error {
    constructor(message = 'Insufficient funds for this operation') {
        super(message);
        this.name = 'InsufficientFundsError';
        this.statusCode = 400;
        this.code = 'INSUFFICIENT_FUNDS';
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = InsufficientFundsError;
