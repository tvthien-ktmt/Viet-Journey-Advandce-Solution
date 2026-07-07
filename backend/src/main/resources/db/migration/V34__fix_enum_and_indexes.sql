-- V34: DB fixes from CODE_REVIEW_V2_VERIFICATION
-- DB-LOW-03: Add 'failed' to bookings.status ENUM to match BookingStatus entity (6 values: PENDING, RESERVED, CONFIRMED, CANCELLED, EXPIRED, FAILED)
ALTER TABLE bookings MODIFY COLUMN status ENUM('pending','reserved','confirmed','cancelled','expired','failed') NOT NULL DEFAULT 'pending';

-- Add missing composite index for flight search (departure_airport, arrival_airport, departure_time)
-- This dramatically speeds up the primary search query in FlightService
CREATE INDEX idx_flights_search ON flights(departure_airport, arrival_airport, departure_time);

-- Add missing index for reviews lookup by item (item_type, item_id)
CREATE INDEX idx_reviews_item ON reviews(item_type, item_id);

-- Add missing index for booking_passengers search by booking + full_name (used in searchByCodeAndLastName)
CREATE INDEX idx_booking_passengers_search ON booking_passengers(booking_id, full_name);
