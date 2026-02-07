# Entity Relationship Diagram (ERD)

## Visual Database Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PLATFORM LEVEL                                       │
│                                                                              │
│  ┌──────────────┐                                                           │
│  │    USERS     │ (Central Auth & Role Management)                          │
│  │──────────────│                                                           │
│  │ id (PK)      │                                                           │
│  │ email        │                                                           │
│  │ role         │ ◄─── (platform_admin, society_admin, resident, vendor)   │
│  │ status       │                                                           │
│  └──────┬───────┘                                                           │
│         │                                                                    │
└─────────┼────────────────────────────────────────────────────────────────────┘
          │
          │ (1:1 based on role)
          │
    ┌─────┼─────────────┬──────────────┬──────────────┐
    │     │             │              │              │
    ▼     ▼             ▼              ▼              ▼
┌────────────┐   ┌───────────┐   ┌─────────┐   ┌──────────────────┐
│ RESIDENTS  │   │ VENDORS   │   │SOCIETIES│   │ PLATFORM_ADMIN   │
│────────────│   │───────────│   │─────────│   │ (no extra table) │
│ user_id(FK)│   │user_id(FK)│   │   ...   │   └──────────────────┘
│society_id  │   │ ...       │   │         │
│flat_number │   └─────┬─────┘   └────┬────┘
└─────┬──────┘         │              │
      │                │              │
      │                │              │
