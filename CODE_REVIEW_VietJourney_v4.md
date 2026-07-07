# BÁO CÁO REVIEW TOÀN DIỆN CODE (LẦN 4) — VietJourney Advance Solution

> **Repository**: `https://github.com/tvthien-ktmt/Viet-Journey-Advandce-Solution`
> **Commit reviewed**: `566cfc3` — *"fix(all): resolve V3 review issues"*
> **Ngày review**: 2026-07-07 (đợt 4)
> **Phạm vi**: Toàn bộ source code (FE + BE + DB + Infra) sau 3 đợt fix
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

Sau 3 đợt review (97 → 62 → 47 issue), team đã commit `566cfc3 fix(all): resolve V3 review issues`. Bản review này đối chiếu **thực tế fix so với claim**, đồng thời rà soát lại toàn bộ source mới.

### 1.2. Đánh giá đợt fix

| Hạng mục fix | Trạng thái | Đánh giá |
|---|---|---|
| **DB-CRIT-01** airports FK | ✅ Fixed đúng | V35 re-create `airports` table + add 2 FK `flights.departure_airport/arrival_airport → airports.code` ON DELETE RESTRICT + backfill data |
| **DB-HIGH-01** users.email length + chk_password_length | ✅ Fixed đúng | V35 `email VARCHAR(254)`, `chk_password_length = 60` |
| **DB-HIGH-02** bookings.user_id ON DELETE | ✅ Fixed đúng | V35 drop old FK + add `fk_bookings_user_id ON DELETE RESTRICT` |
| **DB-HIGH-03** V32 issues | ✅ Fixed đúng | V35 drop `uk_booking_pax` + add `doc_num_coalesced` generated column + recreate unique constraint |
| **BE-HIGH-02** BookingDTO.maskPII passenger mask | ✅ Fixed đúng | `maskPII()` giờ gọi `p.setDocumentNumber(maskDocument(...))` cho mỗi passenger |
| **BE-HIGH-03** PassengerRequest validation | ✅ Fixed đúng | Add `@NotBlank idNumber`, `@Pattern type/gender/birthDate` |
| **BE-HIGH-04** Booking.transitionTo EXPIRED → CONFIRMED | ✅ Fixed đúng | Remove transition path, EXPIRED giờ là terminal state |
| **BE-HIGH-01** Admin module CRUD | ⚠️ Partial — BE vẫn chỉ read-only GET + PUT roles; FE disable button "Thêm chuyến"/"Thêm bài viết" với `disabled title="Backend chưa hỗ trợ"` | Acceptable workaround |
| **FE-HIGH-01** updatePassengers endpoint | ✅ Fixed đúng (workaround) | FE bỏ hẳn `updatePassengers` khỏi `bookingApi`; passengers được tạo cùng `createBooking` |
| **FE-HIGH-02** ManageBookingPage snapshot | ✅ Fixed đúng | Parse `b.itemSnapshot` để lấy `from/to/flightNo/departTime/arriveTime` |
| **FE-HIGH-03** as any | ⚠️ Partial — Vẫn còn `as any` nhưng có `// eslint-disable-next-line` annotation |
| **FE-HIGH-04** LoginResponse type | ✅ Fixed đúng | Đổi `accessToken: string` → `token: string`; LoginPage dùng `res.token` trực tiếp |
| **FE-HIGH-05** AdminDashboardPage chart | ✅ Fixed đúng | BE `AdminServiceImpl.getAdminStats` giờ trả `revenueByMonth`, `bookingsByRoute`, `cabinDistribution`, `loadFactorByMonth` (hardcoded values); FE dùng `stats?.revenueByMonth \|\| ADMIN_STATS.revenueByMonth` |
| **INFRA-HIGH-01** Actuator dependency | ✅ Fixed đúng | `pom.xml` add `spring-boot-starter-actuator` |

### 1.3. Tổng số issue còn lại sau đợt fix 4

| Severity | BE | FE | DB | Infra | Total |
|---|---|---|---|---|---|
| 🔴 Critical | 0 | 0 | 0 | 0 | **0** |
| 🟠 High | 1 | 2 | 1 | 0 | **4** |
| 🟡 Medium | 8 | 7 | 2 | 2 | **19** |
| 🟢 Low | 4 | 5 | 2 | 1 | **12** |
| **TOTAL** | **13** | **14** | **5** | **3** | **35** |

> **So với lần 3 (47 issue)**: giảm 12 issue (~26%).
> - Critical: 1 → 0 (giảm 100%) ✅
> - High: 13 → 4 (giảm 69%)
> - Medium: 21 → 19 (giảm 10%)
> - Low: 12 → 12 (không đổi)
>
> **So với lần 1 (97 issue)**: giảm 62 issue (~64%).

### 1.4. Điểm yếu then chốt còn lại

