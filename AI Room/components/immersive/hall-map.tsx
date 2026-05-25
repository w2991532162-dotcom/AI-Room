"use client";

import type { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import anonymousArt from "@/preview/hall-anonymous.png";
import crowdArt from "@/preview/hall-crowd.png";
import deepnightArt from "@/preview/hall-deepnight.png";
import emotionArt from "@/preview/hall-emotion.png";
import floatingArt from "@/preview/hall-floating.png";
import futureArt from "@/preview/hall-future.png";
import knowledgeArt from "@/preview/hall-knowledge.png";
import philosophyArt from "@/preview/hall-philosophy-v2.png";
import { hallNodes, type HallNodeVisual } from "@/lib/data";
import { Button } from "@/components/ui/button";

const filters = ["推荐", "最新", "最热", "安静", "情感", "创意"];

const artMap: Record<HallNodeVisual, { src: StaticImageData; shadow: string }> = {
  anonymous: {
    src: anonymousArt,
    shadow: "drop-shadow-[0_16px_30px_rgba(205,189,224,0.18)] drop-shadow-[0_0_24px_rgba(243,235,255,0.5)]"
  },
  crowd: {
    src: crowdArt,
    shadow: "drop-shadow-[0_20px_34px_rgba(183,169,199,0.2)] drop-shadow-[0_0_28px_rgba(245,238,255,0.54)]"
  },
  deepnight: {
    src: deepnightArt,
    shadow: "drop-shadow-[0_20px_34px_rgba(183,169,199,0.2)] drop-shadow-[0_0_28px_rgba(245,238,255,0.54)]"
  },
  emotion: {
    src: emotionArt,
    shadow: "drop-shadow-[0_18px_30px_rgba(191,178,210,0.18)] drop-shadow-[0_0_24px_rgba(242,235,255,0.52)]"
  },
  floating: {
    src: floatingArt,
    shadow: "drop-shadow-[0_18px_30px_rgba(191,178,210,0.16)] drop-shadow-[0_0_20px_rgba(242,235,255,0.46)]"
  },
  future: {
    src: futureArt,
    shadow: "drop-shadow-[0_18px_30px_rgba(191,178,210,0.18)] drop-shadow-[0_0_24px_rgba(245,238,255,0.56)]"
  },
  knowledge: {
    src: knowledgeArt,
    shadow: "drop-shadow-[0_18px_30px_rgba(191,178,210,0.16)] drop-shadow-[0_0_20px_rgba(248,239,232,0.44)]"
  },
  philosophy: {
    src: philosophyArt,
    shadow: "drop-shadow-[0_18px_30px_rgba(191,178,210,0.16)] drop-shadow-[0_0_20px_rgba(242,235,255,0.46)]"
  }
};

const sparkles = [
  { left: "12%", top: "18%", size: 4, delay: 0.2 },
  { left: "25%", top: "24%", size: 3, delay: 1.1 },
  { left: "41%", top: "14%", size: 4, delay: 2.1 },
  { left: "54%", top: "26%", size: 3, delay: 1.5 },
  { left: "68%", top: "18%", size: 4, delay: 0.8 },
  { left: "82%", top: "30%", size: 3, delay: 2.4 },
  { left: "15%", top: "58%", size: 3, delay: 1.7 },
  { left: "37%", top: "63%", size: 4, delay: 0.5 },
  { left: "61%", top: "54%", size: 3, delay: 2.8 },
  { left: "76%", top: "67%", size: 4, delay: 1.9 },
  { left: "48%", top: "83%", size: 3, delay: 1.2 },
  { left: "88%", top: "80%", size: 4, delay: 2.9 }
];

const mists = [
  "absolute left-[4%] top-[14%] h-56 w-[32%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.38),rgba(255,255,255,0)_72%)] blur-3xl",
  "absolute left-[26%] top-[16%] h-56 w-[34%] rounded-full bg-[radial-gradient(circle,rgba(236,228,255,0.34),rgba(236,228,255,0)_70%)] blur-3xl",
  "absolute right-[8%] top-[24%] h-64 w-[28%] rounded-full bg-[radial-gradient(circle,rgba(242,236,255,0.34),rgba(242,236,255,0)_70%)] blur-3xl",
  "absolute left-[12%] bottom-[10%] h-64 w-[36%] rounded-full bg-[radial-gradient(circle,rgba(255,248,250,0.34),rgba(255,248,250,0)_72%)] blur-3xl",
  "absolute right-[10%] bottom-[12%] h-56 w-[30%] rounded-full bg-[radial-gradient(circle,rgba(244,235,255,0.28),rgba(244,235,255,0)_70%)] blur-3xl"
];

export function HallMap() {
  return (
    <section className="glass-panel relative min-h-[calc(100vh-10rem)] overflow-hidden rounded-[40px] px-5 py-7 sm:px-8 sm:py-8 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.58),rgba(255,255,255,0.08)_34%,transparent_58%)]" />
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="font-serif text-4xl text-slate-800 sm:text-5xl">大厅</h1>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-500">
              探索正在发生的对话，进入一个未知的空间。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter, index) => (
              <Button
                key={filter}
                variant={index === 0 ? "primary" : "ghost"}
                className="rounded-full border border-white/35 bg-white/20 px-4 text-xs text-slate-500 backdrop-blur-xl hover:bg-white/30 hover:text-slate-700"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:hidden">
          {hallNodes.map((node, index) => (
            <Link
              key={node.id}
              href={`/room/${node.id}`}
              className="glass-panel relative overflow-hidden rounded-[28px] border border-white/40 px-4 py-4"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.08 }}
                className="flex items-center gap-4"
              >
                <div className="relative h-24 w-24 shrink-0">
                  <Image
                    src={artMap[node.visual].src}
                    alt=""
                    fill
                    sizes="96px"
                    className={`object-contain ${artMap[node.visual].shadow}`}
                  />
                </div>
                <NodeCard node={node} compact />
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="relative hidden min-h-[58rem] overflow-hidden rounded-[40px] xl:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.24),rgba(255,255,255,0)_58%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_20%,rgba(255,255,255,0.04)_100%)]" />
          {mists.map((mist, index) => (
            <div key={index} className={mist} />
          ))}

          <motion.div
            className="absolute left-[27%] top-[17%] h-[1px] w-[46%] bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ opacity: [0.18, 0.4, 0.18] }}
            transition={{ duration: 7.5, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="absolute left-[34%] top-[33%] h-[1px] w-[30%] bg-gradient-to-r from-transparent via-white/24 to-transparent"
            animate={{ opacity: [0.12, 0.28, 0.12] }}
            transition={{ duration: 6.2, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY, delay: 1 }}
          />

          {sparkles.map((sparkle, index) => (
            <motion.span
              key={`${sparkle.left}-${sparkle.top}`}
              className="absolute rounded-full bg-white/80 shadow-[0_0_16px_rgba(255,255,255,0.8)]"
              style={{
                left: sparkle.left,
                top: sparkle.top,
                width: sparkle.size,
                height: sparkle.size
              }}
              animate={{ opacity: [0.18, 0.72, 0.22], scale: [0.8, 1.15, 0.9] }}
              transition={{
                duration: 4.8 + (index % 4),
                delay: sparkle.delay,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY
              }}
            />
          ))}

          {hallNodes.map((node, index) => (
            <motion.div
              key={node.id}
              className="absolute"
              style={{
                left: `${node.groupBox.left}%`,
                top: `${node.groupBox.top}%`,
                width: `${node.groupBox.width}%`,
                height: `${node.groupBox.height}%`,
                zIndex: node.depth
              }}
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/room/${node.id}`} className="group absolute inset-0 block">
                <motion.div
                  className="absolute"
                  style={{
                    left: `${node.imageBox.left}%`,
                    top: `${node.imageBox.top}%`,
                    width: `${node.imageBox.width}%`,
                    height: `${node.imageBox.height}%`,
                    zIndex: 1
                  }}
                  animate={{ y: [0, -10 - (index % 3) * 4, 0] }}
                  transition={{
                    duration: 9 + index * 0.5,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY
                  }}
                >
                  <NodeArtwork visual={node.visual} />
                </motion.div>

                <motion.div
                  className="absolute"
                  style={{
                    left: `${node.cardBox.left}%`,
                    top: `${node.cardBox.top}%`,
                    width: `${node.cardBox.width}%`,
                    height: `${node.cardBox.height}%`,
                    zIndex: 2
                  }}
                  animate={{ y: [0, -6 - (index % 2) * 2, 0] }}
                  transition={{
                    duration: 7.2 + index * 0.4,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0.4
                  }}
                >
                  <NodeCard node={node} />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NodeArtwork({ visual }: { visual: HallNodeVisual }) {
  const art = artMap[visual];

  return (
    <div className="relative h-full w-full">
      <Image src={art.src} alt="" fill sizes="33vw" className={`object-contain ${art.shadow} transition-transform duration-700 group-hover:scale-[1.03]`} />
    </div>
  );
}

function NodeCard({
  node,
  compact = false
}: {
  node: (typeof hallNodes)[number];
  compact?: boolean;
}) {
  return (
    <div
      className={[
        "glass-panel h-full rounded-[22px] border border-white/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.38),rgba(255,255,255,0.18))] text-slate-700 transition-all duration-500 group-hover:-translate-y-1 group-hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.46),rgba(255,255,255,0.22))] group-hover:shadow-[0_22px_44px_rgba(190,177,211,0.18)]",
        compact ? "px-4 py-4" : "px-4 py-4 2xl:px-5 2xl:py-4"
      ].join(" ")}
    >
      <div className={compact ? "text-lg leading-7" : "text-[clamp(1rem,0.6vw+0.8rem,1.35rem)] leading-[1.3]"}>{node.name}</div>
      <div className={compact ? "mt-2 text-xs leading-6 text-slate-500" : "mt-2 text-[clamp(0.72rem,0.28vw+0.6rem,0.83rem)] leading-[1.9] text-slate-500"}>
        <div>{node.summary}</div>
        <div>{node.detail}</div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-[10px] tracking-[0.08em] text-slate-400 2xl:text-[11px]">
        <AvatarDots avatars={node.avatars} />
        <span>{node.people} 在线</span>
      </div>
    </div>
  );
}

function AvatarDots({ avatars }: { avatars: string[] }) {
  return (
    <div className="flex -space-x-1.5">
      {avatars.map((avatar, index) => (
        <span
          key={`${avatar}-${index}`}
          className="flex h-4 w-4 items-center justify-center rounded-full border border-white/70 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.96),rgba(222,210,234,0.92),rgba(185,174,202,0.96))] text-[7px] font-medium text-slate-700 shadow-[0_4px_10px_rgba(187,176,204,0.18)] 2xl:h-[18px] 2xl:w-[18px]"
        >
          {avatar.slice(0, 1)}
        </span>
      ))}
    </div>
  );
}
