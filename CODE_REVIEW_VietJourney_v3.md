# BÁO CÁO REVIEW TOÀN DIỆN CODE (LẦN 3) — VietJourney Advance Solution

> **Repository**: `https://github.com/tvthien-ktmt/Viet-Journey-Advandce-Solution`
> **Commit reviewed**: `ed9f7c1` — *"fix(all): resolve V2 verification issues"*
> **Ngày review**: 2026-07-07 (đợt 3)
> **Phạm vi**: Toàn bộ source code (FE + BE + DB + Infra) sau 2 đợt fix
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

Sau 2 đợt review (97 → 62 issue), team đã commit `ed9f7c1 fix(all): resolve V2 verification issues`. Bản review này đối chiếu **thực tế fix so với claim**, đồng thời rà soát lại toàn bộ source mới.

### 1.2. Đánh giá đợt fix

| Hạng mục fix | Trạng thái | Đánh giá |
|---|---|---|
| **FE-CRIT-01** Refresh interceptor check refreshToken | ✅ Fixed đúng | Interceptor giờ dựa vào cookie HttpOnly, bỏ check `refreshToken` trong store |
| **FE-CRIT-02** PaymentPage expect outboundFlight | ✅ Fixed đúng | Dùng `booking.itemSnapshot` (JSON) parse → hiển thị `snapshot.from/to/departTime` |
| **FE-HIGH-01** updatePassengers endpoint | ❌ **NOT fixed** | Vẫn `api.post('/bookings/${id}/passengers')` — BE vẫn không có endpoint này |
| **FE-HIGH-02** Flight search params | ✅ Fixed đúng | FE map `from→departureAirport, to→arrivalAirport, departDate→departureTime`, response map FlightDTO→Flight |
| **FE-HIGH-03** Flight type mismatch | ✅ Fixed đúng | Map FlightDTO→Flight ở client (flightNumber→flightNo, price→priceVND, availableSeats→seatsLeft) |
| **FE-HIGH-04** Admin module BE | ✅ Partial — BE implement `GET /admin/flights/bookings/users/news` + `PUT /users/{id}/roles` (read-only, không có CRUD create/update/delete thực) | Đủ cho list, chưa đủ cho edit |
| **FE-HIGH-05** BookingHistoryPage useQuery | ✅ Fixed đúng | Refactor sang useQuery |
| **FE-HIGH-06** VitePWA devOptions | ✅ Fixed đúng | `enabled: false` |
| **FE-HIGH-07** BookingDetailPage type | ✅ Partial — Dùng `booking.itemSnapshot` parse JSON, nhưng BookingDetailPage vẫn có `booking?.outboundFlight?.flightNo` fallback mock |
| **FE-HIGH-08** ConfirmationPage type | ✅ Fixed đúng | Dùng `booking.contactEmail`, `booking.passengers[0].email`, `booking.itemSnapshot` |
| **FE-HIGH-09** as any | ⚠️ Partial — Vẫn còn nhiều `as any` ở LoginPage, BookingHistoryPage, ManageBookingPage, SeatHoldPage |
| **BE-CRIT-01..09** Critical BE (đã fix đợt 1-2) | ✅ Maintain | Không regression |
| **BE-HIGH-01** TaskScheduler bean | ✅ Fixed đúng | `AppConfig` add `taskExecutor()` + `taskScheduler()` với pool size 5 |
| **BE-HIGH-02** VnpayIpnFilter method check | ✅ Fixed đúng | Check `GET` method, return 405 nếu khác |
| **BE-HIGH-03** BookingRequest @Valid @Size | ✅ Fixed đúng | `@Valid @Size(max=9)` + `@NotBlank contactEmail/contactPhone` |
| **BE-HIGH-04** HtmlSanitizer rich | ✅ Fixed đúng | Add `sanitizeRich(Safelist.relaxed())`; `BlogServiceImpl` apply cho content |
| **BE-HIGH-05** jjwt bump | ✅ Fixed đúng | Bump 0.11.5 → 0.12.6 |
| **BE-HIGH-06** ReservationScheduler transaction | ✅ Fixed đúng | Tách `ReservationReleaseService.releaseExpiredBooking` với `@Transactional(REQUIRES_NEW)` — mỗi booking là 1 transaction riêng |
| **BE-HIGH-07** BookingStrategyFactory trim | ✅ Fixed đúng | `.trim().toLowerCase()` |
| **BE-HIGH-08** searchByCodeAndLastName BK prefix | ✅ Fixed đúng | Validate `startsWith("BK")` + `matches("\\d+")` |
| **BE-HIGH-09** Admin endpoints | ✅ Partial — Read-only GET endpoints đã có; CRUD create/update/delete chưa có |
| **DB-CRIT-01** airports FK | ❌ **NOT fixed** | Vẫn DROP airports, flights không có FK |
| **DB-CRIT-02** Polymorphic FK | ⚠️ Partial — Thêm `bookings.item_snapshot JSON` để capture state tại thời điểm booking; polymorphic wishlists/reviews vẫn không FK |
| **DB-HIGH-01** users.email length | ❌ **NOT fixed** | Vẫn VARCHAR(100) |
| **DB-HIGH-02** bookings.user_id ON DELETE | ❌ **NOT fixed** | Vẫn `ON DELETE SET NULL` |
| **DB-HIGH-03** tours.rating sync | ✅ Fixed đúng | `ReviewServiceImpl.createReview` recompute avg + reviewCount trong cùng transaction |
| **DB-LOW-03** bookings.status ENUM failed | ✅ Fixed đúng | V34 `MODIFY COLUMN status ENUM(...'failed'...)` |
| **DB missing indexes** | ✅ Fixed đúng | V34 add `idx_flights_search`, `idx_reviews_item`, `idx_booking_passengers_search` |
| **V32 issues** updated_at duplicate, chk_password_length, uk_booking_pax NULL | ❌ **NOT fixed** | V32 vẫn nguyên, không có V35 fix |
| **INFRA-CRIT-01** SPRING_PROFILES_ACTIVE | ✅ Fixed đúng | docker-compose set `SPRING_PROFILES_ACTIVE=prod` |
| **INFRA-HIGH-01** VITE_API_URL Dockerfile | ✅ Fixed đúng | `ARG VITE_API_URL` + `ENV VITE_API_URL=$VITE_API_URL` |
| **INFRA-HIGH-02** Backend healthcheck | ✅ Fixed đúng | `curl /actuator/health` (nhưng chưa add Actuator dependency) |
| **INFRA-HIGH-03** Frontend healthcheck | ✅ Fixed | `curl http://localhost:8080` |

### 1.3. Tổng số issue còn lại sau đợt fix 3

| Severity | BE | FE | DB | Infra | Total |
|---|---|---|---|---|---|
| 🔴 Critical | 0 | 0 | 1 | 0 | **1** |
| 🟠 High | 4 | 5 | 3 | 1 | **13** |
| 🟡 Medium | 9 | 8 | 2 | 2 | **21** |
| 🟢 Low | 4 | 5 | 2 | 1 | **12** |
| **TOTAL** | **17** | **18** | **8** | **4** | **47** |

