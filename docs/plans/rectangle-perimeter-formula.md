# 长方形周长公式推导页 — 实现计划

> **Feature:** 用红/绿两色「绳」推导周长公式 `(长 + 宽) × 2`  
> **交互:** 6 步分镜动画 + 上一步/下一步；Step 6 起可调 a、b  
> **Stack:** React 19 + Vite + TypeScript + SVG + GSAP（复用 `shared/animation`）  
> **Route:** `/tools/rectangle-perimeter-formula`

---

## 1. 目标与范围

### 1.1 用户目标（小学生）

- 理解：**周长不是四个数乱加，而是两条一样长的「绳」**
- 看见：红绳 = 左宽 + 上长；绿绳 = 右宽 + 下长；每条都是 **宽 + 长**
- 得出：**2 条这样的绳 → 周长 = (长 + 宽) × 2**

### 1.2 与「周长探索」页的分工

| 页面 | 路由 | 核心问题 |
|------|------|----------|
| **公式推导（本页）** | `/tools/rectangle-perimeter-formula` | 周长**怎么算**？ |
| **周长探索（已有）** | `/tools/rectangle-perimeter` | 周长**固定**时，有多少种长宽？ |

两页互链：公式页结尾 →「去试试：周长 20 有几种？」；探索页可加 →「还没懂公式？先看推导」。

### 1.3 MVP 功能

| 包含 | 不包含（后续） |
|------|----------------|
| 6 步 GSAP 分镜 + 步骤导航 | 语音旁白 |
| SVG 长方形 + 红/绿 L 形描边动画 | 字母代数证明 |
| 算式区随步骤更新 | 练习题/计分 |
| Step 6：a、b 滑块实时联动 | 分数/小数边长 |
| `prefers-reduced-motion` | GSAP Draggable |
| 跳转周长探索页 | 后端 API |

### 1.4 边长命名（与全站一致）

| 符号 | 含义 | 方向 |
|------|------|------|
| **a** / **长** | 水平边 | 上、下 |
| **b** / **宽** | 竖直边 | 左、右 |

**颜色分组（教学定义，非探索页绳色）：**

```
        ←—— 长 a ——→
    ●━━━━━━━━━━━━━━━●
    ┃ 红(左宽 b)      ┃ 绿(右宽 b)
    ┃                 ┃
    ●━━━━━━━━━━━━━━━●
        ←—— 长 a ——→
         绿(下长 a)
```

| 颜色 | 路径（动画顺序） | 长度 |
|------|------------------|------|
| **红** | 左下角 → ↑ 左边(b) → → 上边(a) | **b + a** |
| **绿** | 右上角 → ↓ 右边(b) → ← 下边(a) | **b + a** |

**周长：** `(a + b) + (a + b) = (a + b) × 2`

---

## 2. 设计方向

### 2.1 Frontend Design — 美学定位

**Purpose:** 公式「拆给你看」，不是背公式。  
**Tone:** **Playful-refined**，与数韵、周长探索页同一 family。  
**Differentiation:** 红/绿两条 L 形绳依次「走」完，再并成公式——一步一个顿悟。

- 延续 `tokens.css` teal 品牌；红/绿用**品牌衍生色**（非纯 #f00/#0f0），保证对比度 ≥ 4.5:1
- 高 impact 时刻：**Step 4** 两条 `(b+a)` 并排 + 数字 **2** 弹出
- 背景：浅网格（与探索页 `rp-scene` 一致）

### 2.2 UI/UX Pro Max 要点

| 规则 | 应用 |
|------|------|
| Touch ≥44px | 上一步/下一步/开始按钮 |
| 不依赖 hover | 主流程用 click/tap |
| Reduced motion | 跳过描边，直接显示终态 |
| 无 emoji 图标 | SVG chevron 箭头 |
| Skip | 首屏「跳到公式」或 Step 6 |

### 2.3 页面布局

