export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`stamp shrink-0 ${compact ? "h-9 w-9 text-sm" : "h-11 w-11 text-base"}`}>浙里</span>
      <span className={compact ? "hidden sm:block" : "block"}>
        <span className="block font-display text-lg font-bold leading-none tracking-[0.12em]">浙江人生模拟器</span>
        <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.18em] text-ink/55">Zhejiang Life Simulator</span>
      </span>
    </div>
  );
}
