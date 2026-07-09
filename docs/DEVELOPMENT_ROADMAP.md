# PRESTO Development Roadmap & Next Steps

## Current State: Phase 1 ✅ COMPLETE

**Live at**: `http://localhost:3000/menu/pink-flamingo/table/[1-10]`

**What works**:
- QR menu flow (customer-facing)
- Digital menu with 6 categories, 12 items
- Shopping cart with quantity, notes, pricing
- Order submission to Supabase
- Confirmation modal with exact spec message
- Full order persistence (orders + order_items with snapshots)

**Tech Stack**: Next.js 15, React, TypeScript, Tailwind, Supabase

---

## Recommended Development Path

### Phase 2: Payment Processing (Next Priority)
**Goal**: Add payment capability to close the ordering loop  
**Estimated Effort**: 2-3 weeks  
**Blockers**: None

#### What to build:
1. **Stripe Integration**
   - Add Stripe client + server keys to `.env.local`
   - Create `/app/menu/[slug]/table/[tableNumber]/checkout` page
   - Build `CheckoutForm` component with Stripe Elements
   - Handle payment confirmation → update order status to "accepted"

2. **Order Status Updates** (minimal)
   - Update `orders.status` from "new" → "accepted" after payment
   - (Full live status comes in Phase 4)

3. **Database Changes**
   - Add `payment_method` field to `orders` table
   - Add `payment_intent_id` (Stripe ID) to track transactions
   - Add `payment_status` enum: pending, succeeded, failed

4. **Components to Create**
   - `CheckoutForm.tsx` — Stripe payment form
   - `PaymentConfirmation.tsx` — Post-payment screen
   - `PaymentError.tsx` — Error handling

5. **Server Actions**
   - `processPayment.ts` — Call Stripe API server-side
   - Update `createOrder.ts` to require payment success first

#### Testing Checklist
- [ ] Stripe test mode works locally
- [ ] Payment succeeds → order status changes to "accepted"
- [ ] Payment fails → user sees error, can retry
- [ ] Order appears in Supabase with payment_intent_id
- [ ] No charges in test mode

#### Tech Notes
- Use Stripe's `@stripe/react-stripe-js` library
- Keep PCI compliance by using Stripe Elements (not raw card input)
- Store only Stripe intent ID, not card details
- Use webhooks for production payment confirmation

---

### Phase 3: Kitchen Display System (KDS)
**Goal**: Staff can see and manage orders  
**Estimated Effort**: 3-4 weeks  
**Dependencies**: Phase 2 (need "accepted" status)

#### What to build:
1. **Staff Dashboard Route**
   - `/dashboard/restaurant/[slug]/orders` — protected route
   - Requires staff authentication (not in V1, add simple password for now)

2. **Order Board UI**
   - Display orders in kanban: New → Preparing → Ready → Served
   - Color-code by priority/time
   - Show order details: items, notes, table number, customer name
   - Click to expand order full details

3. **Order Status Updates**
   - Staff clicks "Start Preparing" → status becomes "preparing"
   - Staff clicks "Ready for Pickup" → status becomes "ready"
   - Staff clicks "Served" → status becomes "served"
   - Real-time updates (use Supabase realtime subscriptions)

4. **Components to Create**
   - `OrderBoard.tsx` — Main kanban view
   - `OrderCard.tsx` — Individual order in kanban
   - `OrderDetails.tsx` — Full order modal
   - `StaffLogin.tsx` — Simple auth for now
   - `StatusButton.tsx` — Update order status

5. **Database Changes**
   - Add `is_staff` flag to simple auth (username/password in .env for now)
   - No new tables, just use existing `orders` table

#### Testing Checklist
- [ ] Staff can log in
- [ ] Can see all "new" orders on board
- [ ] Can move order through statuses
- [ ] Multiple browsers see updates in real-time
- [ ] Correct items show in each order

---

### Phase 4: Customer Live Order Status
**Goal**: Customer can track their order  
**Estimated Effort**: 1-2 weeks  
**Dependencies**: Phase 3 (status updates from kitchen)

#### What to build:
1. **Order Status Page**
   - `/order/[orderId]/status` — public, no auth
   - Show current status with timeline (new → preparing → ready → served)
   - Auto-refresh every 2 seconds
   - Show estimated time to ready

2. **Status Timeline Component**
   - Visual timeline showing completed + pending steps
   - Green checkmarks for completed, gray for pending
   - Show timestamp when status changed

3. **Components to Create**
   - `OrderStatus.tsx` — Main page
   - `StatusTimeline.tsx` — Visual timeline
   - `EstimatedTime.tsx` — Show time estimate

4. **No Database Changes Needed**
   - Use existing `orders` table
   - Just add `updated_at` field (already have it)

#### Testing Checklist
- [ ] Can view order by ID without login
- [ ] Status updates when staff updates order
- [ ] Page shows latest status immediately
- [ ] Timeline progresses correctly
- [ ] Works on mobile

