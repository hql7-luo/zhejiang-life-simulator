import type { CityProfile, LocationId, ZhejiangCityId } from "@/types";

export const zhejiangCityIds: ZhejiangCityId[] = [
  "hangzhou",
  "ningbo",
  "wenzhou",
  "jiaxing",
  "huzhou",
  "shaoxing",
  "jinhua",
  "quzhou",
  "zhoushan",
  "taizhou",
  "lishui",
];

export const outsideLocationIds: LocationId[] = ["shanghai", "shenzhen", "overseas"];

const hangzhou: CityProfile = {
  id: "hangzhou",
  name: "杭州",
  inZhejiang: true,
  tier: "新一线城市",
  livingCost: 78000,
  housePrice: 2.6,
  education: 88,
  startup: 92,
  industries: [
    { id: "internet", name: "互联网", strength: 3, jobs: ["internet"] },
    { id: "ecommerce", name: "电商", strength: 3, jobs: ["ecommerce-ops"] },
    { id: "livestream", name: "直播电商", strength: 2, jobs: ["livestream"] },
    { id: "crossborder", name: "跨境电商", strength: 2, jobs: ["cross-border"] },
  ],
  jobMarket: { internet: 3, "ecommerce-ops": 3, livestream: 2, "cross-border": 2, startup: 2, finance: 1 },
  routes: ["shanghai", "ningbo", "jinhua", "overseas"],
  flavor: ["互联网", "电商之都", "高房价", "创业"],
  description: "互联网与电商的机会之城，机会与房价一样高。",
};

const ningbo: CityProfile = {
  id: "ningbo",
  name: "宁波",
  inZhejiang: true,
  tier: "二线城市",
  livingCost: 62000,
  housePrice: 1.6,
  education: 74,
  startup: 70,
  industries: [
    { id: "port-logistics", name: "港航物流", strength: 3, jobs: ["logistics"] },
    { id: "foreign-trade", name: "外贸", strength: 3, jobs: ["trade"] },
    { id: "manufacturing", name: "制造业", strength: 2, jobs: ["manufacturing"] },
  ],
  jobMarket: { logistics: 3, trade: 3, manufacturing: 2, "cross-border": 1 },
  routes: ["shanghai", "hangzhou", "overseas"],
  flavor: ["港口", "外贸", "制造业"],
  description: "东方大港，集装箱里装着无数家庭的生计。",
};

const wenzhou: CityProfile = {
  id: "wenzhou",
  name: "温州",
  inZhejiang: true,
  tier: "三四线城市",
  livingCost: 52000,
  housePrice: 1.4,
  education: 66,
  startup: 86,
  industries: [
    { id: "manufacturing", name: "民营制造", strength: 3, jobs: ["manufacturing", "factory-owner"] },
    { id: "foreign-trade", name: "外贸", strength: 2, jobs: ["trade"] },
    { id: "small-commodity", name: "商贸", strength: 2, jobs: ["commodity-trader", "self-employed"] },
  ],
  jobMarket: { manufacturing: 2, trade: 2, "factory-owner": 2, startup: 3, "self-employed": 2 },
  routes: ["hangzhou", "shanghai", "overseas"],
  flavor: ["民营经济", "经商传统", "海外侨乡"],
  description: "人人都想做点生意的地方，敢闯是写进日常的词。",
};

const jiaxing: CityProfile = {
  id: "jiaxing",
  name: "嘉兴",
  inZhejiang: true,
  tier: "三四线城市",
  livingCost: 48000,
  housePrice: 1.3,
  education: 64,
  startup: 58,
  industries: [
    { id: "manufacturing", name: "制造业", strength: 2, jobs: ["manufacturing"] },
    { id: "textile", name: "纺织", strength: 2, jobs: ["textile"] },
  ],
  jobMarket: { manufacturing: 2, textile: 2, "civil-service": 1 },
  routes: ["shanghai", "hangzhou"],
  flavor: ["上海通勤", "县域经济", "水乡"],
  description: "夹在上海与杭州之间，进可通勤，退可安居。",
};

