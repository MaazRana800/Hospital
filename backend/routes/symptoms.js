const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Doctor = require('../models/Doctor');

// Symptom to specialty mapping
const symptomMap = {
  'chest-pain': ['Cardiologist', 'Pulmonologist', 'General Physician'],
  'headache': ['Neurologist', 'General Physician'],
  'fever': ['General Physician', 'Infectious Disease'],
  'skin-rash': ['Dermatologist'],
  'joint-pain': ['Orthopedic', 'Rheumatologist'],
  'stomach-pain': ['Gastroenterologist', 'General Physician'],
  'breathing': ['Pulmonologist', 'Cardiologist', 'ENT Specialist'],
  'depression': ['Psychiatrist', 'Psychologist'],
  'pregnancy': ['Gynecologist'],
  'child-fever': ['Pediatrician', 'General Physician'],
  'eye-problem': ['Ophthalmologist'],
  'tooth-pain': ['Dentist'],
  'diabetes': ['Endocrinologist', 'General Physician'],
  'thyroid': ['Endocrinologist'],
  'urinary': ['Urologist', 'Nephrologist'],
  'ear-pain': ['ENT Specialist'],
  'weight-loss': ['Nutritionist', 'Endocrinologist'],
  'cancer': ['Oncologist']
};

// Get all symptoms
router.get('/', (req, res) => {
  const symptoms = Object.entries(symptomMap).map(([id, specialists]) => ({
    id,
    name: id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    specialists
  }));

  res.json({ success: true, data: symptoms });
});

// Analyze symptoms and recommend specialists
router.post('/analyze', async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide at least one symptom' 
      });
    }

    const recommendedSpecialists = new Set();
    symptoms.forEach(symptomId => {
      const specialists = symptomMap[symptomId];
      if (specialists) {
        specialists.forEach(s => recommendedSpecialists.add(s));
      }
    });

    // Get doctors for recommended specialties
    const doctors = await Doctor.findAll({
      where: { specialty: { [Op.in]: Array.from(recommendedSpecialists) } },
      order: [['rating', 'DESC']],
      limit: 10
    });

    res.json({
      success: true,
      recommendedSpecialists: Array.from(recommendedSpecialists),
      doctorsFound: doctors.length,
      doctors
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
