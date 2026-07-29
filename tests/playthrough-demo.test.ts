import { describe, expect, it } from "vitest";
import { cityNameOf } from "@/data/regions/zhejiang/cities";
import { randomBirthProfile } from "@/game/birth";
import { useGameStore } from "@/store/game-store";
import { familyBackgroundMap } from "@/data/regions/zhejiang/birth-profiles";

/**
 * 开发验收用：本地完整玩通 3 局，打印每局摘要。
 * 每局使用不同选择策略，覆盖不同出生城市。
 */
describe("本地玩通三局（验收）", () => {
  const runs = [
    { seed: "demo-life-1", pick: (turn: number, total: number) => turn % total },
    { seed: "demo-life-2", pick: (_turn: number, total: number) => total - 1 },
    { seed: "demo-life-3", pick: (turn: number, total: number) => (turn * 2 + 1) % total },
  ];

  for (const [index, run] of runs.entries()) {
    it(`第 ${index + 1} 局（${run.seed}）可以完整走完并生成结局报告`, () => {
      const birth = randomBirthProfile(run.seed, 1998);
      useGameStore.getState().startGame(birth, run.seed);
      let turn = 0;
      while (useGameStore.getState().status === "playing" && turn < 150) {
        const event = useGameStore.getState().currentEvent!;
        const choice = event.choices[run.pick(turn, event.choices.length)]!;
        useGameStore.getState().choose(choice.id);
        turn += 1;
      }
      const state = useGameStore.getState();
      const player = state.player!;
      const route = [
        cityNameOf(player.homeLocation),
        ...player.migrationHistory.map((record) => cityNameOf(record.to)),
      ].join(" → ");
      // eslint-disable-next-line no-console
      console.log(
        [
          `\n===== 第 ${index + 1} 局 =====`,
          `人物：${player.birth.name}，${player.birth.birthYear} 年生于${cityNameOf(player.homeLocation)}（${familyBackgroundMap[player.birth.familyBackground].name}）`,
          `路线：${route}`,
          `教育：${player.educationRoute} ｜ 最终职业：${player.currentJob} ｜ 住房：${player.assets.house}`,
          `存款：${player.assets.savings} ｜ 负债：${player.assets.mortgage + player.assets.otherDebt}`,
          `选择 ${state.timeline.length} 次 ｜ 迁移 ${player.migrationHistory.length} 次 ｜ 成就 ${state.unlockedAchievementIds.length} 个`,
          `结局：${state.endingResult?.ending.name}（${state.endingResult?.ending.rarity}）`,
          `关键词：${state.endingResult?.keywords.join("、")}`,
        ].join("\n"),
      );
      expect(state.status).toBe("ended");
      expect(state.endingResult?.ending.name).toBeTruthy();
      expect(state.timeline.length).toBeGreaterThan(15);
    });
  }
});
