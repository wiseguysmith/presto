# Pink Flamingo Live Roadmap

PRESTO is now aimed at becoming Pink Flamingo's first dine-in Launch OS: QR ordering, payments, kitchen routing, sales visibility, feedback, and basic organization.

## V1 Live Loop

Customer flow:
1. Guest scans a table QR code.
2. Guest adds items and notes.
3. Guest enters email for receipts.
4. Guest chooses card or pay at counter/table.
5. Card orders go through Stripe Checkout.
6. Counter/table orders wait for staff payment confirmation.
7. Paid or confirmed orders appear on the kitchen board.
8. Kitchen moves orders from New to Preparing to Ready to Served.
9. Owner/admin sees daily sales and exports CSV records.

## V1 Features

- Dine-in QR ordering for Pink Flamingo tables.
- Required customer email.
- Tip selector: 0%, 10%, 15%, 20%.
- Stripe Checkout card payment path.
- Stripe Connect platform-fee support through `STRIPE_PLATFORM_FEE_BPS`.
- Pay-at-counter/table path with admin confirmation.
- Kitchen board with sound toggle and polling.
- Admin pending-payment screen.
- Daily sales dashboard.
- CSV export for accountant.
- Guest source tracking: Instagram, Google, walk-by, hotel, friend, local resident, tourist, TikTok, other.
- Private feedback capture.
- Sold-out / bring-back menu controls.
- Temporary staff PIN protection for `/admin`, `/kitchen`, and kitchen API routes.

## Before Real Customers

Required setup:
- Run `supabase/migrations/002_launch_os.sql`.
- Set `NEXT_PUBLIC_SITE_URL`.
- Set Supabase URL, anon key, and service role key.
- Set `STAFF_PIN` and `STAFF_SESSION_TOKEN`.
- Set Stripe keys and webhook secret.
- Set `STRIPE_CONNECTED_ACCOUNT_ID` for Pink Flamingo's connected account.
- Set `STRIPE_PLATFORM_FEE_BPS=100` for a 1% platform fee on card subtotal.
- Configure Stripe webhook to call `/api/stripe/webhook`.
- Configure `RESEND_API_KEY` and `PRESTO_FROM_EMAIL` for PRESTO confirmation emails.
- Test one card order and one counter/table order from a phone.
- Test kitchen board on the actual iPad.
- Print table QR codes only after the full loop works.

## V2

- Real staff roles instead of one shared PIN.
- Full menu editor.
- Refund tools.
- Google Business setup and review redirect.
- Instagram follow link.
- Better feedback routing for happy/unhappy guests.
- Opening and closing checklists.
- Issue log for wrong orders, comps, delays, and customer complaints.

## V3

- Takeout.
- Pickup.
- Catering inquiry flow.
- Retail/preorder flow.
- Inventory costing and supplier notes.
- Accounting integrations.
- Promotions and specials.
