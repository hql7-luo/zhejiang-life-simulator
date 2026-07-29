import type { TimelineEntry } from "@/types";

export function TimelinePanel({ timeline }: { timeline: TimelineEntry[] }) {
  return (
    <aside className="paper-card rounded-sm p-5">
      <div className="mb-5 flex items-end justify-between border-b border-ink/10 pb-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/40">Life log / 生涯记录</p>
          <h2 className="mt-1 font-display text-xl font-bold">已经写下的选择</h2>
        </div>
        <span className="font-mono text-lg font-bold text-cinnabar">{timeline.length}</span>
      </div>
      {timeline.length === 0 ? (
        <p className="py-8 text-center text-sm leading-6 text-ink/45">第一条人生记录，正等你写下。</p>
      ) : (
        <ol className="relative ml-2 border-l border-ink/15">
          {[...timeline].reverse().slice(0, 9).map((entry, index) => (
            <li className="relative ml-5 pb-5 last:pb-0" key={entry.id}>
              <span className={`absolute -left-[25px] top-1.5 h-2 w-2 rounded-full ${index === 0 ? "bg-cinnabar ring-4 ring-cinnabar/10" : "bg-ledger"}`} />
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[9px] font-bold text-cinnabar">{entry.age} 岁 · {entry.year}</span>
                <span className="text-[9px] text-ink/35">{entry.category}</span>
              </div>
              <p className="mt-1 text-xs font-bold leading-5">{entry.title}</p>
              <p className="mt-0.5 line-clamp-2 text-[11px] leading-5 text-ink/48">{entry.choice}</p>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}
