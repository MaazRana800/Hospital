const { sequelize, DataTypes } = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  patientName: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Patient name is required' } } },
  patientPhone: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Patient phone is required' } } },
  patientEmail: { type: DataTypes.STRING, validate: { isEmail: { msg: 'Valid email is required' } } },
  doctorId: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false, validate: { notEmpty: { msg: 'Date is required' } } },
  time: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Time is required' } } },
  type: { type: DataTypes.ENUM('video', 'clinic', 'home'), defaultValue: 'video' },
  symptoms: { type: DataTypes.TEXT, defaultValue: '' },
  status: { type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no-show'), defaultValue: 'pending' },
  fee: { type: DataTypes.FLOAT },
  paymentStatus: { type: DataTypes.ENUM('pending', 'paid', 'refunded'), defaultValue: 'pending' },
  prescription: { type: DataTypes.TEXT },
  notes: { type: DataTypes.TEXT },
  rating: { type: DataTypes.FLOAT, validate: { min: 1, max: 5 } },
  review: { type: DataTypes.TEXT }
}, {
  timestamps: true,
  tableName: 'appointments',
  indexes: [
    { fields: ['doctorId', 'date', 'time'] },
    { fields: ['patientPhone'] }
  ]
});

module.exports = Appointment;
