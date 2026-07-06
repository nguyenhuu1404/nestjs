# User Management App

Ứng dụng quản lý người dùng với dashboard và phân quyền RBAC.

## Stack

- Backend: NestJS + Prisma + PostgreSQL
- Frontend: Next.js (App Router)
- Cache: Redis
- Chạy toàn bộ qua Docker Compose

## Khởi động lần đầu

1. Copy file env mẫu:

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. Khởi tạo project NestJS và Next.js (nếu chưa có code, dùng CLI để scaffold vào đúng thư mục):

   ```bash
   npx @nestjs/cli new backend --skip-git --package-manager npm
   npx create-next-app@latest frontend --typescript --app
   ```

3. Chạy toàn bộ stack:
   ```bash
   docker compose up -d --build
   ```

## Truy cập

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- pgAdmin: http://localhost:5050 (email: admin@local.dev / mật khẩu: admin)
- Prisma Studio: `docker compose exec backend npx prisma studio` → http://localhost:5555
