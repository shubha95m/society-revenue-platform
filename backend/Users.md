# Test User Credentials

This file contains all test user credentials for development and testing purposes.

## Platform Admin

**Email:** admin@societyrevenue.com
**Password:** Admin@123456
**Role:** platform_admin
**Status:** active
**Login URL:** http://localhost:3000/admin/login

---

## Society Admin

**Society Name:** Green Valley Apartments
**Email:** rajesh@greenvalley.com
**Password:** Test@123456
**Name:** Rajesh Kumar
**Phone:** 9876543210
**Role:** society_admin
**Status:** pending_verification (needs platform admin approval)
**Login URL:** http://localhost:3000/login

**Society Details:**
- Address: 123 Main Street, Mumbai, Maharashtra - 400001
- Total Flats: 100
- Total Buildings: 4
- Amenities: Gym, Pool, Garden
- Monthly Maintenance: ₹5,000

---

## Resident

**Society:** Green Valley Apartments
**Email:** john.doe@example.com
**Password:** Test@123456
**Name:** John Doe
**Role:** resident
**Status:** active
**Login URL:** http://localhost:3000/login

---

## Vendor

**Business Name:** Fresh Groceries Pvt Ltd
**Email:** vendor@freshgroceries.com
**Password:** Test@123456
**Contact Person:** Amit Shah
**Phone:** 9123456789
**Business Type:** Grocery Store
**GST Number:** 27AABCU9603R1ZV
**City:** Mumbai
**State:** Maharashtra
**Role:** vendor
**Status:** pending (needs platform admin approval)
**Login URL:** http://localhost:3000/login

---

## API Testing Tokens

### Platform Admin Token
```
eyJhbGciOiJIUzI1NiJ9.eyJzZXNzaW9uIjp7InVzZXJJZCI6IjZlM2VjMzFlLTU2MTAtNGYxMi1iYjI5LWExZjQ0ZjdhOWE2ZCIsImVtYWlsIjoiYWRtaW5Ac29jaWV0eXJldmVudWUuY29tIiwicm9sZSI6InBsYXRmb3JtX2FkbWluIiwiZXhwaXJlc0F0IjoiMjAyNi0wMi0yMlQxMjowNzoyNi4zMTlaIiwibGFzdEFjdGl2aXR5QXQiOiIyMDI2LTAyLTIxVDEyOjA3OjI2LjMxOVoifSwiaWF0IjoxNzcxNjc1NjQ2LCJleHAiOjE3NzE3NjIwNDZ9.hCqAobHSY46KZ51YpvnTItXu9w5hTqBzz6X2N4tr0yw
```

### Society Admin Token (after approval)
```
eyJhbGciOiJIUzI1NiJ9.eyJzZXNzaW9uIjp7InVzZXJJZCI6IjRhYTVjMjZhLTE4ZjAtNDliNS1iZGZkLWIyOWNiMjU3M2E1ZCIsImVtYWlsIjoicmFqZXNoQGdyZWVudmFsbGV5LmNvbSIsInJvbGUiOiJzb2NpZXR5X2FkbWluIiwiZXhwaXJlc0F0IjoiMjAyNi0wMi0yMlQxMjowODo1Ny42MTFaIiwibGFzdEFjdGl2aXR5QXQiOiIyMDI2LTAyLTIxVDEyOjA4OjU3LjYxMVoifSwiaWF0IjoxNzcxNjc1NzM3LCJleHAiOjE3NzE3NjIxMzd9.6FP11-2KjscZGMtT6joPMSWos7EmjD6RjHfKU5mKBrY
```

### Resident Token
```
eyJhbGciOiJIUzI1NiJ9.eyJzZXNzaW9uIjp7InVzZXJJZCI6ImI3NTRlODU4LTYwMjUtNDcyYy1hNzRjLTI0OTNhM2ExMWQyOSIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJyb2xlIjoicmVzaWRlbnQiLCJleHBpcmVzQXQiOiIyMDI2LTAyLTIyVDEyOjA3OjI2LjgyMVoiLCJsYXN0QWN0aXZpdHlBdCI6IjIwMjYtMDItMjFUMTI6MDc6MjYuODIxWiJ9LCJpYXQiOjE3NzE2NzU2NDYsImV4cCI6MTc3MTc2MjA0Nn0.e6wcb9ClKqsRkWYBRLVTDsrosTPB_LHNLp_IC5LcpmQ
```

---

## Quick Test Commands

### Login as Platform Admin
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@societyrevenue.com","password":"Admin@123456"}'
```

### Login as Society Admin (after approval)
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rajesh@greenvalley.com","password":"Test@123456"}'
```

### Login as Resident
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","password":"Test@123456"}'
```

### Test Protected Endpoint (replace TOKEN)
```bash
curl -X GET http://localhost:4000/api/admin/dashboard \
  -H "Authorization: Bearer TOKEN"
```

---

## Database IDs

### Platform Admin
- User ID: `6e3ec31e-5610-4f12-bb29-a1f44f7a9a6d`

### Society Admin
- User ID: `4aa5c26a-18f0-49b5-bdfd-b29cb2573a5d`
- Society ID: `301f71f3-a499-449f-9d29-f4da060df743`

### Resident
- User ID: `b754e858-6025-472c-a74c-2493a3a11d29`

---

*Last Updated: 2026-02-21*
