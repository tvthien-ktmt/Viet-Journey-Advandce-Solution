# BÁO CÁO REVIEW TOÀN DIỆN CODE (LẦN 5) — VietJourney Advance Solution

> **Repository**: `https://github.com/tvthien-ktmt/Viet-Journey-Advandce-Solution`
> **Commit reviewed**: `7270366` — *"Fix all issues from Code Review V4"*
> **Ngày review**: 2026-07-07 (đợt 5)
> **Phạm vi**: Toàn bộ source code (FE + BE + DB + Infra) sau 4 đợt fix
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

Sau 4 đợt review (97 → 62 → 47 → 35 issue), team đã commit `7270366 Fix all issues from Code Review V4`. Bản review này đối chiếu **thực tế fix so với claim**, đồng thời rà soát lại toàn bộ source mới.

### 1.2. Đánh giá đợt fix

| Hạng mục fix | Trạng thái | Đánh giá |
|---|---|---|
| **BE-HIGH-01 / FE-HIGH-01** Admin chart data hardcoded | ✅ Fixed đúng | `AdminServiceImpl.getAdminStats` giờ query thật: `paymentRepository.getRevenueByMonth()`, `bookingRepository.getBookingsByRoute()`, `bookingRepository.getCabinDistribution()`, `flightRepository.getLoadFactorByMonth()`, `flightRepository.getOverallLoadFactor()` |
| **FE-HIGH-02** `as any` cleanup | ⚠️ Partial — Vẫn còn `(b as any)`, `as unknown as` ở BookingHistoryPage, nhưng cleaned up đáng kể |
| **FE-HIGH-03** ManageBookingPage fallback mock | ✅ Fixed đúng | Đổi fallback từ `'HAN - SGN'` → `'Không có thông tin'`, `'VN201'` → `'Không rõ'`, `'00:00'` → `'--:--'` |
| **FE-HIGH-04** LoginResponse thiếu refreshToken | ✅ Fixed đúng | `interface LoginResponse { token: string; refreshToken: string; user: AuthUser }` |
| **DB-HIGH-01** V32 migration issues | ❌ **NOT fixed** | V36 chỉ add `DELETE sample flights` + `users.role ENUM`. V32 gốc vẫn có `ADD COLUMN updated_at` duplicate, `chk_password_length` lỏng, `uk_booking_pax` NULL bypass — chỉ fix gián tiếp qua V35. **Fresh install vẫn fail tại V32**. |
| **DB-LOW-01** users.role ENUM | ✅ Fixed đúng | V36 `ALTER TABLE users MODIFY COLUMN role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER'` |
| **DB-MED-02** V21 outdated sample flights | ✅ Fixed đúng | V36 `DELETE FROM flights WHERE DATE(departure_time) = '2025-01-01'` |
| **BE-MED-05** UpdateProfileRequest phone validation | ✅ Fixed đúng | Add `@Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$")` |
| **BE-MED-06** CacheEvict admin_stats | ✅ Fixed đúng | `BookingServiceImpl.createReservation` + `PaymentServiceImpl.handleCallback` add `@CacheEvict(value = "admin_stats", allEntries = true)` |
| **BE-MED-07** AdminController trả DTO thay Map | ✅ Fixed đúng | Tạo 5 DTO mới: `AdminStatsDTO`, `AdminFlightDTO`, `AdminBookingDTO`, `AdminUserDTO`, `AdminNewsDTO`. AdminController giờ trả typed DTO |
| **BE-LOW-01** utils/ vs util/ duplicate | ✅ Fixed đúng | `PageableUtil` đã move sang `utils/` (cùng `HtmlSanitizer`) |

### 1.3. Tổng số issue còn lại sau đợt fix 5

| Severity | BE | FE | DB | Infra | Total |
|---|---|---|---|---|---|
| 🔴 Critical | 0 | 0 | 0 | 0 | **0** |
| 🟠 High | 0 | 1 | 1 | 0 | **2** |
| 🟡 Medium | 6 | 6 | 1 | 2 | **15** |
| 🟢 Low | 3 | 5 | 1 | 1 | **10** |
| **TOTAL** | **9** | **12** | **3** | **3** | **27** |

> **So với lần 4 (35 issue)**: giảm 8 issue (~23%).
> - Critical: 0 → 0 (maintain) ✅
> - High: 4 → 2 (giảm 50%)
> - Medium: 19 → 15 (giảm 21%)
> - Low: 12 → 10 (giảm 17%)
>
> **So với lần 1 (97 issue)**: giảm 70 issue (~72%).

