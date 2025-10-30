# CRM Integration & Donor Engagement System - MyFundAction

## 1. PROJECT CONTEXT

### About MyFundAction
MyFundAction (Yayasan Kebajikan Muslim) is a youth-driven Malaysian NGO established in 2014, dedicated to helping low-income groups, underprivileged communities, and senior citizens. The organization operates globally across 5 countries with:
- **18,000+ active volunteers** (90% youth)
- **180 full-time staff members**
- **Global operations** in Malaysia, New Zealand, Egypt, Indonesia, Africa, and Japan
- **Islamic charity focus** including programs like Homeless Care, food distribution, shelter services, and more

### Problem Statement
MyFundAction needs a **comprehensive CRM system** to:
- **Manage donor relationships** across multiple touchpoints and channels
- **Track engagement journeys** from first-time donors to loyal collaborators
- **Visualize donation patterns** and campaign performance through interactive dashboards
- **Integrate with beneficiary systems** to show donors the direct impact of their contributions
- **Connect with P2P giving platform** for peer-to-peer fundraising initiatives
- **Automate donor communications** via email campaigns and personalized outreach

The organization currently uses scattered tools (spreadsheets, basic email, manual tracking) which creates:
- **Fragmented donor data**: No centralized view of donor history
- **Lost engagement opportunities**: Cannot track supporter journey stages
- **Limited impact storytelling**: Difficult to connect donations to beneficiary outcomes
- **Manual campaign management**: Time-consuming email blasts without personalization
- **No donor segmentation**: One-size-fits-all approach to all supporters

### Current State & Pain Points
- Donor data scattered across multiple Google Sheets and Excel files
- No automated donor segmentation or journey tracking
- Manual email campaigns without personalization or analytics
- Cannot track donation attribution to specific campaigns or beneficiaries
- No visibility into donor lifetime value or engagement patterns
- Limited reporting on campaign effectiveness
- No integration between fundraising and beneficiary impact tracking
- Difficult to identify "potential loyalists" for upgrade to "loyal collaborators"

### Success Metrics for MVP
- **Donor onboarding**: < 30 seconds to capture new donor info
- **Engagement tracking**: 100% of donations linked to supporters and campaigns
- **Segmentation accuracy**: 90%+ of donors correctly categorized in journey stages
- **Email campaigns**: Send personalized campaigns to 1,000+ supporters in < 5 minutes
- **Impact visibility**: Every donation linked to beneficiary outcomes within 48 hours
- **Dashboard load time**: < 2 seconds for all analytics views
- **User adoption**: 80%+ of fundraising staff actively using within 30 days
- **Donor retention**: Increase repeat donation rate by 25% within 6 months

---

## 2. TECHNICAL ARCHITECTURE

### Tech Stack

**Frontend:**
- Next.js 15 (App Router) with React 19
- TypeScript (strict mode)
- Shadcn UI + Tailwind CSS + Radix UI
- Chart.js or Recharts for data visualization
- React Hook Form + Zod validation
- next-intl (English + Bahasa Malaysia)

**Backend:**
- Next.js API Routes (serverless)
- Prisma ORM
- Vercel Postgres (development)
- Supabase PostgreSQL (production - cost-effective at scale)

**Authentication:**
- NextAuth v5 (Auth.js)
- Role-based access control (RBAC)
- Roles: Super Admin, Admin, Fundraising Manager, Campaign Coordinator, Analyst (read-only)

**File Storage:**
- Vercel Blob (development)
- Cloudinary (production - donor receipts, campaign materials)

**Email/Notifications:**
- Resend for transactional emails and campaigns
- Email templates with React Email
- Web Push API for browser notifications

**Data Visualization:**
- Chart.js for interactive charts
- Recharts for responsive dashboards
- D3.js for advanced custom visualizations (optional)

**State Management:**
- Zustand for global UI state
- React Query for server state management

**Testing:**
- Vitest for unit/integration tests
- Playwright MCP for E2E testing

**Analytics & Monitoring:**
- Vercel Analytics
- Sentry for error tracking
- Posthog for user behavior analytics

### Suggested Prisma Schema

```prisma
// schema.prisma

model Donor {
  id            String   @id @default(cuid())
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Personal Information
  firstName     String
  lastName      String
  email         String   @unique
  phone         String?
  dateOfBirth   DateTime?
  gender        Gender?

  // Contact Information
  address       String?
  city          String?
  state         String?
  postcode      String?
  country       String   @default("Malaysia")

  // Donor Profile
  donorType     DonorType @default(INDIVIDUAL)
  companyName   String? // For corporate donors
  taxId         String? // For tax receipts

  // Engagement Tracking
  journeyStage  SupporterJourney @default(POTENTIAL_LOYALIST)
  totalDonated  Decimal @default(0) @db.Decimal(12, 2)
  donationCount Int     @default(0)
  firstDonationDate DateTime?
  lastDonationDate  DateTime?

  // Preferences
  preferredContact    ContactMethod @default(EMAIL)
  communicationOptIn  Boolean @default(true)
  newsletterOptIn     Boolean @default(true)
  tags                String[] // ["ramadan_donor", "monthly_giver", "corporate"]

  // Relationships
  donations     Donation[]
  engagements   Engagement[]
  notes         DonorNote[]
  campaigns     Campaign[] @relation("CampaignDonors")

  // Metadata
  source        String? // "website", "social_media", "event", "referral"
  referredBy    Donor?  @relation("Referrals", fields: [referredById], references: [id])
  referredById  String?
  referrals     Donor[] @relation("Referrals")

  @@index([email])
  @@index([journeyStage])
  @@index([createdAt])
  @@index([lastDonationDate])
}

model Donation {
  id            String   @id @default(cuid())
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Donation Details
  amount        Decimal  @db.Decimal(10, 2)
  currency      String   @default("MYR")
  status        DonationStatus @default(COMPLETED)

  // Attribution
  donor         Donor    @relation(fields: [donorId], references: [id])
  donorId       String
  campaign      Campaign? @relation(fields: [campaignId], references: [id])
  campaignId    String?

  // Payment Information
  paymentMethod PaymentMethod
  transactionId String?  @unique
  receiptNumber String?  @unique
  receiptUrl    String?

  // Purpose & Impact
  purpose       DonationPurpose @default(GENERAL)
  projectId     String? // Link to projects-dashboard
  beneficiaryId String? // Link to beneficiary system

  // Tax Receipt
  taxDeductible Boolean @default(true)
  taxReceiptSent Boolean @default(false)
  taxReceiptSentAt DateTime?

  // Recurring Donation
  isRecurring   Boolean @default(false)
  recurringId   String? // Group recurring donations
  frequency     RecurringFrequency?

  // Notes & Metadata
  notes         String?  @db.Text
  internalNotes String?  @db.Text // Staff notes not visible to donor

  @@index([donorId])
  @@index([campaignId])
  @@index([status])
  @@index([createdAt])
}

model Campaign {
  id            String   @id @default(cuid())
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Campaign Details
  name          String
  description   String   @db.Text
  type          CampaignType
  status        CampaignStatus @default(DRAFT)

  // Goals & Targets
  goalAmount    Decimal? @db.Decimal(12, 2)
  currentAmount Decimal  @default(0) @db.Decimal(12, 2)
  donorTarget   Int?
  currentDonors Int      @default(0)

  // Timeline
  startDate     DateTime
  endDate       DateTime

  // Campaign Materials
  imageUrl      String?
  videoUrl      String?
  landingPageUrl String?

  // Relationships
  donations     Donation[]
  engagements   Engagement[]
  donors        Donor[] @relation("CampaignDonors")

  // Segmentation
  targetSegment String[] // ["potential_loyalist", "monthly_giver"]

  // Email Campaign
  emailTemplate String?  @db.Text
  emailSubject  String?
  emailSentAt   DateTime?
  emailSentTo   Int      @default(0)
  emailOpenRate Decimal? @db.Decimal(5, 2)
  emailClickRate Decimal? @db.Decimal(5, 2)

  // Metadata
  createdBy     User     @relation(fields: [createdById], references: [id])
  createdById   String

  @@index([status])
  @@index([type])
  @@index([startDate])
}

model Engagement {
  id            String   @id @default(cuid())
  createdAt     DateTime @default(now())

  // Engagement Details
  type          EngagementType
  title         String
  description   String?  @db.Text

  // Attribution
  donor         Donor    @relation(fields: [donorId], references: [id])
  donorId       String
  campaign      Campaign? @relation(fields: [campaignId], references: [id])
  campaignId    String?

  // Engagement Metrics
  channel       Channel
  outcome       EngagementOutcome?

  // Metadata
  recordedBy    User     @relation(fields: [recordedById], references: [id])
  recordedById  String
  notes         String?  @db.Text

  @@index([donorId])
  @@index([type])
  @@index([createdAt])
}

model DonorNote {
  id            String   @id @default(cuid())
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  content       String   @db.Text
  isPinned      Boolean  @default(false)

  donor         Donor    @relation(fields: [donorId], references: [id], onDelete: Cascade)
  donorId       String

  createdBy     User     @relation(fields: [createdById], references: [id])
  createdById   String

  @@index([donorId])
}

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String
  role          UserRole
  department    String?
  phone         String?

  // Relations
  createdCampaigns Campaign[]
  recordedEngagements Engagement[]
  donorNotes    DonorNote[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

// Enums

enum Gender {
  MALE
  FEMALE
  OTHER
  PREFER_NOT_TO_SAY
}

enum DonorType {
  INDIVIDUAL
  CORPORATE
  FOUNDATION
  GOVERNMENT
  OTHER
}

enum SupporterJourney {
  FIRST_TIME_DONOR        // Just donated once
  POTENTIAL_LOYALIST      // 2-3 donations, showing interest
  LOYAL_COLLABORATOR      // 4+ donations or recurring, highly engaged
  MAJOR_DONOR             // Large single or cumulative donations
  LAPSED                  // No donation in 12+ months
  INACTIVE                // Opted out of communications
}

enum ContactMethod {
  EMAIL
  PHONE
  WHATSAPP
  SMS
}

enum DonationStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
  CANCELLED
}

enum PaymentMethod {
  CREDIT_CARD
  DEBIT_CARD
  BANK_TRANSFER
  PAYPAL
  STRIPE
  CASH
  CHEQUE
  OTHER
}

enum DonationPurpose {
  GENERAL
  HOMELESS_CARE
  FOOD_DISTRIBUTION
  EDUCATION
  HEALTHCARE
  SHELTER
  EMERGENCY_RELIEF
  QURBANI
  ZAKAT
  SADAQAH
  OTHER
}

enum RecurringFrequency {
  WEEKLY
  MONTHLY
  QUARTERLY
  YEARLY
}

enum CampaignType {
  FUNDRAISING
  AWARENESS
  VOLUNTEER_RECRUITMENT
  EVENT
  EMAIL_CAMPAIGN
  RAMADAN
  QURBANI
  YEAR_END
  OTHER
}

enum CampaignStatus {
  DRAFT
  SCHEDULED
  ACTIVE
  PAUSED
  COMPLETED
  CANCELLED
}

enum EngagementType {
  EMAIL_OPENED
  EMAIL_CLICKED
  WEBSITE_VISIT
  EVENT_ATTENDANCE
  PHONE_CALL
  MEETING
  VOLUNTEER_SESSION
  SOCIAL_MEDIA_INTERACTION
  SURVEY_RESPONSE
  FEEDBACK_PROVIDED
  OTHER
}

enum Channel {
  EMAIL
  PHONE
  WHATSAPP
  SMS
  SOCIAL_MEDIA
  WEBSITE
  IN_PERSON
  EVENT
  OTHER
}

enum EngagementOutcome {
  POSITIVE
  NEUTRAL
  NEGATIVE
  FOLLOW_UP_NEEDED
}

enum UserRole {
  SUPER_ADMIN
  ADMIN
  FUNDRAISING_MANAGER
  CAMPAIGN_COORDINATOR
  ANALYST
}
```

