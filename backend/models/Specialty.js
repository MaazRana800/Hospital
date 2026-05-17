const { sequelize, DataTypes } = require('../config/database');

const Specialty = sequelize.define('Specialty', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { notEmpty: { msg: 'Name is required' } } },
  icon: { type: DataTypes.STRING, defaultValue: '🏥' },
  description: { type: DataTypes.TEXT },
  commonSymptoms: { type: DataTypes.JSONB, defaultValue: [] },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  timestamps: true,
  tableName: 'specialties'
});

module.exports = Specialty;
