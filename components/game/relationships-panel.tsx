import type { Player } from "@/types";

export function RelationshipsPanel({ player }: { player: Player }) {
  return (
    <section className="paper-card rounded-sm p-5">
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/40">People / 人物关系</p>
      <h2 className="mt-1 font-display text-2xl font-bold">与你一起走过的人</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {player.relationships.map((relationship) => (
          <article className="rounded-sm border border-ink/10 bg-white/50 p-4" key={relationship.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] text-cinnabar">{relationship.type}</span>
                <h3 className="mt-0.5 font-display text-lg font-bold">{relationship.name}</h3>
              </div>
              <span className="rounded-sm bg-jade/10 px-2 py-1 text-[9px] font-bold text-jade">{relationship.status}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-[10px]">
              <Meter label="好感" value={relationship.affection} />
              <Meter label="信任" value={relationship.trust} />
            </div>
            {relationship.memories.at(-1) && <p className="mt-3 border-t border-ink/10 pt-3 text-[11px] leading-5 text-ink/48">{relationship.memories.at(-1)}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between"><span>{label}</span><span className="font-mono">{value}</span></div>
      <div className="attribute-track"><div className="attribute-fill" style={{ width: `${value}%` }} /></div>
    </div>
  );
}
