import { jobMap } from "@/data/regions/zhejiang/careers";
import { cityProfileOf } from "@/data/regions/zhejiang/cities";
import { seededRandom } from "@/game/random";
import { clamp } from "@/utils/format";
import type { Player } from "@/types";

/** 普通负债年利率 */
export const PERSONAL_DEBT_RATE = 0.06;
/** 经营负债年利率 */
export const BUSINESS_DEBT_RATE = 0.075;
/** 房贷年利率（30 年等额本息近似） */
export const MORTGAGE_RATE = 0.041;
/** 房贷年金系数：30 年、4.1% 利率下每年还本付息比例 */
export const MORTGAGE_ANNUITY = 0.0578;

export function livingCostOf(player: Player): number {
  return cityProfileOf(player.currentLocation).livingCost;
}

/** 城市职业机会加成：城市产业越匹配，收入机会越多 */
function cityJobBoost(player: Player): number {
  const city = cityProfileOf(player.currentLocation);
  return (city.jobMarket[player.currentJob] ?? 0) * 0.045;
}

/** 房贷年度还款额（等额本息） */
export function annualMortgagePayment(mortgage: number): number {
  if (mortgage <= 0) return 0;
  return Math.max(12000, Math.round(mortgage * MORTGAGE_ANNUITY));
}

export function calculateAnnualEconomy(player: Player, seed = "economy", cursor = 0) {
  const job = jobMap[player.currentJob];
  const experience = Math.min(0.55, player.careerHistory.length * 0.045);
  const ability =
    (player.attributes.career + player.attributes.intelligence + player.attributes.skill - 150) / 320;
  const variance = (seededRandom(seed, cursor) - 0.5) * 0.14;
  const retired = player.stage === "退休" && player.currentJob === "unemployed";
  const unemployed = player.currentJob === "unemployed" && !retired;
  const income = retired
    ? Math.max(36000, player.assets.annualIncome * 0.46)
    : Math.max(0, job.baseIncome * (1 + experience + ability + cityJobBoost(player) + variance));
  const livingCost = livingCostOf(player);
  // 失业期间主动压缩开支（-22%），退休后开支自然下降（-15%）
  const unemploymentFactor = unemployed ? 0.78 : retired ? 0.85 : 1;
  const householdFactor = 1 + player.children * 0.18 + (player.marriage === "已婚" ? 0.22 : 0);
  const housingCost =
    player.assets.house === "按揭住房"
      ? player.assets.mortgagePayment || annualMortgagePayment(player.assets.mortgage)
      : player.assets.house === "租房"
        ? livingCost * 0.36
        : 0;
  const medical = player.attributes.health < 40 ? 14000 : player.age > 60 ? 7000 : 2200;
  const expense = livingCost * householdFactor * unemploymentFactor + housingCost + medical;
  return { income: Math.round(income), expense: Math.round(expense) };
}

/**
 * 消费降级保护：当存款耗尽、收入无法覆盖支出时，
 * 超出部分只有一部分转化为普通负债，其余靠节衣缩食消化（代价是快乐与健康）。
 * 避免连续几次普通选择就不可逆地负债数百万。
 */
function applyDeficitProtection(next: Player, deficit: number): number {
  const absorbRatio = 0.65;
  const absorbed = Math.round(deficit * absorbRatio);
  next.attributes.happiness = clamp(next.attributes.happiness - 2);
  next.attributes.health = clamp(next.attributes.health - 1);
  next.attributes.stress = clamp(next.attributes.stress + 3);
  return deficit - absorbed;
}

export function simulateEconomy(player: Player, years: number, seed = "economy", cursor = 0): Player {
  const next = structuredClone(player);
  for (let year = 0; year < years; year += 1) {
    const { income, expense } = calculateAnnualEconomy(next, seed, cursor + year);
    const familySupport =
      next.age + year < 18
        ? 1
        : next.currentJob === "student" && next.age + year <= 22
          ? { 困难: 0.3, 普通: 0.55, 小康: 0.78, 富裕: 0.92 }[next.birth.familyWealth]
          : 0;
    let personalExpense = Math.round(expense * (1 - familySupport));
    // 负债利息：普通负债 6%，经营负债 7.5%，并入当年支出；退休后由子女与社保兜住，停止滚息
    if (next.stage !== "退休") {
      personalExpense += Math.round(
        next.assets.otherDebt * PERSONAL_DEBT_RATE + next.assets.businessDebt * BUSINESS_DEBT_RATE,
      );
    }
    next.assets.annualIncome = income;
    next.assets.annualExpense = personalExpense;
    const balance = income - personalExpense;
    next.assets.savings += balance;
    if (next.assets.savings < 0) {
      const deficit = applyDeficitProtection(next, Math.abs(next.assets.savings));
      next.assets.otherDebt += deficit;
      next.assets.savings = 0;
    }
    next.assets.totalIncome += income;
    next.assets.totalExpense += personalExpense;
    next.assets.peakAnnualIncome = Math.max(next.assets.peakAnnualIncome, income);
    // 房贷摊还：年供已在 housingCost 中扣除，这里按放款时锁定的年供结转本金。
    // 年供不随余额重算（否则等于每年重新发放 30 年贷款，永远还不完）。
    if (next.assets.mortgage > 0) {
      if (!next.assets.mortgagePayment) {
        // 旧存档兼容：按当前余额补签年供
        next.assets.mortgagePayment = annualMortgagePayment(next.assets.mortgage);
      }
      const interest = Math.round(next.assets.mortgage * MORTGAGE_RATE);
      const payment = Math.min(next.assets.mortgagePayment, next.assets.mortgage + interest);
      const principal = Math.max(0, payment - interest);
      next.assets.mortgage = Math.max(0, next.assets.mortgage - principal);
      if (next.assets.mortgage === 0) {
        next.assets.mortgagePayment = 0;
        if (next.assets.house === "按揭住房") {
          next.assets.house = "全款住房";
        }
      }
    }
    if (next.assets.investments > 0) {
      next.assets.investments = Math.round(
        next.assets.investments * (0.96 + seededRandom(`${seed}:invest`, cursor + year) * 0.13),
      );
    }
  }
  return next;
}
