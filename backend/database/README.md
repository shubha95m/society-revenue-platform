# Society Revenue Platform - Database Architecture

## Database Choice: PostgreSQL 15+

### Why PostgreSQL?

1. **Complex Relationships** - Excellent support for multiple join types and complex queries
2. **ACID Compliance** - Critical for financial transactions and voting integrity
3. **JSONB Support** - Flexible metadata storage without sacrificing query performance
4. **Performance** - Superior query optimizer and indexing capabilities
5. **Array Types** - Native support for arrays (tags, keywords, user_ids)
6. **Full-Text Search** - Built-in text search with pg_trgm extension
7. **Generated Columns** - Auto-calculated fields (occupancy_rate, approval_percentage)
8. **Mature Ecosystem** - Great ORM support (Prisma, TypeORM, Drizzle)

## Core Design Principles

### 1. Multi-Tenancy by Society ID
- Every transactional table includes `society_id` for data isolation
- Enables future sharding by society
- Composite indexes on `(society_id, other_columns)` for fast queries

### 2. Role-Based Access via Single Users Table
- One `users` table with `role` enum (platform_admin, society_admin, resident, vendor)
- Role-specific details in separate tables (residents, vendors)
- Simplifies authentication and cross-role queries

### 3. Junction Tables for Many-to-Many
- `vendor_societies` - Vendors serve multiple societies
- `service_societies` - Services available in multiple societies
- `service_vendors` - Vendors provide multiple services
- All junctions include relationship metadata (status, performance metrics)

### 4. Audit Trail
- All tables have `created_at` and `updated_at` (auto-managed via triggers)
- Soft deletes with `deleted_at` for data recovery
- Activity logs in `platform_admin_activities`

### 5. Denormalization for Performance
- Cached counts (upvotes, proposals_count, total_orders)
- Computed columns (occupancy_rate, approval_percentage)
- Updated via application logic or database triggers

### 6. Financial Integrity
- Double-entry bookkeeping in `ledger_entries`
- All monetary transactions in `transactions` table
- Platform commission tracking on every order
- Decimal type for precise currency calculations

## Entity Relationship Overview

### Core Hierarchy
```
Platform Admin
    ├── Societies (manages)
    │   ├── Society Admins
    │   ├── Residents
    │   ├── Service Requests
    │   ├── Requirements
    │   ├── Votes/Polls
    │   ├── Notices
    │   ├── Amenities
    │   └── Complaints
    └── Vendors (verifies)
        ├── Services Offered
        ├── Proposals
        ├── Contracts
        └── Orders
```

### Key Workflows

#### 1. Service Request → Vendor Onboarding Flow
```
Resident creates service_request
    ↓
Other residents upvote (service_request_upvotes)
    ↓
Society admin creates vote/poll
    ↓
Residents vote (vote_responses)
    ↓
Poll passes → Admin marks done
    ↓
Admin creates requirement (published to marketplace)
    ↓
Vendors submit proposals
    ↓
Admin selects vendor → creates contract
    ↓
Service becomes available → residents place orders
```

#### 2. Order → Payment → Commission Flow
```
Resident creates order
    ↓
Vendor completes order
    ↓
Transaction created (resident → platform)
    ↓
Ledger entries:
    - Debit: Resident
    - Credit: Platform (commission)
    - Credit: Vendor (payout)
    ↓
Vendor earnings tracked
```

## Table Relationships

### Users & Roles
- **users** (1) → (M) **residents** (via user_id)
- **users** (1) → (1) **vendors** (via user_id)
- **users** (1) → (M) **service_requests** (via requested_by_user_id)
- **users** (1) → (M) **vote_responses** (via user_id)

### Societies
- **societies** (1) → (M) **residents**
- **societies** (1) → (M) **service_requests**
- **societies** (1) → (M) **requirements**
- **societies** (1) → (M) **votes**
- **societies** (1) → (M) **notices**
- **societies** (1) → (M) **amenities**
- **societies** (M) ↔ (M) **vendors** (via vendor_societies)
- **societies** (M) ↔ (M) **services** (via service_societies)

### Service Marketplace
- **services** (M) ↔ (M) **vendors** (via service_vendors)
- **services** (M) ↔ (M) **societies** (via service_societies)
- **service_requests** (1) → (0-1) **votes** (poll created)
- **service_requests** (1) → (0-1) **requirements** (when published)
- **requirements** (1) → (M) **proposals**
- **proposals** (1) → (0-1) **contracts** (when accepted)

