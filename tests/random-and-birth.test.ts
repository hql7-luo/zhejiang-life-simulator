import { describe, expect, it } from "vitest";
import { familyBackgroundMap } from "@/data/regions/zhejiang/birth-profiles";
import { zhejiangCityIds } from "@/data/regions/zhejiang/cities";
import { pickBirthCity, randomBirthProfile } from "@/game/birth";
import { initializePlayer } from "@/game/initialize";
import { seededRandom } from "@/game/random";
import { birthFixture } from "@/tests/fixtures";

describe("出生与随机系统", () => {
  it("固定 seed 生成完全一致的随机序列", () => {
    const first = Array.from({ length: 8 }, (_, index) => seededRandom("same-life", index));
    const second = Array.from({ length: 8 }, (_, index) => seededRandom("same-life", index));
    expect(first).toEqual(second);
  });

  it("固定 seed 生成一致的出生档案", () => {
    expect(randomBirthProfile("daily-2026-07-28")).toEqual(
      randomBirthProfile("daily-2026-07-28"),
    );
  });

  it("出生城市始终是浙江十一市之一", () => {
    for (let index = 0; index < 60; index += 1) {
      const profile = randomBirthProfile(`city-check-${index}`);
      expect(zhejiangCityIds).toContain(profile.city);
      expect(familyBackgroundMap[profile.familyBackground]).toBeTruthy();
    }
  });

  it("城市出生概率加权分布：杭州最高频，舟山最低频，十一市均可出生", () => {
    const counts = new Map<string, number>();
    const samples = 400;
    for (let index = 0; index < samples; index += 1) {
      const city = pickBirthCity(`distribution-${index}`);
      counts.set(city, (counts.get(city) ?? 0) + 1);
    }
    for (const id of zhejiangCityIds) {
      expect(counts.get(id) ?? 0, `${id} 应该可以被抽中`).toBeGreaterThan(0);
    }
    expect(counts.get("hangzhou")).toBeGreaterThan(counts.get("zhoushan")!);
    expect(counts.get("hangzhou")).toBeGreaterThan(counts.get("lishui")!);
  });

  it("城市挑战模式固定在指定城市出生", () => {
    for (const id of zhejiangCityIds) {
      expect(randomBirthProfile(`fixed-${id}`, 1998, id).city).toBe(id);
    }
  });

  it("按家庭背景初始化出生属性与产业标签，全部在 0 到 100", () => {
    const player = initializePlayer(birthFixture);
    expect(Object.values(player.attributes).every((value) => value >= 0 && value <= 100)).toBe(true);
    expect(player.relationships).toHaveLength(2);
    expect(player.homeLocation).toBe("taizhou");
    expect(player.currentLocation).toBe("taizhou");
    expect(player.tags).toContain("家有厂房");
    expect(player.attributes.familyIndustry).toBeGreaterThan(20);
  });

  it("不同家庭背景带来不同的初始资源", () => {
    const rich = initializePlayer({ ...birthFixture, familyBackground: "rich-owner", familyWealth: "富裕" });
    const poor = initializePlayer({ ...birthFixture, familyBackground: "hardship", familyWealth: "困难" });
    expect(rich.assets.savings).toBeGreaterThan(poor.assets.savings);
    expect(rich.attributes.familyIndustry).toBeGreaterThan(poor.attributes.familyIndustry);
  });
});
