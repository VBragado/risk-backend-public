const { Pool } = require('pg');
require('dotenv').config();
const Sequelize = require('sequelize');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD, {
  host: process.env.PGHOST,
  dialect: 'postgres'
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  sequelize: sequelize,
  sq: sequelize
};