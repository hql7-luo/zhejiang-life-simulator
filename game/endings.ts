import { endings } from "@/data/regions/zhejiang/endings";
import { cityNameOf } from "@/data/regions/zhejiang/cities";
import { achievementConditionMet } from "@/game/conditions";
import { livedLocations, returnHomeCount } from "@/game/migration";
import type { EndingResult, Player, TimelineEntry } from "@/types";

const keywordByTag: Record<string, string> = {
  杭漂: "杭漂",
  沪漂: "沪漂",
  深漂: "深漂",
  海外归来: "海归",
  回乡发展: "归乡",
  接手家业: "守业",
  拒绝接班: "走自己的路",
  外贸第一单: "外贸",
  跨境爆单: "跨境",
  编制上岸: "安稳",
  创业者: "闯荡",
  白手起家: "白手起家",
  技术能手: "匠心",
  杭州买房: "安家杭州",
  一生未买房: "无房也自由",
  提前退休: "提前退休",
  快乐第一: "悦己",
  幸福家庭: "重视家庭",
  浙江走遍: "走遍浙江",
  数字游民: "数字游民",
  五十岁转行: "重新出发",
};

export function calculateEnding(player: Player, timeline: TimelineEntry[]): EndingResult {
  const ending =
    [...endings]
      .sort((a, b) => b.priority - a.priority)
      .find((candidate) => achievementConditionMet(candidate.condition, player)) ??
    endings[endings.length - 1]!;
  const attributeValues = Object.values(player.attributes);
  const attributeScore = Math.round(
    attributeValues.reduce((sum, value) => sum + value, 0) / attributeValues.length,
  );
  const topChoices = [...timeline]
    .sort((a, b) => b.changes.length - a.changes.length)
    .slice(0, 3);
  const regret = [...timeline]
    .reverse()
    .find((entry) => entry.changes.some((change) => change.includes("-")));
  const keywords = [
    ...player.tags.map((tag) => keywordByTag[tag]).filter((item): item is string => Boolean(item)),
    returnHomeCount(player) > 0 ? "回家" : null,
    player.attributes.family >= 70 ? "重视家庭" : null,
    player.attributes.career >= 75 ? "事业进取" : null,
    player.attributes.health >= 70 ? "身心有度" : null,
    livedLocations(player).length >= 3 ? "多地闯荡" : null,
    cityNameOf(player.currentLocation),
    player.educationRoute,
    player.birth.personality,
  ].filter((item): item is string => Boolean(item));
  return {
    ending,
    attributeScore,
    wealthSummary:
      player.assets.savings + player.assets.investments >
      player.assets.mortgage + player.assets.otherDebt
        ? "资产稳健，留有余地"
        : player.assets.otherDebt + player.assets.mortgage > 800000
          ? "仍在承担长期负债"
          : "收支普通，基本平衡",
    familySummary:
      player.attributes.family >= 75
        ? "亲密可靠，彼此支持"
        : player.attributes.family >= 50
          ? "有过摩擦，也仍有联系"
          : "关系渐远，留下未说完的话",
    topChoices,
    regret,
    keywords: [...new Set(keywords)].slice(0, 8),
  };
}