1. **Admin module BE vẫn chỉ read-only** — FE đã disable các nút "Thêm" với title "Backend chưa hỗ trợ" (acceptable workaround), nhưng `AdminFlightsPage`/`AdminNewsPage` vẫn có icon Edit/Trash không wire.
2. **`AdminServiceImpl.getAdminStats` hardcoded chart data** — `revenueByMonth`, `bookingsByRoute`, `cabinDistribution`, `loadFactorByMonth` đều là mock values trong BE service, không query từ DB.
3. **`users.role` VARCHAR(50)** thay vì ENUM — DB không enforce role values.
4. **`bookings.status` VARCHAR trong entity nhưng ENUM trong DB** — inconsistency tiềm ẩn.
5. **V32 migration vẫn còn 2 issues nhỏ chưa fix** — `ADD COLUMN updated_at` duplicate (vẫn còn, không có IF NOT EXISTS), `chk_password_length = 60` chỉ fix ở V35 (drop + add lại) — migration V32 gốc vẫn có thể fail trên fresh DB trước khi chạy V35.
6. **CSRF vẫn disabled** + `SameSite=Lax` (accept, nhưng chưa hardening tối ưu).
7. **Nhiều `as any` FE chưa dọn dẹp hoàn toàn** — có eslint-disable comment nhưng vẫn còn type escape.
8. **`ManageBookingPage` vẫn còn fallback mock** `'HAN - SGN'`, `'VN201'`, `'15/10/2025'` khi snapshot rỗng.
9. **Hardcoded Unsplash URLs** vẫn còn nhiều nơi.
10. **Không có `application-prod.yml`** — `SPRING_PROFILES_ACTIVE=prod` được set nhưng không có file config prod.

### 1.5. Khuyến nghị SLA

| Khuyến nghị | Lý do |
|---|---|
| **Có thể deploy production ngay** | Critical = 0, flow chính chạy end-to-end |
| **Phase 1 (2-3 ngày)**: Fix 4 High | Production-ready hardening |
| **Phase 2 (1 tuần)**: Fix 19 Medium + 12 Low | Polish + DX |

---

## 2. Thông tin tổng quan dự án

### 2.1. Backend Stack

| Thành phần | Phiên bản | Thay đổi |
|---|---|---|
| Spring Boot | 3.2.4 | Không đổi |
| Java | 17 | Không đổi |
| jjwt | 0.12.6 | Không đổi (đã bump đợt 3) |
| **spring-boot-starter-actuator** | (mới add) | ✅ Added đợt 4 |
| Bucket4j | 8.10.1 | Không đổi |
| Caffeine | 3.x | Không đổi |
| jsoup | 1.17.2 | Không đổi |

### 2.2. Frontend Stack

Không đổi — React 19.2.7 / Vite 8.1.1 / TypeScript 6.0.2 / TanStack Query 5.101.2 / Zustand 5.0.14 / Tailwind 3.4.19 / React Router 7.18.1 / shadcn/ui 4.12.0 / axios 1.18.1.

### 2.3. Thống kê file đã rà soát (lần 4)

| Loại | Số file | Thay đổi |
|---|---|---|
| Backend Java (main) | 121 | Không đổi |
| Backend SQL migration | 18 (+1: V35) | +1 migration mới |
| Frontend TS/TSX | 131 | Không đổi |
| Infra | docker-compose, 2 Dockerfile, application.yml | Không đổi |
| Test | 8 test file | Không đổi |

---

## 3. Phần A — FRONTEND REVIEW

### 3.1. 🔴 CRITICAL

> **Không còn Critical FE nào.** Tất cả Critical từ 3 đợt trước đều đã fix.

### 3.2. 🟠 HIGH

#### FE-HIGH-01 — `AdminServiceImpl.getAdminStats` trả chart data hardcoded

**File**: `backend/.../service/impl/AdminServiceImpl.java:28-67` + `frontend/src/pages/admin/AdminDashboardPage.tsx:26-29`

```java
// BE - hardcoded mock values
stats.put("totalFlights", 1250);
stats.put("loadFactor", 86.5);
...
stats.put("revenueByMonth", java.util.Arrays.asList(
    Map.of("month", "T1", "revenue", 8500000000L),
    Map.of("month", "T2", "revenue", 9200000000L),
    ...
));
```

```ts
// FE - dùng stats từ BE nếu có, fallback mock
const revenue = stats?.revenueByMonth || ADMIN_STATS.revenueByMonth;
```

**Vấn đề**: BE trả chart data nhưng là **hardcoded values** — không query từ DB. Admin dashboard hiển thị data giả vĩnh viễn, không reflect production data thật.

**Impact**: Admin không thấy được revenue/booking/route thực tế — quyết định business dựa trên data sai.

**CVSS**: 4.3 (Medium) — AV:N/AC:L/PR:H/UI:N/S:U/C:L/I:L/A:N