### Authentication & Authorization Strategy

**Roles & Permissions:**
- **Super Admin**: Full system access, user management, settings, financial data
- **Admin**: Manage donors, campaigns, view all reports (limited settings)
- **Fundraising Manager**: Create/edit campaigns, manage donor relationships, view analytics
- **Campaign Coordinator**: Execute campaigns, track engagements, limited donor editing
- **Analyst**: Read-only access to dashboards and reports

**Row-Level Security:**
- Users can only see campaigns they created or are assigned to (unless Admin+)
- Financial data (donation amounts) restricted to Admin+ roles
- Audit logs for all changes to donor records and donation data

### API Design Patterns

**RESTful API Routes:**
```
/api/donors
  GET    - List donors (paginated, filtered, sorted)
  POST   - Create donor

/api/donors/[id]
  GET    - Get single donor with full profile
  PATCH  - Update donor information
  DELETE - Soft delete (mark inactive)

/api/donors/[id]/donations
  GET    - List donations for donor
  POST   - Record new donation

/api/donors/[id]/engagements
  GET    - List engagements for donor
  POST   - Log new engagement

/api/donors/[id]/journey
  PATCH  - Update journey stage

/api/donations
  GET    - List donations (paginated, filtered)
  POST   - Create donation

/api/donations/[id]/receipt
  GET    - Generate tax receipt PDF
  POST   - Send receipt email

/api/campaigns
  GET    - List campaigns (paginated, filtered)
  POST   - Create campaign

/api/campaigns/[id]
  GET    - Get campaign details with analytics
  PATCH  - Update campaign
  DELETE - Soft delete

/api/campaigns/[id]/send-email
  POST   - Send email campaign to segmented donors

/api/campaigns/[id]/analytics
  GET    - Campaign performance metrics

/api/analytics/dashboard
  GET    - Main dashboard metrics

/api/analytics/donor-insights
  GET    - Donor segmentation and journey analytics

/api/analytics/campaign-performance
  GET    - Campaign ROI and effectiveness

/api/reports/export
  POST   - Export donor/donation data to CSV/Excel
```

---

## 3. MVP FEATURE SPECIFICATION

### Must-Have (Phase 1 - MVP Demo)

**Donor Management:**
- ✅ Create new donor with comprehensive profile
- ✅ View donor list (table view with search, filter by journey stage, sort)
- ✅ View donor details page (profile, donation history, engagement timeline)
- ✅ Edit donor information
- ✅ Soft delete (mark inactive) donors
- ✅ Tag system for donor categorization
- ✅ Journey stage tracking (Potential Loyalist → Loyal Collaborator)

**Donation Tracking:**
- ✅ Record donations linked to donors
- ✅ Link donations to campaigns and beneficiaries
- ✅ Generate donation receipts (PDF)
- ✅ Track donation status (Pending, Completed, Failed)
- ✅ Support one-time and recurring donations
- ✅ View donation history per donor

**Campaign Management:**
- ✅ Create campaigns with goals and timelines
- ✅ Track campaign progress (amount raised, donor count)
- ✅ Campaign status workflow (Draft → Active → Completed)
- ✅ Link donations to campaigns
- ✅ Basic campaign analytics

**Engagement Tracking:**
- ✅ Log donor engagements (emails, calls, events, meetings)
- ✅ Track engagement by channel
- ✅ Engagement timeline per donor
- ✅ Link engagements to campaigns

**Email Campaigns:**
- ✅ Send personalized email campaigns to donor segments
- ✅ Email templates with React Email
- ✅ Track email open rates and click rates
- ✅ Segment donors by journey stage for targeting

**Analytics Dashboards:**
- ✅ Main dashboard: Total donations, active donors, campaign performance
- ✅ Donor insights: Journey stage distribution, retention rate
- ✅ Campaign performance: ROI, donor acquisition cost
- ✅ Donation trends: Charts showing donations over time
- ✅ Interactive charts (Chart.js/Recharts)

**Integration Points:**
- ✅ Link donations to beneficiaries (impact tracking)
- ✅ Link donations to projects (project funding)
- ✅ API endpoints for P2P giving platform

**Data Visualization:**
- ✅ Donation trends chart (line/area chart)
- ✅ Journey stage funnel (funnel chart)
- ✅ Campaign comparison (bar chart)
- ✅ Donor demographics (pie/donut chart)
- ✅ Retention cohort analysis (heatmap)