┌─────┴────────────────┴──────────────┴─────────────────────────────────────┐
│                    MANY-TO-MANY JUNCTIONS                                  │
│                                                                             │
│  ┌──────────────────┐        ┌──────────────────┐      ┌────────────────┐ │
│  │ VENDOR_SOCIETIES │        │SERVICE_SOCIETIES │      │SERVICE_VENDORS │ │
│  │──────────────────│        │──────────────────│      │────────────────│ │
│  │ vendor_id (FK)   │        │ service_id (FK)  │      │service_id (FK) │ │
│  │ society_id (FK)  │        │ society_id (FK)  │      │vendor_id (FK)  │ │
│  │ status           │        │ society_price    │      │vendor_price    │ │
│  └──────────────────┘        └──────────────────┘      └────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                      SERVICE REQUEST WORKFLOW                                │
│                                                                              │
│  ┌─────────────────┐                                                        │
│  │SERVICE_REQUESTS │ (Resident → Society Admin)                             │
│  │─────────────────│                                                        │
│  │ society_id (FK) │                                                        │
│  │ requested_by    │                                                        │
│  │ status          │ ◄─── (pending, poll_created, approved, published)     │
│  │ upvotes         │                                                        │
│  │ poll_id (FK)    │ ───┐                                                   │
│  └─────────────────┘    │                                                   │
│           │             │                                                   │
│           ▼             ▼                                                   │
│  ┌─────────────────┐  ┌──────────────┐                                     │
│  │  REQUIREMENTS   │  │    VOTES     │ (Polls)                             │
│  │─────────────────│  │──────────────│                                     │
│  │ society_id (FK) │  │ society_id   │                                     │
│  │ service_name    │  │ title        │                                     │
│  │ budget_range    │  │ category     │                                     │
│  │ status          │  │ yes_votes    │                                     │
│  │ published_at    │  │ no_votes     │                                     │
│  └────────┬────────┘  │ status       │                                     │
│           │           └──────┬───────┘                                     │
│           │                  │                                              │
│           │                  ▼                                              │
│           │         ┌─────────────────┐                                    │
│           │         │ VOTE_RESPONSES  │                                    │
│           │         │─────────────────│                                    │
│           │         │ vote_id (FK)    │                                    │
│           │         │ user_id (FK)    │                                    │
│           │         │ choice          │ (yes/no/abstain)                   │
│           │         └─────────────────┘                                    │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐                                                       │
│  │   PROPOSALS     │ (Vendor → Society)                                    │
│  │─────────────────│                                                       │
│  │requirement_id   │                                                       │
│  │ vendor_id (FK)  │                                                       │
│  │ society_id (FK) │                                                       │
│  │ pricing         │                                                       │
│  │ status          │ ◄─── (submitted, shortlisted, accepted)              │
│  └────────┬────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐                                                       │
│  │   CONTRACTS     │ (Finalized Agreements)                                │
│  │─────────────────│                                                       │
│  │ society_id (FK) │                                                       │
│  │ vendor_id (FK)  │                                                       │
│  │ proposal_id     │                                                       │
│  │ start_date      │                                                       │
│  │ end_date        │                                                       │
│  └────────┬────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐                                                       │
│  │     ORDERS      │ (Service Bookings)                                    │
│  │─────────────────│                                                       │
│  │ society_id (FK) │                                                       │
│  │ resident_id     │                                                       │
│  │ vendor_id (FK)  │                                                       │
│  │ contract_id     │                                                       │
│  │ total_amount    │                                                       │
│  │ status          │                                                       │
│  └────────┬────────┘                                                       │
│           │                                                                 │
└───────────┼─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FINANCIAL TRACKING                                   │
│                                                                              │
│  ┌─────────────────┐                                                        │
│  │  TRANSACTIONS   │                                                        │
│  │─────────────────│                                                        │
│  │ order_id (FK)   │                                                        │
│  │ society_id      │                                                        │
│  │ resident_id     │                                                        │
│  │ vendor_id       │                                                        │
│  │ amount          │                                                        │
│  │ platform_comm   │                                                        │
│  │ status          │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐                                                        │
│  │ LEDGER_ENTRIES  │ (Double-Entry Bookkeeping)                            │
│  │─────────────────│                                                        │
│  │ transaction_id  │                                                        │
│  │ entry_type      │ (debit/credit)                                        │
│  │ account_type    │ (revenue/expense/commission)                          │
│  │ amount          │                                                        │
│  │running_balance  │                                                        │
│  └─────────────────┘                                                        │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOCIETY MANAGEMENT FEATURES                               │
│                                                                              │
│         ┌─────────────┐                                                     │
│         │  SOCIETIES  │                                                     │
│         └──────┬──────┘                                                     │
│                │                                                             │
│     ┌──────────┼──────────┬──────────┬──────────┬──────────┐               │
│     │          │          │          │          │          │               │
│     ▼          ▼          ▼          ▼          ▼          ▼               │
│ ┌────────┐ ┌────────┐┌────────┐┌──────────┐┌─────────┐┌────────┐         │
│ │NOTICES │ │AMENITIES││COMPLAINTS││  VOTES  ││RESIDENTS││REPORTS │         │
│ │────────│ │────────││────────││──────────││─────────││────────│         │
│ │society │ │society ││society ││ society  ││ society ││society │         │
│ │title   │ │name    ││title   ││ title    ││flat_no  ││type    │         │
│ │content │ │type    ││category││ category ││         ││data    │         │
│ │        │ │        ││status  ││ quorum   ││         ││period  │         │
│ └────────┘ └───┬────┘└────────┘└──────────┘└─────────┘└────────┘         │
│                │                                                             │
│                ▼                                                             │
│       ┌─────────────────┐                                                   │
│       │AMENITY_BOOKINGS │                                                   │
│       │─────────────────│                                                   │
│       │ amenity_id (FK) │                                                   │
│       │ resident_id     │                                                   │
│       │ booking_date    │                                                   │
│       │ status          │                                                   │
│       └─────────────────┘                                                   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                         KEY RELATIONSHIPS                                    │
│                                                                              │
│  1. ONE USER → MULTIPLE ROLES                                               │
│     - Platform Admin: Full system access                                    │
│     - Society Admin: One society (through residents table)                  │
│     - Resident: One or more societies (multiple flats)                      │
│     - Vendor: Multiple societies (through vendor_societies)                 │
│                                                                              │
│  2. SOCIETY ↔ VENDOR (Many-to-Many)                                         │
│     - One society works with multiple vendors                               │
│     - One vendor serves multiple societies                                  │
│     - Junction: vendor_societies                                            │
│                                                                              │
│  3. SERVICE ↔ SOCIETY (Many-to-Many)                                        │
│     - One service available in multiple societies                           │
│     - One society offers multiple services                                  │
│     - Junction: service_societies (with society-specific pricing)           │
│                                                                              │
│  4. SERVICE ↔ VENDOR (Many-to-Many)                                         │
│     - One service provided by multiple vendors                              │
│     - One vendor provides multiple services                                 │
│     - Junction: service_vendors (with vendor-specific pricing)              │
│                                                                              │
│  5. SERVICE REQUEST → VOTE → REQUIREMENT → PROPOSAL → CONTRACT → ORDER      │
│     - Linear workflow from resident request to active service               │
│                                                                              │
│  6. ORDER → TRANSACTION → LEDGER ENTRIES                                    │
│     - Every order creates financial transactions                            │
│     - Transactions create double-entry ledger records                       │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Cardinality Summary

