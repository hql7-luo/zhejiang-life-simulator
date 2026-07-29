import { beforeEach, describe, expect, it } from "vitest";
import { useGameStore } from "@/store/game-store";
import { birthFixture } from "@/tests/fixtures";
import { safeRead, safeWrite } from "@/utils/storage";

describe("本地存档与重新开始", () => {
  beforeEach(() => {
    useGameStore.setState({
      status: "home",
      player: null,
      currentEvent: null,
      timeline: [],
      seed: "",
      randomCursor: 0,
      endingResult: null,
    });
  });

  it("localStorage 能安全写入、读取并在损坏时回退", () => {
    expect(safeWrite("test", { value: 42 })).toBe(true);
    expect(safeRead("test", { value: 0 })).toEqual({ value: 42 });
    window.localStorage.setItem("broken", "{not-json");
    expect(safeRead("broken", { ok: false })).toEqual({ ok: false });
  });

  it("同种子重玩恢复相同出生状态和首个事件", () => {
    useGameStore.getState().startGame(birthFixture, "replay-seed");
    const firstEventId = useGameStore.getState().currentEvent?.id;
    const firstChoice = useGameStore.getState().currentEvent?.choices[0]?.id;
    expect(firstChoice).toBeTruthy();
    useGameStore.getState().choose(firstChoice!);
    expect(useGameStore.getState().player?.age).toBeGreaterThan(6);
    useGameStore.getState().replaySameSeed();
    expect(useGameStore.getState().player?.age).toBe(6);
    expect(useGameStore.getState().currentEvent?.id).toBe(firstEventId);
  });

  it("开始全新人生会清除当前一局但保留解锁图鉴", () => {
    useGameStore.getState().startGame(birthFixture, "new-life");
    useGameStore.setState({ unlockedAchievementIds: ["takeover"] });
    useGameStore.getState().newLife();
    const state = useGameStore.getState();
    expect(state.status).toBe("setup");
    expect(state.player).toBeNull();
    expect(state.unlockedAchievementIds).toContain("takeover");
  });

  it("一局游戏可以从童年连续推进到完整结局", () => {
    useGameStore.getState().startGame(birthFixture, "complete-life");
    for (let turn = 0; turn < 80 && useGameStore.getState().status === "playing"; turn += 1) {
      const choiceId = useGameStore.getState().currentEvent?.choices[0]?.id;
      expect(choiceId).toBeTruthy();
      useGameStore.getState().choose(choiceId!);
    }
    const state = useGameStore.getState();
    expect(state.status).toBe("ended");
    expect(state.player?.age).toBeGreaterThanOrEqual(80);
    expect(state.timeline.length).toBeGreaterThan(20);
    expect(state.endingResult?.ending.name).toBeTruthy();
  });

  it("三种不同选择策略与三个城市出生都能玩通整局", () => {
    const strategies = [0, -1, 1];
    const cities = ["hangzhou", "wenzhou", "lishui"] as const;
    const results = strategies.map((offset, index) => {
      useGameStore.getState().startGame(
        { ...birthFixture, city: cities[index]! },
        `playthrough-${index}`,
      );
      for (let turn = 0; turn < 120 && useGameStore.getState().status === "playing"; turn += 1) {
        const event = useGameStore.getState().currentEvent;
        const choice = event?.choices.at(offset) ?? event?.choices[0];
        useGameStore.getState().choose(choice!.id);
      }
      const state = useGameStore.getState();
      expect(state.status).toBe("ended");
      return state.endingResult!.ending.id;
    });
    expect(new Set(results).size).toBeGreaterThanOrEqual(1);
  });
});