```
┌─────────────────────────────────────────────┐
│  [AppLayout Header]                          │
├─────────────────────────────────────────────┤
│  标题 + 「两种颜色的绳，围出周长」           │
│  ┌────────────────────┐  ┌─────────────────┐│
│  │  SVG 长方形         │  │ 步骤说明 + 算式  ││
│  │  红/绿 path 描边    │  │ （随 step 变）   ││
│  │  边标注 a、b        │  └─────────────────┘│
│  └────────────────────┘                      │
│  ●○○○○○  Step 1/6    [上一步] [下一步]       │
│  （Step 6）长 a [━━●━━]  宽 b [━━●━━]         │
│  [去试试：周长探索 →]                         │
└─────────────────────────────────────────────┘

Mobile: SVG 全宽在上，算式与控制在下；步骤点横向滚动
```

### 2.4 CSS 变量（`rectangle-perimeter-formula.css`）

| Token | 用途 |
|-------|------|
| `--rpf-rope-red` | 红绳：左宽 + 上长（如 `#e11d48` / rose-600，或 `--accent` 暖变体） |
| `--rpf-rope-green` | 绿绳：右宽 + 下长（如 `--accent-3` / `#059669`） |
| `--rpf-edge-idle` | 未激活边：浅灰 |
| `--rpf-surface` | 画布区背景 |
| `--rpf-grid-stroke` | 网格线 |

---

## 3. 动画分镜规格（6 Steps）

状态机：`step ∈ 0..5`（或 1..6 对外显示）。每步进入时跑对应 GSAP timeline；离开或切步时 `timeline.kill()`。

| Step | 名称 | 画面 | 算式区文案 | 动画（GSAP） |
|------|------|------|------------|--------------|
| **0** | 开场 | 空画布 + 标题 | 「长方形的周长是怎么来的？」 | 标题 fade-in；按钮「开始」 |
| **1** | 长方形 | 灰色四边 + 标 a、b | 「上面是长 a，旁边是宽 b」 | 矩形 + 标签 stagger in |
| **2** | 红绳 | 红：左+上；其余灰 | 「红绳 = 宽 b + 长 a = b + a」 | 红 path `strokeDashoffset` 0→100%，先竖后横 |
| **3** | 绿绳 | 红保留 + 绿：右+下 | 「绿绳 = 宽 b + 长 a = b + a」 | 绿 path 同上，从右上起 |
| **4** | 两条绳 | 下方浮出两个 `(b+a)` 块 | 「一样的绳，有 **2** 条！」 | 两卡片 translateY + scale；数字 2 pop |
| **5** | 公式 | 四边高亮 | `周长 = (a+b)+(a+b) = (a+b)×2` | 算式合并一行；可选周长数值 `(a+b)×2` |
| **6*** | 互动 | 同 Step 5，a/b 可调 | 公式数字实时变 | 重算 path + 标签；无分步动画 |

\* Step 6 为 MVP 可选：若工期紧，MVP 做到 Step 5 + 固定 a=5,b=3；Step 6 放第二版。

**Reduced motion：** Step 2–3 跳过描边，直接 `strokeDashoffset=0` 显示完整红/绿边。

---

## 4. 技术架构

### 4.1 依赖

无新增依赖，复用已有 `gsap`、`@gsap/react`。

### 4.2 目录结构

```
src/features/tools/rectangle-perimeter-formula/
  math/
    perimeterFormula.ts       # (a+b)*2, clamp a/b
  hooks/
    useFormulaLesson.ts       # step, a, b, next/prev/goTo
  animation/
    buildStepTimeline.ts      # 按 step 返回 timeline 工厂
    strokePath.ts             # dasharray 长度、path 工具
  components/
    FormulaRectangleSvg.tsx   # SVG paths + labels
    StepEquationPanel.tsx     # 右侧算式/说明
    StepNavigator.tsx         # 圆点 + 上一步/下一步
    DimensionSliders.tsx      # Step 6: a, b 滑块
  pages/
    RectanglePerimeterFormulaPage.tsx
  rectangle-perimeter-formula.css
```

### 4.3 SVG Path 设计

