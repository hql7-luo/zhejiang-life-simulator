import { cities } from "@/data/regions/zhejiang/cities";
import { clamp } from "@/utils/format";
import type { LocationId, Player } from "@/types";

/** 居住过的所有城市（含出生城市与当前城市） */
export function livedLocations(player: Player): LocationId[] {
  const set = new Set<LocationId>([player.homeLocation, player.currentLocation]);
  for (const record of player.migrationHistory) {
    set.add(record.from);
    set.add(record.to);
  }
  return [...set];
}

export function migrationCount(player: Player): number {
  return player.migrationHistory.length;
}

/** 回到出生城市的次数 */
export function returnHomeCount(player: Player): number {
  return player.migrationHistory.filter(
    (record) => record.to === player.homeLocation && record.from !== player.homeLocation,
  ).length;
}

/** 在外（非出生城市）累计居住年数 */
export function yearsAwayFromHome(player: Player): number {
  return Math.max(0, player.age - 6 - yearsInLocation(player, player.homeLocation));
}

/** 在某城市累计居住年数（按迁移记录分段估算） */
export function yearsInLocation(player: Player, location: LocationId): number {
  let years = 0;
  let segmentStart = 6; // 游戏从 6 岁开始
  let current: LocationId = player.homeLocation;
  for (const record of player.migrationHistory) {
    if (current === location) years += Math.max(0, record.age - segmentStart);
    segmentStart = record.age;
    current = record.to;
  }
  if (current === location) years += Math.max(0, player.age - segmentStart);
  return years;
}

/** 记录一次迁移，并施加迁移带来的属性变化。atAge/atYear 为做出选择时的年龄与年份。 */
export function recordMigration(
  player: Player,
  to: LocationId,
  reason: string,
  atAge?: number,
  atYear?: number,
): void {
  const from = player.currentLocation;
  if (from === to) return;
  player.migrationHistory.push({
    age: atAge ?? player.age,
    year: atYear ?? player.currentYear,
    from,
    to,
    reason,
  });
  player.currentLocation = to;

  const tags = new Set(player.tags);
  tags.add(`lived:${to}`);
  const target = cities[to];
  const returningHome = to === player.homeLocation && from !== player.homeLocation;

  if (returningHome) {
    player.attributes.family = clamp(player.attributes.family + 5);
    player.attributes.happiness = clamp(player.attributes.happiness + 3);
    player.attributes.stress = clamp(player.attributes.stress - 3);
    player.attributes.localNetwork = clamp(player.attributes.localNetwork + 6);
    tags.add("回乡发展");
  } else if (!target.inZhejiang) {
    // 出省：更高的适应成本与机会
    player.attributes.stress = clamp(player.attributes.stress + 4);
    player.attributes.network = clamp(player.attributes.network - 4);
    player.attributes.cityAdapt = clamp(player.attributes.cityAdapt + 5);
    if (to === "shanghai") tags.add("沪漂");
    if (to === "shenzhen") tags.add("深漂");
    if (to === "overseas") tags.add("海外");
  } else {
    // 省内流动
    player.attributes.stress = clamp(player.attributes.stress + 2);
    player.attributes.cityAdapt = clamp(player.attributes.cityAdapt + 3);
    if (to === "hangzhou") tags.add("杭漂");
  }

  if (player.migrationHistory.length >= 3) tags.add("多次迁移");
  const zhejiangLived = livedLocations(player).filter((id) => cities[id].inZhejiang).length;
  if (zhejiangLived >= 6) tags.add("浙江走遍");
  player.tags = [...tags];
}
