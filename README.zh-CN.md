# 浙江人生模拟器 · Zhejiang Life Simulator

[English](README.md) · [在线 Demo](https://zhejiang-life-simulator.vercel.app)

一款以浙江城市、产业、迁移与日常生活为背景，支持固定随机种子的选择驱动型人生模拟游戏。

![浙江人生模拟器首页](docs/screenshots/home.png)

## 内容规模

| 内容 | 规模 |
| --- | ---: |
| 人生事件 | 共注册 251 个：原有 246 个叙事事件 + 5 个发布质量修复新增的经济平衡/恢复事件 |
| 结局 | 28 个 |
| 成就 | 24 个 |
| 职业 | 27 种 |
| 家庭背景 | 12 类 |
| 出生城市 | 浙江 11 个地级市 |
| 可迁移城市 | 14 个 |
| 自动化测试 | 70 项 |
| 结局模拟 | 1,100 局，28/28 个结局均可触发 |

## 核心玩法

- 从随机出生、自定义出生、城市挑战或每日人生开始一局固定种子的人生。
- 在教育、就业、创业、买房、婚恋、家庭、迁移与退休等阶段做出选择。
- 选择会改变属性、存款与负债、职业履历、关系、标签和最终结局。
- 支持同种子重玩、每日挑战，以及城市、职业、成就和结局图鉴。

## 浙江特色系统

- 浙江 11 个出生城市拥有不同的生活成本、房价、教育资源、产业和职业市场。
- 迁移路线覆盖省内城市、杭漂、沪漂、深圳、海外发展与回乡。
- 家庭产业接班，以及制造业、外贸、电商、港航、纺织、汽配、模具、直播、小商品贸易等本地产业路线。
- 人生迁移地图和城市居住时长会影响事件、成就、挑战与结局。

## 技术栈

Next.js 15 · TypeScript · Tailwind CSS · Zustand（persist/localStorage）· Framer Motion · Vitest · html-to-image · pnpm · Node.js 22

## 快速开始

```bash
git clone https://github.com/hql7-luo/zhejiang-life-simulator.git
cd zhejiang-life-simulator
corepack enable
pnpm install
pnpm dev
```

访问 <http://localhost:3000>。

## 测试与模拟结果

```bash
pnpm lint
pnpm test
pnpm build
pnpm simulate:endings
```

v1.0.0 的发布基线为：ESLint 0 warning / 0 error、70 项测试全部通过、Next.js 生产构建通过并生成 5 个静态路由、1,100 局自动模拟完成且 28/28 个结局均可触发。测试覆盖自动完整玩通、每日挑战判定、经济平衡、重复事件冷却和 localStorage 存档。

## 项目结构

```text
app/                         Next.js 入口与 metadata
components/                  页面、面板与游戏 UI
data/regions/zhejiang/       城市、背景、职业、事件、结局、成就
game/                        种子引擎、条件、效果、经济、迁移、结局
store/                       Zustand 状态与浏览器存档
tests/                       单元、集成、平衡与玩通测试
scripts/simulate-endings.ts  固定种子的结局可达性审计
types/                       公共领域类型
utils/                       格式化与存储工具
```

## 添加事件、职业和结局

- **事件：**在 `data/regions/zhejiang/events/` 的对应城市文件中添加类型完整的事件，通过 `events/index.ts` 导出，并补充条件、效果和来源标签测试。
- **职业：**更新 `JobId` 类型，在 `data/regions/zhejiang/careers.ts` 添加职业，再连接对应事件、产业和结局条件。
- **结局：**在 `data/regions/zhejiang/endings.ts` 添加结局，设置明确优先级和可达条件，补充结局测试后重新运行 `pnpm simulate:endings`。

## 部署

项目已按 Vercel 的 Next.js Framework Preset、pnpm、Node.js 22 和 `main` 生产分支配置，不需要环境变量。可在 Vercel 导入 `hql7-luo/zhejiang-life-simulator`，或在仓库根目录使用 Vercel CLI。

## 存档与 PNG 导出

存档保存在当前浏览器的 `localStorage`，不支持跨设备同步。PNG 结果长图已完成 canvas 高度与浏览器渲染方面的代码级兼容处理；桌面浏览器导出纳入发布验证，真实 iPhone Safari 长图下载仍建议人工实机验证。

## 免责声明与已知简化

所有人物和故事均为虚构。收入、房价、教育、职业、产业与生活事件属于娱乐性简化模拟，不构成财务、职业或人生建议。城市和家庭背景只影响资源与概率，不直接决定成功或失败。

## 后续计划

- 增加事件、区域路线和长期家庭故事。
- 扩大无障碍与真实移动设备浏览器覆盖。
- 在不强制账号体系的前提下支持存档导入导出。

## License

[MIT](LICENSE)
