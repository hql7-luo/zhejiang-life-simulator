# 浙江人生模拟器 · Zhejiang Life Simulator

一款以当代浙江十一座城市为背景的选择驱动型人生模拟游戏。随机出生在杭州、宁波、温州、嘉兴、湖州、绍兴、金华、衢州、舟山、台州、丽水之一，从 6 岁走到 80+ 岁：中考高考、留杭还是回乡、接手家里的厂还是走自己的路、买房还是租房、创业还是编制……每个选择都会改变后续人生，最终生成一份完整的「浙江人生档案」。

本项目基于 [china-life-simulator](https://github.com/hql7-luo/china-life-simulator) 的底层系统二次开发，城市、家庭产业、职业、事件、结局与视觉全部围绕浙江重新设计。

## 玩法

- **随机浙江人生**：接受一手随机牌，出生城市与家庭背景由种子决定
- **自定义出生**：自选城市、家庭背景、性格与天赋
- **今日浙江人生**：全服同一种子的每日同题挑战
- **城市挑战**：指定一座城市出生，看看这把牌能打成什么样
- **成就与图鉴**：24 个成就、27 种结局、230+ 事件等待收集

## 浙江专属系统

| 系统 | 说明 |
| --- | --- |
| 城市系统 | 11 个地级市 + 上海/深圳/海外去向，各有生活成本、房价系数、教育资源、产业与职业市场 |
| 家庭背景 | 12 类浙江特色家庭（小制造厂、外贸、档口、港航、电商、农家……），影响初始资源与事件概率 |
| 城市迁移 | 记录出生/求学/工作城市与迁移路线，影响生活成本、收入、压力、家庭关系与后续事件 |
| 地方产业 | 模具、汽配、纺织、港航、小商品、跨境电商、直播、农产品品牌等 16 类产业与 25 种职业 |
| 隐藏属性 | 家庭产业、本地人脉、专业技能、城市适应、创业经验、家庭责任、风险承受——不直接显示，但影响事件与结局 |
| 浙江结局 | 27 种结局：杭漂十年、外贸生意人、负债老板、回乡创业者、县城幸福生活……综合财富/健康/家庭/事业判定 |

## 技术栈

Next.js 15 · TypeScript · Tailwind CSS · Zustand (persist/localStorage) · Framer Motion · Vitest · html-to-image

## 目录结构

```text
data/
└── regions/
    └── zhejiang/
        ├── cities.ts            # 11 市 + 3 省外去向的 CityProfile
        ├── birth-profiles.ts    # 12 类家庭背景
        ├── careers.ts           # 25 种职业（含浙江特色职业）
        ├── achievements.ts      # 24 个成就
        ├── endings.ts           # 27 个结局
        ├── tags.ts              # 全局标签注册表
        └── events/
            ├── common.ts        # 浙江通用事件 60（含 16 个里程碑）
            ├── hangzhou.ts      # 杭州 25
            ├── ningbo.ts        # 宁波 20
            ├── wenzhou.ts       # 温州 20
            ├── jinhua.ts        # 金华·义乌 20
            ├── taizhou.ts       # 台州 25
            ├── other-cities.ts  # 嘉湖绍衢舟丽 54
            └── hidden.ts        # 隐藏事件 20
game/
├── random.ts      # 固定随机种子
├── birth.ts       # 加权城市出生 + 家庭背景
├── migration.ts   # 城市迁移与居住年数
├── economy.ts     # 城市生活成本 + 产业匹配收入
├── conditions.ts  # 事件/成就/结局条件（含地域条件）
├── effects.ts     # 选择后果、买房房价系数、迁移记录
├── events.ts      # 里程碑优先的事件选择器
└── endings.ts     # 结局与浙江人生关键词
```

统一类型：`CityProfile`、`RegionPack`、`MigrationRecord`、`LocalIndustry`、`RegionalEventCondition`（见 `types/game.ts`）。城市判断集中在 `data/regions/zhejiang/` 与 `game/migration.ts`，不写死在 React 组件中。

## 本地运行

```bash
pnpm install
pnpm dev      # http://localhost:3000
```

## 质量

```bash
pnpm lint
pnpm test
pnpm build
```

测试覆盖：固定 seed 一致性、城市出生加权分布、城市事件触发、城市迁移与居住年数、城市生活成本与产业收入、家庭产业路线、职业与转行、买房房价系数与负债、成就解锁、浙江结局计算、localStorage 存档、整局玩通（多策略多城市）。

## 设计原则

- 城市与家庭只影响**资源与概率**，不直接决定成功或失败
- 避免地域刻板印象；每个事件的 2-4 个选择都有实质不同的后果
- 结局不只看财富，还综合健康、快乐、家庭、事业、关系、资产、负债与人生选择
- 所有人物与故事均为虚构；模拟不构成人生建议

## License

MIT（与原项目一致）