### Orders & Transactions
- **contracts** (1) → (M) **orders**
- **orders** (1) → (M) **transactions**
- **transactions** (1) → (M) **ledger_entries**

## Indexing Strategy

### Query Optimization

#### 1. Society-Scoped Queries (Most Common)
```sql
-- Every query filters by society_id first
CREATE INDEX idx_residents_society ON residents(society_id);
CREATE INDEX idx_orders_society ON orders(society_id);
CREATE INDEX idx_service_requests_society ON service_requests(society_id);
```

#### 2. Status-Based Filtering
```sql
-- Dashboard queries filter by status
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_proposals_status ON proposals(status);
```

#### 3. Date Range Queries
```sql
-- Reports and analytics query by date
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_transactions_date ON transactions(completed_at DESC);
CREATE INDEX idx_votes_dates ON votes(voting_end_date);
```

#### 4. Foreign Key Indexes
```sql
-- Every foreign key gets an index for join performance
CREATE INDEX idx_residents_user_id ON residents(user_id);
CREATE INDEX idx_orders_vendor ON orders(vendor_id);
CREATE INDEX idx_proposals_requirement ON proposals(requirement_id);
```

#### 5. Partial Indexes (Non-deleted records)
```sql
-- Only index active records for common queries
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_services_category ON services(category) WHERE deleted_at IS NULL;
```

#### 6. Full-Text Search Indexes
```sql
-- For search functionality
CREATE INDEX idx_services_search ON services USING gin(keywords, tags);
```

## Performance Optimizations

### 1. Computed Columns (GENERATED ALWAYS AS)
```sql
-- Auto-calculated, no application code needed
occupancy_rate DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE WHEN total_flats > 0
    THEN (occupied_flats::DECIMAL / total_flats::DECIMAL * 100)
    ELSE 0 END
) STORED
```

### 2. Materialized Views (Future)
For heavy analytics queries, create materialized views:
```sql
-- Refresh periodically for dashboard stats
CREATE MATERIALIZED VIEW mv_society_revenue_summary AS
SELECT society_id, DATE_TRUNC('month', created_at) as month,
       SUM(total_amount) as monthly_revenue
FROM orders WHERE status = 'completed'
GROUP BY society_id, month;
```

### 3. Partitioning (Future Scale)
When tables grow large (millions of rows):
```sql
-- Partition orders by society_id or date
CREATE TABLE orders (
    ...
) PARTITION BY RANGE (created_at);
```

### 4. Connection Pooling
Use PgBouncer or built-in pooling:
- Transaction pooling for API requests
- Session pooling for background jobs

### 5. Query Optimization Tips
```sql
-- Use EXPLAIN ANALYZE for slow queries
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE society_id = 'uuid' AND status = 'pending';

-- Add covering indexes for common queries
CREATE INDEX idx_orders_society_status_date
ON orders(society_id, status, created_at DESC);
```

## Security Considerations

### 1. Row-Level Security (RLS)
Enable RLS for multi-tenancy:
```sql
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;

CREATE POLICY resident_isolation ON residents
    FOR ALL
    TO authenticated_users
    USING (society_id = current_setting('app.current_society_id')::uuid);
```

### 2. Encrypted Fields
Sensitive data should be encrypted at application level:
- `users.password_hash` (bcrypt)
- `vendors.bank_details` (AES-256)
- Payment information (use payment gateway tokens)

### 3. API Query Patterns
Always filter by society_id first:
```sql
-- Good: Uses index efficiently
SELECT * FROM orders
WHERE society_id = $1 AND resident_id = $2;

-- Bad: Full table scan
SELECT * FROM orders WHERE resident_id = $1;
```

## Data Integrity Constraints

### 1. Foreign Key Constraints
All relationships have proper FK constraints:
```sql
resident_id UUID NOT NULL REFERENCES residents(id) ON DELETE CASCADE
vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT
```

### 2. Check Constraints
Business logic validation:
```sql
resident_rating INTEGER CHECK (resident_rating >= 1 AND resident_rating <= 5)
occupancy_rate DECIMAL(5,2) CHECK (occupancy_rate >= 0 AND occupancy_rate <= 100)
```

### 3. Unique Constraints
Prevent duplicates:
```sql
UNIQUE(service_request_id, user_id) -- One upvote per user
UNIQUE(vote_id, user_id) -- One vote per poll
UNIQUE(society_id, flat_number, user_id) -- One resident record per user per flat
```

## Scaling Strategy

### Phase 1: Single Database (0-100 societies)
- Current schema handles this efficiently
- Vertical scaling (increase server resources)