const huzhou: CityProfile = {
  id: "huzhou",
  name: "湖州",
  inZhejiang: true,
  tier: "三四线城市",
  livingCost: 44000,
  housePrice: 1.1,
  education: 60,
  startup: 55,
  industries: [
    { id: "green-industry", name: "绿色产业", strength: 2, jobs: ["manufacturing"] },
    { id: "manufacturing", name: "制造业", strength: 2, jobs: ["manufacturing"] },
  ],
  jobMarket: { manufacturing: 2, "civil-service": 1, "agri-founder": 1 },
  routes: ["hangzhou", "shanghai"],
  flavor: ["绿水青山", "县城生活", "慢节奏"],
  description: "太湖南岸的安静城市，适合把日子过慢一点。",
};

const shaoxing: CityProfile = {
  id: "shaoxing",
  name: "绍兴",
  inZhejiang: true,
  tier: "三四线城市",
  livingCost: 48000,
  housePrice: 1.3,
  education: 68,
  startup: 62,
  industries: [
    { id: "textile", name: "纺织", strength: 3, jobs: ["textile"] },
    { id: "manufacturing", name: "制造业", strength: 2, jobs: ["manufacturing"] },
    { id: "tourism", name: "文旅", strength: 1, jobs: ["service", "self-employed"] },
  ],
  jobMarket: { textile: 3, manufacturing: 2, trade: 1 },
  routes: ["hangzhou", "ningbo"],
  flavor: ["纺织之都", "家族企业", "黄酒与桥"],
  description: "一块布撑起一座城，家族企业在这里代代相传。",
};

const jinhua: CityProfile = {
  id: "jinhua",
  name: "金华",
  inZhejiang: true,
  tier: "三四线城市",
  livingCost: 46000,
  housePrice: 1.2,
  education: 64,
  startup: 80,
  industries: [
    { id: "small-commodity", name: "小商品", strength: 3, jobs: ["commodity-trader"] },
    { id: "crossborder", name: "跨境电商", strength: 3, jobs: ["cross-border"] },
    { id: "livestream", name: "直播电商", strength: 2, jobs: ["livestream"] },
    { id: "port-logistics", name: "物流", strength: 2, jobs: ["logistics"] },
  ],
  jobMarket: { "commodity-trader": 3, "cross-border": 3, livestream: 2, logistics: 2, "ecommerce-ops": 2 },
  routes: ["hangzhou", "overseas", "shenzhen"],
  flavor: ["义乌", "小商品", "跨境", "物流"],
  description: "义乌的小商品从这里发往全世界，摊位前就能谈成跨国生意。",
};

const quzhou: CityProfile = {
  id: "quzhou",
  name: "衢州",
  inZhejiang: true,
  tier: "三四线城市",
  livingCost: 40000,
  housePrice: 0.9,
  education: 56,
  startup: 48,
  industries: [
    { id: "manufacturing", name: "制造业", strength: 1, jobs: ["manufacturing"] },
    { id: "agri-brand", name: "农业品牌", strength: 1, jobs: ["agri-founder"] },
  ],
  jobMarket: { manufacturing: 1, "civil-service": 2, "public-institution": 1 },
  routes: ["hangzhou", "jinhua"],
  flavor: ["普通城市", "外出与回乡", "慢生活"],
  description: "浙西的安静城市，年轻人常在外与家乡之间往返。",
};

const zhoushan: CityProfile = {
  id: "zhoushan",
  name: "舟山",
  inZhejiang: true,
  tier: "三四线城市",
  livingCost: 46000,
  housePrice: 1.1,
  education: 54,
  startup: 50,
  industries: [
    { id: "marine", name: "海洋经济", strength: 3, jobs: ["logistics", "skilled-worker"] },
    { id: "port-logistics", name: "港航", strength: 2, jobs: ["logistics"] },
    { id: "tourism", name: "旅游", strength: 2, jobs: ["service", "self-employed"] },
  ],
  jobMarket: { logistics: 2, "skilled-worker": 2, service: 1, "self-employed": 1 },
  routes: ["ningbo", "shanghai"],
  flavor: ["海岛", "渔业", "港航", "旅游"],
  description: "千岛之城，海风里既有鱼获，也有航线与货轮。",
};

