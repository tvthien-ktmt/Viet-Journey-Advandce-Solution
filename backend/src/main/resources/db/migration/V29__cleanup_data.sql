DROP TABLE IF EXISTS airports;

UPDATE flights 
SET departure_time = DATE_ADD(departure_time, INTERVAL 365 DAY),
    arrival_time = DATE_ADD(arrival_time, INTERVAL 365 DAY)
WHERE departure_time < NOW();

CREATE INDEX idx_payment_status ON payments(status);
