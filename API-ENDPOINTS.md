# API Endpoints Documentation

## Base URL
```
http://localhost:4000
```

---

## Health & Info

### Health Check
```bash
curl http://localhost:4000/health
```

### API Info
```bash
curl http://localhost:4000/api
```

---

## Authentication Endpoints

### 1. Register User
```bash
# Register Platform Admin
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@societyrevenue.com",
    "password": "Admin@123456",
    "name": "Platform Admin",
    "role": "platform_admin"
  }'

# Register Society Admin
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "society@example.com",
    "password": "Society@123",
    "name": "Society Admin",
    "role": "society_admin"
  }'

# Register Resident
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "resident@example.com",
    "password": "Resident@123",
    "name": "John Doe",
    "role": "resident"
  }'

# Register Vendor
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendor@example.com",
    "password": "Vendor@123",
    "name": "Vendor Services",
    "role": "vendor"
  }'
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "73f0527b-357c-449b-a7a2-0e2998efc1f8",
      "email": "vendor@example.com",
      "name": "Vendor Services",
      "role": "vendor"
    },
    "session": {
      "token": "eyJhbGciOiJIUzI1NiJ9.eyJzZXNzaW9uIjp7InVzZXJJZCI6IjczZjA...",
      "expiresAt": "2026-02-21T18:00:00.000Z",
      "lastActivityAt": "2026-02-20T18:00:00.000Z"
    }
  }
}
```

### 2. Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@societyrevenue.com",
    "password": "Admin@123456"
  }'
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "73f0527b-357c-449b-a7a2-0e2998efc1f8",
      "email": "admin@societyrevenue.com",
      "name": "Platform Admin",
      "role": "platform_admin"
    },
    "session": {
      "token": "eyJhbGciOiJIUzI1NiJ9.eyJzZXNzaW9uIjp7InVzZXJJZCI6IjczZjA...",
      "expiresAt": "2026-02-21T18:00:00.000Z",
      "lastActivityAt": "2026-02-20T18:00:00.000Z"
    }
  }
}
```

**Note:** Role values returned are lowercase with underscores: `platform_admin`, `society_admin`, `resident`, `vendor`

### 3. Get Session
```bash
curl http://localhost:4000/api/auth/session \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "admin@societyrevenue.com",
    "role": "platform_admin",
    "expiresAt": "2026-02-21T12:00:00.000Z"
  }
}
```

### 4. Logout
```bash
curl -X POST http://localhost:4000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response Example:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Resident Endpoints

### 1. Get Dashboard
```bash
curl http://localhost:4000/api/resident/dashboard \
  -H "Authorization: Bearer YOUR_RESIDENT_TOKEN"
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "resident": {
      "id": "uuid",
      "name": "John Doe",
      "flatNumber": "A-304",
      "society": "Green Valley Apartments"
    },
    "stats": {
      "totalOrders": 5,
      "availableServices": 12,
      "complaints": 1
    }
  }
}
```

### 2. Get Orders
```bash
curl http://localhost:4000/api/resident/orders \
  -H "Authorization: Bearer YOUR_RESIDENT_TOKEN"
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "order_number": "ORD-001",
        "description": "Plumbing service",
        "total_amount": 1500,
        "status": "completed",
        "created_at": "2026-02-15T10:00:00.000Z",
        "services": {
          "id": "uuid",
          "name": "Plumbing Service",
          "category": "Maintenance"
        },
        "vendors": {
          "id": "uuid",
          "business_name": "ABC Plumbers"
        }
      }
    ]
  }
}
```

### 3. Get Services
```bash
curl http://localhost:4000/api/resident/services \
  -H "Authorization: Bearer YOUR_RESIDENT_TOKEN"
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "id": "uuid",
        "name": "Plumbing Service",
        "description": "Professional plumbing services",
        "category": "Maintenance",
        "pricing_type": "per_service",
        "base_price": 1500,
        "status": "active",
        "vendors": {
          "id": "uuid",
          "business_name": "ABC Plumbers",
          "business_type": "Service Provider"
        }
      }
    ]
  }
}
```

---

## Society Admin Endpoints

