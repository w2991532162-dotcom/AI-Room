"use client";

import { motion } from "framer-motion";
import { Mic, Radio, Sparkles } from "lucide-react";

import { chatMessages } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function RoomScene({ roomId }: { roomId: string }) {
  return (
    <section className="grid min-h-[calc(100vh-10rem)] gap-4 xl:grid-cols-[1.4fr_0.72fr]">
      <div className="glass-panel flex min-h-[44rem] flex-col rounded-[36px] p-5 sm:p-6">
        <div className="px-2 pb-5 pt-1 sm:px-3">
          <div className="text-xs uppercase tracking-[0.34em] text-slate-400">02:41 AM | Afterlight Chamber</div>
          <h1 className="mt-3 font-serif text-3xl leading-tight text-slate-800 sm:text-4xl">
            凌晨 2:41｜有人正在讨论遗憾
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-500">
            房间 ID: {roomId}。这里的 AI 不急着定义你的情绪，它更像在帮你把模糊的感受留住一会儿。
          </p>
        </div>
        <Separator className="mb-4 bg-white/35" />
        <ScrollArea className="min-h-0 flex-1 pr-2">
          <div className="space-y-4 pb-6 pl-1 pr-2">
            {chatMessages.map((message, index) => (
              <motion.div
                key={message.id}
                className={cn(
                  "max-w-[88%] rounded-[28px] px-5 py-4 text-sm leading-8 backdrop-blur-2xl",
                  message.role === "assistant"
                    ? "glass-panel mr-auto border border-violet-100/60 text-slate-700"
                    : "ml-auto border border-white/45 bg-white/55 text-slate-600 shadow-mist"
                )}
                initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
              >
                <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-slate-400">
                  {message.role === "assistant" ? (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                      Room AI
                    </>
                  ) : (
                    "You"
                  )}
                </div>
                {message.text}
              </motion.div>
            ))}
            <motion.div
              className="glass-panel mr-auto inline-flex items-center gap-3 rounded-full px-4 py-3 text-xs tracking-[0.2em] text-slate-500"
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 2.6, repeat: Number.POSITIVE_INFINITY }}
            >
              <span className="h-2 w-2 rounded-full bg-violet-400" />
              AI is forming a reply
            </motion.div>
          </div>
        </ScrollArea>
        <div className="mt-4 rounded-[30px] border border-white/40 bg-white/30 p-4 backdrop-blur-2xl">
          <div className="min-h-28 rounded-[24px] border border-white/30 bg-white/26 px-5 py-4 text-sm leading-8 text-slate-400">
            留下一段想法。这里不要求你立刻说清楚，只需要先把它放进空间里。
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="subtle" size="icon">
                <Mic className="h-4 w-4" />
              </Button>
              <Button variant="subtle" size="icon">
                <Radio className="h-4 w-4" />
              </Button>
            </div>
            <Button size="lg">Send into the Room</Button>
          </div>
        </div>
      </div>
      <div className="glass-panel flex min-h-[44rem] flex-col rounded-[36px] p-6">
        <div className="text-xs uppercase tracking-[0.34em] text-slate-400">Room Status</div>
        <motion.div
          className="mt-6 h-56 rounded-[32px] bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.98),rgba(228,219,248,0.76)_20%,rgba(187,198,246,0.56)_48%,rgba(255,232,232,0.58)_88%)]"
          animate={{ scale: [0.98, 1.02, 0.98], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
          <InfoRow label="Mood" value="Reflective / soft / patient" />
          <InfoRow label="Prompt" value="用缓慢、温柔、诗意的方式陪伴深夜情绪。" />
          <InfoRow label="Presence" value="34 humans · 1 AI consciousness online" />
          <InfoRow label="Whisper" value="这个房间更擅长陪你把问题留在空气里，而不是立刻给出答案。" />
        </div>
        <Separator className="my-6 bg-white/35" />
        <div>
          <div className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Participants</div>
          <div className="mt-4 flex -space-x-3">
            {["YU", "MI", "EL", "NO"].map((p) => (
              <div
                key={p}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/60 bg-white/66 text-xs text-slate-600 shadow-sm"
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/35 bg-white/24 px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{label}</div>
      <div className="mt-2">{value}</div>
    </div>
  );
}
