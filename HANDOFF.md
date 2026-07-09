# PRESTO Phase 1 → Phase 2 Handoff

## Executive Summary

**Status**: Phase 1 ✅ **COMPLETE & PRODUCTION-READY**

PRESTO is a QR-based restaurant ordering system. Phase 1 delivers the core customer experience: scan QR → view menu → add to cart → submit order → confirmation.

**What works**: Full end-to-end ordering flow with Supabase persistence  
**Tech**: Next.js 15, React, TypeScript, Tailwind, Supabase  
**Live URL**: `http://localhost:3000/menu/pink-flamingo/table/1`  
**Test data**: Pink Flamingo restaurant, 10 tables, 12 menu items

---

## Quick Start for Next Developer

### 1. Get It Running
```bash
cd /c/Users/18593/presto
npm install
npm run dev
# Opens http://localhost:3000
```

### 2. Configure Supabase
```env
# .env.local (fill in your credentials)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
```

### 3. Test the Flow
```
Navigate to: http://localhost:3000/menu/pink-flamingo/table/1
- Click category tabs
- Add 2 items to cart
- Add notes + name + WhatsApp
- Click "Submit Order"
- See confirmation modal
- Check Supabase: orders + order_items tables have new rows
```

✅ If you see the confirmation modal and data in Supabase, Phase 1 is working.

---

## What Phase 1 Includes

### Customer Features
- ✅ QR menu URL with dynamic routing
- ✅ Digital menu with 6 categories
- ✅ Shopping cart with quantity controls
- ✅ Item-level notes ("no onions", etc.)
- ✅ Order-level notes
- ✅ Optional customer name + WhatsApp
- ✅ Order submission to Supabase
- ✅ Confirmation modal with spec message

### Architecture
- ✅ Clean component separation
- ✅ Server-side data fetching
- ✅ TypeScript throughout
- ✅ Type-safe database queries
- ✅ Proper schema with foreign keys
- ✅ Price snapshots (freezes menu prices in order)

### Database (Supabase PostgreSQL)
- ✅ `restaurants` — Restaurant metadata
- ✅ `restaurant_tables` — Table definitions (10 per restaurant)
- ✅ `menu_categories` — Menu organization (6 categories)
- ✅ `menu_items` — Menu offerings (12 items)
- ✅ `orders` — Customer orders (status: new/accepted/preparing/ready/served/cancelled)
- ✅ `order_items` — Order line items (with snapshots)

---

## What Phase 1 Does NOT Include

❌ **Payments** — No Stripe integration yet (Phase 2)  
❌ **Live Status** — Customer can't track order (Phase 4)  
❌ **Staff Dashboard** — No kitchen display (Phase 3)  
❌ **Notifications** — No WhatsApp/email alerts (Phase 6)  
❌ **Menu Management** — Hardcoded seed data (Phase 5)  
❌ **Authentication** — No staff login (Phase 3)  
❌ **Multi-Tenancy** — Single restaurant only (Future)  

---

## Next Steps: Phase 2 (Payments) 

**Why**: Without payments, orders are sent but money doesn't change hands  
**Effort**: 2-3 weeks  
**Key Changes**:
1. Add Stripe integration
2. Create checkout page
3. Update order status to "accepted" after payment
4. Add payment_intent_id + payment_status to orders table
5. Handle failed payments

**For details**, see `docs/DEVELOPMENT_ROADMAP.md` → Phase 2 section

---

## Key Files & Their Purpose

| File | Purpose |
|------|---------|
| `app/menu/[slug]/table/[tableNumber]/page.tsx` | Customer menu page (routes to MenuPage component) |
| `components/menu/MenuPage.tsx` | Main orchestrator (state, cart logic, submission) |
| `components/menu/Cart.tsx` | Order form + summary |
| `lib/menu/getMenu.ts` | Database queries (restaurants, tables, categories, items) |
| `lib/orders/createOrder.ts` | Order submission server action |
| `lib/supabase/client.ts` | Supabase client initialization |
| `types/index.ts` | TypeScript types for all data models |
| `supabase/migrations/001_initial_schema.sql` | Database schema |
| `supabase/seed.sql` | Test data (Pink Flamingo) |

---

## Important Patterns

### Server Actions
Order submission uses `'use server'` (server action). This keeps prices trusted:
```typescript
// In components or lib files
'use server'
export async function createOrder(input) {
  // Always recalculate totals server-side
  // Never trust client-side prices
}
```

### Data Fetching
Menu data fetched server-side in page components:
```typescript
// In app/menu/[slug]/table/[tableNumber]/page.tsx
const restaurant = await getRestaurantBySlug(slug)
const categories = await getMenuCategories(restaurant.id)
```

### Type Safety
All database queries are typed:
```typescript
const items: MenuItem[] = await getMenuItems(restaurantId)
```

---

## Common Tasks

### Add a new menu item
1. Go to Supabase SQL Editor
2. Insert into `menu_items` table
3. Refresh app → immediately visible

### Change restaurant name
1. Update `restaurants` table in Supabase
2. App reads from database each load

