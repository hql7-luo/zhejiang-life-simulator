import { familyBackgroundMap } from "@/data/regions/zhejiang/birth-profiles";
import { cityNameOf } from "@/data/regions/zhejiang/cities";
import { getLifeStage } from "@/game/stage";
import { clamp } from "@/utils/format";
import type { BirthProfile, Player, PlayerAttributes } from "@/types";

const wealthBoost = {
  困难: { money: -8, education: -3 },
  普通: { money: 0, education: 0 },
  小康: { money: 6, education: 4 },
  富裕: { money: 12, education: 7 },
};

const climateBoost = {
  亲密: { family: 14, happiness: 7 },
  平常: { family: 3, happiness: 1 },
  紧张: { family: -10, happiness: -5 },
};

const talentBoost: Record<BirthProfile["talent"], Partial<PlayerAttributes>> = {
  好奇心: { intelligence: 9 },
  运动感: { health: 9 },
  表达力: { emotional: 8, network: 3 },
  动手能力: { intelligence: 5, career: 4, skill: 6 },
  耐心: { stress: -6, education: 5 },
};

export function initializePlayer(birth: BirthProfile): Player {
  const background = familyBackgroundMap[birth.familyBackground];
  const wealth = wealthBoost[birth.familyWealth];
  const climate = climateBoost[birth.familyClimate];
  const base: PlayerAttributes = {
    health: 68,
    intelligence: 50,
    emotional: 50,
    happiness: 62,
    money: 45,
    family: 55,
    network: 35,
    education: 0,
    career: 0,
    stress: 15,
    // 隐藏属性基础值
    familyIndustry: 0,
    localNetwork: 8,
    skill: 0,
    cityAdapt: 12,
    entrepreneurship: 0,
    familyDuty: 12,
    riskTolerance: 14,
  };
  const attributes = { ...base };
  const modifiers: Partial<PlayerAttributes>[] = [
    wealth,
    climate,
    talentBoost[birth.talent],
    background.attributes,
  ];
  for (const modifier of modifiers) {
    for (const [key, value] of Object.entries(modifier)) {
      const attribute = key as keyof PlayerAttributes;
      attributes[attribute] = clamp(attributes[attribute] + (value ?? 0));
    }
  }

  return {
    birth,
    age: 6,
    currentYear: birth.birthYear + 6,
    stage: getLifeStage(6),
    currentJob: "student",
    homeLocation: birth.city,
    currentLocation: birth.city,
    migrationHistory: [],
    marriage: "单身",
    children: 0,
    attributes,
    educationRoute: "义务教育",
    educationHistory: [
      {
        age: 6,
        year: birth.birthYear + 6,
        route: "义务教育",
        detail: `在${cityNameOf(birth.city)}背起书包，第一次走进教室。`,
      },
    ],
    careerHistory: [],
    relationships: [
      {
        id: "father",
        name: "父亲",
        type: "父母",
        affection: clamp(attributes.family + 4),
        trust: clamp(attributes.family),
        status: birth.fatherJob,
        memories: ["陪你度过了人生最初的六年。"],
      },
      {
        id: "mother",
        name: "母亲",
        type: "父母",
        affection: clamp(attributes.family + 7),
        trust: clamp(attributes.family + 2),
        status: birth.motherJob,
        memories: ["记得你第一次独自上学的背影。"],
      },
    ],
    assets: {
      annualIncome: 0,
      annualExpense: 0,
      savings: background.savings,
      mortgage: 0,
      otherDebt: 0,
      house: "无房",
      investments: 0,
      totalIncome: 0,
      totalExpense: 0,
      peakAnnualIncome: 0,
    },
    tags: [
      birth.talent,
      birth.personality,
      birth.familyWealth,
      `birth:${birth.city}`,
      ...background.tags,
    ],
  };
}
