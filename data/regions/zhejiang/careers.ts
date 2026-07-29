import type { JobId } from "@/types";

export interface JobDefinition {
  id: JobId;
  name: string;
  sector: string;
  baseIncome: number;
  stress: number;
  education: number;
  description: string;
}

export const jobs: JobDefinition[] = [
  { id: "student", name: "学生", sector: "教育", baseIncome: 0, stress: 4, education: 0, description: "仍在校园里积累能力。" },
  { id: "unemployed", name: "待业", sector: "其他", baseIncome: 0, stress: 8, education: 0, description: "暂时停下来寻找下一步。" },
  { id: "internet", name: "互联网产品/运营", sector: "科技", baseIncome: 220000, stress: 15, education: 55, description: "在杭州的写字楼里做产品、技术或运营。" },
  { id: "ecommerce-ops", name: "电商运营", sector: "电商", baseIncome: 150000, stress: 12, education: 35, description: "守着店铺数据，把流量变成订单。" },
  { id: "cross-border", name: "跨境电商", sector: "电商", baseIncome: 170000, stress: 13, education: 40, description: "把浙江的货卖给全世界的买家。" },
  { id: "livestream", name: "直播电商从业者", sector: "电商", baseIncome: 160000, stress: 14, education: 20, description: "镜头前讲货，镜头后算账。" },
  { id: "trade", name: "外贸业务员", sector: "贸易", baseIncome: 145000, stress: 11, education: 45, description: "在邮件、展会和订单之间奔走。" },
  { id: "manufacturing", name: "制造业工程师", sector: "制造", baseIncome: 135000, stress: 10, education: 45, description: "在车间与图纸之间解决真实问题。" },
  { id: "mold-tech", name: "模具/数控技术员", sector: "制造", baseIncome: 125000, stress: 9, education: 22, description: "以毫厘为单位的硬手艺。" },
  { id: "logistics", name: "港航物流从业者", sector: "物流", baseIncome: 120000, stress: 10, education: 25, description: "让集装箱在港口与世界之间流转。" },
  { id: "textile", name: "纺织行业从业者", sector: "制造", baseIncome: 110000, stress: 9, education: 20, description: "一匹布里的生意与功夫。" },
  { id: "auto-parts", name: "汽车零部件从业者", sector: "制造", baseIncome: 128000, stress: 10, education: 28, description: "为整车厂配套，订单连着产业链。" },
  { id: "commodity-trader", name: "小商品贸易经营者", sector: "商业", baseIncome: 155000, stress: 13, education: 15, description: "一个摊位，也能接通全球市场。" },
  { id: "family-successor", name: "家族企业接班人", sector: "企业", baseIncome: 190000, stress: 14, education: 40, description: "接下上一辈打下的江山，也接下所有难题。" },
  { id: "agri-founder", name: "农产品品牌创业者", sector: "农业", baseIncome: 110000, stress: 12, education: 25, description: "把山货做成品牌，把乡愁做成生意。" },
  { id: "factory-owner", name: "小型工厂经营者", sector: "制造", baseIncome: 210000, stress: 17, education: 30, description: "订单、设备、工人、现金流，样样都要管。" },
  { id: "finance", name: "金融从业者", sector: "金融", baseIncome: 210000, stress: 15, education: 65, description: "与资金、风险和客户打交道。" },
  { id: "education", name: "教师", sector: "教育", baseIncome: 115000, stress: 9, education: 55, description: "把知识和耐心投入下一代。" },
  { id: "medical", name: "医护工作者", sector: "医疗", baseIncome: 150000, stress: 15, education: 72, description: "承担专业而高压的照护工作。" },
  { id: "civil-service", name: "公务员", sector: "公共服务", baseIncome: 125000, stress: 7, education: 58, description: "在公共服务岗位稳步前行。" },
  { id: "public-institution", name: "事业单位职员", sector: "公共服务", baseIncome: 112000, stress: 6, education: 52, description: "在专业公共机构工作。" },
  { id: "state-owned", name: "国企职员", sector: "企业", baseIncome: 140000, stress: 8, education: 50, description: "在大型组织中寻找成长路径。" },
  { id: "freelance", name: "自由职业者", sector: "创意", baseIncome: 125000, stress: 10, education: 30, description: "用专业能力换取时间自主。" },
  { id: "self-employed", name: "个体经营者", sector: "商业", baseIncome: 150000, stress: 13, education: 15, description: "自己对客流、成本和口碑负责。" },
  { id: "startup", name: "创业者", sector: "创业", baseIncome: 90000, stress: 18, education: 30, description: "在高风险中验证自己的想法。" },
  { id: "skilled-worker", name: "高级技工", sector: "技能", baseIncome: 135000, stress: 8, education: 20, description: "以熟练技能解决真实问题。" },
  { id: "service", name: "服务业从业者", sector: "服务", baseIncome: 88000, stress: 10, education: 10, description: "在城市日常运转中提供服务。" },
];

export const jobMap = Object.fromEntries(jobs.map((job) => [job.id, job])) as Record<JobId, JobDefinition>;
