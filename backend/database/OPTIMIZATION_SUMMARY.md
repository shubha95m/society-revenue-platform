# Database Optimization Summary

## Executive Summary

The Society Revenue Platform database is designed using **PostgreSQL 15+** with a focus on:
- ⚡ **Low Latency**: < 50ms for 95% of queries
- 📊 **Scalability**: Supports 1000+ societies, 100K+ residents
- 💰 **Financial Integrity**: ACID-compliant transactions
- 🔒 **Multi-tenancy**: Society-isolated data with proper security
- 📈 **Analytics-Ready**: Pre-computed metrics and aggregations

---

## Why PostgreSQL Over Other Databases?

### Comparison Matrix

| Feature | PostgreSQL | MySQL | MongoDB | Why PostgreSQL Won |
|---------|-----------|-------|---------|-------------------|
| **Complex Joins** | ✅ Excellent | ⚠️ Good | ❌ Limited | Need 5-6 way joins for orders/proposals |
| **ACID Compliance** | ✅ Strong | ✅ Strong | ⚠️ Limited | Critical for financial transactions |
| **JSONB Support** | ✅ Native + Indexable | ⚠️ JSON only | ✅ Native | Need flexible metadata + queries |
| **Full-Text Search** | ✅ Built-in | ⚠️ Basic | ✅ Good | Service/vendor discovery |
| **Array Types** | ✅ Native | ❌ No | ✅ Yes | Tags, keywords, upvote tracking |
| **Generated Columns** | ✅ Yes | ✅ Yes | ❌ No | Auto-calculate occupancy_rate, etc. |
| **Window Functions** | ✅ Excellent | ✅ Good | ❌ No | Analytics & rankings |
| **Geospatial** | ✅ PostGIS | ⚠️ Limited | ✅ Good | Vendor location search (future) |
| **Replication** | ✅ Mature | ✅ Mature | ✅ Good | HA requirements |
| **Cost** | ✅ Free | ✅ Free | ✅ Free | All open-source |

**Decision: PostgreSQL** provides the best balance for our complex relational data with flexible metadata needs.

---

## Database Design Decisions

### 1. Single Users Table with Role Enum

**Decision**: One `users` table with `role` enum instead of separate tables per role.

**Why?**
```sql
-- ✅ CHOSEN APPROACH
users (role: resident|vendor|society_admin|platform_admin)
  ├→ residents (role-specific data)
  ├→ vendors (role-specific data)
  └→ No extra table for admins

-- ❌ REJECTED: Separate tables
resident_users, vendor_users, admin_users, platform_admin_users
```

**Benefits:**
- ✅ Single authentication point
- ✅ Easier cross-role queries (e.g., "Who voted?")
- ✅ User can have multiple roles (resident can become vendor)
- ✅ Simpler password reset, email verification
- ⚠️ Trade-off: Need JOINs for role-specific data

**Performance Impact:** +1 JOIN per query, but eliminates UNION queries. Net positive.

---

### 2. Junction Tables for Many-to-Many

**Decision**: Explicit junction tables with metadata instead of array columns.

```sql
-- ✅ CHOSEN: Junction table with metadata
vendor_societies (
  vendor_id, society_id,
  status, orders_completed, society_rating  -- Metadata
)

-- ❌ REJECTED: Array column
vendors (
  society_ids UUID[]  -- No metadata, hard to query
)
```

**Why Junction Tables?**
- ✅ Can store relationship metadata (status, ratings, dates)
- ✅ Easier to query with indexes
- ✅ Referential integrity with FK constraints
- ✅ Can add columns without schema migration

**Use Case:**
```sql
-- Get active vendors for a society with rating > 4.0
SELECT v.* FROM vendors v
JOIN vendor_societies vs ON v.id = vs.vendor_id
WHERE vs.society_id = ? AND vs.status = 'active' AND vs.society_rating > 4.0;
```

**Performance**: Indexed junction tables perform better than array operations at scale.

---

### 3. Denormalized Counters

**Decision**: Store computed counts in parent tables instead of always counting.

```sql
-- ✅ CHOSEN: Denormalized counters
service_requests (
  upvotes INTEGER DEFAULT 0  -- Cached count
)

-- ❌ REJECTED: Always count
SELECT COUNT(*) FROM service_request_upvotes WHERE service_request_id = ?;
```

**Why Denormalize?**
- ✅ Dashboard queries are 100x faster (no COUNT needed)
- ✅ Avoids table scans on large tables
- ⚠️ Trade-off: Must update counter on INSERT/DELETE

