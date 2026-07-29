"use client";

import { useState } from "react";
import { ModalShell } from "@/components/panels/modal-shell";
import { useGameStore } from "@/store/game-store";

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const player = useGameStore((state) => state.player);
  const seed = useGameStore((state) => state.seed);
  const timeline = useGameStore((state) => state.timeline);
  const goHome = useGameStore((state) => state.goHome);
  const clearProgress = useGameStore((state) => state.clearProgress);
  const [confirming, setConfirming] = useState(false);

  return (
    <ModalShell eyebrow="Settings / 设置" onClose={onClose} title="本地游戏设置">
      <div className="space-y-6 p-5 sm:p-7">
        <section className="rounded-sm border border-ink/10 bg-white/45 p-5">
          <h3 className="font-bold">自动存档</h3>
          <p className="mt-2 text-sm leading-6 text-ink/52">每次选择后自动保存在当前浏览器的 localStorage，不会上传到服务器。</p>
          <div className="mt-4 grid gap-3 text-xs sm:grid-cols-3">
            <Info label="当前人物" value={player?.birth.name ?? "暂无"} />
            <Info label="选择记录" value={`${timeline.length} 条`} />
            <Info label="随机种子" value={seed ? seed.slice(-14) : "暂无"} mono />
          </div>
        </section>
        <section className="rounded-sm border border-ink/10 bg-white/45 p-5">
          <h3 className="font-bold">显示与动效</h3>
          <p className="mt-2 text-sm leading-6 text-ink/52">游戏会自动遵循系统的“减少动态效果”设置；界面支持键盘焦点和移动端安全区域。</p>
        </section>
        <section className="rounded-sm border border-cinnabar/15 bg-cinnabar/[0.035] p-5">
          <h3 className="font-bold text-cinnabar">存档管理</h3>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            {player && (
              <button className="rounded-sm border border-ink/15 bg-white px-4 py-2.5 text-sm font-bold" onClick={() => { goHome(); onClose(); }}>
                暂停并回到首页
              </button>
            )}
            {!confirming ? (
              <button className="rounded-sm border border-cinnabar/25 px-4 py-2.5 text-sm font-bold text-cinnabar" onClick={() => setConfirming(true)}>清除全部本地进度</button>
            ) : (
              <button className="rounded-sm bg-cinnabar px-4 py-2.5 text-sm font-bold text-white" onClick={() => { clearProgress(); onClose(); }}>确认清除，不可恢复</button>
            )}
          </div>
        </section>
        <p className="text-[11px] leading-5 text-ink/42">版本 1.0 · 本项目为娱乐性质的开源游戏。所有角色和故事均为虚构，内容不构成教育、就业、投资、婚姻或人生建议。</p>
      </div>
    </ModalShell>
  );
}

function Info({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return <div className="rounded-sm bg-ink/[0.045] p-3"><span className="block text-[9px] text-ink/40">{label}</span><strong className={`mt-1 block truncate ${mono ? "font-mono text-[10px]" : ""}`}>{value}</strong></div>;
}
