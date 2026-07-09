# PRESTO Phase 1 - Quick Start

Get the app running in **5 minutes** (assuming you have a Supabase account).

## 1. Create Supabase Project (2 min)

1. Go to https://supabase.com → Create new project
2. Copy your credentials from **Settings → API**:
   - `Project URL`
   - `anon public` key
   - `service_role` key

## 2. Set Up Database (1 min)

1. In Supabase, go to **SQL Editor**
2. New Query → Paste `supabase/migrations/001_initial_schema.sql` → Run
3. New Query → Paste `supabase/seed.sql` → Run

## 3. Configure App (1 min)

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 4. Run (1 min)

```bash
npm install
npm run dev
```

## 5. Test

Open: **http://localhost:3000/menu/pink-flamingo/table/1**

Add items → Submit order → Check Supabase dashboard for saved order

---

## That's it! 🎉

For detailed setup, see `docs/SETUP.md`  
For roadmap, see `docs/PHASE_PLAN.md`  
For architecture, see `README.md`
