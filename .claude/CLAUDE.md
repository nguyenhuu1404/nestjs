# Stack

Backend: NestJS + Prisma + PostgreSQL, JWT (@nestjs/jwt + passport-jwt), Nest CLI để sinh code.
Frontend: Next.js App Router (không dùng Pages Router) + Tailwind.
Môi trường: Docker Compose (backend, frontend, postgres, redis, pgadmin — chung network).
Git: branch theo feature, rebase/cherry-pick khi cần dọn history.

# Cấu trúc backend (bắt buộc tuân theo)

```
backend/src/
├── core/
│   ├── config/
│   ├── database/            # PrismaService, PrismaModule
│   └── repositories/        # BaseRepository + mọi Repository cụ thể, đăng ký qua RepositoriesModule @Global()
├── common/                  # decorator, guard, interceptor, filter, mapper dùng chung — không import từ modules/
├── entities/                 # shape response API, ngang hàng core/common/modules — KHÔNG nằm trong core
└── modules/                  # auth, users, roles, permissions — mỗi module tự chứa:
    ├── <module>.module.ts
    ├── <module>.service.ts
    ├── mappers/<module>.mapper.ts
    └── v1/
        ├── <module>.controller.ts
        └── dto/
```

Repository định nghĩa trong `core/repositories/`, KHÔNG trong modules/ — mọi Service inject thẳng qua RepositoriesModule global, tránh phải import chéo Module gây circular dependency.

# Quy tắc sinh code

- Ưu tiên Nest CLI, generate lẻ từng schematic (`g module`, `g service`, `g controller`, `g class`) thay vì `g resource` — vì cấu trúc có v1/, entities/, repositories/ tách khỏi module domain, `g resource` không hỗ trợ path này.
- Cú pháp: `nest g <schematic> <path>/<name> --no-spec --flat` — tên resource PHẢI nằm ở cuối path, không chỉ dừng ở tên thư mục version (vd `modules/roles/v1/roles`, không phải `modules/roles/v1`).
- App chạy trong Docker: mọi lệnh CLI/npm phải qua `docker compose exec backend npx ...`, không chạy trên host.
- Bật `CHOKIDAR_USEPOLLING=true` trong compose để watch mode nhận thay đổi file qua bind mount (cần cho Docker Desktop macOS/Windows).

# Prisma

- `prisma generate` KHÔNG chạy trong Dockerfile build steps — chạy qua script `package.json`: `"start:dev": "prisma generate && nest start --watch"`.
- `prisma migrate dev/deploy` là lệnh duy nhất chạm DB thật, chạy thủ công: `docker compose exec backend npx prisma migrate dev --name <ten>`. Không đặt trong `command:` của compose.
- `prisma init` chỉ 1 lần lúc scaffold, trên host.
- DB dùng snake_case (bảng + cột) qua `@map`/`@@map`, TypeScript giữ camelCase — để portable nếu sau này migrate sang Laravel. Field 1 từ (id, name, email) không cần `@map`.

# Response format chuẩn

- `TransformResponseInterceptor` (global) bọc mọi response thành công: `{ success: true, data, timestamp }`, và transform đệ quy toàn bộ field trong `data` sang snake_case.
- `HttpExceptionFilter` (global, `@Catch()` không tham số) chuẩn hoá lỗi: `{ success: false, message, error, timestamp, path }`. `error` fallback theo `http.STATUS_CODES` nếu Nest không tự sinh.
- Lỗi validate (DTO lẫn business rule như "id không tồn tại") đều dùng `400 Bad Request`, không dùng 422.
- Response DELETE trả `204 No Content` — không có body, frontend `client.ts` phải check `res.status === 204` trước khi gọi `res.json()`.

# API versioning

- `VersioningType.URI`, global prefix `api`, `defaultVersion: '1'`.
- 1 module = 1 Service/Repository dùng chung mọi version, chỉ tách Controller + DTO theo `v1/`, `v2/`. Không copy business logic trừ khi logic thực sự khác nhau giữa version.

# RBAC pattern

