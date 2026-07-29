export type ZhejiangCityId =
  | "hangzhou"
  | "ningbo"
  | "wenzhou"
  | "jiaxing"
  | "huzhou"
  | "shaoxing"
  | "jinhua"
  | "quzhou"
  | "zhoushan"
  | "taizhou"
  | "lishui";

export type OutsideLocationId = "shanghai" | "shenzhen" | "overseas";

/** 玩家可以生活与迁移到的地点：浙江 11 市 + 省外去向 */
export type LocationId = ZhejiangCityId | OutsideLocationId;

export type CityTier =
  | "一线城市"
  | "新一线城市"
  | "二线城市"
  | "三四线城市"
  | "县城"
  | "乡镇农村";

export type FamilyWealth = "困难" | "普通" | "小康" | "富裕";
export type Gender = "女" | "男" | "非二元";
export type Hukou = "城镇" | "农村";
export type LifeStage =
  | "童年"
  | "中学"
  | "教育"
  | "职业"
  | "成年"
  | "退休";
export type EventCategory =
  | "普通"
  | "教育"
  | "职业"
  | "家庭"
  | "地区"
  | "隐藏";
export type EducationRoute =
  | "未入学"
  | "义务教育"
  | "职业学校"
  | "高中"
  | "专科"
  | "本科"
  | "研究生"
  | "海外留学"
  | "直接工作";
export type MarriageStatus = "单身" | "恋爱中" | "已婚" | "离异" | "丧偶";
export type HouseState = "无房" | "租房" | "按揭住房" | "全款住房";

export type JobId =
  | "student"
  | "unemployed"
  | "internet"
  | "ecommerce-ops"
  | "cross-border"
  | "livestream"
  | "trade"
  | "manufacturing"
  | "mold-tech"
  | "logistics"
  | "textile"
  | "auto-parts"
  | "commodity-trader"
  | "family-successor"
  | "agri-founder"
  | "factory-owner"
  | "finance"
  | "education"
  | "medical"
  | "civil-service"
  | "public-institution"
  | "state-owned"
  | "freelance"
  | "self-employed"
  | "startup"
  | "skilled-worker"
  | "service";

/** 浙江地方产业 */
export type IndustryId =
  | "internet"
  | "ecommerce"
  | "crossborder"
  | "foreign-trade"
  | "manufacturing"
  | "mold-cnc"
  | "port-logistics"
  | "textile"
  | "auto-parts"
  | "small-commodity"
  | "livestream"
  | "agri-brand"
  | "marine"
  | "tourism"
  | "green-industry"
  | "pharma";

/** 浙江特色家庭背景 */
export type FamilyBackgroundId =
  | "dual-worker"
  | "small-factory"
  | "foreign-trade"
  | "market-stall"
  | "self-employed"
  | "teacher-medical"
  | "civil-family"
  | "farming"
  | "ecommerce-family"
  | "port-shipping"
  | "hardship"
  | "rich-owner";

export interface LocalIndustry {
  id: IndustryId;
  name: string;
  /** 1 = 普通，2 = 支柱，3 = 全国知名 */
  strength: 1 | 2 | 3;
  jobs: JobId[];
}

export interface CityProfile {
  id: LocationId;
  name: string;
  /** 是否浙江省内 */
  inZhejiang: boolean;
  tier: CityTier;
  /** 年生活成本基数（元） */
  livingCost: number;
  /** 房价系数，1 为全省基准 */
  housePrice: number;
  /** 教育资源 0-100 */
  education: number;
  /** 创业氛围 0-100 */
  startup: number;
  industries: LocalIndustry[];
  /** 职业机会加成：数值越高，相关职业事件与收入机会越多 */
  jobMarket: Partial<Record<JobId, number>>;
  /** 常见迁移去向 */
  routes: LocationId[];
  flavor: string[];
  description: string;
}

