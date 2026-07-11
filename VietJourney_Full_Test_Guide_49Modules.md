# VIETJOURNEY — HƯỚNG DẪN TEST TOÀN DIỆN 49 MODULE
### Kèm Security Testing chi tiết — dùng để giao cho AI Agent tự kiểm tra từng module

> **Nguyên tắc bắt buộc trước khi bắt đầu:** Agent phải chạy TỪNG lệnh/test case bên dưới bằng công cụ thật (curl, script, query DB trực tiếp) và dán **kết quả thật** (response, log, số liệu DB trước/sau). Không được viết "đã kiểm tra OK", "hoạt động tốt", "đã xử lý" mà không kèm bằng chứng. Với mỗi module, agent bắt buộc kết luận bằng 1 trong 4 nhãn: `✅ PASS` (có bằng chứng), `❌ FAIL` (có bằng chứng lỗi), `⚠️ PARTIAL` (pass 1 phần, liệt kê rõ phần nào fail), `❓ NOT TESTED` (chưa test được, nêu lý do). Nghiêm cấm agent tự gán `✅ PASS` cho module mà không có output thật đính kèm.

> **Cách dùng file này:** Copy nguyên 1 Module (kèm Part 0 — Master Checklist) làm 1 prompt riêng cho agent, không đưa cả file 1 lúc. Sau khi agent trả lời, đối chiếu với `VietJourney_Verification_Checklist.md` đã có để tự verify độc lập những phần rủi ro cao.

---

# PHẦN 0 — PHƯƠNG PHÁP LUẬN & MASTER SECURITY CHECKLIST

Đây là bộ kiểm tra nền tảng áp dụng lặp lại cho phần lớn 49 module — mỗi module bên dưới sẽ trích dẫn lại các mã checklist này (VD: `[AUTH-01]`, `[IDOR-01]`) thay vì viết lại toàn bộ, để agent hiểu category rủi ro cần test mà không bỏ sót.

## 0.1. Nhóm AUTH — Authentication & Session

- `[AUTH-01]` Gọi API cần đăng nhập nhưng **không kèm token** → phải trả `401 Unauthorized`.
- `[AUTH-02]` Gọi API với token **hết hạn** (JWT `exp` đã qua) → phải trả `401`, không được chấp nhận.
- `[AUTH-03]` Gọi API với token bị **sửa payload** (đổi `role` từ `customer` thành `admin` ngay trong JWT decode, không ký lại — kỳ vọng chữ ký sai) → phải trả `401`, không được tin vào payload chưa verify chữ ký.
- `[AUTH-04]` Gọi API với token **thuộc user khác** (đã logout hoặc bị revoke, nếu hệ thống có cơ chế blacklist/refresh rotation) → kiểm tra có bị chặn không.
- `[AUTH-05]` Đăng nhập sai mật khẩu liên tục 5+ lần → tài khoản phải bị khoá tạm (rate limit / account lockout), không cho thử vô hạn.
- `[AUTH-06]` Refresh token: dùng refresh token cũ **sau khi đã refresh 1 lần** (nếu có cơ chế rotation) → phải bị từ chối (chống replay).
- `[AUTH-07]` Session/token phải tự hết hạn đúng TTL cấu hình — không được vô thời hạn.

## 0.2. Nhóm AUTHZ — Authorization / RBAC / IDOR

- `[AUTHZ-01]` Token role Customer gọi API dành riêng cho Admin/Staff → phải `403 Forbidden`.
- `[AUTHZ-02]` **IDOR (Insecure Direct Object Reference):** User A dùng token của mình gọi API lấy/sửa resource thuộc về User B (chỉ đổi ID trên URL, VD `/api/bookings/{idCủaUserB}`) → phải bị chặn (403/404), không được trả về dữ liệu hoặc cho sửa.
- `[AUTHZ-03]` Test toàn bộ CRUD (Create/Read/Update/Delete) theo từng role — không chỉ test GET, phải test cả PATCH/DELETE với ID không thuộc về mình.
- `[AUTHZ-04]` Guest (không token) cố truy cập tính năng chỉ Customer mới có → phải bị chặn ở tầng Backend (không chỉ ẩn UI Frontend).

## 0.3. Nhóm VALID — Input Validation & Injection

- `[VALID-01]` **SQL/NoSQL Injection:** Nhập ký tự đặc biệt (`' OR '1'='1`, `"; DROP TABLE users; --`) vào các trường input (search, filter, form) → phải bị escape/parameterize, không được lỗi 500 hoặc trả dữ liệu bất thường.
- `[VALID-02]` **XSS (Stored/Reflected):** Nhập `<script>alert(1)</script>` vào các trường text tự do (feedback, tên, tiêu đề bài viết) → khi hiển thị lại, script không được thực thi (phải render dưới dạng text thuần).
- `[VALID-03]` **Validate giá trị biên:** số âm, số 0, chuỗi rỗng, giá trị vượt giới hạn (VD số hành khách = -1 hoặc = 9999) → API phải trả `400`, không được chấp nhận và gây lỗi logic phía sau.
- `[VALID-04]` **Mass Assignment:** Gửi thêm field lạ không có trong form chuẩn (VD gửi kèm `role: "admin"` hoặc `price: 0` vào body request tạo user/booking) → backend phải bỏ qua field không được phép set từ client, không được để client tự ý ghi đè field nhạy cảm.
- `[VALID-05]` Kiểm tra Content-Type/kiểu dữ liệu sai (gửi string thay vì number cho field số) → phải bị từ chối rõ ràng, không crash server.

## 0.4. Nhóm RACE — Concurrency & Race Condition

- `[RACE-01]` Bắn N request đồng thời (`Promise.all`, không tuần tự) vào cùng 1 tài nguyên có giới hạn số lượng (ghế, slot, mã voucher giới hạn lượt dùng, số dư ví) → chỉ đúng số lượng cho phép được xử lý thành công, phần dư phải bị từ chối có kiểm soát (409/400), không được vượt giới hạn.
- `[RACE-02]` Kiểm tra bằng DB query trước/sau, không chỉ nhìn response HTTP — vì response có thể "trông đúng" nhưng DB vẫn bị lệch số liệu.

## 0.5. Nhóm STATE — Business State Machine Integrity

- `[STATE-01]` Thử chuyển trạng thái không hợp lệ (VD: gọi API hủy 1 booking đã ở trạng thái `CANCELLED`, hoặc thanh toán 1 booking đã `EXPIRED`) → phải bị chặn, trả lỗi rõ ràng.
- `[STATE-02]` Kiểm tra không có đường vòng nào (API khác) có thể sửa trạng thái trực tiếp bỏ qua luồng nghiệp vụ chuẩn (VD: PATCH thẳng field `status` qua 1 API update chung chung không có validate).

## 0.6. Nhóm RATE — Rate Limiting & Abuse

- `[RATE-01]` Gọi lặp lại API nhạy cảm (login, gửi OTP, tạo QR thanh toán) > ngưỡng cho phép trong thời gian ngắn → phải bị `429 Too Many Requests` hoặc cơ chế chặn tương đương.

## 0.7. Nhóm LEAK — Data Exposure

- `[LEAK-01]` Kiểm tra response API có trả về field nhạy cảm không cần thiết (password hash, secret key, token nội bộ, thông tin user khác không liên quan) → phải được lọc bỏ (DTO/serializer rõ ràng), không trả nguyên object DB.
- `[LEAK-02]` Kiểm tra thông báo lỗi (error message) không được lộ chi tiết kỹ thuật nhạy cảm (stack trace, câu SQL, đường dẫn server thật) ra ngoài production.

