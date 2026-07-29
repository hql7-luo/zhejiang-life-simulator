import { dailySeed } from "@/game/random";
import type { DailyChallenge } from "@/types";

const challengePool = [
  ["杭漂十年", "在杭州累计生活十年以上，并留到最后。"],
  ["第一单", "三十岁前做成第一笔外贸或跨境生意。"],
  ["守业", "接手家里的产业，并把它守到退休。"],
  ["归乡", "在外闯荡之后，回到家乡城市安度后半生。"],
  ["无房也自由", "一生不买房，快乐值保持在 70 以上。"],
  ["百万目标", "三十五岁前让存款达到 100 万元。"],
  ["技能突围", "从职业学校出发，成为独当一面的技术人员。"],
] as const;

export function getDailyChallenge(date = new Date()): DailyChallenge {
  const seed = dailySeed(date);
  const dateKey = seed.replace("daily-", "");
  const numeric = Number(dateKey.replaceAll("-", ""));
  const challenge = challengePool[numeric % challengePool.length]!;
  return {
    id: `challenge-${numeric % challengePool.length}`,
    date: dateKey,
    seed,
    title: challenge[0],
    description: challenge[1],
  };
}