### Should-Have (Phase 2 - Post-Demo)

- Advanced donor segmentation (RFM analysis: Recency, Frequency, Monetary)
- Automated journey stage progression based on donation behavior
- Email automation workflows (welcome series, lapsed donor re-engagement)
- WhatsApp integration for donor communications
- Donation receipt auto-send via email
- Advanced campaign analytics (A/B testing, conversion tracking)
- Donor lifetime value (LTV) prediction
- Major donor identification and flagging
- Custom donor fields and tags
- Export reports with custom date ranges and filters
- Donation matching (corporate matching gifts)
- Pledge tracking and follow-up reminders
- SMS campaign capabilities
- Multi-currency support

### Could-Have (Future Enhancements)

- AI-powered donor insights (churn prediction, best time to ask)
- Mobile app for field fundraisers
- Integration with accounting software (QuickBooks, Xero)
- Peer-to-peer fundraising platform integration (deep integration)
- Social media fundraising tracking (Facebook, Instagram)
- Event management with ticketing
- Volunteer hour tracking for corporate donors
- Grant management system
- Legacy giving (planned giving) tracking
- Donor portal (self-service dashboard)
- Cryptocurrency donation support
- Predictive analytics for campaign success

### Out of Scope

- Payment processing (handled by separate payment gateway integration)
- Volunteer management (handled by volunteer-mgmt system)
- Project execution tracking (handled by projs-dashboard system)
- Beneficiary case management (handled by beneficiary system)
- Inventory management
- Financial accounting (export to accounting software)

---

## 4. MCP SERVER UTILIZATION GUIDE

### sequential-thinking
**Use for:**
- Complex donor segmentation logic (e.g., "How should we define the transition from Potential Loyalist to Loyal Collaborator?")
- Database schema design validation for CRM relationships
- Performance optimization for dashboard queries with large datasets
- Debugging complex campaign analytics calculations
- Planning email campaign automation workflows

**Example:**
```
Use sequential-thinking to analyze: "What's the best approach for calculating donor retention rate and identifying lapsed donors who are most likely to re-engage?"
```

### filesystem
**Use for:**
- Reading multiple dashboard component files simultaneously
- Batch operations for chart components and analytics utilities
- Project structure analysis for CRM module organization
- Finding specific visualization patterns across files

### fetch
**Use for:**
- Researching Chart.js/Recharts best practices
- Finding CRM dashboard design patterns
- Studying email template examples with React Email
- Looking up Resend API documentation
- Researching donor segmentation strategies

### deepwiki
**Use for:**
- Exploring Houdini Project repo (github.com/houdiniproject/houdini) - nonprofit CRM concepts
- Studying TailAdmin CRM dashboard variant
- Understanding Materio MUI dashboard CRM features
- Learning from established CRM implementations

**Example repos to explore:**
- houdiniproject/houdini - Open-source nonprofit CRM
- TailAdmin/crm-dashboard - CRM UI patterns
- recharts/recharts - Data visualization examples
- react-email/react-email - Email template patterns

### allpepper-memory-bank
**Use for:**
- Storing donor segmentation criteria and definitions
- Documenting campaign workflow decisions
- Recording email template conventions
- Tracking integration strategies with beneficiary and P2P systems

**Files to create:**
- `donor-journey-stages.md` - Journey stage definitions and progression criteria
- `campaign-templates.md` - Campaign types and best practices
- `email-automation-workflows.md` - Automated email sequence designs
- `analytics-metrics.md` - Key performance indicators and calculation methods

### playwright (MCP)
**Use for:**
- E2E testing critical CRM workflows:
  - Donor creation and profile management
  - Donation recording and receipt generation
  - Campaign creation and email sending
  - Dashboard analytics loading and interaction
  - Email campaign segmentation and sending
- Automated visual regression testing for charts
- Screenshot generation for dashboard documentation

**Example test:**
```typescript
// Test donation recording workflow
test('record donation and generate receipt', async ({ page }) => {
  await page.goto('/donors/123');
  await page.click('button:has-text("Record Donation")');
  await page.fill('[name="amount"]', '100');
  await page.selectOption('[name="purpose"]', 'HOMELESS_CARE');
  await page.click('button[type="submit"]');
  await expect(page.locator('.success-message')).toContainText('Donation recorded');
  await page.click('button:has-text("Generate Receipt")');
  await expect(page.locator('.receipt-preview')).toBeVisible();
});
```

### puppeteer
**Use for:**
- Browser automation for testing dashboards
- Generating PDF donation receipts
- Screenshot capture for campaign performance reports
- Automating report generation

---

## 5. REFERENCE IMPLEMENTATIONS

### GitHub Repositories to Clone/Reference

**Primary Reference:**
1. **Houdini Project** - https://github.com/houdiniproject/houdini
   - Concepts: Nonprofit CRM, donor management, campaigns, events
   - Study their supporter journey and engagement models
   - **Note**: Ruby on Rails framework, adapt concepts to Next.js

**Next.js Dashboard Templates:**
2. **TailAdmin CRM Variant** - https://github.com/TailAdmin/crm-dashboard-nextjs
   - CRM-specific dashboard components
   - Contact management patterns
   - Sales pipeline visualization (adapt for donor journey)

3. **Materio MUI Admin** - https://github.com/themeselection/materio-mui-react-nextjs-admin-template
   - Advanced dashboard with CRM features
   - Charts and analytics components
   - Modern design patterns

**Data Visualization:**
4. **Recharts Examples** - https://github.com/recharts/recharts
   - Interactive chart components
   - Responsive design patterns
   - Custom tooltip and legend examples

5. **Chart.js Samples** - https://github.com/chartjs/Chart.js
   - Advanced charting capabilities
   - Plugin ecosystem for custom features

**Email Templates:**
6. **React Email** - https://github.com/resend/react-email
   - Beautiful email templates with React
   - Email testing and preview
   - Integration with Resend

### Similar Projects to Study

- **CiviCRM** (open-source CRM for nonprofits) - PHP, concepts applicable
- **Salesforce NPSP** (Nonprofit Success Pack) - CRM best practices
- **Kindful** (donor management) - UI/UX patterns
- **Bloomerang** (donor retention focus) - Engagement tracking concepts

### Recommended Tutorials/Docs

- **Next.js 15 App Router**: https://nextjs.org/docs
- **Prisma with Next.js**: https://www.prisma.io/docs
- **Chart.js Documentation**: https://www.chartjs.org/docs/latest/
- **Recharts Documentation**: https://recharts.org/en-US/
- **Resend Email API**: https://resend.com/docs
- **React Email**: https://react.email/docs/introduction
- **Shadcn UI Charts**: https://ui.shadcn.com/docs/components/chart

---

## 6. DATA MIGRATION & INTEGRATION

### Import from Existing Systems

**Current Data Sources:**
- Google Sheets with donor information
- PayPal/Stripe transaction exports
- Email marketing platform contacts (Mailchimp/SendGrid exports)
- Manual donation records from events
- Legacy Access or Excel databases

**Migration Strategy:**

**Phase 1: Data Audit**
1. Export all donor data from existing sources as CSV
2. Use MCP filesystem to analyze CSV structures
3. Create mapping document: Source fields → Donor model
4. Identify duplicate donors across sources
5. Document data quality issues and missing fields
6. Analyze donation history patterns

**Phase 2: CSV Import Utility**
Create `/api/import/donors` and `/api/import/donations` endpoints with:
- CSV parsing (use `papaparse` library)
- Column mapping UI (map CSV columns to CRM fields)
- Data validation (Zod schemas)
- Duplicate detection (email, name+phone matching)
- Error reporting (row-by-row validation results)
- Preview mode (show first 10 mapped entries)
- Batch import (process in chunks of 100)

**Example CSV Import Flow:**
```typescript
// lib/import/donor-csv-parser.ts
import Papa from 'papaparse';
import { donorSchema } from '@/lib/validation';

export async function parseDonorCSV(file: File) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        // Validate each row with Zod
        const validated = results.data.map((row) => {
          const mapped = mapCSVRowToDonor(row);
          return donorSchema.safeParse(mapped);
        });

        // Detect duplicates
        const duplicates = detectDuplicateDonors(validated);

        resolve({ validated, duplicates });
      },
      error: reject,
    });
  });
}

function detectDuplicateDonors(donors: Donor[]) {
  // Match on email (exact) or name+phone (fuzzy)
  const emailMap = new Map();
  const duplicates = [];

  donors.forEach((donor) => {
    if (emailMap.has(donor.email)) {
      duplicates.push({ original: emailMap.get(donor.email), duplicate: donor });
    } else {
      emailMap.set(donor.email, donor);
    }
  });

  return duplicates;
}
```

