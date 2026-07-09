# PRESTO Pink Flamingo Upgrade List

This is the punch list to make PRESTO credible before showing it to Pink Flamingo, then usable for a controlled live pilot.

Working controlled demo domain: `pinkflamingointama.mindfultech.services`

## Priority 1 - Fix The First Impression

### 1. Replace the dead homepage

Current issue: the root website opens to a plain title card that says "PRESTO", "QR-Based Restaurant Ordering", and "Scan the QR code at your table to begin ordering." It feels unfinished and gives the wrong signal immediately.

Upgrade:
- Make `/` a polished demo entry screen.
- Show Pink Flamingo as the primary demo restaurant.
- Include a clear "Open Table 1 Demo" action.
- Include a QR/table preview so the product purpose is obvious.
- Add a short operator-facing line: "Guests scan, order, add notes, and send orders to staff."
- Avoid empty marketing fluff.

Done when:
- A restaurant owner can land on the site and immediately understand what PRESTO does.
- The first click takes them into a working table-ordering flow.
- The page feels like a real product, not a placeholder.

### 2. Make production mode impossible to confuse with demo mode

Current issue: if Supabase credentials are missing, the app silently uses local demo data and fake order IDs.

Upgrade:
- Show a visible "Demo Mode" badge only in demo environments.
- Disable fake order submission on production domains unless explicitly enabled.
- Add environment checks during build/deploy.

Done when:
- Nobody can accidentally present fake orders as live orders.
- Production either connects to Supabase correctly or fails loudly.

### 3. Add Pink Flamingo branding and restaurant-specific polish

Current issue: the app says "PRESTO" first, but the restaurant should feel like the star.

Upgrade:
- Make Pink Flamingo the primary visual signal on demo routes.
- Add restaurant location, table number, and service style.
- Use a beach/tropical visual direction without looking like a toy.
- Add real menu photos or high-quality placeholder food imagery.

Done when:
- Pink Flamingo can imagine this as their own customer experience.

## Priority 2 - Make The Ordering Flow Feel Real

### 4. Improve the mobile menu experience

Upgrade:
- Make category navigation sticky and thumb-friendly.
- Keep cart access visible on small screens.
- Make item cards denser and easier to scan.
- Improve spacing so the menu feels like a real restaurant menu.

Done when:
- A guest can order comfortably on an iPhone without hunting for controls.

### 5. Upgrade cart and checkout interaction

Upgrade:
- Add a mobile cart drawer.
- Show item modifiers and notes more clearly.
- Add "Send order to kitchen" language for pay-at-table mode.
- Add a final review step before submit.

Done when:
- A guest feels confident before submitting.

### 6. Add order confirmation that gives next steps

Upgrade:
- Keep the current confirmation message, but make it feel designed.
- Show table number, order ID, estimated time, and "staff has received this" state.
- Add "Start another order" and "View order status" buttons.

Done when:
- The confirmation screen reassures the guest instead of just ending the flow.

## Priority 3 - Make It Safe Enough To Put Online

### 7. Recalculate prices server-side

Current issue: order totals are calculated from cart data sent by the browser.

Upgrade:
- Send only item IDs, quantities, and notes from the browser.
- Re-fetch menu item names/prices from Supabase on the server.
- Reject unavailable items and invalid quantities.

Done when:
- A user cannot manipulate prices from the browser.

### 8. Add basic Supabase security

Upgrade:
- Enable RLS on public tables.
- Add insert-only policy for customer order creation.
- Prevent public reads of all orders.
- Keep menu reads public.
- Keep service-role access server-only.

Done when:
- Public guests can browse menu and create orders, but cannot browse order data.

### 9. Add rate limiting and spam protection

Upgrade:
- Limit order submissions per table/device/IP.
- Add basic bot protection or throttling.
- Add server-side validation for name, WhatsApp, notes, and quantities.

Done when:
- A public QR URL cannot be trivially spammed.

## Priority 4 - Make Staff Able To Use It

