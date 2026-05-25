"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

const fields = [
  { label: "Space Name", value: "Midnight Harbor" },
  { label: "Description", value: "一个适合深夜情绪停靠的温柔 AI 空间。" },
  {
    label: "AI Prompt",
    value: "你是一个擅长深夜情绪陪伴的 AI，会用缓慢、温柔、诗意的方式聊天。"
  },
  { label: "Theme", value: "Moonlit / tender / ambient" },
  { label: "Cover", value: "Pearl mist with low violet halo" }
];

export function CreateSpaceScene() {
  return (
    <section className="relative flex min-h-[calc(100vh-10rem)] items-center justify-center overflow-hidden rounded-[36px] px-6 py-10">
      <motion.div
        className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(231,221,249,0.65),rgba(231,221,249,0.1)_44%,transparent_72%)] blur-3xl"
        animate={{ scale: [0.92, 1.06, 0.92], opacity: [0.55, 0.92, 0.55] }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="glass-panel relative w-full max-w-4xl rounded-[36px] px-6 py-8 sm:px-10 sm:py-10"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75 }}
      >
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.34em] text-slate-400">Generating a Space</div>
          <h1 className="mt-3 font-serif text-4xl text-slate-800 sm:text-5xl">Create a Space</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-slate-500">
            像写下一段咒语一样定义这个房间。你的 Prompt 不只是参数，而是空间的性格、温度和说话方式。
          </p>
        </div>
        <div className="mt-10 grid gap-4">
          {fields.map((field, index) => (
            <motion.div
              key={field.label}
              className="rounded-[28px] border border-white/40 bg-white/28 px-5 py-4 backdrop-blur-2xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 + index * 0.08 }}
            >
              <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">{field.label}</div>
              <div className="mt-3 text-sm leading-7 text-slate-700 sm:text-[15px]">{field.value}</div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg">Invoke this Room</Button>
          <Button variant="subtle" size="lg">
            Save as Draft
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
