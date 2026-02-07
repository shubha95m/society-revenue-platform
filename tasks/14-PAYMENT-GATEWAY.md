# Task 14: Payment Gateway Integration

## Objective
Enable residents to pay maintenance, book services, and pay for amenities online; enable vendors to receive payments seamlessly.

## Payment Flows
1. Resident → Society (maintenance payment)
2. Resident → Vendor (service booking payment)
3. Resident → Society (amenity booking payment)
4. Society → Vendor (commission settlement)
5. External → Society (non-member amenity booking)

## Subtasks

### 1. Payment Gateway Selection
- [ ] Evaluate gateways (Razorpay, Stripe, PayU, Paytm)
- [ ] Requirements:
  - Indian market support
  - Multiple payment methods (UPI, cards, net banking, wallets)
  - Recurring payments (auto-debit for maintenance)
  - Split payments (for commissions)
  - Settlement to multiple accounts (society, vendor)
  - Low transaction fees
  - Good developer docs & support
- [ ] Decision: _[Choose one]_

### 2. Payment Data Model
- [ ] Payments table:
  - payment_id (UUID)
  - transaction_id (from gateway)
  - society_id
  - payer_id (user_id)
  - payee_id (user_id or society_id)
  - payment_type (MAINTENANCE, SERVICE_BOOKING, AMENITY_BOOKING, COMMISSION)
  - amount
  - currency (INR)
  - payment_method (UPI, CARD, NET_BANKING, WALLET)
  - status (PENDING, SUCCESS, FAILED, REFUNDED)
  - gateway_response (JSON)
  - created_at
  - completed_at
- [ ] Refunds table (for cancellations)
- [ ] Settlement table (vendor payouts)

### 3. Maintenance Payment
- [ ] Resident view:
  - "Pay Maintenance" button on dashboard
  - Shows due amount, due date
  - Payment method selection
  - Auto-debit option (recurring payment setup)
- [ ] Payment flow:
  - Initiate payment → Gateway checkout → Success/Failure
  - Receipt generation (PDF)
  - Email confirmation
  - Auto-update ledger
- [ ] Auto-debit setup:
  - Consent collection
  - Mandate creation (e.g., NACH, eMandate)
  - Auto-charge on due date
  - Failure handling & retries

### 4. Service Booking Payment
- [ ] Payment at booking:
  - Option 1: Pay now (online)
  - Option 2: Pay on completion (COD)
  - Option 3: Add to next month's maintenance bill
- [ ] Split payment logic:
  - Calculate vendor share (after commission)
  - Calculate society commission
  - Auto-split to respective accounts
- [ ] Escrow for "Pay on completion":
  - Hold payment until service completed
  - Release on resident confirmation
  - Auto-release after 48 hours (if no dispute)

### 5. Amenity Booking Payment
- [ ] Member booking:
  - Free (if society policy) or paid
  - Payment at booking time
- [ ] Non-member booking:
  - Payment mandatory upfront
  - Higher pricing

### 6. Vendor Payout (Commission Settlement)
- [ ] Payout schedule:
  - Weekly / Bi-weekly / Monthly (configurable per vendor)
- [ ] Payout calculation:
  - Total orders completed in period
  - Deduct commission as per contract
  - Deduct penalties (if SLA breaches)
  - Net payout amount
- [ ] Payout methods:
  - Direct bank transfer (NEFT/RTGS/UPI)
  - Razorpay Route (automated payouts)
- [ ] Payout dashboard (vendor):
  - Upcoming payout date
  - Payout history
  - Breakdown (orders, commission, penalties)

### 7. Society Payout (for external bookings)
- [ ] When non-members book amenities:
  - Payment goes to society account
  - Auto-added to ledger as income

### 8. Payment Gateway Integration
- [ ] Backend integration:
  - Create order API
  - Verify payment signature (security)
  - Webhook handling (payment status updates)
  - Refund API
  - Payout API (for vendor settlements)
- [ ] Frontend integration:
  - Checkout SDK/library
  - Responsive payment UI
  - Success/failure screens
  - Receipt download

### 9. Payment Receipt
- [ ] Auto-generate receipt on successful payment
- [ ] Details:
  - Receipt number
  - Date & time
  - Payer details
  - Payee (society/vendor)
  - Amount
  - Payment method
  - Transaction ID
- [ ] Downloadable PDF
- [ ] Email to payer

### 10. Refund Handling
- [ ] Scenarios:
  - Service booking cancelled
  - Amenity booking cancelled (as per policy)
  - Overpayment
- [ ] Refund flow:
  - Request refund (with reason)
  - Society admin approval
  - Initiate refund via gateway
  - Refund status tracking
  - Email notification
- [ ] Refund timeline: 5-7 business days (gateway dependent)

### 11. Failed Payment Handling
- [ ] Auto-retry logic (for maintenance auto-debit)
- [ ] Notification to resident on failure
- [ ] Grace period before late fee
- [ ] Multiple payment method fallback

### 12. API Endpoints
```
POST /payments/initiate (create payment order)
POST /payments/verify (verify payment signature)
POST /payments/webhook (gateway callback)
GET /payments/:paymentId (payment status)
GET /payments/resident/:residentId (payment history)
POST /payments/refund/:paymentId
GET /payments/receipt/:paymentId (download PDF)
POST /payments/auto-debit/setup (mandate creation)
POST /payouts/vendor/:vendorId/calculate (payout calculation)
POST /payouts/vendor/:vendorId/initiate
GET /payouts/vendor/:vendorId/history
```

### 13. Payment Reports
- [ ] Society admin reports:
  - Total maintenance collected (monthly)
  - Collection efficiency (% of flats paid on time)
  - Payment method breakdown
  - Failed payments
- [ ] Vendor reports:
  - Earnings (monthly, yearly)
  - Commission deducted
  - Payout history

### 14. Security & Compliance
- [ ] PCI DSS compliance (if storing card data - AVOID)
- [ ] Use gateway's tokenization
- [ ] SSL/TLS for all payment pages
- [ ] Webhook signature verification
- [ ] Fraud detection (gateway's built-in)
- [ ] Rate limiting on payment APIs

### 15. Testing
- [ ] Sandbox environment setup
- [ ] Test all payment methods
- [ ] Test refund flow
- [ ] Test auto-debit mandate
- [ ] Test split payments
- [ ] Test webhook handling (success, failure, timeout)

## Acceptance Criteria
- Residents can pay maintenance online (one-time & auto-debit)
- Service bookings can be paid online with commission auto-split
- Amenity bookings can be paid online
- Vendors receive payouts on schedule
- Receipts are generated and emailed
- Refunds work correctly
- Failed payments are retried and notified
- All transactions are logged immutably

## Dependencies
- Task 06 (Financial Ledger)
- Task 08 (Service Marketplace)
- Task 09 (Asset Monetization)

## Estimated Effort
7-10 days

## Gateway Recommendation
**Razorpay** (for Indian market):
- UPI, cards, net banking, wallets
- Recurring payments (auto-debit)
- Route (split payments, automated payouts)
- Good documentation
- Reasonable pricing (~2% transaction fee)

## Testing Checklist
- [ ] Successful payment flow
- [ ] Failed payment flow
- [ ] Refund flow
- [ ] Auto-debit setup
- [ ] Webhook handling
- [ ] Split payment accuracy
- [ ] Receipt generation
- [ ] Vendor payout calculation