const taizhou: CityProfile = {
  id: "taizhou",
  name: "台州",
  inZhejiang: true,
  tier: "三四线城市",
  livingCost: 47000,
  housePrice: 1.2,
  education: 62,
  startup: 74,
  industries: [
    { id: "mold-cnc", name: "模具", strength: 3, jobs: ["mold-tech"] },
    { id: "auto-parts", name: "汽配", strength: 3, jobs: ["auto-parts"] },
    { id: "manufacturing", name: "机电", strength: 2, jobs: ["manufacturing"] },
    { id: "pharma", name: "医药", strength: 2, jobs: ["manufacturing", "medical"] },
    { id: "foreign-trade", name: "外贸", strength: 2, jobs: ["trade"] },
  ],
  jobMarket: { "mold-tech": 3, "auto-parts": 3, manufacturing: 2, trade: 2, "factory-owner": 2 },
  routes: ["hangzhou", "shanghai", "ningbo"],
  flavor: ["模具之都", "汽配", "民营制造", "外贸"],
  description: "模具与汽配的实干之城，车间里的手艺就是底气。",
};

const lishui: CityProfile = {
  id: "lishui",
  name: "丽水",
  inZhejiang: true,
  tier: "三四线城市",
  livingCost: 40000,
  housePrice: 0.9,
  education: 54,
  startup: 56,
  industries: [
    { id: "agri-brand", name: "生态农产", strength: 2, jobs: ["agri-founder"] },
    { id: "tourism", name: "生态旅游", strength: 2, jobs: ["service", "self-employed"] },
  ],
  jobMarket: { "agri-founder": 2, service: 1, "civil-service": 1 },
  routes: ["hangzhou", "jinhua", "wenzhou"],
  flavor: ["生态", "山货", "返乡创业"],
  description: "浙江的绿谷，好山好水里藏着返乡创业的新故事。",
};

const shanghai: CityProfile = {
  id: "shanghai",
  name: "上海",
  inZhejiang: false,
  tier: "一线城市",
  livingCost: 96000,
  housePrice: 3.4,
  education: 90,
  startup: 80,
  industries: [
    { id: "foreign-trade", name: "外贸", strength: 3, jobs: ["trade"] },
    { id: "internet", name: "互联网", strength: 2, jobs: ["internet"] },
  ],
  jobMarket: { finance: 3, trade: 2, internet: 2, "cross-border": 1 },
  routes: ["hangzhou", "overseas"],
  flavor: ["一线城市", "外企", "高薪高压"],
  description: "更大的舞台，也更贵的房租。",
};

const shenzhen: CityProfile = {
  id: "shenzhen",
  name: "深圳",
  inZhejiang: false,
  tier: "一线城市",
  livingCost: 90000,
  housePrice: 3.2,
  education: 80,
  startup: 90,
  industries: [
    { id: "internet", name: "互联网", strength: 3, jobs: ["internet"] },
    { id: "crossborder", name: "跨境电商", strength: 3, jobs: ["cross-border"] },
  ],
  jobMarket: { internet: 3, "cross-border": 2, startup: 2, "ecommerce-ops": 1 },
  routes: ["hangzhou", "overseas"],
  flavor: ["一线城市", "科技", "跨境"],
  description: "南方的机会之城，节奏快到没有时间犹豫。",
};

const overseas: CityProfile = {
  id: "overseas",
  name: "海外",
  inZhejiang: false,
  tier: "一线城市",
  livingCost: 150000,
  housePrice: 2.8,
  education: 92,
  startup: 70,
  industries: [{ id: "foreign-trade", name: "国际贸易", strength: 2, jobs: ["trade"] }],
  jobMarket: { trade: 2, finance: 1 },
  routes: ["hangzhou", "shanghai", "wenzhou"],
  flavor: ["留学", "异乡", "远方"],
  description: "在更远的地方读书或打拼，重新学习一切。",
};

export const cities: Record<LocationId, CityProfile> = {
  hangzhou,
  ningbo,
  wenzhou,
  jiaxing,
  huzhou,
  shaoxing,
  jinhua,
  quzhou,
  zhoushan,
  taizhou,
  lishui,
  shanghai,
  shenzhen,
  overseas,
};

export function cityProfileOf(location: LocationId): CityProfile {
  return cities[location];
}

export function cityNameOf(location: LocationId): string {
  return cities[location].name;
}
