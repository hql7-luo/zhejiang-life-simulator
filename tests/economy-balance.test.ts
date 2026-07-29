import { describe, expect, it } from "vitest";
import { allEvents } from "@/data/regions/zhejiang/events";
import {
  annualMortgagePayment,
  calculateAnnualEconomy,
  simulateEconomy,
  BUSINESS_DEBT_RATE,
  PERSONAL_DEBT_RATE,
} from "@/game/economy";
import { applyChoice } from "@/game/effects";
import { selectNextEvent, type EventOccurrences } from "@/game/events";
import { initializePlayer } from "@/game/initialize";
import { evaluateChallenge } from "@/game/challenge";
import { seededRandom } from "@/game/random";
import { birthFixture } from "@/tests/fixtures";
import type { DailyChallenge, LifeEvent, Player } from "@/types";

function workingPlayer(location: Player["currentLocation"], job: Player["currentJob"], age = 28): Player {
  const player = initializePlayer(birthFixture);
  player.currentLocation = location;
  player.currentJob = job;
  player.age = age;
  player.stage = age >= 60 ? "退休" : "职业";
  player.assets.savings = 200000;
  return player;
}

function eventOf(id: string): LifeEvent {
  const event = allEvents.find((item) => item.id === id);
  if (!event) throw new Error(`事件不存在: ${id}`);
  return event;
}

describe("经济平衡：城市成本与收入", () => {
  it("杭州租房年支出显著高于丽水", () => {
    const hz = workingPlayer("hangzhou", "internet");
    hz.assets.house = "租房";
    const ls = workingPlayer("lishui", "internet");
    ls.assets.house = "租房";
    const hzEconomy = calculateAnnualEconomy(hz, "rent", 0);
    const lsEconomy = calculateAnnualEconomy(ls, "rent", 0);
    expect(hzEconomy.expense).toBeGreaterThan(lsEconomy.expense * 1.3);
  });

  it("高收入职业（互联网）年收入明显高于低收入职业（服务业）", () => {
    const high = calculateAnnualEconomy(workingPlayer("hangzhou", "internet"), "job", 0);
    const low = calculateAnnualEconomy(workingPlayer("hangzhou", "service"), "job", 0);
    expect(high.income).toBeGreaterThan(low.income * 1.8);
  });

  it("低收入职业在低成本城市可以维持正结余", () => {
    const player = workingPlayer("lishui", "service");
    player.assets.house = "租房";
    const result = simulateEconomy(player, 5, "frugal", 0);
    // 丽水的服务业 5 年不应积累大额负债
    expect(result.assets.otherDebt).toBeLessThan(100000);
  });
});

describe("经济平衡：买房与租房", () => {
  it("按揭月供呈等额本息结构：首年利息占比高、本金逐年开始摊还", () => {
    const mortgage = 1_000_000;
    const payment = annualMortgagePayment(mortgage);
    const firstYearInterest = Math.round(mortgage * 0.041);
    expect(payment).toBeGreaterThan(firstYearInterest); // 月供必须覆盖利息才有本金摊还
    expect(payment).toBeLessThan(mortgage * 0.08); // 30 年期年供不应超过本金 8%
  });

  it("按揭 30 年左右可以还清并转为全款住房", () => {
    const player = workingPlayer("hangzhou", "internet", 30);
    player.assets.house = "按揭住房";
    player.assets.mortgage = 800000;
    player.assets.savings = 500000;
    const result = simulateEconomy(player, 32, "mortgage", 0);
    expect(result.assets.mortgage).toBe(0);
    expect(result.assets.house).toBe("全款住房");
  });

  it("长期租房不产生房贷但也不会因房租而负债滚雪球", () => {
    const player = workingPlayer("ningbo", "trade", 26);
    player.assets.house = "租房";
    const result = simulateEconomy(player, 10, "rent-long", 0);
    expect(result.assets.mortgage).toBe(0);
    expect(result.assets.otherDebt).toBeLessThan(200000);
  });
});

