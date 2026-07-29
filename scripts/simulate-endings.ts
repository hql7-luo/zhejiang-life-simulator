/**
 * 结局命中率批量模拟（pnpm simulate:endings）
 *
 * 固定 seed 批量玩通整局，输出每个结局的命中次数、命中率、
 * 常见出生城市、常见职业与平均属性，用于发布前审计：
 * - 永远无法触发的死结局
 * - 命中率异常低/异常高的结局
 * - 兜底结局占比
 *
 * 用法：pnpm simulate:endings [局数，默认 550]
 */
import { zhejiangCityIds, cityNameOf } from "@/data/regions/zhejiang/cities";
import { endings } from "@/data/regions/zhejiang/endings";
import { jobMap } from "@/data/regions/zhejiang/careers";
import { randomBirthProfile } from "@/game/birth";
import { applyChoice } from "@/game/effects";
import { calculateEnding } from "@/game/endings";
import { selectNextEvent, type EventOccurrences } from "@/game/events";
import { initializePlayer } from "@/game/initialize";
import { seededRandom } from "@/game/random";
import type { EndingResult, EventChoice, LifeEvent, Player, ZhejiangCityId } from "@/types";

type StrategyId = "conservative" | "aggressive" | "family" | "career" | "random";

const strategies: Array<{ id: StrategyId; name: string }> = [
  { id: "conservative", name: "保守" },
  { id: "aggressive", name: "激进" },
  { id: "family", name: "家庭优先" },
  { id: "career", name: "事业优先" },
  { id: "random", name: "随机" },
];

function pickChoice(strategy: StrategyId, event: LifeEvent, seed: string, cursor: number): EventChoice {
  const score = (choice: EventChoice): number => {
    const attrs = choice.effects.attributes ?? {};
    const value = (key: keyof NonNullable<typeof attrs>) => attrs[key] ?? 0;
    switch (strategy) {
      case "conservative":
        return -(value("stress") * 2) + value("health") + value("happiness") * 0.5 - (choice.effects.businessDebt ?? 0) / 100000 - (choice.effects.debt ?? 0) / 100000;
      case "aggressive":
        return value("career") * 1.5 + value("money") + value("entrepreneurship") + value("riskTolerance") * 0.5 + value("stress") * 0.3;
      case "family":
        return value("family") * 1.5 + value("happiness") + value("familyDuty") * 0.5 - value("stress");
      case "career":
        return value("career") * 2 + value("skill") + value("education") * 0.5;
      default:
        return 0;
    }
  };
  if (strategy === "random") {
    return event.choices[Math.floor(seededRandom(`${seed}:pick`, cursor) * event.choices.length)]!;
  }
  return [...event.choices].sort((a, b) => score(b) - score(a))[0]!;
}

interface GameResult {
  player: Player;
  ending: EndingResult;
  city: ZhejiangCityId;
  strategy: StrategyId;
}

function playGame(seed: string, city: ZhejiangCityId, strategy: StrategyId): GameResult {
  const birth = randomBirthProfile(seed, 1998, city);
  let player = initializePlayer(birth);
  const timeline = [];
  const occurrences: EventOccurrences = {};
  let recent: string[] = [];
  let selected = selectNextEvent(player, seed, 0, recent, occurrences);
  let cursor = selected.cursor;
  let steps = 0;
  while (player.age < 80 && player.attributes.health > 0 && steps < 150) {
    const event = selected.event;
    const choice = pickChoice(strategy, event, seed, cursor);
    const result = applyChoice(player, event, choice, seed, cursor);
    player = result.player;
    player.tags = [...new Set([...player.tags, `seen:${event.id}`])];
    occurrences[event.id] = {
      count: (occurrences[event.id]?.count ?? 0) + 1,
      lastAge: player.age - event.years,
    };
    timeline.push(result.timeline);
    recent = [...recent, event.id].slice(-6);
    selected = selectNextEvent(player, seed, cursor + 1, recent, occurrences);
    cursor = selected.cursor;
    steps += 1;
  }
  return { player, ending: calculateEnding(player, timeline), city, strategy };
}

