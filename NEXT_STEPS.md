# PRESTO: Next Steps in Development Order

## 🎯 The Critical Path (Do These in Order)

### **Phase 2: Payment Processing** (Weeks 1-3)
*Why first: Closes the business loop — customers can actually pay*

**What to build**:
1. Stripe integration (test mode locally)
2. Checkout form on order page
3. Payment → update order status to "accepted"
4. Add to database: `payment_intent_id`, `payment_status` fields

**Key files to create**:
- `/app/menu/[slug]/table/[tableNumber]/checkout` — Checkout page
- `components/checkout/StripeForm.tsx` — Stripe payment form
- `lib/payment/stripe.ts` — Stripe server actions
- `lib/orders/processPayment.ts` — Process payment + update order

**Database change**:
```sql
ALTER TABLE orders ADD COLUMN payment_intent_id text;
ALTER TABLE orders ADD COLUMN payment_status text DEFAULT 'pending';
```

**Done when**: Customer can submit payment, see success, order status changes to "accepted"

---

### **Phase 3: Kitchen Display System (KDS)** (Weeks 4-7)
*Why next: Restaurant staff can actually see orders to fulfill them*

**What to build**:
1. Staff dashboard at `/dashboard/restaurant/[slug]/orders`
2. Kanban board: New → Preparing → Ready → Served
3. Staff can click to move orders between statuses
4. Real-time updates (Supabase realtime)

**Key files to create**:
- `/app/dashboard/restaurant/[slug]/orders` — Order board page
- `components/kitchen/OrderBoard.tsx` — Kanban board
- `components/kitchen/OrderCard.tsx` — Individual order
- `lib/orders/updateOrderStatus.ts` — Status change action

**Simple auth for now**:
- Add username/password in `.env.local`
- Check against `.env` in `/app/dashboard` middleware
- (Upgrade to real auth in Phase 5)

**Database change**:
- None needed (use existing `orders.status` field)

**Done when**: Staff can log in, see orders, move them through statuses, customers see live updates

---

### **Phase 4: Customer Order Status Page** (Weeks 8-9)
*Why next: Customers can track their order in real-time*

**What to build**:
1. Public page at `/order/[orderId]/status` (no login)
2. Show order status with timeline
3. Auto-refresh every 2 seconds
4. Show estimated time to ready

**Key files to create**:
- `/app/order/[orderId]/status` — Status page
- `components/order/OrderStatus.tsx` — Display current status
- `components/order/StatusTimeline.tsx` — Visual timeline

**Database change**: None

**Done when**: Customer can view their order status without logging in; updates appear as kitchen staff progresses order

---

### **Phase 5: Staff Management Dashboard** (Weeks 10-12)
*Why next: Restaurant manager can manage menu + staff without code*

**What to build**:
1. Menu manager: add/edit/delete items, toggle availability
2. Staff manager: create staff accounts with roles
3. Restaurant settings: change name, description
4. Basic analytics: revenue, popular items

**Key files to create**:
- `/app/dashboard/restaurant/[slug]/menu` — Menu CRUD
- `/app/dashboard/restaurant/[slug]/staff` — Staff management
- `/app/dashboard/restaurant/[slug]/settings` — Restaurant info
- `/app/dashboard/restaurant/[slug]/analytics` — Simple charts

**Database changes**:
```sql
CREATE TABLE staff_users (
  id uuid PRIMARY KEY,
  restaurant_id uuid,
  username text UNIQUE,
  password_hash text,
  role text, -- 'manager', 'kitchen', 'server'
  created_at timestamptz
);
```

**Upgrade auth**: Switch to Supabase Auth (built-in) or Auth0

**Done when**: Manager can log in, manage menu/staff, see basic analytics; no longer hardcoded to Pink Flamingo

---

### **Phase 6: Notifications** (Weeks 13-14)
*Why next: Customers stay informed via WhatsApp + email*

**What to build**:
1. Twilio integration for WhatsApp messages
2. SendGrid integration for emails
3. Send confirmation when order placed
4. Send updates when status changes

**Key files to create**:
- `lib/notifications/twilio.ts` — WhatsApp messaging
- `lib/notifications/sendgrid.ts` — Email messaging
- Triggers in `lib/orders/createOrder.ts` and status update actions

**Database change**: None (use existing customer_whatsapp field)

**Done when**: Customer receives WhatsApp when order placed, when it's ready, when served

---

### **Phase 7: Analytics** (Weeks 15-16)
*Why next: Business insights for managers*

**What to build**:
1. Revenue charts (daily/weekly/monthly)
2. Top 10 items ordered
3. Average order value
4. Order timeline

