# PostgreSQL Migration Guide — MediConnect Backend

## 🎯 Migration Summary
Successfully migrated **MediConnect** backend from **MongoDB + Mongoose** to **PostgreSQL + Sequelize**.

### What Changed
| Layer | Before | After |
|-------|--------|-------|
| Database | MongoDB | PostgreSQL |
| ORM | Mongoose | Sequelize 6 |
| Models | Schema-based | DataTypes-based |
| Queries | MongoDB operators (`$in`, `$regex`) | Sequelize operators (`Op.*`) |
| Relationships | `.populate()` | `.include()` associations |

---

## 📋 Prerequisites

1. **PostgreSQL** installed and running
   - Download: https://www.postgresql.org/download/
   - Default: `localhost:5432` / user: `postgres`

2. **Create database** (optional, auto-created on first sync):
   ```sql
   CREATE DATABASE mediconnect;
   ```

3. **Node.js 16+** and npm

---

## 🚀 Quick Start (Local Development)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

All required packages are in `package.json`:
- `sequelize`, `pg`, `pg-hstore` (PostgreSQL)
- `express`, `cors`, `bcryptjs`, `jsonwebtoken`

### Step 2: Configure PostgreSQL Connection
Edit `.env` in the `backend` folder:
```env
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=      # Leave blank if no password set
PG_DATABASE=mediconnect
JWT_SECRET=your_secret_key_here
```

**Note:** If using a different PostgreSQL user or password, update accordingly.

### Step 3: Seed Database (Sample Data)
```bash
npm run seed
```
This will:
- Create all tables automatically (via Sequelize sync)
- Insert 16 specialties
- Insert 6 sample doctors with full profiles

### Step 4: Start Backend Server
```bash
npm run dev
```
Expected output:
```
✅ PostgreSQL Connected
✅ Server running on http://localhost:5000
```

### Step 5: Test Frontend
Open browser: **http://localhost:5000**

---

## 🔧 Environment Configuration

### `.env` Variables
```bash
# PostgreSQL
PG_HOST=localhost          # Server hostname
PG_PORT=5432              # Server port
PG_USER=postgres          # Database user
PG_PASSWORD=              # Database password
PG_DATABASE=mediconnect   # Database name
PG_SSL=false              # SSL (set true for remote/production)

# JWT
JWT_SECRET=your_secret    # Keep this private!
JWT_EXPIRE=30d            # Token expiration

# Server
PORT=5000                 # Server port
NODE_ENV=development      # development/production
```

---

## 📦 Project Structure

```
backend/
├── config/
│   └── database.js          # Sequelize config + connectDB()
├── models/
│   ├── index.js            # Model associations (Doctor↔Appointment)
│   ├── User.js             # User model + password hashing
│   ├── Doctor.js           # Doctor profile
│   ├── Specialty.js        # Medical specialties
│   └── Appointment.js      # Appointments + indexes
├── controllers/
│   ├── authController.js   # Register/Login
│   ├── doctorController.js # CRUD doctors
│   └── appointmentController.js  # Appointments & reviews
├── routes/
│   ├── auth.js
│   ├── doctors.js
│   ├── appointments.js
│   ├── specialties.js
│   ├── symptoms.js         # ✅ Converted to Sequelize
│   └── patients.js         # ✅ Converted to Sequelize
├── middleware/
│   ├── auth.js             # JWT protect middleware
│   └── errorHandler.js     # ✅ Handles Sequelize errors
├── server.js               # Express app
├── seed.js                 # ✅ PostgreSQL seeder
├── package.json
├── .env
└── .env.example
```

---

## 🔄 API Endpoints (All Working)

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login user (returns JWT)
- `GET /api/auth/me` — Get current user (requires token)

### Doctors
- `GET /api/doctors` — Get all doctors (filters: specialty, city, search, online, minFee, maxFee, sortBy)
- `GET /api/doctors/:id` — Get single doctor
- `GET /api/doctors/specialty/:specialty` — Get doctors by specialty
- `POST /api/doctors` — Create doctor
- `PUT /api/doctors/:id` — Update doctor
- `PUT /api/doctors/:id/toggle-status` — Toggle online status
- `DELETE /api/doctors/:id` — Delete doctor

### Appointments
- `POST /api/appointments` — Book appointment (checks slot availability)
- `GET /api/appointments` — List appointments (filters: phone, doctorId, status, date)
- `GET /api/appointments/:id` — Get single appointment
- `PUT /api/appointments/:id` — Update appointment
- `PUT /api/appointments/:id/cancel` — Cancel appointment
- `PUT /api/appointments/:id/review` — Add review & rating

### Specialties
- `GET /api/specialties` — Get all specialties with doctor counts

### Symptoms & Diagnosis
- `GET /api/symptoms` — Get symptom list
- `POST /api/symptoms/analyze` — Recommend specialists by symptoms

### Patients
- `GET /api/patients/appointments/:phone` — Get patient's appointments

---

## ✅ Key Features Implemented

