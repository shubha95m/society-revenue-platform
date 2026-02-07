# API Endpoints Documentation

## Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication
All endpoints (except public ones) require authentication via:
- **Header**: `Authorization: Bearer <token>`
- **Cookie**: `session_token=<token>`

### Session Management
- **Session Duration**: 24 hours
- **Inactivity Timeout**: 30 minutes
- **Auto-Refresh**: If < 15 minutes remaining and user is active
- **Refresh Token Header**: `X-Refreshed-Token` (returned when token is refreshed)

---

## 📋 Table of Contents

1. [Authentication](#authentication-endpoints)
2. [Resident](#resident-endpoints)
3. [Society Admin](#society-admin-endpoints)
4. [Vendor](#vendor-endpoints)
5. [Platform Admin](#platform-admin-endpoints)
6. [Common](#common-endpoints)

---

## Authentication Endpoints

### POST /api/auth/register
Register a new user
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+919876543210",
    "role": "resident|vendor|society_admin",
    "societyId": "uuid",  // Required for resident/society_admin
    "flatNumber": "A-304",  // Required for resident
    "tower": "Tower A",  // Optional for resident
    "businessName": "ABC Services"  // Required for vendor
  }
  ```
- **Response**: `AuthResponse`

### POST /api/auth/login
Login user
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123"
  }
  ```
- **Response**: `AuthResponse` with session token

### POST /api/auth/logout
Logout user
- **Access**: Authenticated
- **Response**: Success message

### GET /api/auth/session
Get current session info
- **Access**: Authenticated
- **Response**: `AuthSession`

### POST /api/auth/refresh
Manually refresh token
- **Access**: Authenticated
- **Response**: New token

---

## Resident Endpoints

### Dashboard
- **GET /api/resident/dashboard**
  - Get resident dashboard stats
  - **Access**: Resident
  - **Response**: `DashboardStats`

### Services
- **GET /api/resident/services**
  - List available services in society
  - **Access**: Resident
  - **Query**: `?category=daily_essentials&search=grocery`

- **GET /api/resident/services/:id**
  - Get service details
  - **Access**: Resident

### Orders
- **GET /api/resident/orders**
  - List my orders
  - **Access**: Resident
  - **Query**: `?status=pending&page=1&limit=20`

- **POST /api/resident/orders**
  - Create new order
  - **Access**: Resident
  - **Body**: `CreateOrderDto`

- **GET /api/resident/orders/:id**
  - Get order details
  - **Access**: Resident

- **PATCH /api/resident/orders/:id**
  - Update order (cancel, etc.)
  - **Access**: Resident
  - **Body**: `UpdateOrderDto`

- **POST /api/resident/orders/:id/rate**
  - Rate completed order
  - **Access**: Resident
  - **Body**: `RateOrderDto`

### Service Requests
- **GET /api/resident/service-requests**
  - List all service requests in society
  - **Access**: Resident
  - **Query**: `?status=pending&page=1`

- **POST /api/resident/service-requests**
  - Create new service request
  - **Access**: Resident
  - **Body**: `CreateServiceRequestDto`

- **GET /api/resident/service-requests/:id**
  - Get service request details
  - **Access**: Resident

- **POST /api/resident/service-requests/:id/upvote**
  - Upvote a service request
  - **Access**: Resident

- **DELETE /api/resident/service-requests/:id/upvote**
  - Remove upvote
  - **Access**: Resident

### Votes & Polls
- **GET /api/resident/votes**
  - List active and past votes
  - **Access**: Resident
  - **Query**: `?status=active`

- **GET /api/resident/votes/:id**
  - Get vote details
  - **Access**: Resident

- **POST /api/resident/votes/:id/cast**
  - Cast vote
  - **Access**: Resident
  - **Body**: `CastVoteDto`

### Complaints
- **GET /api/resident/complaints**
  - List my complaints
  - **Access**: Resident

- **POST /api/resident/complaints**
  - Create complaint
  - **Access**: Resident
  - **Body**: `CreateComplaintDto`

- **GET /api/resident/complaints/:id**
  - Get complaint details
  - **Access**: Resident

### Notices
- **GET /api/resident/notices**
  - List notices for my society
  - **Access**: Resident
  - **Query**: `?category=announcement`

- **GET /api/resident/notices/:id**
  - Get notice details
  - **Access**: Resident

### Amenities
- **GET /api/resident/amenities**
  - List society amenities
  - **Access**: Resident

- **GET /api/resident/amenities/:id**
  - Get amenity details with availability
  - **Access**: Resident

### Amenity Bookings
- **GET /api/resident/amenity-bookings**
  - List my bookings
  - **Access**: Resident

- **POST /api/resident/amenity-bookings**
  - Create booking
  - **Access**: Resident
  - **Body**: `CreateAmenityBookingDto`

- **GET /api/resident/amenity-bookings/:id**
  - Get booking details
  - **Access**: Resident

- **PATCH /api/resident/amenity-bookings/:id**
  - Update/cancel booking
  - **Access**: Resident
  - **Body**: `UpdateAmenityBookingDto`

---

## Society Admin Endpoints

### Dashboard
- **GET /api/society/dashboard**
  - Get society dashboard stats
  - **Access**: Society Admin
  - **Response**: `DashboardStats`

### Residents Management
- **GET /api/society/residents**
  - List all residents
  - **Access**: Society Admin
  - **Query**: `?tower=A&floor=3&search=john`

- **POST /api/society/residents**
  - Add new resident
  - **Access**: Society Admin
  - **Body**: `CreateResidentDto`

- **GET /api/society/residents/:id**
  - Get resident details
  - **Access**: Society Admin

- **PATCH /api/society/residents/:id**
  - Update resident
  - **Access**: Society Admin
  - **Body**: `UpdateResidentDto`

- **DELETE /api/society/residents/:id**
  - Remove resident (soft delete)
  - **Access**: Society Admin

### Vendors Management
- **GET /api/society/vendors**
  - List vendors in society
  - **Access**: Society Admin

- **GET /api/society/vendors/:id**
  - Get vendor details
  - **Access**: Society Admin

- **POST /api/society/vendors/:id/activate**
  - Activate vendor for society
  - **Access**: Society Admin

- **POST /api/society/vendors/:id/deactivate**
  - Deactivate vendor
  - **Access**: Society Admin

### Service Requests Management
- **GET /api/society/service-requests**
  - List all service requests
  - **Access**: Society Admin
  - **Query**: `?status=pending&sortBy=upvotes`

- **GET /api/society/service-requests/:id**
  - Get service request details
  - **Access**: Society Admin

- **PATCH /api/society/service-requests/:id**
  - Update service request status
  - **Access**: Society Admin
  - **Body**: `UpdateServiceRequestDto`

- **POST /api/society/service-requests/:id/create-poll**
  - Create poll from service request
  - **Access**: Society Admin

- **POST /api/society/service-requests/:id/reject**
  - Reject service request
  - **Access**: Society Admin
  - **Body**: `{ rejectionReason: string }`

### Requirements (Published to Vendors)
- **GET /api/society/requirements**
  - List published requirements
  - **Access**: Society Admin

- **POST /api/society/requirements**
  - Publish new requirement
  - **Access**: Society Admin
  - **Body**: `CreateRequirementDto`

- **GET /api/society/requirements/:id**
  - Get requirement details with proposals
  - **Access**: Society Admin

- **PATCH /api/society/requirements/:id**
  - Update requirement
  - **Access**: Society Admin

- **POST /api/society/requirements/:id/close**
  - Close requirement
  - **Access**: Society Admin

### Proposals Management
- **GET /api/society/proposals**
  - List proposals for requirements
  - **Access**: Society Admin
  - **Query**: `?requirementId=uuid&status=submitted`

- **GET /api/society/proposals/:id**
  - Get proposal details
  - **Access**: Society Admin

- **PATCH /api/society/proposals/:id**
  - Update proposal status (shortlist, accept, reject)
  - **Access**: Society Admin
  - **Body**: `UpdateProposalDto`

### Contracts Management
- **GET /api/society/contracts**
  - List all contracts
  - **Access**: Society Admin
  - **Query**: `?status=active&vendorId=uuid`

- **POST /api/society/contracts**
  - Create new contract
  - **Access**: Society Admin
  - **Body**: `CreateContractDto`

- **GET /api/society/contracts/:id**
  - Get contract details
  - **Access**: Society Admin

- **PATCH /api/society/contracts/:id**
  - Update contract
  - **Access**: Society Admin

- **POST /api/society/contracts/:id/terminate**
  - Terminate contract
  - **Access**: Society Admin

### Votes & Polls Management
- **GET /api/society/votes**
  - List all votes/polls
  - **Access**: Society Admin
  - **Query**: `?status=active&category=service_requirement`

- **POST /api/society/votes**
  - Create new poll
  - **Access**: Society Admin
  - **Body**: `CreateVoteDto`

- **GET /api/society/votes/:id**
  - Get vote details with responses
  - **Access**: Society Admin

- **POST /api/society/votes/:id/close**
  - Close poll and determine result
  - **Access**: Society Admin

- **POST /api/society/votes/:id/mark-done**
  - Mark service requirement poll as done (approved)
  - **Access**: Society Admin

### Complaints Management
- **GET /api/society/complaints**
  - List all complaints
  - **Access**: Society Admin
  - **Query**: `?status=open&priority=high`

- **GET /api/society/complaints/:id**
  - Get complaint details
  - **Access**: Society Admin

- **PATCH /api/society/complaints/:id**
  - Update complaint (assign, resolve)
  - **Access**: Society Admin
  - **Body**: `UpdateComplaintDto`

### Notices Management
- **GET /api/society/notices**
  - List all notices
  - **Access**: Society Admin

- **POST /api/society/notices**
  - Create notice
  - **Access**: Society Admin
  - **Body**: `CreateNoticeDto`

- **GET /api/society/notices/:id**
  - Get notice details
  - **Access**: Society Admin

- **PATCH /api/society/notices/:id**
  - Update notice
  - **Access**: Society Admin

- **DELETE /api/society/notices/:id**
  - Delete notice
  - **Access**: Society Admin

### Orders Management
- **GET /api/society/orders**
  - List all orders in society
  - **Access**: Society Admin
  - **Query**: `?status=pending&vendorId=uuid`

- **GET /api/society/orders/:id**
  - Get order details
  - **Access**: Society Admin

### Financial/Ledger
- **GET /api/society/ledger**
  - Get ledger entries
  - **Access**: Society Admin
  - **Query**: `?startDate=2026-01-01&endDate=2026-01-31`

- **GET /api/society/transactions**
  - List transactions
  - **Access**: Society Admin

- **GET /api/society/transactions/:id**
  - Get transaction details
  - **Access**: Society Admin

### Reports
- **GET /api/society/reports**
  - List generated reports
  - **Access**: Society Admin

- **POST /api/society/reports/generate**
  - Generate new report
  - **Access**: Society Admin
  - **Body**: `ReportFilters`

- **GET /api/society/reports/:id**
  - Get report details
  - **Access**: Society Admin

### Amenities Management
- **GET /api/society/amenities**
  - List all amenities
  - **Access**: Society Admin

- **POST /api/society/amenities**
  - Create amenity
  - **Access**: Society Admin

- **PATCH /api/society/amenities/:id**
  - Update amenity
  - **Access**: Society Admin

- **DELETE /api/society/amenities/:id**
  - Delete amenity
  - **Access**: Society Admin

### Amenity Bookings Management
- **GET /api/society/amenity-bookings**
  - List all bookings
  - **Access**: Society Admin
  - **Query**: `?amenityId=uuid&date=2026-02-10`

- **PATCH /api/society/amenity-bookings/:id/approve**
  - Approve booking
  - **Access**: Society Admin

- **PATCH /api/society/amenity-bookings/:id/reject**
  - Reject booking
  - **Access**: Society Admin

---

## Vendor Endpoints

### Dashboard
- **GET /api/vendor/dashboard**
  - Get vendor dashboard stats
  - **Access**: Vendor
  - **Response**: `DashboardStats`

### Discover Marketplace
- **GET /api/vendor/requirements**
  - List active requirements from societies
  - **Access**: Vendor
  - **Query**: `?category=daily_essentials&city=Mumbai`

- **GET /api/vendor/requirements/:id**
  - Get requirement details
  - **Access**: Vendor

- **POST /api/vendor/requirements/:id/view**
  - Track requirement view (analytics)
  - **Access**: Vendor

### Proposals
- **GET /api/vendor/proposals**
  - List my proposals
  - **Access**: Vendor
  - **Query**: `?status=submitted`

- **POST /api/vendor/proposals**
  - Submit proposal
  - **Access**: Vendor
  - **Body**: `CreateProposalDto`

- **GET /api/vendor/proposals/:id**
  - Get proposal details
  - **Access**: Vendor

- **PATCH /api/vendor/proposals/:id**
  - Update proposal
  - **Access**: Vendor

- **DELETE /api/vendor/proposals/:id**
  - Withdraw proposal
  - **Access**: Vendor

### Contracts
- **GET /api/vendor/contracts**
  - List my contracts
  - **Access**: Vendor
  - **Query**: `?status=active&societyId=uuid`

- **GET /api/vendor/contracts/:id**
  - Get contract details
  - **Access**: Vendor

- **POST /api/vendor/contracts/:id/sign**
  - Sign contract
  - **Access**: Vendor

### Orders
- **GET /api/vendor/orders**
  - List orders to fulfill
  - **Access**: Vendor
  - **Query**: `?status=confirmed&societyId=uuid`

- **GET /api/vendor/orders/:id**
  - Get order details
  - **Access**: Vendor

- **PATCH /api/vendor/orders/:id/accept**
  - Accept order
  - **Access**: Vendor

- **PATCH /api/vendor/orders/:id/start**
  - Mark order as started
  - **Access**: Vendor

- **PATCH /api/vendor/orders/:id/complete**
  - Mark order as completed
  - **Access**: Vendor

- **PATCH /api/vendor/orders/:id/cancel**
  - Cancel order
  - **Access**: Vendor

### Earnings & Analytics
- **GET /api/vendor/earnings**
  - Get earnings summary
  - **Access**: Vendor
  - **Query**: `?startDate=2026-01-01&endDate=2026-01-31`

- **GET /api/vendor/transactions**
  - List transactions (payouts)
  - **Access**: Vendor

- **GET /api/vendor/analytics**
  - Get performance analytics
  - **Access**: Vendor

### Profile
- **GET /api/vendor/profile**
  - Get vendor profile
  - **Access**: Vendor

- **PATCH /api/vendor/profile**
  - Update vendor profile
  - **Access**: Vendor
  - **Body**: `UpdateVendorDto`

- **POST /api/vendor/profile/upload-documents**
  - Upload verification documents
  - **Access**: Vendor

### Services
- **GET /api/vendor/services**
  - List services I provide
  - **Access**: Vendor

- **POST /api/vendor/services**
  - Add service offering
  - **Access**: Vendor

- **PATCH /api/vendor/services/:id**
  - Update service offering
  - **Access**: Vendor

- **DELETE /api/vendor/services/:id**
  - Remove service offering
  - **Access**: Vendor

---

## Platform Admin Endpoints

### Dashboard
- **GET /api/admin/dashboard**
  - Get platform-wide stats
  - **Access**: Platform Admin

### Societies Management
- **GET /api/admin/societies**
  - List all societies
  - **Access**: Platform Admin
  - **Query**: `?status=active&city=Mumbai`

- **POST /api/admin/societies**
  - Onboard new society
  - **Access**: Platform Admin

- **GET /api/admin/societies/:id**
  - Get society details
  - **Access**: Platform Admin

- **PATCH /api/admin/societies/:id**
  - Update society
  - **Access**: Platform Admin
  - **Body**: `UpdateSocietyDto`

- **PATCH /api/admin/societies/:id/suspend**
  - Suspend society
  - **Access**: Platform Admin

- **PATCH /api/admin/societies/:id/activate**
  - Activate society
  - **Access**: Platform Admin

### Vendors Management
- **GET /api/admin/vendors**
  - List all vendors
  - **Access**: Platform Admin
  - **Query**: `?status=pending_verification`

- **GET /api/admin/vendors/:id**
  - Get vendor details
  - **Access**: Platform Admin

- **PATCH /api/admin/vendors/:id**
  - Update vendor
  - **Access**: Platform Admin

- **POST /api/admin/vendors/:id/verify**
  - Verify vendor
  - **Access**: Platform Admin

- **POST /api/admin/vendors/:id/reject**
  - Reject vendor verification
  - **Access**: Platform Admin

- **PATCH /api/admin/vendors/:id/suspend**
  - Suspend vendor
  - **Access**: Platform Admin

### Analytics
- **GET /api/admin/analytics/overview**
  - Platform-wide analytics
  - **Access**: Platform Admin

- **GET /api/admin/analytics/societies**
  - Society performance metrics
  - **Access**: Platform Admin

- **GET /api/admin/analytics/vendors**
  - Vendor performance metrics
  - **Access**: Platform Admin

- **GET /api/admin/analytics/revenue**
  - Revenue analytics
  - **Access**: Platform Admin

### Platform Settings
- **GET /api/admin/settings**
  - Get platform settings
  - **Access**: Platform Admin

- **PATCH /api/admin/settings**
  - Update platform settings
  - **Access**: Platform Admin

### Activity Logs
- **GET /api/admin/activities**
  - List platform admin activities
  - **Access**: Platform Admin

---

## Common Endpoints

### Health Check
- **GET /api/health**
  - Health check
  - **Access**: Public
  - **Response**: `{ status: 'ok', database: 'connected' }`

### File Upload
- **POST /api/upload**
  - Upload file (images, documents)
  - **Access**: Authenticated
  - **Body**: FormData with file
  - **Response**: `{ url: string }`

### Search
- **GET /api/search**
  - Global search (services, vendors, etc.)
  - **Access**: Authenticated
  - **Query**: `?q=grocery&type=service`

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "hasMore": true
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": { ... }
  }
}
```

### Refreshed Token
If token is auto-refreshed:
```
Headers:
  X-Refreshed-Token: <new_token>
```

---

## Error Codes

- `UNAUTHORIZED` - No valid authentication
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `BAD_REQUEST` - Invalid request
- `VALIDATION_ERROR` - Validation failed
- `INTERNAL_ERROR` - Server error
- `SESSION_EXPIRED` - Session expired, please login
- `DUPLICATE_ENTRY` - Entry already exists
- `INSUFFICIENT_PERMISSIONS` - Cannot perform action

---

## Rate Limiting

- **General**: 100 requests per minute per IP
- **Auth endpoints**: 5 requests per minute per IP
- **File upload**: 10 requests per minute per user

---

## Pagination

Default: `page=1&limit=20`
Max limit: `100`

Response includes:
```json
{
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "hasMore": true
  }
}
```

---

**Total Endpoints**: 150+
**Last Updated**: 2026-02-08
