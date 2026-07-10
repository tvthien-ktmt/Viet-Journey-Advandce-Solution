# BÁO CÁO REVIEW TOÀN DIỆN CODE (LẦN 10) — VietJourney Advance Solution

> **Repository**: `https://github.com/tvthien-ktmt/Viet-Journey-Advandce-Solution`
> **Commit reviewed**: `2d4ca75` — *"Thêm API thanh toán VNPay và API Upload file"*
> **Ngày review**: 2026-07-10 (đợt 10)
> **Phạm vi**: Toàn bộ source code (FE + BE + DB + Infra) — **BE đã chuyển từ Java Spring Boot sang Node.js + Express + TypeScript + Prisma**
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

Sau 9 đợt review (97 → 3 issue), team đã **thay đổi hoàn toàn backend** từ Java Spring Boot sang **Node.js + Express + TypeScript + Prisma**. Đây là một **rewrite toàn bộ BE** — không phải incremental fix. Bản review này đánh giá **codebase mới từ đầu**, không so sánh với Java BE trước đó.

### 1.2. Tổng quan kiến trúc mới

| Thành phần | Cũ (Java) | Mới (Node.js) |
|---|---|---|
| Language | Java 17 | TypeScript 7.0.2 |
| Framework | Spring Boot 3.2.4 | Express 5.2.1 |
| ORM | Hibernate/JPA | Prisma Client 5.22.0 |
| DB Migration | Flyway (21 SQL files V1→V38) | Prisma schema (1 file `schema.prisma`) |
| Security | Spring Security + JWT + BCrypt + Rate Limiting + VNPay IPN filter | jsonwebtoken + bcryptjs (không rate limiting, không IPN filter) |
| Caching | Caffeine + Redis | Không có |
| Scheduled Tasks | ReservationScheduler + RefreshTokenCleanup | Không có |
| Payment | VNPay HMAC-SHA512 + IPN + Callback | Mock URL (không signature) |
| File Upload | Không có | Mock (placeholder URL) |

### 1.3. Tổng số issue

| Severity | BE | FE | DB | Infra | Total |
|---|---|---|---|---|---|
| 🔴 Critical | 12 | 0 | 2 | 3 | **17** |
| 🟠 High | 10 | 0 | 3 | 1 | **14** |
| 🟡 Medium | 7 | 2 | 2 | 0 | **11** |
| 🟢 Low | 3 | 1 | 1 | 0 | **5** |
| **TOTAL** | **32** | **3** | **8** | **4** | **47** |

> **So với đợt 9 (3 issue)**: Tăng 44 issue — do **rewrite toàn bộ BE** từ đầu, mất nhiều feature đã fix trong 9 đợt trước. Đây là **codebase mới**, cần review lại từ đầu.

### 1.4. Điểm yếu then chốt

1. **docker-compose.yml vẫn dùng env vars cho Java** (`SPRING_PROFILES_ACTIVE`, `SPRING_DATASOURCE_URL`, healthcheck `/actuator/health`) — Node.js BE không hiểu các biến này, sẽ fail khởi động.
2. **17 file .js dead code trong `backend/src/`** — compiled JS artifacts không nên có trong source, gây confusion.
3. **Không có `/auth/me`, `/auth/refresh`, `/auth/logout` endpoints** — FE gọi sẽ 404.
4. **Payment endpoint mismatch**: FE gọi `/payments/create`, BE có `/payments/create-url`.
5. **Không có `/bookings/:id` GET, `/bookings/search`** — FE gọi sẽ 404.
6. **Auth dùng Bearer header, FE gửi cookie** — `withCredentials: true` nhưng BE không đọc cookie.
7. **VNPay payment là mock** — không HMAC-SHA512, không verify signature ở IPN.
8. **Không có input validation** — không express-validator, không zod, không Joi.
9. **CORS mở tất cả** — `app.use(cors())` không config.
10. **JWT_SECRET fallback `'secret'`** — insecure nếu env var không set.
11. **Không rate limiting** — không có express-rate-limit hay tương đương.
12. **Không scheduled tasks** — booking expired không tự động xử lý.
13. **Booking không quản lý inventory** — không decrement `flight.seatsLeft`.
14. **Prisma dùng `Float` cho price** — thay vì `Decimal`, gây precision issues.
15. **Không global error handler middleware**.
16. **Redis trong docker-compose nhưng BE không dùng**.
17. **Không `.env.example`** — không document env vars cần thiết.