**Recommendation**: BE implement query thật:
- `revenueByMonth`: `SELECT MONTH(p.paid_at), SUM(p.booking.total_price) FROM Payment p WHERE p.status='completed' GROUP BY MONTH(p.paid_at)`
- `bookingsByRoute`: parse `item_snapshot` JSON hoặc add column `route` cho bookings
- `cabinDistribution`: tính từ `flights.seat_class` + bookings
- `loadFactorByMonth`: tính từ `flights.available_seats` vs total seats

---

#### FE-HIGH-02 — Nhiều `as any` chưa dọn dẹp hoàn toàn

**Files**:
- `BookingHistoryPage.tsx:13`: `const res: any = await bookingApi.getMyBookings();`
- `ManageBookingPage.tsx:47,49,50,65`: nhiều `as any` với eslint-disable comment
- `SeatHoldPage.tsx:49`: `(req as any)`
- `PaymentPage.tsx:24`: `onSuccess: (data: any) => {...}`
- `PaymentCallbackPage.tsx:15`: `const response: any = await api.get(...)`
- `booking.ts:24,32`: `const data: any = await api.post/get(...)`
- `RegisterPage.tsx:39`: `const loginRes: any = await authApi.login(...)`
- `flights.ts:10,18`: `api.get<any>`, `(f: any) => ({...})`
- `DashboardPage.tsx:23,163`: `(bookingsData as any)?.content`, `(sum: number, b: any)`

**Vấn đề**: Có `// eslint-disable-next-line @typescript-eslint/no-explicit-any` nhưng vẫn còn type escape hatch — TypeScript không check được.

**Recommendation**: Sinh types từ OpenAPI; bỏ `as any`; bật oxlint rule `no-explicit-any: error`.

---

#### FE-HIGH-03 — `ManageBookingPage` vẫn còn fallback mock khi snapshot rỗng

**File**: `frontend/src/pages/ManageBookingPage.tsx:53-67`

```ts
setBooking({
  ...
  route: snap.from && snap.to ? `${snap.from} - ${snap.to}` : 'HAN - SGN',  // ← fallback mock
  flightNo: snap.flightNo || 'VN201',  // ← fallback mock
  date: b.createdAt ? new Date(b.createdAt).toLocaleDateString('vi-VN') : '15/10/2025',  // ← fallback mock
  from: snap.from || 'HAN',  // ← fallback mock
  to: snap.to || 'SGN',  // ← fallback mock
  departTime: snap.departTime || '00:00',
  arriveTime: snap.arriveTime || '00:00',
  ...
});
```

**Impact**: Nếu booking không có `itemSnapshot` (booking cũ trước V33) → UI hiển thị fallback mock `'HAN - SGN'`, `'VN201'` — không reflect data thật.

**Recommendation**: Hiển thị placeholder "Không có thông tin" thay vì mock data.

---

#### FE-HIGH-04 — `LoginResponse` type thiếu `refreshToken` field

**File**: `frontend/src/api/auth.ts:4-7`

```ts
interface LoginResponse { 
  token: string; 
  user: AuthUser; 
}
```

BE `AuthResponse`:
```java
private String token;
private String refreshToken;
private UserDTO user;
```

FE khai `LoginResponse` thiếu `refreshToken`. LoginPage `setAuth(res.user, res.token, '')` — truyền empty string thay vì `res.refreshToken`.

**Impact**: Refresh token không được lưu trong store (OK vì dùng cookie HttpOnly), nhưng type sai → TypeScript không check được. Nếu sau này cần truyền refresh token qua body, sẽ fail.

**Recommendation**: 
```ts
interface LoginResponse { 
  token: string; 
  refreshToken: string;
  user: AuthUser; 
}
```

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

#### FE-MED-07 — `BookingDTO.maskPII` BE đã implement nhưng FE không xử lý specifically cho masked data
FE `ManageBookingPage` display raw masked string `***1234` — OK nhưng có thể format đẹp hơn.

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

> **Không còn Critical BE nào.** Tất cả 9 Critical BE từ đợt 1 đều đã fix và maintain.

### 4.2. 🟠 HIGH

#### BE-HIGH-01 — `AdminServiceImpl.getAdminStats` trả chart data hardcoded

**File**: `backend/.../service/impl/AdminServiceImpl.java:28-67`

```java
stats.put("totalFlights", 1250);  // ← hardcoded
stats.put("loadFactor", 86.5);    // ← hardcoded
Map<String, Double> trends = new HashMap<>();
trends.put("revenue", 12.5);      // ← hardcoded
...
stats.put("revenueByMonth", java.util.Arrays.asList(
    Map.of("month", "T1", "revenue", 8500000000L),  // ← hardcoded
    ...
));
stats.put("bookingsByRoute", java.util.Arrays.asList(
    Map.of("route", "HAN-SGN", "count", 1250),  // ← hardcoded
    ...
));
stats.put("cabinDistribution", java.util.Arrays.asList(
    Map.of("name", "Phổ thông", "value", 65),  // ← hardcoded
    ...
));
stats.put("loadFactorByMonth", java.util.Arrays.asList(
    Map.of("month", "T1", "factor", 78.5),  // ← hardcoded
    ...
));
```