### Phase 2: Read Replicas (100-1000 societies)
- Primary for writes
- Multiple read replicas for queries
- Connection pooling with read/write split

### Phase 3: Sharding (1000+ societies)
- Shard by `society_id` using hash or range
- Each shard contains subset of societies
- Shard 1: societies A-M
- Shard 2: societies N-Z

### Phase 4: Microservices (High Scale)
- Separate databases per domain:
  - User Service DB
  - Order Service DB
  - Payment Service DB
  - Analytics DB (read-only)

## Migration Strategy

### Using Prisma (Recommended)
```bash
# Install Prisma
npm install prisma @prisma/client

# Initialize
npx prisma init

# Create migrations from schema.sql
npx prisma migrate dev --name init

# Generate client
npx prisma generate
```

### Using Raw SQL
```bash
# Apply schema
psql -U postgres -d society_revenue_platform -f database/schema.sql

# Create migrations folder
mkdir -p database/migrations

# Version migrations
database/migrations/
  ├── 001_initial_schema.sql
  ├── 002_add_vendor_features.sql
  └── 003_add_analytics_tables.sql
```

## Backup & Recovery

### 1. Continuous Backup
```bash
# Enable WAL archiving for point-in-time recovery
archive_mode = on
archive_command = 'cp %p /backup/archive/%f'
```

### 2. Daily Backups
```bash
# Full database dump
pg_dump society_revenue_platform | gzip > backup_$(date +%Y%m%d).sql.gz

# Restore
gunzip < backup_20260208.sql.gz | psql society_revenue_platform
```

### 3. Replication
- Streaming replication for high availability
- Standby server ready for failover

## Monitoring Queries

### 1. Slow Queries
```sql
-- Enable slow query logging
log_min_duration_statement = 1000  -- Log queries > 1s

-- Find slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### 2. Index Usage
```sql
-- Find unused indexes
SELECT schemaname, tablename, indexname
FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND indexname NOT LIKE 'pg_%';
```

### 3. Table Bloat
```sql
-- Check table sizes
SELECT tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Development Environment Setup

### Using Docker
```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: society_revenue_platform
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql

volumes:
  postgres_data:
```

### Connection String
```bash
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/society_revenue_platform?schema=public"
```

## Future Enhancements

### 1. Time-Series Data
For analytics, consider TimescaleDB extension:
```sql
CREATE EXTENSION timescaledb;
SELECT create_hypertable('transactions', 'created_at');
```

### 2. Graph Relationships
For complex relationship queries, consider adding:
- Neo4j for graph queries (vendor-society-service networks)
- Redis for caching hot data (active orders, live polls)

### 3. Search Engine
For advanced search, integrate Elasticsearch:
- Index services, vendors, requirements
- Full-text search with faceting
- Geospatial search for nearby vendors

## API Performance Guidelines

### 1. Pagination
Always paginate large result sets:
```sql
-- Cursor-based pagination (faster)
SELECT * FROM orders
WHERE society_id = $1 AND created_at < $2
ORDER BY created_at DESC
LIMIT 20;

-- Offset pagination (simpler but slower)
SELECT * FROM orders
WHERE society_id = $1
ORDER BY created_at DESC
LIMIT 20 OFFSET 40;
```

### 2. Select Only Needed Columns
```sql
-- Good: Select specific columns
SELECT id, name, status FROM orders;

-- Bad: Select everything
SELECT * FROM orders;
```

### 3. Use JOINs Over Multiple Queries
```sql
-- Good: Single query with JOIN
SELECT o.*, r.first_name, v.business_name
FROM orders o
JOIN residents r ON o.resident_id = r.id
JOIN vendors v ON o.vendor_id = v.id;

-- Bad: N+1 queries
-- SELECT * FROM orders; (1 query)
-- then for each order:
-- SELECT * FROM residents WHERE id = ?; (N queries)
-- SELECT * FROM vendors WHERE id = ?; (N queries)
```

## Summary

This database schema is designed for:
- ✅ **Low Latency**: Strategic indexing and denormalization
- ✅ **Data Integrity**: ACID compliance, constraints, and validations
- ✅ **Scalability**: Partition-ready, replication-ready
- ✅ **Flexibility**: JSONB for metadata, extensible design
- ✅ **Multi-tenancy**: Society-isolated data with proper indexes
- ✅ **Analytics**: Pre-computed metrics and view layers
- ✅ **Maintainability**: Clear naming, comprehensive documentation

The schema supports all current features and is designed to scale from MVP to enterprise-level usage.