describe("经济平衡：创业与经营负债", () => {
  it("创业失败产生的经营负债按经营利率计息且与普通负债分离", () => {
    const player = workingPlayer("wenzhou", "factory-owner", 35);
    player.assets.businessDebt = 500000;
    player.assets.otherDebt = 100000;
    player.assets.savings = 0;
    const { expense } = calculateAnnualEconomy(player, "biz", 0);
    const withInterest = simulateEconomy(player, 1, "biz", 0);
    // 当年支出包含利息：500000*7.5% + 100000*6%
    expect(expense).toBeGreaterThan(0);
    expect(withInterest.assets.annualExpense).toBeGreaterThanOrEqual(
      Math.round(500000 * BUSINESS_DEBT_RATE + 100000 * PERSONAL_DEBT_RATE),
    );
    expect(withInterest.assets.businessDebt).toBe(500000); // 利息并入支出，不直接滚入本金
  });

  it("债务重组事件能同时削减经营负债与普通负债", () => {
    const player = workingPlayer("taizhou", "factory-owner", 40);
    player.assets.businessDebt = 400000;
    player.assets.otherDebt = 200000;
    const event = eventOf("zj-debt-restructure");
    const choice = event.choices.find((item) => item.id === "restructure")!;
    const { player: next } = applyChoice(player, event, choice, "test", 0);
    expect(next.assets.businessDebt).toBe(320000);
    expect(next.assets.otherDebt).toBe(160000);
  });

  it("家庭援助事件为深度负债玩家提供一次性恢复机会", () => {
    const player = workingPlayer("jinhua", "self-employed", 32);
    player.attributes.family = 70;
    player.assets.businessDebt = 300000;
    player.assets.otherDebt = 250000;
    const event = eventOf("zj-family-aid");
    const choice = event.choices.find((item) => item.id === "accept")!;
    const { player: next } = applyChoice(player, event, choice, "test", 0);
    expect(next.assets.otherDebt).toBe(150000);
    expect(next.assets.businessDebt).toBe(220000);
  });
});

describe("经济平衡：失业与防负反馈", () => {
  it("连续失业 5 年：消费降级保护使负债受控，代价是快乐与健康", () => {
    const player = workingPlayer("hangzhou", "unemployed", 30);
    player.assets.savings = 50000;
    player.attributes.happiness = 60;
    player.attributes.health = 60;
    const result = simulateEconomy(player, 5, "jobless", 0);
    // 旧版会负债数十万滚雪球；保护机制下 5 年失业负债应有界
    expect(result.assets.otherDebt).toBeLessThan(300000);
    expect(result.attributes.happiness).toBeLessThan(60);
    expect(result.attributes.health).toBeLessThan(60);
  });

  it("失业期间支出压缩：失业者年度支出低于同城同职业在岗者", () => {
    const employed = calculateAnnualEconomy(workingPlayer("hangzhou", "internet"), "emp", 0);
    const jobless = calculateAnnualEconomy(workingPlayer("hangzhou", "unemployed"), "emp", 0);
    expect(jobless.expense).toBeLessThan(employed.expense);
  });
});

