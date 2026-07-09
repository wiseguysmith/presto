# PRESTO Phase 1 - Complete Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Supabase account (free at https://supabase.com)
- Git

## Step 1: Supabase Project Setup

### Create a Supabase Project

1. Go to https://supabase.com and sign up/log in
2. Click "Create a new project"
3. Fill in:
   - **Name**: `presto-phase1` (or any name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., us-west-1 for US)
4. Click "Create new project"
5. Wait for the project to provision (~2 minutes)

### Get Your Credentials

Once the project is ready:

1. Go to **Settings** → **API** (left sidebar)
2. Copy these values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` (under "Project API keys") → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` (under "Project API keys") → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **KEEP SECRET!**

---

## Step 2: Database Schema Setup

### Run Migration

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click "Run"
6. You should see a success message

### Verify Schema

Go to **Tables** (left sidebar) and you should see:
- `restaurants`
- `restaurant_tables`
- `menu_categories`
- `menu_items`
- `orders`
- `order_items`

---

## Step 3: Seed Initial Data

### Load Pink Flamingo Restaurant

1. In **SQL Editor**, click "New Query"
2. Copy the entire contents of `supabase/seed.sql`
3. Paste into the SQL editor
4. Click "Run"
5. You should see success messages

### Verify Data

Go to **Tables** and check:
- **restaurants**: Should have 1 row (Pink Flamingo)
- **restaurant_tables**: Should have 10 rows (tables 1-10)
- **menu_categories**: Should have 6 rows (Starters, Bowls, Tacos, Seafood, Smoothies, Coffee)
- **menu_items**: Should have 12 rows

---

## Step 4: Configure the App

### Create `.env.local`

In the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and paste your credentials from Step 1:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANT**: Never commit `.env.local` to git. It's in `.gitignore` for security.

---

## Step 5: Install & Run

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app starts at: **http://localhost:3000**

---

## Step 6: Test the Flow

### Open the Menu

Navigate to:
```
http://localhost:3000/menu/pink-flamingo/table/1
```

Replace `1` with any table number 1-10.

### Test Checklist

- [ ] Menu loads with restaurant name and table number
- [ ] Categories display (Starters, Bowls, etc.)
- [ ] Menu items show with prices and descriptions
- [ ] Click "+" button to add item to cart
- [ ] Cart updates with new item
- [ ] Expand cart item to see notes, quantity, remove
- [ ] Adjust quantity with +/- buttons
- [ ] Type item notes (e.g., "no onions")
- [ ] Scroll down to see order notes input
- [ ] Add optional name
- [ ] Add optional WhatsApp
- [ ] Click "Submit Order"
- [ ] See confirmation modal with message
- [ ] Order ID displays in confirmation
- [ ] Click "Continue Ordering" to reset cart

### Verify Database

In Supabase **Table Editor**:

1. Go to **orders** table
2. You should see new rows with:
   - `status`: "new"
   - `table_number`: 1 (or whichever table)
   - `customer_name`, `customer_whatsapp`: Your entered values
   - `subtotal`, `total`: Calculated amounts
3. Go to **order_items** table
4. You should see rows matching the items you ordered
   - `name_snapshot`: Item name
   - `price_snapshot`: Item price at order time
   - `quantity`: How many
   - `item_notes`: Any notes you added

---

## Troubleshooting

### "supabaseUrl is required" Error

- Check that `.env.local` is in the root directory
- Verify `NEXT_PUBLIC_SUPABASE_URL` is set correctly
- Run `npm run build` to see detailed errors

### "Cannot find module" Errors

- Run `npm install` again
- Delete `node_modules/` and `.next/` folders
- Run `npm install` again

### Menu doesn't load / "Restaurant Not Found"

- Verify you're using the correct slug: `pink-flamingo` (lowercase with hyphen)
- Verify table number is 1-10
- Check that seed data ran successfully in Supabase

### Orders not saving

- Check browser console for JavaScript errors
- Verify Supabase connection in browser Network tab
- Check that `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Ensure you're not using `SUPABASE_SERVICE_ROLE_KEY` in client code

### Still having issues?

1. Check Supabase dashboard for any errors
2. Verify all environment variables are set
3. Clear browser cache and restart dev server
4. Check `.next/` build cache: `rm -rf .next/`

---

## Local Supabase (Optional)

For development without internet, use local Supabase:

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Stop local Supabase
supabase stop
```

Update `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP3ySmy0OvtIFNFqMuc2B1ORvtbefjgrmwwwKJtL0
```

The anon key for local Supabase is fixed. Service role key needs to be copied from the Supabase CLI output.

---

## What's Next?

Once Phase 1 is working:

1. **Share with stakeholders** for feedback
2. **Document any issues** for Phase 2
3. **Plan Phase 2: Payments** (if approved)
4. **Collect restaurant test data** for production seeding

See `docs/PHASE_PLAN.md` for future phases.

---

## Support

For questions:
- Check README.md for architecture overview
- Review type definitions in `types/index.ts`
- Check component code in `components/menu/`
- Review server actions in `lib/orders/` and `lib/menu/`

---

**Happy building! 🚀**