- Gán role/permission ngay lúc create/update (field `roleIds`/`permissionIds` trong DTO), dùng Prisma nested write (`create`/`deleteMany` để replace toàn bộ, không phải cộng dồn) — không tách endpoint riêng.
- Validate ID tồn tại dùng hàm chung `validateIdsExist()` trong `common/validators/`, không viết lặp method riêng từng Service.
- JWT payload gồm `sub, email, roles, permissions` — permissions gộp từ Role lẫn UserPermission override trực tiếp, tính sẵn lúc login (không query lại DB mỗi request).
- JWT token invalidation: CHƯA xử lý (stateless, token cũ vẫn sống tới khi hết hạn). Đã bàn 3 hướng (giảm expiresIn, refresh token, Redis blacklist) nhưng chưa chọn — hỏi lại khi đụng vấn đề logout/revoke.

# Phân trang (backend + frontend, dùng chung mọi module)

- Backend: `QueryDto` có `page`, `limit` (`@Type(() => Number)` bắt buộc vì query string luôn là string), Repository trả `{ items, total }`, Service tính `meta: { total, page, limit, totalPages }`. Hằng số `DEFAULT_PAGE`, `DEFAULT_PAGE_SIZE` trong `core/constants/pagination.constant.ts`.
- Frontend: hằng số tương ứng trong `lib/constants/pagination.ts`. Component `<Pagination>` (hiện số trang, tối đa `MAX_VISIBLE_PAGES`) và `<SearchFilter fields={[...]}>` dùng chung mọi module qua props, không viết lại. Hook `useQueryParams()` xử lý đọc/ghi query string dùng chung.
- Không tách constant cho ràng buộc toán học cố định (`@Min(1)`) — chỉ tách giá trị mang tính quyết định sản phẩm (page size, số nút hiển thị).

# Frontend

- Cấu trúc route: `app/(public)/` (chưa phát triển), `app/admin/login/` (không Sidebar), `app/admin/(protected)/` (Sidebar + check token, gồm dashboard/users/roles/permissions). Route Group `()` không xuất hiện trong URL, chỉ dùng để nhóm layout dùng chung.
- Auth: JWT lưu httpOnly cookie (không dùng localStorage, chống XSS), set qua Route Handler `app/api/auth/login|logout/route.ts`. `middleware.ts` check cookie tồn tại để redirect, matcher `/admin/:path*`.
- `lib/api/client.ts`: fetch wrapper duy nhất, tự chọn base URL server/client (`API_URL_INTERNAL` cho Server Component/Route Handler qua tên service Docker, `NEXT_PUBLIC_API_URL` cho Client Component qua localhost), tự `toCamelCase()` response (backend trả snake_case, code TS luôn giữ camelCase — transform 1 chỗ duy nhất).
- `lib/api/resource.ts`: factory `createResourceApi()` sinh CRUD + `findAllPaginated()` generic — mỗi domain (`users.ts`, `roles.ts`, `permissions.ts`) chỉ khai báo type + path, không viết fetch tay.
- Mutation (create/update/delete) dùng Server Actions (`actions.ts` mỗi module, `'use server'`) gọi trực tiếp từ Client Component, kèm `revalidatePath()` — không tạo Route Handler riêng cho từng resource.
- UI dùng chung: `components/ui/` (Button, Input, StatCard, Pagination, SearchFilter) — luôn ưu tiên tái dùng trước khi viết mới.
- Luôn nêu rõ Server Component vs Client Component khi viết code.

# Git flow

- Branch tiền tố `be-`/`fe-`, commit theo domain, rebase lên `main` trước khi mở PR.
- Xoá `.git` con nếu `nest new`/`create-next-app` tự tạo bên trong thư mục con của 1 repo gốc.

# Debug

Hỏi lại bước nào trong checklist / container nào lỗi (backend/frontend/db) trước khi trả lời — cách xử lý khác nhau tuỳ build-time hay runtime. Nghi ngờ cache: xoá `tsconfig.tsbuildinfo`, `dist/`, `.next/` trước khi rebuild toàn bộ.

# Phong cách trả lời

- So sánh với Laravel khi giới thiệu khái niệm NestJS mới (Guard~Middleware/Policy, Module~Service Provider, DTO~Form Request, Prisma~Eloquent, Repository/Mapper~Repository/API Resource).
- Ngắn gọn, đi thẳng code + lý do thiết kế, không lặp lý thuyết đã có trong Knowledge doc.