**Key files to create**:
- `/app/dashboard/restaurant/[slug]/analytics` — Analytics page
- `components/analytics/RevenueChart.tsx`
- `components/analytics/PopularItems.tsx`
- `lib/analytics/queries.ts` — Analytics queries

**Database change**: None

**Done when**: Manager can see revenue trends, popular items, peak hours

---

### **Phase 8: AI Agent** (Optional)
*Why later: Nice-to-have automation*

**What to build**:
1. Use Claude API to analyze order patterns
2. Generate insights ("busiest day is Friday 6pm")
3. AI-draft customer messages
4. Inventory predictions

**Technical**: Add `lib/ai/claude.ts` with API calls

**Done when**: Manager sees AI-generated insights and can use them

---

## 📊 Effort Estimates

| Phase | Effort | Cumulative | Business Value |
|-------|--------|-----------|---|
| 1 (Done) | 4 weeks | 4 weeks | ⭐ MVP: Orders to DB |
| 2 | 2-3 weeks | 6-7 weeks | ⭐⭐⭐ **Critical: Accept Payment** |
| 3 | 3-4 weeks | 9-11 weeks | ⭐⭐⭐ **Critical: Staff Operations** |
| 4 | 1-2 weeks | 10-13 weeks | ⭐⭐ Customer tracking |
| 5 | 2-3 weeks | 12-16 weeks | ⭐⭐⭐ Menu management |
| 6 | 2-3 weeks | 14-19 weeks | ⭐⭐ Customer engagement |
| 7 | 1-2 weeks | 15-21 weeks | ⭐⭐ Business insights |
| 8 | 3-4 weeks | 18-25 weeks | ⭐ Automation |

---

## 🚀 Quick Reference: What Each Phase Adds

```
Phase 1 (DONE):  Customer QR → Menu → Cart → Order → DB ✅
Phase 2:         + Accept Payment (💰 revenue!)
Phase 3:         + Staff see orders + fulfill them (🧑‍🍳 operations!)
Phase 4:         + Customer tracks order (📍 transparency!)
Phase 5:         + Manager dashboard (no coding needed)
Phase 6:         + WhatsApp/email alerts (👋 engagement!)
Phase 7:         + Analytics (📊 insights!)
Phase 8:         + AI automation (🤖 nice-to-have)
```

---

## 🔥 Why This Order?

1. **Phase 2 first** — No money without it. Business can't operate.
2. **Phase 3 second** — Staff can't fulfill orders without seeing them. KDS is critical infrastructure.
3. **Phase 4 third** — Improves customer UX significantly (they see when food is ready).
4. **Phase 5 fourth** — Remove hardcoded data. Unlocks multi-restaurant potential.
5. **Phase 6 fifth** — Quality-of-life. Customers know when food is coming.
6. **Phase 7 sixth** — Business insights. Manager can make data-driven decisions.
7. **Phase 8 last** — Automation. Nice feature but lower ROI.

---

## 📋 Before Starting Phase 2

**Clarify with stakeholders**:
1. Stripe or other payment processor?
2. Single currency (USD) or multiple?
3. How many restaurants eventually? (affects database design)
4. What's the revenue target? (affects feature priority)

**Code prep**:
1. Add tests (Jest + Playwright) so Phase 2+ doesn't break Phase 1
2. Extract common patterns (to avoid duplication in Phase 3)
3. Document the database schema with comments

**Infrastructure prep**:
1. Set up error tracking (Sentry)
2. Set up logging
3. Set up CI/CD (GitHub Actions)
4. Plan staging environment

---

## 💾 Database Migrations Path

Each phase adds columns/tables:

**Phase 2**:
```sql
ALTER TABLE orders ADD COLUMN payment_intent_id text;
ALTER TABLE orders ADD COLUMN payment_status text;
```

**Phase 3**: (no schema changes)

**Phase 4**: (no schema changes)

**Phase 5**:
```sql
CREATE TABLE staff_users (...);
ALTER TABLE restaurants ADD COLUMN is_active boolean;
```

**Phase 6**: (no schema changes, use existing customer_whatsapp)

**Phase 7**: (no schema changes, just queries)

**Phase 8**: (no schema changes)

---

## 🧠 Remember

- **Phase 1 is done.** You have a working, type-safe, clean codebase.
- **Phase 2 is critical.** Start here to unlock revenue.
- **Each phase builds on previous.** Don't skip ahead.
- **Test between phases.** Don't accumulate bugs.
- **Document decisions.** Future devs will thank you.

---

**Next developer: You're taking over Phase 2. Good luck! 🚀**
