-- Seed Data for VietJourney
-- Passwords are all 'Test@123456' ($2a$10$71VgYluJK0Acz/dljTxcuebzRZ25H25QRnxCZurH/2W5s0XrOjExG)

-- USERS
INSERT INTO users (full_name, email, password_hash, phone, role, created_at) VALUES 
('Nguyễn Văn Test', 'test@vietjourney.com', '$2a$10$71VgYluJK0Acz/dljTxcuebzRZ25H25QRnxCZurH/2W5s0XrOjExG', '0901234567', 'USER', NOW()),
('Admin VietJourney', 'admin@vietjourney.com', '$2a$10$71VgYluJK0Acz/dljTxcuebzRZ25H25QRnxCZurH/2W5s0XrOjExG', '0909999999', 'ADMIN', NOW());

-- TOURS
INSERT INTO tours (name, slug, image, location, price, old_price, rating, review_count, duration, overview, is_featured, created_at) VALUES 
('Hà Nội - Sapa: Khám Phá Bản Cát Cát', 'ha-noi-sapa-kham-pha-ban-cat-cat', '/assets/images/tours/sapa.jpg', 'Lào Cai, Việt Nam', 2500000.00, 3000000.00, 4.8, 120, '3 Ngày 2 Đêm', 'Hành trình khám phá vẻ đẹp kỳ vĩ của Sapa mù sương, thăm bản Cát Cát của người H''Mông và chinh phục đỉnh Fansipan.', TRUE, NOW()),
('Đà Nẵng - Hội An: Di Sản Miền Trung', 'da-nang-hoi-an-di-san-mien-trung', '/assets/images/tours/hoian.jpg', 'Đà Nẵng, Việt Nam', 3200000.00, 3500000.00, 4.9, 250, '4 Ngày 3 Đêm', 'Trải nghiệm thành phố đáng sống nhất Việt Nam và dạo bước trên những con phố lồng đèn lung linh của phố cổ Hội An.', TRUE, NOW()),
('TP.HCM - Phú Quốc: Đảo Ngọc Thiên Đường', 'tphcm-phu-quoc-dao-ngoc', '/assets/images/tours/phuquoc.jpg', 'Kiên Giang, Việt Nam', 4500000.00, 5000000.00, 4.7, 300, '5 Ngày 4 Đêm', 'Tận hưởng biển xanh cát trắng nắng vàng tại hòn đảo ngọc xinh đẹp nhất Việt Nam, thăm VinWonders và lặn ngắm san hô.', TRUE, NOW());

-- TOUR ITINERARIES (Tours IDs should be 1, 2, 3 assuming auto_increment from 1)
INSERT INTO tour_itineraries (tour_id, day_number, day_title, content) VALUES
(1, 1, 'Hà Nội - Sapa - Bản Cát Cát', 'Xe đón quý khách tại điểm hẹn khởi hành đi Sapa. Buổi chiều tham quan bản Cát Cát.'),
(1, 2, 'Sapa - Chinh phục Fansipan', 'Trải nghiệm cáp treo lên đỉnh Fansipan - nóc nhà Đông Dương. Tự do khám phá thị trấn.'),
(2, 1, 'Đón khách tại sân bay Đà Nẵng', 'Nhận phòng khách sạn, nghỉ ngơi. Chiều tắm biển Mỹ Khê.'),
(2, 2, 'Bán đảo Sơn Trà - Phố cổ Hội An', 'Viếng chùa Linh Ứng. Chiều di chuyển vào Hội An, dạo phố cổ và thả đèn hoa đăng.'),
(3, 1, 'Bay đến Phú Quốc - Nhận phòng resort', 'Xe đón khách tại sân bay, đưa về resort nghỉ ngơi và tắm biển.'),
(3, 2, 'Khám phá Nam Đảo - Câu cá lặn san hô', 'Lên tàu du ngoạn các hòn đảo nhỏ, câu cá, lặn ngắm san hô và dùng bữa trưa trên tàu.');

-- TOUR HIGHLIGHTS
INSERT INTO tour_highlights (tour_id, content) VALUES
(1, 'Chinh phục nóc nhà Đông Dương Fansipan'), (1, 'Khám phá văn hóa độc đáo của người H''Mông tại Bản Cát Cát'), (1, 'Thưởng thức đặc sản vùng cao Tây Bắc'),
(2, 'Ngắm nhìn cầu Rồng phun lửa vào dịp cuối tuần'), (2, 'Chiêm ngưỡng kiến trúc hoài cổ của Hội An'), (2, 'Thưởng thức hải sản tươi ngon tại Đà Nẵng'),
(3, 'Lặn ngắm san hô tuyệt đẹp tại Hòn Móng Tay'), (3, 'Trải nghiệm cáp treo vượt biển dài nhất thế giới'), (3, 'Thưởng thức hoàng hôn tuyệt đẹp tại Bãi Trường');

