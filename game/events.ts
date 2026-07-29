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

export type EventOccurrences = Record<string, { count: number; lastAge: number }>;

/**
 * 事件是否可再次被选：
 * - 未见过的事件永远可以
 * - 一次性人生节点（未标记 repeatable）见过即不可再选
 * - 可重复事件需满足冷却年数与一生次数上限
 */
function eventAvailable(
  event: LifeEvent,
  player: Player,
  recentEventIds: string[],
  eventOccurrences: EventOccurrences,
): boolean {
  if (recentEventIds.includes(event.id)) return false;
  const seen = player.tags.includes(`seen:${event.id}`);
  if (!seen) return true;
  if (!event.repeatable) return false;
  const occurrence = eventOccurrences[event.id];
  if (!occurrence) return true;
  const cooldown = event.cooldownYears ?? 6;
  const maxOccurrences = event.maxOccurrences ?? 3;
  return occurrence.count < maxOccurrences && player.age - occurrence.lastAge >= cooldown;
}

export function selectNextEvent(
  player: Player,
  seed: string,
  cursor: number,
  recentEventIds: string[] = [],
  eventOccurrences: EventOccurrences = {},
): { event: LifeEvent; cursor: number } {
  const unseenMilestone = milestones
    .map((id) => allEvents.find((event) => event.id === id))
    .find(
      (event) =>
        event &&
        eventAvailable(event, player, recentEventIds, eventOccurrences) &&
        eventConditionMet(event.condition, player, `${seed}:${event.id}`, cursor),
    );
  if (unseenMilestone) return { event: unseenMilestone, cursor: cursor + 1 };

  const eligible = allEvents.filter(
    (event) =>
      eventAvailable(event, player, recentEventIds, eventOccurrences) &&
      (!event.stage || event.stage === player.stage) &&
      eventConditionMet(event.condition, player, `${seed}:${event.id}`, cursor),
  );
  const fallback = allEvents.filter(
    (event) =>
      event.category === "普通" &&
      eventAvailable(event, player, recentEventIds, eventOccurrences) &&
      eventConditionMet(event.condition, player, `${seed}:${event.id}`, cursor),
  );
  // 本地事件加权（×3）：让所在城市真正塑造人生走向，而不是被通用池稀释
  const weighted = (events: LifeEvent[]): LifeEvent[] => {
    const pool: LifeEvent[] = [];
    for (const event of events) {
      pool.push(event);
      if (event.condition?.locations?.includes(player.currentLocation)) {
        pool.push(event, event);
      }
    }
    return pool;
  };
  const pool = eligible.length > 0 ? weighted(eligible) : weighted(fallback);
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
