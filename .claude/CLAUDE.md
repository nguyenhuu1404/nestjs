# User Management App — Claude Code project instructions

## Tổng quan

Ứng dụng quản lý người dùng full-stack, có dashboard thống kê và phân quyền RBAC (Role-Based Access Control).

- Backend: NestJS + Prisma + PostgreSQL, chạy port 3001
- Frontend: Next.js (App Router) + TypeScript, chạy port 3000
- Cache/session: Redis
- Toàn bộ chạy qua Docker Compose

## Tech stack

- **Backend**: NestJS + Prisma + PostgreSQL, JWT auth (`@nestjs/jwt` + `passport-jwt`), sinh code bằng Nest CLI
- **Frontend**: Next.js (App Router — **không dùng Pages Router**), Tailwind CSS
- **Môi trường**: Docker Compose — backend, frontend, postgres chạy container riêng, nối qua network chung
- **Git**: branch theo feature (`feature/be-*`, `feature/fe-*`), rebase/cherry-pick khi cần dọn history

## Cấu trúc thư mục backend (bắt buộc tuân theo)

```
backend/src/
├── core/          # hạ tầng lõi: config, database (Prisma), logger — ít khi sửa
├── common/        # decorator, guard, interceptor, filter dùng chung toàn app
│                  # KHÔNG import ngược từ modules/
└── modules/       # từng domain nghiệp vụ, tự chứa: controller/service/dto/repository
    ├── auth/
    ├── users/
    ├── roles/
    └── permissions/
```

Nguyên tắc:

- Module trong `modules/` không import chéo trực tiếp service module khác — export qua `exports: []` rồi import Module đó.
- Tách Repository khỏi Service khi query phức tạp.
- Domain lớn dần → tạo sub-folder, không tách module mới vội.

## Sinh code

- Ưu tiên Nest CLI (`nest g resource`, `nest g module`, `nest g controller`, `nest g service`) thay vì tạo file tay, trừ khi loại file đó CLI không hỗ trợ sinh sẵn.
- Code TypeScript rõ ràng, comment ngắn khi cần.

## Docker Compose

- Named volume phải khai báo ở top-level **và** mount vào đúng service — khai báo suông không tự wire.
- `node_modules` dùng named volume, không dùng anonymous volume.
- `EXPOSE` trong Dockerfile chỉ là metadata, không publish port — port thật do `ports:` trong compose quyết định.
- Backend nối Postgres qua tên service (`postgres`), không dùng `localhost`. Frontend Server Component gọi API qua tên service `http://backend:3000`; Client Component gọi qua `localhost:3001` (port map ra host).
- `depends_on` không đảm bảo service đã sẵn sàng nhận connection — dùng `healthcheck` + `condition: service_healthy` cho Postgres.

## Frontend

- Mặc định App Router, Tailwind CSS, gọi API qua `fetch`/`axios`.
- Luôn nêu rõ Server Component hay Client Component khi viết code.

## Debug

Luôn hỏi lại trước khi trả lời: đang ở bước nào trong checklist, container nào đang lỗi (backend/frontend/db) — cách xử lý khác nhau tuỳ build-time hay runtime.

## Phong cách trả lời

- So sánh với Laravel khi giới thiệu khái niệm NestJS mới (Guard ~ Middleware/Policy, Module ~ Service Provider, DTO ~ Form Request, Prisma ~ Eloquent).
- Ngắn gọn, đi thẳng code + lý do thiết kế, không lặp lý thuyết đã có trong Knowledge doc.
