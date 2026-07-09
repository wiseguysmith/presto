-- Seed Pink Flamingo restaurant
INSERT INTO restaurants (name, slug, description, location, currency, is_active)
VALUES ('Pink Flamingo', 'pink-flamingo', 'A tropical beach-inspired restaurant', 'Guanacaste, Costa Rica', 'USD', true);

-- Get the restaurant ID for subsequent inserts
-- Note: In practice, you'll need to run these in sequence or use a transaction

-- Seed restaurant tables (10 tables)
INSERT INTO restaurant_tables (restaurant_id, table_number, label, is_active)
SELECT id, 1, 'Table 1', true FROM restaurants WHERE slug = 'pink-flamingo'
UNION ALL SELECT id, 2, 'Table 2', true FROM restaurants WHERE slug = 'pink-flamingo'
UNION ALL SELECT id, 3, 'Table 3', true FROM restaurants WHERE slug = 'pink-flamingo'
UNION ALL SELECT id, 4, 'Table 4', true FROM restaurants WHERE slug = 'pink-flamingo'
UNION ALL SELECT id, 5, 'Table 5', true FROM restaurants WHERE slug = 'pink-flamingo'
UNION ALL SELECT id, 6, 'Table 6', true FROM restaurants WHERE slug = 'pink-flamingo'
UNION ALL SELECT id, 7, 'Table 7', true FROM restaurants WHERE slug = 'pink-flamingo'
UNION ALL SELECT id, 8, 'Table 8', true FROM restaurants WHERE slug = 'pink-flamingo'
UNION ALL SELECT id, 9, 'Table 9', true FROM restaurants WHERE slug = 'pink-flamingo'
UNION ALL SELECT id, 10, 'Table 10', true FROM restaurants WHERE slug = 'pink-flamingo';

-- Seed menu categories
INSERT INTO menu_categories (restaurant_id, name, slug, sort_order, is_active)
VALUES
  ((SELECT id FROM restaurants WHERE slug = 'pink-flamingo'), 'Starters', 'starters', 1, true),
  ((SELECT id FROM restaurants WHERE slug = 'pink-flamingo'), 'Bowls', 'bowls', 2, true),
  ((SELECT id FROM restaurants WHERE slug = 'pink-flamingo'), 'Tacos', 'tacos', 3, true),
  ((SELECT id FROM restaurants WHERE slug = 'pink-flamingo'), 'Seafood', 'seafood', 4, true),
  ((SELECT id FROM restaurants WHERE slug = 'pink-flamingo'), 'Smoothies', 'smoothies', 5, true),
  ((SELECT id FROM restaurants WHERE slug = 'pink-flamingo'), 'Coffee', 'coffee', 6, true);

-- Seed menu items
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, currency, available, sort_order)
VALUES
  -- Starters
  ((SELECT id FROM restaurants WHERE slug = 'pink-flamingo'), (SELECT id FROM menu_categories WHERE slug = 'starters' AND restaurant_id = (SELECT id FROM restaurants WHERE slug = 'pink-flamingo')), 'Guacamole & Plantain Chips', 'Fresh guacamole with crispy plantain chips', 12.99, 'USD', true, 1),
  ((SELECT id FROM restaurants WHERE slug = 'pink-flamingo'), (SELECT id FROM menu_categories WHERE slug = 'starters' AND restaurant_id = (SELECT id FROM restaurants WHERE slug = 'pink-flamingo')), 'Tuna Tostadas', 'Seared tuna on crispy tostadas with mango salsa', 14.99, 'USD', true, 2),

  -- Bowls
  ((SELECT id FROM restaurants WHERE slug = 'pink-flamingo'), (SELECT id FROM menu_categories WHERE slug = 'bowls' AND restaurant_id = (SELECT id FROM restaurants WHERE slug = 'pink-flamingo')), 'Tropical Chicken Bowl', 'Grilled chicken with tropical fruits and coconut rice', 15.99, 'USD', true, 1),
  ((SELECT id FROM restaurants WHERE slug = 'pink-flamingo'), (SELECT id FROM menu_categories WHERE slug = 'bowls' AND restaurant_id = (SELECT id FROM restaurants WHERE slug = 'pink-flamingo')), 'Vegan Casado Bowl', 'Rice, beans, salad, plantains, and seasonal vegetables', 13.99, 'USD', true, 2),

  -- Tacos
  ((SELECT id FROM restaurants WHERE slug = 'pink-flamingo'), (SELECT id FROM menu_categories WHERE slug = 'tacos' AND restaurant_id = (SELECT id FROM restaurants WHERE slug = 'pink-flamingo')), 'Baja Fish Tacos', 'Beer-battered mahi-mahi with cabbage slaw and chipotle mayo', 16.99, 'USD', true, 1),
  ((SELECT id FROM restaurants WHERE slug = 'pink-flamingo'), (SELECT id FROM menu_categories WHERE slug = 'tacos' AND restaurant_id = (SELECT id FROM restaurants WHERE slug = 'pink-flamingo')), 'Chicken Tinga Tacos', 'Slow-cooked chicken with chipotle sauce and onions', 14.99, 'USD', true, 2),

  -- Seafood
  ((SELECT id FROM restaurants WHERE slug = 'pink-flamingo'), (SELECT id FROM menu_categories WHERE slug = 'seafood' AND restaurant_id = (SELECT id FROM restaurants WHERE slug = 'pink-flamingo')), 'Garlic Shrimp Plate', 'Sautéed shrimp in garlic butter with rice and vegetables', 18.99, 'USD', true, 1),
  ((SELECT id FROM restaurants WHERE slug = 'pink-flamingo'), (SELECT id FROM menu_categories WHERE slug = 'seafood' AND restaurant_id = (SELECT id FROM restaurants WHERE slug = 'pink-flamingo')), 'Grilled Mahi Mahi', 'Fresh mahi-mahi with tropical salsa and plantain chips', 19.99, 'USD', true, 2),

  -- Smoothies
  ((SELECT id FROM restaurants WHERE slug = 'pink-flamingo'), (SELECT id FROM menu_categories WHERE slug = 'smoothies' AND restaurant_id = (SELECT id FROM restaurants WHERE slug = 'pink-flamingo')), 'Mango Passion Smoothie', 'Mango, passion fruit, coconut milk, and honey', 7.99, 'USD', true, 1),
  ((SELECT id FROM restaurants WHERE slug = 'pink-flamingo'), (SELECT id FROM menu_categories WHERE slug = 'smoothies' AND restaurant_id = (SELECT id FROM restaurants WHERE slug = 'pink-flamingo')), 'Green Detox Smoothie', 'Spinach, pineapple, ginger, and fresh lime', 8.99, 'USD', true, 2),

  -- Coffee
  ((SELECT id FROM restaurants WHERE slug = 'pink-flamingo'), (SELECT id FROM menu_categories WHERE slug = 'coffee' AND restaurant_id = (SELECT id FROM restaurants WHERE slug = 'pink-flamingo')), 'Iced Costa Rican Coffee', 'Cold brew with local Costa Rican coffee and almond milk', 5.99, 'USD', true, 1),
  ((SELECT id FROM restaurants WHERE slug = 'pink-flamingo'), (SELECT id FROM menu_categories WHERE slug = 'coffee' AND restaurant_id = (SELECT id FROM restaurants WHERE slug = 'pink-flamingo')), 'Coconut Cold Brew', 'Smooth cold brew with coconut cream and a touch of vanilla', 6.99, 'USD', true, 2);
