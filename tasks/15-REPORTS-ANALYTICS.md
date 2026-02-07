# Task 15: Reports & Analytics

## Objective
Provide actionable insights and downloadable reports for all stakeholders.

## Design Principle
"Show patterns, not just data. Enable decisions, not just information."

## Subtasks

### 1. Society Admin Reports

#### 1.1 Financial Reports
- [ ] Monthly financial summary
  - Income (by category)
  - Expenses (by category)
  - Net surplus/deficit
  - Maintenance offset %
  - Comparison with previous month
- [ ] Year-to-date financial report
- [ ] Custom date range report
- [ ] Downloadable formats: PDF, Excel
- [ ] Email scheduled reports (monthly auto-send)

#### 1.2 Vendor Performance Report
- [ ] Per vendor metrics:
  - Total orders/bookings
  - Average rating
  - SLA compliance %
  - Commission generated for society
  - Resident satisfaction
- [ ] Vendor comparison (side-by-side)
- [ ] Best/worst performing vendors

#### 1.3 Resident Engagement Report
- [ ] Active vs inactive residents
- [ ] Service adoption rate
- [ ] Voting participation rate
- [ ] Maintenance payment compliance
- [ ] App usage metrics

#### 1.4 Asset Utilization Report
- [ ] Per asset:
  - Utilization %
  - Revenue generated
  - Peak usage times
  - Member vs non-member bookings
- [ ] Underutilized assets (opportunities)

#### 1.5 Utility Consumption Report
- [ ] Per utility type:
  - Units consumed (trend)
  - Amount spent (trend)
  - Cost per unit
  - Anomalies detected
  - Savings achieved (if optimization implemented)

---

### 2. Platform Admin Analytics

#### 2.1 Society Analytics
- [ ] Total societies (active, inactive, pending)
- [ ] Society growth (new onboardings per month)
- [ ] Top societies by:
  - Revenue generated
  - Resident adoption
  - Vendor engagement
- [ ] At-risk societies (low engagement, high churn)
- [ ] City-wise distribution (heatmap)

#### 2.2 Vendor Analytics
- [ ] Total vendors (active, pending, flagged)
- [ ] Vendor growth trend
- [ ] Top vendors by:
  - Society count
  - Order volume
  - Rating
- [ ] Service category distribution

#### 2.3 Revenue Analytics
- [ ] Platform revenue (commission from transactions)
- [ ] Revenue by city
- [ ] Revenue by service category
- [ ] Month-over-month growth
- [ ] Projected revenue (forecasting)

#### 2.4 User Analytics
- [ ] Total users (by role)
- [ ] Active users (DAU, MAU)
- [ ] User acquisition funnel
- [ ] Churn rate
- [ ] Feature adoption (which modules are used most)

---

### 3. Resident Reports

#### 3.1 Personal Financial Summary
- [ ] Maintenance paid (year-to-date)
- [ ] Savings achieved (due to society revenue)
- [ ] Service bookings (spending breakdown)
- [ ] Amenity usage
- [ ] Downloadable statement (PDF)

#### 3.2 Society Transparency Report (Read-Only)
- [ ] Simplified version of society financial report
- [ ] Where money comes from
- [ ] Where money goes
- [ ] How it benefits residents

---

### 4. Vendor Reports

#### 4.1 Earnings Report
- [ ] Total earnings (monthly, yearly)
- [ ] Earnings breakdown (per society)
- [ ] Commission deducted
- [ ] Net payout
- [ ] Payout history
- [ ] Downloadable (PDF, Excel) - for taxes

#### 4.2 Performance Report
- [ ] Total orders (trend)
- [ ] Average rating (trend)
- [ ] SLA compliance %
- [ ] Top performing service
- [ ] Resident feedback summary

---

### 5. Analytics Dashboards

#### 5.1 Society Admin Analytics Dashboard
- [ ] Real-time metrics:
  - Current month income
  - Current month expenses
  - Maintenance offset %
  - Active residents
  - Active vendors
- [ ] Trends (charts):
  - Income vs expenses (line chart)
  - Revenue sources (pie chart)
  - Vendor performance (bar chart)
  - Resident adoption (funnel)
  - Utility consumption (area chart)

