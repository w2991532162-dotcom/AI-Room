"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

type UtilitySceneProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  cards: Array<{
    label: string;
    title: string;
    description: string;
  }>;
  details: Array<{
    label: string;
    value: string;
  }>;
};

export function UtilityScene({
  eyebrow,
  title,
  description,
  icon: Icon,
  accent,
  primaryAction,
  secondaryAction,
  cards,
  details
}: UtilitySceneProps) {
  return (
    <section className="grid min-h-[calc(100vh-10rem)] gap-4 xl:grid-cols-[1.4fr_0.72fr]">
      <div className="glass-panel relative flex min-h-[44rem] flex-col overflow-hidden rounded-[36px] p-5 sm:p-6">
        <div
          className="absolute inset-x-[8%] top-10 h-44 rounded-full blur-3xl"
          style={{ background: accent }}
        />
        <div className="relative z-10 flex h-full flex-col">
          <div className="px-2 pb-5 pt-1 sm:px-3">
            <div className="text-xs uppercase tracking-[0.34em] text-slate-400">{eyebrow}</div>
            <div className="mt-5 flex items-center gap-4">
              <div className="glass-panel flex h-16 w-16 items-center justify-center rounded-[24px] text-slate-700">
                <Icon className="h-7 w-7" />
              </div>
              <div>
                <h1 className="font-serif text-3xl leading-tight text-slate-800 sm:text-4xl">{title}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-8 text-slate-500">{description}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 grid flex-1 gap-4 xl:grid-cols-2">
            {cards.map((card, index) => (
              <motion.div
                key={card.title}
                className="rounded-[30px] border border-white/40 bg-white/28 p-6 backdrop-blur-2xl"
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
              >
                <div className="text-[11px] uppercase tracking-[0.28em] text-slate-400">{card.label}</div>
                <div className="mt-4 font-serif text-2xl text-slate-800">{card.title}</div>
                <p className="mt-4 text-sm leading-7 text-slate-500">{card.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={primaryAction.href}>{primaryAction.label}</Link>
            </Button>
            {secondaryAction ? (
              <Button asChild variant="ghost" className="gap-2">
                <Link href={secondaryAction.href}>
                  {secondaryAction.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      <div className="glass-panel flex min-h-[44rem] flex-col rounded-[36px] p-6">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.34em] text-slate-400">
          <Sparkles className="h-4 w-4 text-violet-400" />
          Ambient Status
        </div>
        <motion.div
          className="mt-6 h-56 rounded-[32px]"
          style={{ background: accent }}
          animate={{ scale: [0.98, 1.02, 0.98], opacity: [0.78, 1, 0.78] }}
          transition={{ duration: 8.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
          {details.map((detail) => (
            <InfoRow key={detail.label} label={detail.label} value={detail.value} />
          ))}
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
