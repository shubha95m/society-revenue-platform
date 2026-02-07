# Task 07: Vendor Contract Engine

## Objective
Manage vendor-society contracts with clear terms, commission tracking, and performance SLAs.

## Core Requirements
- Simple contract language (no legal jargon)
- Commission auto-calculation
- SLA tracking
- Auto-renewal logic
- Exit clauses

## Subtasks

### 1. Contract Data Model
- [ ] Contracts table:
  - contract_id
  - society_id
  - vendor_id
  - service_category
  - start_date
  - end_date
  - auto_renew (boolean)
  - status (DRAFT, ACTIVE, EXPIRED, TERMINATED)
  - commission_type (PERCENTAGE, FIXED_PER_UNIT, FLAT_MONTHLY)
  - commission_value
  - minimum_volume (if applicable)
  - sla_terms (JSON)
  - created_by
  - approved_by
  - signed_at
- [ ] Contract terms table (key-value pairs for flexibility)
- [ ] Contract amendments table (track changes)

### 2. Contract Creation Flow
- [ ] Society admin initiates from vendor request OR manually
- [ ] Contract builder form:
  - Service category
  - Pricing structure
  - Commission terms
  - Service quality expectations (SLA)
  - Payment cycle (weekly, monthly)
  - Minimum volume commitment
  - Exit terms
  - Auto-renewal checkbox
- [ ] Preview contract in plain language
- [ ] Send to vendor for review
- [ ] Vendor accepts/rejects/negotiates
- [ ] Final approval by society admin

### 3. SLA (Service Level Agreement) Terms
- [ ] Define measurable SLAs:
  - Response time (e.g., plumber arrives within 2 hours)
  - Service completion time
  - Quality standards (e.g., 4+ star average rating)
  - Availability (e.g., 24/7 or specific hours)
- [ ] SLA breach tracking
- [ ] Penalties for breach (commission reduction, warning, termination)

### 4. Commission Calculation Engine
- [ ] Percentage-based:
  - Example: 10% of every transaction
- [ ] Fixed per unit:
  - Example: ₹5 per milk packet delivered
- [ ] Flat monthly:
  - Example: ₹10,000/month for gym management
- [ ] Volume-based tiers:
  - Example: 0-100 orders = 10%, 101-500 = 12%, 500+ = 15%
- [ ] Auto-calculate commission on each transaction
- [ ] Monthly commission summary per vendor

### 5. Performance Tracking
- [ ] Metrics per contract:
  - Total orders/bookings
  - Average rating
  - SLA compliance %
  - Revenue generated for society
  - Commission earned by vendor
- [ ] Performance dashboard (society admin)
- [ ] Vendor comparison view
- [ ] Alerts for SLA breaches

### 6. Contract Lifecycle Management
- [ ] Active contracts list
- [ ] Expiring contracts alerts (30 days before)
- [ ] Auto-renewal logic (if enabled)
- [ ] Renewal negotiation flow
- [ ] Contract termination workflow:
  - Notice period enforcement
  - Final settlement calculation
  - Resident notification (service will stop)
- [ ] Contract archive (historical reference)

### 7. API Endpoints
```
POST /contracts (create new contract)
GET /contracts/:societyId (list all contracts for society)
GET /contracts/:societyId/vendor/:vendorId
PUT /contracts/:id (update contract)
POST /contracts/:id/send-for-approval (vendor reviews)
PUT /contracts/:id/approve (vendor/admin approval)
PUT /contracts/:id/renew
PUT /contracts/:id/terminate
GET /contracts/:id/performance
GET /contracts/:id/commission-summary/:year/:month
POST /contracts/:id/sla-breach (log breach)
```

### 8. Society Admin Interface
- [ ] Active contracts dashboard
- [ ] Contract details view
- [ ] Vendor comparison (side-by-side)
- [ ] Commission summary (how much saved vs market rate)
- [ ] SLA compliance report
- [ ] Termination interface

### 9. Vendor Interface
- [ ] My contracts list
- [ ] Contract details view
- [ ] Performance metrics
- [ ] Commission earned (monthly, yearly)
- [ ] Renewal request option
- [ ] Termination request (with notice)

### 10. Resident Visibility (Optional)
- [ ] Residents can see:
  - Which vendors are approved
  - Service categories available
  - Contract tenure (for trust)
- [ ] Residents CANNOT see:
  - Commission rates (to avoid vendor discomfort)
  - Negotiation history

### 11. Automated Workflows
- [ ] Auto-create commission entries in ledger after each transaction
- [ ] Auto-send expiry reminders
- [ ] Auto-renew if enabled and both parties consent
- [ ] Auto-terminate if expired and not renewed

## Acceptance Criteria
- Contracts can be created in simple language
- Commission is auto-calculated accurately
- SLA breaches are tracked and penalized
- Performance metrics are visible to society admin
- Vendors can view their contract status and earnings
- Auto-renewal works correctly
- Historical contracts are archived

## Dependencies
- Task 05 (Vendor Onboarding)
- Task 06 (Financial Ledger)

## Estimated Effort
7-10 days

## Plain Language Examples
Instead of: "Party A agrees to provide services to Party B..."
Use: "ABC Milk Dairy will deliver milk daily to residents who opt-in."

Instead of: "Liquidated damages clause..."
Use: "If service is delayed by more than 2 hours, society gets ₹500 credit."
