# BÁO CÁO REVIEW TOÀN DIỆN CODE (LẦN 2) — VietJourney Advance Solution

> **Repository**: `https://github.com/tvthien-ktmt/Viet-Journey-Advandce-Solution`
> **Commit reviewed**: `22eabeb` — *"fix(all): resolve all 97 issues from Code Review"*
> **Ngày review**: 2026-07-07
> **Phạm vi**: Toàn bộ source code (FE + BE + DB + Infra) sau đợt fix 97 issue
> **Mức độ**: Kỹ thuật chuyên sâu, rà soát từng file
> **Loại**: Review-only, KHÔNG fix

---

## MỤC LỤC

1. [Executive Summary](#1-executive-summary)
2. [Thông tin tổng quan dự án](#2-thông-tin-tổng-quan-dự-án)
3. [Phần A — FRONTEND REVIEW](#3-phần-a--frontend-review)
4. [Phần B — BACKEND REVIEW](#4-phần-b--backend-review)
5. [Phần C — DATABASE REVIEW](#5-phần-c--database-review)
6. [Phần D — INFRA & DEVOPS REVIEW](#6-phần-d--infra--devops-review)
7. [Phần E — CONTRACT MISMATCH BE ↔ FE](#7-phần-e--contract-mismatch-be--fe)
8. [Phần F — ROADMAP FIX ĐỀ XUẤT](#8-phần-f--roadmap-fix-đề-xuất)
9. [Phụ lục: Ma trận Severity](#9-phụ-lục-ma-trận-severity)

---

## 1. Executive Summary

### 1.1. Bối cảnh

Sau đợt review đầu (97 issue), team đã commit `22eabeb fix(all): resolve all 97 issues from Code Review`. Bản review này đối chiếu **thực tế fix so với claim**, đồng thời rà soát lại toàn bộ source mới.

### 1.2. Đánh giá đợt fix

| Hạng mục fix | Trạng thái | Đánh giá |
|---|---|---|
| **BE-CRIT-01** Scheduler release inventory | ✅ Fixed đúng | `ReservationScheduler` giờ gọi `strategy.release()` trong loop |
| **BE-CRIT-02** Rate limit `/api/bookings` | ✅ Fixed (qua `countByUserIdAndStatusIn >= 3` + `quantity <= 9`) | Phòng ngừa tốt |
| **BE-CRIT-03** VNPay verify order | ✅ Fixed đúng | `verifyCallback` chạy trước khi mutate payment |
| **BE-CRIT-04** IPN endpoint missing | ✅ Fixed | `/api/payments/ipn` được add; trả RspCode VNPay chuẩn |
| **BE-CRIT-05** VnpayIpnFilter Spring bean | ✅ Fixed | `@Component` + inject qua constructor |
| **BE-CRIT-05b** VnpayIpnFilter X-Forwarded-For | ✅ Fixed (nhưng chưa dùng RemoteIpValve) | Acceptable |
| **BE-CRIT-06** Payment ownership check | ✅ Fixed đúng | Service nhận `userEmail`, compare với `booking.getUser().getEmail()` |
| **BE-CRIT-07** JwtFilter DB hit | ✅ Fixed đúng | Include `role` claim, build `UserDetails` mà không hit DB |
| **BE-CRIT-08** User enumeration | ✅ Fixed | Cùng message cho 3 case, dùng `LockedException` |
| **BE-CRIT-09** IllegalStateException handler | ✅ Fixed | `@ExceptionHandler(IllegalStateException.class)` → 409 |
| **BE-HIGH-01** Refresh cookie | ✅ Fixed đúng | `/auth/refresh` set cả jwt + refresh_token cookie, hỗ trợ cả cookie lẫn body |
| **BE-HIGH-02** Filters Spring bean | ✅ Fixed | `@Component` |
| **BE-HIGH-03** Pagination safety | ✅ Fixed | Tour/Hotel/Flight/Blog/Search/Search đều dùng `PageableUtil` |
| **BE-HIGH-04** Revenue trả số | ✅ Fixed | Trả `Long` thay vì String |
| **BE-HIGH-05** Tour collections update | ✅ Fixed | Loop clear + add với `setTour` |
| **BE-HIGH-06** Async/Scheduled/Transactional | ⚠️ Partial — `AppConfig` tách `@EnableAsync`/`@EnableScheduling`/`@EnableCaching` ra config riêng, nhưng **vẫn chưa config `TaskScheduler` bean** → vẫn dùng `SimpleAsyncTaskExecutor` mặc định |
| **BE-HIGH-08** CSRF + SameSite | ⚠️ Partial — `SameSite=Lax` giữ nguyên (accept), CSRF vẫn disable (OK cho stateless, nhưng cần double-check) |
| **BE-HIGH-09** Register rate limit | ✅ Fixed | `LoginRateLimitFilter` đã mở rộng cho cả `/api/auth/register` |
| **BE-HIGH-10** Blog content sanitize | ❌ **NOT fixed** | `BlogServiceImpl` vẫn không sanitize content (Jsoup `Safelist.none()` cho mọi field → strip toàn bộ) |
| **BE-HIGH-11** HexFormat | ✅ Fixed | `java.util.HexFormat.of().formatHex(hash)` |
| **BE-HIGH-12** jjwt bump | ❌ **NOT fixed** | Vẫn `jjwt 0.11.5` |
| **BE-HIGH-13** VnpayIpnFilter method check | ❌ **NOT fixed** | Vẫn không check method |
| **BE-HIGH-14** BookingRequest `@Valid` `@Size` | ❌ **NOT fixed** | Vẫn `private List<PassengerRequest> passengers;` không `@Valid`, không `@Size` |
| **FE-CRIT-01** JWT localStorage | ✅ Fixed đúng | `partialize: (state) => ({ user: state.user })` — chỉ persist user, bỏ token & refreshToken |
| **FE-CRIT-02** Refresh flow | ⚠️ Partial — `setAuth` giờ nhận `refreshToken`; nhưng interceptor vẫn check `useAuth.getState().refreshToken` (luôn null sau fix CRIT-01) → vẫn fall vào nhánh logout |
| **FE-CRIT-03** role vs roles | ⚠️ Partial — `AuthUser` có cả `role?` và `roles?`; `hasRole` check cả 2 → OK; nhưng BE vẫn trả `role: String`, FE vẫn không sync hoàn toàn |
| **FE-CRIT-04** PaymentPage redirect | ✅ Fixed | `if (booking.status !== 'RESERVED' && booking.status !== 'PENDING')` |
| **FE-CRIT-05** BookingDTO field mismatch | ⚠️ Partial — `bookingApi.createHold/get` giờ map `{ ...data, bookingCode: 'BK' + data.id, totalAmount: data.totalPrice, expiresAt: data.reservedUntil }` (đắp patch); nhưng PaymentPage vẫn expect `booking.outboundFlight.from`, `booking.passengers.length` — sẽ crash với BookingDTO thật |
| **FE-CRIT-06** HeroSearch dùng API | ✅ Fixed | `searchFlights(payload)` thay vì `mockSearchFlights` |
| **FE-CRIT-07** temp-id flow | ⚠️ Partial — Vẫn có `temp-id` literal, nhưng `createBookingMutation` được add; flow chưa hoàn toàn clean |
| **FE-HIGH-01** App init auth | ✅ Fixed | `initAuth` method gọi `/auth/me` |
| **FE-HIGH-02** BookingApi.get types | ⚠️ Partial — Vẫn trả `FlightBooking` (mock type) với adapter map |
| **FE-HIGH-03** updatePassengers endpoint | ❌ **NOT fixed** | Vẫn `api.post('/bookings/${id}/passengers', pax)` — BE không có endpoint này |
| **FE-HIGH-04** Flight search URL | ⚠️ Partial — FE gọi `/flights` (đúng); BE accept cả `""` lẫn `"/search"`; nhưng params truyền `from/to/departDate` thay vì `departureAirport/arrivalAirport/departureTime` → BE sẽ không filter đúng |
| **FE-HIGH-05** TourDetailPage handleBook | ✅ Fixed | Gọi `bookingApi.createBooking` |
| **FE-HIGH-06** Admin endpoints | ❌ **NOT fixed** | BE chỉ có `/admin/stats`; các endpoint `/admin/flights`, `/admin/bookings`, `/admin/users`, `/admin/news` vẫn không tồn tại |
| **FE-HIGH-07** Force USE_MOCK=true | ✅ Fixed | Bỏ `|| true` |
| **FE-HIGH-08** `as any` | ⚠️ Partial — Vẫn còn nhiều `as any` ở LoginPage, BookingHistoryPage, ManageBookingPage, DashboardPage |
| **FE-HIGH-09** api.get params nesting | ✅ Fixed | `get: <T>(url, config?) => apiClient.get(url, config)` |
| **FE-HIGH-10** BookingHistoryPage dùng useQuery | ❌ **NOT fixed** | Vẫn `useEffect + useState` |
| **FE-HIGH-11** VitePWA devOptions | ❌ **NOT fixed** | Vẫn `devOptions: { enabled: true }` |
| **DB-CRIT-01** V29 column reference | ✅ Fixed | `departure_time`, `arrival_time` đúng |
| **DB-CRIT-02** airports drop, no FK | ❌ **NOT fixed** | Vẫn DROP airports, không có FK trên flights |
| **DB-CRIT-03** transaction_ref UNIQUE | ✅ Fixed | V32 thêm `uk_payment_txn_ref` |
| **DB-CRIT-04** Polymorphic FK | ❌ **NOT fixed** | wishlists/reviews/bookings vẫn polymorphic |
| **DB-HIGH-01** users CHECK | ✅ Partial | V32 add `chk_email_length`, `chk_password_length` (chỉ check length > 0, không phải BCrypt format) |
| **DB-HIGH-04** tours.rating sync | ❌ **NOT fixed** | Vẫn không trigger update từ reviews |
| **DB-HIGH-05** notifications index | ✅ Fixed | V32 add `idx_notifications_user_read` |
| **DB-MED-01..05** | ✅ Fixed | V32 add CHECK constraints + `uk_booking_pax` + `idx_blogs_published_at` + `idx_tours_featured` |
| **INFRA-CRIT-01** SPRING_PROFILES_ACTIVE | ❌ **NOT fixed** | docker-compose vẫn không set profile |
| **INFRA-HIGH-01** VITE_API_URL Dockerfile | ❌ **NOT fixed** | Dockerfile vẫn `RUN npm run build` không ARG |
| **INFRA-HIGH-03** Backend healthcheck | ❌ **NOT fixed** | docker-compose vẫn không có healthcheck cho backend |

### 1.3. Tổng số issue còn lại sau đợt fix

| Severity | BE | FE | DB | Infra | Total |
|---|---|---|---|---|---|
| 🔴 Critical | 0 | 2 | 2 | 0 | **4** |
| 🟠 High | 6 | 9 | 3 | 2 | **20** |
| 🟡 Medium | 11 | 9 | 2 | 2 | **24** |
| 🟢 Low | 4 | 6 | 3 | 1 | **14** |
| **TOTAL** | **21** | **26** | **10** | **5** | **62** |

> **So với lần trước (97 issue)**: giảm 35 issue (~36%), chủ yếu ở Critical (21→4) và Medium/Low. Tuy nhiên vẫn còn **4 Critical** và **20 High** phải fix trước khi production.

### 1.4. Điểm yếu then chốt còn lại

1. **Admin module BE vẫn chưa implement** — `AdminDashboardPage` fallback mock cho 4 chart; `AdminFlightsPage`, `AdminBookingsPage`, `AdminUsersPage`, `AdminNewsPage` dùng mock data cố định.
2. **Contract FE/BE cho Flight search + Booking detail vẫn mismatch** — FE `searchFlights` gửi `from/to/departDate` (string date `YYYY-MM-DD`), BE nhận `departureAirport/arrivalAirport/departureTime` (LocalDateTime); PaymentPage vẫn expect `outboundFlight.from` không tồn tại trong BookingDTO.
3. **VnpayIpnFilter không check HTTP method** + IPs hardcoded → dễ bypass.
4. **`updatePassengers` endpoint FE gọi không tồn tại ở BE** → flow SeatHold → Payment vỡ.
5. **Dockerfile frontend không nhận VITE_API_URL** → build production không biết BE URL.
6. **CSRF vẫn disabled + SameSite=Lax** — chấp nhận được nhưng chưa phải hardening tối ưu.
7. **`@Async` scheduler chưa config `TaskScheduler` bean** → `SimpleAsyncTaskExecutor` mặc định spawn thread vô hạn.
8. **Polymorphic association wishlists/reviews/bookings.reference_id** — không có FK → referential integrity vỡ.
9. **`BookingRequest.passengers` không `@Valid` + không `@Size`** → validation DTO không trigger.
10. **`BookingHistoryPage` không dùng TanStack Query** — inconsistent + không cache.

### 1.5. Khuyến nghị SLA

| Khuyến nghị | Lý do |
|---|---|
| **Có thể deploy staging** sau khi fix 4 Critical còn lại | Staging OK với profile dev |
| **Phase 1 (1 tuần)**: Fix 4 Critical + 6 High BE | Production-ready cơ bản |
| **Phase 2 (1-2 tuần)**: Fix 9 High FE + 3 High DB + 2 High Infra | Production-ready hardening |
| **Phase 3 (1-2 tuần)**: Fix 24 Medium + 14 Low | Polish + DX |

---

## 2. Thông tin tổng quan dự án

### 2.1. Backend Stack (không đổi)

| Thành phần | Phiên bản | Ghi chú |
|---|---|---|
| Spring Boot | 3.2.4 | Cũ; LTS mới nhất 3.3.x/3.4.x |
| Java | 17 | LTS, OK |
| jjwt | 0.11.5 | **Vẫn cũ** — chưa bump lên 0.12.x |
| Bucket4j | 8.10.1 | OK |
| Caffeine | 3.x | OK |
| jsoup | 1.17.2 | OK |

### 2.2. Frontend Stack (không đổi)

React 19.2.7 / Vite 8.1.1 / TypeScript 6.0.2 / TanStack Query 5.101.2 / Zustand 5.0.14 / Tailwind 3.4.19 / React Router 7.18.1 / shadcn/ui 4.12.0 / axios 1.18.1 / oxlint 1.71.0.

### 2.3. Thống kê file đã rà soát (lần này)

| Loại | Số file | Trạng thái |
|---|---|---|
| Backend Java (main) | 120 (+1: `AppConfig.java` mới) | 100% |
| Backend SQL migration | 15 (+1: `V32__fix_constraints_and_schemas.sql` mới) | 100% |
| Frontend TS/TSX | 131 | 100% |
| Infra | docker-compose, 2 Dockerfile, application.yml, application-dev.yml | 100% |
| Test | 8 test file | 100% |

---

## 3. Phần A — FRONTEND REVIEW

### 3.1. 🔴 CRITICAL

#### FE-CRIT-01 — Refresh flow vẫn broken do interceptor phụ thuộc `refreshToken` trong store

**File**: `frontend/src/api/client.ts:51, 60-67` + `frontend/src/store/authStore.ts:30-58`

**Code hiện tại**:

```ts
// authStore.ts — đã fix đúng: chỉ persist user, KHÔNG persist token/refreshToken
partialize: (state) => ({ user: state.user })

// client.ts — vẫn kiểm tra refreshToken trong store
const refreshToken = useAuth.getState().refreshToken;
if (!refreshToken) {
  processQueue(error, null);
  useAuth.getState().logout();
  window.location.href = '/login';
  return Promise.reject(error);
}
```

**Vấn đề**: Sau khi fix CRIT-01 (bỏ `token`/`refreshToken` khỏi `partialize`), `refreshToken` trong store sẽ là **`null` sau mỗi F5**. Khi access token (cookie HttpOnly 15 phút) hết hạn → 401 → interceptor đọc `useAuth.getState().refreshToken` → **luôn null** → logout ngay.

Mặc dù BE đã support refresh qua HttpOnly cookie (path `/api/auth/refresh`) — nhưng FE interceptor vẫn dựa vào `refreshToken` trong store để quyết định có refresh hay không.

**Impact**: User vẫn phải login lại mỗi 15 phút (hoặc sau mỗi F5). Refresh token rotation BE đã đúng nhưng FE không dùng đúng cơ chế cookie.

**CVSS**: 7.5 (High) — AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H

**Recommendation**:
- Bỏ check `if (!refreshToken)` trong interceptor — vì BE đã support refresh qua cookie.
- Hoặc: dùng `axios.post(BASE_URL + '/auth/refresh', {}, { withCredentials: true })` để BE đọc `refresh_token` cookie tự động.

---

#### FE-CRIT-02 — PaymentPage vẫn expect `outboundFlight`, `passengers.length` không tồn tại trong BookingDTO

**File**: `frontend/src/pages/PaymentPage.tsx:80-97` + `frontend/src/types/flight.ts:50-63` + BE `BookingDTO.java`

**Code PaymentPage**:
```tsx
{booking.outboundFlight && (
  <div className="bg-slate-50 p-3 rounded-lg border border-vna-border mb-4">
    <p className="font-semibold text-sm">{booking.outboundFlight.from} → {booking.outboundFlight.to}</p>
    <p className="text-xs text-vna-muted">{booking.outboundFlight.departTime} - {booking.outboundFlight.airline}</p>
    {booking.returnFlight && (...)}
  </div>
)}
...
<span className="text-vna-muted">Hành khách ({booking.passengers.length})</span>
<span>{formatVND(booking.totalAmount || 0)}</span>
```

**BE `BookingDTO` thực tế trả về**:
```java
private Long id;
private UserSummaryDTO user;
private String bookingType;
private Long referenceId;
private String status;
private BigDecimal totalPrice;
private LocalDateTime reservedUntil;
private LocalDateTime createdAt;
private List<BookingPassengerDTO> passengers;
```

— **Không có** `outboundFlight`, `returnFlight`, `totalAmount`, `bookingCode`, `contactEmail`.

**FE `bookingApi.get` đã đắp patch map**:
```ts
get: async (id) => {
  const data = await api.get(`/bookings/${id}`);
  return { ...data, bookingCode: 'BK' + data.id, totalAmount: data.totalPrice, expiresAt: data.reservedUntil };
}
```

→ Map `totalAmount` OK, nhưng **vẫn không có** `outboundFlight`, `returnFlight`. `passengers` tồn tại nhưng có type `Passenger[]` FE (với `firstName/lastName`) trong khi BE trả `BookingPassengerDTO` (với `fullName` string).

**Impact**:
- `booking.outboundFlight.from` → `undefined.from` → TypeError → PaymentPage crash hoặc render mảng rỗng.
- `booking.passengers.length` → nếu BE trả `passengers: null` (booking mới tạo chưa add passenger) → `null.length` → TypeError.
- Booking flight không hiển thị thông tin chuyến bay (vì BE chỉ lưu `referenceId: Long` + `bookingType: 'flight'`, không có polymorphic DTO).

**CVSS**: 8.2 (High) — AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:H

**Recommendation**:
- BE thêm polymorphism cho BookingDTO (FlightBookingDTO với `outboundFlight`, TourBookingDTO với `tour`, HotelBookingDTO với `hotel`).
- Hoặc FE PaymentPage xử lý case `outboundFlight` undefined (hiển thị mã booking + type thay vì flight detail).

---

### 3.2. 🟠 HIGH

#### FE-HIGH-01 — `updatePassengers` endpoint FE gọi không tồn tại ở BE

**File**: `frontend/src/api/booking.ts:35-36`

```ts
updatePassengers: (id: string, pax: Passenger[]): Promise<FlightBooking> =>
  USE_MOCK ? mockUpdatePassengers(id, pax) : api.post(`/bookings/${id}/passengers`, pax),
```

BE `BookingController` chỉ có: POST `/api/bookings`, GET `/api/bookings/{id}`, GET `/api/bookings/my-bookings`, GET `/api/bookings/search`. **Không có** `POST /api/bookings/{id}/passengers`.

**Impact**: SeatHoldPage → updatePassengers → 404 → flow vỡ.

**Recommendation**: BE add endpoint `PUT /api/bookings/{id}/passengers` hoặc FE gộp passengers vào `createBooking`.

---

#### FE-HIGH-02 — Flight search params FE/BE không khớp

**File**: `frontend/src/api/flights.ts:10` + BE `FlightController.java:22-29`

```ts
// FE
return api.get<FlightSearchResponse>('/flights', { params: req });
// req = { from, to, departDate, returnDate, tripType, adults, children, infants, cabin, promoCode }
```

```java
// BE
@GetMapping(value = {"", "/search"})
public ResponseEntity<...> getFlights(
    @RequestParam(required = false) String departureAirport,
    @RequestParam(required = false) String arrivalAirport,
    @RequestParam(required = false) LocalDateTime departureTime,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @RequestParam(defaultValue = "id,desc") String sort)
```

| FE param | BE param | Match? |
|---|---|---|
| `from: "HAN"` | `departureAirport` | ❌ |
| `to: "SGN"` | `arrivalAirport` | ❌ |
| `departDate: "2025-01-15"` | `departureTime: LocalDateTime` | ❌ (còn format) |
| `adults/children/infants` | (không có) | ❌ |
| `cabin: "economy"` | (không có) | ❌ |
| `tripType` | (không có) | ❌ |

**Hệ quả**: BE nhận `departureAirport=null` → trả toàn bộ flights. FE expect `FlightSearchResponse { outbound: Flight[], return?: Flight[] }` nhưng BE trả `Page<FlightDTO>` (`content: FlightDTO[]`). Cast type chạy nhưng data sai shape → `data.outbound` undefined → UI rỗng.

**Recommendation**: Đồng bộ 1 trong 2 bên; ưu tiên BE mở rộng endpoint để nhận đúng param FE gửi.

---

#### FE-HIGH-03 — `Flight` type FE vs `FlightDTO` BE mismatch hoàn toàn

**File**: `frontend/src/types/flight.ts:17-32` vs BE `FlightDTO.java`

| FE `Flight` | BE `FlightDTO` |
|---|---|
| `id: string` | `id: Long` |
| `flightNo: string` | `flightNumber: string` + `airlineCode: string` |
| `from?: string` | `departureAirport: string` |
| `to?: string` | `arrivalAirport: string` |
| `departTime: string` (HH:mm) | `departureTime: LocalDateTime` |
| `arriveTime: string` (HH:mm) | `arrivalTime: LocalDateTime` |
| `airline: string` | (không có — chỉ có airlineCode) |
| `duration: string` | (không có) |
| `stops: number` | (không có) |
| `aircraft: string` | (không có) |
| `cabin: string` | `seatClass: string` |
| `priceVND: number` | `price: BigDecimal` |
| `seatsLeft: number` | `availableSeats: Integer` |
| `nextDay?: boolean` | (không có) |

**Impact**: HeroSearch → searchFlights → BE trả FlightDTO[] nhưng FE cast thành Flight[] → `flight.flightNo`, `flight.departTime` (string), `flight.priceVND`, `flight.aircraft` → **tất cả undefined** → FlightCard render rỗng hoặc crash.

**Recommendation**: Sinh types từ OpenAPI; hoặc map FlightDTO → Flight ở client layer.

---

#### FE-HIGH-04 — Admin module FE dùng mock, BE chưa implement endpoints

**File**: `frontend/src/api/admin.ts:8-26` + `frontend/src/pages/admin/*.tsx`

FE đã bỏ `|| true`, giờ đọc `USE_MOCK` đúng chuẩn. Nhưng khi `USE_MOCK=false`:
- `adminApi.flights.list()` → `api.get('/admin/flights')` → **404** (BE không có).
- Tương tự `/admin/bookings`, `/admin/users`, `/admin/news`, `/admin/users/{id}/roles`, CRUD news.

BE `AdminController` chỉ có `GET /api/admin/stats` (với `@PreAuthorize("hasRole('ADMIN')")`).

**Impact**: Admin pages (Flights/Bookings/Users/News) sẽ **luôn lỗi 404** khi bật USE_MOCK=false. Admin chỉ thấy dashboard có totalBookings + totalRevenue (số), 4 chart còn dùng mock.

**Recommendation**: BE implement các endpoint admin hoặc FE giữ mock vĩnh viễn cho admin module.

---

#### FE-HIGH-05 — `BookingHistoryPage` vẫn dùng `useEffect + useState` thay vì TanStack Query

**File**: `frontend/src/pages/BookingHistoryPage.tsx:13-26`

```ts
useEffect(() => {
  if (!isAuthenticated) return;
  const fetchBookings = async () => {
    try {
      const res: any = await bookingApi.getMyBookings();
      setBookings(res.content || res.data?.content || []);
    } catch (error) {
      toast.error('Lỗi khi tải lịch sử đặt chỗ');
    } finally {
      setIsLoading(false);
    }
  };
  fetchBookings();
}, [isAuthenticated]);
```

Codebase có TanStack Query (dùng ở DashboardPage, BookingDetailPage, PaymentPage, AdminFlightsPage...). BookingHistoryPage vẫn dùng pattern cũ. Inconsistent + không cache + không auto refetch + `res.content || res.data?.content || []` fragile.

**Recommendation**: Refactor sang `useQuery`.

---

#### FE-HIGH-06 — VitePWA `devOptions.enabled = true` vẫn chưa fix

**File**: `frontend/vite.config.ts:13-15`

```ts
VitePWA({
  registerType: 'autoUpdate',
  devOptions: { enabled: true },
  ...
})
```

Service worker cache trong dev → code mới không hiển thị → dev khó debug.

**Recommendation**: `devOptions: { enabled: false }` hoặc toggle qua env.

---

#### FE-HIGH-07 — `BookingDetailPage` và `ManageBookingPage` vẫn expect `outboundFlight`, `firstName/lastName` không tồn tại

**File**: `frontend/src/pages/BookingDetailPage.tsx:33,70,73,80` + `ManageBookingPage.tsx:53,55-58,61`

```tsx
// BookingDetailPage
<h1>{booking?.outboundFlight?.from} - {booking?.outboundFlight?.to}</h1>
<h3>{booking?.outboundFlight?.flightNo || 'VN-123'}</h3>
<span>{booking?.outboundFlight?.airline || 'Vietnam Airlines'}</span>
<span>{booking?.outboundFlight?.departTime ? 'Oct 15, 2024' : 'Oct 15, 2024'}</span>  // ternary vô nghĩa
```

```tsx
// ManageBookingPage
passengers: b.passengers?.map((p: any) => `${p.firstName} ${p.lastName}`) || [],
```

BE trả `BookingPassengerDTO.fullName: String` (không tách firstName/lastName). `booking.outboundFlight` không tồn tại trong BookingDTO.

**Impact**: BookingDetailPage render gần như toàn mock. ManageBookingPage list passengers rỗng.

**Recommendation**: Đồng bộ type + DTO.

---

#### FE-HIGH-08 — `ConfirmationPage` expect `booking.contactEmail`, `booking.passengers` type sai

**File**: `frontend/src/pages/ConfirmationPage.tsx:41,74-79`

```tsx
<p>{t('confirm.emailSent').replace('{email}', booking.contactEmail || '')}</p>
...
{booking.passengers.map((p, i) => (
  <div key={i}>
    <span>{p.fullName}</span>
    <span>({t(`hold.passenger.${p.type}`)})</span>  // ← p.type không có trong BookingPassengerDTO
  </div>
))}
```

BE `BookingPassengerDTO`: `id, fullName, email, phone, documentNumber` — **không có** `type` (adult/child/infant), **không có** `contactEmail` ở BookingDTO.

**Recommendation**: BE thêm `passengerType` field, hoặc FE bỏ logic display type.

---

#### FE-HIGH-09 — Nhiều `as any` và type escape chưa dọn dẹp

**Files**:
- `LoginPage.tsx:31`: `const res = await authApi.login(...) as any;`
- `BookingHistoryPage.tsx:17`: `const res: any = await bookingApi.getMyBookings();`
- `BookingHistoryPage.tsx:9`: `useState<any[]>`
- `DashboardPage.tsx:23`: `(bookingsData as any)?.content || (bookingsData as any)?.data?.content`
- `DashboardPage.tsx:163`: `bookings.reduce((sum: number, b: any) => ...)`
- `ManageBookingPage.tsx:47`: `const res: any = await bookingApi.search(...)`
- `PaymentPage.tsx:24`: `onSuccess: (data: any) => {...}`
- `PaymentCallbackPage.tsx:15`: `const response: any = await api.get(...)`
- `booking.ts:24,32`: `const data: any = await api.post/get(...)`

**Recommendation**: Sinh types từ OpenAPI; bỏ `as any`; bật oxlint rule `no-explicit-any: error`.

---

### 3.3. 🟡 MEDIUM

#### FE-MED-01 — `LoginResponse` type khai `accessToken` nhưng BE trả `token`
`api/auth.ts:4-7` — `LoginResponse { accessToken: string; user: AuthUser; }`, nhưng BE `AuthResponse { token, refreshToken, user }`. Code dùng `res.accessToken || res.token` để cover, nhưng type sai.

#### FE-MED-02 — `RegisterPage` điều hướng `/login` sau register thay vì auto-login
BE `register()` đã auto-login (trả token + refreshToken + set cookie). FE `RegisterPage.handleSubmit` chỉ `navigate('/login')` → user phải login lại. Nên `setAuth(res.user, res.token, res.refreshToken)` rồi navigate `/profile`.

#### FE-MED-03 — `ProfilePage:88` `user.id.padStart(8, '0')` — `user.id` có thể là `number` từ BE
`AuthUser.id: string` nhưng BE trả `Long`. Khi persist localStorage rồi đọc lại, có thể là number → `.padStart` không tồn tại.

#### FE-MED-04 — `DashboardPage:67,79,91` hardcoded "4,500" / "8" / "15%"
Mock stats không thay thế bằng data thật.

#### FE-MED-05 — `SeatSelectionPage:47` vẫn `requiredSeats = 2` hardcoded
Không đọc từ booking thực.

#### FE-MED-06 — `BookingDetailPage` dùng class `material-symbols-outlined` không import font
Icons sẽ không hiển thị.

#### FE-MED-07 — `SeatHoldPage:74-75` hardcoded `'guest@example.com'`, `'0901234567'`
Vẫn chưa lấy từ user authenticated.

#### FE-MED-08 — `ConfirmationPage:60` `FlightDetail` expect `flight.cabin` nhưng `Flight` type có `cabin: string` — OK type, nhưng BE không trả cabin cho BookingDTO.

#### FE-MED-09 — Hardcoded Unsplash URLs ở nhiều page
`TourDetailPage`, `HotelsPage`, `ToursPage`, `LoginPage`, `RegisterPage` — phụ thuộc external.

---

### 3.4. 🟢 LOW

#### FE-LOW-01 — `App.tsx:62` `RouteBoundary` dùng `key={location.pathname}` để reset ErrorBoundary — đúng pattern nhưng mỗi navigate tạo ErrorBoundary mới → children unmount/remount → mất state local.
#### FE-LOW-02 — `components/ui/index.ts` export barrel không nhất quán
#### FE-LOW-03 — `SeatHoldPage.tsx:9` import `../store/langStore` thay vì `@/store/langStore`
#### FE-LOW-04 — `BookingDetailPage.tsx:80,85` ternary vô nghĩa `'Oct 15, 2024' : 'Oct 15, 2024'`
#### FE-LOW-05 — `DashboardPage.tsx:33` text English "Here is a summary of your travel activities" — thiếu i18n
#### FE-LOW-06 — `index.html` không có meta description / og tags

---

## 4. Phần B — BACKEND REVIEW

### 4.1. 🔴 CRITICAL

> Tất cả 9 Critical từ lần trước đã được fix đúng. Không có Critical BE mới phát sinh.

### 4.2. 🟠 HIGH

#### BE-HIGH-01 — `@Async` scheduler chưa config `TaskScheduler` bean

**File**: `backend/.../config/AppConfig.java`

```java
@Configuration
@EnableScheduling
@EnableCaching
@EnableAsync
public class AppConfig {
}
```

Đã tách ra config riêng (tốt hơn lần trước khi để trên `BackendApplication`), nhưng **vẫn chưa define `TaskScheduler` hoặc `TaskExecutor` bean**. Spring Boot default dùng `SimpleAsyncTaskExecutor` (không reuse thread, không limit pool size).

`ReservationScheduler.releaseExpiredReservations` chạy `@Async` + `@Scheduled(cron = "0 * * * * *")` (mỗi phút). Mỗi lần trigger spawn 1 thread mới. Nếu task chạy lâu (nhiều booking expired) → thread tích lũy → **thread leak**.

**CVSS**: 6.5 (Medium-High) — AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H

**Recommendation**:
```java
@Bean
public TaskScheduler taskScheduler() {
    ThreadPoolTaskScheduler s = new ThreadPoolTaskScheduler();
    s.setPoolSize(5);
    s.setThreadNamePrefix("scheduler-");
    s.setWaitForTasksToCompleteOnShutdown(true);
    return s;
}
@Bean
public TaskExecutor taskExecutor() {
    ThreadPoolTaskExecutor e = new ThreadPoolTaskExecutor();
    e.setCorePoolSize(5);
    e.setMaxPoolSize(20);
    e.setQueueCapacity(100);
    return e;
}
```

---

#### BE-HIGH-02 — VnpayIpnFilter không check HTTP method

**File**: `backend/.../security/VnpayIpnFilter.java:38`

```java
if (request.getRequestURI().equals("/api/payments/ipn")) {
    String ip = request.getHeader("X-Forwarded-For");
    ...
}
```

Không check `request.getMethod() == "GET"` hay `"POST"`. Attacker có thể dùng GET với query string để bypass filter logic (vẫn pass filter, đi vào controller).

**CVSS**: 5.3 (Medium) — AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N

**Recommendation**: `if (uri.equals("/api/payments/ipn") && "GET".equalsIgnoreCase(request.getMethod()))`.

---

#### BE-HIGH-03 — `BookingRequest.passengers` không `@Valid` + không `@Size`

**File**: `backend/.../dto/request/BookingRequest.java:11-20`

```java
@Data
public class BookingRequest {
    @NotBlank
    private String bookingType;

    @NotNull
    private Long referenceId;

    private List<PassengerRequest> passengers;  // ← không @Valid, không @Size
}
```

Service có check `quantity > 9` (đã fix), nhưng:
- `PassengerRequest` có `@NotBlank @Email` validation nhưng **không trigger** vì thiếu `@Valid` ở parent.
- `passengers: null` vẫn pass → service set quantity=1 → không có validation field passenger.
- `passengers: []` (empty) → quantity=1 → booking tạo với không passenger.

**CVSS**: 5.3 (Medium) — Integrity impact.

**Recommendation**:
```java
@Valid
@Size(max = 9)
private List<PassengerRequest> passengers;
```

---

#### BE-HIGH-04 — `HtmlSanitizer.sanitize` dùng `Safelist.none()` cho mọi field — Blog content bị strip HTML

**File**: `backend/.../utils/HtmlSanitizer.java:6-11`

```java
public class HtmlSanitizer {
    public static String sanitize(String input) {
        if (input == null) return null;
        return Jsoup.clean(input, Safelist.none());
    }
}
```

`Safelist.none()` strip toàn bộ HTML → OK cho `fullName`, `phone`, `comment`. Nhưng `Blog.content` là rich-text (có `<p>`, `<b>`, `<img>` từ V22 migration). `BlogServiceImpl` **không** sanitize `content` (chỉ map 1-1) → **stored XSS** nếu render qua `dangerouslySetInnerHTML`.

BE đã publish blog sample V22 với HTML trong `content` — FE `BlogDetailPage` render cần sanitize client-side (đã có `dompurify` trong package.json).

**Defense in depth**: BE cũng nên sanitize với `Safelist.relaxed()` cho blog content.

**CVSS**: 6.1 (Medium) — AV:N/AC:L/PR:L/UI:R/S:C/C:L/I:L/A:N

**Recommendation**:
```java
public static String sanitize(String input) { return sanitize(input, Safelist.none()); }
public static String sanitizeRich(String input) { return sanitize(input, Safelist.relaxed()); }
```
+ Apply `sanitizeRich` cho `Blog.content` và `Tour.overview`.

---

#### BE-HIGH-05 — jjwt 0.11.5 cũ — deprecated API + CVE tiềm ẩn

**File**: `backend/pom.xml:107-122`

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>  <!-- cũ -->
</dependency>
```

jjwt 0.11.x dùng deprecated API (`setSubject`, `parserBuilder`). 0.12.x có breaking change nhưng an toàn hơn + fix CVE.

**CVSS**: 4.3 (Medium) — Maintenance/debt.

**Recommendation**: Bump lên `0.12.6`; migrate API sang `Jwts.builder().subject(...)`, `Jwts.parser().verifyWith(...).build()`.

---

#### BE-HIGH-06 — `ReservationScheduler` không có transaction boundary rõ ràng khi loop

**File**: `backend/.../scheduler/ReservationScheduler.java:25-44`

```java
@Async
@Scheduled(cron = "0 * * * * *")
@Transactional
public void releaseExpiredReservations() {
    List<Booking> expiredBookings = bookingRepository.findByStatusAndReservedUntilBefore(...);
    for (Booking booking : expiredBookings) {
        try {
            booking.transitionTo(BookingStatus.EXPIRED);
            bookingRepository.save(booking);
            strategy.release(booking.getReferenceId(), quantity);
        } catch (Exception e) {
            log.error("Failed to release reservation {}: {}", ...);
        }
    }
}
```

**Vấn đề**: Toàn bộ method là 1 transaction. Nếu 1 booking fail (catch exception), transaction vẫn tiếp tục → **partial commit**. Ngoài ra:
- `strategy.release()` (gọi `incrementAvailableSeats`) là `@Modifying` query — cần `@Transactional` riêng hoặc kế thừa từ method này (OK).
- Nếu 1 booking release fail, booking đã `transitionTo(EXPIRED)` + `save()` nhưng release ghế fail → **vẫn leak ghế** cho booking đó.

**Recommendation**: Mỗi booking là 1 transaction riêng (dùng `REQUIRES_NEW` propagation cho sub-method), hoặc dùng `TransactionTemplate` programmatically.

---

#### BE-HIGH-07 — `BookingStrategyFactory.getStrategy` lowercase không trim

**File**: `backend/.../service/strategy/booking/BookingStrategyFactory.java:21-27`

```java
public BookingItemStrategy getStrategy(String bookingType) {
    BookingItemStrategy strategy = strategies.get(bookingType.toLowerCase());
    if (strategy == null) {
        throw new BusinessException("Invalid booking type: " + bookingType);
    }
    return strategy;
}
```

`"  TOUR  ".toLowerCase()` → `"  tour  "` → null → throw. Nên `.trim().toLowerCase()`.

Ngoài ra: `paymentGatewayFactory.getStrategy` cũng cùng pattern.

---

#### BE-HIGH-08 — `Booking.searchByCodeAndLastName` vẫn fragile contract

**File**: `backend/.../service/impl/BookingServiceImpl.java:131-143`

```java
String idStr = bookingCode.toUpperCase().replace("BK", "");
Long id = Long.parseLong(idStr);
```

- Không check `bookingCode` starts with "BK" → user gửi "BK123BK456" → strip 2 lần → "123456" → parse OK nhưng sai.
- FE `ManageBookingPage` không có logic prefix "BK" — chỉ gửi `code` raw.

---

#### BE-HIGH-09 — `AdminServiceImpl` chỉ có `getAdminStats`, không có endpoints admin khác

**File**: `backend/.../controller/AdminController.java`

Chỉ có `GET /api/admin/stats`. FE expect thêm `/admin/flights`, `/admin/bookings`, `/admin/users`, `/admin/news`, `/admin/users/{id}/roles`.

**Recommendation**: Implement admin CRUD endpoints.

---

### 4.3. 🟡 MEDIUM

#### BE-MED-01 — `Lombok @Builder` trên JPA entity
Conflict tiềm ẩn với JPA proxying; `@Builder.Default` cho `status` có thể không hoạt động khi Hibernate instantiate qua reflection.

#### BE-MED-02 — `BookingRepository.expireReservations` (cũ) vẫn còn — dead code
```java
@Modifying
@Query("UPDATE Booking b SET b.status = ...EXPIRED WHERE ...RESERVED AND ...reservedUntil < :now")
int expireReservations(LocalDateTime now);
```
Đã thay bằng `findByStatusAndReservedUntilBefore` + loop trong scheduler. Nên xóa method cũ.

#### BE-MED-03 — `SearchServiceImpl.searchAll` hardcode halfSize
Không có test; logic phân chia page không rõ ràng với sort.

#### BE-MED-04 — `CustomUserDetails.isAccountNonLocked` giờ check `lockedUntil` ✓ — đã fix đúng.

#### BE-MED-05 — `UserServiceImpl.updateProfile` không validate email/phone unique
Update phone mà trùng user khác → không có check.

#### BE-MED-06 — `NotificationServiceImpl.createNotification` có `@Transactional` ✓ — đã fix.

#### BE-MED-07 — `JwtUtil.validateJwtToken` log.warn thay vì throw — OK.
Nhưng log nhiều noise nếu bot scan.

#### BE-MED-08 — `PageableUtil.createPageable` đã validate sort field ✓ (`property.matches("^[a-zA-Z0-9_]+$")`) — fixed đúng.

#### BE-MED-09 — `PaymentServiceImpl.handleCallback` check `if (!"pending".equals(payment.getStatus()))` → return early — idempotency ✓ — đã fix đúng.

#### BE-MED-10 — `Booking.transitionTo` vẫn có logic rỗng: 
```java
if (this.status == BookingStatus.EXPIRED && nextStatus != BookingStatus.CONFIRMED) {
    throw new IllegalStateException("Cannot transition from EXPIRED to anything other than CONFIRMED");
}
```
Cho phép EXPIRED → CONFIRMED là hợp lệ không? Logic business này cần xem lại — booking hết hạn rồi vẫn confirm được là strange.

#### BE-MED-11 — `RefreshTokenCleanupScheduler` + `ReservationScheduler` đều `@Async` + `@Scheduled` + `@Transactional` — combo này cần `TaskScheduler` bean (xem BE-HIGH-01).

---

### 4.4. 🟢 LOW

#### BE-LOW-01 — `utils/` vs `util/` directory duplicate — `HtmlSanitizer` ở `utils/`, `PageableUtil` ở `util/`. Chưa thống nhất.
#### BE-LOW-02 — `pom.xml` có `<scm>`, `<license>`, `<developer>` rỗng.
#### BE-LOW-03 — `application-dev.yml` quá ít config (chỉ show-sql).
#### BE-LOW-04 — `ApiResponse.error` không set `success = false` tường minh (dùng builder → default false OK nhưng nên explicit).

---

## 5. Phần C — DATABASE REVIEW

> Phần này rà soát 15 migration files (V1, V2, V3, V20→V29, V31, V32 mới) + entity mapping + schema design + index + FK + constraint + normal form + security + migration safety.

### 5.1. 🔴 CRITICAL — DB

#### DB-CRIT-01 — `V29` DROP TABLE airports nhưng `flights.departure_airport` không có FK

**File**: `V29__cleanup_data.sql:1` + `V1__init_schema.sql:107-119`

```sql
-- V29
DROP TABLE IF EXISTS airports;

-- V1 (flights table)
departure_airport VARCHAR(10) NOT NULL,  -- ← không có FK
arrival_airport VARCHAR(10) NOT NULL,    -- ← không có FK
```

V29 drop `airports` table → `flights.departure_airport` thành orphan string. User insert flight với `departure_airport = 'XYZ'` (không tồn tại) → không có lỗi DB. **Referential integrity vỡ hoàn toàn**.

**CVSS**: 6.5 (Medium-High) — AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:N

**Recommendation**: Hoặc giữ `airports` table + add FK `flights.departure_airport → airports.code`, hoặc accept text string (document rõ).

---

#### DB-CRIT-02 — Polymorphic association không có FK (wishlists, reviews, bookings.reference_id)

**File**: `V1__init_schema.sql:159-178` (wishlists, reviews) + `:122-133` (bookings)

```sql
-- wishlists
item_type ENUM('tour','hotel','flight') NOT NULL,
item_id BIGINT NOT NULL,  -- ← polymorphic, không FK

-- reviews
item_type ENUM('tour','hotel','flight') NOT NULL,
item_id BIGINT NOT NULL,  -- ← polymorphic, không FK

-- bookings
booking_type ENUM('tour','hotel','flight') NOT NULL,
reference_id BIGINT NOT NULL, -- references tour_id, hotel_id, or flight_id  -- ← polymorphic
```

**Anti-pattern**: Không thể enforce referential integrity ở DB level. User tạo wishlist `item_type='tour', item_id=99999` (tour không tồn tại) → không có lỗi. Khi tour bị xóa → wishlist orphan.

**CVSS**: 5.3 (Medium) — AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:N

**Recommendation**: 
- (A) 3 table riêng: `tour_wishlists`, `hotel_wishlists`, `flight_wishlists` mỗi table có FK.
- (B) Giữ polymorphic + add trigger validation.
- (C) Accept trade-off + document.

---

### 5.2. 🟠 HIGH — DB

#### DB-HIGH-01 — `users.email` VARCHAR(100) có thể thiếu cho email dài

RFC 5321 cho phép email 254 ký tự. Hiện chỉ 100. Ngoài ra `password_hash` VARCHAR(255) không có CHECK length (V32 chỉ check `LENGTH(password_hash) > 0`, không check BCrypt format 60 ký tự).

---

#### DB-HIGH-02 — `bookings.user_id` ON DELETE SET NULL tạo orphan booking

```sql
-- V1
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
```

Khi user delete → `booking.user_id = NULL` (booking vẫn còn). Nếu user vô tình delete account → booking vẫn tồn tại với `user_id = NULL` → admin không biết của ai. Nên `ON DELETE RESTRICT` để chặn delete user nếu còn booking, hoặc soft-delete user.

---

#### DB-HIGH-03 — `tours.rating` + `tours.review_count` không sync với `reviews` table

`ReviewServiceImpl.createReview` insert vào `reviews` table nhưng không update `tours.rating`/`tours.review_count`. 2 nguồn data lệch vĩnh viễn.

**Recommendation**: 
- (A) Tính on-the-fly từ `reviews` (view).
- (B) Update `tours` trong transaction tạo review (denormalization có chủ đích).

---

### 5.3. 🟡 MEDIUM — DB

#### DB-MED-01 — `V23` tạo `wishlist` (số ít) table mới dù V1 đã có `wishlists` (số nhiều)
V28 drop `wishlist`. Nhưng sequence V1→V23→V28 là confusing. Nếu có data thật trong V1 wishlists → bị mất (V23 tạo bảng mới tên khác, V28 drop bảng V23). Acceptable cho dev nhưng **không safe cho production**.

#### DB-MED-02 — `V21` INSERT sample flights với ngày `2025-01-01` — sẽ outdated
Sample data chỉ dùng được cho demo. Production cần refresh hoặc remove.

---

### 5.4. 🟢 LOW — DB

#### DB-LOW-01 — `users.role` VARCHAR(50) default 'USER' — nên dùng ENUM('USER','ADMIN') hoặc table riêng
#### DB-LOW-02 — `payments.status` VARCHAR thay vì ENUM (V32 đã add CHECK constraint, OK)
#### DB-LOW-03 — `bookings.status` ENUM không có `failed` — entity `BookingStatus` có 6 giá trị (PENDING, RESERVED, CONFIRMED, CANCELLED, EXPIRED, FAILED) nhưng DB ENUM chỉ 5. Nếu entity có status FAILED → DB reject.

**Recommendation**: `ALTER TABLE bookings MODIFY COLUMN status ENUM('pending','reserved','confirmed','cancelled','expired','failed') NOT NULL DEFAULT 'pending';`

---

### 5.5. Migration Safety Review (V32 mới)

**V32__fix_constraints_and_schemas.sql** — review chi tiết:

```sql
-- Fix DB-CRIT-03
ALTER TABLE payments ADD CONSTRAINT uk_payment_txn_ref UNIQUE (transaction_ref);
```
✓ OK — nhưng nếu đã có duplicate `transaction_ref` trong data → migration fail. Cần verify data sạch trước khi chạy.

```sql
-- Fix DB-HIGH-01
ALTER TABLE users ADD CONSTRAINT chk_email_length CHECK (LENGTH(email) >= 5);
ALTER TABLE users ADD CONSTRAINT chk_password_length CHECK (LENGTH(password_hash) > 0);
```
⚠️ `LENGTH(password_hash) > 0` quá lỏng — BCrypt hash luôn 60 ký tự. Nên `LENGTH(password_hash) = 60`.

```sql
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_refresh_tokens_user_revoked ON refresh_tokens(user_id, revoked);
```
✓ OK — composite index cho query patterns.

```sql
ALTER TABLE tours ADD CONSTRAINT chk_old_price CHECK (old_price IS NULL OR old_price > price);
ALTER TABLE flights ADD CONSTRAINT chk_available_seats CHECK (available_seats >= 0);
```
✓ OK — data integrity.

```sql
ALTER TABLE booking_passengers ADD CONSTRAINT uk_booking_pax UNIQUE (booking_id, full_name, document_number);
```
⚠️ `document_number` có thể NULL (V1 không NOT NULL) → MySQL UNIQUE cho phép multiple NULL → constraint vô hiệu cho passenger không có document. Cần `COALESCE(document_number, '')` hoặc NOT NULL.

```sql
CREATE INDEX idx_blogs_published_at ON blogs(published_at DESC);
CREATE INDEX idx_tours_featured ON tours(is_featured);
```
✓ OK.

```sql
ALTER TABLE payments ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE bookings ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
```
⚠️ `bookings` đã có `updated_at` từ V1 (line 131) → `ADD COLUMN` sẽ fail với "Duplicate column name". Cần `IF NOT EXISTS` hoặc check trước. **Migration blocker trên fresh DB**.

```sql
ALTER TABLE payments ADD CONSTRAINT chk_payment_status CHECK (status IN ('pending', 'completed', 'failed', 'refunded'));
```
⚠️ Entity `Payment.status` chỉ có 3 giá trị (pending, completed, failed) — `refunded` không có trong code. Constraint OK nhưng code chưa support.

---

### 5.6. Index Audit (sau V32)

| Bảng | Index hiện tại | Query pattern chính | Status |
|---|---|---|---|
| users | UNIQUE(email) | `findByEmail` | OK |
| tours | UNIQUE(slug), FULLTEXT(name,location,overview), `idx_tours_featured` | `findBySlug`, search, featured | OK |
| hotels | UNIQUE(slug), FULLTEXT(name,location) | `findBySlug`, search | OK |
| flights | `flight_number` | search by airports + date | **STILL MISSING**: `(departure_airport, arrival_airport, departure_time)` |
| bookings | `(status, reserved_until)`, `user_id`, `version` | scheduler, user bookings | OK |
| booking_passengers | `uk_booking_pax` (V32) | `findByIdAndPassengerLastName` | **STILL MISSING**: index trên `(booking_id, full_name)` cho query search |
| payments | `status` (V29), UNIQUE `transaction_ref` (V32), `version` | `findByTransactionRef` | OK |
| wishlists | UNIQUE(user_id, item_type, item_id) | check exists | OK |
| reviews | UNIQUE(user_id, item_type, item_id) | `findByItemTypeAndItemId` | **STILL MISSING**: `(item_type, item_id)` cho query list reviews |
| blogs | UNIQUE(slug), FULLTEXT(title, excerpt), `idx_blogs_published_at` (V32) | `findAllByOrderByPublishedAtDesc` | OK |
| notifications | `idx_notifications_user_read` (V32) | `findByUserIdOrderByCreatedAtDesc` | OK |
| refresh_tokens | UNIQUE(token), `user_id`, `idx_refresh_tokens_user_revoked` (V32) | `findByTokenAndRevokedFalse`, `deleteByUserId` | OK |

---

### 5.7. Entity ↔ Schema Mapping Issues

#### `Booking.status` ENUM mismatch
- Entity: `BookingStatus` có 6 giá trị (PENDING, RESERVED, CONFIRMED, CANCELLED, EXPIRED, FAILED).
- DB (V1): `ENUM('pending','reserved','confirmed','cancelled','expired')` — 5 giá trị, không có `failed`.

Nếu code set status = FAILED → DB reject → `DataIntegrityViolationException`.

**Recommendation**: V33 `ALTER TABLE bookings MODIFY COLUMN status ENUM('pending','reserved','confirmed','cancelled','expired','failed') NOT NULL DEFAULT 'pending';`

---

## 6. Phần D — INFRA & DEVOPS REVIEW

### 6.1. 🔴 CRITICAL

> Không có Critical Infra mới.

### 6.2. 🟠 HIGH

#### INFRA-HIGH-01 — `docker-compose.yml` không set `SPRING_PROFILES_ACTIVE`

**File**: `docker-compose.yml:38-56`

```yaml
backend:
  environment:
    - SPRING_DATASOURCE_URL=...
    - JWT_SECRET=...
    # ← không có SPRING_PROFILES_ACTIVE
```

Mặc định chạy profile `default` (application.yml). Không có `application-prod.yml` → config production trộn lẫn dev. `spring.jpa.show-sql: false` (OK default) nhưng không có tuning prod (HikariCP pool, log level, swagger disable...).

**Recommendation**: 
```yaml
- SPRING_PROFILES_ACTIVE=prod
```
+ Tạo `application-prod.yml`.

---

#### INFRA-HIGH-02 — `frontend/Dockerfile` không nhận `VITE_API_URL`

**File**: `frontend/Dockerfile:7`

```dockerfile
RUN npm run build
```

Vite build cần `VITE_API_URL` để biết BE URL. Build không set → default `http://localhost:8080/api` (trong `client.ts:4`). Production sẽ fail.

**Recommendation**:
```dockerfile
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build
```
+ docker-compose truyền `args: VITE_API_URL=https://api.example.com/api`.

---

### 6.3. 🟡 MEDIUM

#### INFRA-MED-01 — Không có healthcheck cho backend container
```yaml
backend:
  # ← không có healthcheck
```
`frontend` depends_on `backend: condition: service_started` → có thể frontend start trước khi BE ready → 502.

**Recommendation**:
```yaml
backend:
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
    interval: 10s
    timeout: 5s
    retries: 10
```
+ Add Spring Boot Actuator dependency.

#### INFRA-MED-02 — `nginx` config không gzip cho SVG/WebP/font
Chỉ gzip text/css/js/json/xml. Production nên thêm `image/svg+xml`, `application/wasm`, font.

---

### 6.4. 🟢 LOW

#### INFRA-LOW-01 — MySQL image `mysql:8.0` không pin patch version → có thể breaking change khi pull lại.

---

## 7. Phần E — CONTRACT MISMATCH BE ↔ FE

> Tổng hợp các điểm BE và FE không đồng bộ **sau đợt fix**.

### 7.1. Auth Contract

| Field | BE | FE | Status sau fix |
|---|---|---|---|
| `UserDTO.role` | `String` | `AuthUser.role?` + `roles?: ('USER'\|'ADMIN')[]` | ⚠️ FE hỗ trợ cả 2, OK |
| `AuthResponse.token` | `token: String` | `LoginResponse.accessToken: string` (FE fallback `res.accessToken \|\| res.token`) | ⚠️ Workaround, type sai |
| `AuthResponse.refreshToken` | `refreshToken: String` | (FE không còn persist do CRIT-01 fix) | ❌ Interceptor FE vẫn check `refreshToken` trong store |
| `/auth/refresh` cookie | ✓ BE set cả `jwt` + `refresh_token` cookie | FE interceptor gửi body `{ refreshToken }` thay vì dựa cookie | ⚠️ Có thể hoạt động nếu BE fallback body, nhưng không dùng được cookie path `/api/auth/refresh` scoped |
| `/auth/me` response | `UserDTO` (role: String) | `AuthUser` (role? + roles?) | ⚠️ OK |

### 7.2. Booking Contract

| Field | BE `BookingDTO` | FE `FlightBooking` | Status |
|---|---|---|---|
| `id` | `Long` | `string` | ⚠️ Type mismatch |
| `bookingCode` | (none — FE tự map `'BK' + id`) | `string` | ⚠️ Adapter |
| `status` | `String` (PENDING/RESERVED/CONFIRMED/...) | `BookingStatus \| string` (HOLD/PENDING_PAYMENT/CONFIRMED/...) | ⚠️ FE đã cho phép string, nhưng mock value khác BE |
| `totalPrice` | `BigDecimal` | `totalAmount?: number` (FE map `totalAmount: data.totalPrice`) | ⚠️ Adapter |
| `reservedUntil` | `LocalDateTime` | `expiresAt?: string` (FE map `expiresAt: data.reservedUntil`) | ⚠️ Adapter |
| `outboundFlight` | (none) | `Flight?` | ❌ BE không trả, FE không map → undefined |
| `returnFlight` | (none) | `Flight?` | ❌ Same |
| `passengers[].fullName` | `String` | `Passenger.fullName` (nhưng Passenger có cả `firstName/lastName` không có) | ⚠️ Type FE Passenger không khớp |
| `passengers[].type` | (none) | `Passenger.type: 'adult'\|'child'\|'infant'` | ❌ BE không trả |
| `contactEmail` | (none — chỉ có `passengers[].email`) | `string` | ❌ Missing BE |

### 7.3. Flight Search Contract

| Endpoint | BE | FE | Status |
|---|---|---|---|
| URL | `GET /api/flights` hoặc `/api/flights/search` | `GET /api/flights` | ✓ OK |
| Params | `departureAirport, arrivalAirport, departureTime, page, size, sort` | `{ from, to, departDate, returnDate, tripType, adults, children, infants, cabin, promoCode }` | ❌ Param name hoàn toàn khác |
| Response | `Page<FlightDTO>` ({ content: FlightDTO[], totalElements, ... }) | `FlightSearchResponse` ({ outbound: Flight[], return?: Flight[], request }) | ❌ Shape hoàn toàn khác |

### 7.4. Flight Entity Contract

| BE `FlightDTO` | FE `Flight` | Match? |
|---|---|---|
| `id: Long` | `id: string` | ❌ Type |
| `airlineCode + flightNumber` | `flightNo: string` | ❌ Different shape |
| `departureAirport: String` | `from?: string` | ❌ Name |
| `arrivalAirport: String` | `to?: string` | ❌ Name |
| `departureTime: LocalDateTime` | `departTime: string` (HH:mm) | ❌ Type + format |
| `arrivalTime: LocalDateTime` | `arriveTime: string` (HH:mm) | ❌ Type + format |
| (none) | `airline: string` | ❌ Missing BE |
| (none) | `duration: string` | ❌ Missing BE |
| (none) | `stops: number` | ❌ Missing BE |
| (none) | `aircraft: string` | ❌ Missing BE |
| `seatClass: String` | `cabin: string` | ❌ Name |
| `price: BigDecimal` | `priceVND: number` | ❌ Name + type |
| `availableSeats: Integer` | `seatsLeft: number` | ❌ Name |
| (none) | `nextDay?: boolean` | ❌ Missing BE |

### 7.5. Admin Contract

| Endpoint | BE | FE | Status |
|---|---|---|---|
| `GET /admin/stats` | `{ totalBookings: Long, totalRevenue: Long }` | `Kpi` ({ totalRevenue, totalBookings, totalFlights, loadFactor, trends }) | ❌ BE chỉ trả 2 field, FE fallback mock cho 4 field còn lại |
| `GET /admin/flights` | (none) | `AdminFlight[]` | ❌ 404 |
| `GET /admin/bookings` | (none) | `AdminBooking[]` | ❌ 404 |
| `GET /admin/users` | (none) | `AdminUser[]` | ❌ 404 |
| `GET /admin/news` | (none) | `AdminNews[]` | ❌ 404 |
| `PUT /admin/users/{id}/roles` | (none) | `string[]` | ❌ 404 |
| CRUD news | (none) | POST/DELETE | ❌ 404 |

---

## 8. Phần F — ROADMAP FIX ĐỀ XUẤT

> Phân loại thành 3 sprint. Mỗi sprint ước lượng effort theo story point (1 SP = 0.5 ngày dev).

### 8.1. Sprint 1 — Critical + High BE (1 tuần, ~15 SP)

**Mục tiêu**: Hoàn thiện BE contract + admin module + hardening.

| ID | Task | Effort | Priority |
|---|---|---|---|
| FE-CRIT-01 | Fix refresh interceptor — bỏ check `refreshToken` trong store, dựa vào cookie | 1 SP | P0 |
| FE-CRIT-02 | BE thêm polymorphism cho BookingDTO (FlightBookingDTO với outboundFlight, etc.) | 5 SP | P0 |
| FE-HIGH-01 | BE add endpoint `PUT /api/bookings/{id}/passengers` | 1 SP | P0 |
| FE-HIGH-02 | Đồng bộ flight search params BE ↔ FE | 2 SP | P0 |
| FE-HIGH-03 | Map FlightDTO ↔ Flight ở client layer (hoặc sinh types từ OpenAPI) | 3 SP | P0 |
| FE-HIGH-04 | BE implement admin endpoints (flights/bookings/users/news CRUD) | 8 SP | P0 |
| BE-HIGH-01 | Config `TaskScheduler` + `TaskExecutor` bean | 1 SP | P1 |
| BE-HIGH-02 | VnpayIpnFilter check HTTP method | 0.5 SP | P1 |
| BE-HIGH-03 | `BookingRequest.passengers` add `@Valid` + `@Size(max=9)` | 0.5 SP | P1 |
| BE-HIGH-04 | `HtmlSanitizer.sanitizeRich` cho Blog.content + Tour.overview | 1 SP | P1 |
| BE-HIGH-05 | Bump jjwt 0.11.5 → 0.12.6 + migrate API | 2 SP | P1 |
| BE-HIGH-06 | `ReservationScheduler` REQUIRES_NEW transaction per booking | 2 SP | P1 |
| BE-HIGH-09 | Implement admin endpoints (trùng FE-HIGH-04) | — | P0 |
| DB-CRIT-01 | Quyết định airports: re-create + add FK hoặc accept text | 1 SP | P0 |
| DB-CRIT-02 | Quyết định polymorphic: 3 table riêng hoặc accept + document | 2 SP | P0 |
| **Subtotal** | | **29 SP** | |

### 8.2. Sprint 2 — High FE + DB + Infra (1-2 tuần, ~20 SP)

**Mục tiêu**: Sync contract FE/BE hoàn toàn; production-ready hardening.

| ID | Task | Effort | Priority |
|---|---|---|---|
| FE-HIGH-05 | BookingHistoryPage refactor sang useQuery | 1 SP | P1 |
| FE-HIGH-06 | VitePWA devOptions.enabled = false | 0.5 SP | P1 |
| FE-HIGH-07 | BookingDetailPage + ManageBookingPage sync type BookingDTO | 2 SP | P1 |
| FE-HIGH-08 | ConfirmationPage sync passenger type + contactEmail | 1 SP | P1 |
| FE-HIGH-09 | Sinh types từ OpenAPI, bỏ `as any` | 3 SP | P1 |
| BE-HIGH-07 | `BookingStrategyFactory.getStrategy` trim + lowercase | 0.5 SP | P1 |
| BE-HIGH-08 | `searchByCodeAndLastName` validate "BK" prefix | 0.5 SP | P1 |
| DB-HIGH-01 | `users.email` VARCHAR(254); `chk_password_length = 60` | 0.5 SP | P1 |
| DB-HIGH-02 | `bookings.user_id` ON DELETE RESTRICT hoặc soft-delete user | 1 SP | P1 |
| DB-HIGH-03 | Sync `tours.rating`/`review_count` từ reviews (trigger hoặc service) | 2 SP | P1 |
| DB-LOW-03 | V33: `ALTER TABLE bookings MODIFY status ENUM(...'failed'...)` | 0.5 SP | P1 |
| V32 fix | `ADD COLUMN IF NOT EXISTS` cho `updated_at` (tránh duplicate column error) | 0.5 SP | P1 |
| V32 fix | `chk_password_length = 60` thay vì `> 0` | 0.5 SP | P1 |
| V32 fix | `uk_booking_pax` dùng `COALESCE(document_number, '')` hoặc NOT NULL | 0.5 SP | P1 |
| INFRA-HIGH-01 | docker-compose set `SPRING_PROFILES_ACTIVE=prod` + tạo `application-prod.yml` | 1 SP | P1 |
| INFRA-HIGH-02 | Frontend Dockerfile ARG VITE_API_URL | 0.5 SP | P1 |
| INFRA-MED-01 | Backend healthcheck + Actuator | 1 SP | P1 |
| Add index | `flights(departure_airport, arrival_airport, departure_time)` | 0.5 SP | P1 |
| Add index | `booking_passengers(booking_id, full_name)` | 0.5 SP | P1 |
| Add index | `reviews(item_type, item_id)` | 0.5 SP | P1 |
| **Subtotal** | | **17.5 SP** | |

### 8.3. Sprint 3 — Medium + Low (1-2 tuần, ~15 SP)

**Mục tiêu**: Polish + DX + cleanup.

| ID | Task | Effort | Priority |
|---|---|---|---|
| FE-MED-01 | Sync `LoginResponse` type với `AuthResponse` BE | 0.5 SP | P2 |
| FE-MED-02 | RegisterPage auto-login sau register | 0.5 SP | P2 |
| FE-MED-03 | ProfilePage `user.id` type safe | 0.5 SP | P2 |
| FE-MED-04 | DashboardPage wire stats to API | 1 SP | P2 |
| FE-MED-05 | SeatSelectionPage read requiredSeats from booking | 1 SP | P2 |
| FE-MED-06 | Import Material Symbols font | 0.5 SP | P2 |
| FE-MED-07 | SeatHoldPage read contact from user authenticated | 0.5 SP | P2 |
| FE-MED-09 | Self-host images | 2 SP | P2 |
| BE-MED-01 | Remove `@Builder` from JPA entities (or accept) | 2 SP | P2 |
| BE-MED-02 | Xóa `expireReservations` dead code | 0.5 SP | P2 |
| BE-MED-10 | Review `Booking.transitionTo` business logic (EXPIRED → CONFIRMED) | 0.5 SP | P2 |
| BE-LOW-01 | Merge `utils/` and `util/` | 0.5 SP | P2 |
| FE-LOW-05 | i18n English strings in DashboardPage | 1 SP | P2 |
| V33 migration | Sync bookings.status ENUM với entity | 0.5 SP | P2 |
| **Subtotal** | | **11 SP** | |

---

### 8.4. Long-term Recommendations (Sprint 4+)

1. **Codegen types from OpenAPI** — `openapi-generator-cli` generate TS types + axios client; loại bỏ hoàn toàn issue contract mismatch.
2. **Integration test end-to-end** với Testcontainers (MySQL + Redis) — chạy flow auth → booking → payment.
3. **Observability**: Spring Boot Actuator + Micrometer + Prometheus; Grafana dashboard.
4. **Distributed tracing**: OpenTelemetry + Jaeger.
5. **CI/CD pipeline**: GitHub Actions → lint → test → build → deploy staging → smoke test → deploy prod.
6. **Secret management**: Vault hoặc AWS Secrets Manager.
7. **Multi-instance ready**: Caffeine → Redis cache; Bucket4j → Redis-backed.
8. **API versioning**: `/api/v1/...`.
9. **Soft delete**: cho users, bookings (thay vì hard delete).
10. **Audit log**: track thay đổi booking/payment.

---

## 9. Phụ lục: Ma trận Severity

### 9.1. Tổng quan (sau đợt fix)

```
┌────────────────────────────────────────────────────────────────┐
│           SEVERITY DISTRIBUTION (lần 2 — sau fix)              │
├────────────┬──────┬──────┬─────┬───────┬────────────────────────┤
│ Severity   │  BE  │  FE  │ DB  │ Infra │ Total                  │
├────────────┼──────┼──────┼─────┼───────┼────────────────────────┤
│ 🔴 Critical│   0  │   2  │  2  │   0   │    4                   │
│ 🟠 High    │   6  │   9  │  3  │   2   │   20                   │
│ 🟡 Medium  │  11  │   9  │  2  │   2   │   24                   │
│ 🟢 Low     │   4  │   6  │  3  │   1   │   14                   │
├────────────┼──────┼──────┼─────┼───────┼────────────────────────┤
│ TOTAL      │  21  │  26  │ 10  │   5   │   62                   │
└────────────┴──────┴──────┴─────┴───────┴────────────────────────┘
```

**So sánh với lần 1** (97 issue):
- Critical: 21 → 4 (giảm 81%)
- High: 34 → 20 (giảm 41%)
- Medium: 27 → 24 (giảm 11%)
- Low: 15 → 14 (giảm 7%)
- **Total: 97 → 62 (giảm 36%)**

### 9.2. CVSS-style Scoring Legend

| Score | Severity | Meaning |
|---|---|---|
| 9.0–10.0 | Critical | Production blocker / data loss / security breach |
| 7.0–8.9 | High | Major feature broken / security risk |
| 4.0–6.9 | Medium | Functional issue / minor security |
| 0.1–3.9 | Low | Code quality / minor UX |

### 9.3. Issue Index (sorted by severity)

#### Critical (4)
- FE-CRIT-01: Refresh interceptor vẫn check `refreshToken` trong store (luôn null sau fix)
- FE-CRIT-02: PaymentPage expect `outboundFlight`, `passengers.length` không tồn tại
- DB-CRIT-01: `V29` DROP airports, flights không có FK
- DB-CRIT-02: Polymorphic association wishlists/reviews/bookings không có FK

#### High (20)
- BE-HIGH-01: `@Async` scheduler không config `TaskScheduler` bean
- BE-HIGH-02: VnpayIpnFilter không check HTTP method
- BE-HIGH-03: `BookingRequest.passengers` không `@Valid` + `@Size`
- BE-HIGH-04: `HtmlSanitizer` dùng `Safelist.none()` cho Blog content
- BE-HIGH-05: jjwt 0.11.5 cũ
- BE-HIGH-06: `ReservationScheduler` transaction boundary không rõ
- BE-HIGH-07: `BookingStrategyFactory.getStrategy` không trim
- BE-HIGH-08: `searchByCodeAndLastName` fragile contract
- BE-HIGH-09: Admin module BE chưa implement
- FE-HIGH-01: `updatePassengers` endpoint không tồn tại
- FE-HIGH-02: Flight search params BE/FE không khớp
- FE-HIGH-03: Flight type FE vs FlightDTO BE mismatch
- FE-HIGH-04: Admin module FE dùng mock, BE chưa implement
- FE-HIGH-05: BookingHistoryPage không dùng TanStack Query
- FE-HIGH-06: VitePWA devOptions.enabled = true
- FE-HIGH-07: BookingDetailPage + ManageBookingPage type mismatch
- FE-HIGH-08: ConfirmationPage type mismatch
- FE-HIGH-09: Nhiều `as any` chưa dọn dẹp
- DB-HIGH-01: users.email VARCHAR(100) có thể thiếu
- DB-HIGH-02: bookings.user_id ON DELETE SET NULL tạo orphan
- DB-HIGH-03: tours.rating không sync với reviews
- INFRA-HIGH-01: docker-compose không set SPRING_PROFILES_ACTIVE
- INFRA-HIGH-02: Frontend Dockerfile không nhận VITE_API_URL

#### Medium (24) — xem Sections 3.3, 4.3, 5.3, 6.3
#### Low (14) — xem Sections 3.4, 4.4, 5.4, 6.4

---

## Kết luận

Đợt fix `22eabeb` đã xử lý đúng và triệt để **phần lớn Critical** (9/9 BE-CRIT, 5/7 FE-CRIT, 2/4 DB-CRIT). Đặc biệt:

- ✅ Scheduler release inventory — fix đúng, gọi `strategy.release()` trong loop
- ✅ VNPay verify order — fix đúng, signature-first
- ✅ IPN endpoint — implement chuẩn RspCode VNPay
- ✅ JWT localStorage — fix đúng, chỉ persist user
- ✅ V32 migration — add CHECK + UNIQUE + index toàn diện

Tuy nhiên vẫn còn **4 Critical + 20 High** phải fix trước production:

1. **Contract BE↔FE vẫn là vấn đề lớn nhất** — Flight search params, FlightDTO shape, BookingDTO polymorphism, Admin endpoints. App **vẫn không chạy được end-to-end** cho flow flight search → booking → payment.
2. **Refresh token flow FE broken** — interceptor vẫn check `refreshToken` trong store (luôn null sau fix CRIT-01).
3. **Admin module BE chưa implement** — 4 trang admin chỉ hiển thị mock.
4. **DB V32 có 3 issue tiềm ẩn** — `ADD COLUMN updated_at` duplicate, `chk_password_length` quá lỏng, `uk_booking_pax` NULL bypass.
5. **Infra chưa production-ready** — không profile prod, không healthcheck, Dockerfile không nhận env.

**Khuyến nghị cuối**: 
- **Phase 1 (1 tuần)**: Fix 4 Critical + 6 High BE → có thể demo end-to-end.
- **Phase 2 (1-2 tuần)**: Fix 9 High FE + 3 High DB + 2 High Infra → production-ready.
- **Phase 3 (1-2 tuần)**: Polish + cleanup Medium/Low.

Đặc biệt khuyến nghị **codegen types từ OpenAPI** càng sớm càng tốt — sẽ loại bỏ vĩnh viễn loại issue contract mismatch (chiếm ~40% issue còn lại).

---

> **Báo cáo kết thúc.**
> Review-only — KHÔNG fix. Tổng cộng **62 issue** còn lại (sau đợt fix 97 → 62), liệt kê với severity, file:line, code snippet, root cause, CVSS-style score, recommendation.
