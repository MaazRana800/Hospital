const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { Op } = require('sequelize');

// @desc    Create appointment
// @route   POST /api/appointments
exports.createAppointment = async (req, res) => {
  try {
    const { patientName, patientPhone, patientEmail, doctor, date, time, type, symptoms, fee } = req.body;

    const existingAppointment = await Appointment.findOne({
      where: {
        doctorId: doctor,
        date,
        time,
        status: { [Op.notIn]: ['cancelled', 'no-show'] }
      }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        error: 'This time slot is already booked. Please choose another time.'
      });
    }

    const doctorData = await Doctor.findByPk(doctor);
    if (!doctorData) {
      return res.status(404).json({ success: false, error: 'Doctor not found' });
    }

    const appointment = await Appointment.create({
      patientName,
      patientPhone,
      patientEmail,
      doctorId: doctor,
      date,
      time,
      type: type || 'video',
      symptoms: symptoms || '',
      fee: fee || doctorData.fee
    });

    const populated = await Appointment.findByPk(appointment.id, {
      include: [{ model: Doctor, as: 'doctor', attributes: ['name', 'specialty', 'fee'] }]
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully! Confirmation will be sent via SMS.',
      data: populated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all appointments
// @route   GET /api/appointments
exports.getAppointments = async (req, res) => {
  try {
    const { phone, doctorId, status, date } = req.query;
    const where = {};

    if (phone) where.patientPhone = phone;
    if (doctorId) where.doctorId = doctorId;
    if (status) where.status = status;
    if (date) where.date = date;

    const appointments = await Appointment.findAll({
      where,
      include: [{ model: Doctor, as: 'doctor', attributes: ['name', 'specialty', 'fee', 'avatar'] }],
      order: [['date', 'DESC'], ['time', 'ASC']]
    });

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [{ model: Doctor, as: 'doctor', attributes: ['name', 'specialty', 'fee', 'phone', 'clinicAddress'] }]
    });

    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }

    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }

    await appointment.update(req.body);

    const updated = await Appointment.findByPk(appointment.id, {
      include: [{ model: Doctor, as: 'doctor', attributes: ['name', 'specialty'] }]
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }

    await appointment.update({ status: 'cancelled' });
    res.json({ success: true, message: 'Appointment cancelled successfully', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Add review to appointment
// @route   PUT /api/appointments/:id/review
exports.addReview = async (req, res) => {
  try {
    const { rating, review } = req.body;

    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }

    await appointment.update({ rating, review });

    const doctorAppointments = await Appointment.findAll({
      where: {
        doctorId: appointment.doctorId,
        rating: { [Op.ne]: null }
      }
    });

    const avgRating = doctorAppointments.reduce((sum, a) => sum + a.rating, 0) / doctorAppointments.length;

    await Doctor.update(
      { rating: Math.round(avgRating * 10) / 10, reviews: doctorAppointments.length },
      { where: { id: appointment.doctorId } }
    );

    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