> **So với lần 2 (62 issue)**: giảm 15 issue (~24%).
> - Critical: 4 → 1 (giảm 75%)
> - High: 20 → 13 (giảm 35%)
> - Medium: 24 → 21 (giảm 12%)
> - Low: 14 → 12 (giảm 14%)
>
> **So với lần 1 (97 issue)**: giảm 50 issue (~52%).

### 1.4. Điểm yếu then chốt còn lại

1. **`updatePassengers` endpoint FE gọi không tồn tại ở BE** — flow SeatHold → Payment vẫn vỡ nếu user đi qua path đó.
2. **Admin module BE chỉ read-only** — không có create/update/delete cho flights/bookings/users/news. FE `AdminFlightsPage` có nút "Thêm chuyến" nhưng BE không hỗ trợ.
3. **DB-CRIT-01 vẫn còn** — V29 DROP airports, flights không có FK → referential integrity vỡ.
4. **V32 migration issues chưa fix** — `ADD COLUMN updated_at` có thể duplicate, `chk_password_length` quá lỏng, `uk_booking_pax` NULL bypass.
5. **CSRF vẫn disabled** + `SameSite=Lax` (accept, nhưng chưa hardening tối ưu).
6. **Nhiều `as any` FE chưa dọn dẹp** — type safety kém.
7. **`BookingRequest.passengers[].idNumber`** không `@NotBlank` — passenger có thể không có CCCD/passport.
8. **`BookingDTO.maskPII`** hiện tại rỗng cho passenger (chỉ có comment `// mask documentNumber if needed`).
9. **Hardcoded Unsplash URLs** vẫn còn nhiều nơi.
10. **`ManageBookingPage` vẫn expect `b.flight.route.origin.city`** không tồn tại trong BookingDTO.

### 1.5. Khuyến nghị SLA

| Khuyến nghị | Lý do |
|---|---|
| **Có thể deploy staging ngay** | Critical gần hết, flow cơ bản chạy được |
| **Phase 1 (3-5 ngày)**: Fix 1 Critical + 4 High BE + 5 High FE | Production-ready cơ bản |
| **Phase 2 (1 tuần)**: Fix 3 High DB + 1 High Infra + 21 Medium | Production-ready hardening |
| **Phase 3 (1 tuần)**: 12 Low | Polish + DX |

---

## 2. Thông tin tổng quan dự án

### 2.1. Backend Stack

| Thành phần | Phiên bản | Thay đổi |
|---|---|---|
| Spring Boot | 3.2.4 | Không đổi |
| Java | 17 | Không đổi |
| jjwt | **0.12.6** | ✅ Bumped từ 0.11.5 |
| Bucket4j | 8.10.1 | Không đổi |
| Caffeine | 3.x | Không đổi |
| jsoup | 1.17.2 | Không đổi |

### 2.2. Frontend Stack

React 19.2.7 / Vite 8.1.1 / TypeScript 6.0.2 / TanStack Query 5.101.2 / Zustand 5.0.14 / Tailwind 3.4.19 / React Router 7.18.1 / shadcn/ui 4.12.0 / axios 1.18.1 — không đổi.

### 2.3. Thống kê file đã rà soát (lần 3)

| Loại | Số file | Thay đổi |
|---|---|---|
| Backend Java (main) | 121 (+1: `ReservationReleaseService.java`) | +1 file mới |
| Backend SQL migration | 17 (+2: V33, V34) | +2 migration mới |
| Frontend TS/TSX | 131 | Không đổi |
| Infra | docker-compose, 2 Dockerfile, application.yml | Không đổi |
| Test | 8 test file | Không đổi |

---

## 3. Phần A — FRONTEND REVIEW

### 3.1. 🔴 CRITICAL

> Không còn Critical FE nào. Tất cả 7 Critical từ đợt 1 + 2 Critical còn lại từ đợt 2 đều đã fix.

### 3.2. 🟠 HIGH

#### FE-HIGH-01 — `updatePassengers` endpoint FE gọi không tồn tại ở BE (vẫn chưa fix)

**File**: `frontend/src/api/booking.ts:36-37`

```ts
updatePassengers: (id: string, pax: Passenger[]): Promise<FlightBooking> =>
  api.post(`/bookings/${id}/passengers`, pax),
```

BE `BookingController` chỉ có: POST `/api/bookings`, GET `/api/bookings/{id}`, GET `/api/bookings/my-bookings`, GET `/api/bookings/search`. **Không có** `POST /api/bookings/{id}/passengers`.

**Impact**: SeatHoldPage → updatePassengers → 404 → flow vỡ.

**Recommendation**: 
- (A) BE add endpoint `PUT /api/bookings/{id}/passengers`.
- (B) Hoặc FE bỏ hẳn `updatePassengers` — passengers đã được tạo cùng `createBooking` (vì `BookingRequest.passengers` đã support).

---

#### FE-HIGH-02 — `ManageBookingPage` vẫn expect `b.flight.route.origin.city` không tồn tại trong BookingDTO

**File**: `frontend/src/pages/ManageBookingPage.tsx:53,55-58,61`

```ts
const b = res.content || res.data || res;
setBooking({
  id: b.id ? `${b.id}` : b.bookingCode || code,
  bookingCode: b.bookingCode || code,
  route: b.flight?.route ? `${b.flight.route.origin.city} - ${b.flight.route.destination.city}` : 'HAN - SGN',
  flightNo: b.flight?.flightNumber || 'VN201',
  ...
  passengers: b.passengers?.map((p: any) => p.fullName || `${p.firstName || ''} ${p.lastName || ''}`.trim()) || [],
});
```

BE `BookingDTO` không có `flight.route.origin.city` — chỉ có `bookingType`, `referenceId`, `itemSnapshot` (JSON string).

**Impact**: ManageBookingPage hiển thị fallback `'HAN - SGN'`, `'VN201'` cho mọi booking — không reflect data thật.

**Recommendation**: Parse `b.itemSnapshot` để lấy `from/to/flightNo` (đã làm ở PaymentPage, BookingHistoryPage — chưa làm ở ManageBookingPage).

---

#### FE-HIGH-03 — Nhiều `as any` chưa dọn dẹp

**Files**:
- `LoginPage.tsx:31`: `as unknown as { user: any, token: string, ... }`
- `BookingHistoryPage.tsx:13`: `const res: any = await bookingApi.getMyBookings();`
- `ManageBookingPage.tsx:47`: `const res: any = await bookingApi.search(...)`
- `SeatHoldPage.tsx:49-50`: `(req as any)`, `(data as { id: string | number })`
- `PaymentPage.tsx:24`: `onSuccess: (data: any) => {...}`
- `PaymentCallbackPage.tsx:15`: `const response: any = await api.get(...)`
- `booking.ts:24,32`: `const data: any = await api.post/get(...)`
- `RegisterPage.tsx:39`: `const loginRes: any = await authApi.login(...)`
- `flights.ts:10,18`: `api.get<any>`, `(f: any) => ({...})`
- `DashboardPage.tsx:23,163`: `(bookingsData as any)?.content`, `(sum: number, b: any)`

