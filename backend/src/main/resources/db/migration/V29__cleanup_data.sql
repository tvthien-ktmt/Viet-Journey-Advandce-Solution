DROP TABLE IF EXISTS airports;

UPDATE flights 
SET depart_time = DATE_ADD(depart_time, INTERVAL 365 DAY),
    arrive_time = DATE_ADD(arrive_time, INTERVAL 365 DAY)
WHERE depart_time < NOW();

CREATE INDEX idx_payment_status ON payments(status);
