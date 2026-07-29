"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { calculateUnlockedAchievements } from "@/game/achievements";
import { applyChoice } from "@/game/effects";
import { calculateEnding } from "@/game/endings";
import { selectNextEvent } from "@/game/events";
import { initializePlayer } from "@/game/initialize";
import { createSeed } from "@/game/random";
import { GAME_STORAGE_KEY } from "@/utils/storage";
import type { BirthProfile, GameState } from "@/types";

interface GameActions {
  openSetup: () => void;
  goHome: () => void;
  resumeGame: () => void;
  startGame: (birth: BirthProfile, seed?: string, isDaily?: boolean) => void;
  choose: (choiceId: string) => void;
  replaySameSeed: () => void;
  newLife: () => void;
  clearProgress: () => void;
}

export type GameStore = GameState & GameActions;

const initialState: GameState = {
  version: 2,
  status: "home",
  seed: "",
  randomCursor: 0,
  player: null,
  currentEvent: null,
  timeline: [],
  recentEventIds: [],
  eventOccurrences: {},
  unlockedEventIds: [],
  unlockedEndingIds: [],
  unlockedAchievementIds: [],
  unlockedJobIds: [],
  endingResult: null,
  stats: {
    jobsHeld: 0,
    jobChanges: 0,
    relationships: 0,
    importantChoices: 0,
    turningPoints: 0,
  },
  isDaily: false,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      openSetup: () => set({ status: "setup" }),
      goHome: () => set({ status: "home" }),
      resumeGame: () =>
        set((state) => ({
          status: state.endingResult
            ? "ended"
            : state.player && state.currentEvent
              ? "playing"
              : "home",
        })),
      startGame: (birth, suppliedSeed, isDaily = false) => {
        const seed = suppliedSeed ?? createSeed();
        const player = initializePlayer(birth);
        const selected = selectNextEvent(player, seed, 0, []);
        set((state) => ({
          ...initialState,
          status: "playing",
          seed,
          randomCursor: selected.cursor,
          player,
          currentEvent: selected.event,
          isDaily,
          unlockedEventIds: state.unlockedEventIds,
          unlockedEndingIds: state.unlockedEndingIds,
          unlockedAchievementIds: state.unlockedAchievementIds,
          unlockedJobIds: state.unlockedJobIds,
        }));
      },
      choose: (choiceId) => {
        const state = get();
        if (!state.player || !state.currentEvent || state.status !== "playing")
          return;
        const choice = state.currentEvent.choices.find(
          (item) => item.id === choiceId,
        );
        if (!choice) return;
        const previousJob = state.player.currentJob;
        const result = applyChoice(
          state.player,
          state.currentEvent,
          choice,
          state.seed,
          state.randomCursor,
        );
        result.player.tags = [
          ...new Set([...result.player.tags, `seen:${state.currentEvent.id}`]),
        ];
        const timeline = [...state.timeline, result.timeline];
        const achievements = calculateUnlockedAchievements(result.player);
        const unlockedAchievementIds = [
          ...new Set([...state.unlockedAchievementIds, ...achievements]),
        ];
        const unlockedEventIds = [
          ...new Set([...state.unlockedEventIds, state.currentEvent.id]),
        ];
        const unlockedJobIds =
          result.player.currentJob === "student" ||
          result.player.currentJob === "unemployed"
            ? state.unlockedJobIds
            : [...new Set([...state.unlockedJobIds, result.player.currentJob])];
        const recentEventIds = [
          ...state.recentEventIds,
          state.currentEvent.id,
        ].slice(-6);
        const previousOccurrence = state.eventOccurrences[state.currentEvent.id];
        const eventOccurrences = {
          ...state.eventOccurrences,
          [state.currentEvent.id]: {
            count: (previousOccurrence?.count ?? 0) + 1,
            lastAge: state.player.age,
          },
        };
        const stats = {
          jobsHeld: result.player.careerHistory.length,
          jobChanges:
            state.stats.jobChanges +
            (previousJob !== result.player.currentJob &&
            previousJob !== "student"
              ? 1
              : 0),
          relationships: result.player.relationships.length,
          importantChoices: timeline.length,
          turningPoints:
            state.stats.turningPoints +
            (result.timeline.changes.length >= 3 ? 1 : 0),
        };
        if (result.player.age >= 80 || result.player.attributes.health <= 0) {
          const endingResult = calculateEnding(result.player, timeline);
          set({
            player: result.player,
            timeline,
            currentEvent: null,
            status: "ended",
            endingResult,
            unlockedEventIds,
            unlockedAchievementIds,
            unlockedJobIds,
            unlockedEndingIds: [
              ...new Set([...state.unlockedEndingIds, endingResult.ending.id]),
            ],
            recentEventIds,
            eventOccurrences,
            stats,
          });
          return;
        }
        const selected = selectNextEvent(
          result.player,
          state.seed,
          state.randomCursor + 1,
          recentEventIds,
          eventOccurrences,
        );
        set({
          player: result.player,
          timeline,
          currentEvent: selected.event,
          randomCursor: selected.cursor,
          recentEventIds,
          eventOccurrences,
          unlockedEventIds,
          unlockedAchievementIds,
          unlockedJobIds,
          stats,
        });
      },
      replaySameSeed: () => {
        const state = get();
        if (state.player)
          get().startGame(state.player.birth, state.seed, state.isDaily);
      },
      newLife: () =>
        set({
          status: "setup",
          player: null,
          currentEvent: null,
          timeline: [],
          endingResult: null,
        }),
      clearProgress: () => set({ ...initialState }),
    }),
    {
      name: GAME_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 2,
    },
  ),
);
