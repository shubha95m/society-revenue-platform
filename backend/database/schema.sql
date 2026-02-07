-- =====================================================
-- SOCIETY REVENUE PLATFORM - DATABASE SCHEMA
-- Database: PostgreSQL 15+
-- =====================================================
-- Design Principles:
-- 1. Normalized structure for data integrity
-- 2. Strategic denormalization for performance
-- 3. Proper indexing for low-latency queries
-- 4. JSONB for flexible metadata
-- 5. Array types for many-to-many relationships where appropriate
-- 6. Soft deletes with deleted_at
-- 7. Audit columns (created_at, updated_at)
-- =====================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- =====================================================
-- CORE ENTITIES
-- =====================================================

-- User roles enum
CREATE TYPE user_role AS ENUM ('platform_admin', 'society_admin', 'resident', 'vendor');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');

-- Users table - Central authentication and role management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL,
    status user_status DEFAULT 'pending_verification',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    profile_image_url TEXT,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for users
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_status ON users(status);

-- =====================================================
-- SOCIETIES
-- =====================================================

CREATE TYPE society_status AS ENUM ('active', 'onboarding', 'suspended', 'inactive');

CREATE TABLE societies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL, -- For URLs
    registration_number VARCHAR(100) UNIQUE,

    -- Location
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    -- Society Details
    total_flats INTEGER NOT NULL,
    total_towers INTEGER DEFAULT 1,
    occupied_flats INTEGER DEFAULT 0,
    occupancy_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN total_flats > 0
        THEN (occupied_flats::DECIMAL / total_flats::DECIMAL * 100)
        ELSE 0 END
    ) STORED,

    -- Admin Contact
    admin_name VARCHAR(255),
    admin_email VARCHAR(255),
    admin_phone VARCHAR(20),

    -- Financial
    monthly_maintenance_charge DECIMAL(10,2),
    current_revenue DECIMAL(12,2) DEFAULT 0,
    total_revenue_generated DECIMAL(15,2) DEFAULT 0,

    -- Status
    status society_status DEFAULT 'onboarding',
    onboarding_completed_at TIMESTAMP WITH TIME ZONE,
    subscription_tier VARCHAR(50) DEFAULT 'basic', -- basic, premium, enterprise
    subscription_valid_until DATE,

    -- Metadata
    amenities_info JSONB DEFAULT '[]'::jsonb,
    settings JSONB DEFAULT '{}'::jsonb, -- Society-specific settings

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for societies
CREATE INDEX idx_societies_slug ON societies(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_societies_city ON societies(city) WHERE deleted_at IS NULL;
CREATE INDEX idx_societies_status ON societies(status);
CREATE INDEX idx_societies_location ON societies USING gist(ll_to_earth(latitude, longitude));

-- =====================================================
-- RESIDENTS
-- =====================================================

CREATE TABLE residents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,

    -- Flat Details
    flat_number VARCHAR(50) NOT NULL,
    tower VARCHAR(50),
    floor INTEGER,

    -- Ownership
    ownership_type VARCHAR(50), -- owner, tenant, family_member
    move_in_date DATE,

    -- Family
    family_members INTEGER DEFAULT 1,

    -- Status
    is_primary_resident BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_document_url TEXT,

    -- Participation
    vote_participation_count INTEGER DEFAULT 0,
    service_requests_count INTEGER DEFAULT 0,
    complaints_count INTEGER DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,

    UNIQUE(society_id, flat_number, user_id)
);

