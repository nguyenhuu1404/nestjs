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

4. Migration & Seed

- Access to container

  ```bash
  docker-compose exec backend sh
  ```

- Migration

  ```bash
  px prisma migrate dev --name [comment version]{snake_case_db_convention}
  ```

- Seed

  ```bash
  npx prisma db seed
  ```

5. Nest CLI

- Create all module, controller, dto...

  ```bash
  npx nest g resource modules/users --no-spec
  ```

- Create manual module

* Module + Service — nằm gốc modules/orders/

```bash
npx nest g module modules/orders
npx nest g service modules/orders --no-spec
```

- Controller — tạo thẳng vào v1

```bash
npx nest g controller modules/orders/v1/orders --no-spec --flat
```

- DTO — tạo thẳng vào v1/dto/

```bash
npx nest g class modules/orders/v1/dto/create-order.dto --no-spec --flat
npx nest g class modules/orders/v1/dto/update-order.dto --no-spec --flat
```

- Entity — tạo entities

```bash
npx nest g class entities/order.entity --no-spec --flat
```

- Mapper — tạo modules/orders/mappers/

```bash
npx nest g class modules/orders/mappers/order.mapper --no-spec --flat
```

- Repository — tạo thẳng vào core/repositories/

```bash
npx nest g class core/repositories/orders.repository --no-spec --flat
```

## Truy cập

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- pgAdmin: http://localhost:5050 (email: admin@local.dev / mật khẩu: admin)
