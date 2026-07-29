import type { PlayerAttributes } from "@/types";

export const attributeLabels: Record<keyof PlayerAttributes, string> = {
  health: "健康",
  intelligence: "智力",
  emotional: "情商",
  happiness: "快乐",
  money: "财商",
  family: "家庭",
  network: "人脉",
  education: "学历",
  career: "事业",
  stress: "压力",
  familyIndustry: "家庭产业",
  localNetwork: "本地人脉",
  skill: "专业技能",
  cityAdapt: "城市适应",
  entrepreneurship: "创业经验",
  familyDuty: "家庭责任",
  riskTolerance: "风险承受",
};

/** 隐藏属性的定性描述，不直接展示数值 */
export function hiddenAttributeLabel(value: number): string {
  if (value >= 70) return "深厚";
  if (value >= 45) return "扎实";
  if (value >= 25) return "一般";
  return "薄弱";
}

export function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 10000) {
    return `${sign}¥${(abs / 10000).toFixed(abs >= 100000 ? 0 : 1)}万`;
  }
  return `${sign}¥${Math.round(abs).toLocaleString("zh-CN")}`;
}

export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}
