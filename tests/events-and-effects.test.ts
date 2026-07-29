import { describe, expect, it } from "vitest";
import { achievements } from "@/data/regions/zhejiang/achievements";
import { endings } from "@/data/regions/zhejiang/endings";
import {
  allEvents,
  commonEvents,
  eventCounts,
  hangzhouEvents,
  hiddenEvents,
  jinhuaEvents,
  ningboEvents,
  otherCityEvents,
  taizhouEvents,
  wenzhouEvents,
} from "@/data/regions/zhejiang/events";
import { eventConditionMet } from "@/game/conditions";
import { applyChoice } from "@/game/effects";
import { initializePlayer } from "@/game/initialize";
import { birthFixture } from "@/tests/fixtures";
import type { LifeEvent } from "@/types";

const milestoneIds = [
  "zj-first-note",
  "zj-weekend-class",
  "zj-zhongkao",
  "zj-gaokao",
  "zj-vocational-path",
  "zj-postgrad",
  "zj-first-job",
  "zj-city-choice",
  "zj-family-factory-talk",
  "zj-marriage",
  "zj-child",
  "zj-house",
  "zj-midlife",
  "zj-parent-care",
  "zj-handover",
  "zj-retirement",
];

describe("事件数据与选择效果", () => {
  it("事件目录满足浙江版数量要求且 id 唯一", () => {
    expect(eventCounts.common).toBeGreaterThanOrEqual(60);
    expect(eventCounts.hangzhou).toBeGreaterThanOrEqual(25);
    expect(eventCounts.ningbo).toBeGreaterThanOrEqual(20);
    expect(eventCounts.wenzhou).toBeGreaterThanOrEqual(20);
    expect(eventCounts.jinhua).toBeGreaterThanOrEqual(20);
    expect(eventCounts.taizhou).toBeGreaterThanOrEqual(25);
    expect(eventCounts.otherCities).toBeGreaterThanOrEqual(48);
    expect(eventCounts.hidden).toBeGreaterThanOrEqual(20);
    expect(eventCounts.total).toBeGreaterThanOrEqual(220);
    expect(new Set(allEvents.map((event) => event.id)).size).toBe(allEvents.length);
  });

  it("全部里程碑事件存在且结构完整", () => {
    for (const id of milestoneIds) {
      const event = allEvents.find((item) => item.id === id);
      expect(event, id).toBeTruthy();
      expect(event!.choices.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("每个事件都有 2-4 个选择且效果非空", () => {
    for (const event of allEvents) {
      expect(event.choices.length, event.id).toBeGreaterThanOrEqual(2);
      expect(event.choices.length, event.id).toBeLessThanOrEqual(4);
      for (const choice of event.choices) {
        expect(Object.keys(choice.effects).length, `${event.id}/${choice.id}`).toBeGreaterThan(0);
      }
    }
  });

  it("城市事件只在对应城市触发", () => {
    const player = initializePlayer(birthFixture); // 出生并留在台州
    for (const event of [...hangzhouEvents, ...ningboEvents, ...wenzhouEvents, ...jinhuaEvents]) {
      if (!event.condition?.locations) continue;
      const met = eventConditionMet({ ...event.condition, chance: undefined }, player);
      if (event.condition.locations.includes("taizhou")) {
        expect(met || event.condition.minAge !== undefined || event.condition.jobs !== undefined).toBeTruthy();
      } else {
        expect(met, event.id).toBe(false);
      }
    }
    // 搬到杭州后，杭州事件可以触发
    player.currentLocation = "hangzhou";
    player.age = 30;
    player.stage = "成年";
    const someHangzhou = hangzhouEvents.find((event) => event.condition?.locations?.includes("hangzhou") && !event.condition.jobs && !event.condition.requiredTags);
    expect(someHangzhou).toBeTruthy();
    expect(eventConditionMet({ ...someHangzhou!.condition, chance: undefined }, player)).toBe(true);
  });

  it("家庭产业条件限定接班类事件", () => {
    const player = initializePlayer(birthFixture); // small-factory 家庭
    player.age = 30;
    player.stage = "成年";
    const talk = commonEvents.find((event) => event.id === "zj-family-factory-talk")!;
    expect(eventConditionMet(talk.condition, player)).toBe(true);
    const noFactory = initializePlayer({ ...birthFixture, familyBackground: "teacher-medical" });
    noFactory.age = 30;
    noFactory.stage = "成年";
    expect(eventConditionMet(talk.condition, noFactory)).toBe(false);
  });

  it("年龄、职业和标签条件会阻止错误触发", () => {
    const player = initializePlayer(birthFixture);
    expect(eventConditionMet({ minAge: 20 }, player)).toBe(false);
    expect(eventConditionMet({ jobs: ["internet"] }, player)).toBe(false);
    expect(eventConditionMet({ requiredTags: ["不存在"] }, player)).toBe(false);
    expect(eventConditionMet({ locations: ["hangzhou"] }, player)).toBe(false);
    expect(eventConditionMet({ birthLocations: ["taizhou"] }, player)).toBe(true);
  });

  it("选择后推进年龄并正确限制属性上下限", () => {
    const player = initializePlayer(birthFixture);
    player.attributes.health = 98;
    player.attributes.stress = 2;
    const event: LifeEvent = {
      id: "bounds",
      category: "普通",
      title: "边界测试",
      description: "测试属性边界。",
      years: 2,
      choices: [
        { id: "choose", text: "选择", effects: { attributes: { health: 20, stress: -20 } } },
      ],
    };
    const result = applyChoice(player, event, event.choices[0]!, "test", 0);
    expect(result.player.age).toBe(8);
    expect(result.player.attributes.health).toBe(100);
    expect(result.player.attributes.stress).toBe(0);
  });

  it("教育路线与职业路线会写入对应履历", () => {
    const player = initializePlayer(birthFixture);
    const event: LifeEvent = {
      id: "route",
      category: "教育",
      title: "路线选择",
      description: "测试路线。",
      years: 3,
      choices: [
        { id: "choose", text: "读本科并进入制造业", effects: { educationRoute: "本科", jobId: "manufacturing" } },
      ],
    };
    const result = applyChoice(player, event, event.choices[0]!, "test", 0);
    expect(result.player.educationRoute).toBe("本科");
    expect(result.player.educationHistory.at(-1)?.route).toBe("本科");
    expect(result.player.currentJob).toBe("manufacturing");
    expect(result.player.careerHistory.at(-1)?.jobId).toBe("manufacturing");
  });

  it("按揭买房按城市房价系数生成房贷并打标签", () => {
    const player = initializePlayer(birthFixture);
    player.currentLocation = "hangzhou";
    const event: LifeEvent = {
      id: "buy-house",
      category: "家庭",
      title: "买房",
      description: "测试买房。",
      years: 1,
      choices: [{ id: "buy", text: "按揭", effects: { house: "按揭住房" } }],
    };
    const result = applyChoice(player, event, event.choices[0]!, "test", 0);
    expect(result.player.assets.mortgage).toBeGreaterThan(1500000); // 杭州房价系数 2.6
    expect(result.player.tags).toContain("杭州买房");
    expect(result.player.tags).toContain("有房一族");
  });

  it("存款不足以支付选择成本时，差额会计入其他负债", () => {
    const player = initializePlayer(birthFixture);
    player.assets.savings = 5_000;
    player.age = 30;
    const event: LifeEvent = {
      id: "insufficient-cash",
      category: "普通",
      title: "大额支出",
      description: "测试现金不足。",
      years: 1,
      choices: [{ id: "pay", text: "支付", effects: { savings: -20_000 } }],
    };
    const result = applyChoice(player, event, event.choices[0]!, "test", 0);
    expect(result.player.assets.savings).toBe(0);
    expect(result.player.assets.otherDebt).toBeGreaterThanOrEqual(15_000);
  });

  it("结局和成就所需标签都有事件来源", () => {
    const producibleTags = new Set(
      allEvents.flatMap((event) => event.choices.flatMap((choice) => choice.effects.addTags ?? [])),
    );
    // 出生背景与迁移系统也能提供标签
    producibleTags.add("家有厂房");
    producibleTags.add("浙江走遍");
    const requiredTags = [...achievements, ...endings].flatMap(
      (item) => item.condition.requiredTags ?? [],
    );
    for (const tag of requiredTags) expect(producibleTags.has(tag), tag).toBe(true);
  });

  it("隐藏事件标记 rare 且归属隐藏类别", () => {
    for (const event of hiddenEvents) {
      expect(event.category, event.id).toBe("隐藏");
      expect(event.rare, event.id).toBe(true);
    }
  });

  it("事件标题在各城市包内不重复", () => {
    for (const pack of [commonEvents, hangzhouEvents, ningboEvents, wenzhouEvents, jinhuaEvents, taizhouEvents, otherCityEvents, hiddenEvents]) {
      const titles = pack.map((event) => event.title);
      expect(new Set(titles).size).toBe(titles.length);
    }
  });
});
