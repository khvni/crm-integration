# CRM Integration & Donor Engagement System - MyFundAction

A comprehensive donor relationship management and campaign tracking system built for MyFundAction (Yayasan Kebajikan Muslim), a youth-driven Malaysian NGO dedicated to helping underprivileged communities.

## Overview

This CRM system enables MyFundAction to:
- Manage donor relationships across multiple touchpoints
- Track engagement journeys from first-time donors to loyal collaborators
- Visualize donation patterns and campaign performance
- Integrate with beneficiary systems to show direct impact
- Connect with P2P giving platform for peer-to-peer fundraising
- Automate donor communications via email campaigns

## Tech Stack

**Frontend:**
- Next.js 15 (App Router) with React 19
- TypeScript (strict mode)
- Shadcn UI + Tailwind CSS
- Chart.js & Recharts for data visualization
- React Hook Form + Zod validation
- Zustand for state management
- React Query for server state

**Backend:**
- Next.js API Routes (serverless)
- Prisma ORM
- PostgreSQL (Vercel Postgres for dev, Supabase for production)

**Authentication:**
- NextAuth v5 (Auth.js)
- Role-based access control (RBAC)

**Email/Notifications:**
- Resend for transactional emails
- React Email for templates

**Analytics:**
- Vercel Analytics
- Sentry for error tracking
- Posthog for user behavior

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crm-integration
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your database URL and other required variables.

4. Initialize the database:
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# OR run migrations (for production)
npm run db:migrate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
crm-integration/
├── app/                      # Next.js App Router
│   ├── dashboard/           # Analytics dashboard
│   ├── donors/              # Donor management
│   ├── donations/           # Donation tracking
│   ├── campaigns/           # Campaign management
│   ├── analytics/           # Advanced analytics
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── ui/                  # Shadcn UI components
│   ├── charts/              # Chart components
│   ├── forms/               # Form components
│   └── layout/              # Layout components
├── lib/                     # Utility functions
│   ├── utils/               # General utilities
│   ├── validation/          # Zod schemas
│   ├── analytics/           # Analytics logic
│   ├── format/              # Formatting utilities
│   └── prisma.ts            # Prisma client
├── prisma/                  # Database schema
│   └── schema.prisma        # Prisma schema
├── types/                   # TypeScript types
└── public/                  # Static assets
```

## Database Schema

The system includes the following main models:

- **Donor**: Comprehensive donor profiles with journey tracking
- **Donation**: Transaction records with purpose and impact tracking
- **Campaign**: Fundraising campaigns with goals and analytics
- **Engagement**: Donor interaction tracking (emails, calls, events)
- **DonorNote**: Internal notes for donor relationships
- **User**: System users with role-based permissions
- **AuditLog**: Audit trail for financial transactions

### Donor Journey Stages

1. **First Time Donor**: Just donated once
2. **Potential Loyalist**: 2-3 donations, showing interest
3. **Loyal Collaborator**: 4+ donations or recurring
4. **Major Donor**: Large cumulative donations
5. **Lapsed**: No donation in 12+ months
6. **Inactive**: Opted out of communications

## Key Features

### MVP Features (Phase 1)

**Donor Management:**
- Create/edit donor profiles
- Track journey stages
- Tag system for categorization
- Soft delete functionality

**Donation Tracking:**
- Record one-time and recurring donations
- Generate PDF receipts
- Link to campaigns and beneficiaries
- Track donation status

**Campaign Management:**
- Create campaigns with goals
- Track progress (amount raised, donor count)
- Campaign status workflow
- Basic analytics

**Email Campaigns:**
- Send personalized campaigns to donor segments
- Email templates with React Email
- Track open and click rates
- Segment by journey stage

**Analytics Dashboards:**
- Total donations and active donors
- Journey stage distribution
- Campaign ROI and performance
- Donation trends over time

**Integration Points:**
- Link donations to beneficiaries (impact tracking)
- Link donations to projects (funding allocation)
- API endpoints for P2P giving platform

## Scripts

```bash
# Development
npm run dev              # Start development server

# Build & Production
npm run build            # Build for production
npm start                # Start production server

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio

# Linting
npm run lint             # Run ESLint
```

## Environment Variables

Required environment variables (see `.env.example`):

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Email (Resend)
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@myfundaction.org"

# Integration URLs
BENEFICIARY_API_URL="..."
P2P_GIVING_API_URL="..."
PROJECTS_API_URL="..."

# Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY="..."
SENTRY_DSN="..."
```

## User Roles & Permissions

1. **Super Admin**: Full system access, user management, settings
2. **Admin**: Manage donors, campaigns, view all reports
3. **Fundraising Manager**: Create campaigns, manage donors, view analytics
4. **Campaign Coordinator**: Execute campaigns, track engagements
5. **Analyst**: Read-only access to dashboards and reports

## Malaysian Context Features

- **Currency**: Malaysian Ringgit (MYR) formatting
- **Phone**: Malaysian phone number validation (+60)
- **i18n**: English + Bahasa Malaysia (planned)
- **Islamic Calendar**: Ramadan/Qurbani campaign support
- **WhatsApp Integration**: Donor communication via WhatsApp

## Integration with Other MyFundAction Systems

- **Beneficiary System**: Link donations to beneficiary impact
- **P2P Giving Platform**: Track peer-to-peer fundraising
- **Projects Dashboard**: Allocate donations to specific projects

## Security & Compliance

- **Data Encryption**: At rest and in transit
- **RBAC**: Role-based access control
- **Audit Logging**: Track all financial transactions
- **PCI Compliance**: Never store card details directly
- **GDPR**: Data export and right to be forgotten

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Environment Variables in Vercel

Add all variables from `.env.example` to Vercel dashboard:
- Project Settings → Environment Variables

### Database Setup

**Development**: Vercel Postgres
**Production**: Supabase PostgreSQL (cost-effective at scale)

## Contributing

This project follows conventional commits:

```
feat(crm): add donor journey stage tracking
fix(crm): correct donation amount calculation
docs(crm): update API documentation
```

## Success Metrics (MVP)

- Donor onboarding: < 30 seconds
- Engagement tracking: 100% of donations linked
- Segmentation accuracy: 90%+ correct categorization
- Email campaigns: Send to 1,000+ supporters in < 5 minutes
- Dashboard load time: < 2 seconds

## License

Copyright © 2025 MyFundAction (Yayasan Kebajikan Muslim)

## Support

For questions or issues, please contact the MyFundAction technical team.

---

Built with Claude Code for MyFundAction
