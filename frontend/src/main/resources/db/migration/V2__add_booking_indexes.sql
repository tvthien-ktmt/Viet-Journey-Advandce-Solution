-- V2: Add indexes for performance and unique constraints for data integrity

-- 1. Index for ReservationScheduler (avoid full table scan every minute)
CREATE INDEX idx_booking_status_time ON bookings (status, reserved_until);

-- 2. Unique constraints to prevent spamming
ALTER TABLE wishlists ADD UNIQUE KEY uk_wishlist_user_item (user_id, item_type, item_id);
ALTER TABLE reviews ADD UNIQUE KEY uk_review_user_item (user_id, item_type, item_id);