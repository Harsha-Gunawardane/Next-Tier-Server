const Pool = require("pg").Pool;

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "test",
//   password: "125437",
//   port: 5432,
// });

const pool = new Pool({
  user: "Harsha-Gunawardane",
  host: "ep-ancient-bush-22062538.ap-southeast-1.aws.neon.tech",
  database: "next-tier-db",
  password: "V3EOfZXR6LxI",
  port: 5432,
});

// postgres://Harsha-Gunawardane:V3EOfZXR6LxI@ep-ancient-bush-22062538.ap-southeast-1.aws.neon.tech/next-tier-db

module.exports = pool;
// postgres://Harsha-Gunawardane:V3EOfZXR6LxI@ep-ancient-bush-22062538.ap-southeast-1.aws.neon.tech/next-tier-db

// postgres://Harsha-Gunawardane:V3EOfZXR6LxI@ep-ancient-bush-22062538-pooler.ap-southeast-1.aws.neon.tech/next-tier-db