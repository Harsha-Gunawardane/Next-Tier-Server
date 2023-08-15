const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "test",
  password: "125437",
  port: 5432,
});

module.exports = pool;
