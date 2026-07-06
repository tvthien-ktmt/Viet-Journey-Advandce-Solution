const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const toursJsonPath = path.join(rootDir, 'assets/data/tours.json');
const tourDetailHtmlPath = path.join(rootDir, 'tour-detail.html');
const tourDetailJsPath = path.join(rootDir, 'assets/js/pages/tour-detail.js');

// 1. Update tours.json
let tours = JSON.parse(fs.readFileSync(toursJsonPath, 'utf8'));

const tourContentMap = {
    "t1": {
        "overview": "Khám phá vẻ đẹp kỳ quan thiên nhiên thế giới Vịnh Hạ Long trên du thuyền Stella Maris Premium đẳng cấp 5 sao. Hành trình 2 ngày 1 đêm đưa bạn qua những địa danh nổi tiếng nhất như Hang Sửng Sốt, Đảo Ti Tốp, và trải nghiệm chèo kayak giữa thiên nhiên hùng vĩ.",
        "highlights": [
            "Nghỉ dưỡng trên du thuyền 5 sao sang trọng bậc nhất Hạ Long",
            "Thưởng thức ẩm thực fine-dining với hải sản tươi sống",
            "Tham quan Hang Sửng Sốt - hang động lớn và đẹp nhất Vịnh Hạ Long",
            "Chèo thuyền Kayak hoặc đi đò nan tại Hang Luồn"
        ],
        "itinerary": [
            { "day": "Ngày 1: Hà Nội - Hạ Long (Ăn Trưa, Tối)", "content": [
                "08:00 - 08:30: Xe đón quý khách tại khu vực Phố Cổ Hà Nội, khởi hành đi Hạ Long.",
                "12:00: Đến cảng quốc tế Tuần Châu. Làm thủ tục nhận phòng trên du thuyền.",
                "13:00: Thưởng thức bữa trưa buffet hải sản trong khi du thuyền di chuyển qua các hòn đảo đá vôi.",
                "15:00: Khám phá Hang Sửng Sốt - hang động lớn và đẹp nhất Vịnh Hạ Long.",
                "16:30: Tự do tắm biển tại bãi biển Ti Tốp hoặc leo lên đỉnh núi ngắm toàn cảnh vịnh.",
                "19:00: Bữa tối sang trọng tại nhà hàng trên du thuyền. Tự do câu mực đêm."
            ]},
            { "day": "Ngày 2: Hạ Long - Hà Nội (Ăn Sáng, Trưa)", "content": [
                "06:30: Tham gia lớp tập Thái Cực Quyền trên boong tàu đón bình minh.",
                "07:30: Ăn sáng nhẹ với trà, cà phê và bánh ngọt.",
                "08:30: Trải nghiệm chèo Kayak khám phá Hang Luồn.",
                "10:00: Trả phòng. Thưởng thức bữa trưa sớm trước khi cập bến.",
                "12:00: Tàu cập bến Tuần Châu. Lên xe khởi hành về Hà Nội.",
                "15:00: Về đến Hà Nội, kết thúc chương trình."
            ]}
        ],
        "included": [
            "Xe Limousine đưa đón khứ hồi Hà Nội - Hạ Long",
            "Phòng nghỉ tiêu chuẩn 5 sao trên du thuyền",
            "Các bữa ăn theo lịch trình",
            "Vé tham quan các điểm trong chương trình",
            "Hướng dẫn viên chuyên nghiệp, nhiệt tình",
            "Bảo hiểm du lịch"
        ],
        "excluded": [
            "Đồ uống trong các bữa ăn",
            "Chi phí cá nhân (giặt là, điện thoại...)",
            "Tiền tip cho HDV và lái xe",
            "Thuế VAT"
        ]
    },
    "t2": {
        "overview": "Hành trình Con đường Di sản Miền Trung sẽ đưa bạn đi từ thành phố biển Đà Nẵng năng động, qua phố cổ Hội An rêu phong trầm mặc, đến với cố đô Huế cổ kính và lăng tẩm uy nghi. Đây là tour du lịch hoàn hảo để tìm hiểu sâu về lịch sử và văn hóa Việt Nam.",
        "highlights": [
            "Check-in Cầu Vàng Bà Nà Hills vang danh thế giới",
            "Dạo bước dưới ánh đèn lồng lung linh của Phố cổ Hội An",
            "Khám phá Đại Nội Huế - hoàng cung của 13 vị vua triều Nguyễn",
            "Thưởng thức tinh hoa ẩm thực Miền Trung: Mì Quảng, Cao Lầu, Bún bò Huế"
        ],
        "itinerary": [
            { "day": "Ngày 1: Đón khách - Đà Nẵng - Hội An (Ăn Trưa, Tối)", "content": [
                "Sáng: Xe đón quý khách tại sân bay Đà Nẵng. Tham quan Bán Đảo Sơn Trà, viếng chùa Linh Ứng.",
                "Trưa: Ăn trưa đặc sản Đà Nẵng. Nhận phòng khách sạn nghỉ ngơi.",
                "Chiều: Khởi hành đi Hội An. Tham quan Phố Cổ: Chùa Cầu, Hội Quán Phước Kiến, Nhà Cổ Tân Ký.",
                "Tối: Ăn tối tại Hội An. Tự do dạo chơi ngắm đèn lồng. Xe đưa đoàn về lại Đà Nẵng."
            ]},
            { "day": "Ngày 2: Bà Nà Hills - Cầu Vàng (Ăn Sáng, Trưa, Tối)", "content": [
                "Sáng: Điểm tâm. Khởi hành lên Bà Nà Hills bằng hệ thống cáp treo đạt 4 kỷ lục Guinness.",
                "Check-in Cầu Vàng với thiết kế đôi bàn tay khổng lồ.",
                "Trưa: Ăn trưa buffet tại Bà Nà.",
                "Chiều: Vui chơi tại Fantasy Park. Rời Bà Nà về lại Đà Nẵng tự do tắm biển Mỹ Khê.",
                "Tối: Ăn tối nhà hàng. Tự do tham quan Cầu Rồng phun lửa, phun nước (nếu vào cuối tuần)."
            ]},
            { "day": "Ngày 3: Đà Nẵng - Cố đô Huế (Ăn Sáng, Trưa, Tối)", "content": [
                "Sáng: Rời Đà Nẵng đi Huế qua hầm Hải Vân. Dừng chân ngắm cảnh vịnh Lăng Cô.",
                "Trưa: Đến Huế, ăn trưa và nhận phòng khách sạn.",
                "Chiều: Tham quan Đại Nội (Hoàng Cung của 13 vị vua triều Nguyễn), viếng chùa Thiên Mụ.",
                "Tối: Ăn tối đặc sản xứ Huế. Ngồi thuyền Rồng nghe Ca Huế trên sông Hương."
            ]},
            { "day": "Ngày 4: Lăng tẩm Huế - Tiễn khách (Ăn Sáng, Trưa)", "content": [
                "Sáng: Điểm tâm. Tham quan Lăng Khải Định với kiến trúc Âu - Á kết hợp tinh xảo.",
                "Mua sắm đặc sản Huế: Mè xửng, nón lá, tôm chua...",
                "Trưa: Ăn trưa nhà hàng.",
                "Chiều: Xe tiễn khách ra sân bay/ga Huế. Kết thúc chương trình."
            ]}
        ],
        "included": [
            "Khách sạn 4 sao (2 người/phòng)",
            "Vé máy bay/xe khứ hồi",
            "Ăn uống theo chương trình",
            "Vé tham quan, vé cáp treo Bà Nà",
            "HDV tiếng Việt nhiệt tình"
        ],
        "excluded": [
            "Vé bảo tàng sáp tại Bà Nà",
            "Chi phí cá nhân",
            "Thuế VAT"
        ]
    },
    "t3": {
        "overview": "Bỏ lại khói bụi thành phố, hành trình Săn mây Tà Xùa và khám phá Cao nguyên Mộc Châu sẽ mang đến cho bạn những khung hình siêu thực của biển mây cuồn cuộn trên 'sống lưng khủng long'. Bạn cũng sẽ được đắm chìm trong vẻ đẹp thơ mộng của đồi chè trái tim và rừng thông bản Áng.",
        "highlights": [
            "Chinh phục 'Sống lưng khủng long' Tà Xùa huyền thoại",
            "Săn biển mây cuồn cuộn lúc bình minh siêu thực",
            "Check-in đồi chè trái tim Mộc Châu xanh mướt",
            "Thưởng thức đặc sản Tây Bắc: Lợn bản nướng, gà đồi, xôi nếp nương"
        ],
        "itinerary": [
            { "day": "Ngày 1: Hà Nội - Mộc Châu - Bắc Yên (Ăn Trưa, Tối)", "content": [
                "06:00: Xe và HDV đón đoàn tại điểm hẹn khởi hành đi Mộc Châu.",
                "10:00: Dừng chân trên đèo Thung Khe chụp ảnh.",
                "12:00: Ăn trưa tại Mộc Châu. Thưởng thức bê chao, lợn bản nướng.",
                "14:00: Tham quan Đồi chè trái tim và Rừng thông Bản Áng.",
                "16:30: Lên xe di chuyển về thị trấn Bắc Yên (Sơn La).",
                "18:30: Nhận phòng khách sạn, ăn tối và nghỉ ngơi sớm chuẩn bị sức khỏe săn mây."
            ]},
            { "day": "Ngày 2: Tà Xùa - Săn mây - Hà Nội (Ăn Sáng, Trưa)", "content": [
                "05:00: Dậy sớm, xe đưa đoàn di chuyển lên xã Tà Xùa đón bình minh và săn mây.",
                "Chinh phục 'Sống lưng khủng long' tại Háng Đồng, chiêm ngưỡng biển mây khổng lồ.",
                "08:30: Quay về thị trấn Bắc Yên ăn sáng.",
                "11:00: Khởi hành về Phù Yên ăn trưa.",
                "13:30: Lên xe về Hà Nội. Dừng chân mua đặc sản sữa Mộc Châu về làm quà.",
                "19:00: Về tới Hà Nội. Chia tay quý khách."
            ]}
        ],
        "included": [
            "Xe ô tô đời mới máy lạnh",
            "Khách sạn tại Bắc Yên (Tiêu chuẩn/Homestay)",
            "Các bữa ăn chính và phụ",
            "Vé tham quan Mộc Châu",
            "Bảo hiểm du lịch 20.000.000 VNĐ"
        ],
        "excluded": [
            "Đồ uống trong bữa ăn",
            "Xe ôm lên sống lưng khủng long (nếu đường trơn)",
            "VAT"
        ]
    },
    "t4": {
        "overview": "Thả mình vào không gian biển đảo thiên đường của Phú Quốc - Đảo Ngọc lớn nhất Việt Nam. Tour kết hợp nghỉ dưỡng cao cấp tại Vinpearl, vui chơi sảng khoái tại VinWonders và khám phá thế giới động vật hoang dã tại Vinpearl Safari lớn nhất Đông Nam Á.",
        "highlights": [
            "Nghỉ dưỡng tiêu chuẩn 5 sao tại Vinpearl Resort Phú Quốc",
            "Phá đảo công viên chủ đề lớn nhất Việt Nam - VinWonders",
            "Tham quan vườn thú bán hoang dã Vinpearl Safari theo mô hình 'Người nhốt, Thú thả'",
            "Thưởng thức hải sản tươi sống tại Chợ đêm Dinh Cậu"
        ],
        "itinerary": [
            { "day": "Ngày 1: Đón bay - VinWonders (Ăn Trưa, Tối)", "content": [
                "Sáng: Đón quý khách tại sân bay Phú Quốc. Xe đưa đoàn về Vinpearl nhận phòng.",
                "Trưa: Ăn trưa buffet tại khách sạn.",
                "Chiều: Vui chơi tại VinWonders - khám phá 6 phân khu theo chủ đề với hàng trăm trò chơi cảm giác mạnh.",
                "Tối: Xem show diễn triệu đô 'Once Show'. Tự do ăn tối và dạo biển đêm."
            ]},
            { "day": "Ngày 2: Vinpearl Safari - Grand World (Ăn Sáng, Trưa, Tối)", "content": [
                "Sáng: Ăn sáng buffet. Xe đưa đoàn đi Vinpearl Safari ngắm nhìn các loài động vật hoang dã từ khắp nơi trên thế giới.",
                "Trưa: Ăn trưa tại nhà hàng.",
                "Chiều: Tham quan 'Thành phố không ngủ' Grand World, đi thuyền trên sông Venice phiên bản Việt.",
                "Tối: Thưởng thức tinh hoa Việt Nam qua show diễn thực cảnh hoành tráng."
            ]},
            { "day": "Ngày 3: Tham quan Đảo - Tiễn khách (Ăn Sáng, Trưa)", "content": [
                "Sáng: Điểm tâm. Trả phòng. Xe đưa đoàn tham quan cơ sở nuôi cấy ngọc trai, nhà thùng nước mắm, vườn tiêu.",
                "Trưa: Ăn trưa với món Gỏi cá trích đặc sản Phú Quốc.",
                "Chiều: Xe tiễn khách ra sân bay. Tạm biệt Đảo Ngọc."
            ]}
        ],
        "included": [
            "Phòng Vinpearl Resort 5 sao",
            "Vé vui chơi VinWonders và Safari",
            "Ăn uống: 2 bữa sáng, 3 bữa trưa, 2 bữa tối",
            "Xe đưa đón tại Phú Quốc",
            "HDV địa phương"
        ],
        "excluded": [
            "Vé máy bay khứ hồi (Giá tuỳ thời điểm)",
            "Chi phí cá nhân",
            "Bồi dưỡng HDV"
        ]
    },
    "t5": {
        "overview": "Đà Lạt - Thành phố ngàn hoa với thời tiết se lạnh quanh năm luôn là điểm đến chữa lành lý tưởng. Khám phá vẻ đẹp cổ kính của kiến trúc Pháp, thưởng thức nông sản sạch và đắm chìm trong bầu không khí lãng mạn tại các nông trại, thác nước tuyệt đẹp.",
        "highlights": [
            "Check-in các tọa độ cực hot: Puppy Farm, Nông trại Cừu",
            "Khám phá Thác Datanla hoang sơ hùng vĩ",
            "Chiêm ngưỡng kiến trúc Châu Âu thu nhỏ tại Quảng trường Lâm Viên",
            "Thưởng thức buffet rau không giới hạn"
        ],
        "itinerary": [
            { "day": "Ngày 1: Đón khách - Đà Lạt mộng mơ (Ăn Trưa, Tối)", "content": [
                "Sáng: Xe đón khách tại Sân bay Liên Khương. Di chuyển về trung tâm thành phố.",
                "Trưa: Ăn trưa nhà hàng. Nhận phòng khách sạn.",
                "Chiều: Tham quan Ga Đà Lạt - nhà ga cổ kính nhất Đông Dương. Tham quan Chùa Linh Phước (Chùa Ve Chai).",
                "Tối: Tự do dạo Chợ Đêm Đà Lạt, thưởng thức bánh tráng nướng, sữa đậu nành nóng."
            ]},
            { "day": "Ngày 2: Thiên nhiên & Nông Trại (Ăn Sáng, Trưa, Tối)", "content": [
                "Sáng: Tham quan Puppy Farm (Trại chó thông minh) và đồi hoa rực rỡ. Ghé thăm vườn dâu tây công nghệ cao.",
                "Trưa: Thưởng thức Buffet Rau Leguda nổi tiếng trên đồi Robin.",
                "Chiều: Tham quan Thác Datanla. Trải nghiệm máng trượt xuyên rừng lớn nhất Đông Nam Á (tự túc chi phí máng trượt).",
                "Tối: Ăn tối nhà hàng. Giao lưu văn hóa Cồng chiêng Tây Nguyên và thưởng thức thịt nướng, rượu cần (tự túc chi phí)."
            ]},
            { "day": "Ngày 3: Thiền Viện Trúc Lâm - Tiễn khách (Ăn Sáng, Trưa)", "content": [
                "Sáng: Trả phòng. Khởi hành đi Thiền Viện Trúc Lâm, ngắm toàn cảnh Hồ Tuyền Lâm bình yên.",
                "Mua sắm đặc sản Đà Lạt (mứt, trà Atiso, hoa quả sấy).",
                "Trưa: Ăn trưa tại nhà hàng địa phương.",
                "Chiều: Xe tiễn khách ra sân bay. Chào tạm biệt Đà Lạt."
            ]}
        ],
        "included": [
            "Xe ô tô đời mới di chuyển suốt tuyến",
            "Khách sạn 3 sao ngay trung tâm",
            "Các bữa ăn theo lịch trình",
            "Vé tham quan các điểm",
            "Nước suối, nón du lịch"
        ],
        "excluded": [
            "Vé cáp treo đồi Robin, máng trượt Datanla",
            "Giao lưu cồng chiêng",
            "Chi phí mua sắm"
        ]
    },
    "t6": {
        "overview": "Một hành trình về miền sông nước Cửu Long, nơi người dân sống hiền hòa trên những chiếc xuồng ba lá, len lỏi qua các rặng dừa nước xanh um. Tour Cần Thơ - Bến Tre - Châu Đốc mang đến những trải nghiệm đậm chất Nam Bộ khó quên.",
        "highlights": [
            "Ngồi thuyền tham quan Chợ nổi Cái Răng nhộn nhịp lúc bình minh",
            "Trải nghiệm xuồng chèo len lỏi qua rạch dừa nước tại Bến Tre",
            "Viếng Miếu Bà Chúa Xứ linh thiêng tại Châu Đốc",
            "Thưởng thức trái cây miệt vườn và nghe Đờn ca tài tử"
        ],
        "itinerary": [
            { "day": "Ngày 1: TP.HCM - Bến Tre - Cần Thơ (Ăn Trưa, Tối)", "content": [
                "Sáng: Khởi hành từ TP.HCM đi Mỹ Tho. Lên thuyền du ngoạn sông Tiền.",
                "Ghé cù lao Thới Sơn (Cồn Lân) thưởng thức trái cây, nghe Đờn ca tài tử. Trải nghiệm xuồng chèo rạch nhỏ.",
                "Trưa: Ăn trưa với đặc sản cá tai tượng chiên xù. Thăm cơ sở làm kẹo dừa.",
                "Chiều: Xe đưa đoàn đi Cần Thơ. Vượt cầu Mỹ Thuận và cầu Cần Thơ.",
                "Tối: Ăn tối trên du thuyền Cần Thơ. Ngắm Bến Ninh Kiều lung linh."
            ]},
            { "day": "Ngày 2: Chợ nổi Cái Răng - Châu Đốc (Ăn Sáng, Trưa, Tối)", "content": [
                "Sáng sớm: Ra bến tàu tham quan Chợ nổi Cái Răng - nét văn hóa độc đáo của miền Tây.",
                "Tham quan Lò hủ tiếu truyền thống.",
                "Trưa: Trả phòng. Ăn trưa. Khởi hành đi Châu Đốc (An Giang).",
                "Chiều: Đến Châu Đốc. Viếng Miếu Bà Chúa Xứ Núi Sam, Lăng Thoại Ngọc Hầu, Chùa Tây An.",
                "Tối: Nhận phòng khách sạn. Tự do dạo phố, thuê xe lôi đạp quanh thị xã."
            ]},
            { "day": "Ngày 3: Rừng Tràm Trà Sư - TP.HCM (Ăn Sáng, Trưa)", "content": [
                "Sáng: Khởi hành đi Rừng Tràm Trà Sư. Ngồi tắc ráng len lỏi giữa thảm bèo xanh mướt ngắm các loài chim nước.",
                "Trưa: Ăn trưa với lẩu lươn, cá lóc nướng trui.",
                "Chiều: Khởi hành về lại TP.HCM. Ghé Sa Đéc mua nem Lai Vung làm quà.",
                "18:00: Về đến TP.HCM. Kết thúc hành trình miền Tây."
            ]}
        ],
        "included": [
            "Xe đời mới đưa đón",
            "Thuyền tham quan Chợ Nổi, xuồng chèo Bến Tre, tắc ráng Trà Sư",
            "Khách sạn 3 sao",
            "Ăn uống: 2 bữa sáng, 3 bữa trưa, 2 bữa tối",
            "HDV am hiểu văn hóa Nam Bộ"
        ],
        "excluded": [
            "Chi phí vui chơi cá nhân",
            "Tiền tip"
        ]
    },
    "t7": {
        "overview": "Đảo ngọc kỳ vỹ giữa trùng khơi, Côn Đảo không chỉ mang dấu ấn lịch sử hào hùng mà còn sở hữu những bãi biển hoang sơ, làn nước trong vắt cùng hệ sinh thái san hô rực rỡ. Nơi đây là sự kết hợp hoàn hảo giữa du lịch tâm linh và nghỉ dưỡng cao cấp.",
        "highlights": [
            "Viếng Nghĩa trang Hàng Dương, mộ cô Sáu lúc nửa đêm linh thiêng",
            "Khám phá nhà tù Côn Đảo - 'địa ngục trần gian' một thời",
            "Tắm biển tại Bãi Đầm Trầu - bãi biển đẹp nhất Côn Đảo ngắm máy bay cất cánh",
            "Trải nghiệm lặn ngắm san hô tại Hòn Bảy Cạnh"
        ],
        "itinerary": [
            { "day": "Ngày 1: Đón khách - Lịch sử Côn Đảo (Ăn Trưa, Tối)", "content": [
                "Sáng: Đón đoàn tại Cảng Bến Đầm hoặc sân bay Cỏ Ống. Đưa về thị trấn.",
                "Trưa: Ăn trưa tại nhà hàng, nhận phòng khách sạn nghỉ ngơi.",
                "Chiều: Tham quan hệ thống Di tích Lịch sử: Trại Phú Hải, Chuồng Cọp Pháp, Chuồng Cọp Mỹ, Miếu bà Phi Yến.",
                "Tối: Ăn tối. 23h30: Xe đưa đoàn đi viếng Nghĩa trang Hàng Dương, mộ nữ anh hùng Võ Thị Sáu."
            ]},
            { "day": "Ngày 2: Thiên nhiên hoang sơ Côn Đảo (Ăn Sáng, Trưa, Tối)", "content": [
                "Sáng: Đi tàu cano ra Hòn Bảy Cạnh hoặc Hòn Cau. Trải nghiệm lặn ngắm san hô (snorkeling) tuyệt đẹp.",
                "Tìm hiểu hoạt động bảo tồn rùa biển (nếu vào mùa sinh sản).",
                "Trưa: Ăn trưa hải sản trên cano hoặc tại đảo.",
                "Chiều: Về lại đảo lớn. Tham quan và tắm biển tại Bãi Đầm Trầu, ngắm máy bay bay sát trên đầu.",
                "Tối: Ăn tối tự do khám phá Côn Đảo về đêm."
            ]},
            { "day": "Ngày 3: Mua sắm - Tạm biệt (Ăn Sáng)", "content": [
                "Sáng: Ăn sáng. Tự do dạo Chợ Côn Đảo mua hải sản tươi sống, mứt hạt bàng đặc sản.",
                "Trưa: Trả phòng khách sạn. Xe đưa khách ra cảng/sân bay. Kết thúc tour."
            ]}
        ],
        "included": [
            "Xe ô tô đưa đón tại Côn Đảo",
            "Cano đi lặn ngắm san hô + kính lặn, áo phao",
            "Phòng khách sạn/Resort",
            "Vé tham quan các di tích",
            "Đồ viếng chung cho đoàn tại Nghĩa trang"
        ],
        "excluded": [
            "Vé tàu/vé máy bay ra Côn Đảo",
            "Bữa ăn chính (du khách tự túc gọi món theo sở thích)"
        ]
    },
    "t8": {
        "overview": "Ninh Bình từ lâu đã nổi tiếng với danh xưng 'Vịnh Hạ Long trên cạn'. Khám phá quần thể di sản thế giới Tràng An, chiêm bái ngôi chùa Bái Đính lớn nhất Đông Nam Á, và chinh phục tuyệt tình cốc Hang Múa để có những bức ảnh triệu like.",
        "highlights": [
            "Ngồi đò mộc xuyên qua các hang động xuyên thủy tại Tràng An",
            "Chinh phục 500 bậc đá Hang Múa ngắm toàn cảnh Tam Cốc",
            "Chiêm bái Chùa Bái Đính với hàng trăm pho tượng La Hán",
            "Thưởng thức đặc sản thịt dê núi Ninh Bình nổi tiếng"
        ],
        "itinerary": [
            { "day": "Sáng: Hà Nội - Bái Đính", "content": [
                "07:30: Xe Limousine đón quý khách tại khu vực Phố Cổ Hà Nội khởi hành đi Ninh Bình.",
                "09:30: Đến Ninh Bình. Quý khách di chuyển bằng xe điện vào tham quan Chùa Bái Đính.",
                "Tham quan tháp chuông lớn nhất Việt Nam, hành lang La Hán, điện Quan Âm."
            ]},
            { "day": "Trưa: Thưởng thức đặc sản", "content": [
                "12:30: Ăn trưa tại nhà hàng địa phương với đặc sản dê núi Ninh Bình, cơm cháy."
            ]},
            { "day": "Chiều: Tràng An - Hang Múa - Hà Nội", "content": [
                "14:00: Lên thuyền tham quan Quần thể Danh thắng Tràng An (Di sản UNESCO). Đò đi qua các hang động tối, sáng, hang nấu rượu...",
                "16:30: Chinh phục Hang Múa. Vượt qua 500 bậc đá để lên tới đỉnh ngọn núi ngắm nhìn toàn cảnh Tam Cốc hùng vĩ lúc hoàng hôn.",
                "18:00: Lên xe trở về Hà Nội.",
                "20:00: Trả khách tại điểm đón ban đầu. Kết thúc hành trình 1 ngày đầy thú vị."
            ]}
        ],
        "included": [
            "Xe Limousine khứ hồi Hà Nội - Ninh Bình",
            "Vé đò Tràng An",
            "Vé tham quan Hang Múa",
            "Xe điện chùa Bái Đính",
            "Ăn trưa buffet/set menu tiêu chuẩn",
            "HDV tiếng Việt/Anh"
        ],
        "excluded": [
            "Đồ uống trong bữa ăn",
            "Chi phí mua sắm, hương hoa lễ phật",
            "Tip cho HDV và lái đò"
        ]
    }
};

