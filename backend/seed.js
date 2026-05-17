const { sequelize } = require('./config/database');
const Doctor = require('./models/Doctor');
const Specialty = require('./models/Specialty');
require('dotenv').config();

const specialties = [
  { name: 'Cardiologist', icon: '❤️', description: 'Heart and cardiovascular system specialist' },
  { name: 'Dermatologist', icon: '🩹', description: 'Skin, hair, and nail specialist' },
  { name: 'Gynecologist', icon: '👩', description: 'Women's reproductive health specialist' },
  { name: 'Orthopedic', icon: '🦴', description: 'Bone and joint specialist' },
  { name: 'Neurologist', icon: '🧠', description: 'Brain and nervous system specialist' },
  { name: 'Pediatrician', icon: '👶', description: 'Child health specialist' },
  { name: 'Psychiatrist', icon: '🧘', description: 'Mental health specialist' },
  { name: 'ENT Specialist', icon: '👂', description: 'Ear, nose, and throat specialist' },
  { name: 'Dentist', icon: '🦷', description: 'Dental care specialist' },
  { name: 'Nutritionist', icon: '🥗', description: 'Diet and nutrition specialist' },
  { name: 'Urologist', icon: '🔬', description: 'Urinary system specialist' },
  { name: 'Oncologist', icon: '🎗️', description: 'Cancer specialist' },
  { name: 'Endocrinologist', icon: '⚗️', description: 'Hormone and gland specialist' },
  { name: 'Pulmonologist', icon: '🫁', description: 'Lung and respiratory specialist' },
  { name: 'Ophthalmologist', icon: '👁️', description: 'Eye specialist' },
  { name: 'General Physician', icon: '🩺', description: 'General medicine practitioner' }
];

const doctors = [
  {
    name: 'Dr. Ahmed Khan',
    email: 'dr.ahmed@mediconnect.com',
    specialty: 'Cardiologist',
    city: 'Lahore',
    experience: 18,
    rating: 4.9,
    reviews: 342,
    fee: 2500,
    isOnline: true,
    isVerified: true,
    about: 'Senior Cardiologist at Shaukat Khanum Hospital. Specializes in interventional cardiology and heart failure management.',
    qualifications: ['MBBS', 'FCPS (Cardiology)', 'FACC'],
    languages: ['English', 'Urdu', 'Punjabi'],
    clinicAddress: 'Shaukat Khanum Hospital, Lahore'
  },
  {
    name: 'Dr. Sarah Ali',
    email: 'dr.sarah@mediconnect.com',
    specialty: 'Dermatologist',
    city: 'Karachi',
    experience: 12,
    rating: 4.8,
    reviews: 528,
    fee: 2000,
    isOnline: true,
    isVerified: true,
    about: 'Expert in cosmetic dermatology, acne treatment, and laser procedures. Former consultant at Aga Khan University Hospital.',
    qualifications: ['MBBS', 'MCPS (Dermatology)'],
    languages: ['English', 'Urdu'],
    clinicAddress: 'Clifton, Karachi'
  },
  {
    name: 'Dr. Usman Farooq',
    email: 'dr.usman@mediconnect.com',
    specialty: 'Orthopedic',
    city: 'Islamabad',
    experience: 15,
    rating: 4.7,
    reviews: 289,
    fee: 3000,
    isOnline: false,
    isVerified: true,
    about: 'Joint replacement specialist with expertise in minimally invasive arthroscopic surgery. 15+ years experience.',
    qualifications: ['MBBS', 'FCPS (Orthopedics)', 'MRCS'],
    languages: ['English', 'Urdu', 'Pashto'],
    clinicAddress: 'F-8 Markaz, Islamabad'
  },
  {
    name: 'Dr. Ayesha Malik',
    email: 'dr.ayesha@mediconnect.com',
    specialty: 'Gynecologist',
    city: 'Lahore',
    experience: 14,
    rating: 4.9,
    reviews: 612,
    fee: 2200,
    isOnline: true,
    isVerified: true,
    about: 'High-risk pregnancy specialist and fertility expert. Dedicated to women's health and reproductive medicine.',
    qualifications: ['MBBS', 'FCPS (Gynecology)', 'MRCOG'],
    languages: ['English', 'Urdu', 'Punjabi'],
    clinicAddress: 'Johar Town, Lahore'
  },
  {
    name: 'Dr. Hassan Raza',
    email: 'dr.hassan@mediconnect.com',
    specialty: 'Neurologist',
    city: 'Karachi',
    experience: 20,
    rating: 4.8,
    reviews: 198,
    fee: 3500,
    isOnline: true,
    isVerified: true,
    about: 'Neurology expert specializing in stroke management, epilepsy, and movement disorders. Published researcher.',
    qualifications: ['MBBS', 'FCPS (Neurology)', 'MRCP'],
    languages: ['English', 'Urdu'],
    clinicAddress: 'DHA Phase 6, Karachi'
  },
  {
    name: 'Dr. Maria Iqbal',
    email: 'dr.maria@mediconnect.com',
    specialty: 'Pediatrician',
    city: 'Rawalpindi',
    experience: 10,
    rating: 4.9,
    reviews: 445,
    fee: 1800,
    isOnline: true,
    isVerified: true,
    about: 'Child health specialist with focus on developmental pediatrics and childhood nutrition. Loved by young patients!',
    qualifications: ['MBBS', 'FCPS (Pediatrics)'],
    languages: ['English', 'Urdu', 'Punjabi'],
    clinicAddress: 'Saddar, Rawalpindi'
  }
];

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('✅ PostgreSQL connected');

    // Clear existing data
    await Doctor.destroy({ where: {}, truncate: true, cascade: true });
    await Specialty.destroy({ where: {}, truncate: true, cascade: true });
    console.log('Cleared existing data');

    // Insert specialties
    await Specialty.bulkCreate(specialties);
    console.log(`✅ Inserted ${specialties.length} specialties`);

    // Insert doctors
    await Doctor.bulkCreate(doctors);
    console.log(`✅ Inserted ${doctors.length} doctors`);

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
