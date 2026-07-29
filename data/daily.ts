import { dailySeed } from "@/game/random";
import type { DailyChallenge } from "@/types";

const challengePool: Array<Omit<DailyChallenge, "id" | "date" | "seed">> = [
  {
    title: "杭漂十年",
    description: "在杭州累计生活十年以上，并留到最后。",
    goal: { type: "yearsInLocation", location: "hangzhou", years: 10 },
  },
  {
    title: "第一单",
    description: "做成第一笔外贸或跨境生意（获得对应标签）。",
    goal: { type: "keepTags", tags: ["外贸第一单", "跨境爆单"] },
  },
  {
    title: "守业",
    description: "接手家里的产业，并把它守到退休。",
    goal: { type: "tag", tag: "接手家业" },
  },
  {
    title: "归乡",
    description: "在外闯荡之后，回到家乡城市安度后半生。",
    goal: { type: "tag", tag: "回乡发展" },
  },
  {
    title: "无房也自由",
    description: "一生不买房，快乐值保持在 70 以上。",
    goal: { type: "noHouseHappy", minHappiness: 70 },
  },
  {
    title: "百万目标",
    description: "让人生最终存款达到 100 万元。",
    goal: { type: "savingsByAge", amount: 1000000 },
  },
  {
    title: "技能突围",
    description: "从职业学校出发，成为独当一面的技术人员。",
    goal: { type: "keepTags", tags: ["技术能手", "高级技师"] },
  },
];

export function getDailyChallenge(date = new Date()): DailyChallenge {
  const seed = dailySeed(date);
  const dateKey = seed.replace("daily-", "");
  const numeric = Number(dateKey.replaceAll("-", ""));
  const challenge = challengePool[numeric % challengePool.length]!;
  return {
    id: `challenge-${numeric % challengePool.length}`,
    date: dateKey,
    seed,
    ...challenge,
  };
}