// Inject content into tours data
tours = tours.map(t => {
    if (tourContentMap[t.id]) {
        return { ...t, ...tourContentMap[t.id] };
    }
    return t;
});

fs.writeFileSync(toursJsonPath, JSON.stringify(tours, null, 2), 'utf8');
console.log('1. Updated tours.json');

// 2. Modify tour-detail.html
let htmlContent = fs.readFileSync(tourDetailHtmlPath, 'utf8');

// The HTML contains a section for the overview and itinerary. We need to replace it.
// We'll replace the inner HTML of the overview and itinerary wrapper to be empty containers with IDs.
// Actually, it's safer to use regex or string replacement on specific chunks.

const htmlReplacement = `
            <!-- Overview section -->
            <div class="tour-section" id="tour-overview">
                <!-- Injected via JS -->
            </div>

            <!-- Highlights section -->
            <div class="tour-section">
                <h2 class="text-h2 text-on-surface u-mb-md">Điểm nhấn hành trình</h2>
                <ul class="tour-highlights" id="tour-highlights">
                    <!-- Injected via JS -->
                </ul>
            </div>

            <!-- Itinerary section -->
            <div class="tour-section" id="tour-itinerary-section">
                <h2 class="text-h2 text-on-surface u-mb-md">Lịch trình chi tiết</h2>
                <div class="tour-itinerary" id="tour-itinerary">
                    <!-- Injected via JS -->
                </div>
            </div>
            
            <!-- Included / Excluded section -->
            <div class="tour-section">
                <h2 class="text-h2 text-on-surface u-mb-md">Dịch vụ Tour</h2>
                <div style="display: flex; gap: 32px; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 300px;">
                        <h3 class="text-h5 text-primary u-mb-sm"><span class="material-symbols-outlined" style="vertical-align: middle; margin-right: 8px;">check_circle</span>Bao gồm</h3>
                        <ul class="tour-includes" id="tour-included" style="list-style: none; padding-left: 0;">
                        </ul>
                    </div>
                    <div style="flex: 1; min-width: 300px;">
                        <h3 class="text-h5 text-error u-mb-sm"><span class="material-symbols-outlined" style="vertical-align: middle; margin-right: 8px;">cancel</span>Không bao gồm</h3>
                        <ul class="tour-excludes" id="tour-excluded" style="list-style: none; padding-left: 0;">
                        </ul>
                    </div>
                </div>
            </div>
`;

