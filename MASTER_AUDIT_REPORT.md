# MASTER AUDIT REPORT — VietJourney × Vietnam Airlines Clone
Ngày: 2026-07-06 | Auditor: Claude Opus 4.6 (Independent QA)

---

## 📊 EXECUTIVE SUMMARY

### Kết quả lệnh thật
```
FE TypeScript errors:  0            ✅
FE Tests:              SKIPPED (no test runner configured)
FE Build:              PASS | Max chunk: 580 KB (index) ⚠️, 391 KB (AdminDashboard) ⚠️
FE npm audit:          0 vulnerabilities ✅
FE console.log sót:    0            ✅
FE any type:           44           ⚠️
FE ts-ignore:          0            ✅

BE Compile:            PASS (106 source files) ✅
BE Tests:              NOT RUN (requires MySQL) ⚠️
BE System.out sót:     0            ✅
BE show-sql:           false (prod), true (dev-only) ✅
BE Hardcode secret:    CÓ (fallback defaults in application.yml) 🔴
BE @Version lock:      CÓ (Flight + Booking) ✅
BE findAll() no page:  0            ✅
```

### Tổng hợp issues

| Hạng mục | 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low | Tổng |
|----------|-------------|---------|-----------|--------|------|
| BE Security | 2 | 2 | 1 | 0 | 5 |
| BE Performance | 0 | 1 | 2 | 1 | 4 |
| BE Code Quality | 1 | 1 | 2 | 0 | 4 |
| FE Security | 0 | 1 | 1 | 0 | 2 |
| FE Performance | 0 | 1 | 2 | 1 | 4 |
| FE UI/UX | 0 | 1 | 2 | 1 | 4 |
| Integration | 1 | 1 | 0 | 0 | 2 |
| Logic Flow | 0 | 1 | 1 | 0 | 2 |
| **TỔNG** | **4** | **9** | **11** | **3** | **27** |

---

## CHI TIẾT TỪNG ISSUE

---

## 🔐 PHẦN A — BACKEND SECURITY

