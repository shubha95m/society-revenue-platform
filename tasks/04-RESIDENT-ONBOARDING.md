# Task 04: Resident (Society Member) Onboarding

## Objective
Enable society members to register, verify their flat, and access their personalized dashboard.

## User Story
As a resident, I want to register on the platform so I can access services and see how my maintenance is being used.

## Subtasks

### 1. Resident Registration Flow
- [ ] Registration page (public)
- [ ] Input fields:
  - Society search/select
  - Building/tower selection
  - Flat number
  - Name
  - Email
  - Phone number
- [ ] OTP verification (phone)
- [ ] Terms and conditions acceptance

### 2. Flat Verification
- [ ] Check if flat exists in system
- [ ] Check if flat is already claimed
- [ ] Society admin approval workflow (if needed)
- [ ] Auto-approve vs manual-approve logic
- [ ] Verification status tracking

### 3. Profile Setup
- [ ] Profile photo upload (optional)
- [ ] Family members addition (optional)
- [ ] Vehicle details (for parking)
- [ ] Emergency contacts
- [ ] Communication preferences (email, SMS, in-app)
- [ ] Language preference

### 4. Onboarding Walkthrough
- [ ] Welcome screen showing savings potential
- [ ] Feature tour (3-4 key screens)
- [ ] How maintenance reduction works
- [ ] How to opt-in to services
- [ ] Skip option for tour

### 5. Email/SMS Notifications
- [ ] Welcome email with login details
- [ ] Verification pending notification
- [ ] Approval confirmation
- [ ] Society admin notification of new resident

### 6. API Endpoints
```
POST /residents/register
POST /residents/verify-otp
GET /societies/:id/flats/available
PUT /residents/:id/profile
GET /residents/:id/verification-status
POST /residents/:id/family-members
PUT /residents/:id/preferences
```

### 7. Society Admin Interface
- [ ] Pending resident verifications list
- [ ] Resident details review
- [ ] Approve/reject with notes
- [ ] Bulk approval option
- [ ] Resident directory (approved residents)

### 8. Resident Dashboard (First Login)
- [ ] Above fold: Potential savings message
  - "Your maintenance could reduce by ₹380/month if adoption reaches 70%"
- [ ] Current maintenance amount
- [ ] Flat details
- [ ] Quick actions: View services, Pay maintenance, Raise complaint
- [ ] Society notices (if any)

## Acceptance Criteria
- Residents can self-register with OTP
- Flat verification prevents duplicate claims
- Society admin can approve/reject residents
- Profile setup is complete
- Resident sees personalized dashboard on first login
- Notifications are sent at each stage

## Dependencies
- Task 03 (Society Onboarding)

## Estimated Effort
5-7 days

## UX Principles to Follow
- Mobile-first design
- One-field-at-a-time for mobile
- Clear progress indication
- No jargon
- Emphasize savings, not features