### 1. Get Dashboard
```bash
curl http://localhost:4000/api/society/dashboard \
  -H "Authorization: Bearer YOUR_SOCIETY_ADMIN_TOKEN"
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "society": {
      "id": "91a38b89-a4a3-47c6-934d-27066ef61eef",
      "name": "Test Society",
      "address": "123 Main Street, Mumbai, Maharashtra 400001",
      "totalUnits": 100
    },
    "stats": {
      "totalResidents": 0,
      "activeServices": 0,
      "totalOrders": 0,
      "totalRevenue": 0
    }
  }
}
```

**Note:** Stats show 0 for newly created societies. Admin needs to add residents, services, etc.

### 2. Get Residents
```bash
curl http://localhost:4000/api/society/residents \
  -H "Authorization: Bearer YOUR_SOCIETY_ADMIN_TOKEN"
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "residents": [
      {
        "id": "uuid",
        "flat_number": "A-304",
        "name": "John Doe",
        "phone": "9876543210",
        "status": "active",
        "created_at": "2026-01-15T10:00:00.000Z",
        "users": {
          "email": "john@example.com",
          "name": "John Doe",
          "status": "active"
        }
      }
    ]
  }
}
```

### 3. Get Services
```bash
curl http://localhost:4000/api/society/services \
  -H "Authorization: Bearer YOUR_SOCIETY_ADMIN_TOKEN"
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "id": "uuid",
        "service_id": "uuid",
        "status": "active",
        "created_at": "2026-01-10T10:00:00.000Z",
        "services": {
          "id": "uuid",
          "name": "Plumbing Service",
          "description": "Professional plumbing",
          "category": "Maintenance",
          "pricing_type": "per_service",
          "base_price": 1500,
          "vendors": {
            "id": "uuid",
            "business_name": "ABC Plumbers",
            "business_type": "Service Provider"
          }
        }
      }
    ]
  }
}
```

---

## Error Responses

### Authentication Error
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

### Authorization Error
```json
{
  "success": false,
  "error": {
    "code": "NO_TOKEN",
    "message": "No authorization token provided"
  }
}
```

### Not Found Error
```json
{
  "success": false,
  "error": {
    "code": "RESIDENT_NOT_FOUND",
    "message": "Resident profile not found"
  }
}
```

---

## Testing Flow

### 1. Create Platform Admin
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@societyrevenue.com",
    "password": "Admin@123456",
    "name": "Platform Admin",
    "role": "platform_admin"
  }'
```

### 2. Login and Get Token
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@societyrevenue.com",
    "password": "Admin@123456"
  }'
```

### 3. Use Token for Protected Routes
```bash
# Store token in variable
TOKEN="your_token_here"

# Test session
curl http://localhost:4000/api/auth/session \
  -H "Authorization: Bearer $TOKEN"
```

---

## Frontend URLs

- **Landing Page:** http://localhost:3000
- **Login:** http://localhost:3000/login
- **Register:** http://localhost:3000/register
- **Resident Dashboard:** http://localhost:3000/resident/dashboard
- **Society Dashboard:** http://localhost:3000/society/dashboard
- **Vendor Dashboard:** http://localhost:3000/vendor/dashboard

---

## Notes

1. All protected endpoints require `Authorization: Bearer {token}` header
2. Tokens are returned in login/register responses with expiry information
3. Society admin routes require `role: society_admin`
4. Resident routes require corresponding resident record in database
5. Platform admin can be created directly via API or database
6. Society admin, residents, and vendors should be created from frontend
7. **Important:** Backend returns roles as `society_admin` (lowercase with underscore), frontend converts to `SOCIETY_ADMIN`
8. **Session Management:** Tokens expire after 24 hours, with 30-minute inactivity timeout
9. **CORS:** Backend accepts requests from `http://localhost:3000` only

## Current Implementation Status

### ✅ Working Features (Sprint 3 Complete - 2026-02-20)
- Full authentication flow (register, login, session, logout)
- JWT token generation and verification
- Role-based access control
- Protected API routes
- Society admin dashboard with real data
- Resident dashboard with real data
- Session persistence and restoration
- Frontend-backend integration complete
- Clean empty states for new societies

### ⏳ Pending Features
- Vendor dashboard API integration
- Platform admin dashboard
- Service booking endpoints
- Vendor management endpoints
- Resident management endpoints
- Financial ledger endpoints
- Voting system endpoints
- Complaints system endpoints