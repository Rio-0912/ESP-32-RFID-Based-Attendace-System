# Attendify - Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- MySQL 8+ running on localhost:3306
- pnpm installed (`npm install -g pnpm`)

## Setup (First Time)

### 1. Database Setup
```bash
# Start MySQL (if not running)
# Import the database schema
mysql -u root -p < exp/seed.sql
```

### 2. Backend Setup
```bash
cd exp
npm install
```

### 3. Frontend Setup
```bash
cd esp-front
pnpm install
```

### 4. Environment Variables
Create `.env` in `esp-front/`:
```env
NEXT_PUBLIC_SERVER=http://localhost:3002
```

## Daily Development

### Start Backend (Terminal 1)
```bash
cd exp
npm start
```
Server runs on: http://localhost:3002

### Start Frontend (Terminal 2)
```bash
cd esp-front
pnpm dev
```
App runs on: http://localhost:3000

## Test Login
Use credentials from `exp/seed.sql`:
- Email: `oprio0912@gmail.com`
- Password: `123`

OR

- Email: `rehanansari0912@gmail.com`
- Password: `123`

## Project Structure
```
esp32/
├── exp/                          # Backend (Node.js/Express)
│   ├── controllers/
│   │   ├── dashboard.js         # Dashboard stats API
│   │   ├── calendar.js          # Calendar events API
│   │   ├── lectures.js          # Lecture analytics API
│   │   └── login.js             # Login authentication
│   ├── db.js                    # MySQL connection
│   ├── server.js                # Main server file
│   └── seed.sql                 # Database schema
│
├── esp-front/                    # Frontend (Next.js)
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/       # Dashboard page
│   │   │   ├── calendar/        # Calendar page
│   │   │   ├── lectures/        # Lectures page
│   │   │   └── login/           # Login page
│   │   └── components/
│   │       ├── app-sidebar.jsx  # Main navigation
│   │       └── ui/              # UI components
│   └── .env                     # Environment variables
│
└── main.py                       # ESP32 firmware
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | User authentication |
| GET | `/dashboard?uid={uid}` | Dashboard statistics |
| GET | `/calendar?uid={uid}` | Calendar events |
| GET | `/lectures?uid={uid}` | Lecture analytics |
| POST | `/data` | RFID card data from ESP32 |

## Common Issues

### Frontend can't connect to backend
- Check `.env` file has correct `NEXT_PUBLIC_SERVER` value
- Ensure backend is running on port 3002
- Check CORS is enabled in `exp/server.js`

### Database connection error
- Verify MySQL is running
- Check credentials in `exp/db.js`
- Ensure `IOT` database exists

### Missing dependencies
```bash
# Backend
cd exp && npm install

# Frontend
cd esp-front && pnpm install
```

## Linting
```bash
cd esp-front
pnpm lint
```

## Build for Production
```bash
cd esp-front
pnpm build
pnpm start  # Runs production build
```

## Key Features Implemented
✅ Toast notifications on login  
✅ Dashboard with attendance analytics  
✅ Interactive calendar with status colors  
✅ Per-subject attendance breakdown  
✅ Responsive design for all devices  
✅ Modern GenZ aesthetic  

## Next Steps
- [ ] Add JWT authentication
- [ ] Implement password hashing
- [ ] Add profile editing
- [ ] Export attendance reports
- [ ] Email notifications
- [ ] Dark mode toggle