---

## 2. Thông tin tổng quan dự án

### 2.1. Backend Stack (Node.js mới)

| Thành phần | Phiên bản |
|---|---|
| Node.js | 18 (alpine Docker) |
| Express | 5.2.1 |
| TypeScript | 7.0.2 |
| Prisma | 5.22.0 |
| jsonwebtoken | 9.0.3 |
| bcryptjs | 3.0.3 |
| cors | 2.8.6 |
| dotenv | 17.4.2 |

### 2.2. Frontend Stack (không đổi)

React 19.2.7 / Vite 8.1.1 / TypeScript 6.0.2 / TanStack Query 5.101.2 / Zustand 5.0.14 / Tailwind 3.4.19 / React Router 7.18.1 / shadcn/ui 4.12.0 / axios 1.18.1.

### 2.3. Thống kê file

| Loại | Số file |
|---|---|
| Backend TS | 31 |
| Backend JS (dead code) | 17 |
| Backend Prisma schema | 1 (239 dòng) |
| Frontend TS/TSX | 130 |
| Infra | docker-compose, 2 Dockerfile |

---

## 3. Phần A — FRONTEND REVIEW

### 3.1. 🔴 CRITICAL

> Không có Critical FE mới. FE không thay đổi từ đợt 9.

### 3.2. 🟠 HIGH

> Không có High FE mới.

### 3.3. 🟡 MEDIUM

#### FE-MED-01 — FE client.ts vẫn dùng refresh token flow qua cookie, nhưng BE mới không hỗ trợ

**File**: `frontend/src/api/client.ts:54`

```ts
const { data } = await axios.post(BASE_URL + '/auth/refresh', {}, { withCredentials: true });
```

BE Node.js không có endpoint `/auth/refresh` và không set HttpOnly cookie. FE interceptor sẽ fail → logout ngay sau 15 phút.

#### FE-MED-02 — FE gọi `/auth/me` nhưng BE không có endpoint này

**File**: `frontend/src/api/auth.ts:15`

```ts
me: () => api.get<AuthUser>('/auth/me'),
```

BE chỉ có `/api/auth/register` + `/api/auth/login`. Gọi `/auth/me` → 404.

### 3.4. 🟢 LOW

#### FE-LOW-01 — Dead mock imports trong `booking.ts`

Vẫn còn từ đợt 9 — `import { mockCreateHold, ... } from './mocks/booking'` không sử dụng.

---

## 4. Phần B — BACKEND REVIEW (Node.js)

### 4.1. 🔴 CRITICAL

#### BE-CRIT-01 — docker-compose.yml dùng env vars cho Java, không tương thích Node.js

**File**: `docker-compose.yml:46-52`

```yaml
environment:
  - SPRING_PROFILES_ACTIVE=prod
  - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/...
  - SPRING_DATASOURCE_USERNAME=...
  - SPRING_DATASOURCE_PASSWORD=...
  - JWT_SECRET=...
  - REDIS_HOST=redis
  - REDIS_PASSWORD=...
```

Node.js BE cần `DATABASE_URL=mysql://...` cho Prisma, không cần `SPRING_*`. Sẽ fail khởi động.

**Fix**: Đổi sang:
```yaml
- DATABASE_URL=mysql://user:pass@mysql:3306/dbname
- JWT_SECRET=...
```

---

#### BE-CRIT-02 — Healthcheck dùng `/actuator/health` (Spring endpoint)

**File**: `docker-compose.yml:61`

```yaml
test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
```

Node.js BE có `/api/health`, không có `/actuator/health`. Healthcheck sẽ fail → container unhealthy → frontend không start.

---

#### BE-CRIT-03 — Thiếu `/auth/me` endpoint

FE gọi `GET /api/auth/me` để verify token sau F5. BE không có endpoint này → 404 → FE logout user.

