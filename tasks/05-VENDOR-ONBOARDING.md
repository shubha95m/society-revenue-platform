# Task 05: Vendor Onboarding & Discovery

## Objective
Enable vendors to register, discover societies, and request connections.

## User Story
As a vendor, I want to find societies that need my services so I can offer them better rates at scale.

## Subtasks

### 1. Vendor Registration
- [ ] Registration form:
  - Business name
  - Service category (milk, newspaper, groceries, plumbing, etc.)
  - Contact person name
  - Email
  - Phone
  - Business address
  - Coverage areas (cities/localities)
- [ ] Document uploads:
  - Business registration certificate
  - GST certificate (if applicable)
  - ID proof
  - Service-specific licenses (e.g., FSSAI for food)
- [ ] OTP verification
- [ ] Terms acceptance

### 2. Vendor Profile Setup
- [ ] Business description
- [ ] Service offerings (multiple categories possible)
- [ ] Pricing structure
- [ ] Portfolio/photos upload
- [ ] Service radius (how far they can serve)
- [ ] Capacity (how many societies/households they can handle)
- [ ] Existing client references

### 3. Vendor Verification (Platform Admin)
- [ ] Pending vendor queue
- [ ] Document review interface
- [ ] Background check integration (optional)
- [ ] Approve/reject workflow
- [ ] Verification badge on approval

### 4. Society Discovery
- [ ] Search interface for vendors:
  - Filter by city
  - Filter by society size (number of flats)
  - Filter by service category match
  - Sort by adoption potential
- [ ] Society cards showing:
  - Society name and location
  - Total households
  - Current vendors in category (if public)
  - Estimated monthly volume
  - NOT showing: Resident names/details
- [ ] Save/bookmark societies

### 5. Connection Request System
- [ ] Vendor sends connection request to society
- [ ] Request includes:
  - Service offering
  - Proposed pricing
  - Volume discounts
  - Why they're a good fit
- [ ] Society admin receives notification
- [ ] Society admin can:
  - View vendor profile
  - Compare with existing vendors
  - Approve/reject/negotiate

### 6. Vendor Dashboard (Home Page)
- [ ] Above fold: "You currently serve 3 societies, 426 households"
- [ ] Active contracts
- [ ] Pending connection requests
- [ ] Performance metrics (ratings, order volume)
- [ ] Earnings summary (this month vs last month)

### 7. API Endpoints
```
POST /vendors/register
POST /vendors/verify-otp
PUT /vendors/:id/profile
GET /vendors/:id/verification-status
POST /vendors/:id/documents/upload
GET /societies/discover (vendors: search societies)
POST /vendors/:vendorId/connect/:societyId (connection request)
GET /vendors/:id/dashboard
GET /vendors/:id/contracts
GET /vendors/:id/requests/pending
```

### 8. Society Admin View
- [ ] Incoming vendor requests
- [ ] Vendor comparison interface
- [ ] Contract terms review
- [ ] Approve/reject interface
- [ ] Active vendors list

## Acceptance Criteria
- Vendors can self-register and verify
- Platform admin can approve vendors
- Vendors can discover societies (filtered, privacy-protected)
- Vendors can send connection requests
- Society admins can review and approve vendors
- Vendor dashboard shows scale perception

## Dependencies
- Task 03 (Society Onboarding)

## Estimated Effort
7-10 days

## Privacy & Security
- Never show resident personal data to vendors
- Only show aggregate numbers (household count)
- Society contact only through platform
- Prevent vendor spam (rate limits on requests)
