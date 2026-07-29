import type { LifeStage } from "@/types";

export function getLifeStage(age: number): LifeStage {
  if (age < 12) return "童年";
  if (age < 18) return "中学";
  if (age < 23) return "教育";
  if (age < 35) return "职业";
  if (age < 60) return "成年";
  return "退休";
}