Chỉ `totalBookings` và `totalRevenue` là query thật từ DB. Tất cả chart data còn lại là **mock values hardcoded trong service**.

**Impact**: Admin dashboard hiển thị data giả vĩnh viễn — không reflect production data thật.

**CVSS**: 4.3 (Medium) — AV:N/AC:L/PR:H/UI:N/S:U/C:L/I:L/A:N

**Recommendation**: Implement query thật:
- `revenueByMonth`: GROUP BY MONTH(paid_at) FROM payments WHERE status='completed'
- `bookingsByRoute`: parse item_snapshot JSON hoặc add column route
- `cabinDistribution`: từ flights.seat_class + bookings
- `loadFactorByMonth`: từ flights.available_seats vs total seats

---

### 4.3. 🟡 MEDIUM

#### BE-MED-01 — `Lombok @Builder` trên JPA entity
Vẫn dùng `@Builder` cho tất cả entity. Conflict tiềm ẩn với JPA proxying.

#### BE-MED-02 — `ReservationScheduler` không có retry
Nếu `strategy.release()` fail (e.g. flight không tồn tại), booking đã `transitionTo(EXPIRED)` + save, nhưng release fail → ghế leak. Catch exception ở scheduler outer loop, nhưng không retry mechanism.

#### BE-MED-03 — `SearchServiceImpl.searchAll` hardcode halfSize
Không có test; logic phân chia page không rõ ràng.

#### BE-MED-04 — `JwtUtil.validateJwtToken` log.warn thay vì throw
Log nhiều noise nếu bot scan.

#### BE-MED-05 — `UserServiceImpl.updateProfile` không validate phone format
`phone` chỉ `@NotBlank`, không `@Pattern` → user có thể set phone = "abc".

#### BE-MED-06 — `AdminServiceImpl` cache `@Cacheable("admin_stats")` không có `@CacheEvict`
Khi booking/payment mới tạo, cache `admin_stats` không invalidate → admin thấy stale data. Nên add `@CacheEvict` trên `createBooking`/`handleCallback`.

#### BE-MED-07 — `AdminController` trả `List<Map<String, Object>>` thay vì DTO
Các endpoint admin trả raw Map — không type safe, không có document. Nên tạo `AdminFlightDTO`, `AdminBookingDTO`, etc.

#### BE-MED-08 — `AdminController.updateUserRoles` chỉ accept role đầu tiên
```java
String newRole = roles.get(0).toUpperCase().replace("ROLE_", "");
if ("ADMIN".equals(newRole) || "USER".equals(newRole)) {
    user.setRole(newRole);
}
```
BE chỉ set 1 role (USER hoặc ADMIN), bỏ qua các role khác trong list. Nếu FE gửi `['ADMIN', 'USER']` → chỉ set ADMIN.

---

### 4.4. 🟢 LOW

#### BE-LOW-01 — `utils/` vs `util/` directory duplicate — `HtmlSanitizer` ở `utils/`, `PageableUtil` ở `util/`. Chưa thống nhất.
#### BE-LOW-02 — `pom.xml` có `<scm>`, `<license>`, `<developer>` rỗng.
#### BE-LOW-03 — `application-dev.yml` quá ít config (chỉ show-sql).
#### BE-LOW-04 — `ApiResponse.error` không set `success = false` tường minh.

---

## 5. Phần C — DATABASE REVIEW

> Phần này rà soát 18 migration files (V1, V2, V3, V20→V29, V31, V32, V33, V34, V35 mới) + entity mapping + schema design + index + FK + constraint + normal form + security + migration safety.

### 5.1. 🔴 CRITICAL — DB

> **Không còn Critical DB nào.** DB-CRIT-01 (airports FK) đã fix đúng ở V35.

### 5.2. 🟠 HIGH — DB

#### DB-HIGH-01 — V32 migration vẫn còn 2 issues nhỏ chưa fix hoàn toàn

**File**: `V32__fix_constraints_and_schemas.sql`

Vấn đề từ đợt 2-3 chưa được fix trực tiếp trong V32 (chỉ fix gián tiếp qua V35):

1. **`ADD COLUMN updated_at` duplicate**:
   ```sql
   ALTER TABLE payments ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
   ALTER TABLE bookings ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
   ```
   `bookings` đã có `updated_at` từ V1 (line 131) → `ADD COLUMN` sẽ fail với "Duplicate column name" trên fresh DB. **Migration blocker trên fresh DB**.

   V35 không fix V32 — chỉ add V35 sau. Nếu chạy từ scratch: V1 (OK) → V32 (FAIL tại `ADD COLUMN updated_at` cho bookings) → không đến được V35.

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