**Recommendation**: Sinh types từ OpenAPI; bỏ `as any`; bật oxlint rule `no-explicit-any: error`.

---

#### FE-HIGH-04 — `LoginResponse` type sai (`accessToken` thay vì `token`)

**File**: `frontend/src/api/auth.ts:4-7`

```ts
interface LoginResponse { 
  accessToken: string; 
  user: AuthUser; 
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }),
```

BE `AuthResponse`:
```java
private String token;
private String refreshToken;
private UserDTO user;
```

FE khai `accessToken` nhưng BE trả `token`. Code dùng `res.accessToken || res.token` để cover, nhưng type sai → TypeScript không check được.

**Recommendation**: Đổi `LoginResponse { token: string; refreshToken: string; user: AuthUser }`.

---

#### FE-HIGH-05 — `AdminDashboardPage` vẫn fallback mock cho 4 chart

**File**: `frontend/src/pages/admin/AdminDashboardPage.tsx:26-29`

```ts
const revenue = ADMIN_STATS.revenueByMonth;
const routeStats = ADMIN_STATS.bookingsByRoute;
const cabinStats = ADMIN_STATS.cabinDistribution;
const loadFactor = ADMIN_STATS.loadFactorByMonth;
```

BE `AdminServiceImpl.getAdminStats()` chỉ trả `totalBookings` + `totalRevenue`. 4 chart (revenue by month, bookings by route, cabin distribution, load factor) **vẫn dùng mock cố định**.

**Impact**: Admin dashboard hiển thị data giả cho 4 chart — không reflect production data.

**Recommendation**: BE implement thêm 4 endpoint (hoặc gộp vào `/admin/stats` trả thêm fields: `revenueByMonth`, `bookingsByRoute`, `cabinDistribution`, `loadFactorByMonth`).

---

### 3.3. 🟡 MEDIUM

#### FE-MED-01 — `BookingDetailPage` vẫn còn fallback mock
File `BookingDetailPage.tsx:70,73,80,85` — vẫn có `booking?.outboundFlight?.flightNo || 'VN-123'`, ternary vô nghĩa `'Oct 15, 2024' : 'Oct 15, 2024'`. Đã parse `snapshot` nhưng chưa replace hoàn toàn mock fallback.

#### FE-MED-02 — `ProfilePage:88` `user.id.padStart(8, '0')` type unsafe
`AuthUser.id: string` nhưng BE trả `Long`. Khi persist localStorage rồi đọc lại có thể là number → `.padStart` không tồn tại.

#### FE-MED-03 — `DashboardPage:67,79,91` hardcoded "4,500" / "8" / "15%"
Mock stats không thay thế bằng data thật.

#### FE-MED-04 — `SeatSelectionPage:47` vẫn `requiredSeats = 2` hardcoded
Không đọc từ booking thực.

#### FE-MED-05 — `BookingDetailPage` dùng class `material-symbols-outlined` không import font
Icons sẽ không hiển thị.

#### FE-MED-06 — Hardcoded Unsplash URLs ở nhiều page
`TourDetailPage`, `HotelsPage`, `ToursPage`, `LoginPage`, `RegisterPage` — phụ thuộc external.

#### FE-MED-07 — `BookingDTO.maskPII` BE đã có nhưng FE không tận dụng
BE trả booking đã `maskPII()` cho `/bookings/search` (public endpoint), nhưng FE không xử lý specifically cho masked data.

#### FE-MED-08 — `Flight` type comment `// id is number in BE, we will use string | number for safety`
`types/flight.ts:61` — comment表明 type lỏng lẻo, không sync với BE.

---

### 3.4. 🟢 LOW

#### FE-LOW-01 — `App.tsx:62` `RouteBoundary` dùng `key={location.pathname}` reset ErrorBoundary — mất state local mỗi navigate
#### FE-LOW-02 — `components/ui/index.ts` export barrel không nhất quán
#### FE-LOW-03 — `SeatHoldPage.tsx:9` import `../store/langStore` thay vì `@/store/langStore`
#### FE-LOW-04 — `DashboardPage.tsx:33` text English "Here is a summary of your travel activities" — thiếu i18n
#### FE-LOW-05 — `index.html` không có meta description / og tags

---

## 4. Phần B — BACKEND REVIEW

### 4.1. 🔴 CRITICAL

> Tất cả 9 Critical BE từ lần 1 đã fix và maintain. Không có Critical BE mới.

### 4.2. 🟠 HIGH

#### BE-HIGH-01 — Admin module BE chỉ read-only, không có CRUD

**File**: `backend/.../controller/AdminController.java`

BE đã add 4 endpoint GET (flights/bookings/users/news) + 1 PUT (users/{id}/roles). Nhưng:
- Không có POST/PUT/DELETE cho `/admin/flights` (FE có nút "Thêm chuyến", "Edit", "Delete")
- Không có POST/PUT/DELETE cho `/admin/bookings`
- Không có POST/DELETE cho `/admin/news` (FE có nút "Thêm bài viết", "Edit", "Trash")
- `PUT /admin/users/{id}/roles` chỉ accept "ADMIN" hoặc "USER" — không support multi-role thực sự

**Impact**: Admin UI có buttons CRUD nhưng BE không support → 404 hoặc no-op.

**Recommendation**: Implement CRUD endpoints cho admin module; hoặc FE disable các button CRUD nếu BE chưa support.

---

#### BE-HIGH-02 — `BookingDTO.maskPII` passenger mask rỗng

**File**: `backend/.../dto/response/BookingDTO.java:86-90`

```java
if (this.passengers != null) {
    for (BookingPassengerDTO p : this.passengers) {
        // mask documentNumber if needed
    }
}
```

Comment thừa nhận cần mask nhưng **không implement**. Passenger `documentNumber`, `email`, `phone` vẫn leak trên `/api/bookings/search` (public endpoint).

So với đợt 2: BE đã bỏ `email`, `phone` field trong `BookingPassengerDTO` (chỉ còn `id, fullName, documentNumber, type, birthDate, gender`). Nhưng `documentNumber` vẫn chưa mask.

**Impact**: Public endpoint `/api/bookings/search` leak document số CCCD/passport của passenger.

**CVSS**: 5.3 (Medium) — AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N

**Recommendation**: Mask `documentNumber` trong `maskPII()` (giữ 4 số cuối).

---

#### BE-HIGH-03 — `BookingRequest.passengers[].idNumber` không `@NotBlank`

**File**: `backend/.../dto/request/PassengerRequest.java:8-19`

```java
@Data
public class PassengerRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;
    @NotBlank(message = "Type is required")
    private String type; // adult, child, infant
    
    private String idNumber;  // ← không @NotBlank
    
    private String birthDate;
    
    private String gender;
}
```

`idNumber` (CCCD/passport) không required → user có thể tạo booking passenger không có ID. Đối với infant thì OK, nhưng adult/child nên required.

Ngoài ra: `type` chỉ `@NotBlank` không `@Pattern` → có thể gửi `type="anything"`. `birthDate` không validate format. `gender` không `@Pattern("^[MF]$")`.

