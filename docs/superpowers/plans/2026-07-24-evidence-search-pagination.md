# AI 问答记录查询与分页 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让 AI 问答记录在点击查询后才筛选，并以每页 20 条的方式分页呈现。

**Architecture:** 将纯筛选与分页计算提取到 `lib/evidence-search.ts`，使其可由 Vitest 验证。`EvidenceList` 保持待提交筛选状态和已提交筛选状态，调用该纯函数产生当前页记录。

**Tech Stack:** Next.js 16、React 19、TypeScript、Vitest、静态 GitHub Pages。

## Global Constraints

- 每页精确展示 20 条记录。
- 仅点击“查询”才提交筛选条件，提交后回到第 1 页。
- 不修改原始 400 条数据、详情页、登录或部署模型。

---

### Task 1: 筛选与分页纯函数

**Files:**
- Create: `lib/evidence-search.ts`
- Create: `tests/evidence-search.test.ts`

**Interfaces:**
- Produces: `searchEvidence(records, filters, page, pageSize)`，返回 `{ rows, total, totalPages, page }`。

- [ ] **Step 1: Write the failing test** — 验证 400 条记录在第 1 页返回 20 条、总计 400 条和 20 页。
- [ ] **Step 2: Run test to verify it fails** — `npm test -- tests/evidence-search.test.ts`，预期模块不存在而失败。
- [ ] **Step 3: Write minimal implementation** — 过滤提交条件，计算安全页码并以 `slice` 返回当页。
- [ ] **Step 4: Run test to verify it passes** — `npm test -- tests/evidence-search.test.ts`，预期通过。

### Task 2: 查询提交与分页界面

**Files:**
- Modify: `components/evidence-list.tsx`
- Modify: `app/overrides.css`
- Test: `tests/evidence-search.test.ts`

**Interfaces:**
- Consumes: `searchEvidence(records, submittedFilters, page, 20)`。
- Produces: 查询按钮与分页控件，列表只渲染当前页 `rows`。

- [ ] **Step 1: Write the failing test** — 验证筛选结果的最后一页和页码边界。
- [ ] **Step 2: Run test to verify it fails** — `npm test -- tests/evidence-search.test.ts`。
- [ ] **Step 3: Write minimal implementation** — 将筛选状态拆分为草稿和已提交条件；查询时重置为第 1 页；翻页只更新页码。
- [ ] **Step 4: Run test to verify it passes** — `npm test -- tests/evidence-search.test.ts`。

### Task 3: 完整验证与发布

**Files:**
- Modify: `docs/superpowers/specs/2026-07-24-evidence-search-pagination-design.md`
- Modify: `docs/superpowers/plans/2026-07-24-evidence-search-pagination.md`

- [ ] **Step 1: Run automated tests** — `npm test`，预期所有测试通过。
- [ ] **Step 2: Build GitHub Pages output** — `npm run build:pages`，预期静态导出成功。
- [ ] **Step 3: Commit and push** — 提交上述文件和实现，推送至 `origin/main`。
