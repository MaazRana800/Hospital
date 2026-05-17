const Doctor = require('../models/Doctor');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// @desc    Get all doctors
// @route   GET /api/doctors
exports.getDoctors = async (req, res) => {
  try {
    const { specialty, city, search, online, minFee, maxFee, sortBy } = req.query;
    const where = {};

    if (specialty) {
      where.specialty = { [Op.iLike]: `%${specialty}%` };
    }
    if (city) {
      where.city = { [Op.iLike]: `%${city}%` };
    }
    if (online === 'true') {
      where.isOnline = true;
    }
    if (minFee || maxFee) {
      where.fee = {};
      if (minFee) where.fee[Op.gte] = Number(minFee);
      if (maxFee) where.fee[Op.lte] = Number(maxFee);
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { specialty: { [Op.iLike]: `%${search}%` } },
        { about: { [Op.iLike]: `%${search}%` } }
      ];
    }

    let order = [['rating', 'DESC'], ['reviews', 'DESC']];
    if (sortBy === 'rating') order = [['rating', 'DESC']];
    else if (sortBy === 'fee_low') order = [['fee', 'ASC']];
    else if (sortBy === 'fee_high') order = [['fee', 'DESC']];
    else if (sortBy === 'experience') order = [['experience', 'DESC']];

    const doctors = await Doctor.findAll({ where, order });

    res.json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
exports.getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, error: 'Doctor not found' });
    }
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create doctor
// @route   POST /api/doctors
exports.createDoctor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const doctor = await Doctor.create(req.body);
    res.status(201).json({ success: true, data: doctor });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, error: 'Doctor not found' });
    }

    await doctor.update(req.body);
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
exports.deleteDoctor = async (req, res) => {
  try {
    const deleted = await Doctor.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Doctor not found' });
    }

    res.json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get doctors by specialty
// @route   GET /api/doctors/specialty/:specialty
exports.getDoctorsBySpecialty = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      where: { specialty: { [Op.iLike]: `%${req.params.specialty}%` } },
      order: [['rating', 'DESC']]
    });

    res.json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Toggle doctor online status
// @route   PUT /api/doctors/:id/toggle-status
exports.toggleStatus = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, error: 'Doctor not found' });
    }

    doctor.isOnline = !doctor.isOnline;
    await doctor.save();

    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