**Recommendation**: 
```java
@NotBlank private String idNumber;
@Pattern(regexp = "^(adult|child|infant)$") private String type;
@Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$") private String birthDate;
@Pattern(regexp = "^[MF]$") private String gender;
```

---

#### BE-HIGH-04 — `Booking.transitionTo` cho phép EXPIRED → CONFIRMED (business logic lạ)

**File**: `backend/.../entity/Booking.java:73-75`

```java
if (this.status == BookingStatus.EXPIRED && nextStatus != BookingStatus.CONFIRMED) {
    throw new IllegalStateException("Cannot transition from EXPIRED to anything other than CONFIRMED");
}
```

Logic này cho phép booking hết hạn vẫn confirm được — strange business logic. Thường booking expired là terminal state.

**Impact**: Nếu payment callback đến sau khi booking expired → booking vẫn confirm được → ghế đã release (scheduler) giờ bị "double book" (ghế đã trả lại + booking confirm).

**CVSS**: 5.3 (Medium) — race condition + business logic flaw.

**Recommendation**: Remove EXPIRED → CONFIRMED transition. Nếu payment đến muộn, refund user thay vì confirm.

---

### 4.3. 🟡 MEDIUM

#### BE-MED-01 — `Lombok @Builder` trên JPA entity
Vẫn dùng `@Builder` cho tất cả entity. Conflict tiềm ẩn với JPA proxying.

#### BE-MED-02 — `ReservationScheduler` không có `@Async` nữa (đã bỏ)
Tốt — giờ scheduler chạy synchronous trên `taskScheduler` bean. Nhưng nếu có nhiều booking expired → scheduler block pool. Nên cân nhắc `@Async` lại với `ThreadPoolTaskScheduler` pool size lớn.

#### BE-MED-03 — `SearchServiceImpl.searchAll` hardcode halfSize
Không có test; logic phân chia page không rõ ràng.

#### BE-MED-04 — `JwtUtil.validateJwtToken` log.warn thay vì throw
Log nhiều noise nếu bot scan.

#### BE-MED-05 — `PageableUtil.createPageable` đã validate sort field ✓
Đã fix đúng đợt 2.

#### BE-MED-06 — `PaymentServiceImpl.handleCallback` idempotency ✓
Đã fix đúng đợt 2.

#### BE-MED-07 — `UserServiceImpl.updateProfile` không validate phone format
`phone` chỉ `@NotBlank`, không `@Pattern` → user có thể set phone = "abc".

#### BE-MED-08 — `BookingStrategyFactory.getStrategy` trim ✓
Đã fix đúng đợt 3.

#### BE-MED-09 — `ReservationReleaseService.releaseExpiredBooking` không retry
Nếu `strategy.release()` fail (e.g. flight không tồn tại), booking đã `transitionTo(EXPIRED)` + save, nhưng release fail → ghế leak. Catch exception ở scheduler outer loop, nhưng không retry mechanism.

**Recommendation**: Add retry (e.g. 3 lần với backoff) hoặc dead-letter queue.

---

### 4.4. 🟢 LOW

#### BE-LOW-01 — `utils/` vs `util/` directory duplicate — `HtmlSanitizer` ở `utils/`, `PageableUtil` ở `util/`. Chưa thống nhất.
#### BE-LOW-02 — `pom.xml` có `<scm>`, `<license>`, `<developer>` rỗng.
#### BE-LOW-03 — `application-dev.yml` quá ít config (chỉ show-sql).
#### BE-LOW-04 — `ApiResponse.error` không set `success = false` tường minh.

---

## 5. Phần C — DATABASE REVIEW

> Phần này rà soát 17 migration files (V1, V2, V3, V20→V29, V31, V32, V33, V34 mới) + entity mapping + schema design + index + FK + constraint + normal form + security + migration safety.

### 5.1. 🔴 CRITICAL — DB

#### DB-CRIT-01 — `V29` DROP TABLE airports nhưng `flights.departure_airport` không có FK (vẫn chưa fix)

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

**Recommendation**: 
- (A) Re-create `airports` table + add FK `flights.departure_airport → airports.code`.
- (B) Accept text string + document rõ (current state).

---

### 5.2. 🟠 HIGH — DB

#### DB-HIGH-01 — `users.email` VARCHAR(100) có thể thiếu cho email dài

RFC 5321 cho phép email 254 ký tự. Hiện chỉ 100. Ngoài ra `password_hash` VARCHAR(255) có `CHECK(LENGTH(password_hash) > 0)` (V32) — quá lỏng, BCrypt hash luôn 60 ký tự.

**Recommendation**: 
- V35: `ALTER TABLE users MODIFY COLUMN email VARCHAR(254);`
- V35: `ALTER TABLE users DROP CONSTRAINT chk_password_length; ALTER TABLE users ADD CONSTRAINT chk_password_length CHECK (LENGTH(password_hash) = 60);`

---

#### DB-HIGH-02 — `bookings.user_id` ON DELETE SET NULL tạo orphan booking (vẫn chưa fix)

```sql
-- V1
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
```

Khi user delete → `booking.user_id = NULL` (booking vẫn còn). Nếu user vô tình delete account → booking vẫn tồn tại với `user_id = NULL` → admin không biết của ai. Nên `ON DELETE RESTRICT` để chặn delete user nếu còn booking, hoặc soft-delete user.

---

#### DB-HIGH-03 — V32 migration issues chưa fix

**File**: `V32__fix_constraints_and_schemas.sql`

3 vấn đề từ đợt 2 chưa được fix bằng V35:

1. **`ADD COLUMN updated_at` duplicate**:
   ```sql
   ALTER TABLE payments ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
   ALTER TABLE bookings ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
   ```
   `bookings` đã có `updated_at` từ V1 (line 131) → `ADD COLUMN` sẽ fail với "Duplicate column name". **Migration blocker trên fresh DB**.

2. **`chk_password_length` quá lỏng**:
   ```sql
   ALTER TABLE users ADD CONSTRAINT chk_password_length CHECK (LENGTH(password_hash) > 0);
   ```
   Nên `= 60` (BCrypt hash length).

3. **`uk_booking_pax` NULL bypass**:
   ```sql
   ALTER TABLE booking_passengers ADD CONSTRAINT uk_booking_pax UNIQUE (booking_id, full_name, document_number);
   ```
   `document_number` có thể NULL → MySQL UNIQUE cho phép multiple NULL → constraint vô hiệu cho passenger không có document. Cần `COALESCE(document_number, '')` hoặc NOT NULL.

---

### 5.3. 🟡 MEDIUM — DB

#### DB-MED-01 — `V23` tạo `wishlist` (số ít) table mới dù V1 đã có `wishlists` (số nhiều)
V28 drop `wishlist`. Sequence V1→V23→V28 confusing. Acceptable cho dev nhưng **không safe cho production**.

#### DB-MED-02 — `V21` INSERT sample flights với ngày `2025-01-01` — sẽ outdated
Sample data chỉ dùng được cho demo. Production cần refresh hoặc remove.

---

### 5.4. 🟢 LOW — DB

