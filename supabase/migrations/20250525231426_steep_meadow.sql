/*
  # Create quotes management tables

  1. New Tables
    - `quotes`
      - `id` (uuid, primary key)
      - `reference` (text, unique)
      - `status` (text) - pending, approved, rejected, expired
      - `amount` (numeric)
      - `customer_name` (text)
      - `customer_email` (text)
      - `service_type` (text)
      - `vehicle_category` (text)
      - `origin` (text)
      - `destination` (text)
      - `created_at` (timestamptz)
      - `expires_at` (timestamptz)
      - `approved_at` (timestamptz)
      - `approved_by` (uuid, references auth.users)

  2. Security
    - Enable RLS on quotes table
    - Add policies for admin access
*/

CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  amount numeric,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  service_type text NOT NULL,
  vehicle_category text NOT NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  approved_at timestamptz,
  approved_by uuid REFERENCES auth.users,
  
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected', 'expired'))
);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Allow admins to read all quotes
CREATE POLICY "Admins can read all quotes"
  ON quotes
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', TRUE));

-- Allow admins to update quotes
CREATE POLICY "Admins can update quotes"
  ON quotes
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', TRUE));

-- Allow customers to read their own quotes
CREATE POLICY "Customers can read own quotes"
  ON quotes
  FOR SELECT
  TO authenticated
  USING (customer_email = auth.jwt() ->> 'email');