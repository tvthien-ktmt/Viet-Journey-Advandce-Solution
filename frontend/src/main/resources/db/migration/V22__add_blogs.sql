CREATE TABLE IF NOT EXISTS blogs (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(200) NOT NULL UNIQUE,
  title VARCHAR(300) NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO blogs (slug, title, excerpt, cover_image, content) VALUES
('khai-truong-ha-noi-sydney', 'Vietnam Airlines khai trương đường bay thẳng Hà Nội — Sydney', 'Từ tháng 7/2025...', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05', '<p>Từ tháng 7/2025, Vietnam Airlines chính thức khai trương đường bay thẳng giữa Hà Nội và Sydney...</p>')
ON CONFLICT (slug) DO NOTHING;