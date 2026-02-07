# Task 01: Database Schema Design

## Objective
Design and implement the complete multi-tenant database schema with proper isolation and relationships.

## Core Principles
- Multi-tenant isolation via `society_id`
- Strict foreign key constraints
- Immutable audit trails
- Performance-optimized indexes

## Subtasks

### 1. Core Tables Design

#### Users & Authentication
- [ ] `users` table (user_id, role, society_id, email, phone, status)
- [ ] `auth_tokens` table (JWT management)
- [ ] `user_roles` table (RBAC definitions)
- [ ] `user_sessions` table (session tracking)

#### Society Management
- [ ] `societies` table (society_id, name, address, city, status, onboarding_date)
- [ ] `society_config` table (settings, preferences)
- [ ] `buildings` table (building_id, society_id, name)
- [ ] `flats` table (flat_id, building_id, flat_number, resident_id)
- [ ] `society_assets` table (amenities, infrastructure)

#### Financial Core
- [ ] `ledger` table (immutable, transaction_id, society_id, type, amount, timestamp, description)
- [ ] `maintenance_records` table (flat_id, period, amount, paid_status)
- [ ] `revenue_streams` table (society_id, stream_type, amount, source)
- [ ] `expense_records` table (society_id, category, amount, timestamp)

#### Vendor Management
- [ ] `vendors` table (vendor_id, name, category, contact, status)
- [ ] `vendor_services` table (service_id, vendor_id, category, description)
- [ ] `society_vendor_contracts` table (contract_id, society_id, vendor_id, terms, commission, status)
- [ ] `vendor_approvals` table (society_id, vendor_id, approved_by, status)

#### Service Marketplace
- [ ] `service_categories` table (category_id, name, description)
- [ ] `service_bookings` table (booking_id, flat_id, vendor_id, service_id, status, amount)
- [ ] `service_ratings` table (booking_id, rating, feedback)

#### Governance & Voting
- [ ] `proposals` table (proposal_id, society_id, title, description, impact, status)
- [ ] `votes` table (vote_id, proposal_id, user_id, choice, timestamp)
- [ ] `voting_rules` table (quorum, thresholds)

#### Asset Monetization
- [ ] `asset_inventory` table (asset_id, society_id, type, capacity, status)
- [ ] `asset_bookings` table (booking_id, asset_id, date, amount, booked_by)
- [ ] `asset_revenue` table (asset_id, period, revenue)

#### Utilities & Analytics
- [ ] `utility_bills` table (bill_id, society_id, utility_type, amount, period)
- [ ] `utility_trends` table (aggregated analytics)
- [ ] `anomaly_logs` table (detected anomalies)

#### System Tables
- [ ] `audit_logs` table (comprehensive activity tracking)
- [ ] `notifications` table (user_id, type, message, read_status)
- [ ] `system_config` table (platform-wide settings)

### 2. Relationships & Constraints
- [ ] Define all foreign key relationships
- [ ] Add unique constraints where needed
- [ ] Set up cascading delete rules carefully
- [ ] Add check constraints for data validation

### 3. Indexes & Performance
- [ ] Create indexes on society_id (for tenant isolation)
- [ ] Index foreign keys
- [ ] Index frequently queried columns (status, timestamps)
- [ ] Create composite indexes for common queries

### 4. Data Isolation
- [ ] Implement row-level security policies for multi-tenancy
- [ ] Ensure society_id is present in all tenant-scoped tables
- [ ] Create database views for role-based data access
- [ ] Test cross-tenant data leakage scenarios

### 5. Migration Scripts
- [ ] Create initial schema migration
- [ ] Create seed data scripts (test societies, users, vendors)
- [ ] Create rollback scripts
- [ ] Document migration process

## Acceptance Criteria
- All tables created with proper relationships
- Multi-tenant isolation is enforced at database level
- Performance benchmarks meet requirements (queries < 100ms)
- Seed data can populate a functional test environment
- No cross-tenant data leakage in tests

## Dependencies
- Task 00 (Project Setup)

## Estimated Effort
5-7 days
