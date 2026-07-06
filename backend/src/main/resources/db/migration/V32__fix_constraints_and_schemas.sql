-- Fix DB-CRIT-03
ALTER TABLE payments ADD CONSTRAINT uk_payment_txn_ref UNIQUE (transaction_ref);

-- Fix DB-HIGH-01
ALTER TABLE users ADD CONSTRAINT chk_email_length CHECK (LENGTH(email) >= 5);
ALTER TABLE users ADD CONSTRAINT chk_password_length CHECK (LENGTH(password_hash) > 0);

-- Fix DB-HIGH-05
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- Fix DB-HIGH-06
CREATE INDEX idx_refresh_tokens_user_revoked ON refresh_tokens(user_id, revoked);

-- Fix DB-MED-01
ALTER TABLE tours ADD CONSTRAINT chk_old_price CHECK (old_price IS NULL OR old_price > price);

-- Fix DB-MED-02
ALTER TABLE flights ADD CONSTRAINT chk_available_seats CHECK (available_seats >= 0);

-- Fix DB-MED-03
-- Ensure uniqueness, handle nulls in document_number by using coalesce if needed, but simple unique works if data is clean.
ALTER TABLE booking_passengers ADD CONSTRAINT uk_booking_pax UNIQUE (booking_id, full_name, document_number);

-- Fix DB-MED-05
CREATE INDEX idx_blogs_published_at ON blogs(published_at DESC);

-- Fix DB-LOW-01
CREATE INDEX idx_tours_featured ON tours(is_featured);

-- Add updated_at if not exists (DB-LOW-03)
ALTER TABLE payments ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE bookings ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Fix DB-MED-04: Since status is VARCHAR, we don't necessarily have to change it to ENUM, but we can add a CHECK constraint.
ALTER TABLE payments ADD CONSTRAINT chk_payment_status CHECK (status IN ('pending', 'completed', 'failed', 'refunded'));
