# Task 16: Complaints & Help Desk System

## Objective
Enable residents to raise issues/complaints and track resolution efficiently.

## User Story
As a resident, I want to report issues (broken lift, plumbing leak, vendor complaint) and track resolution status.

## Subtasks

### 1. Complaint Data Model
- [ ] Complaints table:
  - complaint_id
  - society_id
  - raised_by (user_id - resident)
  - category (MAINTENANCE, VENDOR_SERVICE, AMENITY, STAFF, SECURITY, OTHER)
  - title (short description)
  - description (detailed)
  - priority (LOW, MEDIUM, HIGH, URGENT)
  - status (OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED)
  - assigned_to (staff or vendor, if applicable)
  - created_at
  - resolved_at
  - resolution_notes
  - attachments (photos, videos)
- [ ] Complaint comments/updates table (timeline)

### 2. Raise Complaint (Resident)
- [ ] Simple complaint form:
  - Category (dropdown)
  - Title (max 100 chars)
  - Description (rich text, max 500 words)
  - Upload photos/videos (proof)
  - Priority (auto-suggested based on keywords, editable)
- [ ] Submit button
- [ ] Confirmation message with complaint ID
- [ ] Email/SMS notification with complaint ID

### 3. Complaint Categories
- [ ] **Maintenance**
  - Lift, plumbing, electrical, carpentry, painting, etc.
- [ ] **Vendor Service**
  - Service quality issue, billing dispute, SLA breach
- [ ] **Amenity**
  - Gym equipment broken, clubhouse cleanliness, pool issue
- [ ] **Staff**
  - Security, housekeeping behavior or performance
- [ ] **Security**
  - Unauthorized entry, suspicious activity, parking dispute
- [ ] **Other**
  - Anything not fitting above categories

### 4. Priority Auto-Suggestion Logic
- [ ] HIGH: Keywords like "urgent", "emergency", "fire", "water leak"
- [ ] MEDIUM: General maintenance, vendor issues
- [ ] LOW: Suggestions, feedback, non-urgent requests

### 5. Complaint Tracking (Resident)
- [ ] My complaints list (filterable by status)
- [ ] Complaint detail page:
  - Complaint ID
  - Status badge (color-coded)
  - Timeline:
    - Raised on: [date]
    - Assigned to: [staff/vendor]
    - Updated on: [date] - [status change]
    - Resolved on: [date]
  - Description
  - Attachments
  - Comments (back-and-forth with admin/vendor)
- [ ] Add comment/follow-up
- [ ] Close complaint (if satisfied)
- [ ] Reopen complaint (if issue persists)
- [ ] Rate resolution (1-5 stars)

### 6. Complaint Management (Society Admin)
- [ ] Incoming complaints dashboard
- [ ] Filter by:
  - Status
  - Category
  - Priority
  - Date range
- [ ] Sort by:
  - Latest
  - Priority (highest first)
  - Overdue (SLA breach)
- [ ] Complaint detail view (same as resident, plus admin actions)
- [ ] Assign complaint:
  - To staff (internal)
  - To vendor (if service-related)
- [ ] Update status
- [ ] Add internal notes (not visible to resident)
- [ ] Add public comment (visible to resident)
- [ ] Mark as resolved
- [ ] Close complaint

### 7. SLA & Escalation
- [ ] Define SLA per category:
  - URGENT: 2 hours response, 24 hours resolution
  - HIGH: 6 hours response, 48 hours resolution
  - MEDIUM: 12 hours response, 7 days resolution
  - LOW: 24 hours response, 14 days resolution
- [ ] Auto-escalate if SLA breached:
  - Notify society admin
  - Mark as overdue (red flag)
- [ ] Dashboard alert for overdue complaints

### 8. Vendor Assignment
- [ ] If complaint is vendor-related (service booking issue):
  - Auto-assign to vendor
  - Vendor receives notification
  - Vendor can view complaint details
  - Vendor updates status
- [ ] Track vendor complaint resolution performance

### 9. Staff Assignment (Future)
- [ ] If complaint is maintenance-related:
  - Assign to specific staff (plumber, electrician, etc.)
  - Staff receives notification
  - Staff updates status via mobile app (Phase 2)

### 10. Complaint Analytics
- [ ] Society admin dashboard:
  - Total complaints (this month)
  - Resolved complaints
  - Average resolution time
  - Complaints by category (pie chart)
  - Overdue complaints count
  - Resident satisfaction (avg rating)
- [ ] Trend analysis (are complaints increasing/decreasing?)

### 11. API Endpoints
```
POST /complaints/:societyId (raise complaint)
GET /complaints/:societyId (list all, filterable)
GET /complaints/:id (complaint details)
PUT /complaints/:id/assign (assign to staff/vendor)
PUT /complaints/:id/status (update status)
POST /complaints/:id/comment (add comment)
POST /complaints/:id/close
POST /complaints/:id/reopen
POST /complaints/:id/rate (resident rates resolution)
GET /complaints/:societyId/analytics
```

### 12. Notifications
- [ ] **Resident:**
  - Complaint received (confirmation)
  - Status changed (in-progress, resolved)
  - Admin/vendor commented
  - Reminder to rate resolution (if not rated within 7 days)
- [ ] **Society Admin:**
  - New complaint received
  - Complaint overdue (SLA breach)
  - Complaint closed by resident
- [ ] **Vendor:**
  - Complaint assigned to you
  - Resident added follow-up comment

### 13. Public Complaint Board (Optional)
- [ ] Display resolved complaints publicly (transparency):
  - Category: Lift repair
  - Issue: Lift stuck between floors
  - Resolved in: 4 hours
  - Action taken: Mechanic called, issue fixed
- [ ] Residents can see society is responsive
- [ ] Hide sensitive complaints (security, personal disputes)

### 14. Recurring Issue Detection (Future)
- [ ] If same issue raised multiple times:
  - Flag to society admin
  - "Lift complaints increased by 300% this month - consider AMC upgrade"

## Acceptance Criteria
- Residents can raise complaints easily (mobile-optimized)
- Society admin can view, assign, and track complaints
- Vendors can view and resolve assigned complaints
- SLA is enforced with escalations
- Residents can track complaint status in real-time
- Resolution is rated by residents
- Analytics show complaint trends

## Dependencies
- Task 04 (Resident Onboarding)
- Task 12 (Notifications System)

## Estimated Effort
5-7 days

## UX Principles
- Simple form (no overwhelming fields)
- Clear status tracking (timeline view)
- Fast response (acknowledge immediately)
- Transparency (resident always knows status)
- Accountability (assigned person is named)

## Anti-Patterns to Avoid
- ❌ Complex multi-step complaint forms
- ❌ Black box (resident doesn't know status)
- ❌ No response for days
- ❌ Admin-only visibility (residents can't track)
