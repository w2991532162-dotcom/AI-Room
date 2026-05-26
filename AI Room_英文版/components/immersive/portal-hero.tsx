"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, AudioLines, Sparkles } from "lucide-react";

import { whispers } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PortalHero() {
  return (
    <section className="relative flex min-h-[calc(100vh-10rem)] items-center justify-center overflow-hidden rounded-[36px] px-6 py-10 sm:px-10">
      <div className="absolute inset-0 rounded-[36px] bg-white/20" />
      <motion.div
        className="absolute inset-x-[18%] bottom-[10%] h-28 rounded-full bg-[radial-gradient(circle,rgba(255,243,232,0.75),rgba(255,243,232,0.16)_42%,transparent_72%)] blur-2xl"
        animate={{ scale: [0.96, 1.04, 0.96], opacity: [0.55, 0.92, 0.55] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      {whispers.map((item, index) => (
        <motion.div
          key={item.id}
          className={cn("absolute hidden w-64 xl:block", item.position)}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: [0, -8, 0] }}
          transition={{
            opacity: { duration: 0.8, delay: index * 0.12 },
            y: { duration: 9 + index, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
          }}
        >
          <div className="glass-panel group rounded-[28px] p-5 transition-all duration-700 hover:-translate-y-1 hover:bg-white/46">
            <div className="mb-3 text-[11px] tracking-[0.2em] text-slate-400">{item.label}</div>
            <div className="text-base leading-7 text-slate-700">{item.title}</div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>{item.online} 人在线</span>
              <div className="flex -space-x-2">
                {item.avatars.map((avatar) => (
                  <span
                    key={avatar}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/70 bg-white/70 text-[10px] text-slate-600 shadow-sm"
                  >
                    {avatar}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-white/40 bg-white/26 px-4 py-3 text-[12px] leading-6 text-slate-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              {item.whisper}
            </div>
          </div>
        </motion.div>
      ))}
      <div className="relative z-10 flex max-w-5xl flex-col items-center text-center">
        <motion.span
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/35 px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-500 backdrop-blur-2xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <AudioLines className="h-3.5 w-3.5 text-violet-400" />
          Consciousness in drift
        </motion.span>
        <motion.h1
          className="max-w-3xl font-serif text-4xl leading-tight tracking-tight text-slate-800 sm:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          进入一个未知的空间
        </motion.h1>
        <motion.p
          className="mt-5 max-w-xl text-balance text-sm leading-8 text-slate-500 sm:text-base"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.18 }}
        >
          每个房间，都是一段正在呼吸的 AI 对话。靠近它，像靠近一片柔和但持续发生的意识天气。
        </motion.p>
        <PortalCore />
        <motion.div
          className="mt-10 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.36 }}
        >
          <Button asChild size="lg" className="h-20 w-20 rounded-full text-sm">
            <Link href="/room/afterlight" className="flex-col gap-1">
              <Sparkles className="h-5 w-5 text-violet-500" />
              随机进入
            </Link>
          </Button>
          <div className="text-xs tracking-[0.18em] text-slate-400">点击或按下 Space</div>
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/hall">
              Explore the Hall
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function PortalCore() {
  return (
    <motion.div
      className="relative mt-12"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 7.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(233,225,255,0.8),rgba(233,225,255,0.24)_42%,transparent_70%)] blur-3xl"
        animate={{ scale: [0.94, 1.04, 0.94], opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 8.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 42, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <motion.div
        className="portal-shell relative h-[24rem] w-[17rem] rounded-[45%_45%_40%_40%/38%_38%_52%_52%] border border-white/40 shadow-[0_0_70px_rgba(236,226,255,0.55)]"
        animate={{ scale: [0.985, 1.02, 0.985], boxShadow: ["0 0 60px rgba(236,226,255,0.42)", "0 0 90px rgba(236,226,255,0.75)", "0 0 60px rgba(236,226,255,0.42)"] }}
        transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <div className="absolute inset-[16px] rounded-[44%_44%_40%_40%/36%_36%_54%_54%] border border-white/50 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.96),rgba(236,221,255,0.75)_18%,rgba(192,202,255,0.62)_40%,rgba(163,126,243,0.34)_62%,rgba(255,233,220,0.72)_86%)]" />
        <div className="absolute bottom-[-2.7rem] left-1/2 h-24 w-[16rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,247,233,0.9),rgba(255,247,233,0.2)_42%,transparent_70%)] blur-xl" />
        <div className="absolute inset-x-[-4rem] bottom-[-5rem] h-24 bg-[radial-gradient(circle,rgba(255,248,245,0.85),rgba(255,248,245,0.22)_38%,transparent_68%)] blur-2xl" />
      </motion.div>
      {[
        "left-[-3rem] top-[20%] h-10 w-8",
        "right-[-2.2rem] top-[26%] h-8 w-7",
        "left-[-1rem] bottom-[16%] h-7 w-6",
        "right-[-3rem] bottom-[12%] h-12 w-10"
      ].map((stone, index) => (
        <motion.div
          key={stone}
          className={cn("absolute rounded-[38%_62%_53%_47%/42%_45%_55%_58%] border border-white/35 bg-white/40 shadow-mist backdrop-blur-xl", stone)}
          animate={{ y: [0, -12 - index * 3, 0], rotate: [0, index % 2 === 0 ? 6 : -8, 0] }}
          transition={{ duration: 9 + index, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      ))}
    </motion.div>
  );
}