### 10. Build the staff order board

Upgrade:
- Add `/dashboard/restaurant/pink-flamingo/orders`.
- Show new orders by table.
- Include item notes, order notes, timestamps, and total.
- Allow statuses: new, accepted, preparing, ready, served, cancelled.

Done when:
- Staff can actually see and fulfill incoming orders without opening Supabase.

### 11. Add simple staff access protection

Upgrade:
- Add a temporary staff password or Supabase Auth.
- Protect dashboard routes.
- Hide kitchen/order management from public users.

Done when:
- Customers cannot access staff screens.

### 12. Add live updates

Upgrade:
- Use Supabase realtime or polling for staff order board updates.
- Add sound/visual alert for new orders.
- Add customer status updates after submit.

Done when:
- Staff do not need to refresh the page to see new orders.

## Priority 5 - Make Pink Flamingo Easy To Demo

### 13. Deploy to a controlled demo domain

Upgrade:
- Deploy to Vercel.
- Use `pinkflamingointama.mindfultech.services` as the controlled demo domain.
- Do not route real table QR traffic there until staff operations and security are ready.
- Configure production Supabase environment variables.
- Password-protect the deployment if possible.

Done when:
- The link can be shared confidently in a meeting without exposing a half-live product.

### 14. Generate QR codes for tables

Upgrade:
- Create QR codes for tables 1-10.
- Use URLs like `/menu/pink-flamingo/table/1`.
- Add a printable table tent design.

Done when:
- Pink Flamingo can test the exact guest journey from phone camera to order.

### 15. Create a 5-minute demo script

Upgrade:
- Start on the homepage.
- Open Table 1.
- Add two items with notes.
- Submit order.
- Show staff dashboard receiving the order.
- Explain what is demo-only vs production-ready.

Done when:
- The pitch feels controlled and intentional.

## Priority 6 - Make It Operationally Useful

### 16. Add menu management

Upgrade:
- Let a manager add/edit/disable items.
- Let a manager change prices.
- Let a manager reorder categories.

Done when:
- Pink Flamingo does not need a developer for normal menu changes.

### 17. Add order status page for guests

Upgrade:
- After confirmation, send guests to `/order/[orderId]/status`.
- Show timeline: received, preparing, ready, served.
- Auto-refresh status.

Done when:
- Guests are not left wondering whether the order went through.

### 18. Add WhatsApp notifications later

Upgrade:
- Send order confirmation.
- Send "ready" notification.
- Optionally notify staff of high-priority notes.

Done when:
- Guests and staff get useful alerts without needing to stare at screens.

### 19. Add payments only after the operational loop works

Upgrade:
- Start with pay-at-table or staff-closes-check mode.
- Add Stripe once order receiving and fulfillment are solid.

Done when:
- PRESTO can generate revenue without making restaurant operations fragile.

### 20. Add monitoring and QA

Upgrade:
- Add error tracking.
- Add basic analytics.
- Add smoke tests for menu load and order submit.
- Test on real phones and slow networks.

Done when:
- Problems are visible before Pink Flamingo notices them.

## Recommended Build Order

1. Replace homepage.
2. Add visible demo/production mode handling.
3. Fix server-side price validation.
4. Connect real Supabase and deploy controlled demo domain.
5. Polish Pink Flamingo menu/mobile flow.
6. Build staff order board.
7. Add staff access protection.
8. Add live order updates.
9. Generate table QR codes.
10. Run a phone-based demo rehearsal.

## Go/No-Go

Ready to show Pink Flamingo when:
- The homepage no longer looks like a placeholder.
- A real phone can open Table 1 and submit an order.
- The order is visible somewhere staff can reasonably access.
- Demo mode is clearly labeled.
- The presenter can explain what is live, what is simulated, and what comes next.

Ready for real table use when:
- Staff dashboard exists.
- Orders are protected from public reads.
- Prices are recalculated server-side.
- The app is deployed on a stable domain.
- The full flow has been tested on actual phones inside the restaurant.
