# Task 11: Utility Intelligence Module

## Objective
Track utility consumption (electricity, water, gas), detect anomalies, and suggest cost-saving opportunities.

## Value Proposition
"Reduce utility bills by 10-20% through data-driven insights."

## Subtasks

### 1. Utility Bill Tracking
- [ ] Bill data model:
  - bill_id
  - society_id
  - utility_type (ELECTRICITY, WATER, GAS, INTERNET, OTHER)
  - billing_period (month, year)
  - units_consumed
  - amount
  - due_date
  - paid_date
  - uploaded_by
  - bill_document (PDF/image)
- [ ] Manual bill upload (society admin)
- [ ] OCR for bill parsing (optional, future)
- [ ] Validation and correction

### 2. Bill Upload Interface (Society Admin)
- [ ] Upload form:
  - Utility type
  - Billing month
  - Units consumed
  - Amount
  - Upload bill copy (PDF/image)
- [ ] Auto-populate from previous bills (for faster entry)
- [ ] Bulk upload (CSV)

### 3. Consumption Tracking
- [ ] Historical consumption data (month-over-month)
- [ ] Units consumed trend
- [ ] Amount paid trend
- [ ] Cost per unit tracking
- [ ] Seasonal patterns (summer vs winter)

### 4. Anomaly Detection
- [ ] Spike detection:
  - "Electricity consumption is 35% higher than last month"
  - "Water usage is unusually high - possible leak?"
- [ ] Billing error detection:
  - "Cost per unit increased suddenly - check bill"
- [ ] Alerts to society admin

### 5. Cost Optimization Suggestions
- [ ] Automated recommendations:
  - "Switch to night tariff for common area lighting - save ₹8,000/month"
  - "Solar panels can offset 60% of electricity bill"
  - "Bulk contract with XYZ Water Supplier can save ₹3,000/month"
- [ ] ROI calculations for suggestions
- [ ] One-click to create proposal (voting)

### 6. Benchmarking
- [ ] Compare with similar societies:
  - "Your electricity consumption per flat is 20% higher than similar societies"
- [ ] Anonymized data from platform (with consent)
- [ ] Best practices sharing

### 7. Savings Calculator
- [ ] Solar potential calculator:
  - Input: Rooftop area, monthly electricity bill
  - Output: Estimated savings, ROI timeline, partner suggestions
- [ ] Rainwater harvesting calculator
- [ ] LED replacement calculator
- [ ] Sensor-based lighting calculator

### 8. Utility Dashboard (Society Admin)
- [ ] Current month expenses
- [ ] Month-over-month comparison
- [ ] Trend charts (last 12 months)
- [ ] Anomalies highlighted
- [ ] Pending bills (reminders)
- [ ] Savings opportunities section
  - "3 actions could save ₹12,000/month"

### 9. Resident View (Optional)
- [ ] Total society utility expenses (transparency)
- [ ] Per-flat share (if metered individually)
- [ ] Savings achieved (if optimization implemented)
- [ ] Conservation tips

### 10. API Endpoints
```
POST /utilities/:societyId/bills (upload bill)
GET /utilities/:societyId/bills (list all bills)
GET /utilities/:societyId/bills/:type/:year/:month
GET /utilities/:societyId/consumption-trend/:type
GET /utilities/:societyId/anomalies
GET /utilities/:societyId/suggestions
POST /utilities/:societyId/solar-calculator
GET /utilities/:societyId/benchmarking
```

### 11. Automated Alerts
- [ ] Bill upload reminder (5th of every month)
- [ ] Payment due reminder
- [ ] Anomaly alert (immediate)
- [ ] Savings opportunity alert (monthly digest)

### 12. Bill Payment Integration (Future)
- [ ] Direct payment from platform
- [ ] Payment status tracking
- [ ] Auto-debit setup

### 13. Sub-Metering Support (Future)
- [ ] Track per-flat consumption (if meters installed)
- [ ] Fair billing based on actual usage
- [ ] Consumption comparison (my flat vs society avg)

## Acceptance Criteria
- Society admins can upload and track utility bills
- Consumption trends are visualized
- Anomalies are detected and alerted
- Cost-saving suggestions are provided
- Residents can see total utility expenses (transparency)
- Savings calculator helps in decision-making

## Dependencies
- Task 06 (Financial Ledger)

## Estimated Effort
5-7 days

## Revenue Impact
- Early leak detection can save ₹10,000 - ₹50,000/incident
- Tariff optimization: 5-10% savings
- Solar installation: 30-60% electricity savings
- Bulk contracts: 10-20% savings

## Future Enhancements
- IoT integration (smart meters)
- Real-time consumption monitoring
- Predictive analytics (forecast next bill)
- Automated bill parsing (OCR + AI)
