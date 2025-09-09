ALTER TABLE quotes
DROP CONSTRAINT valid_status,
ADD CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected', 'expired', 'confirmed'));