---

### Phase 5: Staff Management Dashboard
**Goal**: Manager can manage restaurant settings  
**Estimated Effort**: 2-3 weeks  
**Dependencies**: Phase 3 (staff auth)

#### What to build:
1. **Manager Routes**
   - `/dashboard/restaurant/[slug]/settings` — Restaurant settings
   - `/dashboard/restaurant/[slug]/menu` — Manage menu items
   - `/dashboard/restaurant/[slug]/staff` — Manage staff users
   - `/dashboard/restaurant/[slug]/analytics` — Basic analytics

2. **Features**
   - Create/edit/delete menu items
   - Toggle item availability
   - Add new menu categories
   - Create staff accounts with permissions
   - View order history + revenue

3. **Components to Create**
   - `MenuManager.tsx` — CRUD for menu
   - `StaffManager.tsx` — CRUD for staff
   - `AnalyticsDashboard.tsx` — Charts + stats
   - `RestaurantSettings.tsx` — Update restaurant info

4. **Database Changes**
   - Add `staff_users` table (username, password_hash, role, restaurant_id)
   - Add `staff_role` enum: manager, kitchen, server
   - Add RLS policies (Row-Level Security)

#### Testing Checklist
- [ ] Manager can log in
- [ ] Can add/edit menu items
- [ ] Changes appear in customer menu immediately
- [ ] Can create staff accounts
- [ ] Analytics show correct order totals

---

### Phase 6: Notifications & Alerts
**Goal**: Automated communication via WhatsApp + Email  
**Estimated Effort**: 2-3 weeks  
**Dependencies**: Phase 2 (need customer WhatsApp/email)

#### What to build:
1. **WhatsApp Integration (Twilio)**
   - Send order confirmation to customer WhatsApp
   - Send status updates as order progresses
   - Send "ready for pickup" alert

2. **Email Integration (SendGrid)**
   - Send order receipt
   - Send order status updates
   - Send restaurant alerts (low stock, etc.)

3. **Server Actions**
   - `sendWhatsAppMessage.ts` — Twilio API
   - `sendEmail.ts` — SendGrid API
   - Trigger on order creation + status changes

4. **No UI Changes**
   - Just add messaging templates

#### Testing Checklist
- [ ] Test WhatsApp sends to your number
- [ ] Test emails send
- [ ] Messages have correct order details
- [ ] Timing is right (send on status change, not constantly)
- [ ] No duplicate messages

---

### Phase 7: Analytics & Reporting
**Goal**: Insights into orders, revenue, popular items  
**Estimated Effort**: 1-2 weeks  
**Dependencies**: None

#### What to build:
1. **Analytics Dashboard**
   - `/dashboard/restaurant/[slug]/analytics`
   - Revenue by day/week/month
   - Top 10 items ordered
   - Average order value
   - Order volume timeline
   - Customer repeat rate

2. **Components to Create**
   - `RevenuChart.tsx` — Line chart over time
   - `PopularItems.tsx` — Bar chart of items
   - `OrderMetrics.tsx` — KPI cards
   - `DateRangePicker.tsx` — Filter by date

3. **No Database Changes**
   - Just aggregate existing `orders` + `order_items` data

#### Testing Checklist
- [ ] Charts render with correct data
- [ ] Date filters work
- [ ] Numbers match manual count
- [ ] Mobile responsive

---

### Phase 8: AI Operations Agent (Stretch)
**Goal**: Automation with Claude API  
**Estimated Effort**: 3-4 weeks  
**Dependencies**: Phase 6 (need notifications), Phase 7 (need data)

#### What to build:
1. **Claude Integration**
   - Use Anthropic Claude API to analyze orders
   - Generate recommendations (popular items, slow times, etc.)
   - Auto-draft messages to customers
   - Predict inventory needs

2. **Server Actions**
   - `analyzeOrders.ts` — Ask Claude to analyze order patterns
   - `generateInsights.ts` — Get business insights
   - `suggestMessages.ts` — AI-draft customer communications

3. **Dashboard Updates**
   - Add "AI Insights" section to analytics
   - Show recommendations
   - Allow staff to accept/modify AI-drafted messages

#### Testing Checklist
- [ ] Claude API calls work
- [ ] Insights are reasonable (not hallucinated)
- [ ] Messages are professional
- [ ] Token usage is reasonable (cost-effective)

---

## Critical Path (Do These First)

**Order of Priority**:
1. **Phase 2 (Payments)** ← Closes the customer loop
2. **Phase 3 (Kitchen Display)** ← Makes restaurant operations possible
3. **Phase 4 (Customer Status)** ← Improves UX significantly
4. **Phase 5 (Menu Management)** ← Removes hard-coded data
5. **Phase 6 (Notifications)** ← Quality-of-life
6. **Phase 7 (Analytics)** ← Business insights
7. **Phase 8 (AI Agent)** ← Nice-to-have automation