---

#### BE-CRIT-04 — Thiếu `/auth/refresh` endpoint

FE interceptor gọi `POST /api/auth/refresh` khi 401. BE không có → refresh fail → logout sau 15 phút.

---

#### BE-CRIT-05 — Thiếu `/auth/logout` endpoint

FE không gọi BE logout, nhưng BE nên có endpoint để blacklist token.

---

#### BE-CRIT-06 — Payment endpoint mismatch

FE gọi `POST /api/payments/create`, BE có `POST /api/payments/create-url`. Sẽ 404.

---

#### BE-CRIT-07 — Thiếu `GET /api/bookings/:id` endpoint

FE gọi `GET /api/bookings/{id}` để xem chi tiết booking. BE chỉ có `GET /api/bookings/my-bookings` và `GET /api/bookings` (admin). Không có get-by-id.

---

#### BE-CRIT-08 — Thiếu `GET /api/bookings/search` endpoint

FE gọi `GET /api/bookings/search?code=BK123&lastName=NGUYEN`. BE không có endpoint này.

---

#### BE-CRIT-09 — Auth response không khớp FE contract

BE trả:
```json
{ "success": true, "data": { "token": "...", "user": { "id": 1, "email": "...", "fullName": "...", "role": "USER" } } }
```

FE expect:
```json
{ "success": true, "data": { "token": "...", "refreshToken": "...", "user": { "id": "1", "email": "...", "fullName": "...", "role": "USER", "roles": ["USER"] } } }
```

Thiếu `refreshToken`. `id` là `number` thay vì `string`. Không có `roles` array.

---

#### BE-CRIT-10 — Auth dùng Bearer header, FE gửi cookie

**File**: `backend/src/middlewares/auth.middleware.ts:14-15`

```ts
const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith('Bearer ')) {
```

FE dùng `withCredentials: true` (cookie-based auth). BE chỉ đọc `Authorization: Bearer` header. Token trong cookie `jwt` không được đọc → tất cả authenticated requests 401.

---

#### BE-CRIT-11 — VNPay payment là mock, không có HMAC-SHA512 signature

**File**: `backend/src/controllers/payment.controller.ts:25-35`

```ts
// Mock VNPay Logic
const mockPaymentUrl = `${vnpUrl}?vnp_Amount=${amount}&vnp_Command=pay&...`;
```

Không tính `secureHash` bằng HMAC-SHA512. VNPay sẽ reject URL này. IPN cũng không verify signature — attacker có thể giả mạo IPN.

---

#### BE-CRIT-12 — 17 file .js dead code trong `backend/src/`

17 file `.js` (compiled artifacts) tồn tại trong `src/` cùng với file `.ts` tương ứng. Đây là dead code:
- `admin.controller.js`, `auth.controller.js`, `blog.controller.js`, `booking.controller.js`, `flight.controller.js`, `hotel.controller.js`, `tour.controller.js`, `user.controller.js`
- `admin.routes.js`, `auth.routes.js`, `blog.routes.js`, `booking.routes.js`, `flight.routes.js`, `hotel.routes.js`, `tour.routes.js`, `user.routes.js`
- `prisma.js`

TypeScript compile `.ts` → `dist/`, không đọc `.js` trong `src/`. Các file `.js` này gây confusion và nên xóa.

---

### 4.2. 🟠 HIGH

#### BE-HIGH-01 — CORS mở tất cả origins

**File**: `backend/src/index.ts:24`

```ts
app.use(cors());
```

Không config `origin`, `credentials`, `methods`. Cho phép tất cả domains gọi API → CSRF risk.

---

#### BE-HIGH-02 — JWT_SECRET fallback `'secret'`

**File**: `backend/src/middlewares/auth.middleware.ts:4`, `backend/src/controllers/auth.controller.ts:6`

```ts
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
```

Nếu env var không set → dùng `'secret'` — trivially guessable. Nên throw error nếu không set.

---

#### BE-HIGH-03 — Không có input validation