## 0.8. Nhóm FILE — Upload Security (áp dụng module có upload ảnh/video/file)

- `[FILE-01]` Upload file sai định dạng khai báo (đổi đuôi `.exe` thành `.jpg`) → phải kiểm tra magic number/MIME type thật, không chỉ tin đuôi file.
- `[FILE-02]` Upload file vượt giới hạn dung lượng → phải bị chặn với thông báo rõ ràng.
- `[FILE-03]` Upload file có tên chứa path traversal (`../../etc/passwd`) → phải bị chuẩn hoá/từ chối tên file.

---

# PHẦN 1 — TEST CHI TIẾT TỪNG MODULE (1 → 48)

Ký hiệu mức độ ưu tiên: 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low.

---

## MODULE 1 — Trang chủ (Home) 🟡

**Precondition:** Không cần đăng nhập.

**Functional Test Cases:**
- FTC-1-01: Load trang, xác nhận Hero Banner/slideshow render đủ số lượng banner từ API `GET /api/cms/banners`, không hardcode.
- FTC-1-02: Bấm CTA "Book Now" → điều hướng đúng tới Search; "Check-in" → `/checkin`; "Flight Status" → `/flight-status`.
- FTC-1-03: Widget tìm kiếm nhanh submit đúng, chuyển sang trang kết quả kèm đúng query params.
- FTC-1-04: Section Destination filter Domestic/International trả đúng tập dữ liệu tương ứng (query DB xác nhận).

**Security Test Cases:**
- `[VALID-01]`, `[VALID-02]` áp dụng cho input tìm kiếm nhanh ở Home (nếu có ô nhập text tự do).
- `[LEAK-01]`: kiểm tra API banner/promotion công khai không vô tình trả kèm field nội bộ (VD `internalNote`, `createdBy.email`).

**Data Integrity:** Thêm 1 banner mới qua Admin, load lại Home, xác nhận xuất hiện đúng — chứng minh không phải data tĩnh hardcode.

**Red Flag Checklist:**
- [ ] Banner/Destination có đang là mock JSON tĩnh trong code không? (`grep -rn "mockBanner\|mockDestination" src/`)
- [ ] CTA có thật sự gọi API hay chỉ là link tĩnh?

---

## MODULE 2 — Đăng ký 🔴

**Precondition:** Có email test chưa từng đăng ký.

**Functional Test Cases:**
- FTC-2-01: Đăng ký với email hợp lệ, mật khẩu đủ mạnh → nhận OTP, xác thực OTP đúng → tài khoản active.
- FTC-2-02: Đăng ký với email **đã tồn tại** → phải trả lỗi rõ ràng (`409 Conflict` hoặc tương đương), không tạo user trùng.
- FTC-2-03: Mật khẩu yếu (< 8 ký tự, không hoa/thường/số) → bị chặn validation.
- FTC-2-04: Confirm password không khớp → bị chặn ở cả FE lẫn BE (không tin FE-only).
- FTC-2-05: OTP sai → bị từ chối, không active tài khoản.
- FTC-2-06: OTP hết hạn (đợi qua TTL, VD 5 phút) → bị từ chối, phải yêu cầu gửi lại.

**Security Test Cases:**
- `[VALID-01]`, `[VALID-02]`: nhập full name chứa `<script>` hoặc SQLi payload.
- `[VALID-04]`: gửi kèm field `role: "admin"` hoặc `isVerified: true` trong body đăng ký → backend phải bỏ qua, không set được.
- `[RATE-01]`: gửi OTP liên tục > 5 lần/giờ cho cùng 1 email → phải bị chặn.
- Test **User Enumeration**: đăng ký với email đã tồn tại — response message có tiết lộ rõ "email đã tồn tại" theo cách giúp kẻ xấu dò danh sách email hợp lệ hàng loạt không? (Chấp nhận được ở màn đăng ký vì UX cần biết, nhưng phải có rate limit đi kèm để chống dò hàng loạt).

**Data Integrity:** Query DB xác nhận password được lưu dưới dạng hash (BCrypt), không phải plaintext.
```bash
# Kiểm tra trực tiếp
grep -rn "bcrypt\|argon2" backend/src --include="*.ts"
```

**Red Flag Checklist:**
- [ ] Password có bị log ra console/log file ở bất kỳ đâu không? (`grep -rn "console.log.*password" backend/src`)
- [ ] OTP có bị trả về luôn trong response API (để debug) mà quên xóa trước khi lên production không?

---

## MODULE 3 — Đăng nhập 🔴

**Functional Test Cases:**
- FTC-3-01: Đăng nhập đúng email/password → nhận access token + refresh token.
- FTC-3-02: Đăng nhập bằng SĐT (nếu hỗ trợ) → tương tự.
- FTC-3-03: "Remember me" → refresh token TTL dài hơn (kiểm tra decode JWT `exp` để xác nhận thời hạn thật, không chỉ tin UI).
- FTC-3-04: Đăng nhập sai mật khẩu → lỗi rõ ràng, không tiết lộ "email không tồn tại" vs "sai mật khẩu" khác nhau (tránh user enumeration).

**Security Test Cases:**
- `[AUTH-05]` — **Trọng tâm module này.** Test brute-force: script gửi 10 lần sai mật khẩu liên tục, xác nhận sau ngưỡng (VD lần thứ 6) bị khoá/rate-limit.
```bash
for i in {1..10}; do
  curl -s -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrongpass'"$i"'"}' \
    -o /dev/null -w "Attempt $i: %{http_code}\n"
done
```
- `[VALID-01]`: SQLi trong ô email/password (`admin' --`, `' OR 1=1 --`).
- Kiểm tra token JWT: decode thử (jwt.io hoặc thư viện) xem có lộ thông tin nhạy cảm trong payload không (password, số điện thoại đầy đủ...).
- Kiểm tra thuật toán ký JWT: xác nhận không dùng `alg: none` (lỗ hổng JWT kinh điển).
- `[AUTH-06]`: nếu có refresh rotation, test dùng lại refresh token cũ sau khi đã refresh.

**Red Flag Checklist:**
- [ ] JWT secret có bị hardcode trong code (không đọc từ `process.env`) không?
- [ ] Access token TTL có thực sự ngắn (15 phút) như spec, hay bị set dài (VD 7 ngày) cho "tiện dev" rồi quên đổi lại?

---

## MODULE 4 — Quên mật khẩu 🟠

**Functional Test Cases:**
- FTC-4-01: Luồng đầy đủ 3 bước: nhập email → OTP → đặt mật khẩu mới → đăng nhập lại bằng mật khẩu mới thành công.
- FTC-4-02: Reset token/OTP hết hạn → bị từ chối ở bước đặt mật khẩu mới.
- FTC-4-03: Dùng lại cùng 1 reset token 2 lần → lần 2 phải bị từ chối (token chỉ dùng 1 lần).

**Security Test Cases:**
- Test **User Enumeration** nghiêm ngặt hơn Module 2: khi nhập email **không tồn tại** ở bước "Nhập email", response phải giống hệt (cùng message, cùng status code, cùng thời gian phản hồi tương đối) như khi nhập email **có tồn tại** — nếu khác nhau, kẻ xấu có thể dò được email nào đã đăng ký.
```bash
# So sánh response giữa email tồn tại và không tồn tại
curl -s -X POST http://localhost:5000/api/auth/otp/send \
  -d '{"email":"email_ton_tai@test.com","purpose":"RESET_PASSWORD"}' -w "\n%{http_code}\n"
curl -s -X POST http://localhost:5000/api/auth/otp/send \
  -d '{"email":"email_khong_ton_tai_12345@test.com","purpose":"RESET_PASSWORD"}' -w "\n%{http_code}\n"
# Kỳ vọng: 2 response giống hệt nhau
```
- `[RATE-01]`: giới hạn số lần gửi OTP quên mật khẩu.

