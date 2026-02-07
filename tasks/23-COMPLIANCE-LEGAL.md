# Task 23: Compliance & Legal

## Objective
Ensure the platform complies with Indian laws and protects both the platform and users legally.

## Core Areas
1. Data privacy
2. Financial regulations
3. Terms of service
4. Privacy policy
5. Vendor/society contracts
6. Tax compliance

## Subtasks

### 1. Data Privacy & Protection

#### Indian Data Protection Laws
- [ ] **IT Act 2000 & Rules 2011**
  - Implement reasonable security practices
  - Obtain consent for data collection
  - Allow users to review/correct their data
- [ ] **Upcoming Digital Personal Data Protection Act (DPDP)**
  - Prepare for compliance (consent management, data portability)
  - Appoint Data Protection Officer (if applicable)

#### GDPR Compliance (if serving EU users - future)
- [ ] Right to access
- [ ] Right to erasure ("right to be forgotten")
- [ ] Data portability
- [ ] Consent management

#### Data Handling
- [ ] **What data we collect:**
  - Name, email, phone, address (residents)
  - Payment info (tokenized, not stored)
  - Usage analytics (anonymized)
- [ ] **How we use it:**
  - Service delivery
  - Analytics (anonymized)
  - Notifications
- [ ] **Who we share it with:**
  - Society admin (limited resident data)
  - Vendors (only when booking made)
  - Payment gateway (tokenized only)
- [ ] **Data retention:**
  - Active users: Indefinite (until account deletion)
  - Inactive users: Delete after 3 years of inactivity (with notice)
  - Deleted accounts: 30-day grace period, then permanent deletion

### 2. Financial Compliance

#### Payment Regulations
- [ ] **RBI Guidelines for Payment Aggregators**
  - Use licensed payment gateway (Razorpay, PayU, Paytm - they handle compliance)
  - We act as merchant, not payment aggregator
  - KYC for society accounts (bank account verification)
- [ ] **PCI DSS Compliance**
  - Never store card details (use payment gateway tokenization)
  - Use HTTPS everywhere
  - Secure payment gateway integration

#### Tax Compliance
- [ ] **GST Registration** (if annual turnover > ₹20 lakh)
  - Register as service provider
  - Collect GST on commission (18% on services)
  - File GST returns (monthly/quarterly)
- [ ] **TDS (Tax Deducted at Source)**
  - Deduct TDS on vendor payments (if applicable)
  - File TDS returns
- [ ] **Income Tax**
  - Platform income (commission) is taxable
  - Maintain financial records
  - Annual tax filing

#### Invoicing
- [ ] Auto-generate GST-compliant invoices
- [ ] Invoice for vendor commission (monthly)
- [ ] Invoice for society subscription (if applicable)

### 3. Terms of Service (ToS)

#### Sections to Include
- [ ] **Acceptance of Terms**
  - By using the platform, you agree to ToS
- [ ] **Services Offered**
  - Society management, vendor marketplace, financial ledger, etc.
- [ ] **User Responsibilities**
  - Provide accurate info
  - Maintain account security
  - No misuse (fraud, abuse)
- [ ] **Platform Responsibilities**
  - Uptime (best effort, no 100% guarantee)
  - Data security (reasonable measures)
  - We don't guarantee vendor quality (users rate/review)
- [ ] **Payment Terms**
  - Commission structure (transparent)
  - Refund policy
  - Payment processing (via third-party gateway)
- [ ] **Intellectual Property**
  - Platform owns code, design, content
  - Users own their data
- [ ] **Limitation of Liability**
  - Not liable for vendor disputes
  - Not liable for loss of data (users should backup)
  - Max liability capped (e.g., ₹10,000 or subscription fee)
- [ ] **Termination**
  - Users can delete account anytime
  - We can terminate for ToS violation
- [ ] **Dispute Resolution**
  - Jurisdiction: [City, State]
  - Arbitration clause (optional)
- [ ] **Changes to ToS**
  - We can update ToS (users notified)

### 4. Privacy Policy

#### Sections to Include
- [ ] **Information We Collect**
  - Personal info (name, email, phone)
  - Usage data (pages visited, features used)
  - Payment info (tokenized)
  - Device info (IP, browser, OS)
- [ ] **How We Use Information**
  - Service delivery
  - Analytics (improve platform)
  - Notifications (with consent)
- [ ] **Sharing Information**
  - Society admin (limited resident data)
  - Vendors (only for bookings)
  - Payment gateway (tokenized)
  - Law enforcement (if legally required)
- [ ] **Data Security**
  - Encryption (in transit and at rest)
  - Access controls (RBAC)
  - Regular security audits
- [ ] **User Rights**
  - Access your data
  - Correct your data
  - Delete your data (account deletion)
  - Opt-out of marketing (no marketing anyway)
- [ ] **Cookies**
  - What cookies we use (session, analytics)
  - How to disable cookies
