import { create } from 'zustand';

export type Lang = 'vn' | 'en';

export const dict = {
  vn: {
    topbar: { contact: 'Liên hệ', flightStatus: 'Trạng thái chuyến bay', lotusmiles: 'Lotusmiles', login: 'Đăng nhập', logout: 'Đăng xuất', langLabel: 'Ngôn ngữ' },
    header: {
      book: 'Đặt vé', tagline: 'Vì sao trên bầu trời Việt Nam',
      nav: { book: 'Đặt vé', manage: 'Quản lý đặt chỗ', checkin: 'Làm thủ tục', status: 'Trạng thái chuyến bay', discover: 'Khám phá', destinations: 'Điểm đến' },
      menu: 'Menu',
    },
    hero: {
      title: 'Bay cùng Việt Nam', subtitle: 'Vì sao trên bầu trời Việt Nam',
      tagline: 'Hơn 1.000 chuyến bay mỗi ngày tới 60 điểm đến trên toàn thế giới.',
      book: {
        roundTrip: 'Khứ hồi', oneWay: 'Một chiều', multiCity: 'Nhiều chặng',
        from: 'Điểm đi', to: 'Điểm đến', depart: 'Ngày đi', return: 'Ngày về',
        passengers: 'Hành khách', cabin: 'Hạng ghế', promo: 'Mã khuyến mãi',
        promoPlaceholder: 'Nhập mã (không bắt buộc)', search: 'Tìm chuyến bay',
        adults: 'Người lớn', children: 'Trẻ em', infants: 'Em nhỏ',
        adultsHint: '(≥12 tuổi)', childrenHint: '(2–11 tuổi)', infantsHint: '(<2 tuổi)',
        multiNote: 'Tính năng nhiều chặng sẽ sớm ra mắt.',
        cabinEconomy: 'Phổ thông', cabinEconomySpecial: 'Phổ thông đặc biệt',
        cabinBusiness: 'Thương gia', cabinPremium: 'Thương nhân',
      },
    },
    results: {
      title: 'Chuyến bay', outbound: 'Chiều đi', return: 'Chiều về',
      flightsFound: 'chuyến bay', nonstop: 'Bay thẳng', stops: 'điểm dừng',
      select: 'Chọn', selected: 'Đã chọn', seatsLeft: 'ghế trống',
      summary: 'Tóm tắt đặt chỗ', total: 'Tổng tiền', continue: 'Tiếp tục thanh toán',
      loading: 'Đang tìm chuyến bay...', empty: 'Không tìm thấy chuyến bay phù hợp.',
      perPax: '/ hành khách', close: 'Đóng',
      bookingToast: 'Đặt chỗ minh họa — cảm ơn bạn!',
    },
    sections: {
      offers: 'Ưu đãi đặc biệt', offersSub: 'Những ưu đãi hấp dẫn dành cho hành trình tiếp theo của bạn.',
      destinations: 'Điểm đến nổi bật', destinationsSub: 'Khám phá những điểm đến tuyệt đẹp cùng Vietnam Airlines.',
      lotusmiles: 'Hội viên Lotusmiles', lotusmilesSub: 'Tích lũy dặm bay, tận hưởng đặc quyền dành riêng cho hội viên.',
      joinNow: 'Đăng ký ngay',
      travelClasses: 'Trải nghiệm hành trình', travelClassesSub: 'Tận hưởng sự thoải mái tối đa với các hạng dịch vụ của chúng tôi.',
      services: 'Dịch vụ bổ sung', servicesSub: 'Nâng cấp trải nghiệm bay của bạn với các dịch vụ tiện ích.',
      news: 'Tin tức & Thông báo', newsSub: 'Cập nhật những thông tin mới nhất từ Vietnam Airlines.',
      fromPrice: 'Từ',
    },
    footer: {
      about: 'Về Vietnam Airlines', services: 'Dịch vụ', lotusmiles: 'Lotusmiles', support: 'Hỗ trợ',
      aboutLinks: { intro: 'Giới thiệu', team: 'Đội ngũ', routes: 'Tuyến bay', contact: 'Liên hệ' },
      serviceLinks: { book: 'Đặt vé', manage: 'Quản lý đặt chỗ', checkin: 'Làm thủ tục', status: 'Trạng thái chuyến bay' },
      lotusLinks: { signup: 'Đăng ký', terms: 'Điều kiện', partners: 'Đối tác' },
      supportLinks: { faq: 'Câu hỏi thường gặp', guide: 'Hướng dẫn', complaint: 'Khiếu nại' },
      appDownload: 'Tải ứng dụng', follow: 'Theo dõi chúng tôi',
      copyright: '© 2025 Vietnam Airlines. Bản quyền thuộc về Vietnam Airlines.',
      certify: 'Đạt chuẩn an toàn IATA · IOSA',
    },
    common: { seeDetail: 'Xem chi tiết', bookNow: 'Đặt ngay', readMore: 'Đọc thêm', perNight: '/ đêm', currency: 'VNĐ' },
    login: {
      title: 'Đăng nhập Lotusmiles', subtitle: 'Đăng nhập để tích lũy dặm bay và tận hưởng đặc quyền.',
      email: 'Email / Số thẻ Lotusmiles', emailPlaceholder: 'Nhập email hoặc số thẻ',
      password: 'Mật khẩu', passwordPlaceholder: 'Nhập mật khẩu', submit: 'Đăng nhập',
      forgot: 'Quên mật khẩu?', register: 'Chưa có tài khoản? Đăng ký ngay', toastDemo: 'Chức năng minh họa',
      success: 'Đăng nhập thành công', failed: 'Đăng nhập thất bại',
    },
    manage: {
      title: 'Quản lý đặt chỗ', code: 'Mã đặt chỗ', codePlaceholder: 'VD: ABCDEF',
      lastName: 'Họ', lastNamePlaceholder: 'VD: NGUYEN', search: 'Tìm đặt chỗ',
      notFound: 'Không tìm thấy đặt chỗ', notFoundDesc: 'Vui lòng kiểm tra lại mã đặt chỗ hoặc họ của hành khách.',
      actions: { detail: 'Xem chi tiết', change: 'Đổi chuyến', refund: 'Hủy / Hoàn vé', print: 'In vé', seats: 'Chọn ghế', extras: 'Mua thêm dịch vụ' },
    },
    checkin: {
      title: 'Làm thủ tục trực tuyến', onlineCheckin: 'Check-in',
      passengers: 'Danh sách hành khách', seat: 'Ghế ngồi', selectSeat: 'Chọn ghế',
      complete: 'Hoàn tất check-in', boardingPass: 'Thẻ lên máy bay (Boarding Pass)',
      print: 'In thẻ lên máy bay', gate: 'Cửa', time: 'Giờ ra cửa',
    },
    flightstatus: {
      title: 'Trạng thái chuyến bay', byFlight: 'Theo số chuyến bay', byRoute: 'Theo hành trình',
      flightNo: 'Số chuyến bay', flightNoPlaceholder: 'VD: VN201', date: 'Ngày bay',
      scheduled: 'Giờ dự kiến', actual: 'Giờ thực tế', status: 'Trạng thái', terminal: 'Nhà ga',
      statuses: { onTime: 'Đúng giờ', delayed: 'Trễ', cancelled: 'Hủy', boarding: 'Đang lên máy bay', departed: 'Đã cất cánh', landed: 'Đã hạ cánh' },
    },
    error: {
      notFound: 'Trang không tìm thấy', forbidden: 'Bạn không có quyền truy cập',
      serverError: 'Hệ thống gặp sự cố', maintenance: 'Hệ thống đang bảo trì',
      bookingExpired: 'Hết thời gian giữ chỗ', paymentFailed: 'Thanh toán thất bại',
      backToHome: 'Về trang chủ', retry: 'Thử lại', contact: 'Liên hệ hỗ trợ',
    },
    hold: {
      expired: 'Đã hết thời gian giữ chỗ',
      remaining: 'Thời gian giữ chỗ còn lại',
      bookingCode: 'Mã đặt chỗ',
      warning: 'Vui lòng hoàn tất thông tin hành khách để tiếp tục.',
      fullName: 'Họ và tên',
      idNumber: 'Số CCCD/Hộ chiếu',
      birthDate: 'Ngày sinh',
      gender: 'Giới tính',
      genderMale: 'Nam',
      genderFemale: 'Nữ',
      contactEmail: 'Email liên hệ',
      contactPhone: 'Số điện thoại',
      continue: 'Tiếp tục',
    },
  },
  en: {
    topbar: { contact: 'Contact', flightStatus: 'Flight status', lotusmiles: 'Lotusmiles', login: 'Log in', logout: 'Log out', langLabel: 'Language' },
    header: {
      book: 'Book now', tagline: 'Stars in the Vietnamese sky',
      nav: { book: 'Book', manage: 'Manage booking', checkin: 'Check-in', status: 'Flight status', discover: 'Discover', destinations: 'Destinations' },
      menu: 'Menu',
    },
    hero: {
      title: 'Fly with Vietnam', subtitle: 'Stars in the Vietnamese sky',
      tagline: 'Over 1,000 daily flights to 60 destinations worldwide.',
      book: {
        roundTrip: 'Round trip', oneWay: 'One way', multiCity: 'Multi-city',
        from: 'From', to: 'To', depart: 'Depart', return: 'Return',
        passengers: 'Passengers', cabin: 'Cabin', promo: 'Promo code',
        promoPlaceholder: 'Enter code (optional)', search: 'Search flights',
        adults: 'Adults', children: 'Children', infants: 'Infants',
        adultsHint: '(≥12 years)', childrenHint: '(2–11 years)', infantsHint: '(<2 years)',
        multiNote: 'Multi-city feature is coming soon.',
        cabinEconomy: 'Economy', cabinEconomySpecial: 'Premium Economy',
        cabinBusiness: 'Business', cabinPremium: 'Premium Business',
      },
    },
    results: {
      title: 'Flights', outbound: 'Outbound', return: 'Return',
      flightsFound: 'flights found', nonstop: 'Nonstop', stops: 'stop',
      select: 'Select', selected: 'Selected', seatsLeft: 'seats left',
      summary: 'Booking summary', total: 'Total', continue: 'Continue to payment',
      loading: 'Searching for flights...', empty: 'No flights found.',
      perPax: '/ passenger', close: 'Close',
      bookingToast: 'Demo booking — thank you!',
    },
    sections: {
      offers: 'Special offers', offersSub: 'Great deals for your next journey with us.',
      destinations: 'Featured destinations', destinationsSub: 'Discover beautiful destinations with Vietnam Airlines.',
      lotusmiles: 'Lotusmiles Members', lotusmilesSub: 'Earn miles and enjoy exclusive member privileges.',
      joinNow: 'Join now',
      travelClasses: 'Travel experience', travelClassesSub: 'Enjoy maximum comfort with our cabin classes.',
      services: 'Additional services', servicesSub: 'Upgrade your journey with convenient add-on services.',
      news: 'News & Announcements', newsSub: 'Latest updates from Vietnam Airlines.',
      fromPrice: 'From',
    },
    footer: {
      about: 'About Vietnam Airlines', services: 'Services', lotusmiles: 'Lotusmiles', support: 'Support',
      aboutLinks: { intro: 'About us', team: 'Our team', routes: 'Routes', contact: 'Contact' },
      serviceLinks: { book: 'Book flights', manage: 'Manage booking', checkin: 'Check-in', status: 'Flight status' },
      lotusLinks: { signup: 'Sign up', terms: 'Terms', partners: 'Partners' },
      supportLinks: { faq: 'FAQ', guide: 'Guide', complaint: 'Complaint' },
      appDownload: 'Download the app', follow: 'Follow us',
      copyright: '© 2025 Vietnam Airlines. All rights reserved.',
      certify: 'IATA · IOSA safety certified',
    },
    common: { seeDetail: 'See details', bookNow: 'Book now', readMore: 'Read more', perNight: '/ night', currency: 'VND' },
    login: {
      title: 'Lotusmiles Login', subtitle: 'Log in to earn miles and enjoy privileges.',
      email: 'Email / Lotusmiles number', emailPlaceholder: 'Enter email or card number',
      password: 'Password', passwordPlaceholder: 'Enter password', submit: 'Log in',
      forgot: 'Forgot password?', register: 'No account yet? Sign up now', toastDemo: 'Demo feature',
      success: 'Login successful', failed: 'Login failed',
    },
    manage: {
      title: 'Manage booking', code: 'Booking code', codePlaceholder: 'Ex: ABCDEF',
      lastName: 'Last name', lastNamePlaceholder: 'Ex: NGUYEN', search: 'Search booking',
      notFound: 'Booking not found', notFoundDesc: 'Please check your booking code or last name.',
      actions: { detail: 'View details', change: 'Change flight', refund: 'Cancel / Refund', print: 'Print ticket', seats: 'Select seats', extras: 'Add services' },
    },
    checkin: {
      title: 'Online Check-in', onlineCheckin: 'Check-in',
      passengers: 'Passenger list', seat: 'Seat', selectSeat: 'Select seat',
      complete: 'Complete check-in', boardingPass: 'Boarding Pass',
      print: 'Print boarding pass', gate: 'Gate', time: 'Boarding time',
    },
    flightstatus: {
      title: 'Flight status', byFlight: 'By flight number', byRoute: 'By route',
      flightNo: 'Flight number', flightNoPlaceholder: 'Ex: VN201', date: 'Date',
      scheduled: 'Scheduled', actual: 'Actual', status: 'Status', terminal: 'Terminal',
      statuses: { onTime: 'On time', delayed: 'Delayed', cancelled: 'Cancelled', boarding: 'Boarding', departed: 'Departed', landed: 'Landed' },
    },
    error: {
      notFound: 'Page not found', forbidden: 'Access denied',
      serverError: 'System error', maintenance: 'System under maintenance',
      bookingExpired: 'Booking session expired', paymentFailed: 'Payment failed',
      backToHome: 'Back to home', retry: 'Try again', contact: 'Contact support',
    },
    hold: {
      expired: 'Booking hold expired',
      remaining: 'Time remaining',
      bookingCode: 'Booking code',
      warning: 'Please complete passenger details to continue.',
      fullName: 'Full name',
      idNumber: 'ID/Passport',
      birthDate: 'Date of birth',
      gender: 'Gender',
      genderMale: 'Male',
      genderFemale: 'Female',
      contactEmail: 'Contact email',
      contactPhone: 'Contact phone',
      continue: 'Continue',
    },
  },
} as const;

export type Dict = (typeof dict)['vn'];

export type CallableDict = Dict & {
  (key: string): string;
};

export interface LangState {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  get t(): CallableDict;
}

export const useLang = create<LangState>((set, get) => ({
  lang: 'vn',
  setLang: (l) => set({ lang: l }),
  toggle: () => set({ lang: get().lang === 'vn' ? 'en' : 'vn' }),
  get t() {
    const data = dict[get().lang];
    const tFn = (key: string) => key.split('.').reduce((acc: any, k) => acc?.[k], data) || key;
    Object.assign(tFn, data);
    return tFn as CallableDict;
  }
}));

export function useT(): CallableDict {
  const lang = useLang((s) => s.lang);
  const data = dict[lang];
  const tFn = (key: string) => key.split('.').reduce((acc: any, k) => acc?.[k], data) || key;
  Object.assign(tFn, data);
  return tFn as CallableDict;
}
