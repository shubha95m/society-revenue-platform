# Task 06: Society Financial Ledger (Core Module)

## Objective
Build the immutable, transparent financial ledger that tracks all society income and expenses.

## Design Philosophy
"Every user should see where money comes from and where it goes, in plain language."

## Core Principles
- Immutable records (no deletion, only corrections via new entries)
- Public to all society residents
- Real-time ₹ impact visible
- No accounting jargon

## Subtasks

### 1. Ledger Data Model
- [ ] Immutable transaction table
  - transaction_id (UUID)
  - society_id
  - type (INCOME / EXPENSE)
  - category (vendor_commission, amenity_rental, maintenance_collection, salary, utility_bill, etc.)
  - amount
  - description (plain language)
  - source (where money came from)
  - timestamp
  - created_by (user_id)
  - metadata (JSON for additional context)
- [ ] Audit trail for any corrections
- [ ] Monthly snapshots table (for performance)

### 2. Income Tracking
- [ ] Maintenance collection
  - Per flat, per month
  - Payment status tracking
  - Auto-calculation of total collected
- [ ] Vendor commissions
  - Linked to service bookings
  - Auto-calculated based on contract terms
- [ ] Amenity rentals
  - From asset booking system
- [ ] Asset monetization (solar, telecom tower, etc.)
- [ ] Interest income
- [ ] One-time receipts (donations, etc.)

### 3. Expense Tracking
- [ ] Utility bills (electricity, water, gas)
- [ ] Staff salaries
- [ ] Maintenance and repairs
- [ ] Vendor payments
- [ ] Administrative expenses
- [ ] One-time expenses (capital improvements)

### 4. Financial Calculations
- [ ] Total income (by month, quarter, year)
- [ ] Total expenses (by month, quarter, year)
- [ ] Net surplus/deficit
- [ ] Maintenance offset percentage
  - Formula: (Non-maintenance income / Total expenses) × 100
- [ ] Per-flat impact
  - "Your maintenance could reduce by ₹X/month"
- [ ] Year-over-year comparisons

### 5. Ledger API Endpoints
```
POST /ledger/:societyId/transaction (add entry)
GET /ledger/:societyId/transactions (list all, paginated)
GET /ledger/:societyId/summary (income, expense, net)
GET /ledger/:societyId/summary/:year/:month
GET /ledger/:societyId/maintenance-offset (current month %)
GET /ledger/:societyId/per-flat-impact
POST /ledger/:societyId/transaction/:id/correct (add correction entry)
GET /ledger/:societyId/report/download (PDF/Excel)
```

### 6. Society Admin Dashboard - Money Tab
- [ ] Above fold: "Maintenance Offset This Month: ₹1,42,000 (47%)"
- [ ] 3 cards: Income | Expenses | Net Impact
- [ ] Income breakdown (pie chart)
  - Vendor commissions: 40%
  - Amenity rentals: 25%
  - Maintenance: 35%
- [ ] Expense breakdown (pie chart)
  - Salaries: 50%
  - Utilities: 30%
  - Repairs: 20%
- [ ] Month-over-month trends (line chart)
- [ ] Download report button

### 7. Resident View - Money Tab
- [ ] "Your Flat's Maintenance Breakdown"
- [ ] Current month charge: ₹2,500
- [ ] Income from other sources: ₹1,200
- [ ] Net maintenance: ₹1,300
- [ ] Savings this month: ₹1,200 (48%)
- [ ] Year-to-date savings
- [ ] Society income sources (read-only, simplified view)
- [ ] No expense details (unless society admin enables)

### 8. Transparency Features
- [ ] All residents can see income sources
- [ ] All residents can see total expenses (optional: category-wise)
- [ ] Downloadable monthly reports (PDF)
- [ ] QR code for external audit verification (future)

### 9. Automated Entries
- [ ] Auto-create entries when:
  - Resident pays maintenance
  - Vendor commission earned
  - Amenity booked
  - Service booking completed
- [ ] Batch processing for recurring entries (salaries, bills)

### 10. Corrections & Auditing
- [ ] Correction mechanism (doesn't delete, adds reversal + new entry)
- [ ] Audit log of who made what change
- [ ] Approval workflow for corrections > threshold amount

## Acceptance Criteria
- All financial transactions are recorded immutably
- Society admins see real-time maintenance offset %
- Residents see their personal savings impact
- Ledger is queryable by date range, category
- Reports can be downloaded
- No transaction can be deleted (only corrected)
- Performance: Ledger loads in < 2 seconds for 1 year of data

## Dependencies
- Task 01 (Database Design)
- Task 03 (Society Onboarding)

## Estimated Effort
7-10 days

## Language Guidelines
- Use "Money In" not "Credit" or "Income"
- Use "Money Out" not "Debit" or "Expense"
- Use "Net Impact" not "Balance" or "Surplus"
- Use "Maintenance Offset" not "Revenue Generation"
