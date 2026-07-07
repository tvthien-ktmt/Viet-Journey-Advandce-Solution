-- Add total_seats to flights to calculate load factor dynamically
ALTER TABLE flights ADD COLUMN total_seats INT NOT NULL DEFAULT 180;