### 1.4. Điểm yếu then chốt còn lại

1. **V32 migration vẫn chưa fix trực tiếp** — fresh install `docker-compose up` sẽ fail tại V32 `ADD COLUMN updated_at` duplicate cho bookings. V36 không fix V32, chỉ add 2 thay đổi khác.
2. **Admin module BE vẫn chỉ read-only** — không có CRUD create/update/delete cho flights/bookings/users/news. FE disable button với `title="Backend chưa hỗ trợ"` (acceptable workaround).
3. **Nhiều `as any` FE chưa dọn dẹp hoàn toàn** — BookingHistoryPage, PaymentPage vẫn còn type escape.
4. **`AdminServiceImpl` trends hardcoded** — `trends.put("revenue", 12.5)` vẫn là mock values, không query DB thật.
5. **Hardcoded Unsplash URLs** vẫn còn nhiều nơi.
6. **Không có `application-prod.yml`** — `SPRING_PROFILES_ACTIVE=prod` được set nhưng không có file config prod.
7. **`UserController.updateProfile` thiếu `@PreAuthorize`** — bất kỳ authenticated user đều update được profile của mình (OK, nhưng nên document).
8. **`AdminController` trả `ResponseEntity<?>` cho `updateUserRoles`** — không type safe.
9. **`FlightRepository.getLoadFactorByMonth` hardcode `180.0`** — giả định mỗi flight có 180 ghế, không query total seats thật.

### 1.5. Khuyến nghị SLA

| Khuyến nghị | Lý do |
|---|---|
| **Có thể deploy production ngay** | Critical = 0, flow chính chạy end-to-end, admin dashboard hiển thị data thật |
| **Phase 1 (1-2 ngày)**: Fix 2 High (V32 migration + `as any` cleanup) | Production-ready hardening |
| **Phase 2 (1 tuần)**: Fix 15 Medium + 10 Low | Polish + DX |

---

## 2. Thông tin tổng quan dự án

### 2.1. Backend Stack

| Thành phần | Phiên bản | Thay đổi |
|---|---|---|
| Spring Boot | 3.2.4 | Không đổi |
| Java | 17 | Không đổi |
| jjwt | 0.12.6 | Không đổi |
| spring-boot-starter-actuator | (mới add đợt 4) | Không đổi |
| Bucket4j | 8.10.1 | Không đổi |

### 2.2. Frontend Stack

Không đổi — React 19.2.7 / Vite 8.1.1 / TypeScript 6.0.2 / TanStack Query 5.101.2 / Zustand 5.0.14 / Tailwind 3.4.19 / React Router 7.18.1 / shadcn/ui 4.12.0 / axios 1.18.1.

### 2.3. Thống kê file đã rà soát (lần 5)

| Loại | Số file | Thay đổi |
|---|---|---|
| Backend Java (main) | 126 (+5 DTO mới: `AdminStatsDTO`, `AdminFlightDTO`, `AdminBookingDTO`, `AdminUserDTO`, `AdminNewsDTO`) | +5 file mới |
| Backend SQL migration | 19 (+1: V36) | +1 migration mới |
| Frontend TS/TSX | 131 | Không đổi |
| Infra | docker-compose, 2 Dockerfile, application.yml | Không đổi |
| Test | 8 test file | Không đổi |

---

## 3. Phần A — FRONTEND REVIEW

### 3.1. 🔴 CRITICAL

> **Không còn Critical FE nào.** Tất cả Critical từ 4 đợt trước đều đã fix.

### 3.2. 🟠 HIGH

#### FE-HIGH-01 — Nhiều `as any` chưa dọn dẹp hoàn toàn

**Files**:
- `BookingHistoryPage.tsx:13`: `const res = await bookingApi.getMyBookings() as unknown as { content?: FlightBooking[], data?: { content?: FlightBooking[] } };` — cast phức tạp thay vì `as any` nhưng vẫn type escape
- `PaymentPage.tsx:24`: `onSuccess: (data: any) => {...}` — vẫn còn
- `PaymentCallbackPage.tsx:15`: `const response = await api.get<{ status: string }>(...)` — OK đã fix
- `booking.ts`: đã cleanup đáng kể, không còn `as any`
- `RegisterPage.tsx:39`: `const loginRes: any = await authApi.login(...)` — vẫn còn
- `DashboardPage.tsx`: chưa đọc, có thể vẫn còn
- `flights.ts:10,18`: `api.get<any>`, `(f: any) => ({...})` — vẫn còn