Không có express-validator, zod, hay Joi. Tất cả `req.body` fields được dùng trực tiếp:
- `register`: không validate email format, password strength
- `createBooking`: không validate `bookingType`, `totalPrice`, `passengers`
- `createTour`: không validate `slug` uniqueness, `price` > 0

---

#### BE-HIGH-04 — Không có rate limiting

Java BE có Bucket4j rate limiting trên login/register/booking. Node.js BE không có `express-rate-limit` hay tương đương → brute-force attack possible.

---

#### BE-HIGH-05 — Booking không quản lý inventory

**File**: `backend/src/controllers/booking.controller.ts:33-68`

`createBooking` tạo booking nhưng không:
- Check `flight.seatsLeft > 0`
- Decrement `flight.seatsLeft`
- Set `reservedUntil` (10 phút hold)
- Generate `itemSnapshot`

→ Double-booking possible, không có giới hạn chỗ.

---

#### BE-HIGH-06 — Không có scheduled task cho expiring bookings

Java BE có `ReservationScheduler` chạy mỗi phút. Node.js BE không có `node-cron` hay tương đương → booking `reserved` không bao giờ expire.

---

#### BE-HIGH-07 — Không global error handler middleware

Không có `app.use((err, req, res, next) => {...})` error handler. Nếu Prisma throw error không catch → 500 không có JSON response.

---

#### BE-HIGH-08 — `blog.controller.ts` không có `/slug/:slug` endpoint

FE gọi `GET /api/blogs/slug/:slug`. BE chỉ có `GET /api/blogs/:id`. Sẽ 404 khi FE xem blog detail.

---

#### BE-HIGH-09 — `Booking.status` và `Payment.status` là `String` thay vì enum

Prisma schema dùng `String` cho status fields thay vì `enum`. Không enforce valid values ở DB level.

---

#### BE-HIGH-10 — `Booking` thiếu fields `itemSnapshot`, `contactEmail`, `contactPhone`

FE expect `booking.itemSnapshot` (JSON), `booking.contactEmail`, `booking.contactPhone`. Prisma schema không có các fields này.

---

### 4.3. 🟡 MEDIUM

#### BE-MED-01 — Upload controller là mock
Trả `https://via.placeholder.com/600x400` — không upload thật.

#### BE-MED-02 — `flight.controller.ts` search không filter theo `departDate`
FE gửi `departDate` param nhưng BE ignore.

#### BE-MED-03 — `tour.controller.ts` không hỗ trợ pagination
FE expect `Page<TourDTO>` với `content`, `totalElements`. BE trả array trực tiếp.

#### BE-MED-04 — `hotel.controller.ts` không hỗ trợ pagination
Same issue as tours.

#### BE-MED-05 — Admin controller chỉ có 1 endpoint `getDashboardStats`
Thiếu `/admin/flights`, `/admin/bookings`, `/admin/users`, `/admin/news` — FE admin pages sẽ 404.

#### BE-MED-06 — `updateBlog` truyền `data` trực tiếp vào Prisma
`prisma.blog.update({ data })` — không whitelist fields, user có thể update `createdAt`, `id`.

#### BE-MED-07 — Redis trong docker-compose nhưng BE không dùng
Redis service chạy nhưng Node.js BE không connect. Waste resources.

---

### 4.4. 🟢 LOW

#### BE-LOW-01 — `console.log` trong `index.ts:48`
`console.log(`Server is running on port ${port}`)` — OK cho dev, nên dùng logger cho prod.

#### BE-LOW-02 — Không có `.env.example`
Không document env vars cần thiết (`DATABASE_URL`, `JWT_SECRET`, `VNP_*`).

#### BE-LOW-03 — `tsconfig.json` target `es2016`
Nên dùng `es2022` hoặc `esnext` cho Node.js 18.

---

## 5. Phần C — DATABASE REVIEW (Prisma)

### 5.1. 🔴 CRITICAL

#### DB-CRIT-01 — Prisma dùng `Float` cho tất cả monetary values

```prisma
model Tour { price Float ... }
model Hotel { price Float ... }
model Flight { priceVND Float ... }
model Booking { totalPrice Float ... }
model Payment { amount Float ... }
```

