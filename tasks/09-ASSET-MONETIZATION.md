# Task 09: Asset Monetization Module

## Objective
Enable societies to identify, track, and monetize underutilized assets (clubhouse, rooftop, parking, etc.).

## Revenue Streams Covered
- Amenity rentals (to non-members)
- Rooftop space (solar panels, telecom towers)
- Guest parking
- Advertising spaces (building walls, gates - ethical only)
- Co-working space
- EV charging stations

## Subtasks

### 1. Asset Inventory System
- [ ] Asset registry:
  - asset_id
  - society_id
  - type (clubhouse, rooftop, parking_slot, wall_space, gym, pool, etc.)
  - name
  - description
  - capacity
  - location (building, floor)
  - acquisition_cost (if applicable)
  - current_utilization (%)
  - status (ACTIVE, UNDER_MAINTENANCE, INACTIVE)
  - monetization_enabled (boolean)
  - pricing_model
  - photos
- [ ] Asset categories predefined + custom option

### 2. Asset Setup Wizard (Society Admin)
- [ ] List all society assets
- [ ] Mark which are monetizable
- [ ] Set pricing for each asset:
  - Hourly/daily/monthly rate
  - Member vs non-member pricing
  - Peak vs off-peak rates (optional)
- [ ] Set booking rules:
  - Advance booking window
  - Cancellation policy
  - Max booking duration
  - Member priority (if enabled)
- [ ] Set capacity and availability
- [ ] Upload photos

### 3. Asset Booking System (for Amenities)
- [ ] Resident view:
  - Browse available amenities
  - Check availability calendar
  - Book slot (free or paid)
  - View my bookings
- [ ] Non-member view (if society allows):
  - Browse public amenities
  - Higher pricing
  - Payment upfront mandatory
  - Approval required (society admin)

### 4. Booking Management
- [ ] Booking creation (resident/external)
- [ ] Approval workflow (if needed)
- [ ] Calendar view (day, week, month)
- [ ] Conflict prevention (no double-booking)
- [ ] Payment integration
- [ ] Booking confirmation (email/SMS)
- [ ] Check-in/check-out system (optional)

### 5. Monetization Tracking
- [ ] Revenue per asset (monthly, yearly)
- [ ] Utilization percentage
- [ ] Peak usage times
- [ ] Member vs non-member revenue split
- [ ] Auto-add revenue to ledger

### 6. Special Monetization: Rooftop Space
- [ ] Solar panel calculator:
  - Available rooftop area
  - Estimated energy generation
  - Installation cost
  - ROI timeline
  - Partner search (solar companies)
- [ ] Telecom tower:
  - Rent negotiation helper
  - Contract templates
  - Monthly recurring revenue tracking

### 7. Special Monetization: Parking
- [ ] Guest parking slots
- [ ] Hourly/daily pricing
- [ ] QR code-based entry/exit
- [ ] Payment integration
- [ ] Revenue tracking

### 8. Special Monetization: EV Charging
- [ ] Charging station inventory
- [ ] Usage tracking (kWh)
- [ ] Pricing per unit
- [ ] Payment integration
- [ ] Revenue share with society

### 9. Analytics Dashboard (Society Admin)
- [ ] Total monetizable assets
- [ ] Active vs inactive assets
- [ ] Revenue per asset (bar chart)
- [ ] Utilization heatmap
- [ ] Recommendations:
  - "Clubhouse is only 40% utilized. Consider opening to outsiders on weekends."
  - "Rooftop is underutilized. Install solar panels for ₹15,000/month savings."

### 10. API Endpoints
```
POST /assets/:societyId (add asset)
GET /assets/:societyId (list all assets)
PUT /assets/:id (update asset)
GET /assets/:id/availability (calendar)
POST /assets/:id/book (create booking)
GET /bookings/:societyId (all bookings)
PUT /bookings/:id/approve (admin approves)
PUT /bookings/:id/cancel
GET /assets/:societyId/revenue-report
GET /assets/:id/utilization
POST /assets/:societyId/solar/calculate (solar ROI calculator)
```

### 11. Resident View
- [ ] Browse amenities
- [ ] Book amenity (simple flow)
- [ ] View my bookings
- [ ] Cancel/reschedule
- [ ] Pay booking fee (if applicable)
- [ ] See how amenity revenue reduces maintenance
  - "Clubhouse rentals saved you ₹45 this month"

### 12. External Booking (Optional)
- [ ] Public booking page (if society enables)
- [ ] Non-member registration (basic details only)
- [ ] Higher pricing displayed clearly
- [ ] Payment gateway integration
- [ ] Society admin approval required
- [ ] Access control (QR code/OTP for entry)

### 13. Approval Workflows
- [ ] Auto-approve member bookings (default)
- [ ] Approval required for:
  - Non-member bookings
  - High-value assets (clubhouse for weddings)
  - Off-hours bookings

## Acceptance Criteria
- Society admins can inventory and price assets
- Residents can book amenities easily
- Non-members can book (if enabled) with approval
- Revenue from bookings flows to ledger automatically
- Utilization analytics guide monetization decisions
- Special monetization (solar, telecom, parking, EV) is trackable

## Dependencies
- Task 06 (Financial Ledger)

## Estimated Effort
10-14 days

## Revenue Impact Examples
- Clubhouse rentals to outsiders: ₹50,000 - ₹2,00,000/month
- Rooftop solar: ₹10,000 - ₹30,000/month (savings + sell back)
- Telecom tower: ₹15,000 - ₹40,000/month (fixed rent)
- Guest parking: ₹5,000 - ₹20,000/month
- EV charging: ₹5,000 - ₹15,000/month

## Ethical Guidelines
- No intrusive advertising (no resident data used)
- No exclusive contracts that harm residents
- Member priority always maintained
- Transparent revenue sharing
