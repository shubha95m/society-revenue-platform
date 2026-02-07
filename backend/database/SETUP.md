# Database Setup Guide

## Prerequisites

- PostgreSQL 15+ installed
- Node.js 18+ (for Prisma)
- Basic SQL knowledge

## Quick Start

### Option 1: Using Docker (Recommended for Development)

```bash
# 1. Start PostgreSQL with Docker
cd society-revenue-platform
docker-compose up -d postgres

# 2. Wait for PostgreSQL to be ready
docker-compose logs -f postgres
# Wait for: "database system is ready to accept connections"

# 3. Apply the schema
docker exec -i society-postgres psql -U postgres -d society_revenue_platform < backen./backend/database/schema.sql

# 4. Verify setup
docker exec -it society-postgres psql -U postgres -d society_revenue_platform -c "\dt"
```

### Option 2: Using Local PostgreSQL

```bash
# 1. Create database
createdb society_revenue_platform

# 2. Apply schema
psql -d society_revenue_platform -f backen./backend/database/schema.sql

# 3. Verify
psql -d society_revenue_platform -c "\dt"
```

### Option 3: Using Prisma Migrate

```bash
# 1. Install dependencies
cd frontend
npm install prisma @prisma/client

# 2. Initialize Prisma (already done, skip if schema.prisma exists)
npx prisma init

# 3. Set DATABASE_URL in .env
echo "DATABASE_URL='postgresql://postgres:password@localhost:5432/society_revenue_platform'" > .env

# 4. Push schema to database
npx prisma db push

# 5. Generate Prisma Client
npx prisma generate

# 6. Open Prisma Studio to view data
npx prisma studio
```

## Docker Compose Configuration

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: society-postgres
    environment:
      POSTGRES_DB: society_revenue_platform
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_secure_password_here
      POSTGRES_INITDB_ARGS: "-E UTF8"
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backen./backend/database/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
      # Optional: Add seed data
      # - ./database/seeds.sql:/docker-entrypoint-initdb.d/02-seeds.sql
    networks:
      - society-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Optional: PgAdmin for database management
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: society-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@societyrevenue.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    networks:
      - society-network
    depends_on:
      - postgres

  # Optional: Redis for caching
  redis:
    image: redis:7-alpine
    container_name: society-redis
    ports:
      - "6379:6379"
    networks:
      - society-network

volumes:
  postgres_data:

networks:
  society-network:
    driver: bridge
```

## Environment Configuration

### Frontend (.env)

```bash
# Database
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/society_revenue_platform?schema=public"

# Redis (optional, for caching)
REDIS_URL="redis://localhost:6379"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# File Upload (AWS S3 or CloudFlare R2)
S3_ACCESS_KEY="your-access-key"
S3_SECRET_KEY="your-secret-key"
S3_BUCKET="society-revenue-uploads"
S3_REGION="us-east-1"

# Payment Gateway (Razorpay/Stripe)
RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"

# Platform Settings
PLATFORM_COMMISSION_PERCENTAGE=5.0
NODE_ENV="development"
```

## Database User Setup (Production)

For production, create separate users with limited permissions:

```sql
-- Create application user
CREATE USER society_app WITH PASSWORD 'strong_password_here';

-- Grant necessary permissions
GRANT CONNECT ON DATABASE society_revenue_platform TO society_app;
GRANT USAGE ON SCHEMA public TO society_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO society_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO society_app;

-- Create read-only user for analytics
CREATE USER society_analytics WITH PASSWORD 'analytics_password';
GRANT CONNECT ON DATABASE society_revenue_platform TO society_analytics;
GRANT USAGE ON SCHEMA public TO society_analytics;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO society_analytics;

-- For future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO society_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO society_analytics;
```

## Connection Pooling

### Using PgBouncer (Recommended for Production)

```ini
# /etc/pgbouncer/pgbouncer.ini

[databases]
society_revenue_platform = host=localhost port=5432 dbname=society_revenue_platform

[pgbouncer]
listen_addr = 127.0.0.1
listen_port = 6432
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
reserve_pool_size = 5
reserve_pool_timeout = 3
server_lifetime = 3600
server_idle_timeout = 600
```

Then connect via: `postgresql://user:pass@localhost:6432/society_revenue_platform`

### Using Prisma's Connection Pool

```javascript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

## Seed Data for Development

Create `database/seeds.sql`:

```sql
-- Platform Admin
INSERT INTO users (id, email, password_hash, first_name, last_name, role, status, email_verified)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@societyrevenue.com', '$2b$10$...', 'Platform', 'Admin', 'platform_admin', 'active', true);

-- Sample Society
INSERT INTO societies (id, name, slug, address_line1, city, state, pincode, total_flats, total_towers, occupied_flats, status)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Green Valley Apartments', 'green-valley', 'Andheri West', 'Mumbai', 'Maharashtra', '400053', 120, 2, 78, 'active');

-- Society Admin User
INSERT INTO users (id, email, password_hash, first_name, last_name, role, status, email_verified)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'admin@greenvalley.com', '$2b$10$...', 'Society', 'Admin', 'society_admin', 'active', true);

-- Society Admin Resident Record
INSERT INTO residents (user_id, society_id, flat_number, tower, is_primary_resident, is_verified)
VALUES
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'A-101', 'Tower A', true, true);

-- Sample Resident
INSERT INTO users (id, email, password_hash, first_name, last_name, role, status, email_verified)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'john@example.com', '$2b$10$...', 'John', 'Doe', 'resident', 'active', true);

INSERT INTO residents (user_id, society_id, flat_number, tower, is_primary_resident, is_verified)
VALUES
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'A-304', 'Tower A', true, true);

