import { describe, expect, it } from "vitest";
import { applyChoice } from "@/game/effects";
import { initializePlayer } from "@/game/initialize";
import {
  livedLocations,
  migrationCount,
  returnHomeCount,
  yearsAwayFromHome,
  yearsInLocation,
} from "@/game/migration";
import { birthFixture } from "@/tests/fixtures";
import type { LifeEvent } from "@/types";

function moveEvent(to: string, years = 2): LifeEvent {
  return {
    id: `move-${to}`,
    category: "地区",
    title: `前往${to}`,
    description: "测试迁移。",
    years,
    choices: [
      {
        id: "go",
        text: "出发",
        effects: { moveTo: to as never, moveReason: "测试迁移" },
      },
    ],
  };
}

describe("城市迁移系统", () => {
  it("迁移会写入记录并更新当前城市", () => {
    const player = initializePlayer(birthFixture);
    player.age = 22;
    const result = applyChoice(player, moveEvent("hangzhou"), moveEvent("hangzhou").choices[0]!, "test", 0);
    expect(result.player.currentLocation).toBe("hangzhou");
    expect(result.player.migrationHistory).toHaveLength(1);
    expect(result.player.migrationHistory[0]).toMatchObject({ from: "taizhou", to: "hangzhou" });
    expect(result.player.tags).toContain("杭漂");
    expect(migrationCount(result.player)).toBe(1);
  });

  it("累计居住年数按迁移分段计算", () => {
    let player = initializePlayer(birthFixture);
    player.age = 18;
    player.currentYear = 2016;
    player = applyChoice(player, moveEvent("hangzhou", 4), moveEvent("hangzhou", 4).choices[0]!, "t", 0).player;
    player = applyChoice(player, moveEvent("shanghai", 3), moveEvent("shanghai", 3).choices[0]!, "t", 1).player;
    expect(player.age).toBe(25);
    expect(yearsInLocation(player, "taizhou")).toBe(12); // 6-18 岁
    expect(yearsInLocation(player, "hangzhou")).toBe(4);
    expect(yearsInLocation(player, "shanghai")).toBe(3);
    expect(yearsAwayFromHome(player)).toBe(7);
    expect(livedLocations(player).sort()).toEqual(["hangzhou", "shanghai", "taizhou"]);
  });

  it("回到出生城市计入回乡次数并施加正向调整", () => {
    let player = initializePlayer(birthFixture);
    player.age = 22;
    player = applyChoice(player, moveEvent("hangzhou"), moveEvent("hangzhou").choices[0]!, "t", 0).player;
    const familyBefore = player.attributes.family;
    const homeEvent: LifeEvent = {
      id: "go-home",
      category: "地区",
      title: "回家",
      description: "测试回乡。",
      years: 1,
      choices: [{ id: "home", text: "回家", effects: { moveHome: true, moveReason: "回乡发展" } }],
    };
    player = applyChoice(player, homeEvent, homeEvent.choices[0]!, "t", 1).player;
    expect(player.currentLocation).toBe("taizhou");
    expect(returnHomeCount(player)).toBe(1);
    expect(player.tags).toContain("回乡发展");
    expect(player.attributes.family).toBeGreaterThanOrEqual(familyBefore);
  });

  it("出省会打上对应标签并提高城市适应", () => {
    let player = initializePlayer(birthFixture);
    player.age = 24;
    const adaptBefore = player.attributes.cityAdapt;
    player = applyChoice(player, moveEvent("shenzhen"), moveEvent("shenzhen").choices[0]!, "t", 0).player;
    expect(player.tags).toContain("深漂");
    expect(player.attributes.cityAdapt).toBeGreaterThan(adaptBefore);
  });

  it("省内六市居住过会解锁浙江走遍标签", () => {
    let player = initializePlayer(birthFixture);
    player.age = 30;
    const path = ["hangzhou", "ningbo", "wenzhou", "jinhua", "lishui"];
    path.forEach((city, index) => {
      const event = moveEvent(city, 1);
      player = applyChoice(player, event, event.choices[0]!, "t", index).player;
    });
    expect(player.tags).toContain("浙江走遍");
  });
});
