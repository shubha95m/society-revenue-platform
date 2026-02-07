# Task 08: Service Marketplace

## Objective
Build the marketplace where residents can discover and book society-approved services with transparent pricing.

## User Story
As a resident, I want to book services (plumber, cleaner, milk, groceries) so I save money through society contracts.

## Design Principle
"Show savings first, service second."

## Subtasks

### 1. Service Catalog
- [ ] Service categories taxonomy:
  - Daily needs (milk, newspaper, groceries)
  - Home maintenance (plumber, electrician, carpenter)
  - Home services (cleaning, pest control, appliance repair)
  - Personal services (salon, tutor, fitness)
  - Healthcare (doctor on call, pharmacy)
- [ ] Service details schema:
  - service_id
  - vendor_id
  - category
  - name
  - description
  - pricing (transparent)
  - society_price (discounted)
  - market_price (for comparison)
  - availability
  - SLA (response time, service window)
  - terms
  - photos

### 2. Service Discovery (Resident View)
- [ ] Home page: Featured services
- [ ] Browse by category
- [ ] Search functionality
- [ ] Filter by:
  - Category
  - Price range
  - Rating
  - Availability (today, this week)
- [ ] Service card showing:
  - Service name
  - Vendor name + rating
  - Society price vs market price
  - "You save ₹90/month" (highlighted)
  - Availability status

### 3. Service Details Page
- [ ] Service description
- [ ] Pricing breakdown
  - Market rate: ₹500
  - Society rate: ₹400
  - Your savings: ₹100 (20%)
- [ ] Vendor details (name, rating, active since)
- [ ] Photos/portfolio
- [ ] Terms and conditions
- [ ] SLA commitment
- [ ] Reviews and ratings (from other residents)
- [ ] "Book Now" button

### 4. Booking Flow
- [ ] One-click opt-in for recurring services (milk, newspaper)
- [ ] Form for on-demand services:
  - Service date and time
  - Flat number (pre-filled)
  - Problem description (for repairs)
  - Preferred time slot
  - Special instructions
- [ ] Price confirmation
- [ ] Booking confirmation
- [ ] Payment options:
  - Pay now (online)
  - Pay on delivery/completion
  - Add to monthly maintenance bill

### 5. Order Management (Resident)
- [ ] My orders/bookings
- [ ] Status tracking:
  - Pending (vendor to confirm)
  - Confirmed (scheduled)
  - In Progress
  - Completed
  - Cancelled
- [ ] Reschedule option
- [ ] Cancel option (with policy)
- [ ] Rate and review after completion
- [ ] Complaint/issue reporting

### 6. Order Management (Vendor)
- [ ] Incoming orders dashboard
- [ ] Order details view
- [ ] Accept/reject order (with reason)
- [ ] Update status (en route, working, completed)
- [ ] Upload completion photos (proof of work)
- [ ] Payment confirmation

### 7. Rating & Review System
- [ ] Resident can rate after service completion
- [ ] 5-star rating
- [ ] Optional text review
- [ ] Photos upload (before/after)
- [ ] Vendor can respond to review
- [ ] Flag inappropriate reviews (society admin moderation)

### 8. API Endpoints
```
GET /services/:societyId (list all approved services)
GET /services/:societyId/category/:category
GET /services/:id (service details)
POST /bookings (create booking)
GET /bookings/resident/:residentId (my bookings)
GET /bookings/vendor/:vendorId (vendor's orders)
PUT /bookings/:id/confirm (vendor confirms)
PUT /bookings/:id/status (update status)
POST /bookings/:id/rate (submit rating)
PUT /bookings/:id/cancel
GET /services/:id/reviews
```

### 9. Society Admin Controls
- [ ] Approve/reject services before they go live
- [ ] Set price ceilings (if needed)
- [ ] Monitor booking volume
- [ ] Handle disputes between resident and vendor
- [ ] Remove service if quality issues

### 10. Pricing Display Rules
- [ ] ALWAYS show society price vs market price
- [ ] ALWAYS highlight savings
- [ ] If no savings, don't push the service
- [ ] Never hide costs

### 11. Recurring Services (Subscriptions)
- [ ] One-time opt-in for daily services (milk, newspaper)
- [ ] Pause/resume functionality
- [ ] Vacation mode (auto-pause)
- [ ] Billing integrated with monthly maintenance

### 12. Service Availability Calendar
- [ ] Vendor sets availability (days, hours)
- [ ] Resident sees available slots
- [ ] Prevent double-booking

## Acceptance Criteria
- Residents can browse and book society-approved services
- Savings are prominently displayed on every service
- Vendors receive and can manage orders
- Order status is tracked in real-time
- Ratings and reviews are visible and fair
- Society admin can moderate the marketplace
- Commission is auto-calculated and added to ledger

## Dependencies
- Task 06 (Financial Ledger)
- Task 07 (Vendor Contract Engine)

## Estimated Effort
10-14 days

## UX Principles
- Mobile-first (residents will book on phones)
- Savings first (not service details)
- One-tap booking for recurring services
- No forced adoption (residents choose)
- Clear cancellation policy
