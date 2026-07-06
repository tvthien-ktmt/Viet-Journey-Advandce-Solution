CREATE TABLE IF NOT EXISTS flights (
  id BIGSERIAL PRIMARY KEY,
  flight_no VARCHAR(10) NOT NULL UNIQUE,
  from_code VARCHAR(3) NOT NULL REFERENCES airports(code),
  to_code VARCHAR(3) NOT NULL REFERENCES airports(code),
  depart_time VARCHAR(5) NOT NULL,
  aircraft VARCHAR(50) NOT NULL,
  base_price BIGINT NOT NULL,
  status VARCHAR(20) DEFAULT 'ACTIVE'
);

INSERT INTO flights (flight_no, from_code, to_code, depart_time, aircraft, base_price) VALUES
  ('VN201', 'HAN', 'SGN', '06:00', 'Airbus A321neo', 1290000),
  ('VN205', 'HAN', 'SGN', '09:30', 'Airbus A321neo', 1350000),
  ('VN209', 'HAN', 'SGN', '14:00', 'Boeing 787-9', 1490000),
  ('VN211', 'HAN', 'SGN', '18:45', 'Airbus A350-900', 1590000),
  ('VN301', 'SGN', 'DAD', '07:15', 'Airbus A321neo', 1190000),
  ('VN305', 'SGN', 'DAD', '11:00', 'Boeing 787-9', 1290000),
  ('VN401', 'HAN', 'DAD', '08:30', 'Airbus A321neo', 1390000),
  ('VN501', 'SGN', 'PQC', '10:00', 'Airbus A330-300', 1790000),
  ('VN601', 'HAN', 'CXR', '12:15', 'Airbus A321neo', 1590000),
  ('VN701', 'SGN', 'BKK', '16:00', 'Airbus A321neo', 2190000)
ON CONFLICT (flight_no) DO NOTHING;