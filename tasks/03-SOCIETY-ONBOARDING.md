# Task 03: Society Onboarding Module

## Objective
Build the complete flow for onboarding new societies onto the platform.

## User Story
As a Platform Admin, I want to onboard new societies so that they can start using the platform.
As a Society Admin, I want to register my society and set it up so residents can join.

## Subtasks

### 1. Society Registration Form
- [ ] Multi-step form design
  - Step 1: Basic info (name, address, city, pin code)
  - Step 2: Society details (total flats, buildings, amenities)
  - Step 3: Admin details (name, email, phone, role in RWA/MC)
  - Step 4: Verification documents
  - Step 5: Review and submit
- [ ] Form validation (client and server-side)
- [ ] Document upload (society registration, admin ID proof)
- [ ] Progress indicator

### 2. Verification Workflow
- [ ] Platform admin approval queue
- [ ] Document verification interface
- [ ] Approval/rejection flow
- [ ] Email notification on status change
- [ ] Rejection reason capture

### 3. Society Profile Setup
- [ ] Society configuration wizard
  - Buildings/towers setup
  - Flat numbering system
  - Amenities inventory
  - Staff details (guards, housekeeping)
  - Existing vendor list
- [ ] Society logo upload
- [ ] Custom theme selection (colors)
- [ ] Timezone and locale settings

### 4. Initial Data Import
- [ ] Resident bulk import (CSV template)
- [ ] CSV validation
- [ ] Flat-to-resident mapping
- [ ] Error handling and reporting
- [ ] Manual resident addition (one-by-one)

### 5. Financial Setup
- [ ] Current maintenance charge per flat
- [ ] Billing cycle configuration
- [ ] Existing bank account details
- [ ] Opening balance (if migrating from another system)
- [ ] Payment gateway integration setup

### 6. API Endpoints
```
POST /societies/register (society registration request)
GET /societies/pending (admin: list pending approvals)
PUT /societies/:id/approve (admin: approve society)
PUT /societies/:id/reject (admin: reject society)
POST /societies/:id/config (society configuration)
POST /societies/:id/buildings (add buildings)
POST /societies/:id/flats (add flats)
POST /societies/:id/residents/bulk (CSV import)
POST /societies/:id/residents (manual add)
GET /societies/:id/onboarding-status
```

### 7. Onboarding Dashboard (Society Admin)
- [ ] Onboarding progress tracker
- [ ] Pending tasks checklist
- [ ] Help resources and videos
- [ ] Support chat/email option

### 8. Platform Admin Dashboard
- [ ] Pending societies queue
- [ ] Society details review page
- [ ] Document viewer
- [ ] Approval/rejection interface
- [ ] Analytics (onboarding funnel)

## Acceptance Criteria
- Society admins can register their society
- Platform admin can review and approve/reject
- Society configuration is complete and saved
- Residents can be imported in bulk or manually
- Email notifications work at each stage
- Society is ready for resident onboarding after approval

## Dependencies
- Task 02 (Auth System)

## Estimated Effort
7-10 days

## Design Considerations
- Simple, non-technical language
- Mobile-responsive form
- Auto-save draft functionality
- Clear error messages
- Progress not lost on refresh