-- TOUR INCLUSIONS
INSERT INTO tour_inclusions (tour_id, content) VALUES
(1, 'Xe giường nằm cao cấp khứ hồi Hà Nội - Sapa'), (1, 'Khách sạn 3 sao trung tâm Sapa (2 khách/phòng)'),
(2, 'Khách sạn 4 sao gần biển Mỹ Khê'), (2, 'Vé tham quan các điểm trong chương trình'),
(3, 'Vé máy bay khứ hồi TP.HCM - Phú Quốc'), (3, 'Bữa ăn theo chương trình (bao gồm 1 bữa BBQ hải sản)');

-- TOUR EXCLUSIONS
INSERT INTO tour_exclusions (tour_id, content) VALUES
(1, 'Vé cáp treo Fansipan (mua tự túc nếu có nhu cầu)'),
(2, 'Chi phí ăn uống ngoài chương trình'),
(3, 'Vé vào cổng VinWonders và Safari');

-- HOTELS
INSERT INTO hotels (name, slug, image, location, price, rating, review_count, created_at) VALUES 
('Mường Thanh Luxury Đà Nẵng', 'muong-thanh-luxury-da-nang', '/assets/images/hotels/muong-thanh.jpg', 'Đà Nẵng', 1200000.00, 4.5, 340, NOW()),
('Sofitel Legend Metropole Hà Nội', 'sofitel-legend-metropole-hanoi', '/assets/images/hotels/sofitel.jpg', 'Hà Nội', 4500000.00, 4.9, 560, NOW());

-- HOTEL ROOMS
INSERT INTO hotel_rooms (hotel_id, name, price, capacity) VALUES 
(1, 'Phòng Deluxe Hướng Biển', 1200000.00, 2),
(1, 'Phòng Suite Gia Đình', 2500000.00, 4),
(2, 'Phòng Premium Cổ Điển', 4500000.00, 2),
(2, 'Phòng Grand Premium', 6000000.00, 2),
(2, 'Phòng Tổng Thống', 15000000.00, 2);

-- FLIGHTS
INSERT INTO flights (airline_code, flight_number, departure_airport, departure_time, arrival_airport, arrival_time, price, seat_class, created_at) VALUES 
('VN', 'VN245', 'HAN', DATE_ADD(NOW(), INTERVAL 7 DAY), 'SGN', DATE_ADD(NOW(), INTERVAL '7 2' DAY_HOUR), 1800000.00, 'Economy', NOW()),
('VJ', 'VJ123', 'SGN', DATE_ADD(NOW(), INTERVAL 14 DAY), 'DAD', DATE_ADD(NOW(), INTERVAL '14 1:30' DAY_MINUTE), 850000.00, 'Economy', NOW());

-- BLOGS
INSERT INTO blogs (title, slug, thumbnail, excerpt, content, author, published_at, created_at) VALUES 
('Kinh nghiệm du lịch Đà Lạt 3 Ngày 2 Đêm cực chi tiết', 'kinh-nghiem-du-lich-da-lat-3n2d', '/assets/images/blogs/dalat.jpg', 'Đà Lạt luôn là điểm đến hấp dẫn với khí hậu ôn hòa. Cùng VietJourney khám phá lịch trình hoàn hảo cho chuyến đi của bạn.', 'Đà Lạt nổi tiếng với đồi thông reo, những quán cafe view thung lũng tuyệt đẹp. Ngày 1: Nhận phòng, đi thung lũng tình yêu. Ngày 2: LangBiang. Ngày 3: Mua sắm đặc sản.', 'Nguyễn Linh', NOW(), NOW()),
('Top 5 món ăn nhất định phải thử khi đến Hội An', 'top-5-mon-an-hoi-an', '/assets/images/blogs/hoian-food.jpg', 'Ẩm thực Hội An vô cùng phong phú và đặc sắc. Bài viết này sẽ review 5 món ngon bạn không thể bỏ lỡ.', '1. Cao Lầu - món ăn linh hồn của phố cổ. 2. Bánh mì Phượng - bánh mì ngon nhất thế giới. 3. Cơm gà Bà Buội. 4. Nước mót giải nhiệt. 5. Bánh bao bánh vạc.', 'Trần Hùng', NOW(), NOW()),
('Review Cáp treo Hòn Thơm Phú Quốc - Có đáng trải nghiệm?', 'review-cap-treo-hon-thom-phu-quoc', '/assets/images/blogs/hon-thom.jpg', 'Cáp treo 3 dây vượt biển dài nhất thế giới tại Nam Đảo Phú Quốc mang lại trải nghiệm như thế nào? Cùng tìm hiểu nhé.', 'Với chiều dài gần 8km, cáp treo Hòn Thơm mang đến tầm nhìn toàn cảnh 360 độ ngắm trọn vùng biển Nam Phú Quốc xanh ngọc bích. Khu du lịch trên đảo cũng có nhiều trò chơi nước thú vị.', 'Lê An', NOW(), NOW());
