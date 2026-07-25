# 云启智联 GEO 原始证据分析系统｜项目交接报告

> 本文可直接交给 ChatGPT，用于承接产品规划、技术方案、界面优化或下一阶段开发。

## 1. 项目背景

云启智联希望将面向客户的 GEO（Generative Engine Optimization，生成式搜索/问答优化）复查结果，以可核验的原始证据形式展示出来。

系统的核心不是生成黑盒评分，而是向客户呈现：在豆包、DeepSeek、元宝、Kimi、千问等 AI 平台上，对真实问题进行提问后得到的完整原始回答，以及人工采集时记录的品牌提及、排名和优势判断。客户应能自行阅读原文，确认数据并非仅有汇总结论。

当前交付定位为公开、可分享的演示 Demo，不是生产级多租户 SaaS。

## 2. 当前线上地址与代码仓库

- 演示站点：https://caizj-lg.github.io/yunonline_AI-marketing/
- 客户数据页：https://caizj-lg.github.io/yunonline_AI-marketing/client/
- GitHub 仓库：https://github.com/Caizj-lg/yunonline_AI-marketing
- 本地项目目录：`/Users/zack/Desktop/开发项目/GEO后台管理系统`
- 主分支：`main`

推送至 `main` 后，GitHub Actions 会自动构建并部署 GitHub Pages。

## 3. 已完成的产品范围

### 3.1 品牌与页面

- 官网及系统品牌统一为“云启智联”。
- 提供公开官网、登录页、客户总览页、单条原始证据详情页。
- 客户后台只保留“总览”入口；已移除客户项目名、历史批次模块、右上批次切换及无关浮层。
- 页面采用响应式布局，可在桌面与移动端使用。

### 3.2 登录与访问体验

- 未登录访问客户页时会跳转至登录页。
- 登录页不预填账号、密码，也不在页面展示 Demo 凭据。
- 登录后以浏览器 `localStorage` 保存 Demo 登录标记，支持退出登录。

**重要限制：** 这是 GitHub Pages 静态站点，登录仅用于演示交互，不能保护公开源码或数据，不能被视为真实账号权限系统。

### 3.3 原始证据总览

总览顶部展示三个轻量统计：

1. 采集记录数；
2. 覆盖问题数；
3. 已采集平台数。

AI 问答记录区保留每条原始问答的摘要，并可进入详情页阅读完整回答。支持以下筛选条件：

- 关键词搜索（问题或原始回答内容）；
- 复查记录/采集批次；
- AI 平台；
- 是否提及客户；
- 是否排名前三；
- 客户优势是否明显。

筛选值在用户点击“查询”后才会生效，避免每次修改输入框即刷新列表。

### 3.4 分页

- 每页固定展示 20 条问答记录。
- 查询后自动回到第 1 页。
- 列表底部显示当前记录范围和总数。
- 页码仅展示前 3 页与后 3 页，中间用省略号表示，例如：`1 2 3 … 18 19 20`。
- 保留“上一页 / 下一页”，翻页不会丢失当前查询结果。

### 3.5 原始证据详情页

每条详情页展示：

- 完整问题；
- AI 平台；
- 完整、未改写的 AI 原始回答；
- 采集时间；
- 人工判断：是否提及客户、是否排名前三、是否提及行业品牌；
- 有利与不利关键词；
- 品牌提及顺序。

## 4. 当前数据资产

### 4.1 数据来源

原始来源文件为 `260630六月底复查成效采集数据分析.xlsx`，一期数据已转换并内置到：

`data/demo-evidence.json`

当前前端不再在浏览器中解析 Excel，而是直接读取该 JSON 种子数据。

### 4.2 数据规模与内容

- 400 条采集记录；
- 100 个不同问题；
- 当前实际采集的 4 个平台：豆包、DeepSeek、元宝、Kimi；
- 千问已经在筛选平台目录中预留，数据导入后才会出现其记录；
- 每条记录保留较长的原始回答、采集时间、人工判断、关键词及品牌 1–10 的提及顺序。

### 4.3 单条记录字段

```ts
type DemoEvidence = {
  id: string;
  anaId: number;
  platform: "豆包" | "DeepSeek" | "元宝" | "Kimi" | "千问";
  question: string;
  batchName: string;
  answer: string;
  collectedAt: string;
  mentionedTarget: boolean;
  rankedTopThree: boolean;
  advantageObvious: boolean;
  mentionedIndustryBrand: boolean;
  positiveKeywords: string;
  negativeKeywords: string;
  brands: string[];
};
```

## 5. 技术架构

| 项目 | 当前实现 |
| --- | --- |
| 前端框架 | Next.js 16 + React 19 + TypeScript |
| 样式 | 原生 CSS（`app/globals.css`、`app/overrides.css`） |
| 数据 | 静态 JSON，随站点一起发布 |
| 部署 | GitHub Pages 静态导出 |
| 自动发布 | `.github/workflows/deploy-pages.yml` |
| 测试 | Vitest |
| 构建命令 | `npm run build:pages` |

`next.config.ts` 使用静态导出，并在 GitHub Pages 构建时设置项目路径前缀 `/yunonline_AI-marketing`。

## 6. 代码结构速览