**Red Flag Checklist:**
- [ ] Reset token có bị lộ trong URL email dạng dễ đoán (số tăng dần) không, hay dùng UUID/random đủ dài?

---

## MODULE 5 — Hồ sơ cá nhân 🟡

**Functional Test Cases:**
- FTC-5-01: Update profile (họ tên, ngày sinh...) → lưu đúng, load lại thấy thay đổi.
- FTC-5-02: Đổi mật khẩu: nhập đúng mật khẩu cũ + mật khẩu mới hợp lệ → thành công, đăng nhập lại bằng mật khẩu mới OK.
- FTC-5-03: Đổi mật khẩu với mật khẩu cũ **sai** → bị từ chối.
- FTC-5-04: Upload avatar → ảnh được lưu, hiển thị đúng.

**Security Test Cases:**
- `[AUTHZ-02]` IDOR: User A gọi `PATCH /api/account/profile` hoặc endpoint dạng `/api/users/{id}` (nếu có) với ID của User B → phải bị chặn.
- `[FILE-01]`, `[FILE-02]`, `[FILE-03]` áp dụng đầy đủ cho upload avatar.
- `[VALID-04]`: gửi kèm field `role` hoặc `email` (nếu email không nên đổi qua form này) trong body update profile → xác nhận backend không cho sửa field ngoài whitelist.
- Kiểm tra đổi mật khẩu có **invalidate các session/token cũ** không (bảo mật tốt: đổi mật khẩu xong, các thiết bị đăng nhập khác nên bị logout).

**Red Flag Checklist:**
- [ ] Endpoint update profile có vô tình cho phép sửa `role`/`isAdmin` không (test bằng body có field lạ)?

---

## MODULE 6 — Loyalty Account 🟡

**Functional Test Cases:**
- FTC-6-01: Xem đúng số dặm/điểm hiện tại, khớp với lịch sử giao dịch cộng dồn.
- FTC-6-02: Sau khi 1 booking chuyển `COMPLETED`, điểm phải được cộng đúng % quy định (query DB xác nhận thời điểm cộng — phải là lúc `COMPLETED`, không phải lúc `CONFIRMED`).
- FTC-6-03: Nếu booking đó sau đó bị hủy/hoàn tiền (trường hợp hi hữu), điểm đã cộng có bị trừ lại không (nếu có business rule này)?

**Security Test Cases:**
- `[AUTHZ-02]` IDOR: xem lịch sử loyalty của user khác qua đổi ID.
- Test thử gọi thẳng API (nếu tồn tại) cộng điểm thủ công từ phía client → phải bị chặn hoàn toàn (chỉ server-side tự tính, không có endpoint nào cho client tự cộng điểm cho mình).

**Red Flag Checklist:**
- [ ] Có tồn tại endpoint nào để tự sửa số điểm mà không qua kiểm tra role Admin không?

---

## MODULE 7-8 — Flight Search & Results 🟠

**Functional Test Cases:**
- FTC-7-01: Tìm kiếm hợp lệ trả kết quả đúng theo Origin/Destination/Date.
- FTC-7-02: Điểm đi = điểm đến → `400`.
- FTC-7-03: Ngày về trước ngày đi → `400`.
- FTC-7-04: Ngày tìm kiếm ở **quá khứ** → `400`.
- FTC-7-05: Số hành khách vượt giới hạn (> 9) → `400`.
- FTC-7-06: Sort theo Price/Duration/Departure/Arrival trả đúng thứ tự.
- FTC-7-07: Filter theo khung giờ/hãng/số điểm dừng/khoảng giá trả đúng tập con dữ liệu.

**Security Test Cases:**
- `[VALID-01]` SQLi trong query param `?origin='; DROP TABLE flights;--`.
- `[VALID-03]` Giá trị biên: `adults=-1`, `adults=0`, `adults=99999`.
- Test **NoSQL/ORM injection** nếu dùng Prisma raw query ở đâu đó trong search — kiểm tra toàn bộ chỗ dùng `$queryRawUnsafe`/`$executeRawUnsafe` có nội suy trực tiếp string từ input không (rất nguy hiểm nếu có).
```bash
grep -rn "queryRawUnsafe\|executeRawUnsafe" backend/src --include="*.ts"
# Với mỗi kết quả, kiểm tra tham số truyền vào có phải placeholder (?/$1) hay bị nối chuỗi trực tiếp
```
- Test tìm kiếm với ký tự đặc biệt trong tên sân bay (`%`, `_` — ký tự đại diện SQL LIKE) xem có gây lỗi hoặc trả kết quả bất thường không.

**Data Integrity:** Thêm 1 chuyến bay mới trực tiếp qua DB/Admin, search lại xác nhận xuất hiện — chứng minh dữ liệu động thật, không phải mock.

**Red Flag Checklist:**
- [ ] Kết quả search có đang là mảng cứng hardcode trong code không?
- [ ] Giá hiển thị trong kết quả search có khớp đúng giá trong DB tại đúng thời điểm không (test đổi giá 1 chuyến bay ở Admin, search lại xem có cập nhật không)?

---

## MODULE 9 — Chọn hành lý (Extra baggage) 🟢

**Functional Test Cases:**
- FTC-9-01: Chọn gói 5/10/15/20kg → giá cộng đúng vào tổng tiền booking draft (kiểm tra bằng API response, không chỉ nhìn UI).
- FTC-9-02: Chọn vượt giới hạn tối đa cho phép → bị chặn.

**Security Test Cases:**
- `[VALID-03]` Gửi `extraBaggageKg: -5` hoặc số cực lớn → phải bị chặn.
- `[VALID-04]` Gửi kèm `price: 0` trực tiếp trong body (thử ép giá về 0 từ client) → backend phải tự tính giá theo cấu hình server-side, tuyệt đối không tin giá client gửi lên.

**Red Flag Checklist:**
- [ ] Giá tiền dịch vụ bổ trợ có được tính lại ở Backend hay tin thẳng số Frontend gửi lên? (Đây là lỗi kinh điển — luôn kiểm tra kỹ mọi module liên quan đến tiền).

---

## MODULE 10 — Chọn suất ăn (Meal) 🟢

**Functional Test Cases:**
- FTC-10-01: Chọn suất ăn đặc biệt (Vegetarian/Muslim/Kid/Seafood) trước 24h giờ bay → được chấp nhận.
- FTC-10-02: Chọn suất ăn đặc biệt trong vòng 24h trước giờ bay → chỉ cho chọn suất tiêu chuẩn (theo business rule đã spec), kiểm tra backend có thực sự enforce rule này không hay chỉ FE disable UI.

**Security Test Cases:**
- `[VALID-04]` Tương tự Module 9 — không tin giá món ăn từ client.

---

## MODULE 11 — Nhập thông tin hành khách 🟠

**Functional Test Cases:**
- FTC-11-01: Nhập đủ thông tin hợp lệ cho Adult/Child/Infant → lưu đúng vào booking draft.
- FTC-11-02: Thiếu trường bắt buộc → bị chặn.
- FTC-11-03: Ngày sinh không khớp loại hành khách đã khai (VD khai Child nhưng nhập ngày sinh của người 30 tuổi) → bị chặn.
- FTC-11-04: Passport hết hạn (ngày hết hạn < ngày hiện tại) cho chuyến bay quốc tế → cảnh báo/chặn theo rule.
- FTC-11-05: Member đăng nhập → danh sách "hành khách đã lưu" chỉ hiển thị hành khách của **chính user đó**, không lẫn của user khác.