- [ ] **Third-Party Services**
  - Payment gateway, SMS provider, email provider
  - Their privacy policies linked
- [ ] **Children's Privacy**
  - Platform not for children under 13 (or 18)
- [ ] **Changes to Privacy Policy**
  - We can update (users notified)
- [ ] **Contact Us**
  - Email: privacy@platform.com

### 5. Vendor Contracts (Template)

#### Standard Vendor Agreement
- [ ] **Parties:** Society vs Vendor
- [ ] **Services:** Description of services offered
- [ ] **Term:** Start date, end date, auto-renewal
- [ ] **Pricing:** Transparent pricing, commission structure
- [ ] **SLA:** Response time, quality standards
- [ ] **Payment Terms:** Payment cycle, method
- [ ] **Termination:** Notice period, exit terms
- [ ] **Liability:** Vendor liable for service quality
- [ ] **Indemnity:** Vendor indemnifies society for damages
- [ ] **Confidentiality:** Vendor cannot share resident data
- [ ] **Governing Law:** [State] laws apply
- [ ] **Signatures:** Digital signature support

### 6. Society Agreements (Platform ToS Extension)

#### Society Onboarding Agreement
- [ ] **Platform Services:** What we provide
- [ ] **Society Responsibilities:**
  - Provide accurate info
  - Manage residents
  - Approve vendors
- [ ] **Revenue Sharing:** Commission structure (transparent)
- [ ] **Data Ownership:** Society owns resident data
- [ ] **Exit Terms:** 30 days notice, data export
- [ ] **Support:** Email/chat support included

### 7. Compliance Checklist

#### Pre-Launch
- [ ] Privacy Policy published (accessible from footer)
- [ ] Terms of Service published
- [ ] Cookie consent banner (if using cookies)
- [ ] GST registration (if applicable)
- [ ] PAN card for business entity
- [ ] Bank account for business
- [ ] Payment gateway KYC completed

#### Post-Launch
- [ ] GST returns filed (monthly/quarterly)
- [ ] TDS returns filed (quarterly)
- [ ] Annual tax filing
- [ ] Annual privacy audit
- [ ] Annual ToS review and update

### 8. Legal Entity Setup

#### Business Structure (India)
- [ ] **Sole Proprietorship** - Simple, but unlimited liability
- [ ] **Private Limited Company** - Limited liability, more credibility
- [ ] **LLP** - Hybrid, good for partnerships
- [ ] Decision: _[Choose one]_

#### Registrations
- [ ] **Company Registration:** MCA (Ministry of Corporate Affairs)
- [ ] **PAN Card:** Income Tax Department
- [ ] **GST Registration:** GST Portal (if turnover > ₹20 lakh)
- [ ] **Bank Account:** Business current account
- [ ] **Trademark:** Register platform name (optional but recommended)

### 9. Dispute Resolution Mechanism

#### Internal
- [ ] Resident-Vendor disputes:
  - Society admin mediates
  - Platform provides evidence (order history, chat logs)
  - Refund/resolution within 7 days
- [ ] Resident-Society disputes:
  - Voting system for major decisions (democratic)
  - Platform neutral (we don't decide)

#### External
- [ ] Consumer court (for unresolved disputes)
- [ ] Arbitration (optional clause in ToS)

### 10. Insurance (Recommended)

#### Professional Indemnity Insurance
- [ ] Covers legal claims (data breach, service failure)
- [ ] Coverage: ₹10 lakh - ₹1 crore (depends on scale)

#### Cyber Insurance
- [ ] Covers data breach, cyber attacks
- [ ] Coverage: ₹25 lakh - ₹2 crore

### 11. Audit & Compliance Tracking
- [ ] Annual legal compliance audit
- [ ] Annual privacy audit
- [ ] Quarterly review of ToS/Privacy Policy
- [ ] Track all data deletion requests (log for audit)

## Acceptance Criteria
- Privacy Policy and ToS published and accessible
- GST registration complete (if applicable)
- Payment gateway compliant (no raw card data stored)
- Vendor contract templates ready
- Legal entity registered
- Compliance calendar set up (reminders for filings)

## Dependencies
- Task 14 (Payment Gateway - for financial compliance)

## Estimated Effort
5-7 days (initial setup)
Ongoing (filings, audits)

## Legal Consultation
- [ ] Hire lawyer to review:
  - Terms of Service
  - Privacy Policy
  - Vendor contracts
  - Society agreements
- [ ] Budget: ₹30,000 - ₹1,00,000 (one-time)

## Compliance Cost (Annual)
- GST filing: ₹10,000 - ₹20,000 (CA fees)
- Tax filing: ₹15,000 - ₹30,000
- Legal review: ₹20,000 - ₹50,000
- Insurance: ₹30,000 - ₹1,00,000
- **Total:** ~₹75,000 - ₹2,00,000/year
