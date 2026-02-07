# Task 17: Notices & Announcements

## Objective
Enable society admins to broadcast important notices to all residents.

## Use Cases
- AGM/meeting announcements
- Water supply interruption
- Festival greetings
- Rule changes
- Emergency alerts
- Event invitations

## Subtasks

### 1. Notice Data Model
- [ ] Notices table:
  - notice_id
  - society_id
  - title
  - content (rich text)
  - category (ANNOUNCEMENT, ALERT, EVENT, RULE_CHANGE, EMERGENCY)
  - priority (LOW, NORMAL, HIGH)
  - published_by (society admin user_id)
  - published_at
  - expires_at (optional - for time-sensitive notices)
  - status (DRAFT, PUBLISHED, ARCHIVED)
  - attachments (PDFs, images)
  - pinned (boolean - stay at top)
- [ ] Notice read receipts table (track who viewed)

### 2. Create Notice (Society Admin)
- [ ] Notice composer:
  - Title (max 150 chars)
  - Content (rich text editor - bold, italic, lists, links)
  - Category (dropdown)
  - Priority (affects notification behavior)
  - Upload attachments (PDFs, images)
  - Set expiry date (optional)
  - Pin to top (checkbox)
  - Preview before publish
- [ ] Save as draft
- [ ] Publish immediately
- [ ] Schedule publish (future date/time)

### 3. Notice Board (Resident View)
- [ ] Notices list (reverse chronological)
- [ ] Pinned notices at top
- [ ] Notice card showing:
  - Title
  - Category badge
  - Published date
  - "New" badge (if unread)
  - Excerpt (first 2 lines)
- [ ] Filter by category
- [ ] Search notices
- [ ] Expired notices auto-hidden (or moved to archive)

### 4. Notice Detail Page
- [ ] Full title
- [ ] Full content (rich text rendered)
- [ ] Category and priority
- [ ] Published by (admin name)
- [ ] Published date
- [ ] Attachments (downloadable)
- [ ] Mark as read (auto on open)
- [ ] Share notice (copy link, WhatsApp, email)

### 5. Notice Categories & Badges
- [ ] **ANNOUNCEMENT** - Blue badge (general info)
- [ ] **ALERT** - Orange badge (important, attention needed)
- [ ] **EVENT** - Green badge (social events, festivals)
- [ ] **RULE_CHANGE** - Yellow badge (policy updates)
- [ ] **EMERGENCY** - Red badge (urgent, critical)

### 6. Priority-Based Notifications
- [ ] **LOW:** In-app only (no email/SMS)
- [ ] **NORMAL:** In-app + email
- [ ] **HIGH (EMERGENCY):** In-app + email + SMS

### 7. Notice Management (Society Admin)
- [ ] All notices list (published, drafts, archived)
- [ ] Edit published notice (versioning - track changes)
- [ ] Archive notice (hide from residents, but keep in system)
- [ ] Delete draft
- [ ] View analytics:
  - Total views (how many residents opened)
  - Read rate (% of residents who viewed)
  - Unread residents list (for follow-up)

### 8. Scheduled Notices
- [ ] Admin can schedule notice for future:
  - "Publish on 15th Jan at 9 AM"
- [ ] System auto-publishes at scheduled time
- [ ] Admin can edit/cancel before scheduled time

### 9. API Endpoints
```
POST /notices/:societyId (create notice)
GET /notices/:societyId (list all published notices)
GET /notices/:id (notice details)
PUT /notices/:id (edit notice)
PUT /notices/:id/publish (publish draft)
PUT /notices/:id/archive
DELETE /notices/:id (delete draft only)
POST /notices/:id/read (mark as read by resident)
GET /notices/:id/analytics (admin: view read stats)
GET /notices/:societyId/unread (resident: unread notices count)
```

### 10. Resident Dashboard Integration
- [ ] Show latest 3 notices on home page
- [ ] "View All Notices" button
- [ ] Unread count badge

### 11. Notifications
- [ ] **Resident:**
  - New notice published (based on priority)
  - Reminder for unread emergency notices (after 24 hours)
- [ ] **Society Admin:**
  - Scheduled notice published (confirmation)

### 12. Notice Templates (Society Admin)
- [ ] Pre-defined templates for common notices:
  - AGM announcement
  - Water supply interruption
  - Festival greetings
  - Payment reminder
  - Rule change notification
- [ ] Admin can customize and use

### 13. Notice Board Widget (Optional)
- [ ] Physical notice board replacement:
  - QR code at society entrance
  - Scan → view all notices (without login)
  - Public-safe view (no sensitive info)

### 14. Notice Expiry & Archival
- [ ] Auto-archive notices after expiry date
- [ ] Auto-archive notices older than 1 year
- [ ] Residents can still search archived notices

### 15. Rich Text Support
- [ ] Bold, italic, underline
- [ ] Bullet points, numbered lists
- [ ] Links (URLs)
- [ ] Emojis (optional)
- [ ] No inline images (use attachments instead - for performance)

## Acceptance Criteria
- Society admins can create and publish notices
- Residents see notices on notice board (sorted, filterable)
- Notices trigger appropriate notifications (based on priority)
- Read receipts track who viewed
- Expired notices are auto-archived
- Attachments can be uploaded and downloaded
- Emergency notices are highly visible

## Dependencies
- Task 12 (Notifications System)

## Estimated Effort
3-5 days

## UX Principles
- Mobile-optimized (most residents read on phones)
- Pinned notices always visible
- Emergency notices stand out (red badge)
- Quick scan (excerpts, not full content on list)
- Search for old notices

## Security
- Only society admins can publish notices
- Residents cannot edit or delete
- No HTML injection (sanitize rich text)

## Future Enhancements
- Multi-language notices (English, Hindi, regional)
- Notice reactions (like, acknowledge, etc.)
- Notice comments (moderated discussion)
- WhatsApp broadcast integration (optional)
