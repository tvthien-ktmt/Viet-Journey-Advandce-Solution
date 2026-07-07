ALTER TABLE booking_passengers ADD COLUMN passenger_type VARCHAR(20);
ALTER TABLE bookings ADD COLUMN item_snapshot JSON;
ALTER TABLE bookings ADD COLUMN contact_email VARCHAR(100);
ALTER TABLE bookings ADD COLUMN contact_phone VARCHAR(20);
ALTER TABLE booking_passengers ADD COLUMN birth_date VARCHAR(20);
ALTER TABLE booking_passengers ADD COLUMN gender VARCHAR(10);
