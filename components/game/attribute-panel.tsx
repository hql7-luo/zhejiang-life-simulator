import { motion } from "framer-motion";
import { jobMap } from "@/data/regions/zhejiang/careers";
import { cityNameOf } from "@/data/regions/zhejiang/cities";
import { attributeLabels, formatCurrency, hiddenAttributeLabel } from "@/utils/format";
import { hiddenAttributeKeys, visibleAttributeKeys, type Player } from "@/types";

export function AttributePanel({ player }: { player: Player }) {
  return (
    <aside className="paper-card rounded-sm p-5">
      <div className="mb-5 flex items-end justify-between border-b border-ink/10 pb-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/40">Status / 当前状态</p>
          <h2 className="mt-1 font-display text-xl font-bold">{player.birth.name}</h2>
        </div>
        <span className="stamp h-11 w-11 text-xs">{player.stage}</span>
      </div>
      <dl className="mb-6 grid grid-cols-2 gap-x-3 gap-y-4 text-sm">
        <Summary label="职业" value={jobMap[player.currentJob].name} />
        <Summary label="所在城市" value={cityNameOf(player.currentLocation)} />
        <Summary label="教育" value={player.educationRoute} />
        <Summary label="家庭" value={`${player.marriage} · ${player.children} 子女`} />
      </dl>
      <div className="space-y-3.5">
        {visibleAttributeKeys.map((key) => {
          const value = player.attributes[key];
          return (
            <div key={key}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-ink/62">{attributeLabels[key]}</span>
                <span className="font-mono font-bold">{value}</span>
              </div>
              <div className="attribute-track">
                <motion.div
                  animate={{ width: `${value}%` }}
                  className={`attribute-fill ${key === "stress" ? "is-stress" : ""}`}
                  initial={false}
                  transition={{ duration: 0.35 }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-5 border-t border-ink/10 pt-4">
        <p className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink/40">Hidden traits / 隐藏特质</p>
        <div className="flex flex-wrap gap-1.5">
          {hiddenAttributeKeys.map((key) => (
            <span
              className="rounded-sm border border-ink/12 bg-white/55 px-2 py-1 text-[10px] text-ink/60"
              key={key}
              title="隐藏数值，只影响事件与结局"
            >
              {attributeLabels[key]} · {hiddenAttributeLabel(player.attributes[key])}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 border-t border-ink/10 pt-4">
        <div>
          <span className="block text-[10px] text-ink/45">可用存款</span>
          <strong className="mt-1 block font-mono text-sm text-jade">{formatCurrency(player.assets.savings)}</strong>
        </div>
        <div className="border-l border-ink/10 pl-4">
          <span className="block text-[10px] text-ink/45">总负债</span>
          <strong className="mt-1 block font-mono text-sm text-cinnabar">{formatCurrency(player.assets.mortgage + player.assets.otherDebt)}</strong>
        </div>
      </div>
    </aside>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] text-ink/40">{label}</dt>
      <dd className="mt-0.5 truncate font-medium">{value}</dd>
    </div>
  );
}
