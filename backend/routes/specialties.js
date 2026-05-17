const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Specialty = require('../models/Specialty');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// Get all specialties with doctor counts
router.get('/', async (req, res) => {
  try {
    const specialtyCounts = await Doctor.findAll({
      attributes: ['specialty', [sequelize.fn('COUNT', sequelize.col('specialty')), 'count']],
      group: ['specialty'],
      order: [[sequelize.literal('count'), 'DESC']]
    });

    const specialties = await Specialty.findAll({ where: { isActive: true } });

    const result = specialtyCounts.map((s) => {
      const specialtyName = s.get('specialty');
      const specialty = specialties.find((sp) => sp.name.toLowerCase() === specialtyName.toLowerCase());
      return {
        name: specialtyName,
        count: Number(s.get('count')),
        icon: specialty?.icon || '🏥',
        description: specialty?.description || ''
      };
    });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single specialty
router.get('/:name', async (req, res) => {
  try {
    const specialty = await Specialty.findOne({
      where: { name: { [Op.iLike]: `%${req.params.name}%` } }
    });

    const doctors = await Doctor.findAll({
      where: { specialty: { [Op.iLike]: `%${req.params.name}%` } },
      order: [['rating', 'DESC']],
      limit: 5
    });

    res.json({
      success: true,
      specialty,
      doctorsCount: doctors.length,
      doctors
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
