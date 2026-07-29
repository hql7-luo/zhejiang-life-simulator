import { describe, expect, it } from "vitest";
import { calculateUnlockedAchievements } from "@/game/achievements";
import { calculateAnnualEconomy, simulateEconomy } from "@/game/economy";
import { calculateEnding } from "@/game/endings";
import { initializePlayer } from "@/game/initialize";
import { recordMigration } from "@/game/migration";
import { birthFixture } from "@/tests/fixtures";

describe("经济、成就与结局", () => {
  it("城市生活成本不同：杭州明显高于丽水", () => {
    const hangzhouPlayer = initializePlayer(birthFixture);
    hangzhouPlayer.currentLocation = "hangzhou";
    hangzhouPlayer.age = 30;
    const lishuiPlayer = initializePlayer(birthFixture);
    lishuiPlayer.currentLocation = "lishui";
    lishuiPlayer.age = 30;
    const hangzhou = calculateAnnualEconomy(hangzhouPlayer, "economy", 0);
    const lishui = calculateAnnualEconomy(lishuiPlayer, "economy", 0);
    expect(hangzhou.expense).toBeGreaterThan(lishui.expense);
  });

  it("城市产业匹配会提高对应职业收入", () => {
    const inHangzhou = initializePlayer(birthFixture);
    inHangzhou.currentLocation = "hangzhou";
    inHangzhou.currentJob = "internet";
    inHangzhou.age = 28;
    const inLishui = initializePlayer(birthFixture);
    inLishui.currentLocation = "lishui";
    inLishui.currentJob = "internet";
    inLishui.age = 28;
    const hangzhou = calculateAnnualEconomy(inHangzhou, "same-seed", 0);
    const lishui = calculateAnnualEconomy(inLishui, "same-seed", 0);
    expect(hangzhou.income).toBeGreaterThan(lishui.income);
  });

  it("多年经济模拟累计收入、支出并处理负债", () => {
    const player = initializePlayer(birthFixture);
    player.currentJob = "service";
    player.currentLocation = "shanghai";
    player.age = 30;
    player.stage = "职业";
    player.assets.savings = 0;
    const result = simulateEconomy(player, 3, "economy", 0);
    expect(result.assets.totalIncome).toBeGreaterThan(0);
    expect(result.assets.totalExpense).toBeGreaterThan(0);
    expect(result.assets.otherDebt).toBeGreaterThanOrEqual(0);
  });

  it("未成年人的基础生活费由家庭承担，不直接耗尽个人资源", () => {
    const player = initializePlayer(birthFixture);
    const initialSavings = player.assets.savings;
    const result = simulateEconomy(player, 5, "childhood", 0);
    expect(result.assets.savings).toBe(initialSavings);
    expect(result.assets.otherDebt).toBe(0);
  });

  it("达到标签与属性条件后解锁成就", () => {
    const player = initializePlayer(birthFixture);
    player.age = 76;
    player.assets.house = "租房";
    player.tags.push("接手家业");
    player.currentJob = "family-successor";
    const unlocked = calculateUnlockedAchievements(player);
    expect(unlocked).toContain("no-house-forever");
    expect(unlocked).toContain("takeover");
  });

  it("杭漂十年成就按累计居住年数判定", () => {
    const player = initializePlayer(birthFixture);
    player.age = 40;
    player.currentLocation = "hangzhou";
    // 模拟 20 岁搬到杭州
    player.migrationHistory.push({ age: 20, year: 2018, from: "taizhou", to: "hangzhou", reason: "工作" });
    const unlocked = calculateUnlockedAchievements(player);
    expect(unlocked).toContain("hangpiao-decade");
  });

  it("负债百万成就按总负债判定", () => {
    const player = initializePlayer(birthFixture);
    player.assets.otherDebt = 1_100_000;
    expect(calculateUnlockedAchievements(player)).toContain("million-debt");
  });

  it("结局计算不只依赖财富并始终返回结果", () => {
    const player = initializePlayer(birthFixture);
    player.age = 81;
    player.attributes.happiness = 88;
    player.attributes.family = 80;
    player.assets.savings = 10000;
    const result = calculateEnding(player, []);
    expect(result.ending.id).toBe("happy-family-life");
    expect(result.attributeScore).toBeGreaterThan(0);
    expect(result.keywords.length).toBeGreaterThan(0);
  });

  it("负债扩张的老板会进入负债结局", () => {
    const player = initializePlayer(birthFixture);
    player.age = 60;
    player.tags.push("扩厂", "负债经营");
    player.assets.businessDebt = 1_200_000;
    player.attributes.stress = 60;
    const result = calculateEnding(player, []);
    expect(result.ending.id).toBe("debt-boss");
  });

  it("仅有正常房贷、财务健康的玩家不会被误判为负债老板", () => {
    const player = initializePlayer(birthFixture);
    player.age = 55;
    player.tags.push("扩厂", "负债经营");
    // 杭州正常按揭：房贷 150 万但非房贷负债为 0、压力正常
    player.assets.mortgage = 1_500_000;
    player.attributes.stress = 30;
    player.attributes.happiness = 80;
    player.attributes.family = 80;
    const result = calculateEnding(player, []);
    expect(result.ending.id).not.toBe("debt-boss");
  });

  it("退休后仍会按完整职业履历判断职业类结局", () => {
    const player = initializePlayer(birthFixture);
    player.age = 81;
    player.currentJob = "unemployed";
    player.tags.push("编制上岸");
    player.attributes.career = 60;
    player.attributes.happiness = 60;
    player.careerHistory.push({
      age: 27,
      year: 2025,
      jobId: "civil-service",
      title: "公务员",
      action: "入职",
      annualIncome: 125_000,
    });
    const result = calculateEnding(player, []);
    expect(result.ending.id).toBe("civil-stable-life");
  });

  it("沪漂后回乡会进入上海回归结局", () => {
    const player = initializePlayer(birthFixture);
    player.age = 45;
    player.attributes.career = 55;
    recordMigration(player, "shanghai", "工作");
    recordMigration(player, "taizhou", "回乡发展");
    player.attributes.family = 40;
    player.attributes.happiness = 40;
    player.assets.savings = 100000;
    const result = calculateEnding(player, []);
    expect(result.ending.id).toBe("shanghai-returnee");
    expect(player.tags).toContain("沪漂");
    expect(player.tags).toContain("回乡发展");
  });

  it("结局兜底：无特殊标签时返回浙江普通人的一生", () => {
    const player = initializePlayer(birthFixture);
    player.age = 82;
    player.attributes.happiness = 40;
    player.attributes.family = 40;
    player.tags = [];
    const result = calculateEnding(player, []);
    expect(result.ending.id).toBe("zhejiang-ordinary");
  });
});