### One-to-One (1:1)
- `users.id` → `residents.user_id` (one user can be one resident)
- `users.id` → `vendors.user_id` (one user can be one vendor)
- `service_requests.id` → `requirements.service_request_id` (one request → one requirement)
- `proposals.id` → `contracts.proposal_id` (one accepted proposal → one contract)

### One-to-Many (1:M)
- `societies.id` → `residents.society_id` (one society has many residents)
- `societies.id` → `service_requests.society_id` (one society receives many requests)
- `societies.id` → `requirements.society_id` (one society publishes many requirements)
- `societies.id` → `votes.society_id` (one society has many polls)
- `societies.id` → `orders.society_id` (one society has many orders)
- `residents.id` → `orders.resident_id` (one resident places many orders)
- `vendors.id` → `orders.vendor_id` (one vendor fulfills many orders)
- `requirements.id` → `proposals.requirement_id` (one requirement gets many proposals)
- `contracts.id` → `orders.contract_id` (one contract has many orders)
- `orders.id` → `transactions.order_id` (one order creates multiple transactions)

### Many-to-Many (M:M)
- `vendors` ↔ `societies` (via `vendor_societies`)
- `services` ↔ `societies` (via `service_societies`)
- `services` ↔ `vendors` (via `service_vendors`)

## Index Strategy Visualization

```
HIGH TRAFFIC QUERIES:
┌─────────────────────────────────────────┐
│ Resident Dashboard                      │
│ ┌─────────────────────────────────────┐ │
│ │ SELECT * FROM orders                │ │
│ │ WHERE society_id = ? AND            │ │
│ │       resident_id = ?               │ │
│ │ ORDER BY created_at DESC            │ │
│ └─────────────────────────────────────┘ │
│ Index: (society_id, resident_id,        │
│         created_at DESC)                │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Admin Service Requests Dashboard        │
│ ┌─────────────────────────────────────┐ │
│ │ SELECT * FROM service_requests      │ │
│ │ WHERE society_id = ?                │ │
│ │   AND status = 'pending'            │ │
│ │ ORDER BY upvotes DESC               │ │
│ └─────────────────────────────────────┘ │
│ Index: (society_id, status, upvotes)    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Vendor Discover Marketplace             │
│ ┌─────────────────────────────────────┐ │
│ │ SELECT * FROM requirements          │ │
│ │ WHERE status = 'active'             │ │
│ │   AND category = ?                  │ │
│ │ ORDER BY published_at DESC          │ │
│ └─────────────────────────────────────┘ │
│ Index: (status, category, published_at) │
└─────────────────────────────────────────┘
```

## Data Flow Example

### Complete Service Onboarding Journey