-- Indexes for residents
CREATE INDEX idx_residents_user_id ON residents(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_residents_society_id ON residents(society_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_residents_flat ON residents(society_id, flat_number);

-- =====================================================
-- VENDORS
-- =====================================================

CREATE TYPE vendor_status AS ENUM ('active', 'pending_verification', 'suspended', 'inactive');
CREATE TYPE vendor_verification_status AS ENUM ('unverified', 'documents_submitted', 'verified', 'rejected');

CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Business Details
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100), -- individual, partnership, company
    registration_number VARCHAR(100),
    gst_number VARCHAR(20),
    pan_number VARCHAR(20),

    -- Contact
    business_email VARCHAR(255),
    business_phone VARCHAR(20),
    website_url TEXT,

    -- Location & Service Area
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    service_radius_km INTEGER DEFAULT 10, -- How far they serve

    -- Business Info
    years_in_business INTEGER,
    employee_count INTEGER,
    description TEXT,

    -- Ratings & Stats
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    total_contracts INTEGER DEFAULT 0,
    total_orders_completed INTEGER DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0,

    -- Verification
    status vendor_status DEFAULT 'pending_verification',
    verification_status vendor_verification_status DEFAULT 'unverified',
    verification_documents JSONB DEFAULT '[]'::jsonb,
    verified_at TIMESTAMP WITH TIME ZONE,

    -- Performance
    response_time_hours INTEGER, -- Average response time
    completion_rate DECIMAL(5,2), -- % of orders completed successfully

    -- Metadata
    certifications JSONB DEFAULT '[]'::jsonb,
    bank_details JSONB DEFAULT '{}'::jsonb, -- Encrypted
    settings JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for vendors
CREATE INDEX idx_vendors_user_id ON vendors(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_vendors_status ON vendors(status);
CREATE INDEX idx_vendors_city ON vendors(city) WHERE deleted_at IS NULL;
CREATE INDEX idx_vendors_rating ON vendors(average_rating DESC) WHERE deleted_at IS NULL;

-- Vendor-Society Junction (Many-to-Many)
CREATE TABLE vendor_societies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,

    -- Relationship status
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, suspended
    contract_start_date DATE,
    contract_end_date DATE,

    -- Performance at this society
    orders_completed INTEGER DEFAULT 0,
    society_rating DECIMAL(3,2),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(vendor_id, society_id)
);

CREATE INDEX idx_vendor_societies_vendor ON vendor_societies(vendor_id);
CREATE INDEX idx_vendor_societies_society ON vendor_societies(society_id);

-- =====================================================
-- SERVICES CATALOG
-- =====================================================

CREATE TYPE service_category AS ENUM (
    'daily_essentials',
    'home_maintenance',
    'home_services',
    'health_wellness',
    'pet_services',
    'transportation',
    'cleaning',
    'food_beverage',
    'other'
);

CREATE TYPE service_pricing_model AS ENUM ('per_service', 'per_unit', 'subscription', 'custom');

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Basic Info
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category service_category NOT NULL,
    subcategory VARCHAR(100),
    description TEXT,

    -- Pricing Info (Default/Template)
    pricing_model service_pricing_model DEFAULT 'per_service',
    base_price DECIMAL(10,2),
    unit VARCHAR(50), -- kg, hour, visit, month

    -- Service Details
    is_active BOOLEAN DEFAULT TRUE,
    requires_subscription BOOLEAN DEFAULT FALSE,

    -- Search & Discovery
    keywords TEXT[], -- For search optimization
    tags TEXT[],

    -- Metadata
    icon_name VARCHAR(50), -- For UI
    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_services_category ON services(category) WHERE deleted_at IS NULL;
CREATE INDEX idx_services_slug ON services(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_services_search ON services USING gin(keywords, tags);

-- Service-Society Junction (Which services are available in which society)
CREATE TABLE service_societies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,

    -- Availability
    is_active BOOLEAN DEFAULT TRUE,
    activated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Society-specific pricing
    society_price DECIMAL(10,2),
    discount_percentage DECIMAL(5,2),

    -- Usage Stats
    total_orders INTEGER DEFAULT 0,
    total_residents_using INTEGER DEFAULT 0,
    monthly_revenue DECIMAL(12,2) DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(service_id, society_id)
);

CREATE INDEX idx_service_societies_service ON service_societies(service_id);
CREATE INDEX idx_service_societies_society ON service_societies(society_id);

-- Service-Vendor Junction (Which vendors provide which services)
CREATE TABLE service_vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,

    -- Vendor's offering
    is_active BOOLEAN DEFAULT TRUE,
    vendor_price DECIMAL(10,2),
    min_order_value DECIMAL(10,2),
    max_capacity INTEGER, -- Orders they can handle per day/month

    -- Performance
    orders_completed INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(service_id, vendor_id)
);