```text
app/
  page.tsx                         官网
  login/page.tsx                   登录页
  client/page.tsx                  客户总览
  client/evidence/[id]/page.tsx    原始问答详情
components/
  evidence-list.tsx                查询、筛选、列表、分页
  login-form.tsx                   Demo 登录表单
  auth-gate.tsx                    浏览器端演示访问门槛
  sidebar.tsx                      后台侧边栏
lib/
  demo-data.ts                     种子数据与平台颜色
  evidence-search.ts               筛选及分页纯函数
  demo-credentials.ts              Demo 凭据校验逻辑
  workbook-parser.ts               Excel 解析骨架
  import-validation.ts             Excel 校验骨架
data/
  demo-evidence.json               400 条公开演示记录
tests/                             数据、登录、导入校验与分页测试
```

## 7. 已存在但未接入 Demo 流程的骨架

仓库中保留了后续生产化可能复用的文件，但当前 GitHub Pages 演示版未启用：

- `prisma/schema.prisma`：数据库模型骨架；
- `lib/workbook-parser.ts`：Excel `Sheet1` 解析；
- `lib/import-validation.ts`：必填列、平台、布尔值、重复 `ana_id` 等校验；
- `components/import-panel.tsx`：导入界面组件；
- `Dockerfile`、`docker-compose.yml`：未来服务器部署起点。

这些内容需要在服务端版本中重新验证和接入，不能认为已构成正式的导入后台。

## 8. 已明确不做或暂缓的范围

- 不做自动提问、平台账号登录、爬虫或外部 AI 平台 API 调用；
- 不做自动生成黑盒 GEO 指数或复杂评分；
- 不做一期报告导出、邮件推送；
- 不做正式客户账号、密码重置、角色权限或多租户隔离；
- 不做真实生产数据的公开 GitHub Pages 托管。

## 9. 当前限制与风险

1. **数据公开**：静态 JSON 会随 GitHub Pages 对外公开，不能放任何客户敏感数据、账号信息或未脱敏问答。
2. **登录不安全**：前端 Demo 登录可被绕过，不具备服务端鉴权能力。
3. **数据更新靠代码发布**：新增批次需要手动转换 JSON、提交代码、重新部署，运营人员无法在页面上传 Excel。
4. **无真实项目隔离**：当前只有一份演示数据，不支持客户各自只看所属项目。
5. **详情页静态生成**：当前 400 条记录适合静态站点；数据量显著增长后需改为数据库查询和服务端分页。
6. **术语注意**：界面中的“提及客户”是通用字段名；真实系统必须在项目配置中定义目标品牌及其别名，不能把某一客户品牌硬编码到通用产品中。

## 10. 建议的下一阶段路线

### 阶段 A：先确定产品与数据规则

1. 明确客户项目模型：客户名称、目标品牌、品牌别名、行业、竞品、可用平台。
2. 明确导入模板和字段字典：哪些字段必填、如何识别“是/否”、重复 `ana_id` 如何处理。
3. 定义发布流程：运营导入 → 校验预览 → 创建批次 → 人工发布 → 客户可见。
4. 定义数据保留原则：源 Excel、原始列、原始回答必须完整保留；任何摘要和分数只能是附加层。

### 阶段 B：建设可用的运营后台

1. 改用带服务端能力的部署方式（轻量云服务器、Vercel + 数据库或其他托管平台），不再使用公开静态 Pages 承载真实客户数据。
2. 接入 PostgreSQL 与对象存储：数据库存结构化记录，对象存储保存原始 Excel。
3. 接入运营人员登录、客户账号、项目归属和角色权限。
4. 将已有 Excel 解析与校验骨架接入上传 API。
5. 支持批次管理、发布/撤回、历史批次和同题原始回答对照。

### 阶段 C：客户交付能力

1. 客户只能看到自己的项目与已发布数据。
2. 保持“原始回答优先”，在详情页或对比页显示完整证据。
3. 增加可控导出：筛选后的原始问答明细、批次说明、人工判断，不导出不该跨客户共享的数据。
4. 在证据充分后，再考虑趋势看板、问题覆盖变化、品牌提及变化；不要先做无法解释的综合评分。

## 11. 交给 ChatGPT 的建议指令

可以将以下内容连同本文一起发送给 ChatGPT：

```text
你是一名资深 B2B SaaS 产品经理和技术架构师。请基于《云启智联 GEO 原始证据分析系统｜项目交接报告》，为这个系统规划从公开静态 Demo 升级到真实多客户系统的下一阶段方案。

要求：
1. 坚持“原始 AI 问答证据优先”，不要用黑盒评分替代原文；
2. 目标用户包括云启智联运营人员、客户管理员和客户查看者；
3. 数据通过 Excel 导入，不做自动提问、爬虫或第三方 AI 平台账号自动化；
4. 输出内容包括：产品信息架构、用户角色与权限、数据模型、Excel 导入/校验/发布流程、关键页面清单、API 清单、技术架构建议、MVP 优先级、风险与验收标准；
5. 先提出必要的澄清问题，再给出推荐方案；
6. 不要假设 GitHub Pages 的 Demo 登录能用于正式生产环境。
```

## 12. 本地验证命令

```bash
npm test
npm run build:pages
```

截至本报告编写时，自动测试包含数据完整性、登录凭据、Excel 解析与校验、筛选分页等共 9 项；GitHub Pages 静态构建可通过。
