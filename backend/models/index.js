const User = require('./User');
const Doctor = require('./Doctor');
const Specialty = require('./Specialty');
const Appointment = require('./Appointment');

Doctor.hasMany(Appointment, { foreignKey: 'doctorId', as: 'appointments' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

module.exports = { User, Doctor, Specialty, Appointment };