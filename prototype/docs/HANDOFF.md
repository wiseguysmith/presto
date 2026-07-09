# PRESTO Developer Handoff

This document is for the next designer, engineer, or product partner picking up PRESTO after the first prototype pass.

## Current State

PRESTO is currently a static, dependency-free prototype built with HTML, CSS, and JavaScript. It demonstrates the product vision from the PRD without requiring a framework install.

Implemented prototype areas:

- Guest QR ordering flow for Table 12
- Menu browsing, category filtering, search, cart, notes, taxes, and submit order
- Live order status simulation
- Post-meal rating flow with positive Google Review routing and private recovery for lower ratings
- Staff order kanban with draggable order cards
- Kitchen display view with large readable order cards
- Menu management view with availability toggling
- Table QR code management mockup
- Reviews dashboard
- Analytics dashboard with top sellers, peak times, and an AI operations brief

Important files:

- `index.html`: Page structure and app sections
- `styles.css`: Responsive visual system and layout
- `app.js`: Mock data, state, rendering, and interactions
- `assets/presto-hero.png`: Generated hero image used on the first viewport

## How To Run

The prototype can be opened directly:

```text
index.html
```

For a local server:

```bash
python -m http.server 4173 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:4173/index.html
```

## Product Direction

PRESTO should evolve from a convincing prototype into a restaurant operating system that starts with QR ordering and expands into staff workflows, guest engagement, analytics, AI assistance, and multi-location operations.

The key product promise is not "customers can order from a QR code." The promise is that every table becomes a live digital touchpoint that helps the restaurant increase speed, capture customer intent, recover poor experiences, and make better operational decisions.

## Recommended Next Development Phases

### Phase 1: Production App Foundation

Move the prototype into the target stack:

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Supabase
- Drizzle ORM

Recommended routes:

- `/restaurant/[restaurantSlug]/table/[tableNumber]` for the guest QR flow
- `/dashboard` for manager/staff overview
- `/dashboard/orders`
- `/dashboard/kitchen`
- `/dashboard/menu`
- `/dashboard/tables`
- `/dashboard/reviews`
- `/dashboard/analytics`
- `/dashboard/settings`

Keep the current prototype as visual and interaction reference while rebuilding with components.

### Phase 2: Data Model And Supabase

Create real database tables based on the PRD:

- restaurants
- restaurant_tables
- categories
- menu_items
- orders
- order_items
- reviews
- staff_users or profiles

Add row-level security early. PRESTO is multi-tenant by design, so every manager/staff query must be scoped to the restaurant or organization the user belongs to.

Initial relationships:

- restaurant has many tables
- restaurant has many categories
- category has many menu items
- table has many orders
- order has many order items
- order has one optional review

### Phase 3: Guest Ordering MVP

Build the actual customer flow first because it is the highest-value demo and user-testing surface.

Required:

- Resolve restaurant and table from QR route
- Load restaurant branding and active menu
- Support category filter and search
- Add item modifiers and item-level notes
- Support cart notes, allergies, and special requests
- Submit order to Supabase
- Show confirmation number and estimated preparation time
- Subscribe to realtime order status updates
- Collect post-meal rating
- Route 4-5 star feedback to Google Review
- Capture 1-3 star feedback privately

Future payment support should be planned, but the first real MVP can still use "pay at table" or "server closes check" depending on restaurant workflow.

### Phase 4: Staff And Kitchen Workflows

Build staff tools around real-time order operations.

Required:

- Authenticated staff dashboard
- Order kanban grouped by status
- Kitchen display mode optimized for tablets or wall-mounted screens
- Update order status in realtime
- Show allergies and notes prominently
- Track time in status
- Mark orders ready and completed

Recommended:

- Sound or visual alert for new orders
- Fire time warnings
- Order history
- Staff role permissions: staff, kitchen, manager

### Phase 5: Manager Tools

Add the core restaurant admin workflows.

Required:

- Menu item CRUD
- Category CRUD and sorting
- Availability toggle
- Table management
- QR code generation and download
- Reviews dashboard
- Basic analytics
- Restaurant settings

Recommended:

- Image uploads through Supabase Storage
- Archive instead of hard delete for menu items
- Bulk availability updates for rush periods or sold-out items

### Phase 6: Analytics And AI Layer

Once orders and reviews are real, PRESTO can become much more valuable.

Analytics:

- Orders today
- Revenue today
- Average ticket
- Top selling items
- Peak ordering windows
- Review conversion
- Private recovery rate
- Customer satisfaction

AI opportunities:

- Menu upsell suggestions
- Kitchen demand forecasting
- Review summarization
- Manager daily brief
- Service issue detection from notes and feedback
- Smart prep recommendations

## UX Priorities

Guest experience:

- Mobile-first
- Minimal taps
- Large touch targets
- Clear cart state
- Obvious status updates
- No account required

Staff experience:

- Dense but readable
- Fast scanning
- Strong status colors
- Allergies and notes impossible to miss
- Works during a rush
- Avoid decorative UI that slows task completion

Manager experience:

- Calm operational dashboard
- Clear metrics
- Easy menu edits
- Confidence that QR codes and orders are tied to the correct table

## Technical Notes

Current prototype state is held in memory in `app.js`. When moving to a real app, separate the logic into:

- typed data models
- API or server actions
- React components
- Supabase query hooks
- realtime subscriptions
- reusable formatting utilities

Suggested component groups:

- `components/guest`
- `components/dashboard`
- `components/kitchen`
- `components/menu`
- `components/tables`
- `components/reviews`
- `components/analytics`
- `lib/supabase`
- `lib/db`
- `lib/mock-data`

## Immediate Next Tasks

1. Create a real Next.js app scaffold.
2. Port the current visual language into Tailwind tokens.
3. Convert the guest flow into React components.
4. Add Supabase schema and seed data.
5. Connect menu browsing and order submission to Supabase.
6. Add realtime order updates.
7. Build staff auth and dashboard routing.
8. Replace mock QR visuals with generated QR codes.
9. Add accessibility QA and mobile device testing.
10. Deploy the first MVP preview to Vercel.

## Open Product Questions

- Should PRESTO support payment in the first real MVP, or only order submission?
- Should restaurants use table-level QR codes only, or also room, patio, bar, and takeout QR codes?
- What is the first target restaurant type: full-service, fast casual, food trucks, bars, or hotels?
- Does the staff dashboard need POS integration in version one?
- Which Google Review handoff URL format should be used per restaurant?
- Should guests receive SMS order updates, or should status live only on the web page?

## Definition Of Done For The Next MVP

The next development milestone is ready for restaurant-owner testing when:

- A real restaurant can be created in the database.
- Tables can be generated with unique QR URLs.
- A guest can scan a table QR code, order, and see live status.
- Staff can receive and advance orders in realtime.
- A manager can edit menu availability.
- Reviews are captured and routed correctly.
- The app is deployed behind a stable preview URL.
- Mobile QA passes on iPhone and Android viewport sizes.
