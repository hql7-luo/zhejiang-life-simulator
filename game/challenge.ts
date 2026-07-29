import { cityNameOf } from "@/data/regions/zhejiang/cities";
import { yearsInLocation } from "@/game/migration";
import type { ChallengeResult, DailyChallenge, Player } from "@/types";

/** 每日挑战达成判定：在游戏结束时调用 */
export function evaluateChallenge(challenge: DailyChallenge, player: Player): ChallengeResult {
  const goal = challenge.goal;
  switch (goal.type) {
    case "yearsInLocation": {
      const location = goal.location!;
      const years = yearsInLocation(player, location);
      const met = years >= (goal.years ?? 0) && player.currentLocation === location;
      return met
        ? { completed: true, reason: `在${cityNameOf(location)}累计生活 ${years} 年，挑战完成。` }
        : { completed: false, reason: `在${cityNameOf(location)}累计生活 ${years} 年（目标 ${goal.years} 年且最终留在当地）。` };
    }
    case "keepTags": {
      const hit = goal.tags?.find((tag) => player.tags.includes(tag));
      return hit
        ? { completed: true, reason: `获得标签「${hit}」，挑战完成。` }
        : { completed: false, reason: `未能获得目标标签（${goal.tags?.join(" / ")}）。` };
    }
    case "tag": {
      const met = player.tags.includes(goal.tag!);
      return met
        ? { completed: true, reason: `获得标签「${goal.tag}」，挑战完成。` }
        : { completed: false, reason: `未能获得标签「${goal.tag}」。` };
    }
    case "noHouseHappy": {
      const noHouse = player.assets.house === "无房" || player.assets.house === "租房";
      const happy = player.attributes.happiness >= (goal.minHappiness ?? 70);
      const met = noHouse && happy;
      return met
        ? { completed: true, reason: `一生未买房且快乐值 ${player.attributes.happiness}，挑战完成。` }
        : {
            completed: false,
            reason: noHouse
              ? `快乐值 ${player.attributes.happiness}，未达到 ${goal.minHappiness ?? 70}。`
              : "中途买了房，挑战失败。",
          };
    }
    case "savingsByAge": {
      const met = player.assets.savings >= (goal.amount ?? 0);
      return met
        ? { completed: true, reason: `最终存款达标，挑战完成。` }
        : { completed: false, reason: `最终存款未达到目标（目标 ¥${((goal.amount ?? 0) / 10000).toFixed(0)}万）。` };
    }
    default:
      return { completed: false, reason: "未知的挑战类型。" };
  }
}