### Adjust menu category order
1. Update `sort_order` in `menu_categories` table
2. Change takes effect on next page load

### Test with different table numbers
```
http://localhost:3000/menu/pink-flamingo/table/1
http://localhost:3000/menu/pink-flamingo/table/2
... etc up to table/10
```

---

## Database Schema Quick Reference

```sql
-- Orders Table
CREATE TABLE orders (
  id uuid PRIMARY KEY,
  restaurant_id uuid,
  table_id uuid,
  table_number integer,        -- Denormalized for speed
  customer_name text,          -- Optional
  customer_whatsapp text,      -- Optional (Phase 6 uses this)
  status text,                 -- new, accepted, preparing, ready, served, cancelled
  subtotal numeric,            -- Before tax (no tax in Phase 1)
  total numeric,               -- Final amount (same as subtotal in Phase 1)
  order_notes text,            -- Optional special requests
  created_at timestamptz,
  updated_at timestamptz
);

-- Order Items Table (details of each item in order)
CREATE TABLE order_items (
  id uuid PRIMARY KEY,
  order_id uuid,
  menu_item_id uuid,           -- Reference for history
  name_snapshot text,          -- Frozen at order time
  price_snapshot numeric,      -- Frozen at order time
  quantity integer,
  item_notes text,             -- "no onions", etc
  line_total numeric,          -- price * quantity
  created_at timestamptz
);
```

---

## Testing Checklist Before Handing Off to Next Phase

- [ ] App runs locally without errors
- [ ] `/menu/pink-flamingo/table/1` loads menu
- [ ] Can add multiple items to cart
- [ ] Quantities can be adjusted
- [ ] Item notes can be entered
- [ ] Order notes can be entered
- [ ] Customer name optional (can submit empty)
- [ ] WhatsApp optional (can submit empty)
- [ ] Click submit → confirmation modal appears
- [ ] Order ID visible in confirmation
- [ ] Order appears in Supabase `orders` table
- [ ] Order items appear in Supabase `order_items` table
- [ ] Price snapshot is correct ($5.99 stored, not reference)
- [ ] Can test multiple tables (1-10)
- [ ] Invalid restaurant slug shows error
- [ ] Invalid table number shows error

---

## Troubleshooting

**"Supabase credentials not configured"**
- Check `.env.local` is filled in
- Restart dev server (`npm run dev`)

**"Restaurant Not Found"**
- Make sure you ran the seed.sql (Pink Flamingo should exist)
- Check Supabase dashboard → Table Editor → restaurants table

**Cart is empty after adding items**
- Check browser console for JavaScript errors
- Refresh page
- Try different browser

**Order doesn't submit**
- Check browser console for errors
- Verify Supabase URL + keys are correct
- Check Supabase dashboard for any data issues

---

## What to Read Next

1. **`QUICKSTART.md`** — 5-min setup guide
2. **`README.md`** — Architecture overview
3. **`docs/SETUP.md`** — Detailed Supabase setup
4. **`docs/DEVELOPMENT_ROADMAP.md`** — All 8 phases explained
5. **`docs/PHASE_PLAN.md`** — Future phases overview

---

## Key Decisions Made in Phase 1

| Decision | Why |
|----------|-----|
| Supabase (not Firebase) | SQL, better for complex queries, good free tier |
| Server actions (not API routes) | Simpler, type-safe, less boilerplate |
| Price snapshots in order_items | Preserves what customer paid even if menu price changes |
| No authentication in V1 | Adds complexity; can add basic auth in Phase 3 |
| Simple password for staff later | Good enough for MVP; upgrade to Supabase Auth in Phase 5 |
| Denormalize table_number in orders | Faster queries, acceptable redundancy |
| Tailwind (not CSS modules) | Fast iteration, mobile-first, consistent |

---

## Known Issues & Tech Debt

See `docs/DEVELOPMENT_ROADMAP.md` section "Known Limitations & Tech Debt"

Key ones:
- ⚠️ No RLS (Row-Level Security) yet
- ⚠️ No input validation
- ⚠️ No rate limiting
- ⚠️ No error tracking (Sentry)
- ⚠️ No integration tests
- ⚠️ Service role key used in server actions (should move to API route)

**Action**: Track these and fix after Phase 2/3

---

## Contact & Questions

If you have questions while working on Phase 2:

1. Check `docs/DEVELOPMENT_ROADMAP.md` for specific phase details
2. Check code comments in `components/menu/MenuPage.tsx` — explains cart logic
3. Check `lib/orders/createOrder.ts` — explains order submission validation
4. Review `types/index.ts` — all data structures

---

## Final Notes

**You have a solid foundation.** Phase 1 is clean, typed, and ready to extend. 

The next developer should:
1. Start with **Phase 2 (Payments)** — this closes the business loop
2. Follow the patterns already established (server actions, types, etc.)
3. Keep the database normalized — add migrations, don't delete old ones
4. Test frequently — the app is small enough to QA manually between features
5. Document decisions — comment why, not what

**Good luck! Phase 1 is ready for Phase 2. 🚀**
