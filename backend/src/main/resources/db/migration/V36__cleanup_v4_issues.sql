-- V36: Cleanup V4 review issues

-- Remove outdated sample flights from V21 (date < 2025-06-01 to be safe and only target V21 sample)
DELETE FROM flights WHERE DATE(departure_time) = '2025-01-01';

-- Convert users.role to ENUM (DB-LOW-01)
ALTER TABLE users MODIFY COLUMN role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';
