CREATE TABLE IF NOT EXISTS airports (
  code VARCHAR(3) PRIMARY KEY,
  city VARCHAR(100) NOT NULL,
  name VARCHAR(200) NOT NULL,
  country VARCHAR(2) NOT NULL
);

INSERT INTO airports (code, city, name, country) VALUES
  ('HAN', 'Hà Nội', 'Sân bay QT Nội Bài', 'VN'),
  ('SGN', 'TP. Hồ Chí Minh', 'Sân bay QT Tân Sơn Nhất', 'VN'),
  ('DAD', 'Đà Nẵng', 'Sân bay QT Đà Nẵng', 'VN'),
  ('PQC', 'Phú Quốc', 'Sân bay QT Phú Quốc', 'VN'),
  ('HPH', 'Hải Phòng', 'Sân bay QT Cát Bi', 'VN'),
  ('CXR', 'Nha Trang', 'Sân bay QT Cam Ranh', 'VN'),
  ('HUI', 'Huế', 'Sân bay Phú Bài', 'VN'),
  ('VCA', 'Cần Thơ', 'Sân bay QT Cần Thơ', 'VN'),
  ('DLK', 'Đà Lạt', 'Sân bay Liên Khương', 'VN'),
  ('VDO', 'Vân Đồn', 'Sân bay QT Vân Đồn', 'VN'),
  ('BKK', 'Bangkok', 'Suvarnabhumi', 'TH'),
  ('SIN', 'Singapore', 'Changi', 'SG'),
  ('ICN', 'Seoul', 'Incheon', 'KR'),
  ('NRT', 'Tokyo', 'Narita', 'JP'),
  ('PEK', 'Bắc Kinh', 'Capital', 'CN'),
  ('SYD', 'Sydney', 'Kingsford Smith', 'AU'),
  ('LHR', 'London', 'Heathrow', 'GB'),
  ('CDG', 'Paris', 'Charles de Gaulle', 'FR'),
  ('FRA', 'Frankfurt', 'Frankfurt', 'DE'),
  ('DXB', 'Dubai', 'Dubai', 'AE')
ON CONFLICT (code) DO NOTHING;