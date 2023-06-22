const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'test_login',
    password: 'Hara9914@',
    port: 5432
});

module.exports = pool;