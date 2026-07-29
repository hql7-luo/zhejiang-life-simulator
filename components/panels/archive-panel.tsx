"use client";

import { useState } from "react";
import { achievements } from "@/data/regions/zhejiang/achievements";
import { jobs } from "@/data/regions/zhejiang/careers";
import { endings } from "@/data/regions/zhejiang/endings";
import { eventCounts } from "@/data/regions/zhejiang/events";
import { ModalShell } from "@/components/panels/modal-shell";
import { useGameStore } from "@/store/game-store";

export function ArchivePanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"overview" | "achievements" | "endings" | "jobs">("overview");
  const unlockedEventIds = useGameStore((state) => state.unlockedEventIds);
  const unlockedAchievementIds = useGameStore((state) => state.unlockedAchievementIds);
  const unlockedEndingIds = useGameStore((state) => state.unlockedEndingIds);
  const unlockedJobIds = useGameStore((state) => state.unlockedJobIds);
  const tabs = [
    ["overview", "总览"],
    ["achievements", `成就 ${unlockedAchievementIds.length}/${achievements.length}`],
    ["endings", `结局 ${unlockedEndingIds.length}/${endings.length}`],
    ["jobs", `职业 ${unlockedJobIds.length}/${jobs.length - 2}`],
  ] as const;

  return (
    <ModalShell eyebrow="Life archive / 人生图鉴" onClose={onClose} title="你见过多少种人生？">
      <nav className="flex overflow-x-auto border-b border-ink/10 px-5 pt-2">
        {tabs.map(([id, label]) => (
          <button className={`shrink-0 border-b-2 px-4 py-3 text-xs font-bold ${tab === id ? "border-cinnabar text-cinnabar" : "border-transparent text-ink/45"}`} key={id} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </nav>
      <div className="p-5 sm:p-7">
        {tab === "overview" && (
          <div>
            <div className="grid gap-3 sm:grid-cols-3">
              <ProgressCard label="已见事件" value={unlockedEventIds.length} total={eventCounts.total} />
              <ProgressCard label="人生结局" value={unlockedEndingIds.length} total={endings.length} />
              <ProgressCard label="解锁成就" value={unlockedAchievementIds.length} total={achievements.length} />
            </div>
            <h3 className="mb-3 mt-8 font-display text-xl font-bold">事件档案</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                ["浙江通用", eventCounts.common],
                ["杭州", eventCounts.hangzhou],
                ["宁波", eventCounts.ningbo],
                ["温州", eventCounts.wenzhou],
                ["金华·义乌", eventCounts.jinhua],
                ["台州", eventCounts.taizhou],
                ["其他城市", eventCounts.otherCities],
                ["隐藏事件", eventCounts.hidden],
              ].map(([label, total]) => (
                <div className="rounded-sm border border-ink/10 bg-white/50 p-4" key={label}>
                  <span className="text-xs text-ink/48">{label}</span>
                  <strong className="mt-1 block font-mono text-xl">{total}</strong>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs leading-6 text-ink/45">图鉴进度保存在本机浏览器。隐藏事件需要属性、标签和一点运气共同满足。</p>
          </div>
        )}
        {tab === "achievements" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {achievements.map((achievement) => {
              const unlocked = unlockedAchievementIds.includes(achievement.id);
              return (
                <article className={`flex items-center gap-4 rounded-sm border p-4 ${unlocked ? "border-jade/25 bg-jade/[0.06]" : "border-ink/8 bg-ink/[0.025] opacity-55"}`} key={achievement.id}>
                  <span className={`stamp h-11 w-11 shrink-0 text-sm ${unlocked ? "" : "grayscale"}`}>{unlocked ? achievement.icon : "未"}</span>
                  <div><div className="flex items-center gap-2"><h3 className="text-sm font-bold">{unlocked ? achievement.name : "尚未解锁"}</h3><span className="text-[9px] text-ink/40">{achievement.rarity}</span></div><p className="mt-1 text-[11px] leading-5 text-ink/48">{unlocked ? achievement.description : "继续体验不同的选择来发现。"}</p></div>
                </article>
              );
            })}
          </div>
        )}
        {tab === "endings" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {endings.map((ending) => {
              const unlocked = unlockedEndingIds.includes(ending.id);
              return (
                <article className={`rounded-sm border p-4 ${unlocked ? "border-cinnabar/20 bg-cinnabar/[0.04]" : "border-ink/8 opacity-50"}`} key={ending.id}>
                  <span className="font-mono text-[9px] text-cinnabar">{unlocked ? ending.rarity : "??? / 未知"}</span>
                  <h3 className="mt-1 font-display text-lg font-bold">{unlocked ? ending.name : "尚未抵达的结局"}</h3>
                  <p className="mt-2 text-[11px] leading-5 text-ink/48">{unlocked ? ending.summary : "另一组选择，也许会把你带到这里。"}</p>
                </article>
              );
            })}
          </div>
        )}
        {tab === "jobs" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {jobs.filter((job) => !["student", "unemployed"].includes(job.id)).map((job) => {
              const unlocked = unlockedJobIds.includes(job.id);
              return (
                <article className={`rounded-sm border p-4 ${unlocked ? "border-ledger/25 bg-ledger/[0.05]" : "border-ink/8 opacity-50"}`} key={job.id}>
                  <div className="flex items-center justify-between"><h3 className="text-sm font-bold">{unlocked ? job.name : "未知职业"}</h3><span className="text-[9px] text-ink/40">{unlocked ? job.sector : "??"}</span></div>
                  <p className="mt-2 text-[11px] leading-5 text-ink/48">{unlocked ? job.description : "在某个选择之后，它会成为你的职业路线。"}</p>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </ModalShell>
  );
}

function ProgressCard({ label, value, total }: { label: string; value: number; total: number }) {
  const progress = Math.round((value / total) * 100);
  return (
    <article className="rounded-sm bg-ink p-5 text-paper">
      <span className="text-xs text-paper/55">{label}</span>
      <strong className="mt-2 block font-mono text-3xl">{value}<small className="text-sm text-paper/35"> / {total}</small></strong>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-paper/15"><div className="h-full bg-brass" style={{ width: `${progress}%` }} /></div>
    </article>
  );
}
