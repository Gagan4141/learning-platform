"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Today" },
  { href: "/learn", label: "Learn" },
  { href: "/review", label: "Review" },
  { href: "/assessment", label: "Mock Test" },
];

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="border-b border-black/10 bg-white/90 px-4 py-3 backdrop-blur dark:border-white/20 dark:bg-black/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link href="/dashboard" className="text-lg font-semibold">
          N5 FastTrack
        </Link>
        <nav className="flex items-center gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1 text-sm ${pathname === link.href ? "bg-black text-white dark:bg-white dark:text-black" : "hover:bg-black/5 dark:hover:bg-white/10"}`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              router.push("/auth/login");
              router.refresh();
            }}
            className="rounded-full border border-black/20 px-3 py-1 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