describe("经济平衡：退休结算", () => {
  it("退休后停止负债滚息", () => {
    const player = workingPlayer("quzhou", "unemployed", 66);
    player.stage = "退休";
    player.assets.otherDebt = 200000;
    player.assets.businessDebt = 100000;
    player.assets.savings = 1000000; // 存款充足，排除赤字干扰
    const result = simulateEconomy(player, 3, "retire", 0);
    // 退休后负债不产生利息：本金不变（无赤字触发）
    expect(result.assets.otherDebt).toBeLessThanOrEqual(200000);
    expect(result.assets.businessDebt).toBeLessThanOrEqual(100000);
  });

  it("退休收入为原收入折减且有保底", () => {
    const player = workingPlayer("shaoxing", "unemployed", 62);
    player.stage = "退休";
    player.assets.annualIncome = 300000;
    const { income } = calculateAnnualEconomy(player, "pension", 0);
    expect(income).toBeGreaterThanOrEqual(36000);
    expect(income).toBeLessThanOrEqual(300000);
  });

  it("退休房贷事件以剩余房贷为条件而非总负债", () => {
    const event = eventOf("zj-retire-mortgage");
    expect(event.condition?.minMortgage).toBe(150000);
    expect(event.condition?.minDebt).toBeUndefined();
  });

  it("退休时一次性结清房贷可显著降低负债", () => {
    const player = workingPlayer("huzhou", "unemployed", 61);
    player.stage = "退休";
    player.tags.push("有房一族");
    player.assets.house = "按揭住房";
    player.assets.mortgage = 400000;
    const event = eventOf("zj-retire-mortgage");
    const choice = event.choices.find((item) => item.id === "payoff")!;
    const { player: next } = applyChoice(player, event, choice, "test", 0);
    // 结清 30 万后剩余约 10 万（事件跨度 1 年会再摊还一年本金）
    expect(next.assets.mortgage).toBeLessThan(100000);
    expect(next.assets.mortgage).toBeGreaterThan(50000);
  });
});

describe("随机乱选压力测试：负债不可逆累积回归", () => {
  it("30 局随机选择下，普通+经营负债不突破 400 万", () => {
    let worst = 0;
    for (let index = 0; index < 30; index += 1) {
      let player = initializePlayer(birthFixture);
      const occurrences: EventOccurrences = {};
      let recent: string[] = [];
      const seed = `chaos-${index}`;
      let selected = selectNextEvent(player, seed, 0, recent, occurrences);
      let cursor = selected.cursor;
      let steps = 0;
      while (player.age < 80 && player.attributes.health > 0 && steps < 150) {
        const event = selected.event;
        const choice = event.choices[Math.floor(seededRandom(seed, cursor) * event.choices.length)]!;
        const result = applyChoice(player, event, choice, seed, cursor);
        player = result.player;
        player.tags = [...new Set([...player.tags, `seen:${event.id}`])];
        recent = [...recent, event.id].slice(-6);
        selected = selectNextEvent(player, seed, cursor + 1, recent, occurrences);
        cursor = selected.cursor;
        steps += 1;
      }
      worst = Math.max(worst, player.assets.otherDebt + player.assets.businessDebt);
    }
    // 修复前乱选可负债 796 万；修复后应有界（保留高风险但不至于数倍于一生收入）
    expect(worst).toBeLessThan(4_000_000);
  });
});

describe("重复事件冷却机制", () => {
  const milestoneIds = [
    "zj-first-note", "zj-weekend-class", "zj-zhongkao", "zj-gaokao",
    "zj-vocational-path", "zj-postgrad", "zj-first-job", "zj-city-choice",
    "zj-family-factory-talk", "zj-marriage", "zj-child", "zj-house",
    "zj-midlife", "zj-parent-care", "zj-handover", "zj-retirement",
  ];

  function playerAt(age: number): Player {
    const player = workingPlayer("hangzhou", "internet", age);
    player.stage = "职业";
    // 里程碑优先于普通事件池；测试冷却机制前先标记全部已触发，避免抢占
    player.tags.push(...milestoneIds.map((id) => `seen:${id}`));
    return player;
  }

  it("一次性事件触发后不再出现", () => {
    const player = playerAt(24);
    const occurrences: EventOccurrences = {};
    // 标记里程碑已触发
    player.tags.push("seen:zj-marriage");
    for (let cursor = 0; cursor < 60; cursor += 1) {
      const { event } = selectNextEvent(player, "once", cursor, [], occurrences);
      expect(event.id).not.toBe("zj-marriage");
    }
  });

  it("可重复事件在冷却期内被抑制，冷却后可再次出现", () => {
    const overtime = eventOf("zj-c-overtime");
    expect(overtime.repeatable).toBe(true);
    const cooldown = overtime.cooldownYears ?? 0;
    expect(cooldown).toBeGreaterThan(0);
    const player = playerAt(30);
    player.tags.push("seen:zj-c-overtime");
    // 刚触发过（lastAge=30）：冷却期内不应被选中
    const hot: EventOccurrences = { "zj-c-overtime": { count: 1, lastAge: 30 } };
    for (let cursor = 0; cursor < 40; cursor += 1) {
      const { event } = selectNextEvent(player, "cool", cursor, [], hot);
      expect(event.id).not.toBe("zj-c-overtime");
    }
    // 冷却期后（lastAge=30，当前 30+cooldown+1）：允许重新进入候选池
    const cooled: EventOccurrences = { "zj-c-overtime": { count: 1, lastAge: 30 } };
    const older = playerAt(30 + cooldown + 1);
    older.tags.push("seen:zj-c-overtime");
    let seen = false;
    for (let cursor = 0; cursor < 200 && !seen; cursor += 1) {
      const { event } = selectNextEvent(older, "cool", cursor, [], cooled);
      if (event.id === "zj-c-overtime") seen = true;
    }
    expect(seen).toBe(true);
  });

  it("达到最大触发次数后永久移除", () => {
    const overtime = eventOf("zj-c-overtime");
    const max = overtime.maxOccurrences ?? 1;
    const player = playerAt(45); // 远超冷却期
    player.tags.push("seen:zj-c-overtime");
    const exhausted: EventOccurrences = { "zj-c-overtime": { count: max, lastAge: 20 } };
    for (let cursor = 0; cursor < 60; cursor += 1) {
      const { event } = selectNextEvent(player, "maxed", cursor, [], exhausted);
      expect(event.id).not.toBe("zj-c-overtime");
    }
  });
});

