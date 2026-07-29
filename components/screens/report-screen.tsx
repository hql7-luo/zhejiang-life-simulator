"use client";

import { useRef, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { ArchiveIcon, CopyIcon, DownloadIcon, RestartIcon } from "@/components/ui/icons";
import { familyBackgroundMap } from "@/data/regions/zhejiang/birth-profiles";
import { jobMap } from "@/data/regions/zhejiang/careers";
import { cities, cityNameOf } from "@/data/regions/zhejiang/cities";
import { livedLocations, returnHomeCount, yearsInLocation } from "@/game/migration";
import { useGameStore } from "@/store/game-store";
import { attributeLabels, formatCurrency, hiddenAttributeLabel } from "@/utils/format";
import { hiddenAttributeKeys, visibleAttributeKeys, type LocationId } from "@/types";

export function ReportScreen({ onArchive }: { onArchive: () => void }) {
  const player = useGameStore((state) => state.player);
  const result = useGameStore((state) => state.endingResult);
  const timeline = useGameStore((state) => state.timeline);
  const stats = useGameStore((state) => state.stats);
  const seed = useGameStore((state) => state.seed);
  const replaySameSeed = useGameStore((state) => state.replaySameSeed);
  const newLife = useGameStore((state) => state.newLife);
  const reportRef = useRef<HTMLDivElement>(null);
  const [notice, setNotice] = useState("");

  if (!player || !result) return null;

  const background = familyBackgroundMap[player.birth.familyBackground];
  const route: LocationId[] = [
    player.homeLocation,
    ...player.migrationHistory.map((record) => record.to),
  ];
  const cityYears = livedLocations(player)
    .map((location) => ({ location, years: yearsInLocation(player, location) }))
    .sort((a, b) => b.years - a.years)
    .slice(0, 4);

  const resultText = [
    `《${player.birth.name}的浙江人生档案》`,
    `出生：${player.birth.birthYear} 年 · ${cityNameOf(player.homeLocation)} · ${background.name}`,
    `路线：${route.map((id) => cityNameOf(id)).join(" → ")}`,
    `结局：${result.ending.name}`,
    result.ending.summary,
    `关键词：${result.keywords.join("、")}`,
    `最终职业：${jobMap[player.currentJob].name}`,
    `财富：${result.wealthSummary}`,
    `家庭：${result.familySummary}`,
    `人生评价：${result.ending.quote}`,
    `随机种子：${seed}`,
  ].join("\n");

  const copyResult = async () => {
    await navigator.clipboard.writeText(resultText);
    setNotice("文字结果已复制");
    window.setTimeout(() => setNotice(""), 1800);
  };
  const downloadImage = async () => {
    if (!reportRef.current) return;
    setNotice("正在生成结果卡片…");
    try {
      const { toBlob } = await import("html-to-image");
      const blob = await toBlob(reportRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#f3efe5",
      });
      if (!blob) throw new Error("Unable to render report image");
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `${player.birth.name}-浙江人生模拟器.png`;
      link.href = objectUrl;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      setNotice("PNG 已下载");
    } catch {
      setNotice("生成失败，请尝试浏览器截图");
    }
    window.setTimeout(() => setNotice(""), 2200);
  };

  return (
    <main className="min-h-screen pb-16">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <BrandMark compact />
        <button className="flex items-center gap-2 rounded-sm border border-ink/15 bg-white/55 px-4 py-2 text-sm font-bold" onClick={onArchive}><ArchiveIcon className="h-4 w-4" />人生图鉴</button>
      </header>

      <section className="mx-auto max-w-6xl px-4 pt-3 sm:px-8 sm:pt-8">
        <div className="mb-7 text-center">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cinnabar">Complete life archive / 浙江人生档案</p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">这一生，落笔成卷</h1>
        </div>

        <div ref={reportRef} className="paper-card mx-auto max-w-3xl overflow-hidden rounded-sm">
          <div className="grid bg-ink p-6 text-paper sm:grid-cols-[1fr_auto] sm:p-9">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-brass">Final archive · No. {seed.slice(-8).toUpperCase()}</p>
              <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">{result.ending.name}</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-paper/68">{result.ending.summary}</p>
            </div>
            <div className="mt-6 flex items-end justify-between sm:mt-0 sm:block sm:text-right">
              <span className="stamp h-20 w-20 border-paper/75 text-lg text-paper">{result.ending.rarity}</span>
              <p className="font-mono text-xs text-paper/45 sm:mt-6">{player.age} 岁 · {player.currentYear}</p>
            </div>
          </div>

          <div className="p-5 sm:p-9">
            <div className="grid gap-6 border-b border-ink/12 pb-7 sm:grid-cols-[1.25fr_.75fr]">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/40">Birth profile / 出生背景</span>
                <h3 className="mt-2 font-display text-2xl font-bold">{player.birth.name}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/58">
                  {player.birth.birthYear} 年出生于{cityNameOf(player.homeLocation)}，来自{background.name}（{player.birth.familyWealth}）。
                  天赋是{player.birth.talent}，最初的性格是{player.birth.personality}。
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-3">
                <ReportStat label="教育" value={player.educationRoute} />
                <ReportStat label="职业" value={jobMap[player.currentJob].name} />
                <ReportStat label="住房" value={player.assets.house} />
                <ReportStat label="家庭" value={`${player.marriage} · ${player.children} 子女`} />
              </dl>
            </div>

            <section className="border-b border-ink/12 py-7">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/40">Migration route / 人生迁移路线</span>
              <div className="mt-4 flex flex-wrap items-center gap-x-1 gap-y-2">
                {route.map((location, index) => (
                  <span className="flex items-center" key={`${location}-${index}`}>
                    {index > 0 && <span className="mx-1.5 font-mono text-cinnabar">→</span>}
                    <span
                      className={`rounded-sm border px-2.5 py-1.5 text-xs font-bold ${
                        location === player.currentLocation
                          ? "border-cinnabar bg-cinnabar text-white"
                          : cities[location].inZhejiang
                            ? "border-jade/25 bg-jade/[0.07] text-jade"
                            : "border-brass/40 bg-brass/15 text-ink"
                      }`}
                    >
                      {cityNameOf(location)}
                    </span>
                  </span>
                ))}
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {cityYears.map(({ location, years }) => (
                  <ReportStat key={location} label={`${cityNameOf(location)}居住`} value={`${years} 年`} />
                ))}
              </dl>
              <p className="mt-3 text-[11px] text-ink/45">
                迁移 {player.migrationHistory.length} 次 · 回乡 {returnHomeCount(player)} 次 · 最终定居{cityNameOf(player.currentLocation)}
              </p>
            </section>

            <div className="grid gap-8 border-b border-ink/12 py-7 sm:grid-cols-2">
              <section>
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/40">Final attributes / 最终属性</span>
                <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
                  {visibleAttributeKeys.map((key) => (
                    <div key={key}>
                      <div className="flex justify-between text-[10px]"><span>{attributeLabels[key]}</span><strong className="font-mono">{player.attributes[key]}</strong></div>
                      <div className="attribute-track mt-1"><div className={`attribute-fill ${key === "stress" ? "is-stress" : ""}`} style={{ width: `${player.attributes[key]}%` }} /></div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {hiddenAttributeKeys.map((key) => (
                    <span className="rounded-sm border border-ink/12 bg-white/55 px-2 py-1 text-[10px] text-ink/60" key={key}>
                      {attributeLabels[key]} · {hiddenAttributeLabel(player.attributes[key])}
                    </span>
                  ))}
                </div>
              </section>
              <section>
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/40">Life balance / 人生结算</span>
                <dl className="mt-4 space-y-3 text-xs">
                  <Row label="综合评分" value={`${result.attributeScore} / 100`} />
                  <Row label="最终存款" value={formatCurrency(player.assets.savings)} />
                  <Row label="投资资产" value={formatCurrency(player.assets.investments)} />
                  <Row label="总负债" value={formatCurrency(player.assets.mortgage + player.assets.otherDebt)} />
                  <Row label="最高年收入" value={formatCurrency(player.assets.peakAnnualIncome)} />
                  <Row label="财富状态" value={result.wealthSummary} />
                  <Row label="家庭状态" value={result.familySummary} />
                </dl>
              </section>
            </div>

            <section className="border-b border-ink/12 py-7">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/40">Turning points / 最重要的选择</span>
              <ol className="mt-4 grid gap-3 sm:grid-cols-3">
                {result.topChoices.map((entry, index) => (
                  <li className="rounded-sm border border-ink/10 bg-white/50 p-4" key={entry.id}>
                    <span className="font-mono text-[9px] font-bold text-cinnabar">0{index + 1} · {entry.age} 岁</span>
                    <h4 className="mt-2 text-xs font-bold leading-5">{entry.title}</h4>
                    <p className="mt-1 text-[10px] leading-5 text-ink/45">{entry.choice}</p>
                  </li>
                ))}
              </ol>
              {result.regret && <p className="mt-4 text-[11px] leading-5 text-ink/48">如果有一点遗憾：{result.regret.age} 岁那年，在“{result.regret.title}”中选择了“{result.regret.choice}”。</p>}
            </section>

            <section className="py-7">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/40">Keywords / 浙江人生关键词</span>
              <div className="mt-3 flex flex-wrap gap-2">{result.keywords.map((keyword) => <span className="rounded-sm border border-jade/20 bg-jade/[0.07] px-3 py-1.5 text-xs font-bold text-jade" key={keyword}>{keyword}</span>)}</div>
              <blockquote className="mt-7 border-l-4 border-cinnabar pl-5 font-display text-xl font-bold leading-8">“{result.ending.quote}”</blockquote>
            </section>

            <div className="flex flex-wrap justify-between gap-3 border-t border-ink/10 pt-5 font-mono text-[9px] text-ink/38">
              <span>{timeline.length} 次选择 · {stats.jobChanges} 次转行 · {player.migrationHistory.length} 次迁移</span>
              <span>ZHEJIANG LIFE SIMULATOR · 虚构人生</span>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button className="flex min-h-12 items-center justify-center gap-2 rounded-sm bg-cinnabar px-4 text-sm font-bold text-white" onClick={downloadImage}><DownloadIcon className="h-4 w-4" />下载 PNG</button>
          <button className="flex min-h-12 items-center justify-center gap-2 rounded-sm border border-ink/15 bg-white/55 px-4 text-sm font-bold" onClick={copyResult}><CopyIcon className="h-4 w-4" />复制文字</button>
          <button className="flex min-h-12 items-center justify-center gap-2 rounded-sm border border-ink/15 bg-white/55 px-4 text-sm font-bold" onClick={replaySameSeed}><RestartIcon className="h-4 w-4" />同种子重玩</button>
          <button className="min-h-12 rounded-sm bg-ink px-4 text-sm font-bold text-paper" onClick={newLife}>开始全新人生</button>
        </div>
        {notice && <div aria-live="polite" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-sm bg-ink px-5 py-3 text-sm font-bold text-paper shadow-xl">{notice}</div>}
      </section>
    </main>
  );
}

function ReportStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-sm bg-ink/[0.045] p-3"><dt className="text-[9px] text-ink/40">{label}</dt><dd className="mt-1 text-xs font-bold">{value}</dd></div>;
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-ink/12 pb-2"><dt className="text-ink/46">{label}</dt><dd className="text-right font-mono font-bold">{value}</dd></div>;
}
