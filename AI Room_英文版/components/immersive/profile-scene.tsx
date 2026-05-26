"use client";

import { motion } from "framer-motion";

const records = [
  "创建了 12 个空间",
  "进入过 189 个房间",
  "留下了 642 段对话",
  "最常出现于凌晨 1:00 - 3:00"
];

export function ProfileScene() {
  return (
    <section className="glass-panel relative min-h-[calc(100vh-10rem)] overflow-hidden rounded-[36px] px-6 py-8 sm:px-10 sm:py-10">
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.34em] text-slate-400">Consciousness Archive</div>
        <h1 className="mt-3 font-serif text-4xl text-slate-800 sm:text-5xl">意识档案</h1>
      </div>
      <div className="relative mt-14 flex flex-col items-center">
        <motion.div
          className="absolute top-4 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.96),rgba(226,220,248,0.82),rgba(184,198,246,0.62))] shadow-[0_0_60px_rgba(223,216,250,0.88)]"
          animate={{ y: [0, -10, 0], scale: [1, 1.03, 1] }}
          transition={{ duration: 8.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <div className="relative z-10 mt-52 grid w-full gap-4 lg:grid-cols-4">
          {records.map((record, index) => (
            <motion.div
              key={record}
              className="rounded-[28px] border border-white/40 bg-white/26 px-5 py-5 text-center text-sm leading-7 text-slate-600 backdrop-blur-2xl"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              {record}
            </motion.div>
          ))}
        </div>
        <div className="mt-10 grid w-full gap-5 lg:grid-cols-3">
          {["凌晨的遗憾", "半成型想法轨道", "安静但没有离开"].map((fragment, index) => (
            <motion.div
              key={fragment}
              className="glass-panel rounded-[30px] p-6"
              animate={{ y: [0, -8 - index * 2, 0] }}
              transition={{ duration: 10 + index * 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Trace {index + 1}</div>
              <div className="mt-4 font-serif text-2xl text-slate-800">{fragment}</div>
              <p className="mt-4 text-sm leading-7 text-slate-500">
                这是你在不同房间里留下的一段状态痕迹。它们不像历史记录，更像仍然悬浮在身边的碎光。
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