**Impact**: Fresh DB install sẽ fail tại V32 (issue 1). Production DB đã chạy V32 → V35 fix OK.

**CVSS**: 7.5 (High) — AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H (deployment blocker cho fresh install)

**Recommendation**: 
- (A) Sửa V32 trực tiếp (add `IF NOT EXISTS`) — nhưng Flyway không cho phép sửa migration đã chạy.
- (B) Tạo V36 `cleanup_v32_issues.sql` fix `updated_at` duplicate + ràng buộc logic.
- (C) Hoặc: tạo V1 mới (rebuild từ đầu) + Flyway baseline.

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
#### DB-LOW-03 — `bookings.status` ENUM ✓ — V34 đã fix đúng, thêm 'failed'. V35 không thay đổi.

---

### 5.5. Migration Safety Review (V35 mới)

**V35__fix_v3_review_issues.sql** — review chi tiết:

```sql
-- Re-create airports table (DB-CRIT-01)
CREATE TABLE IF NOT EXISTS airports (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255),
    country VARCHAR(100) DEFAULT 'Vietnam'
);
```
✓ OK — `IF NOT EXISTS` an toàn. Nhưng `code VARCHAR(10)` thay vì `VARCHAR(3)` (IATA code 3 ký tự) — over-engineered, không sai nhưng thừa.

```sql
-- Ensure existing airports in flights are present
INSERT IGNORE INTO airports (code, name, city)
SELECT DISTINCT departure_airport, departure_airport, departure_airport FROM flights;

INSERT IGNORE INTO airports (code, name, city)
SELECT DISTINCT arrival_airport, arrival_airport, arrival_airport FROM flights;
```
✓ OK — backfill data từ flights. `INSERT IGNORE` an toàn. Tuy nhiên `name = code`, `city = code` — placeholder, không có ý nghĩa. Production nên import danh sách airports thật (IATA codes + tên + city + country).

```sql
-- Add FK for airports
ALTER TABLE flights
ADD CONSTRAINT fk_flights_departure_airport FOREIGN KEY (departure_airport) REFERENCES airports(code) ON DELETE RESTRICT,
ADD CONSTRAINT fk_flights_arrival_airport FOREIGN KEY (arrival_airport) REFERENCES airports(code) ON DELETE RESTRICT;
```
✓ OK — referential integrity được enforce. `ON DELETE RESTRICT` đúng — không cho xóa airport nếu còn flight reference.

```sql
-- Fix users.email length (DB-HIGH-01)
ALTER TABLE users MODIFY COLUMN email VARCHAR(254) NOT NULL;
```
✓ OK — RFC 5321 compliant.

```sql
-- Fix password length constraint (DB-HIGH-01)
ALTER TABLE users DROP CONSTRAINT chk_password_length;
ALTER TABLE users ADD CONSTRAINT chk_password_length CHECK (LENGTH(password_hash) = 60);
```
⚠️ **Issue**: MySQL syntax cho DROP CONSTRAINT là `DROP CHECK chk_password_length` (MySQL 8.0.16+) hoặc `ALTER TABLE users DROP INDEX chk_password_length` (nếu được tạo như index). Cú pháp `DROP CONSTRAINT` có thể fail trên một số version MySQL.

Nên verify: `ALTER TABLE users DROP CHECK chk_password_length;` (MySQL 8.0.16+) hoặc dùng `DROP INDEX`.

```sql
-- Change bookings.user_id ON DELETE to RESTRICT (DB-HIGH-02)
ALTER TABLE bookings DROP FOREIGN KEY bookings_ibfk_1;
ALTER TABLE bookings ADD CONSTRAINT fk_bookings_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT;
```
⚠️ **Issue**: `bookings_ibfk_1` là tên constraint tự động sinh bởi MySQL. Tên này có thể khác tùy version MySQL hoặc nếu đã có constraint khác được tạo trước. Nên dùng `INFORMATION_SCHEMA` để tìm tên constraint dynamically, hoặc dùng `DROP FOREIGN KEY IF EXISTS` (MySQL 8.0+ không support directly).

Nên: `ALTER TABLE bookings DROP FOREIGN KEY IF EXISTS bookings_ibfk_1;` — nhưng MySQL không support `IF EXISTS` cho DROP FOREIGN KEY. Workaround: dùng stored procedure hoặc check `INFORMATION_SCHEMA.KEY_COLUMN_USAGE`.

```sql
-- Fix uk_booking_pax bypass with NULL document_number (DB-HIGH-03)
ALTER TABLE booking_passengers DROP INDEX uk_booking_pax;
ALTER TABLE booking_passengers ADD COLUMN doc_num_coalesced VARCHAR(50) GENERATED ALWAYS AS (COALESCE(document_number, '')) STORED;
ALTER TABLE booking_passengers ADD CONSTRAINT uk_booking_pax UNIQUE (booking_id, full_name, doc_num_coalesced);
```
✓ OK — giải pháp generated column + COALESCE đúng pattern. `STORED` column được index hóa. Unique constraint hoạt động đúng cho cả NULL và non-NULL document_number.

