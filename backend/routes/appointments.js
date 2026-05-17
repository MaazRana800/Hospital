const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  cancelAppointment,
  addReview
} = require('../controllers/appointmentController');

router.post('/', [
  body('patientName').trim().notEmpty(),
  body('patientPhone').trim().notEmpty(),
  body('doctor').notEmpty(),
  body('date').notEmpty(),
  body('time').notEmpty()
], createAppointment);

router.get('/', getAppointments);
router.get('/:id', getAppointment);
router.put('/:id', updateAppointment);
router.put('/:id/cancel', cancelAppointment);
router.put('/:id/review', addReview);

module.exports = router;
