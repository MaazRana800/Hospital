const bcrypt = require('bcryptjs');
const { sequelize, DataTypes } = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Name is required' } } },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: { msg: 'Valid email is required' } } },
  phone: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { notEmpty: { msg: 'Phone is required' } } },
  password: { type: DataTypes.STRING, allowNull: false, validate: { len: { args: [6, 100], msg: 'Password must be at least 6 characters' } } },
  role: { type: DataTypes.ENUM('patient', 'doctor', 'admin'), defaultValue: 'patient' },
  city: { type: DataTypes.STRING },
  avatar: { type: DataTypes.STRING, defaultValue: '' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  healthRecords: { type: DataTypes.JSONB, defaultValue: [] }
}, {
  timestamps: true,
  tableName: 'users'
});

User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = User;