#### DB-LOW-01 — `users.role` VARCHAR(50) default 'USER' — nên dùng ENUM('USER','ADMIN') hoặc table riêng
#### DB-LOW-02 — `payments.status` VARCHAR thay vì ENUM (V32 đã add CHECK constraint, OK)
#### DB-LOW-03 — `bookings.status` ENUM ✓ — V34 đã fix đúng, thêm 'failed'

---

### 5.5. Migration Safety Review (V33 + V34 mới)

**V33__add_snapshot_and_type.sql** — review chi tiết:

```sql
ALTER TABLE booking_passengers ADD COLUMN passenger_type VARCHAR(20);
ALTER TABLE bookings ADD COLUMN item_snapshot JSON;
ALTER TABLE bookings ADD COLUMN contact_email VARCHAR(100);
ALTER TABLE bookings ADD COLUMN contact_phone VARCHAR(20);
ALTER TABLE booking_passengers ADD COLUMN birth_date VARCHAR(20);
ALTER TABLE booking_passengers ADD COLUMN gender VARCHAR(10);
```

⚠️ **Issue 1**: `ALTER TABLE ... ADD COLUMN` không có `IF NOT EXISTS` — sẽ fail nếu column đã tồn tại. **Migration blocker trên fresh DB** nếu rerun.

⚠️ **Issue 2**: `passenger_type`, `birth_date`, `gender` đều nullable — không có default value. Booking cũ (từ V1) sẽ có NULL cho các field này. Entity `BookingPassenger.type` (`@Column(name = "passenger_type")`) map đúng, nhưng data cũ sẽ NULL.

⚠️ **Issue 3**: `item_snapshot JSON` — MySQL 8.x OK, nhưng `columnDefinition = "json"` trong entity + `String itemSnapshot` — Hibernate không validate JSON format. Nếu application layer ghi JSON string không hợp lệ, DB sẽ accept (vì MySQL JSON column validate trên insert). Tuy nhiên nếu dùng MySQL 5.7 hoặc cũ hơn → fail.

✓ **OK**: `contact_email`, `contact_phone` — fields cần thiết cho FE, BE đã add.

---

**V34__fix_enum_and_indexes.sql** — review chi tiết:

```sql
-- DB-LOW-03
ALTER TABLE bookings MODIFY COLUMN status ENUM('pending','reserved','confirmed','cancelled','expired','failed') NOT NULL DEFAULT 'pending';
```
✓ OK — sync với `BookingStatus` entity (6 giá trị).

```sql
CREATE INDEX idx_flights_search ON flights(departure_airport, arrival_airport, departure_time);
```
✓ OK — composite index cho flight search pattern.

```sql
CREATE INDEX idx_reviews_item ON reviews(item_type, item_id);
```
✓ OK — index cho `findByItemTypeAndItemId`.

```sql
CREATE INDEX idx_booking_passengers_search ON booking_passengers(booking_id, full_name);
```
✓ OK — index cho `findByIdAndPassengerLastName`.

⚠️ **Issue**: V34 có BOM (`\ufeff`) ở đầu file — comment `-- V34: DB fixes from CODE_REVIEW_V2_VERIFICATION`. Một số Flyway version nhạy cảm với BOM → có thể fail. Nên strip BOM.

---

### 5.6. Index Audit (sau V34)

| Bảng | Index hiện tại | Query pattern chính | Status |
|---|---|---|---|
| users | UNIQUE(email) | `findByEmail` | OK |
| tours | UNIQUE(slug), FULLTEXT(name,location,overview), `idx_tours_featured` | `findBySlug`, search, featured | OK |
| hotels | UNIQUE(slug), FULLTEXT(name,location) | `findBySlug`, search | OK |
| flights | `flight_number`, `idx_flights_search` (V34) | search by airports + date | ✓ OK (fixed) |
| bookings | `(status, reserved_until)`, `user_id`, `version` | scheduler, user bookings | OK |
| booking_passengers | `uk_booking_pax` (V32), `idx_booking_passengers_search` (V34) | `findByIdAndPassengerLastName` | ✓ OK (fixed) |
| payments | `status` (V29), UNIQUE `transaction_ref` (V32), `version` | `findByTransactionRef` | OK |
| wishlists | UNIQUE(user_id, item_type, item_id) | check exists | OK |
| reviews | UNIQUE(user_id, item_type, item_id), `idx_reviews_item` (V34) | `findByItemTypeAndItemId` | ✓ OK (fixed) |
| blogs | UNIQUE(slug), FULLTEXT(title, excerpt), `idx_blogs_published_at` (V32) | `findAllByOrderByPublishedAtDesc` | OK |
| notifications | `idx_notifications_user_read` (V32) | `findByUserIdOrderByCreatedAtDesc` | OK |
| refresh_tokens | UNIQUE(token), `user_id`, `idx_refresh_tokens_user_revoked` (V32) | `findByTokenAndRevokedFalse`, `deleteByUserId` | OK |

**Kết luận**: Index audit đầy đủ, không còn missing index.

---

### 5.7. Entity ↔ Schema Mapping Issues

Sau V33 + V34:

#### `Booking.status` ENUM — ✓ Fixed
- Entity: `BookingStatus` có 6 giá trị (PENDING, RESERVED, CONFIRMED, CANCELLED, EXPIRED, FAILED).
- DB (V34): `ENUM('pending','reserved','confirmed','cancelled','expired','failed')` — 6 giá trị, sync.

#### `Booking.itemSnapshot` — ✓ Added (V33)
- Entity: `@Column(name = "item_snapshot", columnDefinition = "json") private String itemSnapshot;`
- DB (V33): `bookings.item_snapshot JSON`
- Map đúng.

#### `Booking.contactEmail` + `contactPhone` — ✓ Added (V33)
- Entity + DB sync.

#### `BookingPassenger.type` — ✓ Added (V33)
- Entity: `@Column(name = "passenger_type", length = 20) private String type;`
- DB (V33): `booking_passengers.passenger_type VARCHAR(20)`
- Map đúng.

#### `BookingPassenger.birthDate` + `gender` — ✓ Added (V33)
- Sync.

---

## 6. Phần D — INFRA & DEVOPS REVIEW

### 6.1. 🔴 CRITICAL

> Không có Critical Infra.

### 6.2. 🟠 HIGH

#### INFRA-HIGH-01 — Backend healthcheck reference Actuator nhưng chưa add dependency

**File**: `docker-compose.yml:60-64`

```yaml
backend:
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
    interval: 30s
    timeout: 10s
    retries: 3
```

`pom.xml` **không có** `spring-boot-starter-actuator` dependency → `/actuator/health` trả 404 → healthcheck fail → container unhealthy → frontend (depends_on `service_healthy`) không start.

**Impact**: `docker-compose up` fail — frontend không bao giờ start vì backend healthcheck fail.

**CVSS**: 7.5 (High) — AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H

**Recommendation**: 
- Add `spring-boot-starter-actuator` vào `pom.xml`.
- Hoặc đổi healthcheck sang `curl -f http://localhost:8080/api/tours` (public endpoint, trả 200).

---

### 6.3. 🟡 MEDIUM

#### INFRA-MED-01 — `nginx` config không gzip cho SVG/WebP/font
Chỉ gzip text/css/js/json/xml. Production nên thêm `image/svg+xml`, `application/wasm`, font.

