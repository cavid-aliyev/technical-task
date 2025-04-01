const userService = require('../services/userService');

/**
 * Controller for user-related operations
 */
class UserController {
    /**
     * Get user by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async getUser(req, res, next) {
        try {
            const userId = parseInt(req.params.userId);

            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_USER_ID',
                        message: 'User ID must be a valid number'
                    }
                });
            }

            const user = await userService.getUserById(userId);

            return res.status(200).json({
                success: true,
                data: {
                    id: user.id,
                    balance: user.balance
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update user balance
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async updateBalance(req, res, next) {
        try {
            const userId = parseInt(req.params.userId);
            const amount = parseFloat(req.body.amount);

            // Validate inputs
            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_USER_ID',
                        message: 'User ID must be a valid number'
                    }
                });
            }

            if (isNaN(amount)) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_AMOUNT',
                        message: 'Amount must be a valid number'
                    }
                });
            }

            const updatedUser = await userService.updateBalance(userId, amount);

            return res.status(200).json({
                success: true,
                data: {
                    id: updatedUser.id,
                    balance: updatedUser.balance,
                    previousBalance: parseFloat(updatedUser.balance) - amount,
                    amount: amount
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
