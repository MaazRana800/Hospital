# 🏥 MediConnect - Healthcare Platform

Pakistan's most advanced healthcare platform connecting patients with verified doctors.

## Features

- ✅ Find & book verified doctors
- ✅ Video consultations
- ✅ Symptom checker with AI recommendations
- ✅ Online medicine delivery
- ✅ Lab test bookings
- ✅ Digital health records

## Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

1. **Clone and navigate:**
```bash
cd mediconnect/backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Seed the database:**
```bash
npm run seed
```

5. **Start the server:**
```bash
npm run dev
```

6. **Open in browser:**
```
http://localhost:5000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/doctors | Get all doctors (with filters) |
| GET | /api/doctors/:id | Get single doctor |
| POST | /api/doctors | Create doctor |
| POST | /api/appointments | Book appointment |
| GET | /api/appointments | Get appointments |
| GET | /api/specialties | Get all specialties |
| POST | /api/symptoms/analyze | Analyze symptoms |
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |

## Project Structure

```
mediconnect/
├── frontend/           # HTML/CSS/JS files
│   ├── index.html
│   ├── css/
│   └── js/
└── backend/            # Node.js/Express API
    ├── server.js
    ├── models/
    ├── routes/
    ├── controllers/
    └── middleware/
```

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mediconnect
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
```

## Technologies

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT
- **Validation:** express-validator

## License

MIT License - feel free to use for your projects!
