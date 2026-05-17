const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorsBySpecialty,
  toggleStatus
} = require('../controllers/doctorController');

router.get('/', getDoctors);
router.get('/specialty/:specialty', getDoctorsBySpecialty);
router.get('/:id', getDoctor);
router.post('/', [
  body('name').trim().notEmpty(),
  body('email').isEmail(),
  body('specialty').trim().notEmpty(),
  body('city').trim().notEmpty(),
  body('fee').isNumeric()
], createDoctor);
router.put('/:id', updateDoctor);
router.put('/:id/toggle-status', toggleStatus);
router.delete('/:id', deleteDoctor);

module.exports = router;
