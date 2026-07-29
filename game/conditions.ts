import { familyBackgroundMap } from "@/data/regions/zhejiang/birth-profiles";
import { livedLocations, migrationCount, yearsInLocation } from "@/game/migration";
import { seededRandom } from "@/game/random";
import type { AchievementCondition, Player, RegionalEventCondition } from "@/types";

function attributesMeet(
  values: Player["attributes"],
  minimum?: Partial<Player["attributes"]>,
  maximum?: Partial<Player["attributes"]>,
): boolean {
  if (
    minimum &&
    Object.entries(minimum).some(
      ([key, value]) => values[key as keyof typeof values] < (value ?? 0),
    )
  )
    return false;
  if (
    maximum &&
    Object.entries(maximum).some(
      ([key, value]) => values[key as keyof typeof values] > (value ?? 100),
    )
  )
    return false;
  return true;
}

export function eventConditionMet(
  condition: RegionalEventCondition | undefined,
  player: Player,
  seed = "condition",
  cursor = 0,
): boolean {
  if (!condition) return true;
  if (condition.minAge !== undefined && player.age < condition.minAge)
    return false;
  if (condition.maxAge !== undefined && player.age > condition.maxAge)
    return false;
  if (condition.stage && condition.stage !== player.stage) return false;
  if (
    !attributesMeet(
      player.attributes,
      condition.minAttributes,
      condition.maxAttributes,
    )
  )
    return false;
  if (
    condition.education &&
    !condition.education.includes(player.educationRoute)
  )
    return false;
  if (condition.jobs && !condition.jobs.includes(player.currentJob))
    return false;
  if (condition.marriage && !condition.marriage.includes(player.marriage))
    return false;
  if (condition.requiredTags?.some((tag) => !player.tags.includes(tag)))
    return false;
  if (condition.excludedTags?.some((tag) => player.tags.includes(tag)))
    return false;
  // —— 地域条件 ——
  if (condition.locations && !condition.locations.includes(player.currentLocation))
    return false;
  if (condition.birthLocations && !condition.birthLocations.includes(player.homeLocation))
    return false;
  if (condition.livedLocations) {
    const lived = livedLocations(player);
    if (condition.livedLocations.some((location) => !lived.includes(location)))
      return false;
  }
  if (
    condition.familyBackgrounds &&
    !condition.familyBackgrounds.includes(player.birth.familyBackground)
  )
    return false;
  if (condition.industries) {
    const industry = familyBackgroundMap[player.birth.familyBackground].industry;
    if (!industry || !condition.industries.includes(industry)) return false;
  }
  if (
    condition.minMigrations !== undefined &&
    migrationCount(player) < condition.minMigrations
  )
    return false;
  if (
    condition.chance !== undefined &&
    seededRandom(`${seed}:${condition.chance}`, cursor) > condition.chance
  )
    return false;
  return true;
}

export function achievementConditionMet(
  condition: AchievementCondition,
  player: Player,
): boolean {
  if (condition.minAge !== undefined && player.age < condition.minAge)
    return false;
  if (
    condition.minSavings !== undefined &&
    player.assets.savings < condition.minSavings
  )
    return false;
  if (
    condition.maxSavings !== undefined &&
    player.assets.savings > condition.maxSavings
  )
    return false;
  if (
    condition.minDebt !== undefined &&
    player.assets.otherDebt + player.assets.mortgage < condition.minDebt
  )
    return false;
  if (!attributesMeet(player.attributes, condition.minAttributes, condition.maxAttributes)) return false;
  if (
    condition.education &&
    !condition.education.includes(player.educationRoute)
  )
    return false;
  if (
    condition.jobs &&
    !condition.jobs.includes(player.currentJob) &&
    !player.careerHistory.some((record) =>
      condition.jobs?.includes(record.jobId),
    )
  ) {
    return false;
  }
  if (condition.marriage && !condition.marriage.includes(player.marriage))
    return false;
  if (condition.house && !condition.house.includes(player.assets.house))
    return false;
  if (condition.requiredTags?.some((tag) => !player.tags.includes(tag)))
    return false;
  if (
    condition.minCareerCount !== undefined &&
    player.careerHistory.length < condition.minCareerCount
  )
    return false;
  if (condition.locations && !condition.locations.includes(player.currentLocation))
    return false;
  if (condition.minYearsInLocation) {
    const { location, years } = condition.minYearsInLocation;
    if (yearsInLocation(player, location) < years) return false;
  }
  if (
    condition.minLivedLocations !== undefined &&
    livedLocations(player).length < condition.minLivedLocations
  )
    return false;
  if (
    condition.minMigrations !== undefined &&
    migrationCount(player) < condition.minMigrations
  )
    return false;
  return true;
}
