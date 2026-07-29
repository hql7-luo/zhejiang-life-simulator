import { familyBackgroundMap, familyBackgrounds } from "@/data/regions/zhejiang/birth-profiles";
import { zhejiangCityIds } from "@/data/regions/zhejiang/cities";
import { pickSeeded, seededRandom } from "@/game/random";
import type { BirthProfile, FamilyBackground, ZhejiangCityId } from "@/types";

const givenNames = ["知夏", "予安", "清禾", "景川", "以宁", "云舟", "嘉言", "小满", "星遥", "明澈", "望舒", "既白"];
const surnames = ["陈", "王", "李", "张", "林", "黄", "周", "吴", "徐", "郑", "沈", "叶"];

/** 出生城市权重：大致参照各市常住人口量级 */
const cityWeights: Record<ZhejiangCityId, number> = {
  hangzhou: 19,
  ningbo: 14,
  wenzhou: 14,
  taizhou: 10,
  jinhua: 11,
  shaoxing: 8,
  jiaxing: 8,
  huzhou: 5,
  quzhou: 4,
  lishui: 4,
  zhoushan: 3,
};

export function pickBirthCity(seed: string, cursor = 20): ZhejiangCityId {
  const total = zhejiangCityIds.reduce((sum, id) => sum + cityWeights[id], 0);
  let roll = seededRandom(seed, cursor) * total;
  for (const id of zhejiangCityIds) {
    roll -= cityWeights[id];
    if (roll <= 0) return id;
  }
  return "hangzhou";
}

function pickFamilyBackground(seed: string, city: ZhejiangCityId): FamilyBackground {
  const weights = familyBackgrounds.map((background) => {
    const boost = background.cityBoost?.[city] ?? 1;
    return background.weight * boost;
  });
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let roll = seededRandom(seed, 21) * total;
  for (let index = 0; index < familyBackgrounds.length; index += 1) {
    roll -= weights[index]!;
    if (roll <= 0) return familyBackgrounds[index]!;
  }
  return familyBackgroundMap["dual-worker"];
}

export function randomBirthProfile(
  seed: string,
  birthYear = 1998,
  fixedCity?: ZhejiangCityId,
): BirthProfile {
  const city = fixedCity ?? pickBirthCity(seed);
  const background = pickFamilyBackground(seed, city);
  return {
    name: `${pickSeeded(surnames, seed, 0)}${pickSeeded(givenNames, seed, 1)}`,
    gender: pickSeeded(["女", "男", "非二元"] as const, seed, 2),
    birthYear,
    city,
    familyBackground: background.id,
    hukou: background.hukou,
    familyWealth: pickSeeded(background.wealthPool, seed, 6),
    fatherJob: pickSeeded(background.fatherJobs, seed, 7),
    motherJob: pickSeeded(background.motherJobs, seed, 8),
    familyClimate: pickSeeded(["亲密", "平常", "平常", "紧张"] as const, seed, 9),
    talent: pickSeeded(["好奇心", "运动感", "表达力", "动手能力", "耐心"] as const, seed, 10),
    personality: pickSeeded(["谨慎", "外向", "坚韧", "随和", "独立"] as const, seed, 11),
  };
}