定点左上角 `(ox, oy)`，display 尺寸 `aPx = a * unit`, `bPx = b * unit`：

```typescript
// 红绳：左下 → 左上 → 右上
const redPath = `M ${ox} ${oy + bPx} L ${ox} ${oy} L ${ox + aPx} ${oy}`

// 绿绳：右上 → 右下 → 左下
const greenPath = `M ${ox + aPx} ${oy} L ${ox + aPx} ${oy + bPx} L ${ox} ${oy + bPx}`

// 灰边（Step 1）：四边独立 line 或完整 rect stroke
```

描边动画：

```typescript
const len = path.getTotalLength()
gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
gsap.to(path, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' })
```

**L 形两段顺序：** 单 path 含两段时一次 tween 即可；若需「先竖后横」，用两个 sub-path 或 `timeline` 接两段 line。

### 4.4 数据流

```
StepNavigator → useFormulaLesson.setStep(n)
       ↓
buildStepTimeline(n, refs, { a, b, reducedMotion })
       ↓
FormulaRectangleSvg refs + StepEquationPanel copy
```

**React 管：** step、a、b、文案 key。  
**GSAP 管：** 进入某 step 时的描边/算式/卡片动画。  
**Step 6 / 改 a、b：** 仅 React 重绘 SVG，不跑分步 timeline。

### 4.5 复用

| 模块 | 来源 |
|------|------|
| `usePrefersReducedMotion` | `shared/animation` |
| `gsapDuration`, `gsap`, `useGSAP` | `shared/animation/gsapDefaults` |
| 网格背景 pattern | 参考 `RectangleScene` |
| 页面壳、按钮 `.rp-btn` | 可抽 `shared/tools/tools.css` 或复制精简版 |

---

## 5. 组件规格

### 5.1 `perimeterFormula.ts`

```typescript
export function perimeter(a: number, b: number): number {
  return (a + b) * 2
}

export function clampDimension(value: number, min = 2, max = 12): number {
  return Math.min(max, Math.max(min, Math.round(value)))
}
```

MVP 默认 `a = 5`, `b = 3`（周长 16，好口算）。

### 5.2 `useFormulaLesson`

State:

- `step: number`（0–5，或 0–6 含互动）
- `lengthA: number`（长，默认 5）
- `widthB: number`（宽，默认 3）
- `isAnimating: boolean`

Actions:

- `nextStep`, `prevStep`, `goToStep(n)`, `skipToEnd()`
- `setLengthA`, `setWidthB`（仅 step ≥ 5 或 6 启用）
- `playStepAnimation()` — 调 `buildStepTimeline`

Derived:

- `perimeter`, `halfSum: a + b`
- `stepContent` — 算式 panel 的 key/copy

### 5.3 `FormulaRectangleSvg`

Props: `a`, `b`, `step`, `unit`, `reducedMotion`

Layers:

1. 网格底
2. 灰色 idle 四边（step ≥ 1）
3. 红 path（step ≥ 2，dash 随动画）
4. 绿 path（step ≥ 3）
5. 边标签：`长 a`、`宽 b`（step ≥ 1）
6. Step 4：可选 ghost 卡片（两条 `(b+a)`）— 或用 HTML  overlay 更易排版

Refs 暴露：`redPath`, `greenPath`, `equationCards`（若在 SVG 外则 panel 内）

### 5.4 `StepEquationPanel`

- 根据 `step` 渲染文案 + 算式（React）
- Step 4–5：算式用 `tabular-nums`
- `aria-live="polite"` 更新步骤说明

### 5.5 `StepNavigator`

- 步骤圆点 `role="tablist"`，当前 `aria-selected`
- 「上一步」「下一步」；第一步隐藏上一步；最后一步显示「再玩一次」或进入 Step 6
- 「跳到公式」：`skipToEnd()` → step 5 + reduced 动画

### 5.6 `DimensionSliders`（Step 6 / v1.1）

- `input type="range"` min=2 max=12
- 改 a/b 时 kill 活跃 timeline，直接更新 SVG

---

## 6. 路由与入口