**Security Test Cases:**
- `[AUTHZ-02]` IDOR: gọi API lấy `saved-passengers` bằng token User A nhưng cố truy vấn passenger thuộc User B (nếu API có tham số ID passenger) → phải bị chặn.
- `[VALID-01]`, `[VALID-02]`: tên hành khách chứa script/SQLi.
- `[LEAK-01]`: kiểm tra response trả về không lộ passport/CCCD đầy đủ ở những nơi không cần thiết (VD danh sách booking tổng quan chỉ nên hiện vài ký tự cuối, không cần full số).

---

## MODULE 12 — Chọn ghế (Seat Selection) 🔴

**Đây là module đã test kỹ trong phiên làm việc trước (race condition). Checklist đầy đủ:**

**Functional Test Cases:**
- FTC-12-01: Chọn ghế trống hợp lệ → lưu thành công.
- FTC-12-02: Chọn ghế đã bị người khác đặt (status CONFIRMED/PENDING) → bị chặn `409`.
- FTC-12-03: Chọn ghế Emergency row mà chưa tick xác nhận điều kiện → bị chặn.

**Security & Concurrency Test Cases (trọng tâm nhất toàn hệ thống):**
- `[RACE-01]`, `[RACE-02]` — **Bắt buộc dùng script `verify.js` đã cung cấp trước đó**, không test bằng tay qua UI (test tay không bao giờ đủ nhanh để bắt race condition thật).
- `[AUTHZ-02]` IDOR: gọi API update ghế cho `bookingId` không thuộc về mình → phải bị chặn.
- `[VALID-01]` seatNumber chứa ký tự lạ (`12A'; DROP TABLE--`) → phải bị validate format ghế nghiêm ngặt (regex đúng định dạng ghế, VD `^[0-9]{1,3}[A-Z]$`).

**Data Integrity:** Sau test race condition, query trực tiếp bảng `BookingPassenger` xác nhận **đúng 1** bản ghi có `seatNumber` đó cho chuyến bay đó ở trạng thái active, không có bản ghi trùng.

---

## MODULE 13 — Thanh toán (Payment — QR/Card/Ewallet) 🔴

**Đây là module rủi ro cao nhất hệ thống — checklist đầy đủ, tổng hợp lại từ toàn bộ phần đã review sâu trước đó:**

**Functional Test Cases:**
- FTC-13-01: Tạo QR thành công, countdown 5 phút hiển thị đúng.
- FTC-13-02: Thanh toán thành công (webhook SUCCESS hợp lệ) → booking chuyển `CONFIRMED`, email gửi đi.
- FTC-13-03: QR hết hạn (>5 phút không thanh toán) → Cron job chuyển `EXPIRED`, ghế được giải phóng (query DB xác nhận).
- FTC-13-04: Thanh toán thất bại (webhook FAILED) → booking `CANCELLED`, ghế giải phóng, `availableSeats` tăng đúng.

**Security Test Cases (bắt buộc, không được bỏ qua bất kỳ mục nào):**
- `[VALID-01]`+ đặc thù: Webhook gọi với chữ ký **sai** → `401`, không update DB. (Test bằng `verify.js` Test 2).
- Webhook gọi với chữ ký **đúng nhưng số tiền không khớp** giao dịch gốc → phải bị đánh dấu `AMOUNT_MISMATCH`, KHÔNG tự động confirm booking.
```bash
# Test amount mismatch — build chữ ký cho amount SAI so với giao dịch gốc
# (dùng script verify.js, sửa payload.amount khác với DB gốc, ký lại đúng chữ ký,
#  gửi lên — kỳ vọng: KHÔNG chuyển CONFIRMED dù chữ ký đúng)
```
- `[RACE-01]` Webhook gửi trùng (đồng thời, 2 request) cùng `transactionId` → chỉ xử lý 1 lần (Test bằng `verify.js` Test 3), tự query DB xác nhận không double-credit/double-email.
- Test đồng bộ Cron job vs Webhook trễ: giả lập giao dịch hết hạn (đợi Cron xử lý trước), sau đó vẫn gửi webhook `SUCCESS` cho giao dịch đó → phải bị chặn ở bước idempotency (vì `Payment.status` đã khác `PENDING`), không được confirm booking đã hết hạn.
- `[AUTHZ-01]` endpoint `POST /api/payments/webhook` — xác nhận **không yêu cầu** JWT user (đúng vì đây là server-to-server), nhưng phải bắt buộc header chữ ký, không được để endpoint này public hoàn toàn không xác thực gì.
- `[RATE-01]` giới hạn số lần tạo QR liên tục cho cùng 1 booking (chống spam tạo giao dịch rác).
- `[LEAK-01]` response tạo QR không được lộ secret key/HMAC key trong bất kỳ field nào trả về client.
- Kiểm tra `crypto.timingSafeEqual` được dùng đúng (không dùng `===`/`!==` so sánh chữ ký).
- Kiểm tra biến môi trường secret không có fallback ngầm (`|| 'MOCK_SECRET'`).

**Data Integrity — bắt buộc kiểm 3 điểm mỗi lần test:**
1. `Payment.status` đúng trạng thái.
2. `Booking.status` đồng bộ đúng với `Payment.status`.
3. `Flight.availableSeats` / `BookingPassenger.seatNumber` được cập nhật đúng, không lệch số.

---

## MODULE 14 — Payment Success 🟡

**Functional Test Cases:**
- FTC-14-01: Hiển thị đúng Booking ID, danh sách hành khách, thông tin chuyến bay khớp DB.
- FTC-14-02: Download Ticket (PDF) — file tải về mở được, đúng thông tin.

**Security Test Cases:**
- `[AUTHZ-02]` IDOR: truy cập trực tiếp URL `/booking/e-ticket/{pnr}` của booking **không thuộc về mình** (Guest hoặc user khác) → nếu route công khai theo PNR, phải yêu cầu kèm thêm thông tin xác thực phụ (VD Last Name) giống Manage Booking, không được để lộ toàn bộ thông tin hành khách chỉ bằng cách đoán PNR.
- Test đoán PNR ngẫu nhiên (PNR thường là chuỗi ngắn, dễ đoán/enumerate) → xác nhận có cơ chế chống dò (rate limit tra cứu theo IP, hoặc bắt buộc kèm Last Name).

---

## MODULE 15 — Payment Failed 🟡

**Functional Test Cases:**
- FTC-15-01: Hiển thị đúng lý do thất bại.
- FTC-15-02: "Retry" tạo giao dịch mới đúng cách, không tạo booking trùng.
- FTC-15-03: Retry khi booking đã hết hạn hoàn toàn (quá cả thời gian ân hạn) → phải bị chặn, bắt buộc tạo booking mới từ đầu.

---

## MODULE 16 — Booking History 🟠

**Functional Test Cases:**
- FTC-16-01: Danh sách chỉ hiển thị booking của user đang đăng nhập.
- FTC-16-02: Filter theo ngày/trạng thái/mã booking hoạt động đúng.

**Security Test Cases:**
- `[AUTHZ-02]` **Trọng tâm module này:** sửa param `userId` (nếu API nhận param này thay vì lấy từ token) → phải bị chặn/bỏ qua, chỉ được lấy user từ token đã xác thực, tuyệt đối không tin `userId` client gửi lên.
```bash
curl -H "Authorization: Bearer <token_user_A>" \
  "http://localhost:5000/api/account/bookings?userId=<id_user_B>"
# Kỳ vọng: chỉ trả booking của user_A (theo token), bỏ qua param userId lạ, KHÔNG được trả data của user_B
```