describe("每日挑战达成判定", () => {
  const base: Omit<DailyChallenge, "goal"> = {
    id: "2026-07-29",
    date: "2026-07-29",
    seed: "daily-seed",
    title: "测试挑战",
    description: "测试",
  };

  it("居住年限挑战：达成与未达成都有明确理由", () => {
    const player = workingPlayer("huzhou", "service", 40);
    player.currentLocation = "huzhou";
    player.migrationHistory.push({ age: 20, year: 2006, from: "taizhou", to: "huzhou", reason: "工作" });
    const challenge: DailyChallenge = {
      ...base,
      goal: { type: "yearsInLocation", location: "huzhou", years: 10 },
    };
    const met = evaluateChallenge(challenge, player);
    expect(met.completed).toBe(true);
    const failed = evaluateChallenge(
      { ...base, goal: { type: "yearsInLocation", location: "huzhou", years: 30 } },
      player,
    );
    expect(failed.completed).toBe(false);
    expect(failed.reason).toContain("30");
  });

  it("标签挑战：缺少目标标签时判定失败", () => {
    const player = workingPlayer("hangzhou", "internet", 35);
    const challenge: DailyChallenge = { ...base, goal: { type: "tag", tag: "杭漂" } };
    expect(evaluateChallenge(challenge, player).completed).toBe(false);
    player.tags.push("杭漂");
    expect(evaluateChallenge(challenge, player).completed).toBe(true);
  });

  it("不买房且快乐挑战：买房即失败", () => {
    const player = workingPlayer("lishui", "freelance", 50);
    player.assets.house = "租房";
    player.attributes.happiness = 80;
    const challenge: DailyChallenge = { ...base, goal: { type: "noHouseHappy", minHappiness: 70 } };
    expect(evaluateChallenge(challenge, player).completed).toBe(true);
    player.assets.house = "按揭住房";
    const result = evaluateChallenge(challenge, player);
    expect(result.completed).toBe(false);
    expect(result.reason).toContain("买了房");
  });

  it("存款挑战：以最终存款判定", () => {
    const player = workingPlayer("ningbo", "trade", 45);
    player.assets.savings = 600000;
    const challenge: DailyChallenge = { ...base, goal: { type: "savingsByAge", amount: 500000 } };
    expect(evaluateChallenge(challenge, player).completed).toBe(true);
    player.assets.savings = 100000;
    expect(evaluateChallenge(challenge, player).completed).toBe(false);
  });
});
