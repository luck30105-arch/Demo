/*
# Salon Booking System — Initial Schema

## Purpose
A salon website with a digital appointment request system and owner dashboard.
This is a single-tenant app with no sign-in screen, so all policies use
`anon, authenticated` to allow the anon-key frontend to read and write.

## New Tables

### services
- `id` (uuid, PK)
- `name` (text) — service name e.g. "Classic Haircut"
- `description` (text) — short description of the service
- `category` (text) — "men", "women", or "unisex"
- `price` (numeric) — price in the salon's currency
- `duration_minutes` (int) — estimated duration
- `image_url` (text) — optional image for the service
- `sort_order` (int) — display ordering
- `is_active` (boolean) — soft-delete / hide from website
- `created_at` (timestamptz)

### appointments
- `id` (uuid, PK)
- `service_id` (uuid, FK → services)
- `customer_name` (text)
- `customer_phone` (text)
- `customer_email` (text, nullable)
- `requested_date` (date) — preferred date
- `requested_time` (time) — preferred time slot
- `notes` (text, nullable) — customer notes
- `status` (text) — "pending", "confirmed", "completed", "cancelled"
- `created_at` (timestamptz)

## Security
- RLS enabled on both tables.
- All CRUD open to anon + authenticated (single-tenant, no auth screen).
*/

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL CHECK (category IN ('men', 'women', 'unisex')),
  price numeric(10, 2) NOT NULL DEFAULT 0,
  duration_minutes integer NOT NULL DEFAULT 30,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  requested_date date NOT NULL,
  requested_time time NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Services policies
DROP POLICY IF EXISTS "anon_select_services" ON services;
CREATE POLICY "anon_select_services" ON services FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_services" ON services;
CREATE POLICY "anon_insert_services" ON services FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_services" ON services;
CREATE POLICY "anon_update_services" ON services FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_services" ON services;
CREATE POLICY "anon_delete_services" ON services FOR DELETE
  TO anon, authenticated USING (true);

-- Appointments policies
DROP POLICY IF EXISTS "anon_select_appointments" ON appointments;
CREATE POLICY "anon_select_appointments" ON appointments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_appointments" ON appointments;
CREATE POLICY "anon_insert_appointments" ON appointments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_appointments" ON appointments;
CREATE POLICY "anon_update_appointments" ON appointments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_appointments" ON appointments;
CREATE POLICY "anon_delete_appointments" ON appointments FOR DELETE
  TO anon, authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(requested_date);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- Seed default services
INSERT INTO services (name, description, category, price, duration_minutes, sort_order) VALUES
  ('Classic Haircut', 'Clean, precise cut tailored to your style', 'men', 350, 30, 1),
  ('Beard Styling & Shave', 'Hot towel shave and beard sculpting', 'men', 250, 20, 2),
  ('Hair Spa & Treatment', 'Deep conditioning scalp treatment', 'men', 400, 45, 3),
  ('Hair Coloring', 'Full color or highlights', 'unisex', 1200, 90, 4),
  ('Women''s Haircut & Style', 'Cut, blow-dry, and styling', 'women', 500, 45, 5),
  ('Facial Treatment', 'Cleansing, exfoliation, and mask', 'unisex', 600, 50, 6),
  ('Kids Haircut', 'Gentle haircut for children under 12', 'unisex', 200, 20, 7)
ON CONFLICT DO NOTHING;