```
STEP 1: RESIDENT REQUEST
┌────────────────────────────────────────┐
│ Resident: "We need grocery delivery"  │
│                                        │
│ INSERT INTO service_requests           │
│ (society_id, requested_by_user_id,    │
│  service_name, description,           │
│  status = 'pending', upvotes = 1)     │
└────────────────────────────────────────┘
                  ↓
STEP 2: COMMUNITY UPVOTES
┌────────────────────────────────────────┐
│ Other residents upvote                 │
│                                        │
│ INSERT INTO service_request_upvotes    │
│ (service_request_id, user_id)         │
│                                        │
│ UPDATE service_requests                │
│ SET upvotes = upvotes + 1              │
│ WHERE id = ?                           │
└────────────────────────────────────────┘
                  ↓
STEP 3: ADMIN CREATES POLL (25+ upvotes)
┌────────────────────────────────────────┐
│ Society Admin creates poll             │
│                                        │
│ INSERT INTO votes                      │
│ (society_id, title, category,         │
│  service_request_id,                  │
│  status = 'active')                   │
│                                        │
│ UPDATE service_requests                │
│ SET status = 'poll_created',          │
│     poll_id = ?                       │
└────────────────────────────────────────┘
                  ↓
STEP 4: RESIDENTS VOTE
┌────────────────────────────────────────┐
│ Residents cast votes                   │
│                                        │
│ INSERT INTO vote_responses             │
│ (vote_id, user_id, choice)            │
│                                        │
│ UPDATE votes                           │
│ SET yes_votes = yes_votes + 1,        │
│     total_votes_cast = ...            │
└────────────────────────────────────────┘
                  ↓
STEP 5: POLL PASSES & ADMIN MARKS DONE
┌────────────────────────────────────────┐
│ If approval >= 60% and turnout >= 50% │
│                                        │
│ UPDATE votes                           │
│ SET status = 'passed',                │
│     closed_at = NOW()                 │
│                                        │
│ UPDATE service_requests                │
│ SET status = 'approved'               │
└────────────────────────────────────────┘
                  ↓
STEP 6: ADMIN PUBLISHES REQUIREMENT
┌────────────────────────────────────────┐
│ Admin publishes to vendor marketplace  │
│                                        │
│ INSERT INTO requirements               │
│ (society_id, service_request_id,      │
│  service_name, budget_range,          │
│  interested_residents, status)        │
│                                        │
│ UPDATE service_requests                │
│ SET status = 'published',             │
│     requirement_id = ?,               │
│     published_at = NOW()              │
└────────────────────────────────────────┘
                  ↓
STEP 7: VENDORS SUBMIT PROPOSALS
┌────────────────────────────────────────┐
│ Vendors view and submit proposals      │
│                                        │
│ INSERT INTO requirement_views          │
│ (requirement_id, vendor_id)           │
│                                        │
│ UPDATE requirements                    │
│ SET views_count = views_count + 1     │
│                                        │
│ INSERT INTO proposals                  │
│ (requirement_id, vendor_id,           │
│  pricing, status = 'submitted')       │
│                                        │
│ UPDATE requirements                    │
│ SET proposals_count += 1              │
└────────────────────────────────────────┘
                  ↓
STEP 8: ADMIN SELECTS VENDOR
┌────────────────────────────────────────┐
│ Admin reviews and accepts proposal     │
│                                        │
│ UPDATE proposals                       │
│ SET status = 'accepted'               │
│ WHERE id = ?                           │
│                                        │
│ INSERT INTO contracts                  │
│ (society_id, vendor_id, proposal_id,  │
│  start_date, status = 'active')       │
│                                        │
│ UPDATE requirements                    │
│ SET status = 'awarded'                │
└────────────────────────────────────────┘
                  ↓
STEP 9: SERVICE BECOMES AVAILABLE
┌────────────────────────────────────────┐
│ Service is now available for residents │
│                                        │
│ INSERT INTO service_societies          │
│ (service_id, society_id, is_active)   │
│                                        │
│ INSERT INTO vendor_societies           │
│ (vendor_id, society_id, status)       │
└────────────────────────────────────────┘
                  ↓
STEP 10: RESIDENTS PLACE ORDERS
┌────────────────────────────────────────┐
│ Residents book the service             │
│                                        │
│ INSERT INTO orders                     │
│ (society_id, resident_id, vendor_id,  │
│  contract_id, total_amount,           │
│  platform_commission_amount)          │
│                                        │
│ INSERT INTO transactions               │
│ (order_id, amount, type, status)      │
│                                        │
│ INSERT INTO ledger_entries             │
│ (transaction_id, entry_type, amount)  │
└────────────────────────────────────────┘
```

## Performance Considerations

### Query Patterns by Role

**Resident Queries:**
- Always filtered by `society_id` + `resident_id`
- Mostly read operations
- Real-time data not critical (can cache)

**Society Admin Queries:**
- Always filtered by `society_id`
- Mix of reads and writes
- Real-time updates needed for polls/votes

**Vendor Queries:**
- Filtered by `vendor_id` or `status = 'active'`
- Heavy reads on requirements marketplace
- Write operations for proposals/orders

**Platform Admin Queries:**
- Cross-society analytics
- Large dataset aggregations
- Can use materialized views

### Caching Strategy

```
Redis Cache Layers:
┌────────────────────────────────────┐
│ L1: User Session (30 min TTL)     │
│  - user profile                    │
│  - resident/vendor details         │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ L2: Society Data (1 hour TTL)     │
│  - society details                 │
│  - active services list            │
│  - amenities list                  │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ L3: Dashboard Stats (5 min TTL)   │
│  - order counts                    │
│  - pending requests count          │
│  - active polls                    │
└────────────────────────────────────┘
```

This ERD provides a complete visual representation of the database architecture, optimized for the Society Revenue Platform's requirements.
