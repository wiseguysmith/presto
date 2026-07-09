# PRESTO Phase 1 - QR Ordering System

PRESTO is a QR-based restaurant ordering system. This is Phase 1, which implements the core flow: QR menu → cart → order submission → database persistence → confirmation.

## What's Built in Phase 1

✅ **Customer QR Menu Flow**
- Scan QR code (or navigate to) `/menu/[restaurantSlug]/table/[tableNumber]`
- View digital menu with categories
- Add items to cart
- Adjust quantities and add item notes
- See order summary with pricing
- Optional: enter name and WhatsApp
- Optional: add order-level notes
- Submit order to restaurant

✅ **Database Persistence**
- Orders saved to Supabase with full details
- Order items stored with price snapshots
- Menu data pulled from database

✅ **Confirmation**
- Exact message: "Thank you. Your order has been sent to the restaurant. Please stay at your table. A staff member will assist you shortly."

## What's NOT in Phase 1

The following are intentionally deferred:

- **Payments**: No payment processing yet
- **Live Order Status**: No customer-facing order tracking
- **Staff Dashboard**: No order management interface
- **Kitchen Display**: No kitchen screen
- **WhatsApp Alerts**: No automated customer notifications
- **Email Alerts**: No email receipts
- **Printer Integration**: No receipt printing
- **POS Integration**: No POS system sync
- **Menu Management Dashboard**: No admin interface (yet)
- **AI Operations**: No automation layer (yet)

See `docs/PHASE_PLAN.md` for future phases.

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Client Library**: @supabase/supabase-js
- **Icons**: lucide-react

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

Create a Supabase project at https://supabase.com:

1. Create a new project
2. Note the project URL and anon key
3. Go to SQL Editor and run the migration:
   - Copy contents of `supabase/migrations/001_initial_schema.sql`
   - Paste into SQL Editor and execute
4. Run the seed data:
   - Copy contents of `supabase/seed.sql`
   - Paste into SQL Editor and execute

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Testing the QR Menu Flow

Navigate to:
```
http://localhost:3000/menu/pink-flamingo/table/1
```

Replace `1` with any table number between 1-10.

### Test Checklist

- [ ] Menu loads for table 1-10
- [ ] Categories display
- [ ] Menu items appear with prices
- [ ] Add items to cart
- [ ] Adjust quantities
- [ ] Add item notes
- [ ] Add order notes
- [ ] Enter optional name/WhatsApp
- [ ] Submit order
- [ ] Confirmation message displays
- [ ] Order appears in Supabase `orders` table
- [ ] Order items appear in `order_items` table
- [ ] Refresh page doesn't lose submitted orders (they're in DB)

## Project Structure

```
app/
  menu/
    [restaurantSlug]/
      table/
        [tableNumber]/
          page.tsx          # Main menu page route

components/
  menu/
    CategoryTabs.tsx        # Category navigation
    MenuItemCard.tsx        # Individual menu item
    Cart.tsx                # Cart sidebar
    MenuPage.tsx            # Main component orchestrating the flow
    OrderConfirmation.tsx   # Confirmation modal

lib/
  supabase/
    client.ts               # Client-side Supabase instance
    server.ts               # Server-side Supabase instance
  menu/
    getMenu.ts              # Data fetching functions
  orders/
    createOrder.ts          # Order submission logic

types/
  index.ts                  # TypeScript type definitions

supabase/
  migrations/
    001_initial_schema.sql  # Database schema
  seed.sql                  # Sample data
```

## Restaurant Data

**Phase 1 Configuration:**
- Restaurant: **Pink Flamingo** (`pink-flamingo` slug)
- Dining: Dine-in only
- Tables: 10 (numbered 1–10)
- Categories: Starters, Bowls, Tacos, Seafood, Smoothies, Coffee
- Items: 12 (2 per category with tropical/beach theme)

## Menu Items

### Starters
- Guacamole & Plantain Chips — $12.99
- Tuna Tostadas — $14.99

### Bowls
- Tropical Chicken Bowl — $15.99
- Vegan Casado Bowl — $13.99

### Tacos
- Baja Fish Tacos — $16.99
- Chicken Tinga Tacos — $14.99

### Seafood
- Garlic Shrimp Plate — $18.99
- Grilled Mahi Mahi — $19.99

### Smoothies
- Mango Passion Smoothie — $7.99
- Green Detox Smoothie — $8.99

### Coffee
- Iced Costa Rican Coffee — $5.99
- Coconut Cold Brew — $6.99

## Order Schema

**Orders table** (`orders`):
- Order ID, restaurant, table, customer name (optional), WhatsApp (optional)
- Status: `new`, `accepted`, `preparing`, `ready`, `served`, `cancelled`
- Subtotal, total, order notes
- Timestamps

**Order Items table** (`order_items`):
- Item snapshot (name, price at time of order)
- Quantity, item notes
- Line total

Order items use **snapshots** so the order is frozen even if menu prices change later.

## Security Notes for Phase 1

- ✅ Using Supabase **anon key** on the client (public data only)
- ✅ Server-side order creation calculates totals (trusts no client-side pricing)
- ⚠️ RLS (Row-Level Security) not yet implemented—all restaurants/tables visible
- ⚠️ Service role key should only be used server-side

Future phases will add RLS policies for multi-tenant isolation.

## Static Prototype Reference

The original static prototype is preserved in `/prototype/` for visual and interaction reference during development.

## Developing Locally with Supabase

If you prefer a local Supabase instance, install the Supabase CLI and run:

```bash
supabase start
```

Then update your environment variables to point to `http://localhost:54321`.

## Next Steps (Future Phases)

- **Phase 2**: Payments (Stripe integration)
- **Phase 3**: Kitchen Display System (KDS)
- **Phase 4**: Live order status for customers
- **Phase 5**: Staff dashboard and order management
- **Phase 6**: WhatsApp + Email alerts
- **Phase 7**: AI operations automation

See `docs/PHASE_PLAN.md` for detailed roadmap.

## Support

For issues or questions:
1. Check the test checklist above
2. Verify Supabase credentials in `.env.local`
3. Check browser console for errors
4. Review Supabase dashboard for data

---

**Built with ❤️ for restaurants everywhere.**