`Float` gây precision issues (0.1 + 0.2 ≠ 0.3). Nên dùng `Decimal` (`@db.Decimal(15,2)`).

---

#### DB-CRIT-02 — Không có Prisma migration

Chỉ có `schema.prisma`, không có `prisma/migrations/`. `prisma db push` không tạo migration history → không audit được schema changes. Nên dùng `prisma migrate dev` để tạo migration files.

---

### 5.2. 🟠 HIGH

#### DB-HIGH-01 — `Booking` thiếu `itemSnapshot`, `contactEmail`, `contactPhone`

FE expect các fields này. Prisma schema không có.

#### DB-HIGH-02 — `Booking` dùng polymorphic relations thay vì `bookingType + referenceId`

```prisma
model Booking {
  tourId Int?
  tour   Tour?
  hotelId Int?
  hotel   Hotel?
  flightId Int?
  flight   Flight?
}
```

Thay vì `bookingType + referenceId` (Java BE pattern). Điều này tốt hơn cho type safety nhưng khác contract với FE.

#### DB-HIGH-03 — Không có index cho các query patterns phổ biến

Thiếu index cho:
- `Booking(userId, status)` — query user bookings
- `Payment(transactionId)` — query payment by txn
- `Flight(from, to, departTime)` — flight search
- `Notification(userId, isRead)` — unread notifications

---

### 5.3. 🟡 MEDIUM

#### DB-MED-01 — `Review` chỉ link đến `Tour`, không có `hotelId` hoặc `flightId`
Java BE hỗ trợ review cho tour/hotel/flight. Node.js BE chỉ hỗ trợ tour.

#### DB-MED-02 — `Blog` thiếu `slug` field
FE gọi `/blogs/slug/:slug` nhưng Prisma không có `slug` column.

---

### 5.4. 🟢 LOW

#### DB-LOW-01 — `User` thiếu `lotusmilesTier`, `lotusmilesMiles`, `failedLoginCount`, `lockedUntil`

Java BE có các fields này. Node.js BE không có → FE ProfilePage/DashboardPage sẽ hiển thị undefined.

---

## 6. Phần D — INFRA & DEVOPS REVIEW

### 6.1. 🔴 CRITICAL

#### INFRA-CRIT-01 — docker-compose.yml không tương thích Node.js BE

Như BE-CRIT-01: env vars `SPRING_*`, thiếu `DATABASE_URL`.

#### INFRA-CRIT-02 — Healthcheck dùng Spring Actuator endpoint

Như BE-CRIT-02: `/actuator/health` → 404.

