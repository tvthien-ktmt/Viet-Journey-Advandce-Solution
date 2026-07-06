import type { LucideIcon } from 'lucide-react';
import {
  Plane,
  Luggage,
  Armchair,
  UtensilsCrossed,
  Sofa,
  Hotel,
  Car,
  ShieldCheck,
} from 'lucide-react';

export interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
}

export const airports: Airport[] = [
  { code: 'HAN', city: 'Hà Nội', name: 'Sân bay quốc tế Nội Bài', country: 'Việt Nam' },
  { code: 'SGN', city: 'TP. Hồ Chí Minh', name: 'Sân bay quốc tế Tân Sơn Nhất', country: 'Việt Nam' },
  { code: 'DAD', city: 'Đà Nẵng', name: 'Sân bay quốc tế Đà Nẵng', country: 'Việt Nam' },
  { code: 'PQC', city: 'Phú Quốc', name: 'Sân bay quốc tế Phú Quốc', country: 'Việt Nam' },
  { code: 'HPH', city: 'Hải Phòng', name: 'Sân bay quốc tế Cát Bi', country: 'Việt Nam' },
  { code: 'CXR', city: 'Nha Trang', name: 'Sân bay quốc tế Cam Ranh', country: 'Việt Nam' },
  { code: 'HUI', city: 'Huế', name: 'Sân bay quốc tế Phú Bài', country: 'Việt Nam' },
  { code: 'VCA', city: 'Cần Thơ', name: 'Sân bay quốc tế Cần Thơ', country: 'Việt Nam' },
  { code: 'DLK', city: 'Đà Lạt', name: 'Sân bay Liên Khương', country: 'Việt Nam' },
  { code: 'VDO', city: 'Vân Đồn', name: 'Sân bay quốc tế Vân Đồn', country: 'Việt Nam' },
  { code: 'VTE', city: 'Viêng Chăn', name: 'Wattay International Airport', country: 'Lào' },
  { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi Airport', country: 'Thái Lan' },
  { code: 'SIN', city: 'Singapore', name: 'Changi Airport', country: 'Singapore' },
  { code: 'ICN', city: 'Seoul', name: 'Incheon International Airport', country: 'Hàn Quốc' },
  { code: 'NRT', city: 'Tokyo', name: 'Narita International Airport', country: 'Nhật Bản' },
  { code: 'PEK', city: 'Bắc Kinh', name: 'Beijing Capital International Airport', country: 'Trung Quốc' },
  { code: 'SYD', city: 'Sydney', name: 'Sydney Kingsford Smith Airport', country: 'Úc' },
  { code: 'LHR', city: 'London', name: 'Heathrow Airport', country: 'Anh' },
  { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle Airport', country: 'Pháp' },
  { code: 'FRA', city: 'Frankfurt', name: 'Frankfurt Airport', country: 'Đức' },
];

export const IMAGES = {
  hero: 'https://sfile.chatglm.cn/images-ppt/cf3508b20af5.jpg',
  tarmac: 'https://sfile.chatglm.cn/images-ppt/bce3f37a7a6a.jpg',
  cabin: 'https://sfile.chatglm.cn/images-ppt/aca7ad649d65.jpg',
  hanoi: 'https://sfile.chatglm.cn/images-ppt/6a2466c6930d.jpg',
  hcmc: 'https://sfile.chatglm.cn/images-ppt/d6d65765d80f.jpg',
  danang: 'https://sfile.chatglm.cn/images-ppt/7807c2ec7967.jpg',
  phuquoc: 'https://sfile.chatglm.cn/images-ppt/073f3f885f55.jpg',
  halong: 'https://sfile.chatglm.cn/images-ppt/ff021376421b.jpg',
  nhatrang: 'https://sfile.chatglm.cn/images-ppt/f492a96e4f71.jpeg',
  hue: 'https://sfile.chatglm.cn/images-ppt/54097590f36c.jpg',
} as const;

export interface Destination {
  code: string;
  city: string;
  cityEn: string;
  country: string;
  image: string;
  fromPriceVND: number;
}

export const destinations: Destination[] = [
  { code: 'HAN', city: 'Hà Nội', cityEn: 'Hanoi', country: 'Việt Nam', image: IMAGES.hanoi, fromPriceVND: 1290000 },
  { code: 'SGN', city: 'TP. Hồ Chí Minh', cityEn: 'Ho Chi Minh City', country: 'Việt Nam', image: IMAGES.hcmc, fromPriceVND: 1190000 },
  { code: 'DAD', city: 'Đà Nẵng', cityEn: 'Da Nang', country: 'Việt Nam', image: IMAGES.danang, fromPriceVND: 1490000 },
  { code: 'PQC', city: 'Phú Quốc', cityEn: 'Phu Quoc', country: 'Việt Nam', image: IMAGES.phuquoc, fromPriceVND: 1890000 },
  { code: 'VDO', city: 'Hạ Long', cityEn: 'Ha Long', country: 'Việt Nam', image: IMAGES.halong, fromPriceVND: 1750000 },
  { code: 'CXR', city: 'Nha Trang', cityEn: 'Nha Trang', country: 'Việt Nam', image: IMAGES.nhatrang, fromPriceVND: 1690000 },
  { code: 'HUI', city: 'Huế', cityEn: 'Hue', country: 'Việt Nam', image: IMAGES.hue, fromPriceVND: 1390000 },
];

export interface Offer {
  id: string;
  image: string;
  badge: string;
  title: string;
  excerpt: string;
  validity: string;
}

export const offers: Offer[] = [
  { id: 'o1', image: IMAGES.phuquoc, badge: '-30%', title: 'Bay đến Phú Quốc — Giảm 30%', excerpt: 'Tận hưởng kỳ nghỉ biển tuyệt vời tại đảo ngọc Phú Quốc với giá ưu đãi.', validity: 'Áp dụng đến 31/12/2025' },
  { id: 'o2', image: IMAGES.halong, badge: '-25%', title: 'Khám phá Vịnh Hạ Long', excerpt: 'Bay đến Vân Đồn, khám phá kỳ quan thiên nhiên thế giới.', validity: 'Áp dụng đến 30/09/2025' },
  { id: 'o3', image: IMAGES.cabin, badge: 'Business', title: 'Nâng hạng Thương gia', excerpt: 'Trải nghiệm dịch vụ Thương gia với ưu đãi đặt biệt cho hội viên Lotusmiles.', validity: 'Áp dụng đến 31/10/2025' },
  { id: 'o4', image: IMAGES.tarmac, badge: 'Mới', title: 'Tuyến mới Hà Nội — Sydney', excerpt: 'Khởi hành thẳng tới Sydney với giá ưu đãi khai trương.', validity: 'Đặt vé từ 01/07/2025' },
];

export interface Slide {
  id: string;
  image: string;
  title: string;
  text: string;
  cta: string;
}

export const slides: Slide[] = [
  { id: 's1', image: IMAGES.hero, title: 'Bay cùng Việt Nam', text: 'Hơn 1.000 chuyến bay mỗi ngày tới 60 điểm đến trên toàn thế giới.', cta: 'Đặt vé ngay' },
  { id: 's2', image: IMAGES.phuquoc, title: 'Đón hè trên đảo ngọc Phú Quốc', text: 'Giảm đến 30% vé bay đến Phú Quốc — kỳ nghỉ biển trong mơ đang chờ bạn.', cta: 'Xem ưu đãi' },
  { id: 's3', image: IMAGES.cabin, title: 'Trải nghiệm Thương gia đẳng cấp', text: 'Ghế ngả phẳng, suất ăn mang phong cách Việt, phòng chờ sang trọng.', cta: 'Khám phá' },
  { id: 's4', image: IMAGES.tarmac, title: 'Đội bay thế hệ mới', text: 'Airbus A350 và Boeing 787 — bay êm ái, thân thiện môi trường.', cta: 'Tìm hiểu thêm' },
];

export interface ServiceItem {
  icon: LucideIcon;
  label: string;
  desc: string;
}

export const services: ServiceItem[] = [
  { icon: Luggage, label: 'Hành lý siêu trọng', desc: 'Mua thêm hành lý siêu trọng với giá ưu đãi.' },
  { icon: Armchair, label: 'Chọn chỗ ngồi', desc: 'Chọn trước chỗ ngồi yêu thích của bạn.' },
  { icon: UtensilsCrossed, label: 'Suất ăn đặc biệt', desc: 'Đặt suất ăn đặc biệt theo nhu cầu.' },
  { icon: Sofa, label: 'Phòng chờ', desc: 'Trải nghiệm phòng chờ cao cấp trước chuyến bay.' },
  { icon: Luggage, label: 'Mua thêm hành lý', desc: 'Mua thêm hành lý ký gửi dễ dàng.' },
  { icon: Hotel, label: 'Đặt khách sạn', desc: 'Đặt phòng khách sạn cùng Vietnam Airlines.' },
  { icon: Car, label: 'Thuê xe', desc: 'Dịch vụ đưa đón và thuê xe tận nơi.' },
  { icon: ShieldCheck, label: 'Bảo hiểm du lịch', desc: 'Bảo vệ chuyến đi với bảo hiểm du lịch.' },
];

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
}

export const news: NewsItem[] = [
  { id: 'n1', title: 'Vietnam Airlines khai trương đường bay thẳng Hà Nội — Sydney', date: '15/06/2025', excerpt: 'Từ tháng 7/2025, Vietnam Airlines chính thức khai trương đường bay thẳng giữa Hà Nội và Sydney, rút ngắn thời gian di chuyển giữa Việt Nam và Úc.' },
  { id: 'n2', title: 'Đón thành công chiếc Airbus A350 thứ mười', date: '02/06/2025', excerpt: 'Việc đưa vào hoạt động thêm chiếc Airbus A350 góp phần nâng cao chất lượng dịch vụ và giảm phát thải trên các đường bay dài.' },
  { id: 'n3', title: 'Chương trình Lotusmiles — Tích lũy dặm bay mọi lúc', date: '20/05/2025', excerpt: 'Hội viên Lotusmiles nay có thể tích lũy dặm bay khi mua sắm cùng đối tác, mở ra nhiều cơ hội nâng hạng thẻ.' },
  { id: 'n4', title: 'Vietnam Airlines đạt chứng nhận an toàn IOSA lần thứ 8', date: '08/05/2025', excerpt: 'Tiếp tục khẳng định cam kết về an toàn, Vietnam Airlines được IATA gia hạn chứng nhận IOSA cho giai đoạn 2025–2027.' },
];

export interface LotusTier {
  name: string;
  threshold: string;
  accent: string;
  ring: string;
  perks: string[];
}

export const lotusTiers: LotusTier[] = [
  { name: 'Ocean', threshold: '0 — 9.999 dặm', accent: 'text-sky-600', ring: 'border-sky-200', perks: ['Tích lũy dặm bay trên mọi chuyến', 'Ưu tiên nhận thông tin khuyến mãi', 'Đổi vé phần thưởng nội địa'] },
  { name: 'Titanium', threshold: '10.000 — 29.999 dặm', accent: 'text-slate-500', ring: 'border-slate-300', perks: ['Nhận thêm 25% dặm thưởng', 'Ưu tiên nhận phòng chờ (có phí)', 'Quyền chọn chỗ ngồi ưu tiên'] },
  { name: 'Platinum', threshold: '30.000 — 79.999 dặm', accent: 'text-cyan-700', ring: 'border-cyan-300', perks: ['Nhận thêm 50% dặm thưởng', 'Phòng chờ thương gia miễn phí', 'Ưu tiên làm thủ tục & kiểm soát an ninh'] },
  { name: 'Gold', threshold: '80.000+ dặm', accent: 'text-amber-600', ring: 'border-amber-300', perks: ['Nhận thêm 100% dặm thưởng', 'Nâng hạng miễn phí (có điều kiện)', 'Phòng chờ quốc tế cao cấp', 'Quyền ưu tiên tối đa trên mọi chuyến'] },
];

export interface TravelClass {
  id: string;
  name: string;
  nameEn: string;
  desc: string;
  features: string[];
}

export const travelClasses: TravelClass[] = [
  { id: 'economy', name: 'Phổ thông', nameEn: 'Economy', desc: 'Hạng ghế phổ thông thoải mái với suất ăn mang phong cách Việt và hệ thống giải trí phong phú.', features: ['Chỗ ngồi rộng 32–34 inch', 'Ghế ngả thoải mái', 'Suất ăn nóng phong cách Việt', 'Giải trí cá nhân 10.4 inch', 'Hành lý ký gửi 23 kg'] },
  { id: 'economy-special', name: 'Phổ thông đặc biệt', nameEn: 'Premium Economy', desc: 'Không gian rộng rãi hơn, ghế ngả sâu và dịch vụ ưu tiên dành cho hành khách Phổ thông đặc biệt.', features: ['Chỗ ngồi rộng 36 inch', 'Ghế ngả sâu & tựa chân', 'Suất ăn ưu tiên phong cách Á Đông', 'Màn hình giải trí 13.3 inch', 'Hành lý ký gửi 23 kg × 2', 'Ưu tiên lên máy bay'] },
  { id: 'business', name: 'Thương gia', nameEn: 'Business', desc: 'Trải nghiệm Thương gia đẳng cấp với ghế ngả phẳng, phòng chờ sang trọng và thực đơn cao cấp.', features: ['Ghế ngả phẳng 180°', 'Khoảng cách ghế 74 inch', 'Phòng chờ Thương gia miễn phí', 'Thực đơn cao cấp & rượu vang', 'Hành lý ký gửi 30 kg × 2', 'Ưu tiên mọi khâu thủ tục'] },
  { id: 'premium', name: 'Thương nhân', nameEn: 'Premium Business', desc: 'Trải nghiệm hàng không tối cao — dịch vụ cá nhân hoá, ghế sang trọng và ẩm thực Fine Dining.', features: ['Ghế Suite riêng tư có cửa', 'Nệm trải giường cao cấp', 'Fine Dining theo yêu cầu', 'Bộ tiện nghi hành khách cao cấp', 'Đưa đón limousine sân bay', 'Phòng chờ Premium riêng'] },
];

export type CabinId = 'economy' | 'economy-special' | 'business' | 'premium';

export const cabinList: { id: CabinId; labelVn: string; labelEn: string; multiplier: number }[] = [
  { id: 'economy', labelVn: 'Phổ thông', labelEn: 'Economy', multiplier: 1 },
  { id: 'economy-special', labelVn: 'Phổ thông đặc biệt', labelEn: 'Premium Economy', multiplier: 1.6 },
  { id: 'business', labelVn: 'Thương gia', labelEn: 'Business', multiplier: 3 },
  { id: 'premium', labelVn: 'Thương nhân', labelEn: 'Premium Business', multiplier: 4.5 },
];

export const aircraftList = ['Airbus A321', 'Airbus A350', 'Boeing 787', 'Airbus A330'] as const;
export const planeIcon = Plane;
