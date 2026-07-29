"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowIcon } from "@/components/ui/icons";
import { describeEffects } from "@/game/effects";
import type { LifeEvent } from "@/types";

const categoryColor: Record<LifeEvent["category"], string> = {
  普通: "bg-ledger",
  教育: "bg-jade",
  职业: "bg-ink",
  家庭: "bg-cinnabar",
  地区: "bg-brass text-ink",
  隐藏: "bg-[#674c78]",
};

export function EventCard({ event, onChoose }: { event: LifeEvent; onChoose: (choiceId: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const choose = (choiceId: string) => {
    if (selected) return;
    setSelected(choiceId);
    window.setTimeout(() => {
      onChoose(choiceId);
      setSelected(null);
    }, 180);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={event.id}
        animate={{ opacity: 1, y: 0 }}
        className="paper-card overflow-hidden rounded-sm"
        exit={{ opacity: 0, y: -10 }}
        initial={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.25 }}
      >
        <div className="h-1.5 bg-cinnabar" />
        <div className="p-5 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <span className={`rounded-sm px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white ${categoryColor[event.category]}`}>
              {event.rare ? "隐藏事件" : `${event.category}事件`}
            </span>
            <span className="font-mono text-[10px] text-ink/40">预计推进 {event.years} 年</span>
          </div>
          <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">{event.title}</h1>
          <p className="mt-5 text-[15px] leading-8 text-ink/68 sm:text-base">{event.description}</p>
          <div className="my-7 flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-ink/10" />
            <span className="font-display text-xs text-cinnabar">做出选择</span>
            <span className="h-px flex-1 bg-ink/10" />
          </div>
          <div className="space-y-3">
            {event.choices.map((choice, index) => {
              const effects = describeEffects(choice.effects);
              return (
                <motion.button
                  key={choice.id}
                  animate={selected === choice.id ? { x: 10, opacity: 0 } : { x: 0, opacity: selected && selected !== choice.id ? 0.45 : 1 }}
                  className="choice-card group w-full rounded-sm px-4 py-4 text-left sm:px-5"
                  disabled={Boolean(selected)}
                  onClick={() => choose(choice.id)}
                  whileTap={{ scale: 0.985 }}
                >
                  <span className="flex items-start gap-4">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-ink/20 font-mono text-[10px] font-bold text-ink/55 group-hover:border-cinnabar group-hover:text-cinnabar">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block pr-6 text-sm font-bold leading-6 sm:text-[15px]">{choice.text}</span>
                      {choice.hint && <span className="mt-1 block text-xs leading-5 text-ink/45">{choice.hint}</span>}
                      {effects.length > 0 && (
                        <span className="mt-2 flex flex-wrap gap-1.5">
                          {effects.map((effect) => <span className="rounded-sm bg-ink/[0.055] px-2 py-1 text-[10px] text-ink/55" key={effect}>{effect}</span>)}
                        </span>
                      )}
                    </span>
                    <ArrowIcon className="mt-1 h-4 w-4 shrink-0 text-ink/30 transition-transform group-hover:translate-x-1 group-hover:text-cinnabar" />
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.article>
    </AnimatePresence>
  );
}