**Update Strategy:**
```sql
-- Application-level update
UPDATE service_requests SET upvotes = upvotes + 1 WHERE id = ?;

-- Or database trigger
CREATE TRIGGER update_upvote_count AFTER INSERT ON service_request_upvotes
FOR EACH ROW EXECUTE FUNCTION increment_upvote_count();
```

**Examples of Denormalized Fields:**
- `service_requests.upvotes` (vs COUNT upvotes table)
- `requirements.proposals_count` (vs COUNT proposals)
- `vendors.total_orders_completed` (vs COUNT orders)
- `votes.total_votes_cast` (vs COUNT vote_responses)

---

### 4. Generated Columns for Calculations

**Decision**: Use PostgreSQL GENERATED ALWAYS AS STORED for auto-calculated fields.

```sql
-- ✅ CHOSEN: Generated column
occupancy_rate DECIMAL(5,2) GENERATED ALWAYS AS (
  CASE WHEN total_flats > 0
  THEN (occupied_flats::DECIMAL / total_flats::DECIMAL * 100)
  ELSE 0 END
) STORED

-- ❌ REJECTED: Calculate in application
SELECT occupied_flats / total_flats * 100 AS occupancy_rate FROM societies;
```

**Benefits:**
- ✅ Always correct (no stale data)
- ✅ Can be indexed
- ✅ Simplifies queries
- ✅ No application logic needed

**Use Cases:**
- `societies.occupancy_rate` = `(occupied_flats / total_flats) * 100`
- `votes.turnout_percentage` = `(total_votes_cast / total_eligible_voters) * 100`
- `votes.approval_percentage` = `(yes_votes / total_votes_cast) * 100`

---

### 5. Soft Deletes with deleted_at

**Decision**: Use `deleted_at TIMESTAMP` instead of hard deletes.

```sql
-- ✅ CHOSEN: Soft delete
UPDATE users SET deleted_at = NOW() WHERE id = ?;
SELECT * FROM users WHERE deleted_at IS NULL;

-- ❌ REJECTED: Hard delete
DELETE FROM users WHERE id = ?;
```

**Why?**
- ✅ Data recovery possible
- ✅ Audit trail maintained
- ✅ Referential integrity preserved
- ✅ Can analyze deleted data
- ⚠️ Must filter deleted_at IS NULL in queries

**Index Strategy:**
```sql
-- Partial index for active records only
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
```

---

### 6. JSONB for Flexible Metadata

**Decision**: Use JSONB columns for flexible, schemaless data.

```sql
-- ✅ CHOSEN: JSONB for flexible data
vendors (
  certifications JSONB,  -- [{"name": "ISO", "year": 2023}]
  settings JSONB         -- {"notifications": true, "theme": "dark"}
)

-- ❌ REJECTED: Separate tables for every setting
vendor_certifications, vendor_settings, ...
```

**When to Use JSONB:**
- Settings/preferences (low query frequency)
- Attachments/documents lists
- Flexible metadata that varies by entity
- Migration from legacy systems

**When NOT to Use JSONB:**
- Frequently queried fields → Use columns
- Fields needing foreign keys → Use tables
- Financial data → Use precise columns

**Queryable JSONB:**
```sql
-- Query inside JSONB
SELECT * FROM vendors WHERE settings->>'theme' = 'dark';

-- Index JSONB field
CREATE INDEX idx_vendors_settings_theme ON vendors((settings->>'theme'));
```

---

## Indexing Strategy

### Index Decision Matrix

| Index Type | Use Case | Example |
|-----------|----------|---------|
| **B-tree (default)** | Equality, ranges, sorting | `CREATE INDEX idx_orders_date ON orders(created_at DESC)` |
| **Partial Index** | Filter on common condition | `CREATE INDEX idx_active_users ON users(email) WHERE deleted_at IS NULL` |
| **Composite Index** | Multiple filter columns | `CREATE INDEX idx_orders_society_status ON orders(society_id, status)` |
| **GIN Index** | Arrays, JSONB, full-text | `CREATE INDEX idx_services_tags ON services USING gin(tags)` |
| **Covering Index** | Include extra columns | `CREATE INDEX ... INCLUDE (name, email)` |

### Critical Indexes

**1. Society-Scoped Queries (80% of traffic)**
```sql
-- Pattern: WHERE society_id = ? AND status = ? ORDER BY created_at DESC
CREATE INDEX idx_orders_society_status_date
ON orders(society_id, status, created_at DESC);
```

**2. Foreign Key Indexes**
```sql
-- Every FK needs an index for JOIN performance
CREATE INDEX idx_residents_user_id ON residents(user_id);
CREATE INDEX idx_orders_vendor_id ON orders(vendor_id);
```

