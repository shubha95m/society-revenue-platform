# Task 12: Notifications System

## Objective
Keep users informed about critical events without spamming.

## Design Philosophy
"Only for: Money change, Required action, No marketing."

## Notification Principles
- ✅ Money-related (maintenance offset, payment due)
- ✅ Action-required (vote pending, booking confirmation)
- ✅ Security/alerts (anomaly detected, SLA breach)
- ❌ Marketing (new features, tips) - unless user opts in
- ❌ Spam (vendor promotions) - strictly prohibited

## Subtasks

### 1. Notification Infrastructure
- [ ] Notification data model:
  - notification_id
  - user_id (recipient)
  - society_id (if applicable)
  - type (MONEY, ACTION_REQUIRED, ALERT, INFO)
  - priority (HIGH, MEDIUM, LOW)
  - title (short)
  - message (plain text)
  - action_url (deep link to relevant page)
  - read_status (boolean)
  - created_at
  - expires_at (optional)
- [ ] Notification preferences table (user settings)

### 2. Delivery Channels
- [ ] In-app notifications (primary)
- [ ] Email (for important events)
- [ ] SMS (for critical events only)
- [ ] Push notifications (mobile app - Phase 2)
- [ ] WhatsApp (future, opt-in)

### 3. Notification Types & Triggers

#### Money-Related
- [ ] Maintenance offset changed
  - "Your maintenance reduced by ₹50 this month!"
- [ ] Payment due
  - "₹2,500 maintenance due by 5th Jan"
- [ ] Payment received
  - "Payment of ₹2,500 received. Thank you!"
- [ ] Commission earned (vendor)
  - "You earned ₹8,500 commission this month"

#### Action-Required
- [ ] New vote
  - "Vote on: Should we hire XYZ Plumber? Ends in 3 days"
- [ ] Booking confirmation needed (vendor)
  - "New booking request for plumbing service"
- [ ] Document pending (onboarding)
  - "Complete your profile to access services"
- [ ] Approval needed (admin)
  - "5 residents waiting for approval"

#### Alerts
- [ ] Utility anomaly
  - "Water consumption 40% higher than last month - possible leak?"
- [ ] SLA breach
  - "ABC Vendor missed SLA 3 times this month"
- [ ] Contract expiring
  - "Milk vendor contract expires in 15 days"
- [ ] System security alert
  - "Unusual login from new device"

#### Informational (Low Priority)
- [ ] New service available
  - "Plumbing services now available through society contract"
- [ ] Society announcement
  - "AGM scheduled for 15th Jan at 6 PM"
- [ ] Vendor performance update
  - "XYZ Cleaner maintained 4.8 star rating this month"

### 4. User Preferences
- [ ] Notification settings page:
  - In-app: Always on (can't disable critical)
  - Email: Toggle per category
  - SMS: Critical only (default)
  - Frequency: Real-time / Daily digest / Weekly digest
- [ ] Quiet hours (e.g., no notifications 10 PM - 8 AM)
- [ ] Category-wise control:
  - Money notifications: Always
  - Action required: Always
  - Alerts: Always
  - Informational: Optional
- [ ] Per-society settings (if user in multiple societies)

### 5. In-App Notification Center
- [ ] Notification bell icon (with unread count badge)
- [ ] Notification list (grouped by date)
- [ ] Mark as read
- [ ] Mark all as read
- [ ] Filter by category
- [ ] Deep links to relevant pages

### 6. Email Notifications
- [ ] Branded email templates
- [ ] Plain text + HTML versions
- [ ] Unsubscribe link (for non-critical)
- [ ] Action buttons in email (e.g., "Vote Now")
- [ ] Daily digest option (batched notifications)

### 7. SMS Notifications
- [ ] Critical only (payment due, security alerts)
- [ ] Character limit optimization
- [ ] Link shortening
- [ ] Delivery status tracking

### 8. Notification Queue & Scheduling
- [ ] Background job queue (Redis, Bull, etc.)
- [ ] Retry logic for failed deliveries
- [ ] Rate limiting (avoid spam)
- [ ] Batch processing for bulk notifications

### 9. API Endpoints
```
POST /notifications/send (internal: trigger notification)
GET /notifications/user/:userId (fetch user notifications)
PUT /notifications/:id/read (mark as read)
PUT /notifications/user/:userId/read-all
DELETE /notifications/:id
GET /notifications/user/:userId/preferences
PUT /notifications/user/:userId/preferences
GET /notifications/user/:userId/unread-count
```

### 10. Notification Templates
- [ ] Template engine (e.g., Handlebars)
- [ ] Variables support ({{user_name}}, {{amount}}, etc.)
- [ ] Multi-language support (English, Hindi, regional)
- [ ] Template versioning

### 11. Analytics & Monitoring
- [ ] Delivery success rate
- [ ] Open rate (email)
- [ ] Click-through rate (action URLs)
- [ ] Unsubscribe rate
- [ ] User engagement by notification type

### 12. Admin Controls (Platform Admin)
- [ ] Broadcast notification to all users
- [ ] Broadcast to specific society
- [ ] Broadcast to specific role (all vendors, all admins)
- [ ] Schedule notifications
- [ ] Preview notification before sending

## Acceptance Criteria
- Users receive notifications for critical events
- No spam or marketing notifications
- Users can control notification preferences
- In-app notification center works smoothly
- Email and SMS delivery is reliable
- Deep links navigate to correct pages
- Unread count is accurate

## Dependencies
- Task 02 (Auth System)
- All feature modules (triggers notifications)

## Estimated Effort
5-7 days

## Anti-Patterns to Avoid
- ❌ "You haven't visited in 3 days" (retention spam)
- ❌ "Check out our new feature!" (feature marketing)
- ❌ "ABC Vendor has a new offer" (vendor marketing)
- ❌ Daily notifications for non-urgent info

## Best Practices
- Group multiple notifications into digest (if not urgent)
- Respect user's quiet hours
- Always allow opt-out (except critical)
- Test notification fatigue (track unsubscribe rate)
