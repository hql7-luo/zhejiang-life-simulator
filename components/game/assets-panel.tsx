import { formatCurrency } from "@/utils/format";
import type { Player } from "@/types";

export function AssetsPanel({ player }: { player: Player }) {
  const rows = [
    ["年收入", formatCurrency(player.assets.annualIncome)],
    ["年支出", formatCurrency(player.assets.annualExpense)],
    ["存款", formatCurrency(player.assets.savings)],
    ["投资资产", formatCurrency(player.assets.investments)],
    ["房贷", formatCurrency(player.assets.mortgage)],
    ["其他负债", formatCurrency(player.assets.otherDebt)],
    ["住房", player.assets.house],
    ["累计收入", formatCurrency(player.assets.totalIncome)],
  ];
  return (
    <section className="paper-card rounded-sm p-5">
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/40">Assets / 资产</p>
      <h2 className="mt-1 font-display text-2xl font-bold">这一年的账本</h2>
      <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-4">
        {rows.map(([label, value]) => (
          <div className="bg-[#fbf8ef] p-4" key={label}>
            <dt className="text-[10px] text-ink/42">{label}</dt>
            <dd className="mt-1 font-mono text-xs font-bold">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-[10px] leading-5 text-ink/42">金额为游戏化估算，会根据城市、职业、经验、家庭与住房状态变化，不代表真实收入或生活成本。</p>
    </section>
  );
}
