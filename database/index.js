// database/index.js
const { Pool } = require('pg');

// if(process.env) {
//   console.log('process.env = ' + process.env)
//   console.log('NODE_ENV = ' + process.env.NODE_ENV);
//   if(process.env.NODE_ENV) {
//     console.log('rocess.env.NODE_ENV = ' + process.env.NODE_ENV)
//   }
// }


const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'myfreshapp',
  password: process.env.PG_PASSWORD || '1234',
  port: process.env.PG_PORT || 5432,

  // Below for Development Local PC Database
  // ssl: false,  // Disable SSL

  // Below for Production when commit
  ssl: {
    rejectUnauthorized: false, // required for DO SSL
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
