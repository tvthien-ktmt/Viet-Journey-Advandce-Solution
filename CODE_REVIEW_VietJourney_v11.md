# BÁO CÁO REVIEW TOÀN DIỆN CODE (LẦN 11) — VietJourney Advance Solution

> **Repository**: `https://github.com/tvthien-ktmt/Viet-Journey-Advandce-Solution`
> **Commit reviewed**: `6cf127f` — *"thay đổi backend từ java sang nodejs"*
> **Ngày review**: 2026-07-10 (đợt 11)
> **Phạm vi**: Toàn bộ source code (FE + BE Node.js + DB Prisma + Infra) — **đợt 2 của Node.js rewrite**
> **Mức độ**: Kỹ thuật chuyên sâu, rà soát từng file
> **Loại**: Review-only, KHÔNG fix

---

## MỤC LỤC

1. [Executive Summary](#1-executive-summary)
2. [Thông tin tổng quan dự án](#2-thông-tin-tổng-quan-dự-án)
3. [Phần A — FRONTEND REVIEW](#3-phần-a--frontend-review)
4. [Phần B — BACKEND REVIEW (Node.js)](#4-phần-b--backend-review-nodejs)
5. [Phần C — DATABASE REVIEW (Prisma)](#5-phần-c--database-review-prisma)
6. [Phần D — INFRA & DEVOPS REVIEW](#6-phần-d--infra--devops-review)
7. [Phần E — CONTRACT MISMATCH BE ↔ FE](#7-phần-e--contract-mismatch-be--fe)
8. [Phần F — ROADMAP FIX ĐỀ XUẤT](#8-phần-f--roadmap-fix-đề-xuất)
9. [Phụ lục: Ma trận Severity](#9-phụ-lục-ma-trận-severity)

---

## 1. Executive Summary

### 1.1. Bối cảnh

Đợt 10 review Node.js BE mới tìm thấy 47 issue (17 Critical). Đợt 11 này review lại sau khi team fix. **Tiến độ rất ấn tượng** — 15/17 Critical đã fix, 12/14 High đã fix.

### 1.2. Đánh giá đợt fix

| Hạng mục fix (từ đợt 10) | Trạng thái | Đánh giá |
|---|---|---|
| **BE-CRIT-01** docker-compose env vars | ✅ Fixed | `DATABASE_URL=mysql://...` thay `SPRING_*` |
| **BE-CRIT-02** Healthcheck | ✅ Fixed | `/api/health` thay `/actuator/health` |
| **BE-CRIT-03** `/auth/me` | ✅ Fixed | Added `getMe` endpoint |
| **BE-CRIT-04** `/auth/refresh` | ✅ Fixed | Added với cookie + body support, DB-backed token rotation |
| **BE-CRIT-05** `/auth/logout` | ✅ Fixed | Added, clear cookies + delete refresh token |
| **BE-CRIT-06** Payment endpoint | ✅ Fixed | `POST /payments/create` |
| **BE-CRIT-07** `GET /bookings/:id` | ✅ Fixed | Added `getBookingById` |
| **BE-CRIT-08** `GET /bookings/search` | ✅ Fixed | Added `searchBookings` |
| **BE-CRIT-09** Auth response | ✅ Fixed | `refreshToken`, `roles: [role]`, `id: String(id)` |
| **BE-CRIT-10** Cookie auth | ✅ Fixed | Read both Bearer header AND `req.cookies.jwt` |
| **BE-CRIT-11** VNPay HMAC-SHA512 | ✅ Fixed | Real HMAC-SHA512 + IPN signature verify + amount check |
| **BE-CRIT-12** Dead .js files | ✅ Fixed | 0 .js files (removed 17) |
| **DB-CRIT-01** Float → Decimal | ✅ Fixed | `@db.Decimal(15, 2)` cho tất cả monetary fields |
| **DB-CRIT-02** No migration | ⚠️ Partial | `start:prod` runs `prisma migrate deploy` nhưng không có `prisma/migrations/` dir → sẽ fail |
| **INFRA-CRIT-01/02/03** docker-compose + Dockerfile | ✅ Fixed | `DATABASE_URL`, healthcheck `/api/health`, Dockerfile CMD `start:prod` |
| **BE-HIGH-01** CORS | ✅ Fixed | `origin: process.env.CORS_ORIGIN`, `credentials: true` |
| **BE-HIGH-02** JWT_SECRET | ✅ Fixed | Throws error if not set |
| **BE-HIGH-03** Input validation | ⚠️ Partial | `zod` in dependencies nhưng không dùng trong controllers |
| **BE-HIGH-04** Rate limiting | ✅ Fixed | `express-rate-limit` 100 req/15min |
| **BE-HIGH-05** Booking inventory | ✅ Fixed | Check `seatsLeft`, decrement in `$transaction` |
| **BE-HIGH-06** Scheduled tasks | ✅ Fixed | `node-cron` mỗi phút, expire booking + restore seats |
| **BE-HIGH-07** Error handler | ✅ Fixed | `globalErrorHandler` middleware với Prisma error handling |
| **BE-HIGH-08** Blog `/slug/:slug` | ✅ Fixed | Added `getBlogBySlug` |
| **BE-HIGH-09** Status enums | ✅ Fixed | `BookingStatus` + `PaymentStatus` enums trong Prisma |
| **BE-HIGH-10** Booking fields | ✅ Fixed | `itemSnapshot Json?`, `contactEmail`, `contactPhone` |

**New additions (không có trong đợt 10):**
- `helmet` security headers
- `cookie-parser` cho cookie auth
- `.env.example` 
- `lotusmilesTier`, `lotusmilesMiles`, `failedLoginCount`, `lockedUntil` trong User model
- `slug` field cho Blog
- `hotelId`, `flightId` cho Review model
- Indexes: `@@index([from, to, departTime])` Flight, `@@index([userId, status])` Booking, `@@index([transactionId])` Payment, `@@index([userId, isRead])` Notification
- Admin endpoints: `/admin/users`, `/admin/bookings`, `/admin/flights`
- Tour pagination: `{ content, totalElements }`
- Flight search filter by `departDate`
- Reservation cron restores flight inventory

### 1.3. Tổng số issue còn lại

| Severity | BE | FE | DB | Infra | Total |
|---|---|---|---|---|---|
| 🔴 Critical | 0 | 3 | 1 | 0 | **4** |
| 🟠 High | 5 | 1 | 0 | 0 | **6** |
| 🟡 Medium | 5 | 1 | 0 | 1 | **7** |
| 🟢 Low | 2 | 1 | 0 | 0 | **3** |
| **TOTAL** | **12** | **6** | **1** | **1** | **20** |

> **So với đợt 10 (47 issue)**: giảm 27 issue (~57%).
> - Critical: 17 → 4 (giảm 76%)
> - High: 14 → 6 (giảm 57%)
> - Medium: 11 → 7 (giảm 36%)
> - Low: 5 → 3 (giảm 40%)

### 1.4. Điểm yếu then chốt còn lại

1. **FE-BE Flight search contract mismatch** — FE gọi `GET /flights` với params `departureAirport, arrivalAirport, departureTime`, BE có `GET /flights/search` với params `from, to, departDate`. FE expect `Page<FlightDTO>`, BE trả `{ outbound: flights }`.
2. **FE-BE Flight entity field names mismatch** — BE `Flight` model: `flightNo, from, to, airline, priceVND, seatsLeft`. FE `FlightDTO`: `flightNumber, departureAirport, arrivalAirport, price, availableSeats`.
3. **FE-BE Booking creation contract mismatch** — FE gửi `{ bookingType, referenceId, passengers }`, BE expect `{ bookingType, totalPrice, tourId/hotelId/flightId, passengers, contactEmail, contactPhone, itemSnapshot }`.
4. **`getMe` response không có `{ success, data }` wrapper** — FE interceptor extract `r.data.data` nhưng `getMe` trả raw object.
5. **`getMyBookings` response không paginate** — BE trả array, FE expect `{ content: [] }`.
6. **Admin contract mismatch** — FE gọi `/admin/stats`, BE có `/admin/dashboard`. FE gọi `/admin/news`, BE không có. FE gọi `PUT /admin/users/:id/roles`, BE không có.
7. **Không Prisma migration files** — `prisma migrate deploy` sẽ fail.
8. **Mass assignment vulnerability** — `updateBlog`, `createFlight`, `updateFlight` spread raw `req.body` to Prisma.
9. **zod installed but not used** — không có validation thực tế.
10. **Redis in docker-compose but not used by BE**.

---

## 2. Thông tin tổng quan dự án

### 2.1. Backend Stack (Node.js)

| Thành phần | Phiên bản | Thay đổi từ đợt 10 |
|---|---|---|
| Express | 5.2.1 | Không đổi |
| TypeScript | 7.0.2 | Không đổi |
| Prisma | 5.22.0 | Không đổi |
| jsonwebtoken | 9.0.3 | Không đổi |
| bcryptjs | 3.0.3 | Không đổi |
| **helmet** | 8.2.0 | ✅ Mới add |
| **cookie-parser** | 1.4.7 | ✅ Mới add |
| **express-rate-limit** | 8.5.2 | ✅ Mới add |
| **node-cron** | 4.6.0 | ✅ Mới add |
| **zod** | 4.4.3 | ✅ Mới add (chưa dùng) |
| **qs** | 6.15.3 | ✅ Mới add (VNPay) |

### 2.2. Frontend Stack

Không đổi — React 19.2.7 / Vite 8.1.1 / TypeScript 6.0.2 / TanStack Query 5.101.2 / Zustand 5.0.14.

### 2.3. Thống kê file

| Loại | Số file | Thay đổi |
|---|---|---|
| Backend TS | 33 (+2: `reservation.cron.ts`, `errorHandler.middleware.ts`) | +2 file, -17 .js dead code |
| Backend Prisma | 1 (275 dòng, +36 dòng) | Expanded schema |
| Frontend TS/TSX | 130 | Không đổi |
| Infra | docker-compose (fixed), Dockerfile (fixed) | Sửa 2 file |

---

## 3. Phần A — FRONTEND REVIEW

### 3.1. 🔴 CRITICAL

#### FE-CRIT-01 — Flight search contract mismatch hoàn toàn

**File**: `frontend/src/api/flights.ts:10` vs `backend/src/routes/flight.routes.ts`

FE gọi:
```ts
api.get<FlightResponse>('/flights', { 
  params: { departureAirport: req.from, arrivalAirport: req.to, departureTime: ... } }
);
// Expect: { content: FlightDTO[], totalElements, totalPages }
```

BE có:
```ts
router.get('/search', controller.searchFlights);
// Trả: { success: true, data: { outbound: flights, request: req.query } }
```

**3 vấn đề**:
1. URL: FE gọi `/flights`, BE route là `/flights/search` (FE `/flights` sẽ match `/:id` với `id="search"` → 404)
2. Params: FE gửi `departureAirport, arrivalAirport, departureTime`, BE đọc `from, to, departDate`
3. Response: FE expect `Page<FlightDTO>` (`{ content: [...] }`), BE trả `{ outbound: [...] }`

---

#### FE-CRIT-02 — Flight entity field names mismatch

**File**: `frontend/src/api/flights.ts:8-19` vs `backend/prisma/schema.prisma:149-171`

| BE `Flight` model | FE `FlightDTO` interface | Match? |
|---|---|---|
| `flightNo` | `flightNumber` | ❌ |
| `from` | `departureAirport` | ❌ |
| `to` | `arrivalAirport` | ❌ |
| `airline` | `airlineCode` | ❌ |
| `priceVND` (Decimal) | `price` (number) | ❌ |
| `seatsLeft` | `availableSeats` | ❌ |
| `cabin` | `seatClass` | ❌ |
| `departTime` (DateTime) | `departureTime` (string) | ❌ |
| `arriveTime` (DateTime) | `arrivalTime` (string) | ❌ |

**Tất cả field names khác nhau** — FE map sẽ không work, data sẽ undefined.

---

#### FE-CRIT-03 — Booking creation contract mismatch

**File**: `frontend/src/api/booking.ts:14-18` vs `backend/src/controllers/booking.controller.ts:88`

FE gửi:
```ts
interface CreateBookingRequest {
  bookingType: string;
  referenceId: number;
  passengers?: { type, fullName, gender, dateOfBirth }[];
}
```

BE expect:
```ts
const { bookingType, totalPrice, tourId, hotelId, flightId, passengers, contactEmail, contactPhone, itemSnapshot } = req.body;
```

FE gửi `referenceId`, BE không đọc. BE cần `totalPrice`, `tourId/hotelId/flightId`, `contactEmail`, `contactPhone`, `itemSnapshot` — FE không gửi. Booking sẽ tạo với `totalPrice=undefined`.

---

### 3.2. 🟠 HIGH

#### FE-HIGH-01 — `getMyBookings` response format mismatch

**File**: `frontend/src/api/booking.ts:38` vs `backend/src/controllers/booking.controller.ts:14`

FE expect:
```ts
api.get<{ content: FlightBooking[] }>(`/bookings/my-bookings`, ...)
// Then: res.content || []
```

BE trả:
```ts
res.json({ success: true, data: bookings }); // bookings is array, not { content: [...] }
```

FE interceptor extract `r.data.data` → gets array. Then `res.content` → `undefined`. FE sẽ hiển thị 0 bookings.

---

### 3.3. 🟡 MEDIUM

#### FE-MED-01 — Admin contract mismatch

FE gọi | BE có | Status
---|---|---
`GET /admin/stats` | `GET /admin/dashboard` | ❌ URL mismatch
`GET /admin/news` | ❌ Không có | ❌ 404
`PUT /admin/users/:id/roles` | ❌ Không có | ❌ 404

---

### 3.4. 🟢 LOW

#### FE-LOW-01 — Dead mock imports trong `booking.ts`

Vẫn còn `import { mockCreateHold, ... } from './mocks/booking'` (từ đợt 9, chưa fix).

---

## 4. Phần B — BACKEND REVIEW (Node.js)

### 4.1. 🔴 CRITICAL

#### BE-CRIT-01 — `getMe` response không có `{ success, data }` wrapper

**File**: `backend/src/controllers/auth.controller.ts:135-141`

```ts
res.json({
    id: String(user.id),
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    roles: [user.role]
});
```

FE interceptor: `r.data?.success !== undefined ? r.data.data : r.data` — vì `getMe` không có `success` field, interceptor trả raw object. Nhưng `authApi.me()` gọi `api.get<AuthUser>('/auth/me')` → interceptor trả `r.data` (toàn bộ response body = user object). Có thể work nhưng inconsistent với tất cả endpoint khác.

**Recommendation**: Wrap trong `{ success: true, data: { ... } }`.

---

### 4.2. 🟠 HIGH

#### BE-HIGH-01 — Mass assignment vulnerability trong `updateBlog`, `createFlight`, `updateFlight`

**File**: `backend/src/controllers/blog.controller.ts:67-69`, `flight.controller.ts:59-64, 78-85`

```ts
// blog
prisma.blog.update({ where: { id }, data }); // ← raw req.body

// flight create
prisma.flight.create({ data: { ...data, ... } }); // ← spread raw req.body

// flight update
prisma.flight.update({ data: { ...data, ... } }); // ← spread raw req.body
```

User có thể gửi `createdAt`, `id`, hoặc bất kỳ field nào → overwrite data.

**Recommendation**: Whitelist fields explicitly.

---

#### BE-HIGH-02 — `zod` installed but not used

`zod` trong `package.json` nhưng không import hay dùng trong bất kỳ controller nào. Không có input validation thực tế.

---

#### BE-HIGH-03 — `createPaymentUrl` không check booking ownership

**File**: `backend/src/controllers/payment.controller.ts:23-25`

```ts
export const createPaymentUrl = async (req: AuthRequest, res: Response) => {
    const { bookingId } = req.body;
    // ← không check booking.userId === req.user.id
```

Bất kỳ user nào có `bookingId` có thể tạo payment URL cho booking của người khác.

---

#### BE-HIGH-04 — `createBooking` không validate `bookingType` hoặc existence của tour/hotel

**File**: `backend/src/controllers/booking.controller.ts:88`

BE chỉ check flight existence. Không check tour/hotel existence. Có thể tạo booking với `tourId=99999` (không tồn tại).

---

#### BE-HIGH-05 — `searchBookings` không implement `lastName` filter

**File**: `backend/src/controllers/booking.controller.ts:52-77`

FE gửi `code, lastName` nhưng BE chỉ filter by `bookingCode` và `email` (không `lastName`). Comment says `lastName` but code doesn't use it.

---

### 4.3. 🟡 MEDIUM

#### BE-MED-01 — `getMyBookings` không paginate
BE trả array, FE expect `{ content: [], totalElements, totalPages }`.

#### BE-MED-02 — Upload controller vẫn là mock
Trả `https://via.placeholder.com/600x400`.

#### BE-MED-03 — `updateBlog` không update `slug`
`createBlog` auto-generate slug, nhưng `updateBlog` truyền raw `data` — nếu đổi title, slug không update.

#### BE-MED-04 — Hotel controller không paginate
BE trả array, FE expect `{ content: [], totalElements }`.

#### BE-MED-05 — `register` không có try-catch
Nếu Prisma throw (e.g. duplicate email), error sẽ đi tới `globalErrorHandler` — OK, nhưng message sẽ là raw Prisma error, không user-friendly.

---

### 4.4. 🟢 LOW

#### BE-LOW-01 — `console.log` trong `index.ts:74`
OK cho dev, nên dùng logger cho prod.

#### BE-LOW-02 — `tsconfig.json` target `es2016`
Nên dùng `es2022` cho Node.js 18.

---

## 5. Phần C — DATABASE REVIEW (Prisma)

### 5.1. 🔴 CRITICAL

#### DB-CRIT-01 — Không có Prisma migration files

**File**: `backend/prisma/` — chỉ có `schema.prisma`, không có `migrations/` directory.

`package.json` script `start:prod` chạy `npx prisma migrate deploy` — sẽ fail nếu không có migration files. Cần chạy `npx prisma migrate dev --name init` để tạo migration đầu tiên.

---

### 5.2. 🟠 HIGH / 🟡 MEDIUM / 🟢 LOW

> Không có issue DB nào khác. Prisma schema đã được thiết kế tốt:
> - ✅ `Decimal(15,2)` cho tất cả monetary fields
> - ✅ Enums cho `Role`, `BookingStatus`, `PaymentStatus`
> - ✅ Indexes cho query patterns (`@@index([from, to, departTime])`, `@@index([userId, status])`, `@@index([transactionId])`, `@@index([userId, isRead])`)
> - ✅ Relations đầy đủ với `onDelete: Cascade` cho child entities
> - ✅ `itemSnapshot Json?` cho booking
> - ✅ `contactEmail`, `contactPhone` cho booking
> - ✅ `slug` cho Blog
> - ✅ `lotusmilesTier`, `lotusmilesMiles` cho User
> - ✅ `hotelId`, `flightId` cho Review

---

## 6. Phần D — INFRA & DEVOPS REVIEW

### 6.1. 🔴 CRITICAL

> Không còn Critical Infra.

### 6.2. 🟠 HIGH

> Không còn High Infra.

### 6.3. 🟡 MEDIUM

#### INFRA-MED-01 — Redis trong docker-compose nhưng BE không dùng

Redis service chạy, BE không connect. Waste resources. Nên remove hoặc implement Redis usage (cache, rate limit, session).

---

### 6.4. 🟢 LOW

> Không có.

---

## 7. Phần E — CONTRACT MISMATCH BE ↔ FE

### 7.1. Auth Contract

| Endpoint | FE gọi | BE có | Status |
|---|---|---|---|
| Login | `POST /auth/login` | `POST /auth/login` | ✓ OK |
| Register | `POST /auth/register` | `POST /auth/register` | ✓ OK |
| Get me | `GET /auth/me` | `GET /auth/me` | ⚠️ Response format mismatch |
| Refresh | `POST /auth/refresh` | `POST /auth/refresh` | ✓ OK |
| Logout | (FE không gọi BE) | `POST /auth/logout` | ✓ OK |
| Token delivery | Cookie + Bearer | Cookie + Bearer | ✓ OK |
| Response `refreshToken` | Expected | Returned | ✓ OK |
| Response `user.id` | `string` | `String(id)` | ✓ OK |
| Response `user.roles` | `string[]` | `[role]` | ✓ OK |

### 7.2. Flight Search Contract

| Aspect | FE | BE | Status |
|---|---|---|---|
| URL | `GET /flights` | `GET /flights/search` | 🔴 Mismatch |
| Params | `departureAirport, arrivalAirport, departureTime` | `from, to, departDate` | 🔴 Mismatch |
| Response | `{ content: FlightDTO[] }` | `{ outbound: Flight[] }` | 🔴 Mismatch |

### 7.3. Flight Entity Contract

| BE `Flight` model | FE `FlightDTO` | Match? |
|---|---|---|
| `flightNo` | `flightNumber` | ❌ |
| `from` | `departureAirport` | ❌ |
| `to` | `arrivalAirport` | ❌ |
| `airline` | `airlineCode` | ❌ |
| `priceVND` (Decimal) | `price` (number) | ❌ |
| `seatsLeft` | `availableSeats` | ❌ |
| `cabin` | `seatClass` | ❌ |
| `departTime` (DateTime) | `departureTime` (string) | ❌ |
| `arriveTime` (DateTime) | `arrivalTime` (string) | ❌ |

### 7.4. Booking Contract

| Aspect | FE | BE | Status |
|---|---|---|---|
| Create body | `{ bookingType, referenceId, passengers }` | `{ bookingType, totalPrice, tourId/hotelId/flightId, contactEmail, contactPhone, itemSnapshot, passengers }` | 🔴 Mismatch |
| My bookings response | `{ content: FlightBooking[] }` | `{ data: Booking[] }` (array) | 🔴 Mismatch |
| Search params | `code, lastName` | `code, email` | ⚠️ Mismatch |

### 7.5. Admin Contract

| FE gọi | BE có | Status |
|---|---|---|
| `GET /admin/stats` | `GET /admin/dashboard` | 🔴 URL mismatch |
| `GET /admin/flights` | `GET /admin/flights` | ✓ OK |
| `GET /admin/bookings` | `GET /admin/bookings` | ✓ OK |
| `GET /admin/users` | `GET /admin/users` | ✓ OK |
| `GET /admin/news` | ❌ Không có | 🔴 404 |
| `PUT /admin/users/:id/roles` | ❌ Không có | 🔴 404 |

### 7.6. Blog Contract

| FE gọi | BE có | Status |
|---|---|---|
| `GET /blogs` | `GET /blogs` | ✓ OK |
| `GET /blogs/slug/:slug` | `GET /blogs/slug/:slug` | ✓ OK |

---

## 8. Phần F — ROADMAP FIX ĐỀ XUẤT

### 8.1. Sprint 1 — Critical + High (3-5 ngày, ~20 SP)

| ID | Task | Effort | Priority |
|---|---|---|---|
| FE-CRIT-01 | Fix flight search: FE dùng `/flights/search` + params `from, to, departDate` + response `{ outbound }` | 2 SP | P0 |
| FE-CRIT-02 | Fix FlightDTO field names match BE model (`flightNo, from, to, airline, priceVND, seatsLeft, cabin, departTime, arriveTime`) | 2 SP | P0 |
| FE-CRIT-03 | Fix CreateBookingRequest match BE body (`tourId/hotelId/flightId, totalPrice, contactEmail, contactPhone, itemSnapshot`) | 2 SP | P0 |
| BE-CRIT-01 | `getMe` wrap response trong `{ success: true, data: {...} }` | 0.5 SP | P0 |
| DB-CRIT-01 | Chạy `prisma migrate dev --name init` để tạo migration files | 1 SP | P0 |
| BE-HIGH-01 | Whitelist fields trong `updateBlog`, `createFlight`, `updateFlight` | 1 SP | P0 |
| BE-HIGH-02 | Implement zod validation schemas cho auth, booking, tour, etc. | 3 SP | P0 |
| BE-HIGH-03 | `createPaymentUrl` check booking ownership | 0.5 SP | P0 |
| BE-HIGH-04 | `createBooking` validate tour/hotel existence | 1 SP | P0 |
| BE-HIGH-05 | `searchBookings` implement `lastName` filter (query passengers) | 1 SP | P0 |
| FE-HIGH-01 | `getMyBookings` handle BE array response (hoặc BE paginate) | 1 SP | P0 |
| FE-MED-01 | Fix admin endpoints: `/admin/stats` → `/admin/dashboard`, add `/admin/news`, `PUT /admin/users/:id/roles` | 3 SP | P0 |
| **Subtotal** | | **18 SP** | |

### 8.2. Sprint 2 — Medium + Low (1 tuần, ~8 SP)

| ID | Task | Effort | Priority |
|---|---|---|---|
| BE-MED-01 | `getMyBookings` add pagination | 1 SP | P1 |
| BE-MED-02 | Implement real file upload (multer) | 2 SP | P1 |
| BE-MED-03 | `updateBlog` auto-regenerate slug on title change | 0.5 SP | P1 |
| BE-MED-04 | Hotel controller add pagination | 1 SP | P1 |
| BE-MED-05 | `register` wrap trong try-catch với user-friendly error | 0.5 SP | P1 |
| INFRA-MED-01 | Remove Redis hoặc implement Redis usage | 1 SP | P1 |
| FE-LOW-01 | Remove dead mock imports | 0.1 SP | P1 |
| BE-LOW-01/02 | Logger + tsconfig es2022 | 0.5 SP | P1 |
| **Subtotal** | | **6.6 SP** | |

---

### 8.3. Long-term Recommendations

1. **Codegen types from Prisma** — `prisma generate` đã tạo types; FE nên dùng `prisma-typescript` hoặc OpenAPI codegen.
2. **Integration tests** với Supertest + Testcontainers.
3. **Observability**: Winston/Pino logger + OpenTelemetry.
4. **CI/CD pipeline**: GitHub Actions.
5. **Security**: Add `express-mongo-sanitize`, `xss-clean`.
6. **API versioning**: `/api/v1/...`.
7. **Redis**: Implement caching, rate limiting per user.
8. **Soft delete**: cho users, bookings.
9. **Refresh token rotation**: Delete old token when issuing new (hiện tại chỉ create, không delete old).
10. **Admin CRUD**: Add news CRUD, user role update.

---

## 9. Phụ lục: Ma trận Severity

### 9.1. Tổng quan (đợt 11)

```
┌────────────────────────────────────────────────────────────────┐
│           SEVERITY DISTRIBUTION (lần 11 — Node.js đợt 2)      │
├────────────┬──────┬──────┬─────┬───────┬────────────────────────┤
│ Severity   │  BE  │  FE  │ DB  │ Infra │ Total                  │
├────────────┼──────┼──────┼─────┼───────┼────────────────────────┤
│ 🔴 Critical│   1  │   3  │  1  │   0   │    5                   │
│ 🟠 High    │   5  │   1  │  0  │   0   │    6                   │
│ 🟡 Medium  │   5  │   1  │  0  │   1   │    7                   │
│ 🟢 Low     │   2  │   1  │  0  │   0   │    3                   │
├────────────┼──────┼──────┼─────┼───────┼────────────────────────┤
│ TOTAL      │  13  │   6  │  1  │   1   │   21                   │
└────────────┴──────┴──────┴─────┴───────┴────────────────────────┘
```

**So sánh**:

| | Đợt 10 (Node.js đợt 1) | **Đợt 11 (Node.js đợt 2)** | Giảm |
|---|---|---|---|
| 🔴 Critical | 17 | **5** | -71% |
| 🟠 High | 14 | **6** | -57% |
| 🟡 Medium | 11 | **7** | -36% |
| 🟢 Low | 5 | **3** | -40% |
| **Total** | **47** | **21** | **-55%** |

### 9.2. Issue Index

#### Critical (5)
- BE-CRIT-01: `getMe` response không có `{ success, data }` wrapper
- FE-CRIT-01: Flight search URL + params + response mismatch
- FE-CRIT-02: Flight entity field names mismatch
- FE-CRIT-03: Booking creation body mismatch
- DB-CRIT-01: Không có Prisma migration files

#### High (6)
- BE-HIGH-01: Mass assignment trong `updateBlog`, `createFlight`, `updateFlight`
- BE-HIGH-02: zod installed but not used
- BE-HIGH-03: `createPaymentUrl` không check ownership
- BE-HIGH-04: `createBooking` không validate tour/hotel existence
- BE-HIGH-05: `searchBookings` không implement `lastName` filter
- FE-HIGH-01: `getMyBookings` response format mismatch

---

## Kết luận

Đợt fix `6cf127f` đã xử lý **rất ấn tượng** — 15/17 Critical + 12/14 High từ đợt 10 đã fix đúng. Đặc biệt:

- ✅ **Auth system hoàn chỉnh**: `/me`, `/refresh`, `/logout`, cookie + Bearer, refresh token rotation
- ✅ **VNPay real implementation**: HMAC-SHA512, IPN verify, amount check
- ✅ **Booking inventory**: Transaction-based seat decrement, cron expiry + restore
- ✅ **Security**: helmet, rate-limit, CORS config, JWT_SECRET validation
- ✅ **DB schema**: Decimal, enums, indexes, full relations
- ✅ **Infra**: docker-compose + Dockerfile fixed cho Node.js

Tuy nhiên vẫn còn **5 Critical + 6 High** — chủ yếu là **FE-BE contract mismatch**:

1. **Flight search + entity fields** — FE và BE dùng field names hoàn toàn khác nhau
2. **Booking creation body** — FE gửi `referenceId`, BE cần `tourId/hotelId/flightId`
3. **`getMe` response** — thiếu wrapper
4. **`getMyBookings` pagination** — BE trả array, FE expect `{ content }`
5. **Admin endpoints** — URL mismatch + missing endpoints
6. **No Prisma migrations** — `prisma migrate deploy` sẽ fail
7. **Mass assignment** — raw `req.body` to Prisma
8. **zod not used** — installed but no validation

**Khuyến nghị**: 
- **Phase 1 (3-5 ngày, ~18 SP)**: Fix 5 Critical + 6 High → FE-BE chạy được end-to-end.
- **Phase 2 (1 tuần, ~7 SP)**: Fix Medium + Low.
- **Phase 3**: Long-term (codegen, tests, CI/CD, Redis).

Node.js BE đang ở **maturity level tốt** sau 2 đợt — tiến độ nhanh hơn Java BE (cần 4 đợt để đạt level tương tự). Nếu fix nốt 5 Critical contract mismatch, project sẽ **production-ready**.

---

> **Báo cáo kết thúc.**
> Review-only — KHÔNG fix. Tổng cộng **21 issue** (sau đợt 11: 47 → 21), giảm 55%. 5 Critical + 6 High còn lại chủ yếu là FE-BE contract mismatch + Prisma migration + mass assignment.