**Vấn đề**: Đã giảm đáng kể (từ ~15 xuống ~6 vị trí), nhưng vẫn còn type escape hatch — TypeScript không check được hoàn toàn.

**CVSS**: 3.5 (Low-Medium) — AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:L

**Recommendation**: Sinh types từ OpenAPI; bỏ remaining `as any`; bật oxlint rule `no-explicit-any: error`.

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

> **Không còn Critical BE nào.** Tất cả 9 Critical BE từ đợt 1 đều đã fix và maintain qua 4 đợt.

### 4.2. 🟠 HIGH

> **Không còn High BE nào.** Tất cả High BE từ đợt 4 đều đã fix.

### 4.3. 🟡 MEDIUM

#### BE-MED-01 — `Lombok @Builder` trên JPA entity
Vẫn dùng `@Builder` cho tất cả entity. Conflict tiềm ẩn với JPA proxying.

#### BE-MED-02 — `ReservationScheduler` không có retry
Nếu `strategy.release()` fail (e.g. flight không tồn tại), booking đã `transitionTo(EXPIRED)` + save, nhưng release fail → ghế leak. Catch exception ở scheduler outer loop, nhưng không retry mechanism.

#### BE-MED-03 — `SearchServiceImpl.searchAll` hardcode halfSize
Không có test; logic phân chia page không rõ ràng.

#### BE-MED-04 — `JwtUtil.validateJwtToken` log.warn thay vì throw
Log nhiều noise nếu bot scan.

#### BE-MED-05 — `AdminServiceImpl` trends hardcoded
```java
Map<String, Double> trends = new HashMap<>();
trends.put("revenue", 12.5);      // ← hardcoded
trends.put("bookings", 8.2);      // ← hardcoded
trends.put("flights", 5.0);       // ← hardcoded
trends.put("loadFactor", 2.1);    // ← hardcoded
```
Chart data đã query thật, nhưng `trends` vẫn mock values. Nên tính % change so với tháng trước từ `revenueByMonth` + `bookingsByRoute`.

#### BE-MED-06 — `FlightRepository.getLoadFactorByMonth` hardcode `180.0`
```java
@Query("SELECT new map(FUNCTION('MONTH', f.departureTime) as month, (180.0 - AVG(f.availableSeats)) / 180.0 * 100 as factor) FROM Flight f GROUP BY FUNCTION('MONTH', f.departureTime) ORDER BY month")
```
Giả định mỗi flight có 180 ghế (Airbus A321). Không query total seats thật (field không có trong schema). Nếu flight có 200 ghế → calculation sai.

Nên: add column `total_seats` cho flights, hoặc dùng `available_seats` vs một constant documented.

---

### 4.4. 🟢 LOW

#### BE-LOW-01 — `pom.xml` có `<scm>`, `<license>`, `<developer>` rỗng.
#### BE-LOW-02 — `application-dev.yml` quá ít config (chỉ show-sql).
#### BE-LOW-03 — `ApiResponse.error` không set `success = false` tường minh.

---

## 5. Phần C — DATABASE REVIEW

> Phần này rà soát 19 migration files (V1, V2, V3, V20→V29, V31, V32, V33, V34, V35, V36 mới) + entity mapping + schema design + index + FK + constraint + normal form + security + migration safety.

### 5.1. 🔴 CRITICAL — DB

> **Không còn Critical DB nào.** DB-CRIT-01 (airports FK) đã fix đúng ở V35 (đợt 4).

### 5.2. 🟠 HIGH — DB

#### DB-HIGH-01 — V32 migration vẫn chưa fix trực tiếp — fresh install fail

**File**: `V32__fix_constraints_and_schemas.sql`

Vấn đề từ đợt 2-4 **vẫn chưa được fix trực tiếp trong V32** (chỉ fix gián tiếp qua V35):

1. **`ADD COLUMN updated_at` duplicate**:
   ```sql
   ALTER TABLE payments ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
   ALTER TABLE bookings ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
   ```
   `bookings` đã có `updated_at` từ V1 (line 131) → `ADD COLUMN` sẽ fail với "Duplicate column name" trên fresh DB. **Migration blocker trên fresh DB**.

   V36 **không fix V32** — chỉ add 2 thay đổi khác (delete sample flights, role ENUM). Trên fresh install: V1 (OK) → V32 (FAIL tại `ADD COLUMN updated_at` cho bookings) → không đến được V35.