#### INFRA-MED-02 — Không có `application-prod.yml`
docker-compose set `SPRING_PROFILES_ACTIVE=prod` nhưng BE không có `application-prod.yml` → Spring fallback `application.yml`. Config prod không khác biệt → không tuning (HikariCP pool, log level, swagger disable...).

**Recommendation**: Tạo `application-prod.yml` với:
```yaml
spring:
  jpa:
    show-sql: false
  data:
    redis:
      timeout: 5000
springdoc:
  swagger-ui:
    enabled: false
logging:
  level:
    com.vietjourney: INFO
    org.hibernate.SQL: WARN
```

---

### 6.4. 🟢 LOW

#### INFRA-LOW-01 — MySQL image `mysql:8.0` không pin patch version → có thể breaking change khi pull lại.

---

## 7. Phần E — CONTRACT MISMATCH BE ↔ FE

> Tổng hợp các điểm BE và FE không đồng bộ **sau đợt fix 3**.

### 7.1. Auth Contract

| Field | BE | FE | Status sau fix 3 |
|---|---|---|---|
| `UserDTO.role` | `String` | `AuthUser.role?` + `roles?` | ⚠️ FE hỗ trợ cả 2, OK |
| `AuthResponse.token` | `token: String` | `LoginResponse.accessToken: string` (FE fallback `res.token`) | ❌ Type sai, workaround |
| `AuthResponse.refreshToken` | `refreshToken: String` | (FE không persist, dùng cookie) | ✓ OK |
| `/auth/refresh` cookie | ✓ BE set cookie | FE gọi `axios.post(..., { withCredentials: true })` | ✓ OK |
| `/auth/me` response | `UserDTO` (role: String) | `AuthUser` (role? + roles?) | ⚠️ OK |

### 7.2. Booking Contract

| Field | BE `BookingDTO` | FE `FlightBooking` | Status |
|---|---|---|---|
| `id` | `Long` | `string` (FE cast) | ⚠️ Type |
| `bookingCode` | (none — FE tự map `'BK' + id`) | `string` | ⚠️ Adapter |
| `status` | `String` (PENDING/RESERVED/CONFIRMED/...) | `BookingStatus \| string` | ✓ OK (FE cho phép string) |
| `totalPrice` | `BigDecimal` | `totalPrice?: number` | ✓ OK |
| `reservedUntil` | `LocalDateTime` | `reservedUntil?: string` | ✓ OK |
| `itemSnapshot` | `String` (JSON) | `itemSnapshot?: string` (FE parse JSON) | ✓ OK (fixed) |
| `contactEmail` | `String` | `contactEmail?: string` | ✓ OK (fixed) |
| `contactPhone` | `String` | `contactPhone?: string` | ✓ OK (fixed) |
| `outboundFlight` | (none) | (FE dùng `itemSnapshot`) | ✓ OK (fixed) |
| `passengers[].fullName` | `String` | `BookingPassengerDTO.fullName` | ✓ OK |
| `passengers[].type` | `String` | `BookingPassengerDTO.type?` | ✓ OK (fixed V33) |
| `passengers[].birthDate` | `String` | `BookingPassengerDTO.birthDate?` | ✓ OK (fixed V33) |
| `passengers[].gender` | `String` | `BookingPassengerDTO.gender?` | ✓ OK (fixed V33) |

### 7.3. Flight Search Contract

| Endpoint | BE | FE | Status |
|---|---|---|---|
| URL | `GET /api/flights` hoặc `/api/flights/search` | `GET /api/flights` | ✓ OK |
| Params | `departureAirport, arrivalAirport, departureTime, page, size, sort` | FE map `{ from→departureAirport, to→arrivalAirport, departDate→departureTime }` | ✓ OK (fixed) |
| Response | `Page<FlightDTO>` ({ content: FlightDTO[], ... }) | FE map FlightDTO→Flight, return `{ outbound: Flight[] }` | ✓ OK (fixed) |

### 7.4. Flight Entity Contract

| BE `FlightDTO` | FE `Flight` (after map) | Status |
|---|---|---|
| `id: Long` | `id: string` (FE cast `.toString()`) | ✓ OK (fixed) |
| `airlineCode + flightNumber` | `flightNo: string` (FE map `flightNumber`) | ✓ OK (fixed) |
| `departureAirport: String` | `from?: string` (FE map) | ✓ OK (fixed) |
| `arrivalAirport: String` | `to?: string` (FE map) | ✓ OK (fixed) |
| `departureTime: LocalDateTime` | `departTime: string` (FE split T, substring 0-5) | ✓ OK (fixed) |
| `arrivalTime: LocalDateTime` | `arriveTime: string` (FE map) | ✓ OK (fixed) |
| (none) | `airline: string` (FE fallback `'VN'`) | ⚠️ Mock |
| (none) | `duration: string` (FE hardcoded `'2h 10m'`) | ⚠️ Mock |
| (none) | `stops: number` (FE hardcoded `0`) | ⚠️ Mock |
| (none) | `aircraft: string` (FE hardcoded `'A321'`) | ⚠️ Mock |
| `seatClass: String` | `cabin: string` (FE map) | ✓ OK |
| `price: BigDecimal` | `priceVND: number` (FE map) | ✓ OK |
| `availableSeats: Integer` | `seatsLeft: number` (FE map) | ✓ OK |
| (none) | `nextDay?: boolean` | ❌ Missing BE |

**Vấn đề còn lại**: `duration`, `stops`, `aircraft`, `nextDay` là mock FE — BE không trả. UX không reflect data thật.

### 7.5. Admin Contract

| Endpoint | BE | FE | Status |
|---|---|---|---|
| `GET /admin/stats` | `{ totalBookings, totalRevenue }` | `Kpi` (4 fields + trends) | ⚠️ BE thiếu 2 field + trends |
| `GET /admin/flights` | ✓ List flights (read-only) | `AdminFlight[]` | ✓ OK (fixed) |
| `GET /admin/bookings` | ✓ List bookings (read-only) | `AdminBooking[]` | ✓ OK (fixed) |
| `GET /admin/users` | ✓ List users (read-only) | `AdminUser[]` | ✓ OK (fixed) |
| `GET /admin/news` | ✓ List blogs as news (read-only) | `AdminNews[]` | ✓ OK (fixed) |
| `PUT /admin/users/{id}/roles` | ✓ Accept first role | `string[]` | ⚠️ Single role, not array |
| POST/PUT/DELETE `/admin/flights` | ❌ Not implemented | FE có button | ❌ 404 |
| POST/PUT/DELETE `/admin/bookings` | ❌ Not implemented | FE không có button | OK |
| POST/DELETE `/admin/news` | ❌ Not implemented | FE có button | ❌ 404 |

---

## 8. Phần F — ROADMAP FIX ĐỀ XUẤT

> Phân loại thành 3 sprint. Mỗi sprint ước lượng effort theo story point (1 SP = 0.5 ngày dev).

### 8.1. Sprint 1 — Critical + High (3-5 ngày, ~15 SP)

**Mục tiêu**: Hoàn thiện BE contract + admin module + hardening.

