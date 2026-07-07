-- Fix DB-CRIT-03
ALTER TABLE payments ADD CONSTRAINT uk_payment_txn_ref UNIQUE (transaction_ref);

-- Fix DB-HIGH-01
ALTER TABLE users ADD CONSTRAINT chk_email_length CHECK (LENGTH(email) >= 5);
-- password_hash is BCrypt: always exactly 60 chars
ALTER TABLE users ADD CONSTRAINT chk_password_length CHECK (LENGTH(password_hash) = 60);

-- Fix DB-HIGH-05
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- Fix DB-HIGH-06
CREATE INDEX idx_refresh_tokens_user_revoked ON refresh_tokens(user_id, revoked);

-- Fix DB-MED-01
ALTER TABLE tours ADD CONSTRAINT chk_old_price CHECK (old_price IS NULL OR old_price > price);

-- Fix DB-MED-02
ALTER TABLE flights ADD CONSTRAINT chk_available_seats CHECK (available_seats >= 0);

-- Fix DB-MED-03
-- NULL-safe: require document_number to be non-null to make UNIQUE effective
ALTER TABLE booking_passengers ADD CONSTRAINT uk_booking_pax UNIQUE (booking_id, full_name, document_number);

-- Fix DB-MED-05
CREATE INDEX idx_blogs_published_at ON blogs(published_at DESC);

-- Fix DB-LOW-01
CREATE INDEX idx_tours_featured ON tours(is_featured);

-- Fix DB-LOW-03: payments.updated_at (payments table does NOT have updated_at in V1, safe to add)
ALTER TABLE payments ADD COLUMN IF NOT EXISTS updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
-- bookings already has updated_at from V1 (do NOT add again — would fail on fresh install)

-- Fix DB-MED-04
ALTER TABLE payments ADD CONSTRAINT chk_payment_status CHECK (status IN ('pending', 'completed', 'failed', 'refunded'));
