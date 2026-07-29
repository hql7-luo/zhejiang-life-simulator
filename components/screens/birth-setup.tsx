"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BrandMark } from "@/components/brand-mark";
import { ArrowIcon, RestartIcon } from "@/components/ui/icons";
import { familyBackgrounds, familyBackgroundMap } from "@/data/regions/zhejiang/birth-profiles";
import { cities, zhejiangCityIds } from "@/data/regions/zhejiang/cities";
import { randomBirthProfile } from "@/game/birth";
import { createSeed } from "@/game/random";
import { useGameStore } from "@/store/game-store";
import type { BirthProfile, FamilyBackgroundId, ZhejiangCityId } from "@/types";

const optionSets = {
  gender: ["女", "男", "非二元"],
  hukou: ["城镇", "农村"],
  familyWealth: ["困难", "普通", "小康", "富裕"],
  familyClimate: ["亲密", "平常", "紧张"],
  talent: ["好奇心", "运动感", "表达力", "动手能力", "耐心"],
  personality: ["谨慎", "外向", "坚韧", "随和", "独立"],
} as const;

export function BirthSetup() {
  const startGame = useGameStore((state) => state.startGame);
  const goHome = useGameStore((state) => state.goHome);
  const [seed, setSeed] = useState(() => createSeed("birth"));
  const [profile, setProfile] = useState<BirthProfile>(() => randomBirthProfile(seed));

  const update = <K extends keyof BirthProfile>(key: K, value: BirthProfile[K]) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };
  const updateBackground = (id: FamilyBackgroundId) => {
    const background = familyBackgroundMap[id];
    setProfile((current) => ({
      ...current,
      familyBackground: id,
      hukou: background.hukou,
      fatherJob: background.fatherJobs[0]!,
      motherJob: background.motherJobs[0]!,
      familyWealth: background.wealthPool[0]!,
    }));
  };
  const randomize = () => {
    const nextSeed = createSeed("birth");
    setSeed(nextSeed);
    setProfile(randomBirthProfile(nextSeed));
  };

  const background = familyBackgroundMap[profile.familyBackground];

  return (
    <main className="min-h-screen pb-12">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
        <button aria-label="返回首页" onClick={goHome}><BrandMark compact /></button>
        <button className="flex items-center gap-2 rounded-sm border border-ink/15 bg-white/60 px-4 py-2 text-sm font-bold hover:bg-white" onClick={randomize}>
          <RestartIcon className="h-4 w-4" />
          随机出生
        </button>
      </header>

      <section className="mx-auto max-w-5xl px-5 pt-4 sm:px-8 sm:pt-10">
        <div className="mb-8 max-w-2xl">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cinnabar">Birth dossier / 出生档案</p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">故事从浙江哪座城开始？</h1>
          <p className="mt-4 leading-7 text-ink/60">出生城市与家庭背景影响最初的资源与概率，但不会替你决定终点。你也可以随机一次，接受生活发来的第一手牌。</p>
        </div>

        <motion.div className="paper-card grid overflow-hidden rounded-sm lg:grid-cols-[1fr_280px]" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-8">
            <Field label="姓名">
              <input className="w-full border-b border-ink/25 bg-transparent px-1 py-3 font-bold outline-none focus:border-cinnabar" maxLength={8} value={profile.name} onChange={(event) => update("name", event.target.value)} />
            </Field>
            <Field label="出生年份">
              <input className="w-full border-b border-ink/25 bg-transparent px-1 py-3 font-mono font-bold outline-none focus:border-cinnabar" max={2015} min={1960} type="number" value={profile.birthYear} onChange={(event) => update("birthYear", Number(event.target.value))} />
            </Field>
            <SelectField label="性别" value={profile.gender} options={optionSets.gender} onChange={(value) => update("gender", value as BirthProfile["gender"])} />
            <Field label="出生城市">
              <select
                className="w-full border-b border-ink/25 bg-transparent px-1 py-3 outline-none focus:border-cinnabar"
                value={profile.city}
                onChange={(event) => update("city", event.target.value as ZhejiangCityId)}
              >
                {zhejiangCityIds.map((id) => (
                  <option key={id} value={id}>{cities[id].name} — {cities[id].description}</option>
                ))}
              </select>
            </Field>
            <Field label="家庭背景">
              <select
                className="w-full border-b border-ink/25 bg-transparent px-1 py-3 outline-none focus:border-cinnabar"
                value={profile.familyBackground}
                onChange={(event) => updateBackground(event.target.value as FamilyBackgroundId)}
              >
                {familyBackgrounds.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </Field>
            <SelectField label="户籍类型" value={profile.hukou} options={optionSets.hukou} onChange={(value) => update("hukou", value as BirthProfile["hukou"])} />
            <SelectField label="家庭经济" value={profile.familyWealth} options={optionSets.familyWealth} onChange={(value) => update("familyWealth", value as BirthProfile["familyWealth"])} />
            <SelectField label="家庭关系" value={profile.familyClimate} options={optionSets.familyClimate} onChange={(value) => update("familyClimate", value as BirthProfile["familyClimate"])} />
            <SelectField label="天赋" value={profile.talent} options={optionSets.talent} onChange={(value) => update("talent", value as BirthProfile["talent"])} />
            <SelectField label="初始性格" value={profile.personality} options={optionSets.personality} onChange={(value) => update("personality", value as BirthProfile["personality"])} />
            <Field label="父亲职业">
              <input className="w-full border-b border-ink/25 bg-transparent px-1 py-3 outline-none focus:border-cinnabar" value={profile.fatherJob} onChange={(event) => update("fatherJob", event.target.value)} />
            </Field>
            <Field label="母亲职业">
              <input className="w-full border-b border-ink/25 bg-transparent px-1 py-3 outline-none focus:border-cinnabar" value={profile.motherJob} onChange={(event) => update("motherJob", event.target.value)} />
            </Field>
            <p className="rounded-sm bg-ink/[0.045] p-3 text-xs leading-6 text-ink/55 sm:col-span-2">{background.description}</p>
          </div>

          <aside className="flex flex-col justify-between border-t border-ink/10 bg-ink p-6 text-paper lg:border-l lg:border-t-0">
            <div>
              <span className="stamp h-16 w-16 border-paper/80 text-paper">初始</span>
              <p className="mt-8 font-display text-3xl font-bold">{profile.name || "未命名"}</p>
              <dl className="mt-5 space-y-3 text-sm">
                <Summary label="出发地" value={cities[profile.city].name} />
                <Summary label="家庭" value={`${background.name} · ${profile.familyWealth}`} />
                <Summary label="特质" value={`${profile.talent} · ${profile.personality}`} />
                <Summary label="随机种子" value={seed.slice(-12)} mono />
              </dl>
            </div>
            <div className="mt-10">
              <p className="mb-4 text-xs leading-5 text-paper/55">点击后将从 6 岁开始。每个选择都会推进时间并自动保存。</p>
              <button
                className="group flex min-h-14 w-full items-center justify-center gap-3 rounded-sm bg-cinnabar px-5 font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"
                disabled={!profile.name.trim()}
                onClick={() => startGame({ ...profile, name: profile.name.trim() }, seed)}
              >
                领取这段人生
                <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </aside>
        </motion.div>
      </section>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink/45">{label}</span>{children}</label>;
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return (
    <Field label={label}>
      <select className="w-full border-b border-ink/25 bg-transparent px-1 py-3 outline-none focus:border-cinnabar" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </Field>
  );
}

function Summary({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return <div className="border-b border-paper/15 pb-3"><dt className="text-[10px] text-paper/45">{label}</dt><dd className={`mt-1 ${mono ? "font-mono text-xs" : "font-medium"}`}>{value}</dd></div>;
}
