'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            balance: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        // Add a user with balance 10000
        await queryInterface.bulkInsert('users', [{
            balance: 10000.00,
            createdAt: new Date(),
            updatedAt: new Date()
        }]);

        return Promise.resolve();
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('users');
        return Promise.resolve();
    }
};