**Phase 3: Journey Stage Assignment**
- Analyze historical donation patterns to assign initial journey stages
- Rules:
  - 1 donation → FIRST_TIME_DONOR
  - 2-3 donations → POTENTIAL_LOYALIST
  - 4+ donations or recurring → LOYAL_COLLABORATOR
  - Large donations (top 10%) → MAJOR_DONOR
  - No donation in 12+ months → LAPSED

**Data Validation Rules:**
- Required fields: firstName, lastName, email
- Email: RFC 5322 validation + uniqueness check
- Phone format: Malaysian (+60) or international validation
- Donation amounts: Must be positive numbers
- Currency codes: ISO 4217 validation (MYR, USD, etc.)
- Date ranges: Donation dates must be in past

### Integration with Other MyFundAction Systems

**Beneficiary System Integration:**
```typescript
// Link donations to beneficiary impact
interface DonationBeneficiaryLink {
  donationId: string;
  beneficiaryId: string;
  impactDescription: string; // "Provided 30 meals to John Doe"
  createdAt: Date;
}

// API endpoint to fetch impact for donor
// GET /api/donors/[id]/impact
export async function getDonorImpact(donorId: string) {
  const donations = await prisma.donation.findMany({
    where: { donorId },
    include: { beneficiaryLinks: true }
  });

  return donations.map(d => ({
    donationAmount: d.amount,
    impactStories: d.beneficiaryLinks
  }));
}
```

**P2P Giving Platform Integration:**
```typescript
// Track P2P fundraising pages created by donors
interface P2PFundraisingPage {
  id: string;
  donorId: string; // The person who created the page
  campaignId: string;
  goalAmount: Decimal;
  currentAmount: Decimal;
  donations: Donation[]; // Donations to this page
  shareUrl: string;
}

// API: POST /api/p2p/pages
// Creates a new P2P page for a donor
```

**Projects Dashboard Integration:**
```typescript
// Link donations to specific projects
interface DonationProjectLink {
  donationId: string;
  projectId: string; // From projects-dashboard system
  allocatedAmount: Decimal;
}

// Show project progress funded by donations
// GET /api/projects/[id]/funding
```

**Shared Data Models:**
```typescript
// types/shared.ts (shared across all 6 projects)
export interface Address {
  street?: string;
  city: string;
  state: string;
  postcode?: string;
  country: string;
}

export interface Contact {
  phone?: string;
  email?: string;
  preferredContact: 'phone' | 'email' | 'whatsapp';
}

export interface MonetaryAmount {
  amount: number;
  currency: string; // ISO 4217 code
}

export interface AuditLog {
  action: string;
  performedBy: string;
  timestamp: Date;
  details?: object;
}
```

---

## 7. GIT WORKTREE WORKFLOW

### Setting Up Worktree for Isolated Development

**Why Worktrees?**
- Develop all 6 projects simultaneously with separate Claude Code instances
- Keep main repository clean
- Switch between projects without stashing changes
- Easy testing of cross-project integrations (CRM ↔ Beneficiary ↔ P2P)

**Create Worktree:**
```bash
# From main repository root: /Users/khani/Desktop/projs/myfundaction-protos

# Create worktree for CRM integration
git worktree add -b crm-integration/main ../myfundaction-worktrees/crm-integration crm-integration

# Navigate to worktree
cd ../myfundaction-worktrees/crm-integration

# Open in VS Code (or your editor)
code .

# Start Claude Code in this directory
claude-code
```

**Worktree Structure:**
```
myfundaction-protos/          (main repo)
├── crm-integration/          (this project)
├── beneficiary/
├── p2p-giving/
├── volunteer-mgmt/
├── projs-dashboard/
└── ...

myfundaction-worktrees/       (worktrees)
├── crm-integration/          (isolated working tree)
├── beneficiary/
├── p2p-giving/
├── volunteer-mgmt/
├── projs-dashboard/
└── ...
```

### Branch Naming Conventions

**Main branch per project:**
- `crm-integration/main`
- `beneficiary/main`
- `p2p-giving/main`
- `volunteer-mgmt/main`
- `projs-dashboard/main`

**Feature branches:**
- `crm-integration/feat/donor-journey-tracking`
- `crm-integration/feat/email-campaigns`
- `crm-integration/feat/analytics-dashboard`
- `crm-integration/fix/receipt-generation`
- `crm-integration/chore/update-deps`

**Conventional Commits:**
```bash
git commit -m "feat(crm): add donor journey stage tracking"
git commit -m "feat(crm): implement campaign email sending with Resend"
git commit -m "feat(crm): create analytics dashboard with Recharts"
git commit -m "fix(crm): correct donation amount calculation in receipts"
git commit -m "docs(crm): update API documentation for donor endpoints"
git commit -m "test(crm): add E2E tests for campaign creation workflow"
```

### Commit Strategy

**IMPORTANT: Commit frequently as you build!**

**After each significant change:**
```bash
# Add files
git add .

# Commit with descriptive message
git commit -m "feat(crm): implement donor segmentation by journey stage"

# Push to remote (for backup and collaboration)
git push origin crm-integration/main
```

**Commit Checklist:**
- ✅ After creating new components (dashboard widgets, charts, forms)
- ✅ After implementing new features (donor management, campaign creation)
- ✅ After writing tests (unit tests for analytics, E2E for workflows)
- ✅ After fixing bugs
- ✅ After integrating with other systems (beneficiary, P2P)
- ✅ Before switching to another task
- ✅ At least 3-5 times per hour during active development

**Good commit messages:**
```
✅ "feat(crm): add Prisma schema for donors, donations, campaigns"
✅ "feat(crm): create donor profile page with donation history"
✅ "feat(crm): implement Recharts dashboard with donation trends"
✅ "feat(crm): add email campaign sending with Resend integration"
✅ "fix(crm): correct journey stage progression logic"
✅ "test(crm): add unit tests for donor segmentation"
```

**Bad commit messages:**
```
❌ "update"
❌ "wip"
❌ "changes"
❌ "fix stuff"
❌ "dashboard"
```

### TodoWrite Tool Usage

**Use TodoWrite throughout development:**

```typescript
// Example: Breaking down CRM dashboard implementation
TodoWrite([
  { content: "Create Prisma schema for Donor, Donation, Campaign models", status: "completed", activeForm: "Creating Prisma schema" },
  { content: "Create donor management CRUD pages", status: "in_progress", activeForm: "Creating donor management pages" },
  { content: "Implement donation recording with receipt generation", status: "pending", activeForm: "Implementing donation recording" },
  { content: "Build analytics dashboard with Recharts", status: "pending", activeForm: "Building analytics dashboard" },
  { content: "Add email campaign functionality with Resend", status: "pending", activeForm: "Adding email campaign functionality" },
  { content: "Integrate with beneficiary system for impact tracking", status: "pending", activeForm: "Integrating with beneficiary system" },
  { content: "Write E2E tests for critical workflows", status: "pending", activeForm: "Writing E2E tests" },
]);
```

**Update todos as you progress** - mark completed, add new ones as discovered.

---

## 8. DEPLOYMENT STRATEGY

### Vercel Project Setup

**Create New Vercel Project:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from crm-integration directory
cd /path/to/worktree/crm-integration
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: myfundaction-crm
# - Directory: ./
# - Build command: next build
# - Output directory: .next
# - Development command: next dev
```

**Vercel Project Settings:**
- **Framework Preset**: Next.js
- **Node Version**: 18.x or 20.x
- **Build Command**: `next build`
- **Install Command**: `npm install` or `yarn install`
- **Root Directory**: `./` (or `crm-integration/` if deploying from main repo)

### Environment Variables

**Required for Development (.env.local):**
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/crm_dev"
DIRECT_URL="postgresql://user:password@localhost:5432/crm_dev" # Prisma migrations

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# File Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN="vercel_blob_token_here"

# Email (Resend)
RESEND_API_KEY="re_your_key_here"
RESEND_FROM_EMAIL="noreply@myfundaction.org"

# Integration URLs (other MyFundAction systems)
BENEFICIARY_API_URL="http://localhost:3001/api"
P2P_GIVING_API_URL="http://localhost:3002/api"
PROJECTS_API_URL="http://localhost:3003/api"

# Optional: Analytics
NEXT_PUBLIC_POSTHOG_KEY="phc_your_key"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
```

