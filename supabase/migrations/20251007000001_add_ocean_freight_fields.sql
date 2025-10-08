-- Add Ocean Freight specific fields to quotes table
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS consignee_name text;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS consignee_address text;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS consignee_phone text;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS vehicle_category text;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS title_number text;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS title_state text;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS declared_value text;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS notify_party text;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS pickup_contact_name text;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS pickup_contact_phone text;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS pickup_address text;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS delivery_address text;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS is_runner boolean;



