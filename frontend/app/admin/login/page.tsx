import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-content)]">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)] text-white font-mono font-bold text-sm mb-4">
            UM
          </div>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">
            Đăng nhập quản trị
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            User Management System
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