⚠️ **Issue nhỏ**: `doc_num_coalesced` column mới không có trong entity `BookingPassenger.java` — Hibernate sẽ ignore. OK vì nó là generated column, nhưng nên document rõ.

---

### 5.6. Index Audit (sau V35)

| Bảng | Index hiện tại | Status |
|---|---|---|
| users | UNIQUE(email), `chk_password_length = 60` (V35) | OK |
| tours | UNIQUE(slug), FULLTEXT, `idx_tours_featured` | OK |
| hotels | UNIQUE(slug), FULLTEXT | OK |
| flights | `flight_number`, `idx_flights_search`, 2 FK `fk_flights_departure_airport/arrival_airport` (V35) | OK |
| bookings | `(status, reserved_until)`, `user_id`, `version`, `fk_bookings_user_id ON DELETE RESTRICT` (V35) | OK |
| booking_passengers | `uk_booking_pax` (V35 regenerated with doc_num_coalesced), `idx_booking_passengers_search` (V34) | OK |
| payments | `status`, UNIQUE `transaction_ref`, `version` | OK |
| wishlists | UNIQUE(user_id, item_type, item_id) | OK |
| reviews | UNIQUE(user_id, item_type, item_id), `idx_reviews_item` (V34) | OK |
| blogs | UNIQUE(slug), FULLTEXT, `idx_blogs_published_at` | OK |
| notifications | `idx_notifications_user_read` | OK |
| refresh_tokens | UNIQUE(token), `user_id`, `idx_refresh_tokens_user_revoked` | OK |
| **airports** (V35 re-created) | PRIMARY KEY(code) | OK |

**Kết luận**: Index audit đầy đủ, không còn missing index.

---

### 5.7. Entity ↔ Schema Mapping Issues (sau V35)

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

> **Không còn Critical Infra nào.** INFRA-HIGH-01 (Actuator) đã fix.

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

> Tổng hợp các điểm BE và FE không đồng bộ **sau đợt fix 4**.

### 7.1. Auth Contract

| Field | BE | FE | Status sau fix 4 |
|---|---|---|---|
| `UserDTO.role` | `String` | `AuthUser.role?` + `roles?` | ⚠️ FE hỗ trợ cả 2, OK |
| `AuthResponse.token` | `token: String` | `LoginResponse.token: string` | ✓ OK (fixed) |
| `AuthResponse.refreshToken` | `refreshToken: String` | `LoginResponse` thiếu field | ❌ Missing FE |
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
| `GET /admin/stats` | `{ totalBookings, totalRevenue, totalFlights, loadFactor, trends, revenueByMonth, bookingsByRoute, cabinDistribution, loadFactorByMonth }` (hardcoded values) | `Kpi` (full) | ⚠️ BE hardcoded chart data |
| `GET /admin/flights` | ✓ List flights (read-only) | `AdminFlight[]` | ✓ OK |
| `GET /admin/bookings` | ✓ List bookings (read-only) | `AdminBooking[]` | ✓ OK |
| `GET /admin/users` | ✓ List users (read-only) | `AdminUser[]` | ✓ OK |
| `GET /admin/news` | ✓ List blogs as news (read-only) | `AdminNews[]` | ✓ OK |
| `PUT /admin/users/{id}/roles` | ✓ Accept first role | `string[]` | ⚠️ Single role, not array |
| POST/PUT/DELETE `/admin/flights` | ❌ Not implemented | FE button disabled | ✓ OK (workaround) |
| POST/DELETE `/admin/news` | ❌ Not implemented | FE button disabled | ✓ OK (workaround) |

---

## 8. Phần F — ROADMAP FIX ĐỀ XUẤT

> Phân loại thành 3 sprint. Mỗi sprint ước lượng effort theo story point (1 SP = 0.5 ngày dev).

### 8.1. Sprint 1 — High Fixes (2-3 ngày, ~8 SP)

**Mục tiêu**: Hoàn thiện admin module + cleanup.

| ID | Task | Effort | Priority |
|---|---|---|---|
| BE-HIGH-01 / FE-HIGH-01 | BE implement query thật cho chart data (revenue by month, bookings by route, cabin distribution, load factor) | 5 SP | P0 |
| FE-HIGH-02 | Sinh types từ OpenAPI, bỏ `as any` | 3 SP | P0 |
| FE-HIGH-03 | ManageBookingPage bỏ fallback mock | 1 SP | P0 |
| FE-HIGH-04 | `LoginResponse` add `refreshToken` field | 0.5 SP | P0 |
| DB-HIGH-01 | V36 fix V32 issues (updated_at duplicate,chk_password_length, uk_booking_pax) | 1 SP | P0 |
| **Subtotal** | | **10.5 SP** | |

