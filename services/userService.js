const { User, sequelize } = require('../models');
const InsufficientFundsError = require('../utils/insufficientFundsError');

class UserService {
    /**
     * Get a user by ID
     * @param {number} userId - User ID
     * @returns {Promise<Object>} - User object
     */
    async getUserById(userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            error.code = 'USER_NOT_FOUND';
            throw error;
        }
        return user;
    }

    /**
     * Update user balance
     * @param {number} userId - User ID
     * @param {number} amount - Amount to add (positive) or subtract (negative)
     * @returns {Promise<Object>} - Updated user object
     */
    async updateBalance(userId, amount) {
        const transaction = await sequelize.transaction();

        try {
            const user = await User.findByPk(userId, {
                lock: transaction.LOCK.UPDATE,
                transaction
            });

            if (!user) {
                await transaction.rollback();
                const error = new Error('User not found');
                error.statusCode = 404;
                error.code = 'USER_NOT_FOUND';
                throw error;
            }

            const newBalance = parseFloat(user.balance) + parseFloat(amount);

            if (newBalance < 0) {
                await transaction.rollback();
                throw new InsufficientFundsError();
            }

            user.balance = newBalance;
            await user.save({ transaction });

            await transaction.commit();

            return user;
        } catch (error) {
            if (transaction) await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new UserService();
