# Wizer Microconsulting Platform

A complete Next.js 14 application scaffold for the Wizer Microconsulting platform — structured community consultation powered by Wizer.

## Project Structure

```
wizer-app/
├── src/
│   ├── app/
│   │   ├── (admin)/admin/          # Super Admin dashboard & engagements
│   │   ├── (client)/client/        # Client studies & submission
│   │   ├── (org)/org/              # Org Admin panels & activations
│   │   ├── (participant)/          # Participant dashboard
│   │   ├── auth/                   # Supabase OAuth callback
│   │   ├── login/                  # Login page
│   │   ├── page.tsx                # Role-based redirect
│   │   ├── layout.tsx              # Root layout
│   │   └── globals.css             # Global Tailwind styles
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts           # Browser client
│   │       ├── server.ts           # Server-side client
│   │       └── middleware.ts       # Auth middleware
│   ├── components/
│   │   └── nav/                    # Role-specific nav components
│   ├── types/
│   │   └── database.ts             # TypeScript database types
│   └── middleware.ts               # Next.js middleware
├── .env.local.example              # Environment variables template
├── next.config.js                  # Next.js configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies
├── SETUP.md                        # Setup & deployment guide
└── README.md                       # This file
```

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: Lucide React icons
- **Utilities**: clsx for class composition

## Features

### Role-Based Access Control

Four distinct user roles with dedicated dashboards:

1. **Super Admin** (`super_admin`)
   - View all funded engagements
   - Manage organizations and participants
   - System oversight

2. **Org Admin** (`org_admin`)
   - Manage participant panels
   - Review and accept client activations
   - Track panel contributions

3. **Client** (`client`)
   - Create and submit engagement briefs
   - View study results and demographics
   - Manage participant recruitment

4. **Participant** (`participant`)
   - View available questions
   - Answer consultations for compensation
   - Track earnings and points balance

### Authentication

- Email/password authentication via Supabase
- Middleware-based session management
- Automatic role-based redirects
- Secure server-side operations

### Database Schema

Complete schema with Row Level Security (RLS) includes:

- `organizations` — Partner, client, and Wizer orgs
- `profiles` — User accounts with role & points
- `panels` — Community participant cohorts
- `activations` — Client engagement studies
- `activation_questions` — Consultation questions
- `question_responses` — Participant answers
- `invitations` — Panel invitations
- `points_ledger` — Earning records

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase project

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
OPENAI_API_KEY=your-api-key  # For AI Question Advisor (optional)
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel dashboard
3. Add environment variables
4. Deploy

```bash
vercel deploy --prod
```

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### File Conventions

- `page.tsx` — Route pages (server components by default)
- `layout.tsx` — Route layouts
- `route.ts` — API routes
- `'use client'` — Client component directive

## Building Further

### Priority Items

1. **Client Activation Flow** — Multi-step study submission
2. **Org Admin Controls** — Accept activations, assign panels
3. **Question Pipeline** — Send questions, track responses
4. **AI Question Advisor** — OpenAI integration for question refinement
5. **Results Dashboard** — Demographic breakdowns & analytics
6. **Points System** — Ledger view, redemption flows

### Database Migrations

Use Supabase SQL Editor for schema changes. See `wizer_schema.sql` for full schema definition.

## Security

- **RLS Policies**: Database row-level security enforced
- **Server Components**: Sensitive operations on server only
- **Environment Variables**: Never commit secrets
- **Session Management**: Secure cookie-based sessions
- **Type Safety**: Full TypeScript coverage

## Resources

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Tailwind CSS Reference](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)

## License

Proprietary — Wizer Microconsulting

## Support

For issues or questions, contact the development team.