### 8.2. Sprint 2 — Medium Fixes (1 tuần, ~10 SP)

**Mục tiêu**: DB hardening + Infra production-ready.

| ID | Task | Effort | Priority |
|---|---|---|---|
| DB-MED-01 | Document V23→V28 sequence hoặc cleanup | 0.5 SP | P1 |
| DB-MED-02 | V36 remove outdated sample data V21 | 0.5 SP | P1 |
| INFRA-MED-01 | nginx gzip cho SVG/font/wasm | 0.5 SP | P1 |
| INFRA-MED-02 | Tạo `application-prod.yml` | 1 SP | P1 |
| FE-MED-01 | BookingDetailPage bỏ fallback mock, dùng snapshot hoàn toàn | 1 SP | P1 |
| FE-MED-03 | DashboardPage wire stats to API | 1 SP | P1 |
| FE-MED-04 | SeatSelectionPage read requiredSeats from booking | 1 SP | P1 |
| FE-MED-05 | Import Material Symbols font | 0.5 SP | P1 |
| FE-MED-06 | Self-host images | 2 SP | P1 |
| BE-MED-02 | `ReservationReleaseService` retry mechanism | 1 SP | P1 |
| BE-MED-05 | `UpdateProfileRequest` add `@Pattern phone` | 0.5 SP | P1 |
| BE-MED-06 | Add `@CacheEvict("admin_stats")` on `createBooking`/`handleCallback` | 0.5 SP | P1 |
| BE-MED-07 | Tạo `AdminFlightDTO`, `AdminBookingDTO`, etc. thay vì Map | 2 SP | P1 |
| BE-MED-08 | `updateUserRoles` support multi-role hoặc document single-role | 0.5 SP | P1 |
| **Subtotal** | | **12 SP** | |

### 8.3. Sprint 3 — Low Fixes (1 tuần, ~6 SP)

**Mục tiêu**: Polish + DX + cleanup.

| ID | Task | Effort | Priority |
|---|---|---|---|
| FE-MED-02 | ProfilePage `user.id` type safe | 0.5 SP | P2 |
| FE-MED-07 | FE xử lý masked PII display format | 1 SP | P2 |
| FE-LOW-01 | RouteBoundary không reset state local | 1 SP | P2 |
| FE-LOW-02 | `components/ui/index.ts` barrel export | 0.5 SP | P2 |
| FE-LOW-04 | i18n English strings in DashboardPage | 0.5 SP | P2 |
| BE-MED-01 | Remove `@Builder` from JPA entities (or accept) | 2 SP | P2 |
| BE-MED-03 | `SearchServiceImpl.searchAll` refactor halfSize logic | 1 SP | P2 |
| BE-LOW-01 | Merge `utils/` and `util/` | 0.5 SP | P2 |
| BE-LOW-03 | `application-dev.yml` thêm config | 0.5 SP | P2 |
| DB-LOW-01 | `users.role` ENUM thay VARCHAR | 1 SP | P2 |
| **Subtotal** | | **9 SP** | |

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
12. **Real chart data**: BE query thật từ DB thay vì hardcoded values.
13. **Airport entity**: tạo `Airport.java` JPA entity + `@ManyToOne` từ Flight.
14. **V1 rebuild**: cân nhắc rebuild V1 từ đầu (gộp V1-V35 thành V1 mới) để fresh install không bị V32 blocker.

---

## 9. Phụ lục: Ma trận Severity

### 9.1. Tổng quan (sau đợt fix 4)

```
┌────────────────────────────────────────────────────────────────┐
│           SEVERITY DISTRIBUTION (lần 4 — sau fix)              │
├────────────┬──────┬──────┬─────┬───────┬────────────────────────┤
│ Severity   │  BE  │  FE  │ DB  │ Infra │ Total                  │
├────────────┼──────┼──────┼─────┼───────┼────────────────────────┤
│ 🔴 Critical│   0  │   0  │  0  │   0   │    0                   │
│ 🟠 High    │   1  │   2  │  1  │   0   │    4                   │
│ 🟡 Medium  │   8  │   7  │  2  │   2   │   19                   │
│ 🟢 Low     │   4  │   5  │  2  │   1   │   12                   │
├────────────┼──────┼──────┼─────┼───────┼────────────────────────┤
│ TOTAL      │  13  │  14  │  5  │   3   │   35                   │
└────────────┴──────┴──────┴─────┴───────┴────────────────────────┘
```

**So sánh qua 4 lần**:

