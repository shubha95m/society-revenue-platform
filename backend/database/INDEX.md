# Database Documentation Index

## Quick Links

📄 **[schema.sql](./schema.sql)** - Complete PostgreSQL database schema (Source of Truth)
📄 **[README.md](./README.md)** - Comprehensive design documentation
📄 **[ERD.md](./ERD.md)** - Visual entity relationship diagrams
📄 **[SETUP.md](./SETUP.md)** - Step-by-step setup guide
📄 **[OPTIMIZATION_SUMMARY.md](./OPTIMIZATION_SUMMARY.md)** - Design decisions & performance optimizations
📄 **[prisma/schema.prisma](./prisma/schema.prisma)** - Prisma schema (partial, for ORM integration)

---

## 📊 Database Overview

- **Database:** PostgreSQL 15+
- **Total Tables:** 30+
- **Core Entities:** 8 (Users, Societies, Residents, Vendors, Services, Orders, Votes, Transactions)
- **Junction Tables:** 5 (Many-to-many relationships)
- **Supporting Tables:** 17 (Complaints, Notices, Amenities, Reports, etc.)

---

## 🎯 Quick Start

### For Developers (Setup)

```bash
# Clone repo
git clone <repo-url>
cd society-revenue-platform

# Start PostgreSQL with Docker
docker-compose up -d postgres

# Apply schema
docker exec -i society-postgres psql -U postgres -d society_revenue_platform < database/schema.sql

# Verify
docker exec -it society-postgres psql -U postgres -d society_revenue_platform -c "\dt"
```

**Next Steps:**
1. Read [SETUP.md](./SETUP.md) for detailed instructions
2. Configure environment variables
3. Run seed data (optional)
4. Start building!

### For Product/Business (Understanding)

1. **[ERD.md](./ERD.md)** - Visual database structure and relationships
2. **[README.md](./README.md)** - Understand design principles and query patterns
3. **[OPTIMIZATION_SUMMARY.md](./OPTIMIZATION_SUMMARY.md)** - Why we made specific design choices

---

## 📂 File Guide

### 1. schema.sql (Source of Truth)

**Purpose:** Complete SQL schema definition
**Use Case:**
- Apply to fresh database
- Reference for structure
- Understand constraints and indexes

**Key Sections:**
- ✅ All 30+ table definitions
- ✅ All indexes and constraints
- ✅ Enums and types
- ✅ Triggers for auto-updates
- ✅ Views for common queries

**When to Use:**
- Setting up new environment
- Understanding table structure
- Creating migrations

---

### 2. README.md (Design Documentation)

**Purpose:** Comprehensive design explanation
**Covers:**
- Why PostgreSQL over MySQL/MongoDB?
- Core design principles (multi-tenancy, audit trail, etc.)
- Indexing strategy with examples
- Performance optimizations
- Scaling strategy (MVP → Enterprise)
- Security considerations
- Query patterns and best practices

**Audience:**
- Developers (to understand architecture)
- DevOps (for deployment/scaling)
- Tech leads (for design decisions)

**When to Use:**
- Onboarding new developers
- Planning features that touch DB
- Performance troubleshooting
- Scaling planning

---

### 3. ERD.md (Visual Diagrams)

**Purpose:** Visual representation of database structure
**Contains:**
- ASCII art entity diagrams
- Relationship cardinality (1:1, 1:M, M:M)
- Complete workflow visualizations
- Query pattern examples with indexes
- Data flow examples (service request → order)

**Audience:**
- Product managers (understand data flow)
- Developers (understand relationships)
- Designers (understand feature constraints)

**When to Use:**
- Understanding how features connect
- Planning new features
- Debugging data inconsistencies
- Presentations and documentation

---

### 4. SETUP.md (Installation Guide)

**Purpose:** Step-by-step setup instructions
**Covers:**
- Docker setup (recommended)
- Local PostgreSQL setup
- Prisma setup
- Environment configuration
- Connection pooling (PgBouncer)
- Seed data for development
- Backup & restore procedures
- Monitoring & maintenance
- Testing database setup
- Production checklist

**Audience:**
- Developers (local setup)
- DevOps (production deployment)