### 6.1 `App.tsx`

```typescript
const RectanglePerimeterFormulaPage = lazy(() =>
  import('./features/tools/rectangle-perimeter-formula/pages/RectanglePerimeterFormulaPage')
    .then(m => ({ default: m.RectanglePerimeterFormulaPage }))
)
// Route: path="tools/rectangle-perimeter-formula"
```

### 6.2 入口

- `HomePage`：「公式推导」按钮（与「周长探索」并列）
- `RectanglePerimeterPage` 页脚/侧栏：链到公式页
- `RectanglePerimeterFormulaPage` 底部：链到探索页

---

## 7. 实施阶段

### Phase 0 — 脚手架（≈0.25d）

- [ ] 目录 + 空页面 + CSS 变量
- [ ] 路由注册
- [ ] 从探索页复制按钮/布局模式

### Phase 1 — 静态 SVG + 步骤 UI（≈0.75d）

- [ ] `FormulaRectangleSvg` 静态：a=5,b=3，灰框 + 红绿 path 终态
- [ ] `StepEquationPanel` + `StepNavigator` + `useFormulaLesson`（无 GSAP）
- [ ] 切 step 切换文案与 path visibility（无动画）

**验收：** 6 步可点，终态图形正确

### Phase 2 — GSAP 分镜（≈1d）

- [ ] `strokePath` 工具 + `buildStepTimeline`
- [ ] Step 1 入场 stagger
- [ ] Step 2–3 红/绿描边
- [ ] Step 4 双卡 + 数字 2
- [ ] Step 5 公式合并
- [ ] reduced motion 分支；切步 kill timeline

**验收：** 自动播一遍 0→5 逻辑正确，无泄漏

### Phase 3 — 互动与互链（≈0.5d）

- [ ] `DimensionSliders`（或 MVP 固定 a,b）
- [ ] 首页 + 两工具页互链
- [ ] `perimeterFormula.ts` + 可选单测

### Phase 4 — 打磨（≈0.25d）

- [ ] 375px 响应式
- [ ] 三主题对比度
- [ ] `npm run build` + `npm test`

**Est. total:** 2–2.75 天

---

## 8. 测试计划

### 8.1 单元测试（Vitest）

| 用例 | 期望 |
|------|------|
| `perimeter(5,3)` | 16 |
| `perimeter(4,4)` | 16 |
| `clampDimension(1)` | 2 |
| `clampDimension(99)` | 12 |

### 8.2 手动验收

- [ ] Step 2：红绳只走左+上，算式 b+a
- [ ] Step 3：绿绳只走右+下，红仍可见
- [ ] Step 4：明确看出「2 条」
- [ ] Step 5：`(a+b)×2` 与 5+3 例子数值 16 一致
- [ ] 上一步/下一步不卡死；快速连点不叠 timeline
- [ ] reduced motion：几乎无描边动画
- [ ] 链到 `/tools/rectangle-perimeter` 可用

---

## 9. 无障碍

- [ ] 步骤 tab 可键盘切换
- [ ] 算式区 `aria-live="polite"`
- [ ] 颜色 + 文字双重编码（「红绳」「绿绳」不单靠色）
- [ ] 装饰 SVG `aria-hidden="true"`

---

## 10. 风险与对策

| 风险 | 对策 |
|------|------|
| 红/绿与探索页绳色语义冲突 | 公式页图例写清「左+上=红」；探索页不改 |
| path 改 a/b 后 dash 长度变 | Step 6 不用 dash 动画，直接完整 stroke |
| 步骤动画与手动切步冲突 | 切步 `kill()` + 重置 dash 到该步终态 |
| 小孩跳过推导 | 提供「跳到公式」 |

---

## 11. 后续扩展

- 口算练习：给 a、b 问周长
- 与探索页共用「工具首页」`/tools`
- 导出 `buildStepTimeline` 模式为 `shared/animation/lessonTimeline.ts`

---

*Plan version: 1.0 — 红/绿 L 形绳推导 `(a+b)×2`；边名与探索页一致（水平=长）*