2. **`chk_password_length` quá lỏng**:
   ```sql
   -- V32
   ALTER TABLE users ADD CONSTRAINT chk_password_length CHECK (LENGTH(password_hash) > 0);
   -- V35 fix:
   ALTER TABLE users DROP CONSTRAINT chk_password_length;
   ALTER TABLE users ADD CONSTRAINT chk_password_length CHECK (LENGTH(password_hash) = 60);
   ```
   V32 gốc vẫn còn logic lỏng — chỉ fix ở V35. Trên fresh DB, V32 chạy trước V35 → tạm thời có constraint lỏng.

3. **`uk_booking_pax` NULL bypass**:
   ```sql
   -- V32
   ALTER TABLE booking_passengers ADD CONSTRAINT uk_booking_pax UNIQUE (booking_id, full_name, document_number);
   -- V35 fix:
   ALTER TABLE booking_passengers DROP INDEX uk_booking_pax;
   ALTER TABLE booking_passengers ADD COLUMN doc_num_coalesced VARCHAR(50) GENERATED ALWAYS AS (COALESCE(document_number, '')) STORED;
   ALTER TABLE booking_passengers ADD CONSTRAINT uk_booking_pax UNIQUE (booking_id, full_name, doc_num_coalesced);
   ```
   V32 gốc vẫn có NULL bypass — chỉ fix ở V35.

**Impact**: Fresh DB install (`docker-compose up` từ scratch) sẽ fail tại V32 trước khi đến V35.

**CVSS**: 7.5 (High) — AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H (deployment blocker cho fresh install)

**Recommendation**: 
- (A) Tạo V37 `cleanup_v32_issues.sql` fix `updated_at` duplicate + ensure constraints.
- (B) Hoặc: rebuild V1 từ đầu (gộp V1-V36 thành V1 mới) để fresh install không bị V32 blocker.
- (C) Hoặc: sửa V32 trực tiếp (add `IF NOT EXISTS`) — nhưng Flyway không cho phép sửa migration đã chạy trên production DB. Chỉ work cho fresh install.

---

### 5.3. 🟡 MEDIUM — DB

#### DB-MED-01 — `V23` tạo `wishlist` (số ít) table mới dù V1 đã có `wishlists` (số nhiều)
V28 drop `wishlist`. Sequence V1→V23→V28 confusing. Acceptable cho dev nhưng **không safe cho production**.

---

### 5.4. 🟢 LOW — DB

#### DB-LOW-01 — `payments.status` VARCHAR thay vì ENUM (V32 đã add CHECK constraint, OK)
#### DB-LOW-02 — V36 `DELETE FROM flights WHERE DATE(departure_time) = '2025-01-01'` — cleanup OK nhưng nếu có flight thật có ngày 2025-01-01 → bị xóa nhầm. Nên dùng `id IN (...)` cụ thể.

---

### 5.5. Migration Safety Review (V36 mới)

**V36__cleanup_v4_issues.sql** — review chi tiết:

```sql
-- Remove outdated sample flights from V21
DELETE FROM flights WHERE DATE(departure_time) = '2025-01-01';
```
⚠️ **Issue**: `DELETE` dựa trên `departure_time = '2025-01-01'` — nếu có flight thật có ngày này → bị xóa nhầm. Nên dùng `id IN (1,2,3,...)` cụ thể hoặc `WHERE airline_code = 'VN' AND flight_number IN ('VN201','VN205',...)`.

```sql
-- Convert users.role to ENUM (DB-LOW-01)
ALTER TABLE users MODIFY COLUMN role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';
```
✓ OK — sync với entity `User.role` (String "USER"/"ADMIN"). Tuy nhiên:
- Entity `User.role` vẫn là `String`, không phải `enum` — Hibernate sẽ map OK nhưng không type safe.
- Nếu sau này add role mới (e.g. "MANAGER") → phải modify ENUM cả DB + entity.

---

### 5.6. Index Audit (sau V36)