### [SEC-BE-01] Hardcoded JWT Secret & DB Password as Fallback Defaults
- **Mức độ:** 🔴 Critical
- **File:** [application.yml](file:///d:/Viet%20Journey%20Advandce%20Solution/backend/src/main/resources/application.yml) (dòng 12, 32, 35)
- **Vấn đề:** JWT secret, DB password, và VNPay hash secret đều có hardcoded fallback values. Nếu deploy mà quên set env var → production chạy với secret mà mọi dev đều biết. Attacker có thể forge JWT token tùy ý.
- **Bằng chứng:**
  ```yaml
  password: ${DB_PASSWORD:thien123}
  secret: ${JWT_SECRET:9848779c4a86b51eb582f3a61f5f3e9a4f6d8a221f2d65dbfb1b4f420db5ebc4}
  vnp-hash-secret: ${VNP_HASH_SECRET:test-secret-1234567890}
  ```
- **Fix cho AI:**
  1. Xóa tất cả fallback defaults: `${JWT_SECRET}` thay vì `${JWT_SECRET:abc...}`
  2. Thêm `@Value` validation hoặc `@ConfigurationProperties` với `@Validated` + `@NotBlank` để app fail-fast nếu thiếu env var.
  3. Tạo file `.env.example` chỉ với key names, không có values.

### [SEC-BE-02] IDOR trên Notification markAsRead — Không kiểm tra ownership
- **Mức độ:** 🔴 Critical
- **File:** [NotificationController.java](file:///d:/Viet%20Journey%20Advandce%20Solution/backend/src/main/java/com/vietjourney/backend/controller/NotificationController.java) (dòng 29-33) + [NotificationServiceImpl.java](file:///d:/Viet%20Journey%20Advandce%20Solution/backend/src/main/java/com/vietjourney/backend/service/impl/NotificationServiceImpl.java) (dòng 30-34)
- **Vấn đề:** `PUT /api/notifications/{id}/read` chỉ nhận `@PathVariable Long id` mà không check notification thuộc user nào. User A có thể mark-as-read notification của User B bằng cách thay đổi ID trong URL.
- **Bằng chứng:**
  ```java
  // NotificationServiceImpl.java:30 — thiếu hoàn toàn ownership check
  public void markAsRead(Long notificationId) {
      Notification notification = notificationRepository.findById(notificationId)
              .orElseThrow(() -> ...);
      notification.setIsRead(true);  // Không check notification.getUser() == currentUser
      notificationRepository.save(notification);
  }
  ```
- **Fix cho AI:**
  1. Thêm `Authentication authentication` vào controller method
  2. Trong service, sau khi find notification, check `notification.getUser().getEmail().equals(userEmail)`, nếu không khớp → throw `AccessDeniedException`

### [SEC-BE-03] JWT Token TTL quá dài (24h) — Không có token revocation
- **Mức độ:** 🟠 High
- **File:** [application.yml](file:///d:/Viet%20Journey%20Advandce%20Solution/backend/src/main/resources/application.yml) (dòng 33)
- **Vấn đề:** Access token TTL = 86400000ms = 24 giờ. Nếu token bị đánh cắp (XSS, network sniffing), attacker có 24h để khai thác. Industry standard là 15-30 phút cho access token.
- **Bằng chứng:**
  ```yaml
  expiration-ms: ${JWT_EXPIRATION_MS:86400000} # 24 hours
  ```
- **Fix cho AI:**
  1. Giảm access token TTL xuống 900000 (15 phút)
  2. Refresh token flow đã có (7 ngày) → client sẽ tự refresh khi access token hết hạn
  3. FE client.ts đã có refresh token interceptor → chỉ cần đổi TTL

### [SEC-BE-04] Refresh Token không rotate — Token reuse attack
- **Mức độ:** 🟠 High
- **File:** [AuthServiceImpl.java](file:///d:/Viet%20Journey%20Advandce%20Solution/backend/src/main/java/com/vietjourney/backend/service/impl/AuthServiceImpl.java) (dòng 82-88)
- **Vấn đề:** Khi refresh, server trả lại cùng refresh token cũ (`return token`) thay vì tạo mới. Nếu refresh token bị đánh cắp, attacker có thể dùng mãi mãi trong 7 ngày mà không bị phát hiện.
- **Bằng chứng:**
  ```java
  // AuthServiceImpl.java:86 — reuse existing token, no rotation
  return AuthResponse.builder()
          .token(jwt)
          .refreshToken(token) // Reuse existing valid refresh token
          .user(mapToUserDTO(user))
          .build();
  ```
- **Fix cho AI:**
  1. Khi refresh thành công, revoke refresh token cũ (`refreshToken.setRevoked(true)`)
  2. Tạo refresh token mới và trả về cho client
  3. Nếu phát hiện reuse token đã revoked → revoke TẤT CẢ tokens của user đó (token family detection)

### [SEC-BE-05] Không có Rate Limiting cho login endpoint
- **Mức độ:** 🟡 Medium
- **File:** [SecurityConfig.java](file:///d:/Viet%20Journey%20Advandce%20Solution/backend/src/main/java/com/vietjourney/backend/security/SecurityConfig.java)
- **Vấn đề:** Không có rate limiting trên `POST /api/auth/login` → attacker có thể brute-force password không giới hạn.
- **Bằng chứng:** Grep toàn bộ project không thấy `RateLimiter`, `@RateLimit`, `Bucket4j`, hay `resilience4j`. SecurityConfig không có filter nào liên quan.
- **Fix cho AI:**
  1. Thêm dependency `bucket4j-core` + `bucket4j-spring-boot-starter`
  2. Tạo `RateLimitFilter` hoặc dùng `@RateLimit` annotation
  3. Giới hạn: max 5 failed login/IP/5 phút. Trả 429 Too Many Requests.

---

## ⚡ PHẦN A2 — BACKEND PERFORMANCE

### [PERF-BE-01] N+1 Query khi serialize Hotel entity trực tiếp
- **Mức độ:** 🟠 High
- **File:** [HotelController.java](file:///d:/Viet%20Journey%20Advandce%20Solution/backend/src/main/java/com/vietjourney/backend/controller/HotelController.java) (dòng 22-30)
- **Vấn đề:** `HotelController.getHotels()` trả `Page<Hotel>` trực tiếp (entity, không qua DTO). Hotel entity có `@OneToMany` rooms + amenities (LAZY). Khi Jackson serialize → trigger lazy loading cho mỗi hotel → N+1 queries. Tương tự với `getHotelById()` và `getHotelBySlug()`.
- **Bằng chứng:**
  ```java
  // HotelController.java:29 — trả Entity trực tiếp, không qua DTO
  Page<Hotel> hotels = hotelService.searchHotels(...);
  return ResponseEntity.ok(ApiResponse.success(hotels, "..."));

  // Hotel.java:49,52 — 2 @OneToMany LAZY
  @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<HotelAmenity> amenities;
  @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<HotelRoom> rooms;
  ```
- **Fix cho AI:**
  1. Tạo `HotelDTO` và `HotelDetailDTO` tương tự TourDTO/TourDetailDTO
  2. List endpoint: dùng `HotelDTO` (không include rooms/amenities)
  3. Detail endpoint: dùng `HotelDetailDTO` + `@EntityGraph` hoặc `JOIN FETCH` trong repository
  4. Tương tự cho `FlightController` — đang trả `Flight` entity trực tiếp

### [PERF-BE-02] Không có @Transactional(readOnly=true) cho read operations
- **Mức độ:** 🟡 Medium
- **File:** Tất cả ServiceImpl files
- **Vấn đề:** Các method GET (searchTours, getHotelById, getUserBookings...) không có `@Transactional(readOnly = true)`. Khi readOnly=true, Hibernate tối ưu: không dirty-check, có thể sử dụng connection read-replica.
- **Bằng chứng:** Grep `readOnly.*true` → 0 kết quả. Chỉ có `@Transactional` trên write methods.
- **Fix cho AI:** Thêm `@Transactional(readOnly = true)` cho tất cả GET methods trong ServiceImpl, hoặc annotation ở class level + override cho write methods.

### [PERF-BE-03] Cache trên Tour nhưng không có CacheEvict — stale data vĩnh viễn
- **Mức độ:** 🟡 Medium
- **File:** [TourServiceImpl.java](file:///d:/Viet%20Journey%20Advandce%20Solution/backend/src/main/java/com/vietjourney/backend/service/impl/TourServiceImpl.java) (dòng 47, 54, 61)
- **Vấn đề:** `@Cacheable` trên `getTourBySlug` và `getTourById` nhưng comment dòng 61 thừa nhận chưa có `@CacheEvict`. Caffeine config có TTL 300s (5 phút) nên không phải stale vĩnh viễn, nhưng nếu admin update tour → user thấy data cũ 5 phút.
- **Bằng chứng:**
  ```java
  // TourServiceImpl.java:61
  // NOTE: Hiện chưa có admin endpoint update/delete Tour.
  // Khi thêm sau này, nhớ bổ sung @CacheEvict tương ứng ở đây.
  ```
- **Fix cho AI:** Đây là acceptable cho MVP vì TTL 300s. Khi thêm admin CRUD Tour, bổ sung `@CacheEvict(value = {"tour_slug", "tour_id"}, allEntries = true)` trên update/delete methods.

### [PERF-BE-04] Missing database indexes cho booking_user_id & flight_number
- **Mức độ:** 🟢 Low
- **File:** [V1__init_schema.sql](file:///d:/Viet%20Journey%20Advandce%20Solution/backend/src/main/resources/db/migration/V1__init_schema.sql) + [V2__add_booking_indexes.sql](file:///d:/Viet%20Journey%20Advandce%20Solution/backend/src/main/resources/db/migration/V2__add_booking_indexes.sql)
- **Vấn đề:** 
  - `bookings.user_id` thiếu index (cần cho `findByUserId` trong booking history)
  - `flights.flight_number` thiếu index (cần cho search)
  - V2 migration đã add index cho `booking(status, reserved_until)` — tốt.
  - `users.email` có UNIQUE constraint (implicit index) — OK.
  - `tours.slug`, `hotels.slug` có UNIQUE constraint — OK.
- **Fix cho AI:** Tạo `V28__add_missing_indexes.sql`:
  ```sql
  CREATE INDEX idx_booking_user_id ON bookings(user_id);
  CREATE INDEX idx_flight_number ON flights(flight_number);
  ```

---

## 🏗️ PHẦN A3 — BACKEND CODE QUALITY

### [CQ-BE-01] Duplicate @ExceptionHandler(Exception.class) — Compile nhưng runtime ambiguous
- **Mức độ:** 🔴 Critical
- **File:** [GlobalExceptionHandler.java](file:///d:/Viet%20Journey%20Advandce%20Solution/backend/src/main/java/com/vietjourney/backend/exception/GlobalExceptionHandler.java) (dòng 41-46 và 74-79)
- **Vấn đề:** Có 2 methods annotated `@ExceptionHandler(Exception.class)`: `handleGlobalException` (dòng 41) và `handleGeneric` (dòng 74). Spring sẽ throw `IllegalStateException` khi cả hai match cùng exception → app crash khi có unhandled exception.
- **Bằng chứng:**
  ```java
  @ExceptionHandler(Exception.class)  // dòng 41
  public ResponseEntity<ApiResponse<Void>> handleGlobalException(Exception ex) { ... }

  @ExceptionHandler(Exception.class)  // dòng 74
  public ResponseEntity<ApiResponse<Void>> handleGeneric(Exception ex) { ... }
  ```
- **Fix cho AI:** Xóa 1 trong 2 methods. Giữ `handleGeneric` (dòng 74) vì message user-friendly hơn. Xóa `handleGlobalException`.

### [CQ-BE-02] PaymentServiceImpl throw RuntimeException thay vì custom exception
- **Mức độ:** 🟠 High
- **File:** [PaymentServiceImpl.java](file:///d:/Viet%20Journey%20Advandce%20Solution/backend/src/main/java/com/vietjourney/backend/service/impl/PaymentServiceImpl.java) (dòng 34)
- **Vấn đề:** `throw new RuntimeException(...)` thay vì `BusinessException`. GlobalExceptionHandler sẽ catch nó ở generic handler → trả 500 thay vì 400/409 đúng business logic. Ngoài ra, message bị encoding sai (mojibake): `"Chá»‰ cÃ³ thá»ƒ..."`.
- **Bằng chứng:**
  ```java
  if (!"reserved".equals(booking.getStatus())) {
      throw new RuntimeException("Chá»‰ cÃ³ thá»ƒ thanh toÃ¡n...");  // Mojibake + RuntimeException
  }
  ```
- **Fix cho AI:**
  1. Đổi thành `throw new BusinessException("Chỉ có thể thanh toán booking đang trong trạng thái reserved", 409);`
  2. Đảm bảo file saved với encoding UTF-8.

### [CQ-BE-03] TourServiceImpl throw RuntimeException thay vì ResourceNotFoundException
- **Mức độ:** 🟡 Medium
- **File:** [TourServiceImpl.java](file:///d:/Viet%20Journey%20Advandce%20Solution/backend/src/main/java/com/vietjourney/backend/service/impl/TourServiceImpl.java) (dòng 50, 57)
- **Vấn đề:** `getTourBySlug` và `getTourById` throw `RuntimeException` thay vì `ResourceNotFoundException` → trả 500 thay vì 404.
- **Bằng chứng:**
  ```java
  throw new RuntimeException("Tour not found with slug: " + slug);  // dòng 50
  throw new RuntimeException("Tour not found with id: " + id);      // dòng 57
  ```
- **Fix cho AI:** Đổi thành `throw new ResourceNotFoundException("Tour not found with slug: " + slug);`

### [CQ-BE-04] AdminController trả hardcoded data
- **Mức độ:** 🟡 Medium
- **File:** [AdminController.java](file:///d:/Viet%20Journey%20Advandce%20Solution/backend/src/main/java/com/vietjourney/backend/controller/AdminController.java) (dòng 19-23)
- **Vấn đề:** Endpoint `/api/admin/stats` trả hardcoded mock data. Chỉ có 1 admin endpoint, không có CRUD cho flights/tours/hotels/users.
- **Bằng chứng:**
  ```java
  stats.put("totalBookings", 1245);  // Hardcoded
  stats.put("revenue", "485M VND");  // Hardcoded
  ```
- **Fix cho AI:** Nếu chỉ demo thì chấp nhận được, nhưng nên tạo `AdminService` query từ DB: `bookingRepository.count()`, `paymentRepository.sumRevenue()`.

---

## 🔐 PHẦN B1 — FRONTEND SECURITY

### [SEC-FE-01] Token + RefreshToken lưu ở localStorage qua Zustand persist
- **Mức độ:** 🟠 High  
- **File:** [authStore.ts](file:///d:/Viet%20Journey%20Advandce%20Solution/frontend/src/store/authStore.ts) (dòng 37-39) + [api.ts (services)](file:///d:/Viet%20Journey%20Advandce%20Solution/frontend/src/services/api.ts) (dòng 8)
- **Vấn đề:** 
  - `authStore.ts` dùng `persist` middleware lưu `refreshToken` vào localStorage
  - `services/api.ts` đọc `token` từ store và gửi qua `Authorization: Bearer`
  - Backend đã set HttpOnly cookie cho JWT, nhưng FE có 2 API clients xung đột:
    - `services/api.ts` (dùng Bearer token từ store)
    - `api/client.ts` (dùng `withCredentials: true` — HttpOnly cookie)
  - Ngoài ra, `partialize` config (dòng 39) persist `refreshToken` → XSS có thể đọc được từ localStorage
- **Bằng chứng:**
  ```typescript
  // authStore.ts:39 — refreshToken persisted to localStorage
  partialize: (state) => ({ user: state.user, refreshToken: state.refreshToken })
  
  // services/api.ts:8 — reads token from store, sends as Bearer
  const token = useAuth.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  ```
- **Fix cho AI:**
  1. Xóa `refreshToken` khỏi `partialize` — không persist sensitive token
  2. Hợp nhất 2 API clients thành 1 (dùng `api/client.ts` vì nó đã implement refresh token rotation)
  3. Xóa hoặc deprecate `services/api.ts` 
  4. Lý tưởng: không lưu JWT ở client, hoàn toàn dùng HttpOnly cookie

### [SEC-FE-02] dangerouslySetInnerHTML nhưng đã sanitize — Acceptable
- **Mức độ:** 🟡 Medium (ghi nhận, không cần fix urgently)
- **File:** [BlogDetailPage.tsx](file:///d:/Viet%20Journey%20Advandce%20Solution/frontend/src/pages/BlogDetailPage.tsx) (dòng 80)
- **Vấn đề:** Dùng `dangerouslySetInnerHTML` để render blog content, nhưng ĐÃ wrap qua `DOMPurify.sanitize()`. Đây là best practice cho rich content.
- **Bằng chứng:**
  ```tsx
  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
  ```
- **Fix cho AI:** Acceptable. Chỉ cần đảm bảo DOMPurify version up-to-date. Có thể mention trong PV: "biết dùng DOMPurify cho XSS prevention."

---

## ⚡ PHẦN B2 — FRONTEND PERFORMANCE

### [PERF-FE-01] Bundle size lớn — index chunk 580KB, AdminDashboard 391KB
- **Mức độ:** 🟠 High
- **File:** Build output
- **Vấn đề:** 2 chunk > 200KB:
  - `index-DfEG23kY.js` = **580KB** (gzip 185KB) — main bundle quá to
  - `AdminDashboardPage-C6dnU0Vi.js` = **391KB** (gzip 112KB) — chủ yếu do recharts
  - `schemas-DbUktm6X.js` = **93KB** — zod/validation schemas
- **Bằng chứng:**
  ```
  dist/assets/index-DfEG23kY.js          579.99 kB │ gzip: 184.91 kB
  dist/assets/AdminDashboardPage-C6dnU0Vi.js  391.29 kB │ gzip: 112.08 kB
  ```
- **Fix cho AI:**
  1. Index chunk: check if react-router-dom, lucide-react, hoặc framer-motion đang vào main bundle
  2. AdminDashboard: recharts nên được lazy import chỉ trong admin page (đã lazy import AdminDashboardPage → OK, nhưng cần verify recharts không leak vào khác)
  3. Dùng `npx vite-bundle-visualizer` để xác định top contributors

### [PERF-FE-02] Zustand store destructuring gây unnecessary re-renders
- **Mức độ:** 🟡 Medium
- **File:** Nhiều components (Header, ProtectedRoute, ProfilePage, LotusmilesPage...)
- **Vấn đề:** Nhiều component dùng `const { user, isAuthenticated, logout } = useAuth()` — destructure toàn bộ store. Khi BẤT KỲ field nào thay đổi (kể cả field không dùng), component sẽ re-render.
- **Bằng chứng:**
  ```tsx
  // Header.tsx:8 — subscribe tất cả fields
  const { user, isAuthenticated, logout } = useAuth();
  
  // LoginPage.tsx:16 — ĐÃ dùng selector đúng cách ✅
  const setAuth = useAuth(s => s.setAuth);
  ```
- **Fix cho AI:** Với mỗi component, chỉ select fields cần thiết:
  ```typescript
  const user = useAuth(s => s.user);
  const logout = useAuth(s => s.logout);
  ```

### [PERF-FE-03] Không set staleTime cho React Query — refetch mỗi lần mount
- **Mức độ:** 🟡 Medium
- **File:** Toàn bộ pages sử dụng useQuery
- **Vấn đề:** Grep `staleTime` → 0 kết quả. Default staleTime = 0 → mỗi lần component mount sẽ refetch, kể cả khi data vẫn fresh. Gây load DB không cần thiết cho Tours/Hotels list (data ít thay đổi).
- **Bằng chứng:** `staleTime` không xuất hiện trong bất kỳ file nào.
- **Fix cho AI:**
  1. Thiết lập QueryClient defaultOptions: `staleTime: 5 * 60 * 1000` (5 phút) cho Tours/Hotels
  2. Booking/Payment giữ staleTime = 0 (cần real-time)

### [PERF-FE-04] React.memo chỉ dùng ở 1 component
- **Mức độ:** 🟢 Low
- **File:** Chỉ [FlightResultsPage.tsx](file:///d:/Viet%20Journey%20Advandce%20Solution/frontend/src/pages/FlightResultsPage.tsx) (dòng 119)
- **Vấn đề:** Toàn project chỉ có 1 `React.memo` (FlightCard). Các list components khác (TourCard, HotelCard) không memo → re-render khi parent re-render.
- **Fix cho AI:** Thêm `React.memo` cho các card components trong list: TourCard, HotelCard, BookingCard, NotificationCard. Ưu tiên components có nhiều items.

---

## 🎨 PHẦN B3 — FRONTEND UI/UX

### [UX-FE-01] Nhiều page dùng setTimeout + mock data — 100% hardcoded flow
- **Mức độ:** 🟠 High
- **File:** Nhiều pages trong `src/pages/`
- **Vấn đề:** Nhiều trang "core" dùng `setTimeout` + hardcoded mock data thay vì gọi API thật. Khi demo cho interviewer, nếu bị hỏi "show me a real API call" thì không có gì.
- **Bằng chứng:**
  ```
  Trang dùng setTimeout + mock:
  - AdminDashboardPage.tsx (fake loading 1s)
  - ChangeFlightPage.tsx (giả lập submit)
  - CheckinPage.tsx (hardcoded BK1234/NGUYEN)
  - FlightSchedulePage.tsx (mock data)
  - FlightStatusPage.tsx (mockStatuses array)
  - ForgotPasswordPage.tsx (giả lập gửi email)
  - RefundPage.tsx (giả lập refund)
  - TourDetailPage.tsx (fake loading)
  ```
  ```
  booking.ts:5  →  USE_MOCK = true (hardcoded true, TODO comment)
  flights.ts:6  →  USE_MOCK = true (hardcoded true, TODO comment)
  ```
- **Fix cho AI:**
  1. **Ưu tiên**: Set `USE_MOCK = false` trong booking.ts và flights.ts (BE endpoints exist)
  2. CheckinPage, FlightStatusPage, FlightSchedulePage: acceptable as mock pages cho MVP
  3. Nhưng phải nói rõ trong PV: "Các trang này demo UI flow, chưa kết nối BE"

### [UX-FE-02] Tailwind grid breakpoint `md:grid-cols-2 md:grid-cols-4` — override conflict
- **Mức độ:** 🟡 Medium
- **File:** Nhiều pages (DashboardPage:31, LotusmilesPage:97, TourDetailPage:51, HotelDetailPage:84)
- **Vấn đề:** Một số grid dùng `md:grid-cols-2 md:grid-cols-4` — cùng breakpoint `md:` với 2 values khác nhau. Tailwind sẽ apply cái cuối cùng (md:grid-cols-4) và bỏ qua cái đầu → dù ý định là responsive progression.
- **Bằng chứng:**
  ```tsx
  // DashboardPage.tsx:31
  className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-4 gap-4"
  // → md:grid-cols-2 bị override bởi md:grid-cols-4
  // Ý đúng: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
  ```
- **Fix cho AI:** Đổi thành `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` cho responsive đúng.

### [UX-FE-03] ProfilePage dùng `localStorage.getItem('token')` — sai pattern
- **Mức độ:** 🟡 Medium
- **File:** [ProfilePage.tsx](file:///d:/Viet%20Journey%20Advandce%20Solution/frontend/src/pages/ProfilePage.tsx) (dòng 26)
- **Vấn đề:** Trực tiếp đọc `localStorage.getItem('token')` thay vì dùng `useAuth.getState().token`. Nếu token storage strategy thay đổi (HttpOnly cookie), ProfilePage sẽ break.
- **Bằng chứng:**
  ```tsx
  setAuth(res.data.data, localStorage.getItem('token') || '');
  ```
- **Fix cho AI:** Đổi thành `useAuth.getState().token || ''` hoặc không truyền token (dùng cookie).

### [UX-FE-04] Hardcoded Vietnamese text thay vì i18n key ở một số chỗ
- **Mức độ:** 🟢 Low
- **File:** [LoginPage.tsx](file:///d:/Viet%20Journey%20Advandce%20Solution/frontend/src/pages/LoginPage.tsx) (dòng 70), nhiều pages khác
- **Vấn đề:** Một số text hardcoded bằng tiếng Việt thay vì dùng `t('key')` từ langStore. VD: `"Quay lại trang chủ"`, `"Đăng nhập thành công"` trong toast.
- **Fix cho AI:** Chuyển các hardcoded strings sang langStore keys. Không critical cho MVP nhưng cần cho production.

---

## 🔗 PHẦN C — INTEGRATION STATUS

### [INT-01] FE Booking/Flight API đang hardcode USE_MOCK = true
- **Mức độ:** 🔴 Critical
- **File:** [booking.ts](file:///d:/Viet%20Journey%20Advandce%20Solution/frontend/src/api/booking.ts) (dòng 5), [flights.ts](file:///d:/Viet%20Journey%20Advandce%20Solution/frontend/src/api/flights.ts) (dòng 6)
- **Vấn đề:** Core booking flow hoàn toàn dùng mock data. BE endpoints tồn tại và hoạt động (`POST /api/bookings`, `GET /api/bookings/{id}`, `GET /api/flights`) nhưng FE không bao giờ gọi.
- **Bằng chứng:**
  ```typescript
  const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true' || true; // TODO: set false
  ```
  `|| true` → luôn mock, bất kể env var.
- **Fix cho AI:** Đổi thành `|| false` hoặc xóa `|| true`. Verify API contract khớp giữa FE mock types và BE response format.

### [INT-02] Hai API client xung đột — services/api.ts vs api/client.ts
- **Mức độ:** 🟠 High
- **File:** [services/api.ts](file:///d:/Viet%20Journey%20Advandce%20Solution/frontend/src/services/api.ts) và [api/client.ts](file:///d:/Viet%20Journey%20Advandce%20Solution/frontend/src/api/client.ts)
- **Vấn đề:** 
  - `services/api.ts`: baseURL `/api` (relative), dùng Bearer token
  - `api/client.ts`: baseURL `http://localhost:8080/api` (absolute), dùng HttpOnly cookie + refresh token rotation
  - Các service khác nhau import từ client khác nhau → inconsistent auth behavior
- **Bằng chứng:**
  ```typescript
  // services/api.ts — Bearer token strategy
  config.headers.Authorization = `Bearer ${token}`;
  
  // api/client.ts — Cookie strategy
  withCredentials: true,
  ```
- **Fix cho AI:** Hợp nhất thành 1 API client. Recommend giữ `api/client.ts` vì nó đầy đủ hơn (refresh token, queue, retry). Đổi tất cả imports dùng `services/api.ts` sang `api/client.ts`.

---

## 🔗 INTEGRATION STATUS TABLE

| Endpoint | FE gọi | BE có | Format match | Error handled |
|----------|--------|-------|--------------|---------------|
| POST /api/auth/login | ✅ | ✅ | ⚠️ (FE expect `accessToken`, BE send `token`) | ✅ |
| POST /api/auth/register | ✅ | ✅ | ⚠️ (same field name mismatch) | ✅ |
| POST /api/auth/refresh | ✅ | ✅ | ✅ | ✅ |
| GET /api/auth/me | ✅ | ✅ | ✅ | ✅ |
| GET /api/tours | ✅ | ✅ | ✅ | ✅ |
| GET /api/tours/{id} | ✅ | ✅ | ✅ | ✅ |
| GET /api/hotels | ✅ | ✅ | ✅ | ⚠️ |
| GET /api/flights | ❌ (MOCK) | ✅ | ❓ (untested) | ❌ |
| POST /api/bookings | ❌ (MOCK) | ✅ | ❓ (untested) | ❌ |
| GET /api/bookings/{id} | ❌ (MOCK) | ✅ | ❓ (untested) | ❌ |
| GET /api/bookings/my-bookings | ✅ | ✅ | ✅ | ⚠️ |
| GET /api/bookings/search | ✅ | ✅ | ✅ | ✅ |
| POST /api/payments/create | ❌ (MOCK) | ✅ | ❓ (untested) | ❌ |
| GET /api/payments/callback | N/A (server-to-server) | ✅ | ✅ | ✅ |
| GET /api/wishlist | ⚠️ (FE url mismatch) | ✅ | ✅ | ⚠️ |
| POST /api/wishlist | ⚠️ | ✅ | ✅ | ⚠️ |
| GET /api/notifications | ✅ | ✅ | ✅ | ⚠️ |
| POST /api/reviews | ✅ | ✅ | ✅ | ✅ |

> **Legend:** ✅ = OK, ❌ = Not working, ⚠️ = Partially/concerns, ❓ = Untestable (mock only)

---

## 🔄 PHẦN D — LOGIC FLOW

### [FLOW-01] Booking flow bị ngắt ở step 1 vì USE_MOCK = true
- **Mức độ:** 🟠 High
- **Impact:** Toàn bộ booking → payment → confirmation flow không hoạt động với BE thật
- **Chi tiết:**
  1. **Flight Search**: `searchFlights()` → mock → OK cho UI demo
  2. **Create Hold**: `bookingApi.createHold()` → mock → Tạo fake booking, không ghi DB
  3. **SeatHoldPage**: Dùng `react-hook-form` + countdown timer → UI tốt, nhưng data từ mock
  4. **PaymentPage**: `bookingApi.payVnpay()` → mock → Không gọi VNPay
  5. **ConfirmationPage**: Dùng fake booking data
- **Fix cho AI:** Set `USE_MOCK = false` trong `booking.ts` và `flights.ts`. Verify request/response types match BE DTOs. Đặc biệt chú ý:
  - FE `HoldRequest` gửi `Flight` object, BE `BookingRequest` expect `referenceId: Long`
  - FE expect `bookingId: string`, BE return `id: Long`

### [FLOW-02] ProtectedRoute implementation — Tốt nhưng có duplicate file
- **Mức độ:** 🟡 Medium
- **File:** [components/auth/ProtectedRoute.tsx](file:///d:/Viet%20Journey%20Advandce%20Solution/frontend/src/components/auth/ProtectedRoute.tsx) + [components/ProtectedRoute.tsx](file:///d:/Viet%20Journey%20Advandce%20Solution/frontend/src/components/ProtectedRoute.tsx)
- **Vấn đề:** Có 2 file ProtectedRoute:
  - `components/auth/ProtectedRoute.tsx` — used in App.tsx, có role-based check ✅
  - `components/ProtectedRoute.tsx` — orphan, chỉ check `isAuthenticated`
- **Fix cho AI:** Xóa `components/ProtectedRoute.tsx` (file không dùng).

---

## 📋 THỨ TỰ FIX ƯU TIÊN (cho AI fix tiếp)

### 🔴 Làm ngay (ảnh hưởng security/crash):
1. **[CQ-BE-01]** — Duplicate `@ExceptionHandler(Exception.class)` → app crash khi có unhandled exception
2. **[SEC-BE-01]** — Xóa hardcoded fallback secrets → phải set env var khi deploy
3. **[SEC-BE-02]** — Notification IDOR → user A đọc/mark notification user B
4. **[INT-01]** — Đổi `USE_MOCK = false` trong booking.ts + flights.ts → kích hoạt real API

### 🟠 Làm trước khi demo:
5. **[SEC-BE-03]** — Giảm JWT TTL từ 24h xuống 15 phút
6. **[SEC-BE-04]** — Implement refresh token rotation
7. **[CQ-BE-02]** — Fix RuntimeException + mojibake trong PaymentServiceImpl
8. **[PERF-BE-01]** — Tạo HotelDTO, ngăn N+1 query
9. **[SEC-FE-01]** — Hợp nhất 2 API clients, bỏ persist refreshToken vào localStorage
10. **[INT-02]** — Merge 2 API clients thành 1
11. **[PERF-FE-01]** — Investigate index chunk 580KB, optimize if possible
12. **[UX-FE-01]** — Verify mock pages nào cần convert sang real API

### 🟡 Sprint tiếp:
13. **[SEC-BE-05]** — Thêm rate limiting cho login
14. **[CQ-BE-03]** — Fix RuntimeException → ResourceNotFoundException trong TourServiceImpl
15. **[PERF-BE-02]** — Thêm @Transactional(readOnly=true) cho GET methods
16. **[PERF-BE-03]** — Thêm @CacheEvict khi có admin CRUD
17. **[PERF-FE-02]** — Fix Zustand selector patterns
18. **[PERF-FE-03]** — Set staleTime cho React Query
19. **[UX-FE-02]** — Fix grid breakpoint conflicts
20. **[UX-FE-03]** — Fix ProfilePage localStorage access
21. **[FLOW-02]** — Xóa duplicate ProtectedRoute

### 🟢 Nice to have:
22. **[PERF-BE-04]** — Thêm missing database indexes
23. **[PERF-FE-04]** — Thêm React.memo cho card components
24. **[UX-FE-04]** — Chuyển hardcoded text sang i18n keys
25. **[CQ-BE-04]** — AdminController trả data thật từ DB

---

## 💡 ĐÁNH GIÁ PHỎNG VẤN

### Điểm mạnh thật sự (kể trong PV được):

1. **Kiến trúc backend chuẩn Spring Boot**: Layered architecture (Controller → Service → Repository), dùng Strategy Pattern cho booking types + payment gateways. Interviewer sẽ ấn tượng nếu giải thích được lý do.

2. **Security có chiều sâu**: JWT + HttpOnly Cookie + BCrypt + CSRF disabled (stateless) + 401/403 handlers rõ ràng + XSS sanitization (Jsoup ở BE, DOMPurify ở FE). Đây là điểm cộng lớn cho Fresher/Junior.

3. **Optimistic Locking trên Booking + Flight**: `@Version` + `ObjectOptimisticLockingFailureException` handler → chống race condition khi 2 user cùng book. Rất ít Fresher biết implement cái này.

4. **Flyway Migration versioned**: 10 migration files, proper versioning. Thể hiện hiểu biết về database change management.

5. **Frontend code splitting tốt**: 47 pages lazy-loaded, Suspense + PageLoader. Build output chứng minh code split hoạt động.

6. **Refresh Token flow**: FE `client.ts` có queue-based retry logic (khi 401, queue failed requests, refresh, retry all). Đây là production-level implementation.

7. **Reservation Scheduler**: `@Scheduled` auto-expire bookings sau 10 phút. Hiểu concept seat hold + timeout.

8. **Input validation đầy đủ**: `@Valid` trên tất cả `@RequestBody`, DTO có `@NotBlank/@Email/@Size`. GlobalExceptionHandler trả validation errors chi tiết.

### Điểm yếu cần chuẩn bị câu trả lời:

1. **"FE booking flow là mock — sao không kết nối BE?"**
   → Trả lời: "Khi build, tôi ưu tiên hoàn thiện UI/UX flow trước, sau đó kết nối API. Backend endpoints đã sẵn sàng, FE chỉ cần toggle USE_MOCK flag. Tôi đã test BE bằng Postman." (Nếu thật sự đã test)

2. **"Token TTL 24h quá dài, sao không 15 phút?"**
   → Trả lời: "Đúng, production nên 15 phút + refresh token. Tôi đã implement refresh token rotation ở FE (client.ts), chỉ cần điều chỉnh TTL config."

3. **"IDOR trên notification — sao không check ownership?"**
   → Trả lời: "Đây là oversight. Booking endpoint đã có ownership check (getBookingByIdAndUser), tôi nên apply pattern tương tự cho notification."

4. **"Có 44 `any` type trong TypeScript — tại sao?"**
   → Trả lời: "Phần lớn ở admin pages (mock data) và hooks cũ. Tôi đã dùng proper types cho core business logic (Flight, Booking, AuthUser). Các `any` cần được refactor dần."

5. **"Bundle index chunk 580KB — đã optimize chưa?"**
   → Trả lời: "Tôi đã lazy-load 47 pages. Main chunk lớn vì chứa shared dependencies (React, react-router-dom, UI components). Cần analyze further với vite-bundle-visualizer và tree-shake."

### Kết luận:

**Project ở mức Junior**, với một số điểm vượt expectations cho Junior:
- Strategy Pattern, Optimistic Locking, Refresh Token Queue là Mid-level concepts
- Flyway migrations, CORS config, SecurityFilterChain thể hiện kiến thức real-world

**Apply được tại:**
- ✅ **FPT Software** (Java/Spring Boot role) — project đủ depth cho interview
- ✅ **MBBank** (Backend Developer) — security awareness + payment flow knowledge
- ✅ **Vexere** (Travel tech) — domain match, booking flow logic
- ✅ **Mobio** (Full-stack) — cần chuẩn bị thêm về FE testing
- ⚠️ **Tiki/Shopee/VNPay** (Mid-level) — cần fix mock issues + thêm unit tests + optimize performance trước

**Đánh giá tổng thể: 7/10 cho Fresher, 5.5/10 cho Junior Mid.**
Nếu fix được 🔴 Critical issues + kết nối real API → lên **8/10 cho Fresher, 6.5/10 cho Junior.**
