"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import { mySpaces } from "@/lib/data";
import { Button } from "@/components/ui/button";

export function MyRoomScene() {
  return (
    <section className="glass-panel relative min-h-[calc(100vh-10rem)] overflow-hidden rounded-[36px] px-6 py-8 sm:px-10 sm:py-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.34em] text-slate-400">Collected Fragments</div>
          <h1 className="mt-3 font-serif text-4xl text-slate-800 sm:text-5xl">我的房间</h1>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-500">
            这些不是普通卡片，而是你保存下来的小型空间碎片。每一个都拥有自己的情绪、Prompt 和光的温度。
          </p>
        </div>
        <Button asChild size="lg" className="rounded-full px-6">
          <Link href="/create-space" className="gap-2">
            <Plus className="h-4 w-4" />
            Create a Space
          </Link>
        </Button>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {mySpaces.map((space, index) => (
          <motion.div
            key={space.id}
            className="group glass-panel relative overflow-hidden rounded-[30px] p-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.12 }}
            whileHover={{ y: -8, rotate: index % 2 === 0 ? -1.2 : 1.2 }}
          >
            <motion.div
              className="absolute inset-x-6 top-5 h-32 rounded-[26px] bg-[radial-gradient(circle_at_40%_30%,rgba(255,255,255,0.95),rgba(230,221,249,0.72)_30%,rgba(255,228,238,0.5)_68%,rgba(255,255,255,0)_100%)]"
              animate={{ scale: [1, 1.05, 1], opacity: [0.65, 0.95, 0.65] }}
              transition={{ duration: 9 + index, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            <div className="relative z-10">
              <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">{space.visibility}</div>
              <h2 className="mt-24 font-serif text-2xl text-slate-800">{space.name}</h2>
              <div className="mt-2 text-sm italic text-slate-500">{space.mood}</div>
              <p className="mt-5 text-sm leading-7 text-slate-600">{space.description}</p>
              <div className="mt-8 rounded-2xl border border-white/40 bg-white/26 px-4 py-3 text-xs tracking-[0.18em] text-slate-400">
                {space.cover}
              </div>
              <div className="mt-6 flex gap-2">
                <Button asChild variant="ghost">
                  <Link href={`/room/${space.id}`}>Enter</Link>
                </Button>
                <Button variant="subtle">Edit</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
