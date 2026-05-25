"use client";

import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BrainCircuit,
  Compass,
  LogIn,
  Home,
  Mail,
  MoonStar,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/hall", label: "大厅", icon: Compass },
  { href: "/my-room", label: "我的房间", icon: Sparkles },
  { href: "/profile", label: "意识档案", icon: BrainCircuit },
  { href: "/settings", label: "设置", icon: SlidersHorizontal }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-700">
      <AmbientScene />
      <div className="relative z-10 min-h-screen lg:pl-[156px]">
        <aside className="fixed inset-y-0 left-0 hidden w-[156px] flex-col justify-between px-6 py-8 lg:flex">
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3 pl-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-2xl border border-white/40 bg-white/50 shadow-mist backdrop-blur-xl">
                <Sparkles className="h-4 w-4 text-violet-500" />
              </div>
              <span className="text-lg font-medium tracking-tight text-slate-800">AI Room</span>
            </Link>
            <nav className="glass-panel flex flex-col gap-3 rounded-[28px] p-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex h-16 flex-col items-center justify-center rounded-2xl text-[11px] text-slate-500 transition-all duration-500",
                      active ? "bg-white/66 text-slate-800 shadow-[0_12px_30px_rgba(202,189,224,0.28)]" : "hover:bg-white/35 hover:text-slate-700"
                    )}
                  >
                    <Icon className={cn("mb-1 h-4 w-4 transition-all duration-500", active ? "text-violet-500" : "group-hover:text-violet-400")} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex flex-col gap-3">
            <SidebarAction icon={MoonStar} label="深色模式" />
            <SidebarAction href="/logout" icon={LogIn} label="退出登录" />
          </div>
        </aside>
        <div className="flex min-h-screen flex-col px-4 py-4 sm:px-6 sm:py-6 lg:pr-8">
          <header className="sticky top-4 z-30 mb-4">
            <div className="glass-panel flex h-20 items-center justify-between rounded-[28px] px-5 sm:px-7">
              <div className="flex items-center gap-3">
                <Link
                  href="/search"
                  className="glass-panel flex h-11 min-w-[220px] items-center gap-3 rounded-full px-4 text-sm text-slate-500 transition-all duration-500 hover:text-slate-700 sm:min-w-[280px]"
                >
                  <Search className="h-4 w-4 text-slate-400" />
                  Search for a room, whisper, or mood
                </Link>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <HeaderIcon href="/settings" icon={Bell} label="通知与设置" />
                <HeaderIcon href="/messages" icon={Mail} label="收件箱" />
                <HeaderIcon icon={Plus} label="创建空间" />
                <Link href="/profile" aria-label="意识档案">
                  <Avatar className="h-11 w-11 border border-white/50 shadow-mist transition-transform duration-500 hover:-translate-y-0.5">
                    <AvatarFallback className="bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.95),rgba(214,207,246,0.75),rgba(160,177,228,0.72))] text-[10px] tracking-[0.22em] text-slate-700">
                      JY
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </div>
            </div>
          </header>
          <main className="relative flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 22, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                className="h-full pb-2"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

function SidebarAction({
  href,
  icon: Icon,
  label
}: {
  href?: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
}) {
  const className =
    "glass-panel flex h-14 w-full items-center justify-center rounded-2xl text-slate-500 transition-all duration-500 hover:bg-white/40 hover:text-slate-800";

  if (href) {
    return (
      <Link href={href} className={className}>
        <Icon className="h-4 w-4" />
        <span className="sr-only">{label}</span>
      </Link>
    );
  }

  return (
    <button className={className}>
      <Icon className="h-4 w-4" />
      <span className="sr-only">{label}</span>
    </button>
  );
}

function HeaderIcon({
  href,
  icon: Icon,
  label
}: {
  href?: string;
  icon: ComponentType<{ className?: string }>;
  label?: string;
}) {
  const className =
    "glass-panel flex h-11 w-11 items-center justify-center rounded-full text-slate-500 transition-all duration-500 hover:-translate-y-0.5 hover:text-violet-500";

  if (href) {
    return (
      <Link href={href} aria-label={label} className={className}>
        <Icon className="h-4 w-4" />
      </Link>
    );
  }

  return (
    <button aria-label={label} className={className}>
      <Icon className="h-4 w-4" />
    </button>
  );
}

function AmbientScene() {
  const particles = new Array(24).fill(null);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="ambient-grid absolute inset-0" />
      <div className="absolute inset-x-[8%] top-[8%] h-[36rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.72),rgba(240,232,248,0.2)_42%,transparent_72%)] blur-3xl" />
      <div className="absolute left-[-8%] top-[18%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(226,219,245,0.7),transparent_65%)] blur-3xl" />
      <div className="absolute bottom-[-10%] right-[8%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(255,233,243,0.7),transparent_60%)] blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      {particles.map((_, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full bg-white/80 shadow-[0_0_18px_rgba(255,255,255,0.9)]"
          style={{
            width: index % 3 === 0 ? 4 : 2,
            height: index % 3 === 0 ? 4 : 2,
            left: `${6 + ((index * 11) % 86)}%`,
            top: `${8 + ((index * 13) % 80)}%`
          }}
          animate={{
            y: [0, -12 - (index % 4) * 6, 0],
            opacity: [0.28, 0.9, 0.3],
            scale: [1, 1.8, 1]
          }}
          transition={{
            duration: 8 + (index % 5) * 2.4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: index * 0.18
          }}
        />
      ))}
    </div>
  );
}
