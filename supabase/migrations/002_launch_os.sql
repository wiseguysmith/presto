-- PRESTO Launch OS upgrade for live Pink Flamingo operations.
-- Adds payment routing, kitchen workflow, guest source tracking, feedback, and staff-friendly reporting.

ALTER TABLE orders DROP CONSTRAINT IF EXISTS valid_status;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS customer_email text,
  ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'counter',
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS tip_amount numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax_amount numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS platform_fee_amount numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS stripe_checkout_session_id text,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text,
  ADD COLUMN IF NOT EXISTS stripe_connected_account_id text,
  ADD COLUMN IF NOT EXISTS guest_source text,
  ADD COLUMN IF NOT EXISTS kitchen_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancelled_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancelled_reason text;

ALTER TABLE orders
  ADD CONSTRAINT valid_status CHECK (
    status IN (
      'pending_payment',
      'paid',
      'sent_to_kitchen',
      'preparing',
      'ready',
      'served',
      'cancelled',
      'refunded'
    )
  );

ALTER TABLE orders
  ADD CONSTRAINT valid_payment_method CHECK (payment_method IN ('card', 'counter'));

ALTER TABLE orders
  ADD CONSTRAINT valid_payment_status CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled'));

CREATE TABLE IF NOT EXISTS order_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  feedback_text text,
  wants_follow_up boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders(payment_method);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_checkout_session_id ON orders(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_order_feedback_order_id ON order_feedback(order_id);
CREATE INDEX IF NOT EXISTS idx_order_feedback_restaurant_id ON order_feedback(restaurant_id);