### Models
✅ **User**
- Email/phone unique constraints
- Password hashing with bcrypt
- Roles: patient, doctor, admin
- Health records (JSONB)

✅ **Doctor**
- Specialty + location filtering
- Rating & review counts
- Qualifications, languages (JSONB arrays)
- Clinic address & availability
- Online status toggle

✅ **Appointment**
- Doctor-Appointment relationship
- Slot conflict detection
- Status workflow: pending → confirmed → completed
- Review & rating system
- Indexes on doctorId, date, patientPhone

✅ **Specialty**
- Icon & description
- Common symptoms (JSONB)
- Active toggle

### Smart Query Features
- Case-insensitive search (ILIKE)
- Cost range filtering (minFee, maxFee)
- Sorting: rating, experience, fee
- Date range appointments
- Automatic doctor rating updates after reviews

### Error Handling
✅ Sequelize-specific error handling:
- `UniqueConstraintError` → 400 (duplicate email/phone)
- `ValidationError` → 400 (validation messages)
- Generic errors → 500

---

## 🐛 Troubleshooting

### **"SequelizeConnectionError: connect ECONNREFUSED"**
PostgreSQL is not running.
```bash
# Windows (Services)
# Start PostgreSQL service in Services app, OR

# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### **"error: role "postgres" does not exist"**
Create the user:
```sql
-- Login as default in PostgreSQL
CREATE USER postgres WITH PASSWORD 'your_password';
ALTER USER postgres CREATEDB;
```

### **"relation "users" does not exist"**
Run seed script to create tables and seed data:
```bash
npm run seed
```

### **Port already in use (3000, 5000)**
Change PORT in `.env`:
```env
PORT=5001
```

### **JWT token errors**
Ensure `JWT_SECRET` is set in `.env` and matches between server and API calls.

---

## 📊 Database Schema

### users
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | PK, auto-increment |
| name | STRING | Not null |
| email | STRING | Unique, validated |
| phone | STRING | Unique |
| password | STRING | Hashed bcrypt |
| role | ENUM | patient/doctor/admin |
| city | STRING | Optional |
| avatar | STRING | Avatar URL |
| isActive | BOOLEAN | Default: true |
| healthRecords | JSONB | Array of records |
| createdAt/updatedAt | DATE | Timestamps |

### doctors
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | PK |
| name | STRING | Unique email |
| specialty | STRING | For filtering |
| city | STRING | Location |
| experience | INTEGER | Years |
| rating | FLOAT | 0–5 |
| reviews | INTEGER | Count |
| fee | FLOAT | Consultation fee |
| isOnline | BOOLEAN | Availability |
| qualifications | JSONB | Array |
| languages | JSONB | Array |
| availability | JSONB | Schedule |
| createdAt/updatedAt | DATE | Timestamps |

### appointments
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | PK |
| patientName | STRING | Required |
| patientPhone | STRING | For filtering |
| doctorId | INTEGER | FK → doctors |
| date | DATEONLY | Appointment date |
| time | STRING | Time slot |
| type | ENUM | video/clinic/home |
| status | ENUM | pending/confirmed/completed/cancelled |
| rating | FLOAT | 1–5 (optional) |
| review | TEXT | After completion |
| createdAt/updatedAt | DATE | Timestamps |

---

## 🚀 Production Deployment

### Recommended Services
- **Database:** Railway, AWS RDS, Digital Ocean, AWS Aurora
- **Backend:** Render, Railway, Heroku, AWS EC2

### Pre-Deployment Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Enable `PG_SSL=true` for remote databases
- [ ] Add CORS whitelist for frontend domain
- [ ] Set up environment variables securely
- [ ] Run database backups

### Example: Railway (postgres + Node.js)
1. Deploy backend → Railway
2. Auto-generate `DATABASE_URL`
3. Set environment variables
4. Connection string: `postgresql://user:pass@host:5432/mediconnect`

---

## 📝 Notes & Improvements

### Schema Enhancements (Future)
- Add `phoneVerifiedAt` for SMS OTP
- Add `emailVerifiedAt` for email confirmation
- Add `twoFactorEnabled` for security
- Add `prescriptions` table linked to appointments
- Add `medicalHistory` table for patient records

### Performance Optimizations (Done)
✅ Indexed: doctorId, date, time (appointments)
✅ Indexed: patientPhone (appointments)
✅ JSONB for flexible extra data (qualifications, languages)
✅ Query select attributes to minimize payload

### Next Steps
- [ ] Add email/SMS notifications on appointment booking
- [ ] Implement video call integration (Agora/Twilio)
- [ ] Add payment gateway (Stripe/JazzCash)
- [ ] Implement doctor availability scheduling system
- [ ] Add file uploads for prescriptions (AWS S3/Multer)

---

## 📞 Support

For issues or questions:
1. Check `.env` configuration
2. Verify PostgreSQL is running
3. Review error logs in terminal output
4. Confirm database: `\l` (in psql)
5. Test seeding: `npm run seed`

---

**Happy coding! 🚀**
