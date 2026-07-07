-- Re-create airports table (DB-CRIT-01)
CREATE TABLE IF NOT EXISTS airports (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255),
    country VARCHAR(100) DEFAULT 'Vietnam'
);

-- Ensure existing airports in flights are present
INSERT IGNORE INTO airports (code, name, city)
SELECT DISTINCT departure_airport, departure_airport, departure_airport FROM flights;

INSERT IGNORE INTO airports (code, name, city)
SELECT DISTINCT arrival_airport, arrival_airport, arrival_airport FROM flights;

-- Add FK for airports
ALTER TABLE flights
ADD CONSTRAINT fk_flights_departure_airport FOREIGN KEY (departure_airport) REFERENCES airports(code) ON DELETE RESTRICT,
ADD CONSTRAINT fk_flights_arrival_airport FOREIGN KEY (arrival_airport) REFERENCES airports(code) ON DELETE RESTRICT;

-- Fix users.email length (DB-HIGH-01)
ALTER TABLE users MODIFY COLUMN email VARCHAR(254) NOT NULL;

-- Fix password length constraint (DB-HIGH-01)
ALTER TABLE users DROP CONSTRAINT chk_password_length;
ALTER TABLE users ADD CONSTRAINT chk_password_length CHECK (LENGTH(password_hash) = 60);

-- Change bookings.user_id ON DELETE to RESTRICT (DB-HIGH-02)
ALTER TABLE bookings DROP FOREIGN KEY bookings_ibfk_1;
ALTER TABLE bookings ADD CONSTRAINT fk_bookings_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT;

-- Fix uk_booking_pax bypass with NULL document_number (DB-HIGH-03)
ALTER TABLE booking_passengers DROP INDEX uk_booking_pax;
-- We use a generated column to ensure unique constraint handles NULLs by mapping them to empty strings or unique IDs
ALTER TABLE booking_passengers ADD COLUMN doc_num_coalesced VARCHAR(50) GENERATED ALWAYS AS (COALESCE(document_number, '')) STORED;
ALTER TABLE booking_passengers ADD CONSTRAINT uk_booking_pax UNIQUE (booking_id, full_name, doc_num_coalesced);
