import { IMAGES } from './images';

export interface Blog {
  id?: string | number;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: string;
  date?: string;
  category?: string;
  readTime?: string;
  coverImage?: string;
}

export const BLOGS: Blog[] = [
  {
    id: 1, slug: 'khai-truong-ha-noi-sydney', date: '2025-06-15',
    title: 'Vietnam Airlines khai trương đường bay thẳng Hà Nội — Sydney',
    excerpt: 'Từ tháng 7/2025, Vietnam Airlines chính thức khai trương đường bay thẳng giữa Hà Nội và Sydney, rút ngắn thời gian di chuyển giữa Việt Nam và Úc.',
    coverImage: IMAGES.planeOnGround,
    content: `<p>Từ tháng 7/2025, Vietnam Airlines chính thức khai trương đường bay thẳng giữa Hà Nội và Sydney...</p><h2>Lịch bay</h2><p>Chuyến bay VN001 khởi hành từ Hà Nội lúc 23:45...</p><h2>Giá vé</h2><p>Từ 8.500.000 ₫ cho hạng phổ thông...</p>`,
  },
  {
    id: 2, slug: 'a350-thu-10', date: '2025-06-02',
    title: 'Đón thành công chiếc Airbus A350 thứ mười',
    excerpt: 'Việc đưa vào hoạt động thêm chiếc Airbus A350 góp phần nâng cao chất lượng dịch vụ và giảm phát thải trên các đường bay dài.',
    coverImage: IMAGES.planeOnGround,
    content: `<p>Vietnam Airlines đã chính thức nhận chiếc Airbus A350 thứ 10...</p>`,
  },
  {
    id: 3, slug: 'lotusmiles-tich-luy', date: '2025-05-20',
    title: 'Lotusmiles — Tích lũy dặm bay mọi lúc',
    excerpt: 'Hội viên Lotusmiles nay có thể tích lũy dặm bay khi mua sắm cùng đối tác, mở ra nhiều cơ hội nâng hạng thẻ.',
    coverImage: IMAGES.summerPromo,
    content: `<p>Chương trình Lotusmiles mở rộng đối tác tích lũy...</p>`,
  },
  {
    id: 4, slug: 'iosa-lan-8', date: '2025-05-08',
    title: 'Vietnam Airlines đạt chứng nhận IOSA lần thứ 8',
    excerpt: 'Tiếp tục khẳng định cam kết về an toàn, Vietnam Airlines được IATA gia hạn chứng nhận IOSA cho giai đoạn 2025–2027.',
    coverImage: IMAGES.businessCabin,
    content: `<p>IATA đã gia hạn chứng nhận IOSA cho Vietnam Airlines...</p>`,
  },
  {
    id: 5, slug: 'phu-quoc-summer', date: '2025-04-15',
    title: 'Hè 2025 — Bay đến Phú Quốc với giá từ 890.000 ₫',
    excerpt: 'Tận hưởng kỳ nghỉ biển tuyệt vời tại đảo ngọc Phú Quốc với giá ưu đãi đặc biệt.',
    coverImage: IMAGES.phuquoc,
    content: `<p>Chương trình ưu đãi Hè 2025...</p>`,
  },
  {
    id: 6, slug: 'thuong-gia-trai-nghiem', date: '2025-03-20',
    title: 'Trải nghiệm Thương gia đẳng cấp trên Boeing 787',
    excerpt: 'Ghế ngả phẳng, suất ăn mang phong cách Việt, phòng chờ sang trọng — tất cả dành cho hành khách Thương gia.',
    coverImage: IMAGES.businessCabin,
    content: `<p>Hạng Thương gia trên Boeing 787-9...</p>`,
  },
];
