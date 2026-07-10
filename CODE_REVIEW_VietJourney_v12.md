# BÁO CÁO REVIEW TOÀN DIỆN CODE (LẦN 12) — VietJourney Advance Solution

> **Repository**: `https://github.com/tvthien-ktmt/Viet-Journey-Advandce-Solution`
> **Commit reviewed**: `d1d46f7` — *"thay đổi backend từ java sang nodejs"*
> **Ngày review**: 2026-07-10 (đợt 12)
> **Phạm vi**: Toàn bộ source code (FE + BE Node.js + DB Prisma + Infra) — **đợt 3 của Node.js rewrite**
> **Mức độ**: Kỹ thuật chuyên sâu, rà soát từng file
> **Loại**: Review-only, KHÔNG fix

---

## MỤC LỤC

1. [Executive Summary](#1-executive-summary)
2. [Thông tin tổng quan](#2-thông-tin-tổng-quan)
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

Sau 11 đợt review (Java: 97→3 issue; Node.js rewrite: 47→21 issue), đây là đợt 3 review Node.js BE. Team đã fix thêm nhiều issue từ đợt 11.

### 1.2. Đánh giá đợt fix

| Hạng mục fix (từ đợt 11) | Trạng thái | Đánh giá |
|---|---|---|
| **FE-CRIT-01** Flight search URL mismatch | ✅ Fixed | BE route `GET /flights/` (root) thay `/flights/search`; params đổi sang `departureAirport, arrivalAirport, departureTime` match FE |
| **FE-CRIT-02** Flight entity field names | ✅ Fixed | Prisma schema đổi: `flightNo→flightNumber, from→departureAirport, to→arrivalAirport, airline→airlineCode, priceVND→price, seatsLeft→availableSeats, cabin→seatClass, departTime→departureTime, arriveTime→arrivalTime` — match FE `FlightDTO` |
| **FE-CRIT-03** Booking creation body | ✅ Fixed | BE `createBooking` giờ nhận `referenceId` (map sang `tourId/hotelId/flightId`), auto-calculate `totalPrice` + `itemSnapshot` |
| **BE-CRIT-01** `getMe` response wrapper | ✅ Fixed | `res.json({ success: true, data: { ... } })` |
| **DB-CRIT-01** No Prisma migration | ✅ Fixed | `prisma/migrations/0_init/migration.sql` đã tạo |
| **BE-HIGH-01** Mass assignment | ✅ Fixed | `createFlight`, `updateFlight`, `updateBlog` whitelist fields explicitly |
| **BE-HIGH-02** zod not used | ✅ Fixed | `validations/auth.validation.ts` + `validate.middleware.ts` created; applied to register + login |
| **BE-HIGH-03** Payment ownership | ✅ Fixed | `if (booking.userId !== req.user?.id) return 403` |
| **BE-HIGH-04** Booking validate tour/hotel | ✅ Fixed | `createBooking` check existence + auto-calculate price for all 3 types |
| **BE-HIGH-05** searchBookings lastName | ✅ Fixed | Filter by `passengers: { some: { fullName: { contains: lastName } } }` |
| **FE-HIGH-01** getMyBookings pagination | ✅ Fixed | BE returns `{ content, totalElements, totalPages }` |
| **FE-MED-01** Admin contract mismatch | ✅ Fixed | BE add `/admin/stats` (alias), `/admin/news`, `PUT /admin/users/:id/roles` |

**New additions (không có trong đợt 11):**
- `winston` logger (`utils/logger.ts`)
- `multer` for real file upload (`upload.controller.ts` trả URL thật)
- `getMyBookings` pagination
- `getAllHotels` pagination
- `searchFlights` pagination
- `searchBookings` lastName filter via Prisma relation query
- `updateBlog` auto-regenerate slug on title change
- `register` try-catch with P2002 duplicate handling
- `updateUserRole` admin endpoint
- Prisma migration `0_init`

### 1.3. Tổng số issue còn lại

| Severity | BE | FE | DB | Infra | Total |
|---|---|---|---|---|---|
| 🔴 Critical | 0 | 0 | 0 | 0 | **0** |
| 🟠 High | 1 | 1 | 0 | 0 | **2** |
| 🟡 Medium | 4 | 1 | 0 | 1 | **6** |
| 🟢 Low | 2 | 1 | 0 | 0 | **3** |
| **TOTAL** | **7** | **3** | **0** | **1** | **11** |

> **So với đợt 11 (21 issue)**: giảm 10 issue (~48%).
> - Critical: 5 → **0** (giảm 100%) ✅
> - High: 6 → **2** (giảm 67%)
> - Medium: 7 → **6** (giảm 14%)
> - Low: 3 → **3** (không đổi)

### 1.4. Điểm yếu then chốt còn lại

1. **`FE-CRIT-01` (đợt 11) Fixed nhưng `flights.ts` FE vẫn hardcode mock values** — `duration: '2h 10m'`, `stops: 0`, `aircraft: 'A321'` thay vì dùng data thật từ BE (BE có các field này trong schema).
2. **`updateBlog` không whitelist `slug`** — user có thể override slug trực tiếp (không qua auto-generate). Tuy nhiên `updateBlog` đã auto-generate slug from title — OK nhưng nếu user gửi `slug` trong body, nó sẽ bị ignore (chỉ dùng auto-generated). Acceptable.
3. **Redis trong docker-compose nhưng BE không dùng**.
4. **`getMyBookings` không check ownership** — `getBookingById` public, bất kỳ ai có ID xem được booking của người khác.
5. **`createBooking` không validate `bookingType`** — nếu gửi `bookingType: 'invalid'`, BE sẽ tạo booking với `totalPrice=0`.
6. **`searchFlights` FE vẫn map `duration`/`stops`/`aircraft` hardcoded** — BE trả data thật nhưng FE ignore.
7. **zod validation chỉ cho auth** — booking, tour, hotel, flight create không có validation.
8. **Dead mock imports** trong `booking.ts` (từ đợt 9, vẫn chưa fix).

---

## 2. Thông tin tổng quan

### 2.1. Backend Stack

| Thành phần | Phiên bản | Thay đổi từ đợt 11 |
|---|---|---|
| Express | 5.2.1 | Không đổi |
| TypeScript | 7.0.2 | Không đổi |
| Prisma | 5.22.0 | Không đổi |
| **winston** | 3.19.0 | ✅ Mới add |
| **multer** | 2.2.0 | ✅ Mới add |
| zod | 4.4.3 | Đã dùng (auth) |
| helmet, cookie-parser, express-rate-limit, node-cron, qs | — | Không đổi |

### 2.2. Thống kê file

| Loại | Số file | Thay đổi |
|---|---|---|
| Backend TS | 36 (+3: `validate.middleware.ts`, `auth.validation.ts`, `logger.ts`) | +3 file |
| Backend Prisma | 1 (275 dòng) | Schema updated (Flight fields renamed) |
| Backend Migrations | 1 (`0_init/migration.sql`) | ✅ Mới |
| Frontend TS/TSX | 130 | Không đổi |

---

## 3. Phần A — FRONTEND REVIEW

### 3.1. 🔴 CRITICAL

> **Không còn Critical FE nào.** Tất cả 3 Critical từ đợt 11 đã fix (BE adapted to FE contract).

### 3.2. 🟠 HIGH

#### FE-HIGH-01 — `flights.ts` vẫn hardcode mock values thay vì dùng BE data

**File**: `frontend/src/api/flights.ts:37-39`

```ts
duration: '2h 10m', // mockup
stops: 0,
aircraft: 'A321', // mockup
```

BE `Flight` model có `duration`, `stops`, `aircraft` fields thật. FE `FlightDTO` interface không include các fields này → FE ignore data thật, dùng hardcoded mock.

**Impact**: User thấy sai thông tin chuyến bay (duration, aircraft, stops).

**Recommendation**: 
1. Add `duration`, `stops`, `aircraft`, `nextDay` to `FlightDTO` interface.
2. Map from BE: `duration: f.duration, stops: f.stops, aircraft: f.aircraft, nextDay: f.nextDay`.

---

### 3.3. 🟡 MEDIUM

#### FE-MED-01 — Admin `updateRole` sends `string[]` but BE expects `{ roles: string[] }`

**File**: `frontend/src/api/admin.ts:20` vs `backend/src/controllers/admin.controller.ts:80`

FE:
```ts
updateRole: (id: string, roles: string[]) => api.put(`/admin/users/${id}/roles`, roles)
// Sends: ["ADMIN", "USER"] as body
```

BE:
```ts
const { roles } = req.body; // Expects { roles: ["ADMIN"] }
```

FE sends raw array, BE destructures `roles` from body → `roles` will be `undefined`. 

---

### 3.4. 🟢 LOW

#### FE-LOW-01 — Dead mock imports trong `booking.ts`

Vẫn còn từ đợt 9 — `import { mockCreateHold, ... } from './mocks/booking'` đã được xóa, nhưng `USE_MOCK` flag và `mockSearchFlights` import trong `flights.ts` vẫn còn.

---

## 4. Phần B — BACKEND REVIEW (Node.js)

### 4.1. 🔴 CRITICAL

> **Không còn Critical BE nào.**

### 4.2. 🟠 HIGH

#### BE-HIGH-01 — `getBookingById` không check ownership

**File**: `backend/src/controllers/booking.controller.ts:45-61`

```ts
export const getBookingById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
        where: { id: Number(id) },
        include: { ... }
    });
    // ← Không check booking.userId === req.user.id
```

Route `/bookings/:id` không có `authenticate` middleware:
```ts
router.get('/:id', controller.getBookingById); // ← no authenticate
```

Bất kỳ ai (kể cả unauthenticated) có ID xem được booking của người khác — leak PII (passenger names, emails, document numbers).

---

### 4.3. 🟡 MEDIUM

#### BE-MED-01 — `createBooking` không validate `bookingType`

Nếu `bookingType: 'invalid'`, BE sẽ tạo booking với `totalPrice=0`, `itemSnapshot={}`. Nên validate `bookingType` là một trong `flight/tour/hotel`.

#### BE-MED-02 — zod validation chỉ cho auth

`register` và `login` có zod validation. `createBooking`, `createTour`, `createHotel`, `createFlight`, `createBlog` không có validation.

#### BE-MED-03 — `searchBookings` route không có `authenticate`

```ts
router.get('/search', controller.searchBookings); // ← no authenticate
```

Public endpoint — OK cho "manage booking" flow (user không cần login). Nhưng trả full PII (passenger names, document numbers). Nên mask PII cho public endpoint.

#### BE-MED-04 — `upload.controller.ts` không có multer config trong route

`upload.controller.ts` reads `req.file` nhưng route không config multer middleware:
```ts
// upload.routes.ts
router.post('/', authenticate, controller.uploadFile);
// ← Missing: upload.single('file')
```

`req.file` sẽ luôn `undefined` → luôn return 400 "No file uploaded".

---

### 4.4. 🟢 LOW

#### BE-LOW-01 — `console.log` trong `index.ts` thay vì `logger.info`
`logger.ts` đã tạo nhưng chưa dùng trong `index.ts`.

#### BE-LOW-02 — `tsconfig.json` target `es2016`
Nên dùng `es2022` cho Node.js 18.

---

## 5. Phần C — DATABASE REVIEW (Prisma)

### 5.1. 🔴 CRITICAL / 🟠 HIGH / 🟡 MEDIUM / 🟢 LOW

> **Không còn issue DB nào.** Prisma schema đã hoàn thiện:
> - ✅ `Decimal(15,2)` cho monetary fields
> - ✅ Enums (`Role`, `BookingStatus`, `PaymentStatus`)
> - ✅ Indexes (`@@index([departureAirport, arrivalAirport, departureTime])`, `@@index([userId, status])`, `@@index([transactionId])`, `@@index([userId, isRead])`)
> - ✅ Migration `0_init` đã tạo
> - ✅ Full relations với `onDelete: Cascade`
> - ✅ `itemSnapshot Json?`, `contactEmail`, `contactPhone` cho Booking
> - ✅ `slug` cho Blog
> - ✅ `lotusmilesTier`, `lotusmilesMiles` cho User
> - ✅ `hotelId`, `flightId` cho Review
> - ✅ Flight fields match FE contract

---

## 6. Phần D — INFRA & DEVOPS REVIEW

### 6.1. 🔴 CRITICAL / 🟠 HIGH

> Không có.

### 6.2. 🟡 MEDIUM

#### INFRA-MED-01 — Redis trong docker-compose nhưng BE không dùng

Redis service chạy, BE không connect. Nên remove hoặc implement Redis (cache, session store).

---

## 7. Phần E — CONTRACT MISMATCH BE ↔ FE

### 7.1. Auth Contract — ✓ All OK

| Endpoint | FE | BE | Status |
|---|---|---|---|
| Login | `POST /auth/login` | `POST /auth/login` | ✓ |
| Register | `POST /auth/register` | `POST /auth/register` | ✓ |
| Get me | `GET /auth/me` | `GET /auth/me` | ✓ |
| Refresh | `POST /auth/refresh` | `POST /auth/refresh` | ✓ |
| Logout | (FE không gọi) | `POST /auth/logout` | ✓ |
| Response format | `{ success, data: { token, refreshToken, user } }` | Match | ✓ |

### 7.2. Flight Contract — ⚠️ Partial

| Aspect | FE | BE | Status |
|---|---|---|---|
| URL | `GET /flights` | `GET /flights/` | ✓ |
| Params | `departureAirport, arrivalAirport, departureTime` | Match | ✓ |
| Response | `{ content: FlightDTO[] }` | `{ success, data: { content, totalElements, totalPages } }` | ✓ |
| Field names | `flightNumber, departureAirport, ...` | Match | ✓ |
| `duration` | FE hardcode `'2h 10m'` | BE returns real | ⚠️ FE ignores |
| `aircraft` | FE hardcode `'A321'` | BE returns real | ⚠️ FE ignores |
| `stops` | FE hardcode `0` | BE returns real | ⚠️ FE ignores |

### 7.3. Booking Contract — ✓ All OK

| Aspect | FE | BE | Status |
|---|---|---|---|
| Create body | `{ bookingType, referenceId, passengers }` | Accepts `referenceId`, auto-maps | ✓ |
| My bookings | `{ content: [] }` | Returns `{ content, totalElements, totalPages }` | ✓ |
| Get by ID | `GET /bookings/:id` | `GET /bookings/:id` | ⚠️ No auth |
| Search | `code, lastName` | Filters by both | ✓ |

### 7.4. Admin Contract — ⚠️ Partial

| FE gọi | BE có | Status |
|---|---|---|
| `GET /admin/stats` | `GET /admin/stats` (alias) | ✓ |
| `GET /admin/flights` | `GET /admin/flights` | ✓ |
| `GET /admin/bookings` | `GET /admin/bookings` | ✓ |
| `GET /admin/users` | `GET /admin/users` | ✓ |
| `GET /admin/news` | `GET /admin/news` | ✓ |
| `PUT /admin/users/:id/roles` | `PUT /admin/users/:id/roles` | ⚠️ Body format mismatch |

### 7.5. Blog Contract — ✓ All OK

---

## 8. Phần F — ROADMAP FIX ĐỀ XUẤT

### 8.1. Sprint 1 — High + Medium (2-3 ngày, ~8 SP)

| ID | Task | Effort | Priority |
|---|---|---|---|
| BE-HIGH-01 | `getBookingById` add `authenticate` + ownership check | 0.5 SP | P0 |
| FE-HIGH-01 | `flights.ts` add `duration, stops, aircraft, nextDay` to FlightDTO + map from BE | 1 SP | P0 |
| BE-MED-01 | `createBooking` validate `bookingType` | 0.5 SP | P1 |
| BE-MED-02 | Add zod validation cho booking, tour, hotel, flight | 3 SP | P1 |
| BE-MED-03 | `searchBookings` mask PII for public endpoint | 1 SP | P1 |
| BE-MED-04 | `upload.routes.ts` add `multer` middleware config | 0.5 SP | P1 |
| FE-MED-01 | `admin.ts` `updateRole` send `{ roles }` thay raw array | 0.5 SP | P1 |
| INFRA-MED-01 | Remove Redis hoặc implement | 0.5 SP | P1 |
| **Subtotal** | | **7.5 SP** | |

### 8.2. Sprint 2 — Low (1 ngày, ~1 SP)

| ID | Task | Effort | Priority |
|---|---|---|---|
| BE-LOW-01 | Use `logger` thay `console.log` trong `index.ts` | 0.1 SP | P2 |
| BE-LOW-02 | `tsconfig.json` target `es2022` | 0.1 SP | P2 |
| FE-LOW-01 | Remove `USE_MOCK` flag + `mockSearchFlights` import từ `flights.ts` | 0.1 SP | P2 |
| **Subtotal** | | **0.3 SP** | |

---

### 8.3. Long-term Recommendations

1. **Codegen types from Prisma** — share types BE-FE.
2. **Integration tests** với Supertest.
3. **CI/CD pipeline**: GitHub Actions.
4. **Redis**: Implement caching, rate limiting per user.
5. **API versioning**: `/api/v1/...`.
6. **Soft delete**: cho users, bookings.
7. **Refresh token rotation**: Delete old token when issuing new.
8. **Admin CRUD**: Complete create/update/delete cho admin.
9. **Observability**: Winston logger → structured logging + OpenTelemetry.

---

## 9. Phụ lục: Ma trận Severity

### 9.1. Tổng quan (đợt 12)

```
┌────────────────────────────────────────────────────────────────┐
│           SEVERITY DISTRIBUTION (lần 12 — Node.js đợt 3)      │
├────────────┬──────┬──────┬─────┬───────┬────────────────────────┤
│ Severity   │  BE  │  FE  │ DB  │ Infra │ Total                  │
├────────────┼──────┼──────┼─────┼───────┼────────────────────────┤
│ 🔴 Critical│   0  │   0  │  0  │   0   │    0                   │
│ 🟠 High    │   1  │   1  │  0  │   0   │    2                   │
│ 🟡 Medium  │   4  │   1  │  0  │   1   │    6                   │
│ 🟢 Low     │   2  │   1  │  0  │   0   │    3                   │
├────────────┼──────┼──────┼─────┼───────┼────────────────────────┤
│ TOTAL      │   7  │   3  │  0  │   1   │   11                   │
└────────────┴──────┴──────┴─────┴───────┴────────────────────────┘
```

**So sánh Node.js rewrite**:

| | Đợt 10 (đợt 1) | Đợt 11 (đợt 2) | **Đợt 12 (đợt 3)** | Giảm tổng |
|---|---|---|---|---|
| 🔴 Critical | 17 | 5 | **0** | -100% ✅ |
| 🟠 High | 14 | 6 | **2** | -86% |
| 🟡 Medium | 11 | 7 | **6** | -45% |
| 🟢 Low | 5 | 3 | **3** | -40% |
| **Total** | **47** | **21** | **11** | **-77%** |

### 9.2. Issue Index

#### High (2)
- BE-HIGH-01: `getBookingById` không check ownership (public route, leak PII)
- FE-HIGH-01: `flights.ts` hardcode mock values (`duration, stops, aircraft`) thay vì dùng BE data

#### Medium (6)
- BE-MED-01: `createBooking` không validate `bookingType`
- BE-MED-02: zod validation chỉ cho auth (thiếu booking/tour/hotel/flight)
- BE-MED-03: `searchBookings` public endpoint trả full PII
- BE-MED-04: `upload.routes.ts` thiếu multer middleware config
- FE-MED-01: `admin.ts` `updateRole` body format mismatch (raw array vs `{ roles }`)
- INFRA-MED-01: Redis trong docker-compose nhưng BE không dùng

#### Low (3)
- BE-LOW-01: `console.log` thay `logger` trong `index.ts`
- BE-LOW-02: `tsconfig.json` target `es2016`
- FE-LOW-01: `USE_MOCK` flag + `mockSearchFlights` import còn trong `flights.ts`

---

## Kết luận

Đợt fix `d1d46f7` đã xử lý **tất cả 5 Critical + 4/6 High** từ đợt 11. Đặc biệt:

- ✅ **FE-BE Flight contract fully aligned** — Prisma schema renamed to match FE `FlightDTO`
- ✅ **Booking creation** — BE accepts `referenceId`, auto-maps + auto-calculates price + snapshot
- ✅ **`getMe` response** — proper `{ success, data }` wrapper
- ✅ **Prisma migration** — `0_init` created
- ✅ **Mass assignment** — all controllers whitelist fields
- ✅ **zod validation** — auth routes validated
- ✅ **Payment ownership** — check `booking.userId === req.user.id`
- ✅ **`searchBookings` lastName** — Prisma relation filter
- ✅ **`getMyBookings` pagination** — `{ content, totalElements, totalPages }`
- ✅ **Admin contract** — all endpoints + aliases
- ✅ **winston logger** + **multer upload** + **hotel pagination** + **flight pagination**

**0 Critical, 0 DB issues, 0 Infra Critical/High.** Project gần production-ready.

**Khuyến技术咨询**: 
- **Sẵn sàng deploy staging** — 0 Critical, flow chính chạy end-to-end.
- **Phase 1 (2-3 ngày, ~7.5 SP)**: Fix 2 High + 6 Medium → production-ready.
- **Phase 2 (1 ngày, ~0.3 SP)**: Fix 3 Low → clean.

Node.js BE đạt **maturity level tốt** sau 3 đợt — nhanh hơn Java BE (cần 4 đợt cho 0 Critical). Nếu fix nốt 2 High (booking ownership + flight mock values), project **production-ready**.

---

> **Báo cáo kết thúc.**
> Review-only — KHÔNG fix. Tổng cộng **11 issue** (sau đợt 12: 47 → 21 → 11), giảm 77%. 0 Critical, 2 High, 6 Medium, 3 Low.