| ID | Task | Effort | Priority |
|---|---|---|---|
| DB-CRIT-01 | Quyết định airports: re-create + add FK hoặc accept text | 1 SP | P0 |
| FE-HIGH-01 | BE add `PUT /api/bookings/{id}/passengers` hoặc FE bỏ hàm | 1 SP | P0 |
| FE-HIGH-02 | ManageBookingPage parse `itemSnapshot` thay vì `b.flight.route` | 1 SP | P0 |
| FE-HIGH-03 | Sinh types từ OpenAPI, bỏ `as any` | 3 SP | P0 |
| FE-HIGH-04 | Sync `LoginResponse` type (`token` thay `accessToken`) | 0.5 SP | P0 |
| FE-HIGH-05 | BE implement 4 chart endpoints (revenue by month, bookings by route, cabin distribution, load factor) | 5 SP | P0 |
| BE-HIGH-01 | BE implement CRUD endpoints cho admin module | 5 SP | P0 |
| BE-HIGH-02 | `BookingDTO.maskPII` mask `documentNumber` | 0.5 SP | P0 |
| BE-HIGH-03 | `PassengerRequest` add `@NotBlank idNumber`, `@Pattern type/gender/birthDate` | 0.5 SP | P0 |
| BE-HIGH-04 | Remove `EXPIRED → CONFIRMED` transition | 0.5 SP | P0 |
| INFRA-HIGH-01 | Add `spring-boot-starter-actuator` dependency | 0.5 SP | P0 |
| **Subtotal** | | **18.5 SP** | |

### 8.2. Sprint 2 — DB + Infra (1 tuần, ~10 SP)

**Mục tiêu**: DB hardening + Infra production-ready.

| ID | Task | Effort | Priority |
|---|---|---|---|
| DB-HIGH-01 | V35: `users.email VARCHAR(254)`, `chk_password_length = 60` | 0.5 SP | P1 |
| DB-HIGH-02 | V35: `bookings.user_id ON DELETE RESTRICT` hoặc soft-delete user | 1 SP | P1 |
| DB-HIGH-03 | V35: Fix V32 issues — `ADD COLUMN IF NOT EXISTS`, `chk_password_length`, `uk_booking_pax COALESCE` | 1 SP | P1 |
| V33 fix | V35: `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` cho V33 columns | 0.5 SP | P1 |
| V34 fix | Strip BOM từ V34 file | 0.1 SP | P1 |
| INFRA-MED-02 | Tạo `application-prod.yml` | 1 SP | P1 |
| INFRA-MED-01 | nginx gzip cho SVG/font/wasm | 0.5 SP | P1 |
| FE-MED-01 | BookingDetailPage bỏ fallback mock, dùng snapshot hoàn toàn | 1 SP | P1 |
| FE-MED-03 | DashboardPage wire stats to API | 1 SP | P1 |
| FE-MED-04 | SeatSelectionPage read requiredSeats from booking | 1 SP | P1 |
| FE-MED-05 | Import Material Symbols font | 0.5 SP | P1 |
| BE-MED-07 | `UpdateProfileRequest` add `@Pattern phone` | 0.5 SP | P1 |
| BE-MED-09 | `ReservationReleaseService` retry mechanism | 1 SP | P1 |
| **Subtotal** | | **9.6 SP** | |

### 8.3. Sprint 3 — Medium + Low (1 tuần, ~12 SP)

**Mục tiêu**: Polish + DX + cleanup.

| ID | Task | Effort | Priority |
|---|---|---|---|
| FE-MED-02 | ProfilePage `user.id` type safe | 0.5 SP | P2 |
| FE-MED-06 | Self-host images | 2 SP | P2 |
| FE-MED-07 | FE xử lý masked PII display | 1 SP | P2 |
| FE-MED-08 | `Flight` type comment — clean up | 0.5 SP | P2 |
| BE-MED-01 | Remove `@Builder` from JPA entities (or accept) | 2 SP | P2 |
| BE-MED-03 | `SearchServiceImpl.searchAll` refactor halfSize logic | 1 SP | P2 |
| FE-LOW-01 | RouteBoundary không reset state local | 1 SP | P2 |
| FE-LOW-02 | `components/ui/index.ts` barrel export | 0.5 SP | P2 |
| FE-LOW-04 | i18n English strings in DashboardPage | 0.5 SP | P2 |
| BE-LOW-01 | Merge `utils/` and `util/` | 0.5 SP | P2 |
| BE-LOW-03 | `application-dev.yml` thêm config | 0.5 SP | P2 |
| DB-MED-01 | Document V23→V28 sequence | 0.5 SP | P2 |
| **Subtotal** | | **10.5 SP** | |

---

### 8.4. Long-term Recommendations (Sprint 4+)

1. **Codegen types from OpenAPI** — `openapi-generator-cli` generate TS types + axios client; loại bỏ hoàn toàn issue contract mismatch (chiếm ~30% issue còn lại).
2. **Integration test end-to-end** với Testcontainers (MySQL + Redis) — chạy flow auth → booking → payment.
3. **Observability**: Spring Boot Actuator + Micrometer + Prometheus; Grafana dashboard.
4. **Distributed tracing**: OpenTelemetry + Jaeger.
5. **CI/CD pipeline**: GitHub Actions → lint → test → build → deploy staging → smoke test → deploy prod.
6. **Secret management**: Vault hoặc AWS Secrets Manager.
7. **Multi-instance ready**: Caffeine → Redis cache; Bucket4j → Redis-backed.
8. **API versioning**: `/api/v1/...`.
9. **Soft delete**: cho users, bookings (thay vì hard delete).
10. **Audit log**: track thay đổi booking/payment.
11. **Soft-delete for booking**: thay vì EXPIRED → CONFIRMED, support refund flow.
12. **Admin CRUD**: full create/update/delete cho flights/bookings/users/news.

---

## 9. Phụ lục: Ma trận Severity

### 9.1. Tổng quan (sau đợt fix 3)

```
┌────────────────────────────────────────────────────────────────┐
│           SEVERITY DISTRIBUTION (lần 3 — sau fix)              │
├────────────┬──────┬──────┬─────┬───────┬────────────────────────┤
│ Severity   │  BE  │  FE  │ DB  │ Infra │ Total                  │
├────────────┼──────┼──────┼─────┼───────┼────────────────────────┤
│ 🔴 Critical│   0  │   0  │  1  │   0   │    1                   │
│ 🟠 High    │   4  │   5  │  3  │   1   │   13                   │
│ 🟡 Medium  │   9  │   8  │  2  │   2   │   21                   │
│ 🟢 Low     │   4  │   5  │  2  │   1   │   12                   │
├────────────┼──────┼──────┼─────┼───────┼────────────────────────┤
│ TOTAL      │  17  │  18  │  8  │   4   │   47                   │
└────────────┴──────┴──────┴─────┴───────┴────────────────────────┘
```

**So sánh qua 3 lần**:

| Severity | Lần 1 | Lần 2 | Lần 3 | Giảm tổng |
|---|---|---|---|---|
| 🔴 Critical | 21 | 4 | **1** | -95% |
| 🟠 High | 34 | 20 | **13** | -62% |
| 🟡 Medium | 27 | 24 | **21** | -22% |
| 🟢 Low | 15 | 14 | **12** | -20% |
| **Total** | **97** | **62** | **47** | **-52%** |

