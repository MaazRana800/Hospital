const { sequelize, DataTypes } = require('../config/database');

const Doctor = sequelize.define('Doctor', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Name is required' } } },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: { msg: 'Valid email is required' } } },
  phone: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
  specialty: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Specialty is required' } } },
  city: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'City is required' } } },
  experience: { type: DataTypes.INTEGER, defaultValue: 0 },
  rating: { type: DataTypes.FLOAT, defaultValue: 0, validate: { min: 0, max: 5 } },
  reviews: { type: DataTypes.INTEGER, defaultValue: 0 },
  fee: { type: DataTypes.FLOAT, allowNull: false, validate: { notNull: { msg: 'Consultation fee is required' } } },
  isOnline: { type: DataTypes.BOOLEAN, defaultValue: false },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  about: { type: DataTypes.TEXT, defaultValue: '' },
  avatar: { type: DataTypes.STRING, defaultValue: '👨' },
  qualifications: { type: DataTypes.JSONB, defaultValue: [] },
  languages: { type: DataTypes.JSONB, defaultValue: [] },
  clinicAddress: { type: DataTypes.STRING },
  availability: { type: DataTypes.JSONB, defaultValue: [] },
  education: { type: DataTypes.JSONB, defaultValue: [] }
}, {
  timestamps: true,
  tableName: 'doctors'
});

module.exports = Doctor;
