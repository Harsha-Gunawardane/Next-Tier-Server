const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: 'munzimmf0224',
    port: 5432
});

module.exports = pool;