**When to Use:**
- First-time setup
- New developer onboarding
- Setting up test environments
- Deploying to production

---

### 5. OPTIMIZATION_SUMMARY.md (Design Rationale)

**Purpose:** Explain WHY we made specific design choices
**Covers:**
- Database selection rationale
- Design decision comparisons (chosen vs rejected)
- Indexing strategy deep-dive
- Query optimization patterns
- Scalability roadmap (4 phases)
- Caching strategy
- Monitoring metrics

**Audience:**
- Tech leads (design decisions)
- Senior developers (optimization)
- Architects (scaling strategy)

**When to Use:**
- Understanding design trade-offs
- Performance optimization
- Capacity planning
- Technical documentation

---

### 6. prisma/schema.prisma (ORM Integration)

**Purpose:** Prisma schema for TypeScript integration
**Status:** Partial (core models only)
**Note:** schema.sql is the source of truth

**Use Case:**
- Type-safe database queries
- Auto-generated TypeScript types
- Prisma Studio for data exploration
- Simplified migrations

**When to Use:**
- Frontend/API development
- Type safety requirements
- Rapid prototyping

---

## 🗂️ Table Categories

### Core Identity & Auth
- `users` - Central user authentication
- `residents` - Resident-specific data
- `vendors` - Vendor-specific data
- `societies` - Housing societies

### Services & Marketplace
- `services` - Service catalog
- `service_societies` - Available services per society
- `service_vendors` - Services offered by vendors
- `vendor_societies` - Vendor-society relationships

### Demand Generation (Resident → Admin)
- `service_requests` - Resident service requests
- `service_request_upvotes` - Community interest
- `requirements` - Published requirements for vendors
- `requirement_views` - Vendor views tracking

### Supply Response (Vendor → Society)
- `proposals` - Vendor proposals
- `contracts` - Finalized agreements

### Operations
- `orders` - Service bookings
- `transactions` - Financial transactions
- `ledger_entries` - Double-entry bookkeeping

### Governance
- `votes` - Polls and voting
- `vote_responses` - Individual votes
- `notices` - Society announcements

### Facilities
- `amenities` - Society amenities
- `amenity_bookings` - Resident bookings

### Support
- `complaints` - Resident complaints
- `notifications` - System notifications

### Analytics
- `reports` - Generated reports
- `platform_admin_activities` - Audit log

---

## 🔑 Key Relationships

### Multi-Tenancy
Every transactional table includes `society_id` for data isolation and query optimization.

### User Roles
One `users` table with role enum:
- `platform_admin` - Full system access
- `society_admin` - One society management
- `resident` - One or more flats
- `vendor` - Multiple societies

### Many-to-Many Relationships
- Vendors ↔ Societies (via `vendor_societies`)
- Services ↔ Societies (via `service_societies`)
- Services ↔ Vendors (via `service_vendors`)

### Linear Workflows
```
Service Request → Vote → Requirement → Proposal → Contract → Order
```

---

## 📈 Performance Targets

| Metric | Target | Current Strategy |
|--------|--------|------------------|
| **Dashboard Load** | < 50ms | Denormalized counts, composite indexes |
| **Search Queries** | < 100ms | Full-text indexes, JSONB indexes |
| **Order Creation** | < 200ms | Transaction batching, connection pooling |
| **Analytics Queries** | < 1s | Materialized views (future) |
| **Write Throughput** | 1000+ ops/sec | Connection pooling, async processing |

---

## 🚀 Scalability Path

### Current (MVP)
- Single PostgreSQL instance
- Connection pooling
- Query optimization
- Redis caching

**Supports:** 100 societies, 10K residents, 1K orders/day

### Phase 2 (Growth)
- Read replicas (2-3)
- Read/write splitting
- Materialized views

**Supports:** 1,000 societies, 100K residents, 10K orders/day

### Phase 3 (Scale)
- Database sharding by society_id
- Regional databases
- CDN for static data

**Supports:** 10,000+ societies, 1M+ residents, 100K+ orders/day

### Phase 4 (Enterprise)
- Microservices architecture
- Domain-separated databases
- Event-driven architecture