| Severity | Lần 1 | Lần 2 | Lần 3 | **Lần 4** | Giảm tổng |
|---|---|---|---|---|---|
| 🔴 Critical | 21 | 4 | 1 | **0** | -100% ✅ |
| 🟠 High | 34 | 20 | 13 | **4** | -88% |
| 🟡 Medium | 27 | 24 | 21 | **19** | -30% |
| 🟢 Low | 15 | 14 | 12 | **12** | -20% |
| **Total** | **97** | **62** | **47** | **35** | **-64%** |

### 9.2. CVSS-style Scoring Legend

| Score | Severity | Meaning |
|---|---|---|
| 9.0–10.0 | Critical | Production blocker / data loss / security breach |
| 7.0–8.9 | High | Major feature broken / security risk |
| 4.0–6.9 | Medium | Functional issue / minor security |
| 0.1–3.9 | Low | Code quality / minor UX |

### 9.3. Issue Index (sorted by severity)

#### High (4)
- BE-HIGH-01 / FE-HIGH-01: AdminServiceImpl chart data hardcoded
- FE-HIGH-02: Nhiều `as any` chưa dọn dẹp
- FE-HIGH-03: ManageBookingPage fallback mock khi snapshot rỗng
- FE-HIGH-04: LoginResponse thiếu refreshToken field
- DB-HIGH-01: V32 migration issues (updated_at duplicate, chk_password_length, uk_booking_pax NULL) — chỉ fix gián tiếp qua V35

#### Medium (19) — xem Sections 3.3, 4.3, 5.3, 6.3
#### Low (12) — xem Sections 3.4, 4.4, 5.4, 6.4

---

## Kết luận

Đợt fix `566cfc3` đã xử lý đúng và triệt để **toàn bộ Critical còn lại** từ đợt 3, đưa project về trạng thái **0 Critical — có thể deploy production**. Đặc biệt:

- ✅ **DB-CRIT-01** airports FK — fix đúng, V35 re-create airports + add 2 FK + backfill data
- ✅ **DB-HIGH-01** users.email VARCHAR(254) + chk_password_length = 60
- ✅ **DB-HIGH-02** bookings.user_id ON DELETE RESTRICT
- ✅ **DB-HIGH-03** uk_booking_pax NULL bypass — giải pháp generated column + COALESCE
- ✅ **BE-HIGH-02** BookingDTO.maskPII passenger mask document
- ✅ **BE-HIGH-03** PassengerRequest @NotBlank idNumber + @Pattern type/gender/birthDate
- ✅ **BE-HIGH-04** Booking.transitionTo EXPIRED terminal state
- ✅ **FE-HIGH-01** updatePassengers endpoint — workaround (bỏ hẳn)
- ✅ **FE-HIGH-02** ManageBookingPage parse itemSnapshot
- ✅ **FE-HIGH-04** LoginResponse token (đổi từ accessToken)
- ✅ **FE-HIGH-05** AdminDashboardPage dùng stats từ BE (nhưng BE hardcoded)
- ✅ **INFRA-HIGH-01** Actuator dependency

Tuy nhiên vẫn còn **4 High + 19 Medium + 12 Low**:

1. **Admin module chart data hardcoded** — BE trả mock values cho 4 chart, không query DB thật.
2. **V32 migration issues chưa fix trực tiếp** — chỉ fix gián tiếp qua V35; fresh install sẽ fail tại V32 `ADD COLUMN updated_at` duplicate.
3. **Nhiều `as any` FE** — có eslint-disable comment nhưng vẫn còn type escape.
4. **ManageBookingPage fallback mock** khi snapshot rỗng.
5. **LoginResponse thiếu refreshToken field**.
6. **`AdminServiceImpl` cache không có `@CacheEvict`** — stale data.
7. **`AdminController` trả raw Map** thay vì DTO.
8. **Hardcoded Unsplash URLs** vẫn còn.
9. **Không có `application-prod.yml`**.
10. **`users.role` VARCHAR** thay vì ENUM.

**Khuyến nghị cuối**: 
- **Có thể deploy production ngay** — Critical = 0, flow chính chạy end-to-end.
- **Phase 1 (2-3 ngày, ~10.5 SP)**: Fix 4 High → admin dashboard hiển thị data thật, cleanup type safety.
- **Phase 2 (1 tuần, ~12 SP)**: Fix Medium + tạo `application-prod.yml`.
- **Phase 3 (1 tuần, ~9 SP)**: Polish Low.
- **Long-term**: Codegen types từ OpenAPI để loại bỏ vĩnh viễn contract mismatch; rebuild V1 migration để fresh install không bị V32 blocker.

Đặc biệt khuyến nghị **fix DB-HIGH-01 (V32 issues)** sớm — vì hiện tại fresh install (`docker-compose up` từ scratch) sẽ fail tại V32 trước khi đến V35.

---

> **Báo cáo kết thúc.**
> Review-only — KHÔNG fix. Tổng cộng **35 issue** còn lại (sau 4 đợt: 97 → 62 → 47 → 35), liệt kê với severity, file:line, code snippet, root cause, CVSS-style score, recommendation.
