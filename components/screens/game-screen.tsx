"use client";

import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { AssetsPanel } from "@/components/game/assets-panel";
import { AttributePanel } from "@/components/game/attribute-panel";
import { EventCard } from "@/components/game/event-card";
import { RelationshipsPanel } from "@/components/game/relationships-panel";
import { TimelinePanel } from "@/components/game/timeline-panel";
import { ArchiveIcon, PeopleIcon, SlidersIcon, TimelineIcon, WalletIcon } from "@/components/ui/icons";
import { cityNameOf } from "@/data/regions/zhejiang/cities";
import { useGameStore } from "@/store/game-store";

interface GameScreenProps {
  onArchive: () => void;
  onSettings: () => void;
}

type MobileTab = "event" | "status" | "timeline" | "people";

export function GameScreen({ onArchive, onSettings }: GameScreenProps) {
  const player = useGameStore((state) => state.player);
  const event = useGameStore((state) => state.currentEvent);
  const timeline = useGameStore((state) => state.timeline);
  const choose = useGameStore((state) => state.choose);
  const isDaily = useGameStore((state) => state.isDaily);
  const [mobileTab, setMobileTab] = useState<MobileTab>("event");
  const [detailTab, setDetailTab] = useState<"assets" | "people">("assets");

  if (!player || !event) return null;
  const lifeProgress = Math.min(100, ((player.age - 6) / 74) * 100);

  return (
    <main className="safe-bottom min-h-screen">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-3 sm:px-6">
          <BrandMark compact />
          <div className="flex items-center gap-3 sm:gap-6">
            {isDaily && <span className="hidden rounded-sm bg-brass px-2.5 py-1 text-[10px] font-bold sm:block">今日同题人生</span>}
            <span className="hidden rounded-sm border border-jade/25 bg-jade/[0.07] px-2.5 py-1 text-[10px] font-bold text-jade sm:block">
              {cityNameOf(player.currentLocation)}
            </span>
            <div className="text-right">
              <span className="block font-mono text-lg font-bold leading-none">{player.age} 岁</span>
              <span className="mt-1 block font-mono text-[9px] text-ink/42">{player.currentYear} · {player.stage}</span>
            </div>
            <button aria-label="打开图鉴" className="rounded-full border border-ink/15 p-2 hover:bg-white" onClick={onArchive}><ArchiveIcon className="h-4 w-4" /></button>
            <button aria-label="打开设置" className="rounded-full border border-ink/15 p-2 hover:bg-white" onClick={onSettings}><SlidersIcon className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="h-[3px] bg-ink/[0.08]"><div className="h-full bg-cinnabar transition-[width] duration-500" style={{ width: `${lifeProgress}%` }} /></div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[260px_minmax(0,720px)_260px] lg:items-start lg:justify-center lg:py-7 xl:grid-cols-[280px_minmax(0,760px)_280px]">
        <div className={`${mobileTab === "status" ? "block" : "hidden"} lg:sticky lg:top-24 lg:block`}>
          <AttributePanel player={player} />
        </div>

        <div className={`${mobileTab === "event" || mobileTab === "people" ? "block" : "hidden"} space-y-5 lg:block`}>
          {mobileTab === "people" ? (
            <RelationshipsPanel player={player} />
          ) : (
            <>
              <EventCard event={event} onChoose={choose} />
              <div className="hidden lg:block">
                <div className="mb-3 flex gap-1 border-b border-ink/10">
                  <button className={`px-4 py-2 text-xs font-bold ${detailTab === "assets" ? "border-b-2 border-cinnabar text-cinnabar" : "text-ink/45"}`} onClick={() => setDetailTab("assets")}>资产账本</button>
                  <button className={`px-4 py-2 text-xs font-bold ${detailTab === "people" ? "border-b-2 border-cinnabar text-cinnabar" : "text-ink/45"}`} onClick={() => setDetailTab("people")}>人物关系</button>
                </div>
                {detailTab === "assets" ? <AssetsPanel player={player} /> : <RelationshipsPanel player={player} />}
              </div>
            </>
          )}
        </div>

        <div className={`${mobileTab === "timeline" ? "block" : "hidden"} lg:sticky lg:top-24 lg:block`}>
          <TimelinePanel timeline={timeline} />
        </div>
      </div>

      <nav aria-label="游戏页面导航" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-ink/10 bg-[#fbf8ef]/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_rgba(27,42,53,.08)] backdrop-blur-lg lg:hidden">
        <MobileNav active={mobileTab === "event"} icon={<WalletIcon className="h-5 w-5" />} label="事件" onClick={() => setMobileTab("event")} />
        <MobileNav active={mobileTab === "status"} icon={<ArchiveIcon className="h-5 w-5" />} label="属性" onClick={() => setMobileTab("status")} />
        <MobileNav active={mobileTab === "timeline"} icon={<TimelineIcon className="h-5 w-5" />} label="时间线" onClick={() => setMobileTab("timeline")} />
        <MobileNav active={mobileTab === "people"} icon={<PeopleIcon className="h-5 w-5" />} label="关系" onClick={() => setMobileTab("people")} />
      </nav>
    </main>
  );
}

function MobileNav({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-bold ${active ? "text-cinnabar" : "text-ink/42"}`} onClick={onClick}>
      {icon}
      {label}
    </button>
  );
}
