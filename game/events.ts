import { allEvents } from "@/data/regions/zhejiang/events";
import { eventConditionMet } from "@/game/conditions";
import { seededRandom } from "@/game/random";
import type { LifeEvent, Player } from "@/types";

const milestones = [
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

export function selectNextEvent(
  player: Player,
  seed: string,
  cursor: number,
  recentEventIds: string[] = [],
): { event: LifeEvent; cursor: number } {
  const unseenMilestone = milestones
    .map((id) => allEvents.find((event) => event.id === id))
    .find(
      (event) =>
        event &&
        !recentEventIds.includes(event.id) &&
        !player.tags.includes(`seen:${event.id}`) &&
        eventConditionMet(event.condition, player, `${seed}:${event.id}`, cursor),
    );
  if (unseenMilestone) return { event: unseenMilestone, cursor: cursor + 1 };

  const eligible = allEvents.filter(
    (event) =>
      !recentEventIds.includes(event.id) &&
      !player.tags.includes(`seen:${event.id}`) &&
      (!event.stage || event.stage === player.stage) &&
      eventConditionMet(event.condition, player, `${seed}:${event.id}`, cursor),
  );
  const fallback = allEvents.filter(
    (event) =>
      event.category === "普通" &&
      !recentEventIds.includes(event.id) &&
      eventConditionMet(event.condition, player, `${seed}:${event.id}`, cursor),
  );
  const pool = eligible.length > 0 ? eligible : fallback;
  if (pool.length === 0) return { event: regularFallback(player), cursor: cursor + 1 };
  const index = Math.floor(seededRandom(`${seed}:event`, cursor) * pool.length);
  return { event: pool[index]!, cursor: cursor + 1 };
}

function regularFallback(player: Player): LifeEvent {
  return {
    id: `fallback-${player.age}`,
    category: "普通",
    title: "寻常的一年",
    description: "没有惊天动地的大事。你仍然需要决定，把有限的时间留给什么。",
    years: player.age > 65 ? 3 : 2,
    choices: [
      { id: "people", text: "多陪伴重要的人", effects: { attributes: { family: 5, happiness: 4, stress: -2 } } },
      { id: "self", text: "学习一件一直想学的事", effects: { attributes: { intelligence: 4, happiness: 3, stress: -1 } } },
    ],
  };
}
