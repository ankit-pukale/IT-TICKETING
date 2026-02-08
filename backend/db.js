const { Pool } = require('pg');

const pool = new Pool({
  host: 'NEOLAP',
  user: 'postgres',
  password: 'Neo@32110',
  database: 'it_ticketing',
  port: 5432
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL error', err);
});

module.exports = pool;
