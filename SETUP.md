# Wizer Microconsulting — Setup Guide

## Prerequisites
- Node.js 18+ installed
- GitHub account (you already have this)
- Supabase account (you already have this)
- Vercel account (free — sign up at vercel.com)

## Step 1 — Set up the database

1. Open your Supabase project: https://ziwzgrdtolapmbesehiu.supabase.co
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Open the file `wizer_schema.sql` (in the same folder as this guide)
5. Copy all the contents and paste into the SQL editor
6. Click **Run** (green button)
7. You should see "Success. No rows returned."

## Step 2 — Get your API keys

1. In Supabase, click **Settings** (gear icon, bottom of left sidebar)
2. Click **API**
3. Copy these two values:
   - **Project URL** — starts with `https://`
   - **anon public** key — long string starting with `eyJ`

## Step 3 — Configure the app

1. In the `wizer-app` folder, find the file `.env.local.example`
2. Make a copy of it named `.env.local`
3. Open `.env.local` and replace the placeholder values:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Project URL from Step 2
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key from Step 2

## Step 4 — Run the app locally

Open Terminal, navigate to the `wizer-app` folder, then run:

```bash
npm install
npm run dev
```

Open your browser at: http://localhost:3000

## Step 5 — Deploy to Vercel

1. Push the `wizer-app` folder to a GitHub repository
2. Go to vercel.com and click **Add New Project**
3. Import your GitHub repository
4. In the **Environment Variables** section, add your two Supabase keys
5. Click **Deploy**

Your app will be live in ~2 minutes.

## Step 6 — Create your first admin user

1. In Supabase, go to **Authentication** → **Users** → **Add User**
2. Enter email and password for the Super Admin account
3. Copy the user's UUID from the users table
4. Go to **SQL Editor** and run:

```sql
update profiles
set role = 'super_admin', first_name = 'Your', last_name = 'Name'
where id = 'PASTE-UUID-HERE';
```

Now log in at your app URL with those credentials.

## What's built

- ✅ 4-role auth routing (Super Admin, Org Admin, Client, Participant)
- ✅ Super Admin: Engagements list
- ✅ Org Admin: Panels (Our Panels + Funded Panels tabs)
- ✅ Client: Study dashboard + new study flow
- ✅ Participant: Dashboard with teal paid consultation styling
- ✅ Complete database schema with RLS security

## Next steps to build

1. Client study submission flow (Steps 1–3)
2. Org Admin activation management (accept, assign panel, set questions)
3. Question pipeline (send, collect responses)
4. AI Question Advisor
5. Results view with demographic breakdowns
6. Points ledger and earnings history