export interface FamilyBackground {
  id: FamilyBackgroundId;
  name: string;
  description: string;
  /** 基础出现权重 */
  weight: number;
  /** 在特定城市出现的权重加成（乘算） */
  cityBoost?: Partial<Record<ZhejiangCityId, number>>;
  wealthPool: FamilyWealth[];
  fatherJobs: string[];
  motherJobs: string[];
  /** 家庭产业（若有） */
  industry?: IndustryId;
  /** 初始属性修正（含隐藏属性） */
  attributes: Partial<PlayerAttributes>;
  /** 初始存款 */
  savings: number;
  hukou: Hukou;
  tags: string[];
}

export interface MigrationRecord {
  age: number;
  year: number;
  from: LocationId;
  to: LocationId;
  reason: string;
}

export interface BirthProfile {
  name: string;
  gender: Gender;
  birthYear: number;
  /** 出生城市（浙江 11 市之一） */
  city: ZhejiangCityId;
  familyBackground: FamilyBackgroundId;
  hukou: Hukou;
  familyWealth: FamilyWealth;
  fatherJob: string;
  motherJob: string;
  familyClimate: "亲密" | "平常" | "紧张";
  talent: "好奇心" | "运动感" | "表达力" | "动手能力" | "耐心";
  personality: "谨慎" | "外向" | "坚韧" | "随和" | "独立";
}

export interface PlayerAttributes {
  health: number;
  intelligence: number;
  emotional: number;
  happiness: number;
  money: number;
  family: number;
  network: number;
  education: number;
  career: number;
  stress: number;
  /** 以下为隐藏属性，不直接完整展示 */
  familyIndustry: number;
  localNetwork: number;
  skill: number;
  cityAdapt: number;
  entrepreneurship: number;
  familyDuty: number;
  riskTolerance: number;
}

/** 面板直接展示的属性 */
export const visibleAttributeKeys = [
  "health",
  "intelligence",
  "emotional",
  "happiness",
  "money",
  "family",
  "network",
  "education",
  "career",
  "stress",
] as const;

/** 隐藏属性，只影响事件与结局 */
export const hiddenAttributeKeys = [
  "familyIndustry",
  "localNetwork",
  "skill",
  "cityAdapt",
  "entrepreneurship",
  "familyDuty",
  "riskTolerance",
] as const;

export interface EducationRecord {
  age: number;
  year: number;
  route: EducationRoute;
  detail: string;
}

export interface CareerRecord {
  age: number;
  year: number;
  jobId: JobId;
  title: string;
  action: "入职" | "升职" | "转行" | "离职" | "创业" | "退休";
  annualIncome: number;
}

export interface Relationship {
  id: string;
  name: string;
  type: "父母" | "手足" | "同学" | "老师" | "同事" | "朋友" | "恋人" | "配偶" | "子女" | "伙伴";
  affection: number;
  trust: number;
  status: string;
  memories: string[];
}

export interface AssetState {
  annualIncome: number;
  annualExpense: number;
  savings: number;
  mortgage: number;
  otherDebt: number;
  house: HouseState;
  investments: number;
  totalIncome: number;
  totalExpense: number;
  peakAnnualIncome: number;
}

export interface EventCondition {
  minAge?: number;
  maxAge?: number;
  stage?: LifeStage;
  minAttributes?: Partial<PlayerAttributes>;
  maxAttributes?: Partial<PlayerAttributes>;
  education?: EducationRoute[];
  jobs?: JobId[];
  marriage?: MarriageStatus[];
  requiredTags?: string[];
  excludedTags?: string[];
  chance?: number;
}

/** 带地域条件的事件触发规则 */
export interface RegionalEventCondition extends EventCondition {
  /** 当前所在城市/去向 */
  locations?: LocationId[];
  /** 出生城市 */
  birthLocations?: LocationId[];
  /** 曾经居住过的城市 */
  livedLocations?: LocationId[];
  /** 家庭背景 */
  familyBackgrounds?: FamilyBackgroundId[];
  /** 家庭产业 */
  industries?: IndustryId[];
  /** 最少迁移次数 */
  minMigrations?: number;
}