---

## MODULE 17 — Manage Booking 🔴

**Functional Test Cases:**
- FTC-17-01: Tra cứu đúng PNR + Last Name → xem được chi tiết.
- FTC-17-02: Tra cứu sai Last Name (đúng PNR) → phải bị từ chối, không lộ thông tin.
- FTC-17-03: Đổi ngày/ghế/thêm hành lý/hủy vé hoạt động đúng theo chính sách phí.
- FTC-17-04: Hủy vé < 3h trước giờ bay → bị chặn (đã fix ở phiên trước, cần re-test lại sau mọi thay đổi liên quan).

**Security Test Cases:**
- `[AUTHZ-02]` IDOR nghiêm trọng nhất: tra cứu bằng đúng PNR nhưng **Last Name sai** → phải bị từ chối hoàn toàn, không trả về bất kỳ phần dữ liệu nào (kể cả một phần).
- `[RATE-01]` Brute-force PNR: PNR thường ngắn (6 ký tự) → nguy cơ dò được PNR hợp lệ bằng thử hàng loạt. Kiểm tra có rate-limit theo IP cho endpoint lookup không.
```bash
for i in {1..20}; do
  curl -s "http://localhost:5000/api/bookings/lookup?pnr=TEST$i&lastName=Nguyen" \
    -o /dev/null -w "PNR TEST$i: %{http_code}\n"
done
# Kỳ vọng: sau N lần thử liên tục thất bại, bắt đầu bị 429
```
- `[STATE-01]` gọi API hủy vé 2 lần liên tiếp cho cùng booking đã `CANCELLED` → lần 2 phải bị chặn, không xử lý lại (tránh hoàn tiền/giải phóng ghế 2 lần).

---

## MODULE 18 — Flight Status 🟢

**Functional Test Cases:**
- FTC-18-01: Tra cứu theo Flight Number trả đúng trạng thái/Gate/Terminal.
- FTC-18-02: Tra cứu chuyến bay không tồn tại → thông báo rõ ràng, không lỗi 500.

**Security Test Cases:**
- `[VALID-01]` SQLi trong flight number.
- Đây là API public, không có dữ liệu nhạy cảm — rủi ro thấp, nhưng vẫn kiểm tra `[RATE-01]` để chống scrape dữ liệu hàng loạt.

---

## MODULE 19 — Online Check-in 🔴

**Functional Test Cases:**
- FTC-19-01: Check-in hợp lệ trong khung giờ cho phép (24h → 1h trước bay) → thành công, xuất Boarding Pass.
- FTC-19-02: Check-in ngoài khung giờ (quá sớm hoặc quá trễ) → bị chặn, đã fix ở phiên trước, cần **re-test lại bằng đồng hồ thật** (tạo booking có `departureTime` giả lập đúng biên giờ để test chính xác, không chỉ đọc code).
- FTC-19-03: Check-in booking đã bị hủy → bị chặn.
- FTC-19-04: Check-in 2 lần cho cùng 1 hành khách → lần 2 phải báo "đã check-in rồi", không tạo boarding pass trùng.

**Security Test Cases:**
- `[AUTHZ-02]` tương tự Manage Booking: PNR đúng + Last Name sai → chặn hoàn toàn.
- `[RATE-01]` brute-force PNR check-in tương tự Module 17.
- `[STATE-01]` không cho seat đã check-in bị đổi bởi request check-in khác cùng lúc (race condition tương tự Module 12 nếu cho chọn ghế ngay lúc check-in).

---

## MODULE 20 — Boarding Pass 🟡

**Functional Test Cases:**
- FTC-20-01: QR code trên Boarding Pass chứa đúng thông tin (PNR, tên hành khách, chuyến bay) — decode thử QR để xác nhận nội dung, không chỉ nhìn hình.
- FTC-20-02: Download PDF/Add to Wallet hoạt động đúng.

**Security Test Cases:**
- Kiểm tra QR code có chứa thông tin nhạy cảm dạng plaintext dễ đọc không (VD số CCCD/Passport đầy đủ) — nên hạn chế tối đa dữ liệu nhạy cảm nhúng trong QR vì QR có thể bị người khác chụp/quét.
- `[AUTHZ-02]` truy cập link tải Boarding Pass PDF của booking khác qua đoán URL.

---

## MODULE 21 — Destination 🟢

**Functional Test Cases:**
- FTC-21-01: Danh sách, search, filter Domestic/International hoạt động đúng.
- FTC-21-02: Map hiển thị đúng marker toạ độ.

**Security Test Cases:**
- `[VALID-01]` SQLi trong ô search điểm đến.
- Rủi ro thấp (public, read-only), tập trung test cơ bản.

---

## MODULE 22 — Tour Detail 🟠

**Functional Test Cases:**
- FTC-22-01: Hiển thị đúng giá, lịch trình, gallery.
- FTC-22-02: Review hiển thị đúng — chỉ review đã `PUBLISHED` mới hiện công khai, review `PENDING_REVIEW`/`REJECTED` không được lộ ra ngoài.
- FTC-22-03: Nút "Book Tour" dẫn đúng luồng đặt chỗ.

**Security Test Cases:**
- `[LEAK-01]` API chi tiết Tour không được lộ review chưa duyệt qua response (kiểm tra kỹ field trả về, không chỉ tin UI có ẩn hay không — phải kiểm tra ở tầng API).
```bash
curl "http://localhost:5000/api/tours/1" | grep -i "PENDING_REVIEW"
# Kỳ vọng: không tìm thấy — nghĩa là API không leak review chưa duyệt
```

---

## MODULE 23 — Promotion Detail 🟢

**Functional Test Cases:**
- FTC-23-01: Hiển thị đúng điều kiện áp dụng.
- FTC-23-02: Promotion hết hạn không được hiển thị link "Áp dụng ngay" hoạt động (hoặc phải báo lỗi khi thử áp dụng).

**Security Test Cases:**
- `[VALID-03]` thử áp dụng voucher đã hết hạn qua API trực tiếp (bỏ qua UI) → backend phải tự validate lại (không tin UI đã disable nút).

---

## MODULE 24-25 — News & News Detail 🟢

**Functional Test Cases:**
- FTC-24-01: List, category filter, search, pagination hoạt động đúng.
- FTC-25-01: Related posts gợi ý đúng theo category.

**Security Test Cases:**
- `[VALID-02]` XSS: nếu News dùng Rich Text Editor (Module 44 Admin), kiểm tra nội dung HTML từ Admin khi hiển thị ra Frontend có bị sanitize không (dù là Admin nhập, vẫn nên sanitize để chống trường hợp tài khoản Admin bị chiếm quyền chèn script độc hại vào bài viết ảnh hưởng hàng loạt user đọc).

---

## MODULE 26 — Contact 🟢

**Functional Test Cases:**
- FTC-26-01: Gửi form hợp lệ → lưu vào DB, tạo notification cho Support.
- FTC-26-02: Upload file đính kèm hoạt động đúng.

**Security Test Cases:**
- `[FILE-01]`, `[FILE-02]`, `[FILE-03]` đầy đủ.
- `[VALID-02]` XSS trong nội dung message (vì Support sẽ đọc lại nội dung này ở Admin — nếu không sanitize, đây là vector XSS nhắm vào chính Admin/Staff).
- `[RATE-01]` chống spam form liên hệ (giới hạn số lần gửi/IP/giờ).

---

## MODULE 27 — FAQ 🟢

**Functional Test Cases:**
- FTC-27-01: Accordion, search, filter category hoạt động đúng.

