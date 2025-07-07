// database/index.js
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'myfreshapp',
  password: process.env.PG_PASSWORD || '1234',
  port: process.env.PG_PORT || 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