---

## Known Limitations & Tech Debt (Track These)

### Security (Phase 2+)
- [ ] No authentication yet (use basic password for staff)
- [ ] No RLS (Row-Level Security) on database
- [ ] Service role key exposed in server actions (move to API route)
- [ ] No rate limiting on API endpoints
- [ ] No input validation/sanitization

**Action**: After Phase 2, add proper auth (Supabase Auth or Auth0)

### Performance (Phase 5+)
- [ ] Menu items fetched on every page load (add caching)
- [ ] No image optimization (menu items will need photos)
- [ ] No database query optimization (add indexes as needed)
- [ ] No background jobs (order processing is synchronous)

**Action**: Add Redis caching for menu, implement background job queue

### Architecture (Phase 5+)
- [ ] Single restaurant hardcoded (Pink Flamingo)
- [ ] No multi-tenancy yet
- [ ] All staff in one table (no role-based access control)
- [ ] Webhooks not set up (Stripe will need them in production)

**Action**: Refactor for multi-tenancy after Phase 5

### Testing
- [ ] No unit tests yet
- [ ] No E2E tests
- [ ] Manual testing only

**Action**: Add Jest + Playwright after Phase 3

---

## Deployment Checklist

### Before Going to Production

**Database**:
- [ ] Enable RLS on all tables
- [ ] Set up automated backups
- [ ] Run VACUUM + ANALYZE
- [ ] Test data retention policy

**Secrets**:
- [ ] Rotate all API keys
- [ ] Use environment variables only (never hardcode)
- [ ] Enable encryption at rest in Supabase

**Monitoring**:
- [ ] Set up error tracking (Sentry)
- [ ] Set up logging
- [ ] Set up uptime monitoring
- [ ] Create runbook for common issues

**Performance**:
- [ ] Test with production data volume
- [ ] Load test (simulate 100+ concurrent orders)
- [ ] Measure page load time
- [ ] Optimize images + assets

**Testing**:
- [ ] Manual QA full flow
- [ ] Test on actual devices (not just browser)
- [ ] Test on slow networks (3G)
- [ ] Test on old browsers (Safari iOS, etc.)

---

## File Structure Reminders

```
presto/
├── app/
│   ├── menu/[slug]/table/[tableNumber]/    ← Customer menu (DONE)
│   ├── dashboard/restaurant/[slug]/        ← Staff dashboard (Phase 3+)
│   ├── order/[orderId]/status/             ← Customer status (Phase 4)
│
├── components/
│   ├── menu/                               ← Menu UI (DONE)
│   ├── checkout/                           ← Payment (Phase 2)
│   ├── kitchen/                            ← KDS UI (Phase 3)
│   ├── dashboard/                          ← Staff dashboard (Phase 5+)
│
├── lib/
│   ├── menu/getMenu.ts                     ← Menu queries (DONE)
│   ├── orders/createOrder.ts               ← Order creation (DONE)
│   ├── payment/stripe.ts                   ← Payment logic (Phase 2)
│   ├── notifications/twilio.ts             ← WhatsApp (Phase 6)
│   ├── analytics/queries.ts                ← Analytics (Phase 7)
│
├── types/
│   └── index.ts                            ← All TypeScript defs
│
├── supabase/
│   ├── migrations/                         ← Schema changes
│   └── seed.sql                            ← Test data
```

---

## Questions for Codex

Before starting Phase 2, clarify:

1. **Stripe Integration**
   - Should we use Stripe hosted checkout or embedded form?
   - Should we support multiple currencies or just USD?
   - Should we handle failed payments with retry logic?

2. **Authentication**
   - Use Supabase Auth or Auth0?
   - Should staff require email verification?
   - How many staff accounts per restaurant?

3. **Multi-Tenancy**
   - Should this support multiple restaurants (one Pink Flamingo or many)?
   - How will restaurants be created/onboarded?
   - Should they share database or separate Supabase projects?

4. **Deployment**
   - Deploy on Vercel (Node.js) or serverless?
   - Need staging environment?
   - CI/CD pipeline requirements?

5. **Customer Data**
   - Should customer names/WhatsApp be stored across orders?
   - How long to retain order history?
   - Need customer login?

---

## Handoff Notes

- **All Phase 1 tests pass** — full flow works end-to-end
- **Architecture is clean** — ready to extend
- **Database is normalized** — proper foreign keys + constraints
- **Error handling is basic** — will need expansion
- **No authentication yet** — use simple passwords initially, upgrade to proper auth in Phase 2
- **Config is environment-based** — easy to add new secrets

**Next Developer**: You have a solid foundation. Start with Phase 2 (Payments). Once that's working, Phase 3 (Kitchen Display) becomes much more valuable. Prioritize customer-facing features before internal tools.

Good luck! 🚀
