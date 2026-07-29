import { jobMap } from "@/data/regions/zhejiang/careers";
import { cityNameOf, cityProfileOf } from "@/data/regions/zhejiang/cities";
import { simulateEconomy } from "@/game/economy";
import { recordMigration } from "@/game/migration";
import { getLifeStage } from "@/game/stage";
import { attributeLabels, clamp, formatCurrency } from "@/utils/format";
import type {
  ChoiceEffects,
  EventChoice,
  LifeEvent,
  Player,
  TimelineEntry,
} from "@/types";

export function describeEffects(effects: ChoiceEffects): string[] {
  const result: string[] = [];
  for (const [key, value] of Object.entries(effects.attributes ?? {})) {
    if (!value) continue;
    const label = attributeLabels[key as keyof Player["attributes"]];
    if (!label) continue;
    result.push(`${label} ${value > 0 ? "+" : ""}${value}`);
  }
  if (effects.savings)
    result.push(
      `存款 ${effects.savings > 0 ? "+" : ""}${formatCurrency(effects.savings)}`,
    );
  if (effects.debt)
    result.push(
      `负债 ${effects.debt > 0 ? "+" : ""}${formatCurrency(effects.debt)}`,
    );
  if (effects.mortgage)
    result.push(`房贷 +${formatCurrency(effects.mortgage)}`);
  if (effects.educationRoute)
    result.push(`教育路线：${effects.educationRoute}`);
  if (effects.jobId) result.push(`职业：${jobMap[effects.jobId].name}`);
  if (effects.marriage) result.push(`关系：${effects.marriage}`);
  if (effects.house) result.push(`住房：${effects.house}`);
  if (effects.moveTo) result.push(`前往：${cityNameOf(effects.moveTo)}`);
  if (effects.moveHome) result.push("返回家乡");
  return result.slice(0, 4);
}

export function applyChoice(
  player: Player,
  event: LifeEvent,
  choice: EventChoice,
  seed: string,
  cursor: number,
): { player: Player; timeline: TimelineEntry } {
  const effects = choice.effects;
  const next = simulateEconomy(player, event.years, `${seed}:economy`, cursor);
  next.age += event.years;
  next.currentYear += event.years;
  next.stage = getLifeStage(next.age);

  for (const [key, value] of Object.entries(effects.attributes ?? {})) {
    const attribute = key as keyof Player["attributes"];
    next.attributes[attribute] = clamp(
      next.attributes[attribute] + (value ?? 0),
    );
  }
  const savingsAfterChoice = next.assets.savings + (effects.savings ?? 0);
  const uncoveredCost = Math.max(0, -savingsAfterChoice);
  next.assets.savings = Math.max(0, savingsAfterChoice);
  next.assets.otherDebt =
    Math.max(0, next.assets.otherDebt + (effects.debt ?? 0)) + uncoveredCost;
  next.assets.mortgage = Math.max(
    0,
    next.assets.mortgage + (effects.mortgage ?? 0),
  );
  next.assets.investments = Math.max(
    0,
    next.assets.investments + (effects.investment ?? 0),
  );
  if (effects.annualIncome !== undefined)
    next.assets.annualIncome = effects.annualIncome;
  if (effects.annualExpense !== undefined)
    next.assets.annualExpense = effects.annualExpense;
  if (effects.house) {
    next.assets.house = effects.house;
    if (effects.house === "按揭住房" && next.assets.mortgage === 0) {
      const cityHousePrice = cityProfileOf(next.currentLocation).housePrice;
      next.assets.mortgage = Math.max(
        400000,
        Math.round((effects.mortgage ?? 900000) * cityHousePrice),
      );
    }
    if (effects.house === "按揭住房" || effects.house === "全款住房") {
      const tags = new Set(next.tags);
      tags.add("有房一族");
      if (next.currentLocation === "hangzhou") tags.add("杭州买房");
      next.tags = [...tags];
    }
  }
  if (effects.studyAt) {
    next.studyLocation = effects.studyAt;
    recordMigration(
      next,
      effects.studyAt,
      effects.moveReason ?? `前往${cityNameOf(effects.studyAt)}求学`,
      player.age,
      player.currentYear,
    );
  }
  if (effects.moveTo && effects.moveTo !== next.currentLocation) {
    recordMigration(next, effects.moveTo, effects.moveReason ?? event.title, player.age, player.currentYear);
  } else if (effects.moveHome && next.currentLocation !== next.homeLocation) {
    recordMigration(next, next.homeLocation, effects.moveReason ?? "回到家乡", player.age, player.currentYear);
  }
  if (effects.marriage) next.marriage = effects.marriage;
  if (effects.children)
    next.children = Math.max(0, next.children + effects.children);

  const tags = new Set(next.tags);
  effects.addTags?.forEach((tag) => tags.add(tag));
  effects.removeTags?.forEach((tag) => tags.delete(tag));
  next.tags = [...tags];

  if (
    effects.educationRoute &&
    effects.educationRoute !== next.educationRoute
  ) {
    next.educationRoute = effects.educationRoute;
    next.educationHistory.push({
      age: next.age,
      year: next.currentYear,
      route: effects.educationRoute,
      detail: `${event.title}：${choice.text}`,
    });
    const educationBoost: Partial<Record<Player["educationRoute"], number>> = {
      职业学校: 10,
      专科: 15,
      本科: 25,
      研究生: 35,
      海外留学: 32,
    };
    next.attributes.education = clamp(
      next.attributes.education + (educationBoost[effects.educationRoute] ?? 0),
    );
  }
  if (effects.jobId && effects.jobId !== next.currentJob) {
    const action =
      effects.jobId === "startup" || effects.jobId === "factory-owner" || effects.jobId === "agri-founder"
        ? "创业"
        : effects.jobId === "unemployed" && next.stage === "退休"
          ? "退休"
          : next.currentJob === "student" || next.currentJob === "unemployed"
            ? "入职"
            : "转行";
    next.currentJob = effects.jobId;
    next.careerHistory.push({
      age: next.age,
      year: next.currentYear,
      jobId: effects.jobId,
      title: jobMap[effects.jobId].name,
      action,
      annualIncome: jobMap[effects.jobId].baseIncome,
    });
  }
  if (effects.addRelationship) {
    next.relationships.push({
      ...effects.addRelationship,
      id: `${effects.addRelationship.type}-${next.age}-${next.relationships.length}`,
    });
  }
  if (effects.relationshipChange) {
    const relationship = next.relationships.find(
      (item) => item.type === effects.relationshipChange?.type,
    );
    if (relationship) {
      relationship.affection = clamp(
        relationship.affection + (effects.relationshipChange.affection ?? 0),
      );
      relationship.trust = clamp(
        relationship.trust + (effects.relationshipChange.trust ?? 0),
      );
      if (effects.relationshipChange.memory)
        relationship.memories.push(effects.relationshipChange.memory);
    }
  }
  if (effects.marriage === "已婚") {
    const partner = next.relationships.find((item) => item.type === "恋人");
    if (partner) {
      partner.type = "配偶";
      partner.status = "与你共同生活";
    }
  } else if (effects.marriage === "离异") {
    const partner = next.relationships.find((item) => item.type === "配偶");
    if (partner) partner.status = "已经和平分开";
  }

  return {
    player: next,
    timeline: {
      id: `${event.id}-${cursor}`,
      age: player.age,
      year: player.currentYear,
      title: event.title,
      choice: choice.text,
      category: event.category,
      changes: describeEffects(effects),
    },
  };
}