#### 5.2 Platform Admin Analytics Dashboard
- [ ] Society growth curve
- [ ] User acquisition funnel
- [ ] Revenue heatmap (by city)
- [ ] Vendor distribution (by category)
- [ ] Feature usage (which modules used most)
- [ ] System health (API response times, error rates)

---

### 6. Report Generation Engine

#### 6.1 Automated Reports
- [ ] Scheduled reports:
  - Monthly financial summary (auto-sent to society admin)
  - Quarterly performance review
  - Annual tax report (for vendors)
- [ ] Email delivery
- [ ] Push to cloud storage (optional)

#### 6.2 On-Demand Reports
- [ ] Report builder:
  - Select report type
  - Select date range
  - Select filters (e.g., specific vendor, specific category)
  - Generate
- [ ] Export formats: PDF, Excel, CSV
- [ ] Share via email

#### 6.3 Custom Reports (Advanced)
- [ ] Query builder (for power users)
- [ ] Save custom queries
- [ ] Schedule custom reports

---

### 7. Data Visualizations

#### 7.1 Chart Types
- [ ] Line chart (trends over time)
- [ ] Bar chart (comparisons)
- [ ] Pie chart (distribution)
- [ ] Area chart (stacked trends)
- [ ] Heatmap (geographic or time-based)
- [ ] Funnel chart (conversion rates)

#### 7.2 Interactive Dashboards
- [ ] Click to drill down (e.g., click on income → see breakdown)
- [ ] Date range selector
- [ ] Filter by category, vendor, asset
- [ ] Export current view

---

### 8. API Endpoints

```
# Society Admin
GET /reports/:societyId/financial/:year/:month
GET /reports/:societyId/vendor-performance
GET /reports/:societyId/resident-engagement
GET /reports/:societyId/asset-utilization
GET /reports/:societyId/utility-consumption
POST /reports/:societyId/custom (generate custom report)

# Platform Admin
GET /analytics/platform/societies
GET /analytics/platform/vendors
GET /analytics/platform/revenue
GET /analytics/platform/users

# Resident
GET /reports/resident/:residentId/financial-summary

# Vendor
GET /reports/vendor/:vendorId/earnings/:year/:month
GET /reports/vendor/:vendorId/performance

# Export
POST /reports/export (generate PDF/Excel)
```

---

### 9. Benchmarking (Future)

#### 9.1 Society Benchmarking
- [ ] Compare your society with similar societies:
  - Maintenance offset %
  - Utility consumption per flat
  - Service adoption rate
  - Vendor performance
- [ ] Anonymized data from platform
- [ ] Opt-in for benchmarking

#### 9.2 Best Practices
- [ ] "Top 10% of societies do XYZ"
- [ ] "Your utility consumption is 20% higher than similar societies - here's why"

---

## Acceptance Criteria
- All reports are accurate and up-to-date
- Reports can be downloaded in PDF/Excel
- Dashboards load in < 3 seconds
- Scheduled reports are sent automatically
- Visualizations are clear and actionable
- Custom reports can be created (for power users)
- Benchmarking provides useful insights

## Dependencies
- All previous modules (reports aggregate data from everywhere)

## Estimated Effort
7-10 days

---

## Key Metrics to Track

### Society Admin
- Maintenance offset %
- Resident adoption rate
- Vendor performance score
- Asset utilization %
- Savings per flat

### Platform Admin
- Total societies onboarded
- Total revenue generated for societies
- Platform revenue (commission)
- User growth (MoM, YoY)
- Feature adoption rate

### Resident
- Personal savings (YTD)
- Service usage
- Voting participation

### Vendor
- Total earnings
- Order volume trend
- Rating trend
- SLA compliance %

---

## Visualization Libraries (Recommendations)
- **Chart.js** - Simple, lightweight
- **D3.js** - Powerful, customizable
- **Recharts** - React-friendly
- **Apache ECharts** - Feature-rich

---

## Report Design Guidelines
- Use plain language (no jargon)
- ₹ impact always visible
- Trends with context (not just numbers)
- Actionable insights ("Do this to improve")
- Comparison with previous period
- Color coding (green = good, red = attention needed)