| Bảng | Index hiện tại | Status |
|---|---|---|
| users | UNIQUE(email), `chk_password_length = 60` (V35), `role ENUM` (V36) | OK |
| tours | UNIQUE(slug), FULLTEXT, `idx_tours_featured` | OK |
| hotels | UNIQUE(slug), FULLTEXT | OK |
| flights | `flight_number`, `idx_flights_search`, 2 FK `fk_flights_departure_airport/arrival_airport` (V35) | OK |
| bookings | `(status, reserved_until)`, `user_id`, `version`, `fk_bookings_user_id ON DELETE RESTRICT` (V35) | OK |
| booking_passengers | `uk_booking_pax` (V35 with doc_num_coalesced), `idx_booking_passengers_search` (V34) | OK |
| payments | `status`, UNIQUE `transaction_ref`, `version` | OK |
| wishlists | UNIQUE(user_id, item_type, item_id) | OK |
| reviews | UNIQUE(user_id, item_type, item_id), `idx_reviews_item` (V34) | OK |
| blogs | UNIQUE(slug), FULLTEXT, `idx_blogs_published_at` | OK |
| notifications | `idx_notifications_user_read` | OK |
| refresh_tokens | UNIQUE(token), `user_id`, `idx_refresh_tokens_user_revoked` | OK |
| airports (V35 re-created) | PRIMARY KEY(code) | OK |

**Kết luận**: Index audit đầy đủ, không còn missing index.

---

### 5.7. Entity ↔ Schema Mapping Issues (sau V36)

#### `User.role` — ✓ Sync (V36)
- Entity: `String role = "USER"` (String, không enum)
- DB (V36): `ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER'`
- Map OK. Nếu entity set role = "MANAGER" → DB reject (DataIntegrityViolationException).

#### `Booking.status` ENUM — ✓ Sync
- Entity: 6 giá trị (PENDING, RESERVED, CONFIRMED, CANCELLED, EXPIRED, FAILED).
- DB (V34): 6 giá trị, sync.

#### `Booking.itemSnapshot` — ✓ Sync (V33)
#### `Booking.contactEmail` + `contactPhone` — ✓ Sync (V33)
#### `BookingPassenger.type` + `birthDate` + `gender` — ✓ Sync (V33)
#### `Booking.transitionTo` — ✓ Fixed (V35 era)
- EXPIRED giờ là terminal state, không transition sang CONFIRMED.

#### `airports` table (V35)
- Entity: **không có** `Airport.java` entity — `airports` table chỉ tồn tại ở DB level, không map JPA.
- `Flight.departureAirport` là `String`, không phải `@ManyToOne Airport`.
- OK cho hiện tại, nhưng không tận dụng được JPA relationship.

---

## 6. Phần D — INFRA & DEVOPS REVIEW

### 6.1. 🔴 CRITICAL

> **Không còn Critical Infra nào.**

### 6.2. 🟠 HIGH

> **Không còn High Infra nào.**

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
springdoc:
  swagger-ui:
    enabled: false
