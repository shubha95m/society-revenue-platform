# Task 13: Role-Specific Dashboards

## Objective
Create personalized, role-optimized home pages that answer: "What changed since last time?" and "What should I do next?"

## Design Principle
"Money first, features later. No dashboards with menus first."

---

## 1. PLATFORM SUPER ADMIN DASHBOARD

### Mental State
Scale, Risk, Fraud

### Above the Fold
- **Total Societies:** 47 (↑ 3 this month)
- **Total Revenue Generated for Societies:** ₹12.3 Cr this month
- **Total Vendors:** 234 active
- **Platform Health Score:** 92/100 (green)

### Key Sections

#### 1.1 Society Analytics
- [ ] New onboarding requests (pending approval)
- [ ] Active societies map (city-wise heatmap)
- [ ] Top performing societies (by revenue)
- [ ] At-risk societies (low adoption, high churn)

#### 1.2 Vendor Analytics
- [ ] Pending vendor verifications
- [ ] Top vendors by society count
- [ ] Vendor ratings distribution
- [ ] Flagged vendors (SLA breaches, complaints)

#### 1.3 Revenue Analytics
- [ ] Total platform revenue (commission)
- [ ] Revenue by city
- [ ] Revenue by service category
- [ ] Month-over-month growth

#### 1.4 Fraud & Risk Alerts
- [ ] Anomaly alerts
- [ ] Suspicious activity logs
- [ ] Failed payment patterns
- [ ] Cross-tenant access attempts (security)

#### 1.5 Quick Actions
- [ ] Approve pending societies
- [ ] Review flagged vendors
- [ ] Broadcast announcement
- [ ] Generate platform report

---

## 2. SOCIETY ADMIN DASHBOARD

### Mental State
Fear of mistrust, blame, complexity

### Design Goal
Make them feel SAFE, not powerful

### Above the Fold
**"Maintenance Offset This Month: ₹1,42,000 (47%)"**
_Generated via vendor commissions, amenity rentals, and service marketplace_

### Key Sections (ONLY 3 CARDS)

#### 2.1 Money In (Income)
- [ ] Total income this month: ₹2,80,000
- [ ] Breakdown:
  - Vendor commissions: ₹1,10,000 (39%)
  - Amenity rentals: ₹70,000 (25%)
  - Maintenance collected: ₹1,00,000 (36%)
- [ ] Trend: ↑ 12% vs last month

#### 2.2 Money Out (Expenses)
- [ ] Total expenses this month: ₹1,38,000
- [ ] Breakdown:
  - Salaries: ₹70,000 (51%)
  - Utilities: ₹40,000 (29%)
  - Repairs: ₹28,000 (20%)
- [ ] Trend: ↓ 5% vs last month

#### 2.3 Net Impact
- [ ] Surplus this month: ₹1,42,000
- [ ] Per-flat impact: "Maintenance reduced by ₹473/flat"
- [ ] Year-to-date savings: ₹9,80,000

### Below the Fold

#### 2.4 Actions Needed
- [ ] 3 residents waiting approval
- [ ] 2 vendor requests pending
- [ ] 1 active vote (ending in 2 days)
- [ ] 1 expense proposal awaiting approval

#### 2.5 Vendor Performance
- [ ] Active vendors: 8
- [ ] Average rating: 4.6/5
- [ ] SLA compliance: 94%
- [ ] Top vendor: ABC Milk (4.8★, 156 orders)

#### 2.6 Resident Engagement
- [ ] Active residents: 78/120 (65%)
- [ ] Service adoption: 52%
- [ ] Voting participation: 68%
- [ ] Complaint resolution: 95% within 48 hours

#### 2.7 Quick Actions
- [ ] View full ledger
- [ ] Approve pending residents
- [ ] Review vendor contracts
- [ ] Create new proposal

---

## 3. RESIDENT (SOCIETY MEMBER) DASHBOARD

### Mental State
Suspicious, time-poor, doesn't want another app

### Design Goal
Control without effort

### Above the Fold
**"Your maintenance could reduce by ₹380/month if adoption reaches 70%"**
_Current maintenance: ₹2,500 | Potential: ₹2,120_

### Key Sections

#### 3.1 Your Flat
- [ ] Flat number: A-304
- [ ] Current maintenance: ₹2,500/month
- [ ] Due date: 5th Jan 2026
- [ ] Payment status: ✅ Paid
- [ ] Society savings this month: ₹473/flat

#### 3.2 Quick Actions (Max 4)
- [ ] Browse services
- [ ] Pay maintenance
- [ ] Raise complaint
- [ ] Active votes

#### 3.3 Active Votes (if any)
- [ ] "Should we hire XYZ Plumber? Ends in 2 days" → Vote Now

#### 3.4 My Services
- [ ] Active subscriptions (milk, newspaper)
- [ ] Recent orders (last 3)
- [ ] Upcoming bookings (amenity)

#### 3.5 Society Notices
- [ ] Latest 3 announcements (no clutter)

#### 3.6 Savings Breakdown (Expandable)
- [ ] How your ₹473 savings this month was achieved:
  - Vendor commissions: ₹190
  - Amenity rentals: ₹145
  - Utility optimization: ₹138

### What NOT to Show
- ❌ Vendor contract details
- ❌ Society admin activity
- ❌ Complex financial charts
- ❌ Other residents' data

---

## 4. VENDOR DASHBOARD

### Mental State
Wants demand, hates paperwork

### Design Goal
Predictable revenue feeling

### Above the Fold
**"You currently serve 3 societies, 426 households"**
_12% growth in orders this month_

### Key Sections

#### 4.1 This Month
- [ ] Total orders: 342 (↑ 12%)
- [ ] Commission earned: ₹34,500
- [ ] Average rating: 4.7/5
- [ ] SLA compliance: 96%

#### 4.2 Active Contracts
- [ ] Society A (150 flats) - Milk delivery
- [ ] Society B (180 flats) - Plumbing
- [ ] Society C (96 flats) - Cleaning

#### 4.3 Pending Actions
- [ ] 5 new orders awaiting confirmation
- [ ] 2 orders in-progress
- [ ] 1 rating to respond to

#### 4.4 Performance
- [ ] Month-over-month growth chart
- [ ] Top performing service
- [ ] Customer satisfaction trend

#### 4.5 Discover Societies
- [ ] "3 new societies in your area match your services"
- [ ] Send connection request

#### 4.6 Quick Actions
- [ ] View all orders
- [ ] Manage contracts
- [ ] Update availability
- [ ] View earnings report

---

## API Endpoints

```
GET /dashboard/platform-admin
GET /dashboard/society-admin/:societyId
GET /dashboard/resident/:residentId
GET /dashboard/vendor/:vendorId
```

---

## Acceptance Criteria
- Each role sees a personalized dashboard
- Above-the-fold shows ₹ impact immediately
- "What changed?" is answered in 10 seconds
- "What should I do next?" has clear CTAs
- No feature bloat
- Mobile-optimized (all roles)
- Load time < 2 seconds

## Dependencies
- All previous modules (dashboards aggregate data)

## Estimated Effort
7-10 days

---

## Design Validation Checklist

Before shipping any dashboard, ask:
1. ✅ Can a non-tech uncle understand this?
2. ✅ Does this screen explain ₹ impact?
3. ✅ Can the user act in one tap?
4. ✅ Is trust increased or decreased?
5. ✅ Would removing this screen hurt the core promise?