CREATE INDEX idx_service_vendors_service ON service_vendors(service_id);
CREATE INDEX idx_service_vendors_vendor ON service_vendors(vendor_id);

-- =====================================================
-- SERVICE REQUESTS (Resident → Society Admin)
-- =====================================================

CREATE TYPE service_request_status AS ENUM (
    'pending',           -- Waiting for admin review
    'under_review',      -- Admin is reviewing
    'poll_created',      -- Poll created for voting
    'approved',          -- Poll passed, ready to publish
    'published',         -- Published to vendor marketplace
    'rejected',          -- Admin rejected
    'closed'            -- Request closed
);

CREATE TABLE service_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Request Info
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    requested_by_user_id UUID NOT NULL REFERENCES users(id),

    -- Service Details
    service_name VARCHAR(255) NOT NULL,
    category service_category NOT NULL,
    description TEXT NOT NULL,
    estimated_budget VARCHAR(100), -- "₹500-800/month"
    expected_volume TEXT, -- "50 residents interested"

    -- Status & Workflow
    status service_request_status DEFAULT 'pending',

    -- Community Interest
    upvotes INTEGER DEFAULT 1, -- Auto-upvote by requester
    upvoted_by_user_ids UUID[] DEFAULT ARRAY[]::UUID[], -- For quick check
    comments_count INTEGER DEFAULT 0,

    -- Admin Actions
    reviewed_by_admin_id UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,

    -- Poll Integration
    poll_id UUID, -- References votes table
    poll_result VARCHAR(100), -- "72% approved"

    -- Publishing
    requirement_id UUID, -- References requirements table when published
    published_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_service_requests_society ON service_requests(society_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_service_requests_requester ON service_requests(requested_by_user_id);

-- Service Request Upvotes (for audit trail)
CREATE TABLE service_request_upvotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(service_request_id, user_id)
);

CREATE INDEX idx_request_upvotes_request ON service_request_upvotes(service_request_id);

-- =====================================================
-- REQUIREMENTS (Published to Vendor Marketplace)
-- =====================================================

CREATE TYPE requirement_status AS ENUM ('active', 'closed', 'awarded', 'expired');