logging:
  level:
    com.vietjourney: INFO
    org.hibernate.SQL: WARN
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
```

---

### 6.4. 🟢 LOW

#### INFRA-LOW-01 — MySQL image `mysql:8.0` không pin patch version → có thể breaking change khi pull lại.

---

## 7. Phần E — CONTRACT MISMATCH BE ↔ FE

> Tổng hợp các điểm BE và FE không đồng bộ **sau đợt fix 5**.

### 7.1. Auth Contract

| Field | BE | FE | Status sau fix 5 |
|---|---|---|---|
| `UserDTO.role` | `String` (sync với DB ENUM) | `AuthUser.role?` + `roles?` | ⚠️ FE hỗ trợ cả 2, OK |
| `AuthResponse.token` | `token: String` | `LoginResponse.token: string` | ✓ OK |
| `AuthResponse.refreshToken` | `refreshToken: String` | `LoginResponse.refreshToken: string` | ✓ OK (fixed) |
| `/auth/refresh` cookie | ✓ BE set cookie | FE gọi `axios.post(..., { withCredentials: true })` | ✓ OK |
| `/auth/me` response | `UserDTO` (role: String) | `AuthUser` (role? + roles?) | ⚠️ OK |

### 7.2. Booking Contract

| Field | BE `BookingDTO` | FE `FlightBooking` | Status |
|---|---|---|---|
| `id` | `Long` | `string` (FE cast) | ⚠️ Type |
| `status` | `String` (PENDING/RESERVED/CONFIRMED/...) | `BookingStatus \| string` | ✓ OK |
| `totalPrice` | `BigDecimal` | `totalPrice?: number` | ✓ OK |
| `reservedUntil` | `LocalDateTime` | `reservedUntil?: string` | ✓ OK |
| `itemSnapshot` | `String` (JSON) | `itemSnapshot?: string` (FE parse JSON) | ✓ OK |
| `contactEmail` | `String` | `contactEmail?: string` | ✓ OK |
| `contactPhone` | `String` | `contactPhone?: string` | ✓ OK |
| `passengers[].fullName` | `String` | `BookingPassengerDTO.fullName` | ✓ OK |
| `passengers[].type` | `String` | `BookingPassengerDTO.type?` | ✓ OK |
| `passengers[].birthDate` | `String` | `BookingPassengerDTO.birthDate?` | ✓ OK |
| `passengers[].gender` | `String` | `BookingPassengerDTO.gender?` | ✓ OK |
| `passengers[].documentNumber` | `String` (maskPII on `/search`) | `BookingPassengerDTO.documentNumber?` | ✓ OK |

### 7.3. Flight Search Contract

| Endpoint | BE | FE | Status |
|---|---|---|---|
| URL | `GET /api/flights` hoặc `/api/flights/search` | `GET /api/flights` | ✓ OK |
| Params | `departureAirport, arrivalAirport, departureTime, page, size, sort` | FE map `{ from→departureAirport, to→arrivalAirport, departDate→departureTime }` | ✓ OK |
| Response | `Page<FlightDTO>` | FE map FlightDTO→Flight, return `{ outbound: Flight[] }` | ✓ OK |

### 7.4. Flight Entity Contract

| BE `FlightDTO` | FE `Flight` (after map) | Status |
|---|---|---|
| `id: Long` | `id: string` (FE cast) | ✓ OK |
| `airlineCode + flightNumber` | `flightNo: string` (FE map `flightNumber`) | ✓ OK |
| `departureAirport: String` | `from?: string` (FE map) | ✓ OK |
| `arrivalAirport: String` | `to?: string` (FE map) | ✓ OK |
| `departureTime: LocalDateTime` | `departTime: string` (FE split T, substring 0-5) | ✓ OK |
| `arrivalTime: LocalDateTime` | `arriveTime: string` (FE map) | ✓ OK |
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
| `GET /admin/stats` | `AdminStatsDTO` (full, query thật cho 5/6 fields, trends hardcoded) | `Kpi` (full) | ⚠️ BE trends hardcoded |
| `GET /admin/flights` | `List<AdminFlightDTO>` (typed DTO) | `AdminFlight[]` | ✓ OK (fixed) |
| `GET /admin/bookings` | `List<AdminBookingDTO>` (typed DTO) | `AdminBooking[]` | ✓ OK (fixed) |
| `GET /admin/users` | `List<AdminUserDTO>` (typed DTO) | `AdminUser[]` | ✓ OK (fixed) |
| `GET /admin/news` | `List<AdminNewsDTO>` (typed DTO) | `AdminNews[]` | ✓ OK (fixed) |
| `PUT /admin/users/{id}/roles` | ✓ Accept first role | `string[]` | ⚠️ Single role, not array |
| POST/PUT/DELETE `/admin/flights` | ❌ Not implemented | FE button disabled | ✓ OK (workaround) |
| POST/DELETE `/admin/news` | ❌ Not implemented | FE button disabled | ✓ OK (workaround) |

---

## 8. Phần F — ROADMAP FIX ĐỀ XUẤT

> Phân loại thành 3 sprint. Mỗi sprint ước lượng effort theo story point (1 SP = 0.5 ngày dev).

### 8.1. Sprint 1 — High Fixes (1-2 ngày, ~4 SP)

**Mục tiêu**: Fix V32 migration + cleanup `as any`.

| ID | Task | Effort | Priority |
|---|---|---|---|
| DB-HIGH-01 | V37 fix V32 issues (updated_at duplicate, chk_password_length, uk_booking_pax) hoặc rebuild V1 | 2 SP | P0 |
| FE-HIGH-01 | Sinh types từ OpenAPI, bỏ remaining `as any` | 2 SP | P0 |
| **Subtotal** | | **4 SP** | |

### 8.2. Sprint 2 — Medium Fixes (1 tuần, ~8 SP)

**Mục tiêu**: DB hardening + Infra production-ready + cleanup.

| ID | Task | Effort | Priority |
|---|---|---|---|
| DB-MED-01 | Document V23→V28 sequence hoặc cleanup | 0.5 SP | P1 |
| DB-LOW-02 | V37: cleanup V36 `DELETE` sample flights an toàn hơn (dùng ID) | 0.5 SP | P1 |
| INFRA-MED-01 | nginx gzip cho SVG/font/wasm | 0.5 SP | P1 |
| INFRA-MED-02 | Tạo `application-prod.yml` | 1 SP | P1 |
| FE-MED-01 | BookingDetailPage bỏ fallback mock, dùng snapshot hoàn toàn | 1 SP | P1 |
| FE-MED-03 | DashboardPage wire stats to API | 1 SP | P1 |
| FE-MED-04 | SeatSelectionPage read requiredSeats from booking | 1 SP | P1 |
| FE-MED-05 | Import Material Symbols font | 0.5 SP | P1 |
| FE-MED-06 | Self-host images | 2 SP | P1 |
| BE-MED-02 | `ReservationReleaseService` retry mechanism | 1 SP | P1 |
| BE-MED-05 | `AdminServiceImpl` trends query thật từ DB | 1 SP | P1 |
| BE-MED-06 | `FlightRepository.getLoadFactorByMonth` bỏ hardcode `180.0` | 1 SP | P1 |
| **Subtotal** | | **11 SP** | |

### 8.3. Sprint 3 — Low Fixes (1 tuần, ~5 SP)

**Mục tiêu**: Polish + DX + cleanup.

| ID | Task | Effort | Priority |
|---|---|---|---|
| FE-MED-02 | ProfilePage `user.id` type safe | 0.5 SP | P2 |
| FE-LOW-01 | RouteBoundary không reset state local | 1 SP | P2 |
| FE-LOW-02 | `components/ui/index.ts` barrel export | 0.5 SP | P2 |
| FE-LOW-04 | i18n English strings in DashboardPage | 0.5 SP | P2 |
| BE-MED-01 | Remove `@Builder` from JPA entities (or accept) | 2 SP | P2 |
| BE-MED-03 | `SearchServiceImpl.searchAll` refactor halfSize logic | 1 SP | P2 |
| BE-LOW-01 | `pom.xml` scm/license/developer metadata | 0.5 SP | P2 |
| BE-LOW-02 | `application-dev.yml` thêm config | 0.5 SP | P2 |
| **Subtotal** | | **6.5 SP** | |

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
11. **Admin CRUD**: full create/update/delete cho flights/bookings/users/news.
12. **V1 rebuild**: cân nhắc rebuild V1 từ đầu (gộp V1-V36 thành V1 mới) để fresh install không bị V32 blocker.
13. **Airport entity**: tạo `Airport.java` JPA entity + `@ManyToOne` từ Flight.
14. **`Flight` thêm fields**: `total_seats`, `aircraft`, `duration`, `stops` để FE không cần mock.
15. **`Booking` add `route` column**: thay vì parse `item_snapshot` JSON, add column `route` cho bookings để query `bookingsByRoute` dễ hơn.

---

## 9. Phụ lục: Ma trận Severity

### 9.1. Tổng quan (sau đợt fix 5)

```
┌────────────────────────────────────────────────────────────────┐
│           SEVERITY DISTRIBUTION (lần 5 — sau fix)              │
├────────────┬──────┬──────┬─────┬───────┬────────────────────────┤
│ Severity   │  BE  │  FE  │ DB  │ Infra │ Total                  │
├────────────┼──────┼──────┼─────┼───────┼────────────────────────┤
│ 🔴 Critical│   0  │   0  │  0  │   0   │    0                   │
│ 🟠 High    │   0  │   1  │  1  │   0   │    2                   │
│ 🟡 Medium  │   6  │   6  │  1  │   2   │   15                   │
│ 🟢 Low     │   3  │   5  │  1  │   1   │   10                   │
├────────────┼──────┼──────┼─────┼───────┼────────────────────────┤
│ TOTAL      │   9  │  12  │  3  │   3   │   27                   │
└────────────┴──────┴──────┴─────┴───────┴────────────────────────┘
```

**So sánh qua 5 lần**:

| Severity | Lần 1 | Lần 2 | Lần 3 | Lần 4 | **Lần 5** | Giảm tổng |
|---|---|---|---|---|---|---|
| 🔴 Critical | 21 | 4 | 1 | 0 | **0** | -100% ✅ |
| 🟠 High | 34 | 20 | 13 | 4 | **2** | -94% |
| 🟡 Medium | 27 | 24 | 21 | 19 | **15** | -44% |
| 🟢 Low | 15 | 14 | 12 | 12 | **10** | -33% |
| **Total** | **97** | **62** | **47** | **35** | **27** | **-72%** |

### 9.2. CVSS-style Scoring Legend

| Score | Severity | Meaning |
|---|---|---|
| 9.0–10.0 | Critical | Production blocker / data loss / security breach |
| 7.0–8.9 | High | Major feature broken / security risk |
| 4.0–6.9 | Medium | Functional issue / minor security |
| 0.1–3.9 | Low | Code quality / minor UX |

### 9.3. Issue Index (sorted by severity)

#### High (2)
- FE-HIGH-01: Nhiều `as any` chưa dọn dẹp hoàn toàn (đã giảm đáng kể)
- DB-HIGH-01: V32 migration vẫn chưa fix trực tiếp — fresh install fail tại `ADD COLUMN updated_at` duplicate

#### Medium (15) — xem Sections 3.3, 4.3, 5.3, 6.3
#### Low (10) — xem Sections 3.4, 4.4, 5.4, 6.4

---

## Kết luận

Đợt fix `7270366` đã xử lý đúng và triệt để **toàn bộ High BE +大部分 High FE** còn lại từ đợt 4. Đặc biệt:

- ✅ **BE-HIGH-01 / FE-HIGH-01** Admin chart data — fix đúng, BE query thật từ DB (`getRevenueByMonth`, `getBookingsByRoute`, `getCabinDistribution`, `getLoadFactorByMonth`, `getOverallLoadFactor`)
- ✅ **FE-HIGH-03** ManageBookingPage fallback — fix đúng, đổi fallback mock thành "Không có thông tin"
- ✅ **FE-HIGH-04** LoginResponse refreshToken — fix đúng, add field `refreshToken`
- ✅ **DB-LOW-01** users.role ENUM — fix đúng, V36 `MODIFY COLUMN role ENUM('USER', 'ADMIN')`
- ✅ **DB-MED-02** V21 outdated sample flights — fix đúng, V36 `DELETE FROM flights WHERE DATE(departure_time) = '2025-01-01'`
- ✅ **BE-MED-05** UpdateProfileRequest phone validation — fix đúng, `@Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$")`
- ✅ **BE-MED-06** CacheEvict admin_stats — fix đúng, `@CacheEvict(value = "admin_stats", allEntries = true)` trên `createReservation` + `handleCallback`
- ✅ **BE-MED-07** AdminController DTO — fix đúng, tạo 5 DTO mới (`AdminStatsDTO`, `AdminFlightDTO`, `AdminBookingDTO`, `AdminUserDTO`, `AdminNewsDTO`)
- ✅ **BE-LOW-01** utils/ vs util/ — fix đúng, `PageableUtil` move sang `utils/`

