# Testing Guide - Society Revenue Platform

## 🟢 Services Currently Running

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | http://localhost:3000 | ✅ Running |
| **Backend API** | http://localhost:4000 | ✅ Running |
| **PostgreSQL** | localhost:5432 | ✅ Running |
| **Redis** | localhost:6379 | ✅ Running |
| **PgAdmin** | http://localhost:5050 | ✅ Running |

---

## ✅ What's Working (Sprint 3 - API Integration Complete)

### 1. Authentication
- ✅ User registration (all roles)
- ✅ Login with JWT tokens
- ✅ Session management
- ✅ Protected routes
- ✅ Role-based access control

### 2. Frontend Pages
- ✅ Landing page
- ✅ Login page (connected to API)
- ✅ Register page (UI only)
- ✅ Resident dashboard (connected to API)
- ✅ Society dashboard (connected to API)
- ✅ Vendor dashboard (UI only)

### 3. Backend APIs
- ✅ `/api/health` - Health check
- ✅ `/api/auth/register` - User registration
- ✅ `/api/auth/login` - User login
- ✅ `/api/auth/session` - Get session
- ✅ `/api/auth/logout` - Logout
- ✅ `/api/resident/dashboard` - Resident dashboard data
- ✅ `/api/resident/orders` - Resident orders
- ✅ `/api/resident/services` - Available services
- ✅ `/api/society/dashboard` - Society dashboard data
- ✅ `/api/society/residents` - Society residents
- ✅ `/api/society/services` - Society services

---

## 🧪 Testing the Application

### Test 1: Login as Platform Admin

1. **Open Frontend:** http://localhost:3000/login

2. **Login Credentials:**
   ```
   Email: admin@societyrevenue.com
   Password: Admin@123456
   ```

3. **Expected Result:**
   - Successful login
   - Redirect to platform admin dashboard (if exists)
   - Or show error if dashboard doesn't exist yet

---

### Test 2: Create New Users via API

#### Create Society Admin
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "greenvalley@test.com",
    "password": "Society@123",
    "name": "Green Valley Admin",
    "role": "society_admin"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "greenvalley@test.com",
      "name": "Green Valley Admin",
      "role": "society_admin"
    },
    "session": {
      "expiresAt": "...",
      "lastActivityAt": "..."
    }
  }
}
```

---

### Test 3: Login as Society Admin

1. Login with the society admin credentials you just created
2. You'll be redirected to `/society/dashboard`
3. Dashboard will try to load real data from API
4. **Expected:** Error because no society record exists for this user yet

---

### Test 4: Check Backend Health

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

---

### Test 5: Test API with Token

1. **Login and get token:**
```bash
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@societyrevenue.com","password":"Admin@123456"}' \
  | jq -r '.data.session.token')

echo $TOKEN
```

2. **Use token to access protected endpoint:**
```bash
curl http://localhost:4000/api/auth/session \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📝 Current Limitations

### ⚠️ Missing Database Records

Currently, only `users` table has records. You need to manually create:

#### For Resident Users:
- `societies` record (the society they belong to)
- `residents` record (links user to society + flat number)

#### For Society Admin Users:
- `societies` record (the society they manage)

#### For Vendor Users:
- `vendors` record (business details)

### Sample SQL to Create Test Data

```sql
-- Connect to database
docker exec -it society-postgres psql -U postgres -d society_revenue_platform

-- Create a test society
INSERT INTO societies (
  id, name, slug, address_line1, city, state, pincode,
  total_flats, status, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Green Valley Apartments',
  'green-valley-apartments',
  '123 Main Street',
  'Mumbai',
  'Maharashtra',
  '400001',
  300,
  'active',
  NOW(),
  NOW()
) RETURNING id;

-- Create a resident (use society_id from above and user_id from your registered resident)
INSERT INTO residents (
  id, user_id, society_id, flat_number, name, status, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'YOUR_USER_ID_HERE',
  'YOUR_SOCIETY_ID_HERE',
  'A-304',
  'John Resident',
  'active',
  NOW(),
  NOW()
);
```

---

## 🎯 Recommended Testing Order

1. ✅ **Test Backend Health** - Verify server is running
2. ✅ **Test Login API** - Via curl or Postman
3. ✅ **Test Frontend Login** - Via browser
4. ⏳ **Create Test Data in DB** - Manually via SQL
5. ⏳ **Test Dashboards** - Once data exists
6. ⏳ **Test Protected Routes** - Try accessing without login
7. ⏳ **Test Role-Based Access** - Verify residents can't access society dashboard

---

## 🐛 Troubleshooting

### Issue: "Failed to connect to localhost port 4000"
**Solution:** Backend not running. Start it:
```bash
cd backend
npm run dev
```

### Issue: "Invalid token" or "Session expired"
**Solution:** Token expired. Login again to get new token.

### Issue: "Resident profile not found"
**Solution:** User exists but no resident record. Create resident record in database.

### Issue: "Society not found"
**Solution:** User exists but no society record. Create society record in database.

### Issue: CORS errors in browser
**Solution:** Check backend `FRONTEND_URL` in `.env` matches your frontend URL.

---

## 📊 Current Test Users

| Email | Password | Role | Dashboard Works? |
|-------|----------|------|------------------|
| admin@societyrevenue.com | Admin@123456 | platform_admin | ❌ No data |
| society1@test.com | Society@123 | society_admin | ❌ No society record |

---

## 🚀 Next Steps

1. **Create sample data in database** - Manually or via seed script
2. **Test all dashboards** with real data
3. **Implement register page API integration**
4. **Add error handling improvements**
5. **Create admin dashboard** for platform admin role
6. **Implement vendor dashboard API integration**

---

## 📁 Important Files

- **API Documentation:** `API-ENDPOINTS.md`
- **Startup Guide:** `STARTUP-GUIDE.md`
- **Credentials:** `CREDENTIALS.md`
- **Progress Tracker:** `PROGRESS-TRACKER.md`

---

**Last Updated:** 2026-02-20