export interface ChoiceEffects {
  attributes?: Partial<PlayerAttributes>;
  savings?: number;
  debt?: number;
  mortgage?: number;
  investment?: number;
  annualIncome?: number;
  annualExpense?: number;
  educationRoute?: EducationRoute;
  jobId?: JobId;
  marriage?: MarriageStatus;
  children?: number;
  house?: HouseState;
  /** 迁移到新城市 */
  moveTo?: LocationId;
  /** 迁回出生城市 */
  moveHome?: boolean;
  /** 迁移原因（写入迁移记录） */
  moveReason?: string;
  /** 求学城市（同时记录迁移与求学城市） */
  studyAt?: LocationId;
  addTags?: string[];
  removeTags?: string[];
  addRelationship?: Omit<Relationship, "id">;
  relationshipChange?: {
    type: Relationship["type"];
    affection?: number;
    trust?: number;
    memory?: string;
  };
}

export interface EventChoice {
  id: string;
  text: string;
  hint?: string;
  effects: ChoiceEffects;
}

export interface LifeEvent {
  id: string;
  category: EventCategory;
  title: string;
  description: string;
  stage?: LifeStage;
  years: number;
  condition?: RegionalEventCondition;
  choices: EventChoice[];
  rare?: boolean;
}

export interface TimelineEntry {
  id: string;
  age: number;
  year: number;
  title: string;
  choice: string;
  category: EventCategory;
  changes: string[];
}

export interface Player {
  birth: BirthProfile;
  age: number;
  currentYear: number;
  stage: LifeStage;
  currentJob: JobId;
  /** 出生城市（家） */
  homeLocation: ZhejiangCityId;
  currentLocation: LocationId;
  studyLocation?: LocationId;
  migrationHistory: MigrationRecord[];
  marriage: MarriageStatus;
  children: number;
  attributes: PlayerAttributes;
  educationRoute: EducationRoute;
  educationHistory: EducationRecord[];
  careerHistory: CareerRecord[];
  relationships: Relationship[];
  assets: AssetState;
  tags: string[];
}

export interface AchievementCondition {
  minAge?: number;
  minSavings?: number;
  maxSavings?: number;
  minDebt?: number;
  minAttributes?: Partial<PlayerAttributes>;
  maxAttributes?: Partial<PlayerAttributes>;
  education?: EducationRoute[];
  jobs?: JobId[];
  marriage?: MarriageStatus[];
  house?: HouseState[];
  requiredTags?: string[];
  minCareerCount?: number;
  /** 当前所在城市 */
  locations?: LocationId[];
  /** 在某城市累计居住年数 */
  minYearsInLocation?: { location: LocationId; years: number };
  /** 居住过的不同城市数量 */
  minLivedLocations?: number;
  /** 迁移次数 */
  minMigrations?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  rarity: "普通" | "稀有" | "珍贵" | "传说";
  icon: string;
  condition: AchievementCondition;
}

export interface Ending {
  id: string;
  name: string;
  summary: string;
  quote: string;
  rarity: "常见" | "少见" | "稀有" | "传说";
  priority: number;
  condition: AchievementCondition;
}

export interface EndingResult {
  ending: Ending;
  attributeScore: number;
  wealthSummary: string;
  familySummary: string;
  topChoices: TimelineEntry[];
  regret?: TimelineEntry;
  keywords: string[];
}

/** 区域内容包：一个城市群的完整玩法数据 */
export interface RegionPack {
  id: string;
  name: string;
  cities: Record<LocationId, CityProfile>;
  familyBackgrounds: FamilyBackground[];
  events: LifeEvent[];
  achievements: Achievement[];
  endings: Ending[];
}

export interface DailyChallenge {
  id: string;
  date: string;
  seed: string;
  title: string;
  description: string;
}

export interface GameStats {
  jobsHeld: number;
  jobChanges: number;
  relationships: number;
  importantChoices: number;
  turningPoints: number;
}

export interface GameState {
  version: number;
  status: "home" | "setup" | "playing" | "ended";
  seed: string;
  randomCursor: number;
  player: Player | null;
  currentEvent: LifeEvent | null;
  timeline: TimelineEntry[];
  recentEventIds: string[];
  unlockedEventIds: string[];
  unlockedEndingIds: string[];
  unlockedAchievementIds: string[];
  unlockedJobIds: JobId[];
  endingResult: EndingResult | null;
  stats: GameStats;
  isDaily: boolean;
}
