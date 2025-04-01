'use strict';

require('dotenv').config();
const path = require('path');
const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/database')[env];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        logging: config.logging
    }
);

const umzug = new Umzug({
    migrations: {
        path: path.join(__dirname, './'),
        pattern: /^\d+[\w-]+\.js$/,
        params: [
            sequelize.getQueryInterface(),
            sequelize.constructor
        ]
    },
    storage: new SequelizeStorage({ sequelize }),
    logger: console
});

const runMigrations = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to database successfully.');

        // Run migrations
        const migrations = await umzug.up();
        console.log('Migrations executed successfully:', migrations.map(m => m.name));

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        await sequelize.close();
        process.exit(1);
    }
};

if (require.main === module) {
    runMigrations();
}

module.exports = { umzug, runMigrations };