**3. Status-Based Filters**
```sql
-- Dashboard queries filter by status
CREATE INDEX idx_service_requests_status ON service_requests(status);
```

**4. Unique Constraints as Indexes**
```sql
-- Prevents duplicates + creates index
UNIQUE(service_request_id, user_id)  -- One upvote per user
```

### Index Maintenance

```sql
-- Check unused indexes (remove to save space/write speed)
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND indexname NOT LIKE 'pg_%';

-- Rebuild bloated indexes
REINDEX INDEX idx_orders_society_status_date;
```

---

## Query Optimization Patterns

### 1. Always Filter by society_id First

```sql
-- ✅ GOOD: Uses composite index efficiently
SELECT * FROM orders
WHERE society_id = 'uuid' AND status = 'pending'
ORDER BY created_at DESC;

-- ❌ BAD: Full table scan, then filter
SELECT * FROM orders
WHERE status = 'pending' AND society_id = 'uuid';
```

**Why?** Composite index `(society_id, status, created_at)` is most selective on `society_id` first.

### 2. Use JOINs Instead of N+1 Queries

```sql
-- ✅ GOOD: Single query with JOIN (1 query)
SELECT o.*, r.first_name, v.business_name
FROM orders o
JOIN residents r ON o.resident_id = r.id
JOIN vendors v ON o.vendor_id = v.id
WHERE o.society_id = ?;

-- ❌ BAD: N+1 queries (1 + N + N queries)
-- 1. SELECT * FROM orders WHERE society_id = ?;
-- 2. For each order: SELECT * FROM residents WHERE id = order.resident_id;
-- 3. For each order: SELECT * FROM vendors WHERE id = order.vendor_id;
```

**Performance**: 1 query vs 201 queries for 100 orders.

### 3. Pagination with Cursor, Not Offset

```sql
-- ✅ GOOD: Cursor-based (fast for any page)
SELECT * FROM orders
WHERE society_id = ? AND created_at < ?
ORDER BY created_at DESC
LIMIT 20;

-- ❌ BAD: Offset-based (slow for high pages)
SELECT * FROM orders
WHERE society_id = ?
ORDER BY created_at DESC
LIMIT 20 OFFSET 10000;  -- Scans 10,020 rows
```

**Performance**: Cursor-based is O(1) regardless of page. Offset is O(n).

### 4. Aggregate with Group By, Not Multiple Queries

```sql
-- ✅ GOOD: Single aggregation query
SELECT
  society_id,
  status,
  COUNT(*) as count,
  SUM(total_amount) as revenue
FROM orders
GROUP BY society_id, status;

-- ❌ BAD: Multiple queries
SELECT COUNT(*) FROM orders WHERE society_id = ? AND status = 'pending';
SELECT COUNT(*) FROM orders WHERE society_id = ? AND status = 'completed';
-- ...
```

### 5. Select Only Needed Columns

```sql
-- ✅ GOOD: Select specific columns
SELECT id, name, status FROM orders;

-- ❌ BAD: Select everything (wastes bandwidth/memory)
SELECT * FROM orders;
```

**Impact**: Reduces network transfer, memory usage, and allows covering indexes.

---

## Scalability Strategy

### Phase 1: Single Database (MVP → 100 societies)

**Current State**

```
┌────────────────────────────────┐
│     Application Servers        │
│      (Next.js API Routes)      │
└───────────┬────────────────────┘
            │
            ▼
┌────────────────────────────────┐
│     PostgreSQL Primary         │
│  (Handles reads + writes)      │
└────────────────────────────────┘
```

**Optimizations:**
- Proper indexes
- Connection pooling (PgBouncer)
- Query optimization
- Caching (Redis)

**Supports:** ~100 societies, ~10K residents, ~1K orders/day

---

### Phase 2: Read Replicas (100-1000 societies)

**Architecture**

```
┌────────────────────────────────┐
│     Application Servers        │
└───────┬──────────────┬─────────┘
        │              │
        ▼ (writes)     ▼ (reads)
┌───────────────┐  ┌──────────────┐
│  Primary DB   │  │ Read Replica │
│  (writes)     │──│  (queries)   │
└───────────────┘  └──────────────┘
                    ┌──────────────┐
                    │ Read Replica │
                    │  (queries)   │
                    └──────────────┘
```

**Query Routing:**
```typescript
// Write operations → Primary
await prisma.order.create({ data: {...} });

// Read operations → Replicas
await prisma.$queryRaw`SELECT * FROM orders WHERE ...`; // Uses read replica
```

