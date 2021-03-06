const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        dialect: 'sqlite',
        storage: './db.development.sqlite',
        jwtSecret: 'test',
        maxImageSize: 2000000,
    },
    test: {
        dialect: 'sqlite',
        storage: ':memory:'
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOSTNAME,
        jwtSecret: process.env.JWT_SECRET,
        dialect: 'mysql',
        maxImageSize: 2000000,
    }
};

module.exports = config[env];