function main() {
  const gamesPerCityStrategy = Math.max(1, Math.round(Number(process.argv[2] ?? 550) / (zhejiangCityIds.length * strategies.length)));
  const results: GameResult[] = [];
  for (const city of zhejiangCityIds) {
    for (const strategy of strategies) {
      for (let index = 0; index < gamesPerCityStrategy; index += 1) {
        results.push(playGame(`sim-${city}-${strategy.id}-${index}`, city, strategy.id));
      }
    }
  }

  const total = results.length;
  console.log(`\n=== 结局命中率模拟：${total} 局（${zhejiangCityIds.length} 城 × ${strategies.length} 策略 × ${gamesPerCityStrategy} seed）===\n`);

  interface Bucket {
    hits: number;
    cities: Map<string, number>;
    jobs: Map<string, number>;
    wealth: number[];
    happiness: number[];
    health: number[];
    family: number[];
    career: number[];
    strategies: Map<string, number>;
  }
  const buckets = new Map<string, Bucket>();
  for (const result of results) {
    const id = result.ending.ending.id;
    if (!buckets.has(id)) {
      buckets.set(id, { hits: 0, cities: new Map(), jobs: new Map(), wealth: [], happiness: [], health: [], family: [], career: [], strategies: new Map() });
    }
    const bucket = buckets.get(id)!;
    bucket.hits += 1;
    bucket.cities.set(result.city, (bucket.cities.get(result.city) ?? 0) + 1);
    const job = jobMap[result.player.currentJob].name;
    bucket.jobs.set(job, (bucket.jobs.get(job) ?? 0) + 1);
    bucket.wealth.push(result.player.assets.savings + result.player.assets.investments - result.player.assets.mortgage - result.player.assets.businessDebt - result.player.assets.otherDebt);
    bucket.happiness.push(result.player.attributes.happiness);
    bucket.health.push(result.player.attributes.health);
    bucket.family.push(result.player.attributes.family);
    bucket.career.push(result.player.attributes.career);
    bucket.strategies.set(result.strategy, (bucket.strategies.get(result.strategy) ?? 0) + 1);
  }

  const avg = (values: number[]) => Math.round(values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length));
  const top = (map: Map<string, number>, name: (key: string) => string, count = 2) =>
    [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, count).map(([key]) => name(key)).join("/");

  console.log("结局\t命中\t占比\t常见城市\t常见职业\t平均财富\t快乐\t健康\t家庭\t事业");
  const dead: string[] = [];
  for (const ending of endings) {
    const bucket = buckets.get(ending.id);
    if (!bucket) {
      dead.push(ending.id);
      console.log(`${ending.name}\t0\t0.0%\t-\t-\t-\t-\t-\t-\t-`);
      continue;
    }
    const rate = ((bucket.hits / total) * 100).toFixed(1);
    console.log(
      `${ending.name}\t${bucket.hits}\t${rate}%\t${top(bucket.cities, (key) => cityNameOf(key as ZhejiangCityId))}\t${top(bucket.jobs, (key) => jobMap[key as Player["currentJob"]]?.name ?? key)}\t${avg(bucket.wealth)}\t${avg(bucket.happiness)}\t${avg(bucket.health)}\t${avg(bucket.family)}\t${avg(bucket.career)}`,
    );
  }

  const fallback = buckets.get("zhejiang-ordinary");
  const fallbackRate = fallback ? (fallback.hits / total) * 100 : 0;
  console.log("\n=== 审计结论 ===");
  console.log(`死结局（0 命中）：${dead.length === 0 ? "无" : dead.join(", ")}`);
  console.log(`兜底结局占比：${fallbackRate.toFixed(1)}%（建议 < 40%）`);
  const rareCovered = endings.filter((ending) => ending.rarity === "稀有" || ending.rarity === "传说").filter((ending) => (buckets.get(ending.id)?.hits ?? 0) > 0).length;
  const rareTotal = endings.filter((ending) => ending.rarity === "稀有" || ending.rarity === "传说").length;
  console.log(`稀有/传说结局覆盖：${rareCovered}/${rareTotal}`);
}

main();
