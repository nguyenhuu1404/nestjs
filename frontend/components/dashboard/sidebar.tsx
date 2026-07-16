"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";

const NAV_ITEMS = [
  { label: "Tổng quan", href: "/admin/dashboard" },
  { label: "Người dùng", href: "/admin/users" },
  { label: "Vai trò", href: "/admin/roles" },
  { label: "Quyền hạn", href: "/admin/permissions" },
  { label: "Media", href: "/admin/media" },
];

export function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-64 shrink-0 bg-[var(--bg-sidebar)] text-white flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <span className="font-mono font-bold text-sm tracking-wide">
          USER MANAGEMENT
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-[var(--accent)] text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <div className="px-3 py-2 mb-1">
          <p className="text-sm font-medium truncate">
            {user.name ?? user.email}
          </p>
          <p className="text-xs text-white/50 font-mono">
            {user.roles.join(", ")}
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full text-left"
        >
          Đăng xuất
        </Button>
      </div>
    </aside>
  );
}