CREATE TABLE requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Source
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    service_request_id UUID REFERENCES service_requests(id), -- Origin if from resident request

    -- Requirement Details
    service_name VARCHAR(255) NOT NULL,
    category service_category NOT NULL,
    description TEXT NOT NULL,

    -- Budget & Volume
    budget_range_min DECIMAL(10,2),
    budget_range_max DECIMAL(10,2),
    budget_display VARCHAR(100), -- "₹500-800/month"
    expected_monthly_volume TEXT,
    interested_residents INTEGER,

    -- Requirements
    specific_requirements TEXT,
    required_certifications TEXT[],

    -- Timeline
    status requirement_status DEFAULT 'active',
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,

    -- Metrics
    views_count INTEGER DEFAULT 0,
    proposals_count INTEGER DEFAULT 0,
    shortlisted_proposals INTEGER DEFAULT 0,

    -- Metadata
    poll_result VARCHAR(100), -- "72% approval" for transparency
    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_requirements_society ON requirements(society_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_requirements_status ON requirements(status);
CREATE INDEX idx_requirements_category ON requirements(category);
CREATE INDEX idx_requirements_published ON requirements(published_at DESC);

-- Requirement Views (for analytics)
CREATE TABLE requirement_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requirement_id UUID NOT NULL REFERENCES requirements(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(requirement_id, vendor_id, viewed_at::date) -- One view per day per vendor
);

CREATE INDEX idx_requirement_views_requirement ON requirement_views(requirement_id);

-- =====================================================
-- PROPOSALS (Vendor → Society)
-- =====================================================

CREATE TYPE proposal_status AS ENUM (
    'submitted',
    'under_review',
    'shortlisted',
    'accepted',
    'rejected',
    'withdrawn'
);

CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Relationship
    requirement_id UUID NOT NULL REFERENCES requirements(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,

    -- Proposal Details
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    -- Pricing
    pricing_model service_pricing_model NOT NULL,
    price_per_unit DECIMAL(10,2),
    price_display VARCHAR(100), -- "₹150/kg"
    minimum_order_value DECIMAL(10,2),
    estimated_monthly_cost DECIMAL(12,2),

    -- Service Details
    service_frequency VARCHAR(100), -- "Daily", "Weekly", "On-demand"
    coverage_details TEXT,
    delivery_timeline VARCHAR(100),

    -- Terms
    contract_duration_months INTEGER,
    payment_terms TEXT,
    cancellation_policy TEXT,

    -- Status
    status proposal_status DEFAULT 'submitted',

    -- Admin Review
    reviewed_by_admin_id UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT,

    -- Attachments
    documents JSONB DEFAULT '[]'::jsonb, -- Array of document URLs

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_proposals_requirement ON proposals(requirement_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_proposals_vendor ON proposals(vendor_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_proposals_society ON proposals(society_id);
CREATE INDEX idx_proposals_status ON proposals(status);

-- =====================================================
-- CONTRACTS (Finalized Agreements)
-- =====================================================

CREATE TYPE contract_status AS ENUM ('draft', 'active', 'suspended', 'expired', 'terminated');

CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_number VARCHAR(100) UNIQUE NOT NULL,

    -- Parties
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE RESTRICT,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    service_id UUID REFERENCES services(id),
    proposal_id UUID REFERENCES proposals(id),

    -- Contract Details
    title VARCHAR(255) NOT NULL,
    description TEXT,

    -- Pricing
    pricing_model service_pricing_model NOT NULL,
    price_per_unit DECIMAL(10,2),
    estimated_monthly_value DECIMAL(12,2),

    -- Terms
    start_date DATE NOT NULL,
    end_date DATE,
    duration_months INTEGER,
    auto_renewal BOOLEAN DEFAULT FALSE,
    payment_terms TEXT,

    -- Status
    status contract_status DEFAULT 'draft',
    signed_by_society_admin_id UUID REFERENCES users(id),
    signed_by_society_at TIMESTAMP WITH TIME ZONE,
    signed_by_vendor_at TIMESTAMP WITH TIME ZONE,

    -- Performance
    total_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0,

    -- Documents
    contract_document_url TEXT,
    attachments JSONB DEFAULT '[]'::jsonb,

    -- Termination
    terminated_at TIMESTAMP WITH TIME ZONE,
    termination_reason TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_contracts_society ON contracts(society_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_contracts_vendor ON contracts(vendor_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_dates ON contracts(start_date, end_date);

-- =====================================================
-- ORDERS (Service Bookings)
-- =====================================================

CREATE TYPE order_status AS ENUM (
    'pending',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled',
    'refunded'
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(100) UNIQUE NOT NULL,

    -- Parties
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE RESTRICT,
    resident_id UUID NOT NULL REFERENCES residents(id) ON DELETE RESTRICT,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    service_id UUID NOT NULL REFERENCES services(id),
    contract_id UUID REFERENCES contracts(id),

    -- Order Details
    service_name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity DECIMAL(10,2) DEFAULT 1,
    unit VARCHAR(50),

    -- Pricing
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,

    -- Platform Commission
    platform_commission_percentage DECIMAL(5,2) DEFAULT 5.00,
    platform_commission_amount DECIMAL(10,2),
    vendor_payout_amount DECIMAL(10,2),

    -- Service Details
    scheduled_date DATE,
    scheduled_time_slot VARCHAR(50),
    delivery_address TEXT,
    special_instructions TEXT,

    -- Status & Timeline
    status order_status DEFAULT 'pending',
    confirmed_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,

    -- Rating & Feedback
    resident_rating INTEGER CHECK (resident_rating >= 1 AND resident_rating <= 5),
    resident_feedback TEXT,
    rated_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_society ON orders(society_id);
CREATE INDEX idx_orders_resident ON orders(resident_id);
CREATE INDEX idx_orders_vendor ON orders(vendor_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(scheduled_date DESC);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- =====================================================
-- VOTES & POLLS
-- =====================================================

CREATE TYPE vote_category AS ENUM ('vendor_selection', 'service_requirement', 'major_expense', 'policy', 'other');
CREATE TYPE poll_status AS ENUM ('draft', 'active', 'closed', 'passed', 'failed', 'invalid');

CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Poll Details
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    category vote_category NOT NULL,

    -- Source (if from service request)
    service_request_id UUID REFERENCES service_requests(id),

    -- Proposer
    proposed_by_user_id UUID NOT NULL REFERENCES users(id),
    proposed_by_role user_role NOT NULL,

    -- Voting Rules
    quorum_percentage INTEGER DEFAULT 50, -- % of residents must vote
    approval_threshold_percentage INTEGER DEFAULT 60, -- % of yes votes needed

    -- Timeline
    voting_start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    voting_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status poll_status DEFAULT 'active',

    -- Results (updated in real-time)
    total_eligible_voters INTEGER NOT NULL,
    total_votes_cast INTEGER DEFAULT 0,
    yes_votes INTEGER DEFAULT 0,
    no_votes INTEGER DEFAULT 0,
    abstain_votes INTEGER DEFAULT 0,

    -- Calculated Fields
    turnout_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN total_eligible_voters > 0
        THEN (total_votes_cast::DECIMAL / total_eligible_voters::DECIMAL * 100)
        ELSE 0 END
    ) STORED,
    approval_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN total_votes_cast > 0
        THEN (yes_votes::DECIMAL / total_votes_cast::DECIMAL * 100)
        ELSE 0 END
    ) STORED,

    -- Impact Statement
    financial_impact TEXT,
    expected_benefit TEXT,

    -- Additional Info
    details TEXT,
    attachments JSONB DEFAULT '[]'::jsonb,

    -- Closure
    closed_at TIMESTAMP WITH TIME ZONE,
    closed_by_admin_id UUID REFERENCES users(id),

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_votes_society ON votes(society_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_votes_status ON votes(status);
CREATE INDEX idx_votes_category ON votes(category);
CREATE INDEX idx_votes_dates ON votes(voting_end_date);

-- Vote Responses
CREATE TYPE vote_choice AS ENUM ('yes', 'no', 'abstain');

CREATE TABLE vote_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resident_id UUID NOT NULL REFERENCES residents(id) ON DELETE CASCADE,

    choice vote_choice NOT NULL,
    comment TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(vote_id, user_id)
);

CREATE INDEX idx_vote_responses_vote ON vote_responses(vote_id);
CREATE INDEX idx_vote_responses_user ON vote_responses(user_id);

-- =====================================================
-- COMPLAINTS
-- =====================================================

CREATE TYPE complaint_category AS ENUM (
    'maintenance',
    'cleanliness',
    'security',
    'noise',
    'parking',
    'vendor_service',
    'amenity',
    'other'
);

CREATE TYPE complaint_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE complaint_status AS ENUM ('open', 'acknowledged', 'in_progress', 'resolved', 'closed', 'rejected');

CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_number VARCHAR(100) UNIQUE NOT NULL,

    -- Reporter
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    reported_by_user_id UUID NOT NULL REFERENCES users(id),
    resident_id UUID REFERENCES residents(id),

    -- Complaint Details
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category complaint_category NOT NULL,
    priority complaint_priority DEFAULT 'medium',
    location VARCHAR(255), -- "Tower A, 3rd Floor"

    -- Status
    status complaint_status DEFAULT 'open',

    -- Assignment
    assigned_to_user_id UUID REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE,

    -- Related Entities
    vendor_id UUID REFERENCES vendors(id), -- If complaint about vendor
    order_id UUID REFERENCES orders(id), -- If related to an order

    -- Resolution
    resolution_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by_user_id UUID REFERENCES users(id),

    -- Timeline
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,

    -- Attachments
    attachments JSONB DEFAULT '[]'::jsonb,

    -- Visibility
    is_public BOOLEAN DEFAULT FALSE, -- Show to all residents?

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_complaints_society ON complaints(society_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_complaints_reporter ON complaints(reported_by_user_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_priority ON complaints(priority);
CREATE INDEX idx_complaints_category ON complaints(category);

-- =====================================================
-- NOTICES
-- =====================================================

CREATE TYPE notice_priority AS ENUM ('low', 'normal', 'high', 'urgent');
CREATE TYPE notice_category AS ENUM ('announcement', 'maintenance', 'event', 'policy', 'emergency', 'other');

CREATE TABLE notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Notice Details
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category notice_category NOT NULL,
    priority notice_priority DEFAULT 'normal',

    -- Publisher
    published_by_user_id UUID NOT NULL REFERENCES users(id),

    -- Visibility
    is_active BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,

    -- Target Audience
    target_towers TEXT[], -- Specific towers, NULL = all
    target_floors INTEGER[], -- Specific floors, NULL = all

    -- Engagement
    views_count INTEGER DEFAULT 0,

    -- Attachments
    attachments JSONB DEFAULT '[]'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_notices_society ON notices(society_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_notices_published ON notices(published_at DESC);
CREATE INDEX idx_notices_active ON notices(is_active, expires_at);

-- =====================================================
-- AMENITIES
-- =====================================================

CREATE TYPE amenity_type AS ENUM (
    'clubhouse',
    'swimming_pool',
    'gym',
    'sports_court',
    'party_hall',
    'meeting_room',
    'garden',
    'playground',
    'library',
    'other'
);

CREATE TABLE amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,

    -- Amenity Details
    name VARCHAR(255) NOT NULL,
    type amenity_type NOT NULL,
    description TEXT,
    location VARCHAR(255),
    capacity INTEGER,

    -- Availability
    is_bookable BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,

    -- Booking Rules
    booking_charges DECIMAL(10,2) DEFAULT 0,
    advance_booking_days INTEGER DEFAULT 30,
    max_hours_per_booking INTEGER DEFAULT 4,

    -- Operating Hours
    operating_hours JSONB DEFAULT '{}'::jsonb, -- {monday: "6AM-10PM", ...}

    -- Images
    images JSONB DEFAULT '[]'::jsonb,

    -- Stats
    total_bookings INTEGER DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_amenities_society ON amenities(society_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_amenities_type ON amenities(type);
CREATE INDEX idx_amenities_bookable ON amenities(is_bookable, is_active);

-- Amenity Bookings
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

CREATE TABLE amenity_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(100) UNIQUE NOT NULL,

    -- Booking Details
    amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE RESTRICT,
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE RESTRICT,
    resident_id UUID NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Schedule
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours DECIMAL(4,2),

    -- Status
    status booking_status DEFAULT 'pending',

    -- Payment
    booking_charge DECIMAL(10,2) DEFAULT 0,
    paid BOOLEAN DEFAULT FALSE,
    payment_reference VARCHAR(100),

    -- Additional Info
    purpose TEXT,
    guest_count INTEGER,
    special_requests TEXT,

    -- Approval
    approved_by_admin_id UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,

    -- Cancellation
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_amenity_bookings_amenity ON amenity_bookings(amenity_id);
CREATE INDEX idx_amenity_bookings_resident ON amenity_bookings(resident_id);
CREATE INDEX idx_amenity_bookings_date ON amenity_bookings(booking_date);
CREATE INDEX idx_amenity_bookings_status ON amenity_bookings(status);

-- =====================================================
-- FINANCIAL / LEDGER
-- =====================================================

CREATE TYPE transaction_type AS ENUM (
    'maintenance_charge',
    'service_revenue',
    'platform_commission',
    'vendor_payout',
    'booking_fee',
    'penalty',
    'refund',
    'other'
);

CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_number VARCHAR(100) UNIQUE NOT NULL,

    -- Parties
    society_id UUID REFERENCES societies(id),
    resident_id UUID REFERENCES residents(id),
    vendor_id UUID REFERENCES vendors(id),

    -- Transaction Details
    type transaction_type NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',

    -- Related Entities
    order_id UUID REFERENCES orders(id),
    booking_id UUID REFERENCES amenity_bookings(id),

    -- Status
    status transaction_status DEFAULT 'pending',

    -- Payment Details
    payment_method VARCHAR(50), -- UPI, card, netbanking, cash
    payment_reference VARCHAR(255),
    payment_gateway_transaction_id VARCHAR(255),

    -- Platform Financials
    platform_commission DECIMAL(10,2) DEFAULT 0,

    -- Timeline
    initiated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_society ON transactions(society_id);
CREATE INDEX idx_transactions_resident ON transactions(resident_id);
CREATE INDEX idx_transactions_vendor ON transactions(vendor_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_date ON transactions(completed_at DESC);

-- Ledger Entries (Double-entry bookkeeping)
CREATE TYPE ledger_entry_type AS ENUM ('debit', 'credit');

CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Account
    society_id UUID REFERENCES societies(id),
    account_type VARCHAR(100) NOT NULL, -- revenue, expense, commission, payout

    -- Entry Details
    entry_type ledger_entry_type NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    description TEXT NOT NULL,

    -- Related Transaction
    transaction_id UUID REFERENCES transactions(id),

    -- Balance After Transaction
    running_balance DECIMAL(15,2),

    -- Date
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ledger_entries_society ON ledger_entries(society_id);
CREATE INDEX idx_ledger_entries_date ON ledger_entries(entry_date DESC);
CREATE INDEX idx_ledger_entries_account ON ledger_entries(account_type);

-- =====================================================
-- ANALYTICS & REPORTS
-- =====================================================

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Report Details
    society_id UUID REFERENCES societies(id),
    report_type VARCHAR(100) NOT NULL, -- revenue, usage, performance, financial
    title VARCHAR(255) NOT NULL,

    -- Period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,

    -- Generated Data
    data JSONB NOT NULL,
    summary TEXT,

    -- Generation Info
    generated_by_user_id UUID REFERENCES users(id),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Export
    export_url TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reports_society ON reports(society_id);
CREATE INDEX idx_reports_type ON reports(report_type);
CREATE INDEX idx_reports_period ON reports(period_start, period_end);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

CREATE TYPE notification_type AS ENUM (
    'service_request_update',
    'poll_created',
    'poll_reminder',
    'proposal_received',
    'order_update',
    'complaint_update',
    'notice_published',
    'booking_confirmation',
    'payment_reminder',
    'other'
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Recipient
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Notification Details
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,

    -- Action Link
    action_url TEXT,

    -- Related Entities
    related_entity_type VARCHAR(100), -- 'order', 'vote', 'complaint', etc.
    related_entity_id UUID,

    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,

    -- Channels
    sent_via_email BOOLEAN DEFAULT FALSE,
    sent_via_push BOOLEAN DEFAULT FALSE,
    sent_via_sms BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- =====================================================
-- PLATFORM ADMIN (Super Admin)
-- =====================================================

CREATE TABLE platform_admin_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID NOT NULL REFERENCES users(id),

    activity_type VARCHAR(100) NOT NULL, -- society_onboarded, vendor_verified, etc.
    description TEXT NOT NULL,

    -- Related entities
    affected_society_id UUID REFERENCES societies(id),
    affected_vendor_id UUID REFERENCES vendors(id),
    affected_user_id UUID REFERENCES users(id),

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_platform_activities_admin ON platform_admin_activities(admin_user_id);
CREATE INDEX idx_platform_activities_date ON platform_admin_activities(created_at DESC);

-- Platform Configuration
CREATE TABLE platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_by_user_id UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TRIGGER FUNCTIONS FOR AUTO-UPDATES
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_societies_updated_at BEFORE UPDATE ON societies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_residents_updated_at BEFORE UPDATE ON residents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requirements_updated_at BEFORE UPDATE ON requirements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_votes_updated_at BEFORE UPDATE ON votes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Active Services per Society with Vendor Count
CREATE VIEW v_society_active_services AS
SELECT
    s.id as society_id,
    s.name as society_name,
    srv.id as service_id,
    srv.name as service_name,
    srv.category,
    ss.society_price,
    COUNT(DISTINCT sv.vendor_id) as available_vendors,
    ss.total_orders,
    ss.monthly_revenue
FROM societies s
JOIN service_societies ss ON s.id = ss.society_id
JOIN services srv ON ss.service_id = srv.id
LEFT JOIN service_vendors sv ON srv.id = sv.service_id AND sv.is_active = TRUE
WHERE s.deleted_at IS NULL
    AND srv.deleted_at IS NULL
    AND ss.is_active = TRUE
GROUP BY s.id, s.name, srv.id, srv.name, srv.category, ss.society_price, ss.total_orders, ss.monthly_revenue;

-- Resident Dashboard Summary
CREATE VIEW v_resident_dashboard AS
SELECT
    r.id as resident_id,
    r.user_id,
    u.first_name,
    u.last_name,
    s.name as society_name,
    r.flat_number,
    r.tower,
    COUNT(DISTINCT o.id) as total_orders,
    COUNT(DISTINCT c.id) as total_complaints,
    COUNT(DISTINCT vr.id) as total_votes_cast,
    r.vote_participation_count,
    r.service_requests_count
FROM residents r
JOIN users u ON r.user_id = u.id
JOIN societies s ON r.society_id = s.id
LEFT JOIN orders o ON r.id = o.resident_id
LEFT JOIN complaints c ON r.id = c.resident_id
LEFT JOIN vote_responses vr ON r.id = vr.resident_id
WHERE r.deleted_at IS NULL
GROUP BY r.id, r.user_id, u.first_name, u.last_name, s.name, r.flat_number, r.tower,
         r.vote_participation_count, r.service_requests_count;

-- Vendor Performance Summary
CREATE VIEW v_vendor_performance AS
SELECT
    v.id as vendor_id,
    v.business_name,
    v.average_rating,
    v.total_contracts,
    COUNT(DISTINCT vs.society_id) as active_societies,
    COUNT(DISTINCT sv.service_id) as services_offered,
    COUNT(DISTINCT o.id) as total_orders,
    COALESCE(SUM(o.vendor_payout_amount), 0) as total_earnings,
    v.completion_rate,
    v.response_time_hours
FROM vendors v
LEFT JOIN vendor_societies vs ON v.id = vs.vendor_id AND vs.status = 'active'
LEFT JOIN service_vendors sv ON v.id = sv.vendor_id AND sv.is_active = TRUE
LEFT JOIN orders o ON v.id = o.vendor_id AND o.status = 'completed'
WHERE v.deleted_at IS NULL
GROUP BY v.id, v.business_name, v.average_rating, v.total_contracts, v.completion_rate, v.response_time_hours;

-- =====================================================
-- SAMPLE DATA SEEDS (Optional - for development)
-- =====================================================

-- Commented out - uncomment for development environment
/*
-- Platform Admin
INSERT INTO users (email, phone, password_hash, first_name, last_name, role, status, email_verified)
VALUES ('admin@societyrevenue.com', '+919999999999', 'hashed_password', 'Platform', 'Admin', 'platform_admin', 'active', TRUE);
*/

-- =====================================================
-- END OF SCHEMA
-- =====================================================
