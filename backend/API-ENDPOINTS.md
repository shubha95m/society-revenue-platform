# Society Revenue Platform - API Endpoints Documentation

Base URL: `http://localhost:4000/api`

## Table of Contents
1. [Authentication](#authentication)
2. [Society Registration](#society-registration)
3. [Platform Admin](#platform-admin)
4. [Society Admin](#society-admin)
5. [Resident](#resident)
6. [Vendor](#vendor)
7. [Shared Resources](#shared-resources)

---

## Authentication

### Login
**POST** `/auth/login`

Login for all user types.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password@123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "platform_admin|society_admin|resident|vendor"
    },
    "session": {
      "token": "jwt_token_here",
      "expiresAt": "2026-02-22T12:00:00.000Z",
      "lastActivityAt": "2026-02-21T12:00:00.000Z"
    }
  }
}
```

### Register
**POST** `/auth/register`

Register a new user (resident or vendor).

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "Password@123",
  "name": "John Doe",
  "role": "resident|vendor"
}
```

### Get Session
**GET** `/auth/session`

Get current session info.

**Headers:** `Authorization: Bearer {token}`

### Logout
**POST** `/auth/logout`

Logout current user.

**Headers:** `Authorization: Bearer {token}`

---

## Society Registration

### Register Society
**POST** `/society-registration/register`

Register a new society with admin.

**Request:**
```json
{
  "societyName": "Green Valley Apartments",
  "address": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "totalFlats": "100",
  "totalBuildings": "4",
  "amenities": "Gym, Pool, Garden",
  "currentMaintenance": "5000",
  "adminName": "Rajesh Kumar",
  "adminEmail": "admin@society.com",
  "adminPhone": "9876543210",
  "password": "Password@123"
}
```

**Response:**
Creates both user and society, returns session token.

---

## Platform Admin

**Base Path:** `/admin`
**Required Role:** `platform_admin`
**Headers:** `Authorization: Bearer {token}`

### Dashboard
**GET** `/admin/dashboard`

Get platform-wide statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalSocieties": 10,
      "totalVendors": 25,
      "totalResidents": 500,
      "totalRevenue": 1000000,
      "pendingSocieties": 2,
      "pendingVendors": 3,
      "activeOrders": 15
    },
    "recentActivities": {
      "societies": [...],
      "vendors": [...]
    }
  }
}
```

### List Societies
**GET** `/admin/societies`

Query Parameters:
- `status`: Filter by status (pending, approved, etc.)
- `search`: Search by name, city, or email
- `limit`: Results per page (default: 50)
- `offset`: Pagination offset (default: 0)

### Pending Societies
**GET** `/admin/societies/pending`

Get all pending society registrations.

### Approve Society
**PATCH** `/admin/societies/:id/approve`

Approve a pending society.

### Reject Society
**PATCH** `/admin/societies/:id/reject`

**Request:**
```json
{
  "reason": "Incomplete documentation"
}
```

### List Vendors
**GET** `/admin/vendors`

Query Parameters:
- `status`: Filter by status
- `search`: Search by business name, type, or city
- `limit`: Results per page
- `offset`: Pagination offset

### Pending Vendors
**GET** `/admin/vendors/pending`

### Approve Vendor
**PATCH** `/admin/vendors/:id/approve`

### Reject Vendor
**PATCH** `/admin/vendors/:id/reject`

### Analytics
**GET** `/admin/analytics`

Query Parameters:
- `startDate`: Filter start date
- `endDate`: Filter end date

**Response:**
```json
{
  "success": true,
  "data": {
    "revenueByMonth": [...],
    "ordersByStatus": [...],
    "topSocieties": [...],
    "topVendors": [...]
  }
}
```

---

## Society Admin

**Base Path:** `/society-admin`
**Required Role:** `society_admin`
**Headers:** `Authorization: Bearer {token}`

### Dashboard
**GET** `/society-admin/dashboard`

Get society dashboard with key metrics.

### List Residents
**GET** `/society-admin/residents`

Query Parameters:
- `status`: Filter by status
- `search`: Search by name or flat number

### Get Society Info
**GET** `/society-admin/info`

### Update Society Info
**PATCH** `/society-admin/info`

### Analytics
**GET** `/society-admin/analytics`

Query Parameters:
- `startDate`, `endDate`

### Revenue
**GET** `/society-admin/revenue`

Query Parameters:
- `startDate`, `endDate`

### Approve Resident
**PATCH** `/society-admin/residents/:id/approve`

### Reject Resident
**PATCH** `/society-admin/residents/:id/reject`

---

## Resident

**Base Path:** `/resident`
**Required Role:** `resident`
**Headers:** `Authorization: Bearer {token}`

### Dashboard
**GET** `/resident/dashboard`

Get resident dashboard with personal info and stats.

### List Orders
**GET** `/resident/orders`

Query Parameters:
- `status`: Filter by status
- `limit`, `offset`: Pagination

### Get Order Details
**GET** `/resident/orders/:id`

### List Complaints
**GET** `/resident/complaints`

### View Amenities
**GET** `/resident/amenities`

### View Notices
**GET** `/resident/notices`

---

## Vendor

**Base Path:** `/vendor`
**Required Role:** `vendor`
**Headers:** `Authorization: Bearer {token}`

### Dashboard
**GET** `/vendor/dashboard`

**Response:**
```json
{
  "success": true,
  "data": {
    "vendor": {
      "id": "uuid",
      "businessName": "Fresh Groceries Pvt Ltd",
      "businessType": "Grocery Store",
      "status": "approved"
    },
    "stats": {
      "totalOrders": 150,
      "activeContracts": 10,
      "totalSocieties": 5,
      "totalEarnings": 500000
    }
  }
}
```

### List Orders
**GET** `/vendor/orders`

Query Parameters:
- `status`: Filter by status
- `limit`, `offset`: Pagination

### List Contracts
**GET** `/vendor/contracts`

Query Parameters:
- `status`: Filter by status (active, pending, terminated)

### Discover Societies
**GET** `/vendor/discover`

Find societies to connect with.

Query Parameters:
- `city`: Filter by city
- `state`: Filter by state
- `search`: Search societies

### View Earnings
**GET** `/vendor/earnings`

Query Parameters:
- `startDate`, `endDate`

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalEarnings": 500000,
      "totalOrders": 150,
      "averageOrderValue": 3333.33
    },
    "ordersByMonth": [...],
    "topServices": [...]
  }
}
```

### Connect with Society
**POST** `/vendor/connect-society`

Send connection request to a society.

**Request:**
```json
{
  "societyId": "uuid",
  "serviceId": "uuid",
  "message": "We would like to provide services to your society"
}
```

---

## Shared Resources

### Orders

**Base Path:** `/orders`

#### List Orders
**GET** `/orders`

Query Parameters:
- `status`, `limit`, `offset`

#### Create Order
**POST** `/orders`

**Request:**
```json
{
  "serviceId": "uuid",
  "vendorId": "uuid",
  "description": "Order description",
  "scheduledDate": "2026-03-01T10:00:00Z"
}
```

#### Update Order Status
**PATCH** `/orders/:id/status`

**Request:**
```json
{
  "status": "pending|in_progress|completed|cancelled"
}
```

---

### Complaints

**Base Path:** `/complaints`

#### List Complaints
**GET** `/complaints`

Query Parameters:
- `status`, `category`, `priority`

#### Create Complaint
**POST** `/complaints`

**Request:**
```json
{
  "title": "Water leakage",
  "description": "Water leaking from ceiling",
  "category": "maintenance",
  "priority": "high|medium|low"
}
```

#### Update Complaint
**PATCH** `/complaints/:id`

#### Resolve Complaint
**PATCH** `/complaints/:id/resolve`

**Request:**
```json
{
  "resolutionNotes": "Issue fixed by plumber"
}
```

---

### Votes & Proposals

**Base Path:** `/votes`

#### List Proposals
**GET** `/votes`

Query Parameters:
- `status`: pending, active, closed
- `type`: poll, proposal, election

#### Get Proposal Details
**GET** `/votes/:id`

#### Create Proposal
**POST** `/votes`

**Request:**
```json
{
  "title": "Install solar panels",
  "description": "Proposal to install solar panels on rooftop",
  "type": "proposal",
  "startDate": "2026-03-01",
  "endDate": "2026-03-15"
}
```

#### Cast Vote
**POST** `/votes/:id/vote`

**Request:**
```json
{
  "voteValue": "yes|no|abstain"
}
```

---

### Notices

**Base Path:** `/notices`

#### List Notices
**GET** `/notices`

Query Parameters:
- `category`, `priority`, `status`

#### Get Notice Details
**GET** `/notices/:id`

#### Create Notice
**POST** `/notices`

**Request:**
```json
{
  "title": "Water supply maintenance",
  "content": "Water supply will be suspended on Sunday from 10 AM to 2 PM",
  "category": "announcement",
  "priority": "high|normal|low"
}
```

#### Update Notice
**PATCH** `/notices/:id`

#### Delete Notice
**DELETE** `/notices/:id`

---

### Amenities

**Base Path:** `/amenities`

#### List Amenities
**GET** `/amenities`

#### Get Amenity Details
**GET** `/amenities/:id`

#### Create Amenity (Society Admin)
**POST** `/amenities`

**Request:**
```json
{
  "name": "Swimming Pool",
  "description": "Olympic size swimming pool",
  "amenityType": "recreational",
  "bookingType": "hourly|daily",
  "pricePerHour": 200,
  "pricePerDay": 1000,
  "availableSlots": "6AM-10PM",
  "rules": "No food or drinks allowed"
}
```

#### Book Amenity (Resident)
**POST** `/amenities/:id/book`

**Request:**
```json
{
  "bookingDate": "2026-03-01",
  "startTime": "10:00",
  "endTime": "12:00"
}
```

#### List Bookings
**GET** `/amenities/bookings`

---

### Ledger

**Base Path:** `/ledger`

#### List Entries
**GET** `/ledger`

Query Parameters:
- `entryType`: income, expense
- `category`
- `startDate`, `endDate`

#### Create Entry (Society Admin)
**POST** `/ledger`

**Request:**
```json
{
  "entryType": "income|expense",
  "category": "maintenance|utilities|salaries|repairs",
  "amount": 50000,
  "description": "Monthly maintenance collection",
  "transactionDate": "2026-02-01",
  "paymentMethod": "cash|cheque|online"
}
```

#### Get Balance
**GET** `/ledger/balance`

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### Common Error Codes:
- `NO_TOKEN`: No authorization token provided
- `INVALID_TOKEN`: Invalid or expired token
- `FORBIDDEN`: Insufficient permissions
- `AUTH_ERROR`: Authentication failed
- `VALIDATION_ERROR`: Invalid request data
- `NOT_FOUND`: Resource not found
- `INTERNAL_ERROR`: Server error

---

## Test Credentials

See `Users.md` for complete test credentials.

**Quick Reference:**
- Platform Admin: `admin@societyrevenue.com` / `Admin@123456`
- Society Admin: `rajesh@greenvalley.com` / `Test@123456`
- Resident: `john.doe@example.com` / `Test@123456`
- Vendor: `vendor@freshgroceries.com` / `Test@123456`

---

*Last Updated: 2026-02-21*