### 9.2. CVSS-style Scoring Legend

| Score | Severity | Meaning |
|---|---|---|
| 9.0–10.0 | Critical | Production blocker / data loss / security breach |
| 7.0–8.9 | High | Major feature broken / security risk |
| 4.0–6.9 | Medium | Functional issue / minor security |
| 0.1–3.9 | Low | Code quality / minor UX |

### 9.3. Issue Index (sorted by severity)

#### Critical (1)
- DB-CRIT-01: V29 DROP airports, flights không có FK (vẫn chưa fix từ đợt 2)

#### High (13)
- BE-HIGH-01: Admin module BE chỉ read-only, không có CRUD
- BE-HIGH-02: `BookingDTO.maskPII` passenger mask rỗng
- BE-HIGH-03: `PassengerRequest.idNumber` không `@NotBlank`, type/gender không `@Pattern`
- BE-HIGH-04: `Booking.transitionTo` cho phép EXPIRED → CONFIRMED (race condition + business logic flaw)
- FE-HIGH-01: `updatePassengers` endpoint FE gọi không tồn tại ở BE (vẫn chưa fix)
- FE-HIGH-02: ManageBookingPage vẫn expect `b.flight.route.origin.city` không tồn tại
- FE-HIGH-03: Nhiều `as any` chưa dọn dẹp
- FE-HIGH-04: `LoginResponse` type sai (`accessToken` thay `token`)
- FE-HIGH-05: AdminDashboardPage vẫn fallback mock cho 4 chart
- DB-HIGH-01: users.email VARCHAR(100), chk_password_length quá lỏng
- DB-HIGH-02: bookings.user_id ON DELETE SET NULL tạo orphan
- DB-HIGH-03: V32 migration issues chưa fix (updated_at duplicate, chk_password_length, uk_booking_pax NULL)
- INFRA-HIGH-01: Backend healthcheck reference Actuator nhưng chưa add dependency

#### Medium (21) — xem Sections 3.3, 4.3, 5.3, 6.3
#### Low (12) — xem Sections 3.4, 4.4, 5.4, 6.4

---

## Kết luận

Đợt fix `ed9f7c1` đã xử lý đúng và triệt để **phần lớn Critical + High** còn lại từ đợt 2. Đặc biệt:

- ✅ **FE-CRIT-01** Refresh interceptor — fix đúng, dựa vào cookie HttpOnly
- ✅ **FE-CRIT-02** PaymentPage itemSnapshot — fix đúng, parse JSON
- ✅ **FE-HIGH-02** Flight search params — fix đúng, FE map param + response
- ✅ **FE-HIGH-03** Flight type — fix đúng, FE map FlightDTO → Flight
- ✅ **FE-HIGH-05** BookingHistoryPage useQuery — fix đúng
- ✅ **FE-HIGH-06** VitePWA devOptions — fix đúng
- ✅ **FE-HIGH-08** ConfirmationPage — fix đúng, dùng contactEmail + itemSnapshot
- ✅ **BE-HIGH-01** TaskScheduler bean — fix đúng, `AppConfig` add 2 bean
- ✅ **BE-HIGH-02** VnpayIpnFilter method check — fix đúng
- ✅ **BE-HIGH-03** BookingRequest @Valid @Size — fix đúng
- ✅ **BE-HIGH-04** HtmlSanitizer rich — fix đúng, `sanitizeRich` + BlogServiceImpl apply
- ✅ **BE-HIGH-05** jjwt bump — fix đúng, 0.11.5 → 0.12.6
- ✅ **BE-HIGH-06** ReservationScheduler transaction — fix đúng, tách `ReservationReleaseService` với `REQUIRES_NEW`
- ✅ **BE-HIGH-07** BookingStrategyFactory trim — fix đúng
- ✅ **BE-HIGH-08** searchByCodeAndLastName BK prefix — fix đúng, validate
- ✅ **BE-HIGH-09** Admin endpoints — partial, GET + PUT roles đã có
- ✅ **DB-HIGH-03** tours.rating sync — fix đúng, recompute trong transaction
- ✅ **DB-LOW-03** bookings.status ENUM failed — fix đúng, V34 add 'failed'
- ✅ **DB missing indexes** — fix đúng, V34 add 3 index
- ✅ **INFRA-CRIT-01** SPRING_PROFILES_ACTIVE — fix đúng
- ✅ **INFRA-HIGH-01** VITE_API_URL Dockerfile — fix đúng
- ✅ **INFRA-HIGH-02/03** Healthcheck — fix đúng (nhưng chưa add Actuator)

Tuy nhiên vẫn còn **1 Critical + 13 High** phải fix trước production:

1. **`updatePassengers` endpoint FE gọi không tồn tại** — flow SeatHold vỡ.
2. **Admin module BE chỉ read-only** — FE có button CRUD nhưng BE không support.
3. **DB-CRIT-01 vẫn còn** — airports DROP, flights không FK.
4. **V32 migration issues chưa fix** — `ADD COLUMN updated_at` duplicate, `chk_password_length` lỏng, `uk_booking_pax` NULL bypass.
5. **`BookingDTO.maskPII` passenger mask rỗng** — leak document trên public endpoint.
6. **`Booking.transitionTo` EXPIRED → CONFIRMED** — race condition + business logic flaw.
7. **`PassengerRequest` validation thiếu** — `idNumber` không required, `type/gender` không pattern.
8. **`ManageBookingPage` vẫn expect `b.flight.route`** không tồn tại.
9. **`LoginResponse` type sai** — `accessToken` thay `token`.
10. **AdminDashboardPage 4 chart vẫn mock**.
11. **Nhiều `as any` chưa dọn dẹp**.
12. **`users.email` VARCHAR(100)** — thiếu cho email dài.
13. **`bookings.user_id ON DELETE SET NULL`** — orphan booking.
14. **Backend healthcheck reference Actuator nhưng chưa add dependency** — `docker-compose up` fail.

**Khuyến nghị cuối**: 
- **Phase 1 (3-5 ngày, ~18.5 SP)**: Fix 1 Critical + 13 High → production-ready cơ bản, có thể demo end-to-end flow hoàn chỉnh.
- **Phase 2 (1 tuần, ~9.6 SP)**: Fix DB + Infra hardening.
- **Phase 3 (1 tuần, ~10.5 SP)**: Polish Medium/Low.
- **Long-term**: Codegen types từ OpenAPI để loại bỏ vĩnh viễn contract mismatch.

Đặc biệt khuyến nghị **ưu tiên fix INFRA-HIGH-01 (Actuator dependency)** trước — vì hiện tại `docker-compose up` sẽ fail do healthcheck reference endpoint không tồn tại.

---

> **Báo cáo kết thúc.**
> Review-only — KHÔNG fix. Tổng cộng **47 issue** còn lại (sau 3 đợt: 97 → 62 → 47), liệt kê với severity, file:line, code snippet, root cause, CVSS-style score, recommendation.
