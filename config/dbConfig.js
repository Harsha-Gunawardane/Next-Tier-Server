const Pool = require("pg").Pool;

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "test",
//   password: "",
//   port: 5432,
// });

const pool = new Pool({
  user: "Harsha-Gunawardane",
  host: "",
  database: "next-tier-db",
  password: "",
  port: 5432,
});

module.exports = pool;