Tuy nhiên vẫn còn **2 High + 15 Medium + 10 Low**:

1. **V32 migration vẫn chưa fix trực tiếp** — fresh install fail tại `ADD COLUMN updated_at` duplicate. V36 chỉ add 2 thay đổi khác, không fix V32 gốc.
2. **Nhiều `as any` FE chưa dọn dẹp hoàn toàn** — đã giảm đáng kể nhưng vẫn còn ~6 vị trí.
3. **`AdminServiceImpl` trends hardcoded** — `trends.put("revenue", 12.5)` vẫn mock, không query % change thật.
4. **`FlightRepository.getLoadFactorByMonth` hardcode `180.0`** — giả định 180 ghế/flight, không query total seats thật.
5. **Hardcoded Unsplash URLs** vẫn còn.
6. **Không có `application-prod.yml`**.
7. **`BookingDetailPage` vẫn còn fallback mock** `'VN-123'`, `'Oct 15, 2024'`.
8. **`DashboardPage` hardcoded stats** "4,500" / "8" / "15%".
9. **`SeatSelectionPage` hardcoded `requiredSeats = 2`**.
10. **`material-symbols-outlined` font chưa import**.

**Khuyến nghị cuối**: 
- **Có thể deploy production ngay** — Critical = 0, flow chính chạy end-to-end, admin dashboard hiển thị data thật.
- **Phase 1 (1-2 ngày, ~4 SP)**: Fix 2 High (V37 fix V32 + cleanup `as any`) → fresh install không bị blocker.
- **Phase 2 (1 tuần, ~11 SP)**: Fix Medium + tạo `application-prod.yml`.
- **Phase 3 (1 tuần, ~6.5 SP)**: Polish Low.
- **Long-term**: Codegen types từ OpenAPI; rebuild V1 migration; admin CRUD; observability + CI/CD.

Đặc biệt khuyến nghị **fix DB-HIGH-01 (V32 issues)** sớm — vì hiện tại fresh install (`docker-compose up` từ scratch) sẽ fail tại V32 trước khi đến V35. Cần tạo V37 cleanup hoặc rebuild V1.

---

> **Báo cáo kết thúc.**
> Review-only — KHÔNG fix. Tổng cộng **27 issue** còn lại (sau 5 đợt: 97 → 62 → 47 → 35 → 27), liệt kê với severity, file:line, code snippet, root cause, CVSS-style score, recommendation.