**Required for Production (Vercel Dashboard):**
```bash
# Supabase Database
DATABASE_URL="postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="https://crm.myfundaction.org"
NEXTAUTH_SECRET="strong-production-secret-here"

# Cloudinary (file storage)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Resend
RESEND_API_KEY="re_production_key"
RESEND_FROM_EMAIL="noreply@myfundaction.org"

# Integration URLs (production)
BENEFICIARY_API_URL="https://beneficiary.myfundaction.org/api"
P2P_GIVING_API_URL="https://p2p.myfundaction.org/api"
PROJECTS_API_URL="https://projects.myfundaction.org/api"

# Sentry
SENTRY_DSN="https://xxx@yyy.ingest.sentry.io/zzz"

# Analytics
NEXT_PUBLIC_POSTHOG_KEY="production_key"
```

### Database Migrations

**Local Development:**
```bash
# Create migration
npx prisma migrate dev --name add_donor_journey_stages

# Apply migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Seed database (optional)
npx prisma db seed
```

**Production (Vercel):**
```bash
# Add to package.json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma migrate deploy && next build"
  }
}
```

**Or use Vercel Build Command:**
```bash
prisma migrate deploy && prisma generate && next build
```

### Performance Optimization

**Next.js Configuration:**
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // For CSV uploads
    },
  },
};

module.exports = nextConfig;
```

**ISR (Incremental Static Regeneration) for Dashboards:**
```typescript
// app/dashboard/page.tsx
export const revalidate = 300; // Revalidate every 5 minutes

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();
  // ...
}
```

**Edge Functions for API Routes:**
```typescript
// app/api/donors/route.ts
export const runtime = 'edge'; // Deploy to edge for faster response

export async function GET(request: Request) {
  // ...
}
```

**Chart Performance:**
```typescript
// Use React.memo for chart components
import { memo } from 'react';
import { LineChart } from 'recharts';

export const DonationTrendChart = memo(function DonationTrendChart({ data }) {
  return <LineChart data={data} />;
});
```

### Custom Domain Configuration

**Vercel Dashboard:**
1. Go to Project Settings → Domains
2. Add custom domain: `crm.myfundaction.org`
3. Configure DNS (CNAME or A record)
4. Automatic HTTPS via Let's Encrypt

**DNS Records (Cloudflare/Route53/etc.):**
```
Type: CNAME
Name: crm
Value: cname.vercel-dns.com
```

---

## 9. SECURITY & COMPLIANCE

### Data Encryption

**At Rest:**
- Vercel Postgres: Encrypted by default
- Supabase: AES-256 encryption
- Cloudinary: Encrypted storage

**In Transit:**
- HTTPS enforced (Vercel automatic)
- TLS 1.3 for database connections
- Encrypted email transmission (Resend)

**Sensitive Fields:**
```typescript
// Encrypt sensitive financial data
import { encrypt, decrypt } from '@/lib/crypto';

// Store encrypted tax ID for corporate donors
const encryptedTaxId = await encrypt(donor.taxId);

// Prisma schema
model Donor {
  taxIdEncrypted String? // Store encrypted
}
```

### Role-Based Access Control (RBAC)

**Middleware Protection:**
```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const path = req.nextUrl.pathname;

      if (path.startsWith('/admin')) {
        return token?.role === 'SUPER_ADMIN' || token?.role === 'ADMIN';
      }

      if (path.startsWith('/campaigns/new')) {
        return ['SUPER_ADMIN', 'ADMIN', 'FUNDRAISING_MANAGER'].includes(token?.role);
      }

      if (path.startsWith('/analytics')) {
        return !!token; // All authenticated users
      }

      return !!token; // Authenticated
    },
  },
});

export const config = {
  matcher: ['/donors/:path*', '/campaigns/:path*', '/analytics/:path*', '/api/:path*'],
};
```

**API Route Protection:**
```typescript
// app/api/donations/route.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Only admins and fundraising managers can record donations
  if (!['ADMIN', 'FUNDRAISING_MANAGER'].includes(session.user.role)) {
    return new Response('Forbidden', { status: 403 });
  }

  // Proceed with donation creation
}
```

### Audit Logging

**Track Critical Financial Actions:**
```typescript
// lib/audit.ts
export async function logAudit(action: string, details: object) {
  await prisma.auditLog.create({
    data: {
      action,
      details,
      userId: session.user.id,
      ipAddress: req.headers.get('x-forwarded-for'),
      userAgent: req.headers.get('user-agent'),
      timestamp: new Date(),
    },
  });
}

// Usage
await logAudit('DONATION_CREATED', { donationId: newDonation.id, amount: newDonation.amount });
await logAudit('DONOR_UPDATED', { donorId, changes: diff });
await logAudit('CAMPAIGN_LAUNCHED', { campaignId, targetAmount: campaign.goalAmount });
await logAudit('EMAIL_CAMPAIGN_SENT', { campaignId, recipientCount: recipients.length });
```

**Audit Log Model:**
```prisma
model AuditLog {
  id          String   @id @default(cuid())
  action      String
  details     Json
  userId      String
  ipAddress   String?
  userAgent   String?
  timestamp   DateTime @default(now())

  @@index([userId])
  @@index([timestamp])
  @@index([action])
}
```

### PCI Compliance for Donations

**IMPORTANT: Never store payment card details directly**

**Best Practices:**
- Use Stripe/PayPal hosted checkout (PCI compliant by default)
- Only store tokenized payment methods
- Store transaction IDs, not card numbers
- Use HTTPS for all payment pages

```typescript
// GOOD: Store transaction reference
const donation = await prisma.donation.create({
  data: {
    transactionId: stripePaymentIntent.id, // Stripe transaction ID
    paymentMethod: 'CREDIT_CARD',
    // Never store card details here
  }
});