**Security Test Cases:**
- Rủi ro thấp, chỉ cần `[VALID-01]` cơ bản cho ô search.

---

## MODULE 28 — Feedback 🔴

**Functional Test Cases:**
- FTC-28-01: Viết feedback khi booking `COMPLETED` → thành công, trạng thái `PENDING_REVIEW`.
- FTC-28-02: Viết feedback khi booking **chưa COMPLETED** (VD mới `CONFIRMED`) → phải bị chặn ở Backend (test trực tiếp API, đừng chỉ tin nút bị ẩn ở FE).
- FTC-28-03: Viết feedback cho booking **không phải của mình** → bị chặn.
- FTC-28-04: Edit feedback sau thời hạn cho phép (VD sau 24h) → bị chặn.
- FTC-28-05: Like/Report feedback hoạt động đúng, không cho like/report trùng nhiều lần bởi cùng 1 user (nếu có giới hạn 1 like/user).
- FTC-28-06: Admin reply hiển thị đúng, chỉ Admin/Support mới gọi được API reply.

**Security Test Cases:**
- `[AUTHZ-02]` **Trọng tâm:** gọi thẳng `POST /api/reviews` với `bookingId` không thuộc user hiện tại (dù JWT hợp lệ của user khác) → phải bị chặn bằng cách kiểm tra `booking.userId === req.user.id` ở Backend, không chỉ dựa vào UI chỉ hiện nút cho booking của chính mình.
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Authorization: Bearer <token_user_A>" \
  -H "Content-Type: application/json" \
  -d '{"bookingId": <id_thuoc_ve_user_B>, "rating":5, "content":"test"}'
# Kỳ vọng: 403/400, KHÔNG được tạo review thành công
```
- `[VALID-02]` XSS trong content feedback — kiểm tra kỹ vì đây là nội dung public, hiển thị cho mọi khách xem Tour/Flight.
- `[FILE-01]`-`[FILE-03]` cho upload ảnh/video kèm feedback.
- `[STATE-01]` gọi API approve/reject review 2 lần liên tiếp (đã approve rồi lại approve/reject) → kiểm tra có xử lý idempotent hợp lý không.
- `[AUTHZ-01]` chỉ Admin/Support mới gọi được `/reviews/{id}/reply`, `/admin/reviews/{id}` approve/reject.

---

## MODULE 29 — Notification 🟡

**Functional Test Cases:**
- FTC-29-01: Bell icon badge đúng số lượng chưa đọc.
- FTC-29-02: Mark as read hoạt động đúng.

**Security Test Cases:**
- `[AUTHZ-02]` IDOR: đánh dấu đã đọc thông báo của user khác qua đổi ID → phải bị chặn.
- `[LEAK-01]` API notification không được trả nhầm thông báo của user khác vào danh sách của mình.

---

## MODULE 30 — Wishlist 🟢

**Functional Test Cases:**
- FTC-30-01: Thêm/xoá Tour/Destination/Promotion khỏi wishlist hoạt động đúng.

**Security Test Cases:**
- `[AUTHZ-02]` xoá wishlist item của user khác qua đổi ID.

---

## MODULE 31 — Chat Support 🟢

**Functional Test Cases:**
- FTC-31-01: Chatbot trả lời câu hỏi cơ bản đúng theo FAQ.
- FTC-31-02: Live chat kết nối đúng với Support qua WebSocket (nếu đã làm).

**Security Test Cases:**
- Nếu dùng WebSocket, kiểm tra `[AUTH-01]` áp dụng cho kết nối WS (phải xác thực token khi connect, không cho connect ẩn danh vào private channel).
- `[VALID-02]` XSS trong tin nhắn chat hiển thị lại cho Support xem.

---

## MODULE 32 — Language (Đổi ngôn ngữ) 🟢

**Functional Test Cases:**
- FTC-32-01: Chuyển VI/EN áp dụng realtime toàn bộ UI, không cần reload.
- FTC-32-02: Lựa chọn được lưu và giữ nguyên sau khi refresh trang/đăng nhập lại.

**Security Test Cases:** Rủi ro thấp — chỉ cần kiểm tra không có nội dung dịch nào bị render qua `dangerouslySetInnerHTML` không sanitize.

---

## MODULE 33 — Currency 🟢

**Functional Test Cases:**
- FTC-33-01: Đổi đơn vị tiền tệ, giá hiển thị convert đúng theo tỷ giá cấu hình.
- FTC-33-02: **Xác nhận giao dịch thanh toán thực tế vẫn tính bằng VNĐ gốc** dù UI hiển thị USD/EUR — đây là điểm quan trọng cần test kỹ: tạo QR thanh toán khi đang chọn hiển thị USD, xác nhận số tiền thật gửi lên cổng thanh toán là VNĐ chính xác, không bị nhầm convert 2 lần.

---

## MODULE 34 — Theme (Dark/Light) 🟢

**Functional Test Cases:**
- FTC-34-01: Toggle theme áp dụng toàn site, lưu localStorage, giữ nguyên sau F5.
- FTC-34-02: Kiểm tra **từng trang chính** (không chỉ Home) có áp dụng dark mode đầy đủ không — đây là chỗ hay bị làm dở dang.

---

## MODULE 35 — Accessibility 🟢

**Functional Test Cases:**
- FTC-35-01: Font size tăng/giảm áp dụng đúng.
- FTC-35-02: High contrast mode hiển thị đúng.
- FTC-35-03: Điều hướng toàn bộ luồng đặt vé chỉ bằng bàn phím (Tab/Enter) — không dùng chuột, xác nhận focus order hợp lý, không bị kẹt.

---

## MODULE 36 — Global Search 🟡

**Functional Test Cases:**
- FTC-36-01: Search trả kết quả đúng, nhóm theo loại (Flight/News/Destination/Promotion).
- FTC-36-02: Debounce hoạt động đúng (không gọi API dồn dập khi gõ nhanh — kiểm tra qua Network tab, đếm số request khi gõ 1 từ 10 ký tự phải ít hơn nhiều so với 10 lần gọi).

**Security Test Cases:**
- `[VALID-01]` SQLi trong search query — đặc biệt quan trọng vì search thường query nhiều bảng cùng lúc.

---

## MODULE 37 — Notification Email ⚙️ 🟡

**Functional Test Cases:**
- FTC-37-01: Mỗi trigger event (Booking Success, Payment Success, Flight Delay, Check-in Reminder, OTP) gửi đúng email tương ứng, đúng nội dung động (không phải template cứng sai thông tin).
- FTC-37-02: Gửi thất bại (SMTP lỗi giả lập) → có cơ chế retry, không làm crash luồng chính (booking vẫn thành công dù email gửi lỗi).

**Security Test Cases:**
- Kiểm tra email không lộ thông tin nhạy cảm không cần thiết (link không nên chứa token nhạy cảm dạng dễ đoán/không hết hạn).

---

# PHẦN 2 — MODULE ADMIN/BACKOFFICE (38-48)

> **Nguyên tắc chung cho toàn bộ nhóm Admin:** MỌI test case bên dưới phải test cả 2 chiều: (1) Admin/Staff hợp lệ dùng được bình thường, (2) Customer/Guest/token giả gọi thẳng API **phải bị chặn 401/403** — không được chỉ test chiều thuận.

## MODULE 38 — Admin Dashboard 🟡

**Functional Test Cases:**
- FTC-38-01: Số liệu Dashboard (doanh thu, booking, user) khớp với query trực tiếp DB — không phải số cứng.

**Security Test Cases:**
- `[AUTHZ-01]` token Customer gọi `/api/admin/dashboard/summary` → `403`.

---

## MODULE 39-40 — Admin Users & Roles 🔴

**Functional Test Cases:**
- FTC-39-01: CRUD user hoạt động đúng.
- FTC-39-02: Gán role/khoá tài khoản hoạt động đúng, user bị khoá không đăng nhập được nữa (test thật: khoá xong, thử login ngay).

**Security Test Cases:**
- `[AUTHZ-01]` token Customer/Staff (không phải Super Admin, nếu có phân cấp) gọi API đổi role user khác thành Admin → phải bị chặn theo đúng phân quyền.
- **Privilege Escalation nghiêm trọng nhất cần test:** 1 user tự gọi API đổi role của **chính mình** thành Admin (nếu API update profile/user dùng chung 1 endpoint cho cả tự sửa và Admin sửa) → phải bị chặn tuyệt đối.
```bash
curl -X PATCH http://localhost:5000/api/users/<id_cua_chinh_minh> \
  -H "Authorization: Bearer <token_customer_thuong>" \
  -H "Content-Type: application/json" \
  -d '{"role":"ADMIN"}'
