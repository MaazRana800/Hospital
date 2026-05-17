const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// Get patient appointments by phone
router.get('/appointments/:phone', async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { patientPhone: req.params.phone },
      include: [{ model: Doctor, as: 'doctor', attributes: ['name', 'specialty', 'fee', 'avatar'] }],
      order: [['date', 'DESC'], ['time', 'ASC']]
    });

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