// Find the section that starts with <div class="tour-section"> containing "Tổng quan" and ends before "Bình luận"
const startMarker = '<h2 class="text-h2 text-on-surface u-mb-md">Tổng quan</h2>';
const endMarker = '<!-- Reviews -->';

const startIndex = htmlContent.indexOf(startMarker);
const endIndex = htmlContent.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    // Also we need to get the parent div of startMarker. It's <div class="tour-section">
    const blockStart = htmlContent.lastIndexOf('<div class="tour-section">', startIndex);
    htmlContent = htmlContent.substring(0, blockStart) + htmlReplacement + htmlContent.substring(endIndex);
    fs.writeFileSync(tourDetailHtmlPath, htmlContent, 'utf8');
    console.log('2. Updated tour-detail.html');
} else {
    console.log('Could not find markers in tour-detail.html');
}

// 3. Update tour-detail.js to render data
let jsContent = fs.readFileSync(tourDetailJsPath, 'utf8');
const injectionCode = `
        // --- DYNAMIC CONTENT INJECTION ---
        const overviewEl = document.getElementById('tour-overview');
        if (overviewEl && tour.overview) {
            overviewEl.innerHTML = \`<h2 class="text-h2 text-on-surface u-mb-md">Tổng quan</h2><p class="text-body text-on-surface-variant">\${tour.overview}</p>\`;
        }

        const highlightsEl = document.getElementById('tour-highlights');
        if (highlightsEl && tour.highlights) {
            highlightsEl.innerHTML = tour.highlights.map(h => \`
                <li class="u-flex u-items-start u-mb-sm">
                    <span class="material-symbols-outlined text-primary" style="margin-right: 12px;">check</span>
                    <span class="text-body text-on-surface-variant">\${h}</span>
                </li>
            \`).join('');
        }

        const itineraryEl = document.getElementById('tour-itinerary');
        if (itineraryEl && tour.itinerary) {
            itineraryEl.innerHTML = tour.itinerary.map((day, idx) => \`
                <div class="itinerary-day \${idx === 0 ? 'active' : ''}">
                    <h3 class="text-h4 text-primary u-mb-sm">\${day.day}</h3>
                    <ul class="text-body text-on-surface-variant" style="padding-left: 20px; list-style-type: disc;">
                        \${day.content.map(c => \`<li style="margin-bottom: 8px;">\${c}</li>\`).join('')}
                    </ul>
                </div>
            \`).join('');
        }

        const includedEl = document.getElementById('tour-included');
        if (includedEl && tour.included) {
            includedEl.innerHTML = tour.included.map(i => \`
                <li style="margin-bottom: 8px; color: var(--color-on-surface-variant);"><span class="material-symbols-outlined" style="font-size: 16px; color: var(--color-primary); margin-right: 8px; vertical-align: middle;">done</span>\${i}</li>
            \`).join('');
        }

        const excludedEl = document.getElementById('tour-excluded');
        if (excludedEl && tour.excluded) {
            excludedEl.innerHTML = tour.excluded.map(e => \`
                <li style="margin-bottom: 8px; color: var(--color-on-surface-variant);"><span class="material-symbols-outlined" style="font-size: 16px; color: var(--color-error); margin-right: 8px; vertical-align: middle;">close</span>\${e}</li>
            \`).join('');
        }
        // --- END DYNAMIC CONTENT INJECTION ---
`;

// Insert the injectionCode right after imgEl.src = tour.image;
if (jsContent.includes('if (imgEl) imgEl.src = tour.image;')) {
    jsContent = jsContent.replace('if (imgEl) imgEl.src = tour.image;', 'if (imgEl) imgEl.src = tour.image;\n' + injectionCode);
    fs.writeFileSync(tourDetailJsPath, jsContent, 'utf8');
    console.log('3. Updated tour-detail.js');
} else {
    console.log('Could not find injection point in tour-detail.js');
}