# Kỳ vọng: 403, hoặc field role bị bỏ qua hoàn toàn, KHÔNG được tự phong Admin cho mình
```
- `[VALID-04]` Mass assignment tương tự — test toàn bộ field nhạy cảm khác (`isVerified`, `walletBalance`, `loyaltyPoints`) có bị client tự set qua API update profile không.

---

## MODULE 41 — Admin Flights & Bookings (CRUD Flight, quản lý Booking) 🟠

**Functional Test Cases:**
- FTC-41-01: CRUD Flight hoạt động đúng, thay đổi hiển thị ngay ở Search (Module 7).
- FTC-41-02: Admin duyệt/hủy booking thay khách hàng đúng luồng, đồng bộ trạng thái với các bảng liên quan (ghế, tồn kho).

**Security Test Cases:**
- `[AUTHZ-01]` đầy đủ cho mọi endpoint CRUD.
- `[STATE-01]` Admin cố chuyển trạng thái booking sai luồng (VD từ `CANCELLED` quay lại `CONFIRMED` trực tiếp) → nên có validate transition hợp lệ theo state machine đã spec (Volume 6.5 tài liệu SRS), không cho phép tuỳ tiện.

---

## MODULE 42 — Payment Management (Admin) 🔴

**Functional Test Cases:**
- FTC-42-01: Danh sách giao dịch filter đúng theo trạng thái/phương thức/ngày.
- FTC-42-02: Refund thủ công cập nhật đúng trạng thái, có ghi Audit Log.
- FTC-42-03: Export Excel xuất đúng dữ liệu, đúng định dạng, không thiếu cột.

**Security Test Cases:**
- `[AUTHZ-01]` chặt chẽ nhất trong toàn hệ thống — đây là nơi xử lý tiền thật.
- `[LEAK-01]` Export Excel không được lộ dữ liệu thẻ/thông tin nhạy cảm không cần thiết.
- Test refund 2 lần cho cùng 1 giao dịch (`[STATE-01]`) → phải bị chặn double-refund.

---

## MODULE 43-45 — Tour/News/Promotion Management 🟡

**Functional Test Cases:**
- FTC-43-01: CRUD Tour/News/Promotion hoạt động đúng, thay đổi phản ánh ngay ở phía Public (Module 22/24/23).
- FTC-45-01: Flash Sale tự động bật/tắt đúng khung giờ cấu hình (test cron job liên quan).

**Security Test Cases:**
- `[AUTHZ-01]` đầy đủ.
- `[VALID-02]` XSS qua Rich Text Editor (News) — kiểm tra kỹ, đây là nơi dễ bị lợi dụng nhất để chèn script ảnh hưởng hàng loạt user.
- `[FILE-01]`-`[FILE-03]` cho upload ảnh/gallery.

---

## MODULE 46 — Feedback Management (Admin) 🟠

**Functional Test Cases:**
- FTC-46-01: Duyệt/Ẩn/Xoá/Trả lời feedback hoạt động đúng, đồng bộ ngay ra Module 28 phía Public.

**Security Test Cases:**
- `[AUTHZ-01]` đầy đủ.
- Kiểm tra sau khi Admin "Ẩn" 1 feedback, feedback đó **thực sự không còn xuất hiện** trong API public (test trực tiếp API `/api/reviews`, không chỉ tin UI).

---

## MODULE 47 — Analytics 🟡

**Functional Test Cases:**
- FTC-47-01: Biểu đồ doanh thu/top tuyến bay/top tour khớp số liệu thật trong DB (chọn 1 khoảng thời gian, tự tính tay bằng SQL, so sánh với số Dashboard hiển thị).

**Security Test Cases:**
- `[AUTHZ-01]`, `[LEAK-01]` (không lộ thông tin cá nhân khách hàng cụ thể qua các báo cáo tổng hợp).

---

## MODULE 48 — Logging (Login/Payment/Booking/Error/Audit Log) 🔴

**Functional Test Cases:**
- FTC-48-01: Mỗi hành động nhạy cảm (login, refund, hủy booking, duyệt review, khoá tài khoản) đều sinh đúng 1 dòng Audit Log, có đủ: ai, làm gì, khi nào, trên đối tượng nào.
- FTC-48-02: Log Error không làm crash luồng chính (kiểm tra khi có lỗi cố tình gây ra, hệ thống vẫn phản hồi lỗi cho user bình thường, không "treo" vì lỗi ghi log).

**Security Test Cases:**
- `[LEAK-01]` **Cực kỳ quan trọng:** kiểm tra log **không được chứa** password (dù đã hash hay chưa), OTP, số thẻ, CVV, secret key.
```bash
# Sau khi thao tác vài luồng test (đăng nhập, thanh toán, đổi mật khẩu),
# quét toàn bộ log file/log console xem có lộ dữ liệu nhạy cảm không:
grep -rn "password\|otp\|cvv\|secret" logs/*.log 2>/dev/null
# Kỳ vọng: không tìm thấy giá trị thật nào, chỉ có thể thấy tên field (không phải giá trị)
```
- `[AUTHZ-01]` chỉ Admin mới xem được Audit Log, không phải Staff cấp thấp hơn (tuỳ phân quyền thiết kế).

---

# PHẦN 3 — MODULE 49: CÁC CHỨC NĂNG NHỎ (Cross-cutting) — Test theo từng mục

Với nhóm này, mỗi mục cần test **ở TẤT CẢ các trang áp dụng**, không chỉ 1 trang mẫu — đây là chỗ hay bị bỏ dở nhất.

| # | Chức năng | Cách test |
|---|---|---|
| 49.1 | Dark/Light mode | Bật dark mode, click qua toàn bộ 20-30 trang chính, chụp lại trang nào còn nền trắng/chữ không đọc được (contrast fail) |
| 49.2 | Đổi ngôn ngữ | Chuyển EN, click qua toàn bộ trang, `grep -rn "Tìm kiếm\|Đặt vé\|Xác nhận"` trong code FE để tìm text tiếng Việt hardcode còn sót khi đang ở chế độ EN |
| 49.3 | Đổi tiền tệ | Xem mục Module 33 |
| 49.4 | Breadcrumb | Kiểm tra Tour Detail/News Detail/Booking flow có breadcrumb đúng, click từng cấp điều hướng đúng |
| 49.5 | Back to Top | Cuộn xuống cuối trang dài (News/Tour list), xác nhận nút xuất hiện và hoạt động |
| 49.6 | Skeleton loading | Throttle network (Chrome DevTools "Slow 3G"), xác nhận có skeleton chứ không phải màn hình trắng khi tải |
| 49.7 | Lazy loading ảnh | Kiểm tra `<img loading="lazy">` hoặc IntersectionObserver có áp dụng cho ảnh trong list dài không (Network tab: ảnh dưới fold không load ngay khi vào trang) |
| 49.8 | Infinite scroll/phân trang | Test cuộn hết trang, xác nhận load thêm đúng, không load trùng/lặp dữ liệu |
| 49.9 | Toast thông báo | Thực hiện 1 action (đặt vé/lưu hồ sơ), xác nhận toast xuất hiện đúng loại (success/error), tự ẩn sau vài giây |
| 49.10 | Modal xác nhận | Bấm Hủy vé/Xóa feedback/Logout — xác nhận có modal chặn, bấm "Hủy" trong modal thì action KHÔNG xảy ra |
| 49.11 | Tooltip | Hover vào seat map/trường Passport, xác nhận tooltip hiện đúng nội dung hướng dẫn |
| 49.12 | Dropdown đa cấp | Test menu Header đa cấp trên cả desktop và mobile (hamburger menu) |
| 49.13 | Filter & Sort | Test kết hợp NHIỀU filter cùng lúc (VD giá + hãng + giờ bay cùng lúc) xem có bị conflict logic AND/OR sai không |
| 49.14 | Autocomplete | Gõ từng ký tự vào ô điểm đến, xác nhận gợi ý xuất hiện đúng, không bị treo |
| 49.15 | Debounce | Xem Module 36 |
| 49.16 | Lưu lịch sử tìm kiếm | Đăng nhập, tìm kiếm vài lần, xác nhận "Tìm kiếm gần đây" hiển thị đúng thứ tự mới nhất trước |
| 49.17 | Lưu bộ lọc gần nhất | Áp dụng filter, rời trang, quay lại — xác nhận filter được giữ nguyên (localStorage hoặc server-side) |
| 49.18 | Responsive | Test tay bằng resize trình duyệt qua 3 breakpoint chính (375px/768px/1440px) cho TOÀN BỘ trang chính, không chỉ Home |
| 49.19 | PWA | Kiểm tra `manifest.json` tồn tại, Service Worker đăng ký thành công (DevTools > Application > Service Workers), thử "Add to Home Screen" |
| 49.20 | SEO metadata | View page source (không phải F12 Elements) của Tour Detail/News Detail, xác nhận có `<title>`, `<meta description>`, Open Graph tags đúng — nếu SPA thuần không SSR, các tag này có thể KHÔNG xuất hiện trong view-source, đây là vấn đề SEO thật cần lưu ý báo cáo lại |
| 49.21 | Chia sẻ MXH | Bấm nút share Facebook/X/Zalo, xác nhận link chia sẻ đúng preview (ảnh, tiêu đề) |
| 49.22 | Copy mã đặt chỗ | Bấm copy, paste ra xác nhận đúng PNR, có toast xác nhận "Đã sao chép" |
| 49.23 | In vé | `window.print()` — xem bản in preview có bị vỡ layout, mất thông tin quan trọng không (CSS `@media print` riêng) |
| 49.24 | Xuất hóa đơn PDF | Xem Module 13.5 |
| 49.25 | Upload drag & drop | Test kéo-thả file thực tế (không chỉ click chọn file) vào vùng upload Avatar/Feedback |
| 49.26 | Crop ảnh đại diện | Upload ảnh, thử crop, xác nhận ảnh lưu đúng vùng đã crop, không lưu nguyên ảnh gốc |
| 49.27 | Đổi mật khẩu | Xem Module 5 |
| 49.28 | 2FA OTP | Nếu đã làm: bật 2FA, đăng nhập lại, xác nhận yêu cầu OTP bước 2 trước khi cấp token |
| 49.29 | Tự động đăng xuất | Đợi access token hết hạn, thực hiện 1 action — xác nhận tự động refresh; xoá/làm hỏng refresh token, thực hiện action — xác nhận bị đá về Login |
| 49.30 | Countdown OTP/QR | Xem Module 2, 13 |
| 49.31 | Polling/WebSocket | Xem Module 13 |
| 49.32 | Retry lỗi mạng | Tắt mạng giữa chừng 1 action quan trọng (DevTools > Network > Offline), bật lại, xác nhận có tự retry hay báo lỗi rõ ràng cho user thao tác lại, không "treo" im lặng |
| 49.33 | Lưu bản nháp form | Điền nửa chừng form nhiều hành khách, refresh trang (F5), xác nhận dữ liệu đã nhập còn giữ nguyên |
| 49.34 | Rating sao | Xem Module 28 |
| 49.35 | Sửa/xóa feedback | Xem Module 28 |
| 49.36 | Wishlist | Xem Module 30 |
| 49.37 | Theo dõi chuyến bay real-time | Xem Module 18 |
| 49.38 | Export Excel/CSV | Xem Module 42 |
| 49.39 | Phân quyền | Xem Module 39-42, 0.2 Master Checklist |
| 49.40 | Audit Log | Xem Module 48 |
| 49.41 | CAPTCHA | Kích hoạt sau N lần login sai, xác nhận CAPTCHA thực sự bắt buộc phải giải đúng mới cho login tiếp, không chỉ hiển thị cho có |
| 49.42 | Rate limiting | Xem `[RATE-01]` Master Checklist, áp dụng lại cho login/OTP/tạo QR |

---

# PHẦN 4 — QUY TRÌNH TỔNG HỢP KẾT QUẢ & SIGN-OFF

## 4.1. Bảng tổng hợp cuối cùng (agent bắt buộc điền đủ, không được để trống ô nào)

| Module | Tên | Ưu tiên | FTC Pass/Total | STC Pass/Total | Nhãn cuối | Ghi chú lỗi phát hiện |
|---|---|---|---|---|---|---|
| 1 | Home | 🟡 | | | | |
| 2 | Đăng ký | 🔴 | | | | |
| ... | ... | ... | | | | |
| 48 | Logging | 🔴 | | | | |

*(Agent copy đủ 48 dòng, điền số liệu thật sau khi test — không được để nguyên mẫu trống.)*

## 4.2. Điều kiện để coi dự án "sẵn sàng Production/Demo"

- [ ] 100% module 🔴 (Critical) đạt `✅ PASS` hoàn toàn ở cả FTC lẫn STC — KHÔNG chấp nhận `⚠️ PARTIAL` cho nhóm này.
- [ ] ≥ 90% module 🟠 (High) đạt `✅ PASS`, phần còn lại tối đa `⚠️ PARTIAL` kèm ghi chú rõ giới hạn.
- [ ] Không còn module nào ở trạng thái `❓ NOT TESTED`.
- [ ] Toàn bộ mục ở Phần 3 (Module 49) đã test tối thiểu 1 lần trên ≥ 5 trang khác nhau, không chỉ test 1 trang mẫu rồi suy diễn cho toàn site.
- [ ] Đã tự chạy `verify.js` (script race condition/webhook) và đính kèm output thật, không phải mô tả lại bằng lời.

## 4.3. Mẫu câu kết luận BẮT BUỘC (thay cho các câu marketing như "hoàn hảo", "enterprise-grade")

> "Đã test đủ 48 module + toàn bộ mục Module 49. Kết quả: [X] Pass hoàn toàn, [Y] Partial (chi tiết ở bảng trên), [Z] Fail cần sửa tiếp trước khi coi là Done. Không có module Critical nào còn ở trạng thái Partial/Fail/Not Tested."

Nếu agent không thể điền được câu kết luận theo đúng khuôn này (có số liệu X/Y/Z cụ thể), nghĩa là quá trình test chưa thực sự hoàn tất.
