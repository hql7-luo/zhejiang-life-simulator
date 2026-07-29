"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BrandMark } from "@/components/brand-mark";
import { CityIllustration } from "@/components/city-illustration";
import { ArchiveIcon, ArrowIcon, SlidersIcon, SparkIcon } from "@/components/ui/icons";
import { getDailyChallenge } from "@/data/daily";
import { cities, zhejiangCityIds } from "@/data/regions/zhejiang/cities";
import { randomBirthProfile } from "@/game/birth";
import { useGameStore } from "@/store/game-store";
import type { ZhejiangCityId } from "@/types";

interface HomeScreenProps {
  onArchive: () => void;
  onSettings: () => void;
}

export function HomeScreen({ onArchive, onSettings }: HomeScreenProps) {
  const openSetup = useGameStore((state) => state.openSetup);
  const startGame = useGameStore((state) => state.startGame);
  const resumeGame = useGameStore((state) => state.resumeGame);
  const player = useGameStore((state) => state.player);
  const currentEvent = useGameStore((state) => state.currentEvent);
  const daily = getDailyChallenge();
  const [challengeCity, setChallengeCity] = useState<ZhejiangCityId>("hangzhou");

  const startDaily = () => startGame(randomBirthProfile(daily.seed, 2000), daily.seed, true);
  const startRandom = () => {
    const seed = `random-${Date.now().toString(36)}`;
    startGame(randomBirthProfile(seed), seed);
  };
  const startCityChallenge = () => {
    const seed = `city-${challengeCity}-${Date.now().toString(36)}`;
    startGame(randomBirthProfile(seed, 1998, challengeCity), seed);
  };

  return (
    <main className="min-h-screen overflow-hidden">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <BrandMark />
        <nav aria-label="辅助功能" className="flex items-center gap-2">
          <button aria-label="打开人生图鉴" className="rounded-full border border-ink/15 bg-white/50 p-2.5 text-ink/70 hover:bg-white" onClick={onArchive}>
            <ArchiveIcon className="h-5 w-5" />
          </button>
          <button aria-label="打开设置" className="rounded-full border border-ink/15 bg-white/50 p-2.5 text-ink/70 hover:bg-white" onClick={onSettings}>
            <SlidersIcon className="h-5 w-5" />
          </button>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-5 sm:px-8 lg:grid-cols-[.92fr_1.08fr] lg:pb-24 lg:pt-14">
        <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.48 }}>
          <p className="mb-5 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-cinnabar">
            <SparkIcon className="h-4 w-4" />
            一次选择驱动的虚构人生 · 浙江
          </p>
          <h1 className="max-w-xl font-display text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            这一世，
            <br />
            <span className="relative inline-block text-cinnabar">
              生在浙江。
              <span className="absolute -bottom-1 left-0 h-[3px] w-full -rotate-1 bg-cinnabar/25" />
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-ink/65 sm:text-lg">
            十一座城，十一手牌。中考与高考、杭州的写字楼与家乡的小厂、外贸订单与直播间、买房与回乡——每个选择都会把你带向不同的结局。
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {player && currentEvent && (
              <button className="group flex min-h-14 items-center justify-center gap-3 rounded-sm bg-jade px-7 font-bold text-white shadow-lg shadow-jade/15" onClick={resumeGame}>
                继续 {player.birth.name} 的人生
                <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            )}
            <button className="group flex min-h-14 items-center justify-center gap-3 rounded-sm bg-ink px-7 font-bold text-paper shadow-lg shadow-ink/15" onClick={startRandom}>
              随机浙江人生
              <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="min-h-14 rounded-sm border border-ink/20 bg-white/55 px-7 font-bold text-ink hover:bg-white" onClick={openSetup}>
              自定义出生
            </button>
            <button className="min-h-14 rounded-sm border border-ink/20 bg-white/55 px-7 font-bold text-ink hover:bg-white" onClick={startDaily}>
              今日浙江人生
            </button>
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45" htmlFor="city-challenge">城市挑战</label>
            <div className="flex gap-2">
              <select
                className="min-h-11 flex-1 rounded-sm border border-ink/20 bg-white/70 px-3 text-sm font-bold outline-none focus:border-cinnabar sm:flex-none"
                id="city-challenge"
                onChange={(event) => setChallengeCity(event.target.value as ZhejiangCityId)}
                value={challengeCity}
              >
                {zhejiangCityIds.map((id) => (
                  <option key={id} value={id}>{cities[id].name} · {cities[id].flavor[0]}</option>
                ))}
              </select>
              <button className="min-h-11 rounded-sm bg-brass px-5 text-sm font-bold text-ink hover:brightness-105" onClick={startCityChallenge}>
                出生在这里
              </button>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/45">
            <span>固定种子可重玩</span>
            <span>11 座城市路线</span>
            <span>240+ 人生事件</span>
            <span>28 种结局</span>
          </div>
        </motion.div>

        <motion.div className="relative" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.58, delay: 0.08 }}>
          <div className="paper-card relative mx-auto max-w-2xl overflow-hidden rounded-sm p-5 sm:p-8">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">Life route / 人生路线</span>
                <p className="mt-1 font-display text-2xl font-bold">从家门口，到更远的地方</p>
              </div>
              <span className="stamp h-14 w-14 text-sm">启程</span>
            </div>
            <CityIllustration />
            <div className="ledger-rule mt-4 grid grid-cols-3 gap-4 pb-3 text-center">
              <div><strong className="block font-mono text-lg">11</strong><span className="text-xs text-ink/50">浙江城市</span></div>
              <div><strong className="block font-mono text-lg">12</strong><span className="text-xs text-ink/50">家庭背景</span></div>
              <div><strong className="block font-mono text-lg">25+</strong><span className="text-xs text-ink/50">职业路线</span></div>
            </div>
          </div>
          <button className="ticket-edge absolute -bottom-10 left-3 right-3 flex items-center gap-4 bg-brass px-6 py-4 text-left shadow-xl sm:-bottom-9 sm:left-auto sm:right-8 sm:w-[390px]" onClick={startDaily}>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/30 font-display text-lg font-bold">今</span>
            <span className="min-w-0">
              <span className="block font-mono text-[9px] uppercase tracking-[0.16em]">每日人生 · {daily.date}</span>
              <strong className="mt-1 block truncate text-sm">{daily.title}：{daily.description}</strong>
            </span>
          </button>
        </motion.div>
      </section>

      <footer className="border-t border-ink/10 px-5 py-5 text-center text-xs leading-5 text-ink/45">
        所有人物与故事均为虚构；城市只影响资源与概率，不决定成败。收入、教育、职业及生活事件为娱乐性简化模拟，不构成人生建议。
      </footer>
    </main>
  );
}
