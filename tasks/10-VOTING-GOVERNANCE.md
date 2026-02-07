# Task 10: Voting & Governance System

## Objective
Enable transparent, democratic decision-making for important society matters.

## Design Philosophy
"Major decisions require member consent. Show impact, not just options."

## Use Cases
- Approve new vendor contracts
- Approve large expenses (e.g., painting, lift replacement)
- Enable external amenity rentals
- Change society rules
- Elect managing committee members

## Subtasks

### 1. Proposal System
- [ ] Proposal data model:
  - proposal_id
  - society_id
  - title (short, clear)
  - description (plain language)
  - category (VENDOR, EXPENSE, POLICY, ELECTION, OTHER)
  - impact_statement (₹ impact or other effect)
  - proposed_by (user_id)
  - created_at
  - voting_start_date
  - voting_end_date
  - status (DRAFT, ACTIVE, PASSED, REJECTED, CANCELLED)
  - quorum_required (%)
  - approval_threshold (%)
- [ ] Supporting documents upload (PDFs, images)
- [ ] Financial impact calculation (if applicable)

### 2. Proposal Creation (Society Admin / Members)
- [ ] Create proposal form:
  - Title (max 100 chars)
  - Description (rich text, max 500 words)
  - Category selection
  - Impact statement (mandatory):
    - "This will reduce maintenance by ₹120/flat/month"
    - "This one-time expense of ₹5,00,000 will improve security"
  - Voting duration (default 7 days)
  - Quorum (default 50%)
  - Approval threshold (default 66%)
- [ ] Preview proposal
- [ ] Submit for review (society admin approves)
- [ ] Publish proposal (voting opens)

### 3. Voting Rules Configuration
- [ ] Society-level defaults:
  - Quorum percentage
  - Approval threshold
  - Voting duration
  - Who can vote (all members, or flat owners only)
  - Who can create proposals (admin only, or any member)
- [ ] Override per proposal type (optional)

### 4. Voting Interface (Resident)
- [ ] Active proposals list
- [ ] Proposal detail page:
  - Title
  - Description (simplified, scannable)
  - Impact statement (prominent)
  - Supporting documents
  - Current vote status (% voted, % in favor)
  - Time remaining
- [ ] Voting options:
  - Yes / No / Abstain
  - One-tap voting
- [ ] Confirmation after vote
- [ ] Vote change allowed (until deadline)

### 5. Vote Counting & Results
- [ ] Real-time vote aggregation
- [ ] Total eligible voters
- [ ] Total votes cast
- [ ] Quorum achieved (Y/N)
- [ ] Approval threshold achieved (Y/N)
- [ ] Result:
  - PASSED (quorum + threshold met)
  - REJECTED (threshold not met)
  - INVALID (quorum not met)
- [ ] Immutable result logging
- [ ] Resident notification of result

### 6. Proposal Results Page
- [ ] Final vote count
  - Yes: 156 (78%)
  - No: 32 (16%)
  - Abstain: 12 (6%)
- [ ] Total turnout
- [ ] Quorum status
- [ ] Decision outcome
- [ ] Next steps (if passed):
  - "This vendor will be onboarded within 7 days"
  - "Construction will start next month"

### 7. Voting History
- [ ] Past proposals archive
- [ ] Filterable by:
  - Status (passed, rejected)
  - Category
  - Year
- [ ] Searchable
- [ ] Downloadable (PDF report)

### 8. API Endpoints
```
POST /proposals/:societyId (create proposal)
GET /proposals/:societyId (list all proposals)
GET /proposals/:id (proposal details)
PUT /proposals/:id/publish (start voting)
POST /votes/:proposalId (cast vote)
PUT /votes/:voteId (change vote)
GET /proposals/:id/results (live results)
GET /proposals/:id/final-result (after deadline)
GET /proposals/:societyId/history
```

### 9. Society Admin Dashboard
- [ ] Pending proposals (to approve)
- [ ] Active votes
- [ ] Participation rate (% of residents voting)
- [ ] Proposal analytics (pass rate, topics)

### 10. Resident Dashboard - Voting Tab
- [ ] "3 active votes - Your voice matters"
- [ ] Active proposals list
- [ ] Your voting history
- [ ] Participation badge (gamification):
  - "You've voted in 8/10 proposals this year"

### 11. Automated Workflows
- [ ] Voting start notification (email/SMS/in-app)
- [ ] Reminder notification (24 hours before deadline)
- [ ] Result announcement (automatic after deadline)
- [ ] Auto-execute actions (if configured):
  - Approve vendor contract
  - Release payment for approved expense

### 12. Transparency Features
- [ ] All residents can see proposal details
- [ ] All residents can see vote counts (live)
- [ ] Anonymous voting (who voted for what is private)
- [ ] Audit trail (who created, who approved proposal)

### 13. Special Use Case: Elections
- [ ] Managing Committee election support
- [ ] Multiple candidates
- [ ] Candidate profiles
- [ ] Rank-choice voting (optional)
- [ ] Tenure tracking (who's currently in MC)

## Acceptance Criteria
- Society admins can create proposals
- Residents receive notifications for new proposals
- Residents can vote in one tap
- Quorum and approval threshold are enforced
- Results are automatically calculated and announced
- Vote history is accessible
- System prevents vote tampering

## Dependencies
- Task 04 (Resident Onboarding)

## Estimated Effort
7-10 days

## UX Principles
- Impact statement is mandatory and prominent
- No legal jargon in proposals
- One-tap voting (mobile-optimized)
- Real-time vote count builds urgency
- Gamify participation (badges, leaderboards)

## Security
- One vote per flat (not per person, to avoid gaming)
- Vote is immutable once deadline passes
- Anonymous voting (privacy)
- Audit trail for proposal creation/approval
