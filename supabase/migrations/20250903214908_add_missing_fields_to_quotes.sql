-- Add missing fields to quotes table
ALTER TABLE quotes ADD COLUMN customer_phone text;
ALTER TABLE quotes ADD COLUMN company_name text;
ALTER TABLE quotes ADD COLUMN vehicle_details text;
ALTER TABLE quotes ADD COLUMN vin_number text;
ALTER TABLE quotes ADD COLUMN buyer_details text;
ALTER TABLE quotes ADD COLUMN lot_number text;
ALTER TABLE quotes ADD COLUMN is_car_title_ready boolean;
ALTER TABLE quotes ADD COLUMN pickup_location_type text;
ALTER TABLE quotes ADD COLUMN delivery_location_type text;
ALTER TABLE quotes ADD COLUMN shipping_line text;
ALTER TABLE quotes ADD COLUMN origin_port text;
ALTER TABLE quotes ADD COLUMN special_requirements text;

-- Drop unused vehicle_category column
ALTER TABLE quotes DROP COLUMN vehicle_category;
