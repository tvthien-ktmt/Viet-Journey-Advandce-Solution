-- V38: Final cleanup for Code Review V6

-- Note on DB-MED-01: The sequence V23 created `wishlist` and V28 dropped it. 
-- While this sequence is safe, ideally V1 should be rebuilt before a clean prod deployment.
-- For now, this comment serves as documentation for the audit trail.

-- Note on DB-LOW-02: `flights.total_seats` defaults to 180 (Airbus A321).
-- For other aircraft types (e.g., Boeing 787 with 250 seats), this should be set manually via Admin UI in the future.

-- Fix DB-LOW-01: Change payments.status to ENUM
-- Drop the existing check constraint from V32 first
ALTER TABLE payments DROP CONSTRAINT chk_payment_status;
-- Modify the column to ENUM
ALTER TABLE payments MODIFY COLUMN status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending';