**Supports:** ~1,000 societies, ~100K residents, ~10K orders/day

---

### Phase 3: Sharding by Society (1000+ societies)

**Architecture**

```
┌────────────────────────────────┐
│     Application (Shard Router) │
└───┬────────────┬───────────┬───┘
    │            │           │
    ▼            ▼           ▼
┌────────┐   ┌────────┐  ┌────────┐
│Shard 1 │   │Shard 2 │  │Shard 3 │
│A-H     │   │I-P     │  │Q-Z     │
│10K     │   │8K      │  │12K     │
│societies│  │societies│ │societies│
└────────┘   └────────┘  └────────┘
```

**Shard Key:** `society_id` (consistent hashing)

**Benefits:**
- Linear scalability
- Isolated failures (one shard down ≠ all down)
- Regional shards (Mumbai shard, Delhi shard)

**Challenges:**
- Cross-shard queries (analytics)
- Shard rebalancing
- Application complexity

**Supports:** 10,000+ societies, 1M+ residents, 100K+ orders/day

---

### Phase 4: Microservices (Enterprise Scale)

**Domain-Separated Databases**

```
┌─────────────────────────────────────────┐
│           API Gateway                   │
└───┬─────────┬─────────┬─────────┬───────┘
    │         │         │         │
    ▼         ▼         ▼         ▼
┌────────┐┌────────┐┌────────┐┌────────┐
│User    ││Order   ││Payment ││Analytics│
│Service ││Service ││Service ││Service  │
├────────┤├────────┤├────────┤├────────┤
│User DB ││Order DB││Pay DB  ││Read-only│
│        ││        ││        ││Replica  │
└────────┘└────────┘└────────┘└────────┘
```

**Benefits:**
- Independent scaling
- Tech stack flexibility
- Failure isolation
- Team autonomy

**Supports:** Unlimited scale

---

## Caching Strategy

### Three-Layer Cache

```
┌──────────────────────────────────────┐
│ L1: Application Memory (Next.js)     │
│ TTL: 5 min | Use: Static data        │
│ - Service catalog                    │
│ - Society details                    │
└──────────────────────────────────────┘
                │ miss
                ▼
┌──────────────────────────────────────┐
│ L2: Redis Cache                      │
│ TTL: 1 hour | Use: User sessions     │
│ - User profile                       │
│ - Active orders                      │
│ - Dashboard stats                    │
└──────────────────────────────────────┘
                │ miss
                ▼
┌──────────────────────────────────────┐
│ L3: PostgreSQL Database              │
│ Authoritative source                 │
└──────────────────────────────────────┘
```

### Cache Invalidation

**Write-Through Pattern:**
```typescript
// Update DB + invalidate cache
await prisma.order.update({ where: { id }, data: {...} });
await redis.del(`order:${id}`);
await redis.del(`resident:${residentId}:orders`);
```

---

## Monitoring & Alerts

### Key Metrics to Monitor

| Metric | Threshold | Action |
|--------|-----------|--------|
| **Query Time (p95)** | > 100ms | Investigate slow queries, add indexes |
| **Connection Count** | > 80% of max_connections | Increase pool size or add replicas |
| **Cache Hit Rate** | < 80% | Optimize cache keys or increase TTL |
| **Disk Usage** | > 80% | Archive old data or add storage |
| **Replication Lag** | > 5 seconds | Check network or increase replica resources |

### Slow Query Alert

```sql
-- Find queries taking > 1 second
SELECT
  query,
  calls,
  mean_exec_time,
  max_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 1000  -- milliseconds
ORDER BY mean_exec_time DESC;
```

---

## Summary

This database design achieves:

✅ **Low Latency**
- Strategic indexing for <50ms queries
- Denormalized counters avoid expensive COUNTs
- Connection pooling reduces connection overhead

✅ **Scalability**
- Clear path from MVP → Enterprise scale
- Shard-ready design (society_id in all tables)
- Read replicas for horizontal scaling

✅ **Data Integrity**
- ACID transactions for financial data
- Foreign key constraints for referential integrity
- Soft deletes for data recovery

✅ **Developer Experience**
- Prisma ORM for type-safe queries
- Clear naming conventions
- Comprehensive documentation

✅ **Cost Efficiency**
- PostgreSQL is free and open-source
- Efficient indexes reduce server costs
- Caching reduces database load

**Estimated Performance:**
- Dashboard queries: 20-30ms
- Order creation: 50-100ms
- Search queries: 30-50ms
- Analytics: 100-500ms (with materialized views)

This design supports the platform from MVP through to enterprise scale with clear optimization paths at each growth stage.