**Supports:** Unlimited scale

---

## 🛠️ Common Tasks

### Add a New Table

1. Design table structure
2. Add to `schema.sql`
3. Create indexes
4. Update `prisma/schema.prisma` (if using Prisma)
5. Create migration
6. Update documentation

### Optimize a Slow Query

1. Check `EXPLAIN ANALYZE` output
2. Review [OPTIMIZATION_SUMMARY.md](./OPTIMIZATION_SUMMARY.md) query patterns
3. Add missing indexes
4. Consider denormalization
5. Test with production-like data

### Backup Database

```bash
# Full backup
pg_dump society_revenue_platform | gzip > backup_$(date +%Y%m%d).sql.gz

# Restore
gunzip < backup_20260208.sql.gz | psql society_revenue_platform
```

See [SETUP.md](./SETUP.md#backup--restore) for automation.

---

## 🔗 External Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Database Design Best Practices](https://wiki.postgresql.org/wiki/Don't_Do_This)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)

---

## 📞 Support & Contribution

### Found an Issue?
- Database schema issues → Update `schema.sql`
- Documentation issues → Update relevant markdown files
- Performance issues → Check [OPTIMIZATION_SUMMARY.md](./OPTIMIZATION_SUMMARY.md)

### Adding Features?
1. Read [README.md](./README.md) for design principles
2. Check [ERD.md](./ERD.md) for existing relationships
3. Follow naming conventions
4. Add indexes for new queries
5. Update documentation

---

## 📝 Documentation Standards

All database changes should update:
1. ✅ `schema.sql` - Always keep as source of truth
2. ✅ `ERD.md` - If relationships change
3. ✅ `README.md` - If design patterns change
4. ✅ `prisma/schema.prisma` - If using Prisma
5. ✅ Migration files - For version control

---

## 🎓 Learning Path

**For New Developers:**
1. Start with [ERD.md](./ERD.md) - Understand structure visually
2. Read [SETUP.md](./SETUP.md) - Set up local environment
3. Explore data with Prisma Studio or pgAdmin
4. Read [README.md](./README.md) - Understand design principles
5. Study [OPTIMIZATION_SUMMARY.md](./OPTIMIZATION_SUMMARY.md) - Learn best practices

**For Product/Business:**
1. [ERD.md](./ERD.md) - Understand data relationships
2. [OPTIMIZATION_SUMMARY.md](./OPTIMIZATION_SUMMARY.md) - Understand scalability

**For DevOps:**
1. [SETUP.md](./SETUP.md) - Deployment procedures
2. [README.md](./README.md) - Monitoring and performance
3. [OPTIMIZATION_SUMMARY.md](./OPTIMIZATION_SUMMARY.md) - Scaling strategy

---

## ✅ Checklist: Before Production

Database Setup:
- [ ] Apply schema.sql to production database
- [ ] Configure connection pooling (PgBouncer)
- [ ] Set up automated backups (daily)
- [ ] Enable slow query logging
- [ ] Configure replication (if needed)
- [ ] Test backup restoration

Security:
- [ ] Create separate DB users (app, readonly)
- [ ] Enable SSL connections
- [ ] Configure firewall rules
- [ ] Secure connection strings
- [ ] Enable Row-Level Security (optional)

Monitoring:
- [ ] Set up pg_stat_statements
- [ ] Configure alerts (disk space, connections, slow queries)
- [ ] Set up APM (Application Performance Monitoring)
- [ ] Document runbooks for common issues

Documentation:
- [ ] Update connection strings in deployment docs
- [ ] Document backup procedures
- [ ] Create incident response plan
- [ ] Train team on database operations

---

## 🏆 Database Health Score

Measure your database setup:

- ✅ Schema applied correctly
- ✅ All indexes created
- ✅ Backups configured and tested
- ✅ Monitoring enabled
- ✅ Documentation up to date
- ✅ Team trained
- ✅ Performance tested at scale
- ✅ Security hardened

**Score: ___ / 8**

Target: 8/8 for production readiness.

---

*Last Updated: 2026-02-08*
*Database Version: 1.0.0*
*PostgreSQL Version: 15+*
