# Task 21: Public Landing Page

## Objective
Create a compelling public landing page that convinces societies to onboard.

## Design Goal
"Every user should understand in 10 seconds why this platform saves them money."

## Page Structure (From Master Prompt)

### 1. Hero Section (Above the Fold)
- [ ] **Headline:** "Reduce Society Maintenance by 30–70%"
- [ ] **Subheadline:** "Ethical revenue streams. Zero ads. Transparent governance."
- [ ] **CTA Button (Primary):** "Calculate Your Society Savings"
  - Opens calculator modal
- [ ] **CTA Button (Secondary):** "See How It Works"
  - Scrolls to explanation section
- [ ] **Hero Image/Video:** Illustration or video showing money savings concept

### 2. How It Works Section
- [ ] **3 Simple Steps:**
  1. **Society Earns**
     - Icon: Money in
     - Text: "Vendor aggregation, asset monetization, service marketplace"
  2. **Residents Save**
     - Icon: Wallet/savings
     - Text: "Maintenance charges reduced by 30-70%"
  3. **Vendors Benefit**
     - Icon: Growth
     - Text: "Predictable demand, larger customer base"
- [ ] Simple animation or diagram

### 3. Revenue Sources Explained
- [ ] **Vendor Aggregation**
  - "Negotiate better rates by pooling demand"
  - Example: "Save ₹5,000/month on milk delivery"
- [ ] **Asset Monetization**
  - "Earn from underutilized assets"
  - Example: "Clubhouse rentals: ₹50,000/month"
- [ ] **Service Marketplace**
  - "Commission on resident bookings"
  - Example: "Plumbing, cleaning, groceries - 5-10% commission"
- [ ] **Cost Optimization**
  - "Reduce utility bills through analytics"
  - Example: "Solar panels: ₹15,000/month savings"

### 4. Trust & Ethics Section
- [ ] **No Ads**
  - Icon: Crossed-out ad banner
  - Text: "Zero advertising. No spam."
- [ ] **No Data Sale**
  - Icon: Lock
  - Text: "Your data is never sold."
- [ ] **Opt-In Only**
  - Icon: Checkmark
  - Text: "Residents choose what they use."
- [ ] **Transparent Ledger**
  - Icon: Open book
  - Text: "Every rupee tracked and public."

### 5. For Whom Section
- [ ] **For Societies**
  - "Reduce maintenance, increase transparency, improve services"
  - Testimonial (if available)
  - CTA: "Onboard Your Society"
- [ ] **For Residents**
  - "Save money, access better services, have a voice"
  - CTA: "Join as Resident"
- [ ] **For Vendors**
  - "Grow your business, predictable revenue, scale faster"
  - CTA: "Join as Vendor"

### 6. Savings Calculator (Modal/Inline)
- [ ] **Input Fields:**
  - Number of flats
  - Current maintenance per flat
  - City (for benchmarking)
- [ ] **Output:**
  - Estimated monthly savings per flat
  - Estimated society-wide savings
  - Revenue sources breakdown (pie chart)
- [ ] **CTA:** "Get Started" (leads to onboarding)

### 7. Social Proof (if available)
- [ ] Number of societies onboarded
- [ ] Total savings generated (₹ crores)
- [ ] Happy residents count
- [ ] Testimonials (1-2 quotes with photos)

### 8. FAQ Section
- [ ] **Q: Is this really free?**
  - A: Yes, societies don't pay us. We earn a small commission from vendor transactions.
- [ ] **Q: How is our data protected?**
  - A: We never sell data. All financial data is encrypted and private to your society.
- [ ] **Q: What if residents don't adopt?**
  - A: Adoption is optional. Even 50% adoption can reduce maintenance by 20-30%.
- [ ] **Q: How long to see results?**
  - A: Most societies see savings within the first month.
- [ ] **Q: Can we exit anytime?**
  - A: Yes, no lock-in. Exit with 30 days notice.

### 9. Final CTA Section
- [ ] **Headline:** "Ready to Reduce Your Maintenance?"
- [ ] **CTA Button:** "Onboard Your Society"
- [ ] **Secondary CTA:** "Talk to Us" (link to contact form or calendar booking)

### 10. Footer
- [ ] Links:
  - About Us
  - How It Works
  - For Societies
  - For Vendors
  - FAQ
  - Privacy Policy
  - Terms of Service
  - Contact Us
  - API Docs (for developers)
- [ ] Social media links (if applicable)
- [ ] Copyright notice

## Technical Requirements

### Performance
- [ ] Page load < 2 seconds
- [ ] Lighthouse score 90+
- [ ] Optimized images (WebP, lazy loading)
- [ ] Minimal JavaScript (static page)

### SEO
- [ ] Meta title: "Society Revenue Platform - Reduce Maintenance by 30-70%"
- [ ] Meta description: "Ethical revenue streams for residential societies..."
- [ ] Open Graph tags (for social sharing)
- [ ] Structured data (schema.org)

### Responsive Design
- [ ] Mobile-first
- [ ] Test on all screen sizes

### Analytics
- [ ] Google Analytics / Plausible
- [ ] Track CTA clicks
- [ ] Track calculator usage
- [ ] Track scroll depth

## Acceptance Criteria
- Landing page loads fast (< 2 seconds)
- Value proposition is clear in 10 seconds
- All CTAs are functional
- Calculator provides accurate estimates
- Mobile-responsive
- SEO optimized
- Analytics tracking works

## Dependencies
- None (can be built independently)

## Estimated Effort
3-5 days

## Design Tools
- Figma / Adobe XD (design mockups)
- Illustrations: unDraw, Storyset
- Stock photos: Unsplash, Pexels

## Development
- Static site generator (Next.js, Gatsby, Astro)
- Tailwind CSS / Bootstrap (styling)
- Deploy on Vercel, Netlify, or Cloudflare Pages

## A/B Testing (Future)
- Test different headlines
- Test CTA button colors/text
- Test calculator placement
- Track conversion rates
