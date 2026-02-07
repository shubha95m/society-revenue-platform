# Task 02: Authentication & Authorization System

## Objective
Implement secure, role-based authentication with multi-tenant isolation.

## Core Requirements
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Multi-tenant data isolation
- OTP login for residents
- Session management

## Subtasks

### 1. Authentication Service
- [ ] User registration endpoints
  - Email/phone validation
  - OTP generation and verification
  - Password hashing (bcrypt/argon2)
- [ ] Login endpoints
  - Email/password login
  - OTP-based login (for residents)
  - JWT token generation
  - Refresh token mechanism
- [ ] Logout endpoint (token invalidation)
- [ ] Password reset flow
- [ ] Multi-device session management

### 2. Authorization System
- [ ] Define role hierarchy
  - Platform Super Admin
  - Society Admin
  - Society Member
  - Vendor
  - Staff (future)
- [ ] Implement RBAC middleware
  - Role verification
  - Society-scoped access control
  - Resource-level permissions
- [ ] Create permission matrix document
- [ ] Implement attribute-based access control (ABAC) where needed

### 3. Token Management
- [ ] JWT token structure
  - Payload: user_id, role, society_id, permissions
  - Expiry: 15 minutes (access), 7 days (refresh)
- [ ] Token refresh endpoint
- [ ] Token blacklisting (for logout/security)
- [ ] Token validation middleware

### 4. Multi-Tenant Isolation
- [ ] Extract society_id from token
- [ ] Inject society_id into all queries automatically
- [ ] Validate user access to society resources
- [ ] Prevent cross-tenant data access

### 5. Security Features
- [ ] Rate limiting (login attempts, OTP requests)
- [ ] Account lockout after failed attempts
- [ ] IP-based anomaly detection
- [ ] Audit logging for all auth events
- [ ] HTTPS enforcement
- [ ] CORS configuration
- [ ] XSS and CSRF protection

### 6. OTP System (for Residents)
- [ ] OTP generation (6-digit)
- [ ] SMS/Email delivery integration
- [ ] OTP expiry (5 minutes)
- [ ] Resend OTP functionality
- [ ] Rate limiting on OTP requests

### 7. API Endpoints
```
POST /auth/register
POST /auth/login
POST /auth/login/otp (request OTP)
POST /auth/login/otp/verify
POST /auth/refresh
POST /auth/logout
POST /auth/password/reset/request
POST /auth/password/reset/verify
GET /auth/me (current user info)
```

## Acceptance Criteria
- Users can register and login securely
- JWT tokens are generated and validated correctly
- RBAC prevents unauthorized access
- Multi-tenant isolation is enforced
- OTP login works for residents
- Rate limiting prevents abuse
- All auth events are logged

## Dependencies
- Task 01 (Database Design)

## Estimated Effort
5-7 days

## Security Testing Checklist
- [ ] SQL injection attempts blocked
- [ ] XSS attempts blocked
- [ ] CSRF protection verified
- [ ] Rate limiting tested
- [ ] Token expiry works correctly
- [ ] Cross-tenant access blocked
- [ ] Password reset flow secure