// BAD: Don't do this!
// cardNumber: '4242-4242-4242-4242' ❌
```

### GDPR/Data Privacy Compliance

**Right to be Forgotten:**
```typescript
// app/api/donors/[id]/anonymize/route.ts
export async function POST(req: Request, { params }) {
  // Keep donation records (required for accounting) but anonymize donor
  await prisma.donor.update({
    where: { id: params.id },
    data: {
      firstName: 'ANONYMIZED',
      lastName: 'ANONYMIZED',
      email: `anonymized-${params.id}@deleted.local`,
      phone: null,
      address: null,
      communicationOptIn: false,
      newsletterOptIn: false,
    },
  });

  await logAudit('DONOR_ANONYMIZED', { donorId: params.id });
}
```

**Data Export:**
```typescript
// app/api/donors/[id]/export/route.ts
export async function GET(req: Request, { params }) {
  const donor = await prisma.donor.findUnique({
    where: { id: params.id },
    include: {
      donations: true,
      engagements: true,
      campaigns: true
    },
  });

  return new Response(JSON.stringify(donor, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="donor-data-${params.id}.json"`,
    },
  });
}
```

### Email Compliance

**CAN-SPAM Act / GDPR Compliance:**
```typescript
// All emails must have:
// 1. Unsubscribe link
// 2. Physical address
// 3. Clear sender identification

// Email template (React Email)
export function DonorEmailTemplate({ donor, unsubscribeUrl }) {
  return (
    <Html>
      <Body>
        {/* Email content */}

        <Footer>
          <Link href={unsubscribeUrl}>Unsubscribe</Link>
          <Text>MyFundAction, 123 Main St, Kuala Lumpur, Malaysia</Text>
        </Footer>
      </Body>
    </Html>
  );
}
```

---

## 10. TESTING APPROACH

### Unit Testing (Vitest)

**Setup:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Example Tests:**
```typescript
// __tests__/lib/donor-journey.test.ts
import { describe, it, expect } from 'vitest';
import { calculateJourneyStage, shouldUpgradeToLoyalCollaborator } from '@/lib/donor-journey';

describe('Donor Journey Stage Calculation', () => {
  it('should assign FIRST_TIME_DONOR for 1 donation', () => {
    const donor = { donationCount: 1, totalDonated: 50 };
    const stage = calculateJourneyStage(donor);
    expect(stage).toBe('FIRST_TIME_DONOR');
  });

  it('should assign POTENTIAL_LOYALIST for 2-3 donations', () => {
    const donor = { donationCount: 3, totalDonated: 150 };
    const stage = calculateJourneyStage(donor);
    expect(stage).toBe('POTENTIAL_LOYALIST');
  });

  it('should upgrade to LOYAL_COLLABORATOR at 4+ donations', () => {
    const donor = { donationCount: 4, totalDonated: 200 };
    expect(shouldUpgradeToLoyalCollaborator(donor)).toBe(true);
  });

  it('should identify MAJOR_DONOR for high-value donors', () => {
    const donor = { donationCount: 2, totalDonated: 5000 };
    const stage = calculateJourneyStage(donor);
    expect(stage).toBe('MAJOR_DONOR');
  });
});
```

**Component Tests:**
```typescript
// __tests__/components/DonationForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { DonationForm } from '@/components/DonationForm';

describe('DonationForm', () => {
  it('should render form fields', () => {
    render(<DonationForm donorId="123" />);
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    expect(screen.getByLabelText('Purpose')).toBeInTheDocument();
  });

  it('should validate amount is positive', async () => {
    render(<DonationForm donorId="123" />);
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '-10' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(await screen.findByText('Amount must be positive')).toBeInTheDocument();
  });
});
```

**Analytics Calculation Tests:**
```typescript
// __tests__/lib/analytics.test.ts
import { calculateDonorRetentionRate, calculateCampaignROI } from '@/lib/analytics';

describe('Analytics Calculations', () => {
  it('should calculate donor retention rate correctly', () => {
    const donors = [
      { id: '1', firstDonationDate: new Date('2024-01-01'), lastDonationDate: new Date('2024-12-01') },
      { id: '2', firstDonationDate: new Date('2024-01-01'), lastDonationDate: new Date('2024-01-01') }, // lapsed
    ];

    const retentionRate = calculateDonorRetentionRate(donors);
    expect(retentionRate).toBe(0.5); // 50%
  });

  it('should calculate campaign ROI', () => {
    const campaign = {
      donations: [{ amount: 100 }, { amount: 200 }],
      costs: 50
    };

    const roi = calculateCampaignROI(campaign);
    expect(roi).toBe(5); // (300 - 50) / 50 = 5 (500% return)
  });
});
```

### Integration Testing

**API Route Tests:**
```typescript
// __tests__/api/donations.test.ts
import { POST } from '@/app/api/donations/route';

describe('POST /api/donations', () => {
  it('should create a donation and update donor stats', async () => {
    const req = new Request('http://localhost:3000/api/donations', {
      method: 'POST',
      body: JSON.stringify({
        donorId: 'donor-123',
        amount: 100,
        purpose: 'HOMELESS_CARE',
      }),
    });

    const response = await POST(req);
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data.amount).toBe(100);

    // Verify donor stats updated
    const donor = await prisma.donor.findUnique({ where: { id: 'donor-123' } });
    expect(donor.donationCount).toBe(1);
    expect(donor.totalDonated).toBe(100);
  });
});
```

### E2E Testing with Playwright MCP

**Use the Playwright MCP server for E2E tests:**

```typescript
// tests/e2e/donor-management.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Donor Management Workflow', () => {
  test('complete donor creation and donation recording', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'fundraiser@myfundaction.org');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Create donor
    await page.goto('/donors/new');
    await page.fill('[name="firstName"]', 'Ahmad');
    await page.fill('[name="lastName"]', 'Ibrahim');
    await page.fill('[name="email"]', 'ahmad@example.com');
    await page.fill('[name="phone"]', '+60123456789');
    await page.click('button[type="submit"]');

    // Verify redirect to donor detail page
    await expect(page).toHaveURL(/\/donors\/[a-z0-9]+/);
    await expect(page.locator('h1')).toContainText('Ahmad Ibrahim');

    // Record donation
    await page.click('button:has-text("Record Donation")');
    await page.fill('[name="amount"]', '250');
    await page.selectOption('[name="purpose"]', 'HOMELESS_CARE');
    await page.click('button[type="submit"]');

    // Verify donation appears in history
    await expect(page.locator('.donation-history')).toContainText('RM 250.00');

    // Verify journey stage updated to FIRST_TIME_DONOR
    await expect(page.locator('.journey-stage')).toContainText('First Time Donor');
  });

  test('campaign creation and email sending', async ({ page }) => {
    await page.goto('/campaigns/new');

    // Fill campaign details
    await page.fill('[name="name"]', 'Ramadan 2025 Campaign');
    await page.fill('[name="description"]', 'Help us feed 1000 families during Ramadan');
    await page.fill('[name="goalAmount"]', '50000');
    await page.selectOption('[name="type"]', 'RAMADAN');

    // Set dates
    await page.fill('[name="startDate"]', '2025-02-28');
    await page.fill('[name="endDate"]', '2025-03-30');

    // Save campaign
    await page.click('button[type="submit"]');

    // Verify redirect to campaign page
    await expect(page).toHaveURL(/\/campaigns\/[a-z0-9]+/);

    // Send email campaign
    await page.click('button:has-text("Send Email Campaign")');
    await page.selectOption('[name="targetSegment"]', 'POTENTIAL_LOYALIST');
    await page.click('button:has-text("Send to 150 donors")');

    // Verify success message
    await expect(page.locator('.success-message')).toContainText('Email campaign sent successfully');
  });
});
```

**Dashboard Analytics Test:**
```typescript
// tests/e2e/analytics-dashboard.spec.ts
test('analytics dashboard loads and displays charts', async ({ page }) => {
  await page.goto('/dashboard');

  // Verify key metrics cards load
  await expect(page.locator('[data-testid="total-donations"]')).toBeVisible();
  await expect(page.locator('[data-testid="active-donors"]')).toBeVisible();
  await expect(page.locator('[data-testid="campaigns-count"]')).toBeVisible();

  // Verify charts render
  await expect(page.locator('.donation-trend-chart')).toBeVisible();
  await expect(page.locator('.journey-stage-funnel')).toBeVisible();

  // Interact with chart filters
  await page.selectOption('[name="dateRange"]', 'last_90_days');
  await page.waitForTimeout(1000); // Wait for chart to update

  // Verify chart updated
  await expect(page.locator('.donation-trend-chart')).toBeVisible();
});
```

### Load Testing

**Considerations:**
- Dashboard queries must handle 10,000+ donors efficiently
- Email campaigns may send to 1,000+ recipients simultaneously
- Analytics calculations on large datasets
- Test with k6 or Artillery

**Example Load Test (k6):**
```javascript
// tests/load/dashboard-analytics.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 50 },  // Ramp up to 50 users
    { duration: '5m', target: 50 },  // Stay at 50 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2s
  },
};

export default function () {
  // Test dashboard analytics endpoint
  const res = http.get('https://crm.myfundaction.org/api/analytics/dashboard');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 2s': (r) => r.timings.duration < 2000,
    'has donation metrics': (r) => JSON.parse(r.body).totalDonations !== undefined,
  });

  sleep(1);
}
```

---

## 11. MALAYSIAN CONTEXT

### i18n Setup (Bahasa Malaysia + English)

**Install next-intl:**
```bash
npm install next-intl
```

**Configuration:**
```typescript
// i18n.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}));
```

**Messages:**
```json
// messages/en.json
{
  "donor": {
    "title": "Donors",
    "create": "Add New Donor",
    "firstName": "First Name",
    "lastName": "Last Name",
    "email": "Email",
    "phone": "Phone Number",
    "journeyStage": "Supporter Journey Stage",
    "stages": {
      "firstTime": "First-Time Donor",
      "potentialLoyalist": "Potential Loyalist",
      "loyalCollaborator": "Loyal Collaborator",
      "majorDonor": "Major Donor",
      "lapsed": "Lapsed Donor"
    }
  },
  "donation": {
    "title": "Donations",
    "record": "Record Donation",
    "amount": "Amount (RM)",
    "purpose": "Purpose",
    "purposes": {
      "general": "General Fund",
      "homelessCare": "Homeless Care",
      "foodDistribution": "Food Distribution",
      "qurbani": "Qurbani",
      "zakat": "Zakat",
      "sadaqah": "Sadaqah"
    }
  },
  "campaign": {
    "title": "Campaigns",
    "create": "Create Campaign",
    "goalAmount": "Goal Amount",
    "raised": "Raised",
    "donors": "Donors"
  }
}

// messages/ms.json
{
  "donor": {
    "title": "Penderma",
    "create": "Tambah Penderma Baru",
    "firstName": "Nama Pertama",
    "lastName": "Nama Keluarga",
    "email": "E-mel",
    "phone": "Nombor Telefon",
    "journeyStage": "Tahap Penyokong",
    "stages": {
      "firstTime": "Penderma Kali Pertama",
      "potentialLoyalist": "Penyokong Berpotensi",
      "loyalCollaborator": "Rakan Setia",
      "majorDonor": "Penderma Utama",
      "lapsed": "Penderma Tidak Aktif"
    }
  },
  "donation": {
    "title": "Derma",
    "record": "Rekod Derma",
    "amount": "Jumlah (RM)",
    "purpose": "Tujuan",
    "purposes": {
      "general": "Dana Am",
      "homelessCare": "Kebajikan Gelandangan",
      "foodDistribution": "Agihan Makanan",
      "qurbani": "Qurban",
      "zakat": "Zakat",
      "sadaqah": "Sadaqah"
    }
  },
  "campaign": {
    "title": "Kempen",
    "create": "Cipta Kempen",
    "goalAmount": "Sasaran Jumlah",
    "raised": "Terkumpul",
    "donors": "Penderma"
  }
}
```

**Usage:**
```typescript
import { useTranslations } from 'next-intl';

export default function DonorPage() {
  const t = useTranslations('donor');

  return (
    <div>
      <h1>{t('title')}</h1>
      <button>{t('create')}</button>
    </div>
  );
}
```

### Malaysian Currency Formatting

**Format Ringgit Malaysia (RM):**
```typescript
// lib/format.ts
export function formatCurrency(amount: number, currency: string = 'MYR'): string {
  if (currency === 'MYR') {
    return `RM ${amount.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // International currencies
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

// Examples:
formatCurrency(1250.50); // "RM 1,250.50"
formatCurrency(500);     // "RM 500.00"
```

### Islamic Calendar Integration for Campaigns

**For Ramadan, Qurbani, Zakat campaigns:**
```bash
npm install moment-hijri
```

**Example:**
```typescript
import moment from 'moment-hijri';

// Get current Islamic date
const islamicDate = moment().format('iYYYY/iM/iD');
// e.g., "1446/9/15" (Ramadan 15, 1446)

// Check if current period is Ramadan
export function isRamadanPeriod(): boolean {
  const hijriMonth = moment().iMonth(); // 0-indexed
  return hijriMonth === 8; // Ramadan is 9th month (0-indexed = 8)
}

// Calculate Qurbani period (Dhul Hijjah 10-13)
export function isQurbaniPeriod(): boolean {
  const hijriMonth = moment().iMonth();
  const hijriDate = moment().iDate();
  return hijriMonth === 11 && hijriDate >= 10 && hijriDate <= 13;
}

// Display campaign dates in both calendars
export function formatDualCalendar(date: Date): string {
  const gregorian = moment(date).format('DD MMM YYYY');
  const hijri = moment(date).format('iD iMMMM iYYYY');
  return `${gregorian} (${hijri})`;
}

// Example: "15 Mar 2025 (15 Ramadan 1446)"
```

### WhatsApp Integration for Donor Communications

**Deep Links:**
```typescript
// lib/whatsapp.ts
export function sendDonationReceiptViaWhatsApp(donor: Donor, donation: Donation) {
  const message = `
Assalamualaikum ${donor.firstName},

Thank you for your generous donation of RM ${donation.amount} to ${donation.purpose}.

Your receipt number: ${donation.receiptNumber}
Date: ${formatDate(donation.createdAt)}

May Allah accept your contribution and bless you abundantly.

MyFundAction Team
  `.trim();

  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${donor.phone.replace(/\+/g, '')}?text=${encoded}`;

  window.open(url, '_blank');
}

// Send campaign updates via WhatsApp
export function shareCampaignToWhatsApp(campaign: Campaign) {
  const message = `
🌟 ${campaign.name}

${campaign.description}

Goal: RM ${campaign.goalAmount.toLocaleString()}
Raised: RM ${campaign.currentAmount.toLocaleString()}

Donate now: ${campaign.landingPageUrl}
  `.trim();

  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/?text=${encoded}`, '_blank');
}
```

**WhatsApp Click-to-Chat Button:**
```tsx
// components/WhatsAppButton.tsx
import { MessageCircle } from 'lucide-react';

export function WhatsAppDonorButton({ donor }: { donor: Donor }) {
  if (!donor.phone || donor.preferredContact !== 'WHATSAPP') {
    return null;
  }

  return (
    <a
      href={`https://wa.me/${donor.phone.replace(/\+/g, '')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-green-600 hover:text-green-700"
    >
      <MessageCircle className="h-4 w-4" />
      WhatsApp {donor.firstName}
    </a>
  );
}
```

### Malaysian Phone Number Validation

**Validation:**
```typescript
// lib/validation.ts
import { z } from 'zod';

export const malaysianPhoneSchema = z
  .string()
  .regex(/^\+60\d{9,10}$/, 'Invalid Malaysian phone number. Format: +60123456789');

// Example usage in donor schema
const donorSchema = z.object({
  phone: malaysianPhoneSchema.optional(),
});
```

---

## 12. MONITORING & ANALYTICS

### Vercel Analytics

**Install:**
```bash
npm install @vercel/analytics
```

**Setup:**
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Track Custom Events:**
```typescript
import { track } from '@vercel/analytics';

// Track donation recording
track('donation_recorded', {
  amount: donation.amount,
  purpose: donation.purpose,
  donorJourneyStage: donor.journeyStage,
});

// Track campaign creation
track('campaign_created', {
  type: campaign.type,
  goalAmount: campaign.goalAmount,
});

// Track email campaign sent
track('email_campaign_sent', {
  campaignId: campaign.id,
  recipientCount: recipients.length,
  targetSegment: campaign.targetSegment,
});

// Track journey stage upgrade
track('donor_journey_upgraded', {
  donorId: donor.id,
  from: previousStage,
  to: newStage,
});
```

### Sentry Error Tracking

**Install:**
```bash
npm install @sentry/nextjs
```

**Setup:**
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

**Custom Error Logging:**
```typescript
try {
  await createDonation(data);
} catch (error) {
  Sentry.captureException(error, {
    tags: { feature: 'donation_recording' },
    user: { id: session.user.id },
    extra: { donorId: data.donorId, amount: data.amount },
  });
  throw error;
}
```

### Posthog User Behavior Analytics

**Install:**
```bash
npm install posthog-js
```

**Setup:**
```typescript
// lib/posthog.ts
import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });
}

export { posthog };
```

**Track Events:**
```typescript
import { posthog } from '@/lib/posthog';

// Track feature usage
posthog.capture('donation_recorded', {
  amount: donation.amount,
  purpose: donation.purpose,
  donor_journey_stage: donor.journeyStage,
});

// Track email campaign performance
posthog.capture('email_campaign_opened', {
  campaignId: campaign.id,
  donorId: donor.id,
});

// Identify user
posthog.identify(session.user.id, {
  email: session.user.email,
  role: session.user.role,
  department: session.user.department,
});
```

### Custom CRM Dashboards & KPIs

**Key Metrics to Track:**
- Total donations (daily/weekly/monthly/yearly)
- Active donors by journey stage
- Donor retention rate
- Average donation amount
- Campaign conversion rates
- Email campaign performance (open rate, click rate)
- Donor lifetime value (LTV)
- Lapsed donor count (no donation in 12+ months)
- Major donor identification (top 10% by total donated)

**Implementation:**
```typescript
// app/api/analytics/dashboard/route.ts
export async function GET(req: Request) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [
    totalDonations,
    donationsThisMonth,
    donationsThisYear,
    activeDonors,
    donorsByStage,
    campaignPerformance,
    avgDonationAmount,
  ] = await Promise.all([
    // Total all-time donations
    prisma.donation.aggregate({
      _sum: { amount: true },
      _count: true,
    }),

    // Donations this month
    prisma.donation.aggregate({
      where: { createdAt: { gte: startOfMonth } },
      _sum: { amount: true },
      _count: true,
    }),

    // Donations this year
    prisma.donation.aggregate({
      where: { createdAt: { gte: startOfYear } },
      _sum: { amount: true },
      _count: true,
    }),

    // Active donors (donated in last 12 months)
    prisma.donor.count({
      where: {
        lastDonationDate: {
          gte: new Date(now.setMonth(now.getMonth() - 12)),
        },
      },
    }),

    // Donors by journey stage
    prisma.donor.groupBy({
      by: ['journeyStage'],
      _count: true,
    }),

    // Active campaigns
    prisma.campaign.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        name: true,
        goalAmount: true,
        currentAmount: true,
        currentDonors: true,
      },
    }),

    // Average donation amount
    prisma.donation.aggregate({
      _avg: { amount: true },
    }),
  ]);

  return Response.json({
    totalDonations: totalDonations._sum.amount || 0,
    totalDonationCount: totalDonations._count,
    donationsThisMonth: donationsThisMonth._sum.amount || 0,
    donationsThisYear: donationsThisYear._sum.amount || 0,
    activeDonors,
    donorsByStage,
    campaignPerformance,
    avgDonationAmount: avgDonationAmount._avg.amount || 0,
  });
}
```

**Donor Retention Rate Calculation:**
```typescript
// lib/analytics.ts
export async function calculateDonorRetentionRate(year: number) {
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31, 23, 59, 59);
  const startOfPreviousYear = new Date(year - 1, 0, 1);
  const endOfPreviousYear = new Date(year - 1, 11, 31, 23, 59, 59);

  // Donors who donated in previous year
  const previousYearDonors = await prisma.donor.findMany({
    where: {
      donations: {
        some: {
          createdAt: {
            gte: startOfPreviousYear,
            lte: endOfPreviousYear,
          },
        },
      },
    },
    select: { id: true },
  });

  // Of those, how many donated again in current year?
  const retainedDonors = await prisma.donor.count({
    where: {
      id: { in: previousYearDonors.map(d => d.id) },
      donations: {
        some: {
          createdAt: {
            gte: startOfYear,
            lte: endOfYear,
          },
        },
      },
    },
  });

  const retentionRate = previousYearDonors.length > 0
    ? (retainedDonors / previousYearDonors.length) * 100
    : 0;

  return retentionRate;
}
```

### Uptime Monitoring

**Use UptimeRobot or Better Uptime:**
- Monitor `https://crm.myfundaction.org/api/health`
- Alert via Email, SMS, Slack if downtime

**Health Check Endpoint:**
```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check Resend API (optional)
    // const resendStatus = await checkResendStatus();

    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'ok',
        // email: resendStatus,
      }
    }, { status: 200 });
  } catch (error) {
    return Response.json({
      status: 'unhealthy',
      error: error.message
    }, { status: 500 });
  }
}
```

### Email Campaign Performance Tracking

**Track Opens and Clicks:**
```typescript
// Use Resend webhooks or tracking pixels

// app/api/webhooks/resend/route.ts
export async function POST(req: Request) {
  const event = await req.json();

  if (event.type === 'email.opened') {
    await prisma.engagement.create({
      data: {
        type: 'EMAIL_OPENED',
        donorId: event.metadata.donorId,
        campaignId: event.metadata.campaignId,
        channel: 'EMAIL',
        title: 'Email Opened',
      },
    });

    // Update campaign open rate
    await updateCampaignOpenRate(event.metadata.campaignId);
  }

  if (event.type === 'email.clicked') {
    await prisma.engagement.create({
      data: {
        type: 'EMAIL_CLICKED',
        donorId: event.metadata.donorId,
        campaignId: event.metadata.campaignId,
        channel: 'EMAIL',
        title: 'Email Link Clicked',
      },
    });

    // Update campaign click rate
    await updateCampaignClickRate(event.metadata.campaignId);
  }

  return Response.json({ received: true });
}
```

---

## FINAL INSTRUCTIONS

### Development Checklist

- [ ] Clone TailAdmin CRM template or start fresh with `npx create-next-app@latest`
- [ ] Set up Prisma with CRM schema (Donor, Donation, Campaign, Engagement)
- [ ] Implement NextAuth with RBAC for fundraising team
- [ ] Create donor management CRUD operations
- [ ] Build donation recording with receipt generation
- [ ] Implement campaign management features
- [ ] Add email campaign functionality with Resend
- [ ] Create analytics dashboard with Chart.js/Recharts
- [ ] Implement donor journey stage tracking and progression
- [ ] Build donor segmentation by journey stage
- [ ] Add engagement tracking (emails, calls, events)
- [ ] Integrate with beneficiary system for impact stories
- [ ] Create API endpoints for P2P giving platform integration
- [ ] Write unit tests for analytics and journey calculations
- [ ] Write E2E tests with Playwright MCP for critical workflows
- [ ] Set up i18n (English + Bahasa Malaysia)
- [ ] Deploy to Vercel
- [ ] Configure production database (Supabase)
- [ ] Set up monitoring (Sentry, Posthog, Vercel Analytics)
- [ ] Test email campaigns with Resend
- [ ] Import historical donor data from existing systems

### Remember:

1. **Commit frequently** - at least 3-5 times per hour
2. **Use TodoWrite** to track your progress through dashboard, donor management, campaigns, and analytics features
3. **Use MCP tools**:
   - sequential-thinking for complex donor segmentation logic
   - filesystem for multi-file dashboard operations
   - fetch/deepwiki for CRM and visualization research
   - allpepper-memory-bank to document journey stage criteria
   - playwright for E2E testing of donation and campaign workflows
4. **Data visualization first** - Charts and dashboards are critical for fundraising insights
5. **Email compliance** - Always include unsubscribe links and respect opt-out preferences
6. **Security first** - Donor financial data is highly sensitive
7. **Integration ready** - Build API endpoints for beneficiary and P2P system connections
8. **Test thoroughly** - Donor relationships and accurate tracking are mission-critical

### Donor Journey Stage Upgrade Logic

**Implement automatic progression:**
```typescript
// lib/donor-journey.ts
export async function checkAndUpgradeJourneyStage(donorId: string) {
  const donor = await prisma.donor.findUnique({
    where: { id: donorId },
    include: { donations: true },
  });

  const donationCount = donor.donationCount;
  const totalDonated = donor.totalDonated;
  const hasRecurring = donor.donations.some(d => d.isRecurring);

  let newStage = donor.journeyStage;

  // Upgrade logic
  if (donationCount === 1) {
    newStage = 'FIRST_TIME_DONOR';
  } else if (donationCount >= 2 && donationCount <= 3) {
    newStage = 'POTENTIAL_LOYALIST';
  } else if (donationCount >= 4 || hasRecurring) {
    newStage = 'LOYAL_COLLABORATOR';
  }

  // Major donor threshold (e.g., top 10% or > RM 5000)
  if (totalDonated > 5000) {
    newStage = 'MAJOR_DONOR';
  }

  // Lapsed donor (no donation in 12 months)
  const monthsSinceLastDonation = differenceInMonths(new Date(), donor.lastDonationDate);
  if (monthsSinceLastDonation > 12) {
    newStage = 'LAPSED';
  }

  // Update if changed
  if (newStage !== donor.journeyStage) {
    await prisma.donor.update({
      where: { id: donorId },
      data: { journeyStage: newStage },
    });

    await logAudit('DONOR_JOURNEY_UPGRADED', {
      donorId,
      from: donor.journeyStage,
      to: newStage,
    });
  }
}
```

Good luck building the CRM Integration & Donor Engagement system!