-- Sample Vendor
INSERT INTO users (id, email, password_hash, first_name, last_name, role, status, email_verified)
VALUES
  ('44444444-4444-4444-4444-444444444444', 'vendor@cleanpro.com', '$2b$10$...', 'Clean', 'Pro', 'vendor', 'active', true);

INSERT INTO vendors (user_id, business_name, city, state, status, verification_status)
VALUES
  ('44444444-4444-4444-4444-444444444444', 'CleanPro Services', 'Mumbai', 'Maharashtra', 'active', 'verified');

-- Sample Services
INSERT INTO services (id, name, slug, category, description, pricing_model, base_price, unit)
VALUES
  ('55555555-5555-5555-5555-555555555555', 'Grocery Delivery', 'grocery-delivery', 'daily_essentials', 'Daily grocery delivery service', 'subscription', 500, 'month'),
  ('66666666-6666-6666-6666-666666666666', 'Laundry Service', 'laundry-service', 'home_services', 'Pick and drop laundry', 'per_unit', 150, 'kg');
```

Apply seeds:
```bash
psql -d society_revenue_platform -f database/seeds.sql
```

## Backup & Restore

### Automated Daily Backup Script

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"
DB_NAME="society_revenue_platform"
DB_USER="postgres"

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

# Backup
pg_dump -U $DB_USER -d $DB_NAME | gzip > "$BACKUP_DIR/backup_$DATE.sql.gz"

# Delete backups older than 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

Make executable and add to cron:
```bash
chmod +x backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

### Restore from Backup

```bash
# Restore from compressed backup
gunzip < backup_20260208_020000.sql.gz | psql -d society_revenue_platform

# Or from uncompressed
psql -d society_revenue_platform < backup.sql
```

## Monitoring & Maintenance

### Enable Query Logging

```sql
-- In postgresql.conf or via SQL
ALTER SYSTEM SET log_min_duration_statement = 1000;  -- Log queries > 1s
ALTER SYSTEM SET log_statement = 'all';              -- Log all statements (dev only)
ALTER SYSTEM SET log_duration = on;
SELECT pg_reload_conf();
```

### Monitor Slow Queries

```sql
-- Install pg_stat_statements
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Find slowest queries
SELECT
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### Monitor Table Sizes

```sql
-- Table sizes
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Database size
SELECT pg_size_pretty(pg_database_size('society_revenue_platform'));
```

### Vacuum & Analyze

```sql
-- Run regularly to optimize
VACUUM ANALYZE;

-- For specific table
VACUUM ANALYZE orders;

-- Auto-vacuum settings (postgresql.conf)
autovacuum = on
autovacuum_max_workers = 3
autovacuum_naptime = 60s
```

## Testing Database

### Create Test Database

```bash
# Create test DB
createdb society_revenue_platform_test

# Apply schema
psql -d society_revenue_platform_test -f backen./backend/database/schema.sql

# Configure in .env.test
DATABASE_URL="postgresql://postgres:password@localhost:5432/society_revenue_platform_test"
```

### Reset Test Database

```bash
#!/bin/bash
# reset-test-db.sh

dropdb society_revenue_platform_test
createdb society_revenue_platform_test
psql -d society_revenue_platform_test -f backen./backend/database/schema.sql
psql -d society_revenue_platform_test -f database/seeds.sql
```

## Migrations Strategy

### Using Prisma Migrate

```bash
# Create a new migration
npx prisma migrate dev --name add_vendor_ratings

# Apply migrations in production
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Manual Migration Files

Create `database/migrations/` folder:

```
database/migrations/
  ├── 001_initial_schema.sql
  ├── 002_add_vendor_features.sql
  ├── 003_add_analytics.sql
  └── README.md
```

Track applied migrations:

```sql
CREATE TABLE schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Performance Tuning

### PostgreSQL Configuration

For a server with 8GB RAM:

```ini
# postgresql.conf

# Memory
shared_buffers = 2GB                  # 25% of RAM
effective_cache_size = 6GB            # 75% of RAM
work_mem = 32MB                       # Per operation
maintenance_work_mem = 512MB

# Connections
max_connections = 200

# WAL
wal_buffers = 16MB
checkpoint_completion_target = 0.9

# Planner
random_page_cost = 1.1                # For SSD
effective_io_concurrency = 200        # For SSD
```

Restart PostgreSQL after changes:
```bash
sudo systemctl restart postgresql
```

## Troubleshooting

### Connection Issues

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check connections
psql -d society_revenue_platform -c "SELECT count(*) FROM pg_stat_activity;"

# Check connection limit
psql -d society_revenue_platform -c "SHOW max_connections;"
```

### Index Issues

```sql
-- Find missing indexes
SELECT
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public'
  AND n_distinct > 100
  AND correlation < 0.01;

-- Rebuild all indexes
REINDEX DATABASE society_revenue_platform;
```

### Lock Issues

```sql
-- Find blocking queries
SELECT
  pid,
  usename,
  pg_blocking_pids(pid) as blocked_by,
  query
FROM pg_stat_activity
WHERE cardinality(pg_blocking_pids(pid)) > 0;

-- Kill a blocking query
SELECT pg_terminate_backend(pid);
```

## Production Checklist

- [ ] Use strong passwords for all database users
- [ ] Enable SSL connections
- [ ] Set up automated backups
- [ ] Configure connection pooling (PgBouncer)
- [ ] Enable monitoring (pg_stat_statements)
- [ ] Set up replication for high availability
- [ ] Configure proper firewall rules
- [ ] Regular VACUUM and ANALYZE
- [ ] Monitor disk space
- [ ] Set up alerts for slow queries
- [ ] Document connection strings securely
- [ ] Test backup restoration regularly

## Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PgBouncer Documentation](https://www.pgbouncer.org/)
- [PostgreSQL Performance Optimization](https://wiki.postgresql.org/wiki/Performance_Optimization)