#### INFRA-CRIT-03 — Backend Dockerfile không copy `.env` hoặc set `DATABASE_URL`

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npx prisma generate
RUN npx tsc
EXPOSE 8080
CMD ["npm", "start"]
```

Không set `DATABASE_URL` → Prisma không connect được DB khi chạy.

---

### 6.2. 🟠 HIGH

#### INFRA-HIGH-01 — Redis service chạy nhưng không sử dụng

docker-compose khởi động Redis nhưng Node.js BE không connect. Waste memory.

---

### 6.3. 🟡 MEDIUM / 🟢 LOW

> Không có.

---

## 7. Phần E — CONTRACT MISMATCH BE ↔ FE

### 7.1. Auth Contract

| Endpoint | FE gọi | BE có | Status |
|---|---|---|---|
| Login | `POST /auth/login` | `POST /auth/login` | ✓ OK |
| Register | `POST /auth/register` | `POST /auth/register` | ✓ OK |
| Get me | `GET /auth/me` | ❌ Không có | 🔴 404 |
| Refresh | `POST /auth/refresh` | ❌ Không có | 🔴 404 |
| Logout | `POST /auth/logout` | ❌ Không có | 🔴 404 |
| Token delivery | Cookie HttpOnly | Bearer header | 🔴 Mismatch |
| Response `refreshToken` | Expected | Not returned | 🔴 Missing |
| Response `user.id` | `string` | `number` | ⚠️ Type |
| Response `user.roles` | `string[]` | Not returned | 🔴 Missing |

### 7.2. Booking Contract

| Endpoint | FE gọi | BE có | Status |
|---|---|---|---|
| Create | `POST /bookings` | `POST /bookings` | ⚠️ Body mismatch |
| Get by ID | `GET /bookings/:id` | ❌ Không có | 🔴 404 |
| My bookings | `GET /bookings/my-bookings` | `GET /bookings/my-bookings` | ✓ OK |
| Search | `GET /bookings/search` | ❌ Không có | 🔴 404 |
| `booking.itemSnapshot` | Expected | ❌ Not in schema | 🔴 Missing |
| `booking.contactEmail` | Expected | ❌ Not in schema | 🔴 Missing |
| `booking.contactPhone` | Expected | ❌ Not in schema | 🔴 Missing |

### 7.3. Payment Contract

| Endpoint | FE gọi | BE có | Status |
|---|---|---|---|
| Create payment | `POST /payments/create` | `POST /payments/create-url` | 🔴 URL mismatch |
| Response `paymentUrl` | Expected | Returned | ✓ OK |

### 7.4. Blog Contract

| Endpoint | FE gọi | BE có | Status |
|---|---|---|---|
| List | `GET /blogs` | `GET /blogs` | ✓ OK |
| By slug | `GET /blogs/slug/:slug` | `GET /blogs/:id` | 🔴 Mismatch |

### 7.5. Admin Contract

| Endpoint | FE gọi | BE có | Status |
|---|---|---|---|
| Stats | `GET /admin/stats` | `GET /admin/dashboard` | 🔴 URL mismatch |
| Flights | `GET /admin/flights` | ❌ Không có | 🔴 404 |
| Bookings | `GET /admin/bookings` | ❌ Không có | 🔴 404 |
| Users | `GET /admin/users` | ❌ Không có | 🔴 404 |
| News | `GET /admin/news` | ❌ Không có | 🔴 404 |

---

## 8. Phần F — ROADMAP FIX ĐỀ XUẤT

### 8.1. Sprint 1 — Critical Fixes (1-2 tuần, ~35 SP)

**Mục tiêu**: BE chạy được với FE + docker-compose.

| ID | Task | Effort | Priority |
|---|---|---|---|
| INFRA-CRIT-01/02/03 | Fix docker-compose: `DATABASE_URL`, healthcheck `/api/health`, Dockerfile env | 2 SP | P0 |
| BE-CRIT-03/04/05 | Add `/auth/me`, `/auth/refresh`, `/auth/logout` endpoints | 3 SP | P0 |
| BE-CRIT-06 | Fix payment endpoint: `/payments/create-url` → `/payments/create` | 0.5 SP | P0 |
| BE-CRIT-07/08 | Add `GET /bookings/:id`, `GET /bookings/search` | 2 SP | P0 |
| BE-CRIT-09 | Fix auth response: add `refreshToken`, `roles`, cast `id` to string | 1 SP | P0 |
| BE-CRIT-10 | Support cookie-based auth (read `jwt` cookie) + Bearer header | 2 SP | P0 |
| BE-CRIT-11 | Implement VNPay HMAC-SHA512 signature + IPN verify | 5 SP | P0 |
| BE-CRIT-12 | Remove 17 dead `.js` files from `src/` | 0.5 SP | P0 |
| DB-CRIT-01 | Change `Float` → `Decimal` for all monetary fields | 2 SP | P0 |
| DB-CRIT-02 | Run `prisma migrate dev` to create migration history | 1 SP | P0 |
| DB-HIGH-01 | Add `itemSnapshot`, `contactEmail`, `contactPhone` to `Booking` model | 1 SP | P0 |
| DB-HIGH-08 | Add `slug` to `Blog` model | 0.5 SP | P0 |
| BE-HIGH-01 | Configure CORS with specific origins | 0.5 SP | P0 |
| BE-HIGH-02 | Throw error if `JWT_SECRET` not set | 0.1 SP | P0 |
| BE-HIGH-03 | Add input validation (express-validator or zod) | 3 SP | P0 |
| BE-HIGH-05 | Implement booking inventory management (check + decrement seats) | 3 SP | P0 |
| BE-HIGH-06 | Add node-cron for expiring bookings | 2 SP | P0 |
| BE-HIGH-07 | Add global error handler middleware | 1 SP | P0 |
| BE-HIGH-08 | Add `/blogs/slug/:slug` endpoint | 0.5 SP | P0 |
| BE-HIGH-10 | Add missing Booking fields to schema + controller | 1 SP | P0 |
| BE-MED-05 | Add admin endpoints (flights/bookings/users/news) | 4 SP | P0 |
| **Subtotal** | | **35.1 SP** | |

### 8.2. Sprint 2 — High + Medium Fixes (1 tuần, ~15 SP)

| ID | Task | Effort | Priority |
|---|---|---|---|
| BE-HIGH-04 | Add express-rate-limit | 1 SP | P1 |
| BE-HIGH-09 | Use Prisma enum for Booking/Payment status | 1 SP | P1 |
| DB-HIGH-03 | Add indexes for query patterns | 1 SP | P1 |
| DB-MED-01 | Add `hotelId`, `flightId` to Review model | 0.5 SP | P1 |
| DB-LOW-01 | Add `lotusmilesTier`, `lotusmilesMiles` to User model | 0.5 SP | P1 |
| BE-MED-01 | Implement real file upload (multer + S3/local) | 3 SP | P1 |
| BE-MED-02 | Flight search filter by `departDate` | 0.5 SP | P1 |
| BE-MED-03/04 | Add pagination to tours/hotels | 2 SP | P1 |
| BE-MED-06 | Whitelist fields in `updateBlog` | 0.5 SP | P1 |
| BE-MED-07 | Remove Redis from docker-compose or use it | 0.5 SP | P1 |
| INFRA-HIGH-01 | Same as BE-MED-07 | — | P1 |
| BE-LOW-02 | Create `.env.example` | 0.5 SP | P1 |
| BE-LOW-03 | Update tsconfig target to `es2022` | 0.1 SP | P1 |
| FE-MED-01/02 | Fix FE client.ts refresh flow + auth API to match new BE | 2 SP | P1 |
| FE-LOW-01 | Remove dead mock imports | 0.1 SP | P1 |
| **Subtotal** | | **13.2 SP** | |

---

### 8.3. Long-term Recommendations

1. **Codegen types from OpenAPI** — generate TS types cho cả BE + FE.
2. **Integration tests** với Supertest + Testcontainers.
3. **Observability**: Winston/Pino logger + OpenTelemetry.
4. **CI/CD pipeline**: GitHub Actions.
5. **Security hardening**: Helmet, express-rate-limit, express-mongo-sanitize.
6. **Prisma migration strategy**: `prisma migrate` thay vì `db push`.
7. **Seed data**: `prisma db seed` cho dev environment.
8. **API versioning**: `/api/v1/...`.
9. **Refresh token rotation**: Implement properly với DB-backed tokens.
10. **Redis integration**: Rate limiting, caching, JWT blacklist.

---

## 9. Phụ lục: Ma trận Severity

### 9.1. Tổng quan (đợt 10 — Node.js rewrite)

```
┌────────────────────────────────────────────────────────────────┐
│           SEVERITY DISTRIBUTION (lần 10 — Node.js rewrite)    │
├────────────┬──────┬──────┬─────┬───────┬────────────────────────┤
│ Severity   │  BE  │  FE  │ DB  │ Infra │ Total                  │
├────────────┼──────┼──────┼─────┼───────┼────────────────────────┤
│ 🔴 Critical│  12  │   0  │  2  │   3   │   17                   │
│ 🟠 High    │  10  │   0  │  3  │   1   │   14                   │
│ 🟡 Medium  │   7  │   2  │  2  │   0   │   11                   │
│ 🟢 Low     │   3  │   1  │  1  │   0   │    5                   │
├────────────┼──────┼──────┼─────┼───────┼────────────────────────┤
│ TOTAL      │  32  │   3  │  8  │   4   │   47                   │
└────────────┴──────┴──────┴─────┴───────┴────────────────────────┘
```

**So sánh với đợt 9 (Java BE, 3 issue)**: Tăng 44 issue — do **rewrite toàn bộ BE**. Codebase mới chưa đạt maturity level của Java BE trước đó.

### 9.2. Issue Index

#### Critical (17)
- BE-CRIT-01: docker-compose env vars cho Java, không tương thích Node.js
- BE-CRIT-02: Healthcheck `/actuator/health` không tồn tại
- BE-CRIT-03: Thiếu `/auth/me` endpoint
- BE-CRIT-04: Thiếu `/auth/refresh` endpoint
- BE-CRIT-05: Thiếu `/auth/logout` endpoint
- BE-CRIT-06: Payment endpoint mismatch (`/payments/create-url` vs `/payments/create`)
- BE-CRIT-07: Thiếu `GET /bookings/:id`
- BE-CRIT-08: Thiếu `GET /bookings/search`
- BE-CRIT-09: Auth response thiếu `refreshToken`, `roles`, sai type `id`
- BE-CRIT-10: Auth dùng Bearer header, FE gửi cookie
- BE-CRIT-11: VNPay mock, không HMAC-SHA512 signature
- BE-CRIT-12: 17 dead `.js` files trong `src/`
- DB-CRIT-01: `Float` cho monetary values thay vì `Decimal`
- DB-CRIT-02: Không có Prisma migration history
- INFRA-CRIT-01: docker-compose env vars không tương thích
- INFRA-CRIT-02: Healthcheck endpoint sai
- INFRA-CRIT-03: Dockerfile thiếu `DATABASE_URL`

#### High (14)
- BE-HIGH-01: CORS mở tất cả
- BE-HIGH-02: JWT_SECRET fallback `'secret'`
- BE-HIGH-03: Không input validation
- BE-HIGH-04: Không rate limiting
- BE-HIGH-05: Booking không quản lý inventory
- BE-HIGH-06: Không scheduled task
- BE-HIGH-07: Không global error handler
- BE-HIGH-08: Blog thiếu `/slug/:slug` endpoint
- BE-HIGH-09: Status fields là String thay vì enum
- BE-HIGH-10: Booking thiếu `itemSnapshot`, `contactEmail`, `contactPhone`
- DB-HIGH-01: Booking thiếu fields
- DB-HIGH-02: Polymorphic relations khác contract
- DB-HIGH-03: Thiếu indexes
- INFRA-HIGH-01: Redis chạy nhưng không dùng

---

## Kết luận

Việc **chuyển BE từ Java Spring Boot sang Node.js + Express + Prisma** là một quyết định lớn. Codebase mới đơn giản hơn, dễ maintain hơn, nhưng **mất nhiều feature đã được implement và test kỹ trong 9 đợt review trước**:

1. ❌ **Security**: Không rate limiting, không CORS config, JWT_SECRET fallback, không cookie auth
2. ❌ **Payment**: VNPay mock, không HMAC-SHA512
3. ❌ **Booking**: Không inventory management, không scheduled expiry
4. ❌ **Auth**: Không refresh token, không `/me`, không logout
5. ❌ **Contract**: 10+ endpoint mismatches với FE
6. ❌ **DB**: Float cho tiền, không migration history, thiếu fields
7. ❌ **Infra**: docker-compose không tương thích

**Khuyến nghị**: 
- **KHÔNG deploy production** ở trạng thái hiện tại — 17 Critical phải fix trước.
- **Phase 1 (1-2 tuần, ~35 SP)**: Fix 17 Critical + 14 High → BE chạy được với FE.
- **Phase 2 (1 tuần, ~13 SP)**: Fix Medium + Low.
- **Phase 3**: Long-term hardening (codegen, tests, CI/CD, observability).

Codebase mới có **tiềm năng tốt** (TypeScript + Prisma là stack hiện đại), nhưng cần **đầu tư thời gian để đạt lại maturity level** của Java BE trước đó (từ 3 issue → 47 issue là regression đáng kể).

---

> **Báo cáo kết thúc.**
> Review-only — KHÔNG fix. Tổng cộng **47 issue** (sau đợt 10: Node.js rewrite), gồm 17 Critical + 14 High + 11 Medium + 5 Low. Codebase BE mới cần nhiều work để đạt production-ready.
