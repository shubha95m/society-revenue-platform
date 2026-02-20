# 🚀 Startup Guide - Society Revenue Platform

## Prerequisites
- Docker Desktop running
- Node.js installed
- Terminal access

---

## Step-by-Step Startup Process

### 1️⃣ Start Docker Services

```bash
# Start Docker Desktop first (manually)

# Then start PostgreSQL, Redis, and PgAdmin
docker-compose up -d

# Verify services are running
docker-compose ps
```

**Expected Output:**
```
NAME                    STATUS
postgres                Up
redis                   Up
pgadmin                 Up
```

---

### 2️⃣ Create Platform Admin User

```bash
# Run the seed script to create admin user
cd backend
npx tsx scripts/seed-admin.ts
```

**Expected Output:**
```
✅ Platform admin created successfully!

📧 Login Credentials:
   Email: admin@societyrevenue.com
   Password: Admin@123456
   Role: platform_admin
   ID: <uuid>

🔗 Login URL: http://localhost:3000/login
```

**Save these credentials - you'll need them to login!**

---

### 3️⃣ Start Backend Server

```bash
# From the backend directory
cd backend
npm run dev
```

**Expected Output:**
```
╔════════════════════════════════════════════════════════╗
║  Society Revenue Platform - Backend API Server       ║
╠════════════════════════════════════════════════════════╣
║  Status: Running                                       ║
║  Port: 4000                                            ║
║  Environment: development                              ║
║  API Base: http://localhost:4000/api                   ║
║  Health Check: http://localhost:4000/health            ║
╚════════════════════════════════════════════════════════╝
```

**Keep this terminal open!**

---

### 4️⃣ Start Frontend Server

```bash
# Open a NEW terminal window
cd frontend
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

**Keep this terminal open too!**

---

## 🧪 Testing the Integration

### Test 1: Backend Health Check
```bash
curl http://localhost:4000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2026-02-20T...",
  "database": "connected"
}
```

### Test 2: Login via API
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@societyrevenue.com",
    "password": "Admin@123456"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "admin@societyrevenue.com",
      "name": "Platform Admin",
      "role": "platform_admin"
    },
    "session": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### Test 3: Login via Frontend
1. Open browser: http://localhost:3000/login
2. Enter credentials:
   - **Email:** admin@societyrevenue.com
   - **Password:** Admin@123456
3. Click "Sign In"
4. Should redirect to platform admin dashboard

---

## 🎯 Next Steps After Login

### For Platform Admin
After logging in as platform admin, you'll need to:
1. Create a test society (via frontend registration)
2. Approve the society
3. The society admin can then login and manage their society

### Creating Test Users from Frontend

#### 1. Society Admin (via Frontend)
1. Go to: http://localhost:3000/register
2. Select "Register as Society"
3. Fill in society details:
   - Society Name: Green Valley Apartments
   - Email: society@example.com
   - Password: Society@123
   - Total Units: 300
   - Address, City, State, etc.
4. Submit registration
5. Platform admin needs to approve (TODO: implement approval flow)

#### 2. Resident (via Frontend)
1. Go to: http://localhost:3000/register
2. Select "Register as Resident"
3. Fill in details:
   - Email: resident@example.com
   - Password: Resident@123
   - Name: John Doe
   - Society: Select from dropdown
   - Flat Number: A-304
4. Submit registration

#### 3. Vendor (via Frontend)
1. Go to: http://localhost:3000/register
2. Select "Register as Vendor"
3. Fill in details:
   - Email: vendor@example.com
   - Password: Vendor@123
   - Business Name: ABC Services
   - Business Type: Service Provider
4. Submit registration

---

## 📍 Important URLs

### Frontend
- **Landing Page:** http://localhost:3000
- **Login:** http://localhost:3000/login
- **Register:** http://localhost:3000/register
- **Resident Dashboard:** http://localhost:3000/resident/dashboard
- **Society Dashboard:** http://localhost:3000/society/dashboard
- **Vendor Dashboard:** http://localhost:3000/vendor/dashboard

### Backend
- **API Base:** http://localhost:4000/api
- **Health Check:** http://localhost:4000/health
- **API Info:** http://localhost:4000/api

### Database
- **PgAdmin:** http://localhost:5050
  - Email: admin@societyrevenue.com
  - Password: admin

---

## 🔑 Default Credentials

### Platform Admin
- **Email:** admin@societyrevenue.com
- **Password:** Admin@123456
- **Access:** Full platform access

### PgAdmin
- **Email:** admin@societyrevenue.com
- **Password:** admin
- **Database:** society_revenue_platform

### PostgreSQL
- **Host:** localhost
- **Port:** 5432
- **Database:** society_revenue_platform
- **Username:** postgres
- **Password:** society_dev_password_2026

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 4000 is available
lsof -i :4000

# If something is using it, kill it
kill -9 <PID>
```

### Frontend won't start
```bash
# Check if port 3000 is available
lsof -i :3000

# If something is using it, kill it
kill -9 <PID>
```

### Database connection error
```bash
# Restart Docker services
docker-compose down
docker-compose up -d

# Wait 10 seconds for database to be ready
sleep 10

# Try backend again
cd backend && npm run dev
```

### Admin user already exists
If you run the seed script multiple times, it's safe - it will just inform you the admin already exists and show the credentials.

---

## 📝 Quick Command Reference

```bash
# Start everything in order:
docker-compose up -d                    # 1. Start Docker services
cd backend && npx tsx scripts/seed-admin.ts  # 2. Create admin (once)
cd backend && npm run dev               # 3. Start backend
cd frontend && npm run dev              # 4. Start frontend (new terminal)

# Stop everything:
# Ctrl+C in both terminals
docker-compose down                     # Stop Docker services
```

---

## ✅ Checklist

- [ ] Docker Desktop is running
- [ ] Docker services started (`docker-compose up -d`)
- [ ] Platform admin created (`npx tsx scripts/seed-admin.ts`)
- [ ] Backend server running (port 4000)
- [ ] Frontend server running (port 3000)
- [ ] Can access http://localhost:3000
- [ ] Can login with admin credentials
- [ ] Backend health check passes

---

## 🎉 Ready to Test!

Once all services are running:
1. Open http://localhost:3000/login
2. Login as platform admin
3. Create test society, resident, and vendor from frontend
4. Test all dashboards!

See **API-ENDPOINTS.md** for all available API endpoints and curl examples.