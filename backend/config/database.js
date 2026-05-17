const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const DB_NAME = process.env.PG_DATABASE || 'mediconnect';
const DB_USER = process.env.PG_USER || 'postgres';
const DB_PASS = process.env.PG_PASSWORD || '';
const DB_HOST = process.env.PG_HOST || 'localhost';
const DB_PORT = process.env.PG_PORT || 5432;
const DB_SSL = process.env.PG_SSL === 'true';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false,
  dialectOptions: DB_SSL ? { ssl: { require: true, rejectUnauthorized: false } } : {}
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ PostgreSQL Connected');
  } catch (error) {
    console.error('❌ PostgreSQL Error:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, DataTypes, connectDB };