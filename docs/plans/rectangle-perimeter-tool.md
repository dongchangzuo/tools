# 长方形周长探索工具 — 实现计划

> **Feature:** 给定周长，探索所有整数长×宽组合  
> **交互:** 左上角定点，拖动改变长/宽（半周长约束），GSAP 动画  
> **Stack:** React 19 + Vite + TypeScript + SVG + GSAP  
> **Route:** `/tools/rectangle-perimeter`

---

## 1. 目标与范围

### 1.1 用户目标（小学生）

- 理解：**周长定了，长变长则宽变短**
- 操作：拖一拖长方形，看数字和形状一起变
- 发现：一共有几种「长 + 宽 = 半周长」的整数答案

### 1.2 MVP 功能

| 包含 | 不包含（后续） |
|------|----------------|
| 选择周长（预设 + 自定义偶数） | 练习/计分模式 |
| SVG 矩形 + 定点左上 + 拖右下角 | 动点轨迹线 |
| 长 + 宽 = 半周长 公式区 | 小数/分数边长 |
| 松手吸附整数解（GSAP） | GSAP Draggable 插件 |
| 答案列表 + 「逐个演示」Timeline | 后端 API |
| 半周长分割条（与矩形联动） | 面积/格子 |

### 1.3 数学规则

```typescript
// half = perimeter / 2，要求 perimeter 为偶数且 ≥ 4
// 整数边，长 + 宽 = half
// length ∈ [1, half-1]，width = half - length
pairs = [{ length: 1, width: half-1 }, …, { length: half-1, width: 1 }]
// 共 half - 1 组（例：周长 20 → 9 组，不是 5 组）
```

### 1.4 边长命名约定（已确认）

| 边 | 定义 | SVG |
|----|------|-----|
| **长** | 永远是**水平边**（顶/底） | `rect` 的 `width` |
| **宽** | 永远是**竖直边**（左/右） | `rect` 的 `height` |

- **不按数值大小**交换名称：长 3 宽 7 与 长 7 宽 3 是两种不同长方形，**都保留**在答案列表中。
- 拖动：改水平 extent → 长变；宽 = 半周长 − 长（竖直边相应缩短/变长）。
- 文案统一：**「上面的数 = 长，旁边的数 = 宽」**，与图形方向一致，避免小孩混淆。

---

## 2. 设计方向

### 2.1 Frontend Design — 美学定位

**Purpose:** 数学探索玩具，不是题库页面。  
**Tone:** **Playful-refined** — 活泼但不幼稚，与数韵「思考阶梯」气质一致。  
**Differentiation:** 「钉住的角 + 双色绳边」作为视觉记忆点。

**原则（frontend-design skill）:**

- 不引入 Generic AI 审美（紫渐变、Inter、千篇一律卡片）
- **延续数韵现有 teal 品牌**（`tokens.css`），工具页做「稍暖、稍大」变体，而非换整套 indigo 童书风
- 一个高 impact 时刻：**松手吸附**时的轻微回弹 + 列表项亮起
- 背景：浅网格或柔和 paper texture（CSS），呼应几何题

### 2.2 UI/UX Pro Max — 设计系统（已生成，经项目适配）

| 维度 | 推荐 | 数韵适配 |
|------|------|----------|
| Pattern | Immersive / Interactive | 主区域大画布，控件在侧/下 |
| Style | Micro-interactions | 拖动反馈、吸附、列表 stagger |
| 童书字体 Baloo 2 | 可选 | **MVP 沿用 Cinzel + Josefin Sans**，仅数字区略加大 |
| 触控 | ≥44px 拖手柄 | `r=22` 透明 hit area |
| 动画 | 150–300ms 微交互；吸附 350–450ms | GSAP `power2.out` / `back.out(1.2)` |
| Reduced motion | 必须 | `shared/animation` 统一处理 |
| 反模式 | 复杂 onboarding、无限 bounce | 首屏一句提示即可 |

### 2.3 页面布局（Desktop / Mobile）

```
┌─────────────────────────────────────────────┐
│  [站点 Header — 现有 AppLayout]              │
├─────────────────────────────────────────────┤
│  标题 + 一句引导「拖一拖，周长不会变」        │
│  ┌──────────────────┐  ┌─────────────────┐ │
│  │ 半周长条          │  │ 答案列表         │ │
│  │ [长|宽] = 10      │  │ ○ 长1 宽9       │ │
│  ├──────────────────┤  │ ○ 长2 宽8       │ │
│  │                  │  │ ● 长3 宽7 ←当前 │ │
│  │                  │  │ … 长9 宽1       │ │
│  │   SVG 矩形场景    │  │ …               │ │
│  │   ●固定  ○拖动手柄│  │ [逐个演示]      │ │
│  │                  │  └─────────────────┘ │
│  └──────────────────┘                       │
│  周长选择: [12][16][20][24]  自定义: [__]   │
└─────────────────────────────────────────────┘

Mobile: 场景全宽在上，列表与控件折叠在下方；`overscroll-behavior: contain`
```

### 2.4 色彩与组件（CSS 变量）

在 `rectangle-perimeter.css` 中扩展，不修改全局 tokens：

| Token | 用途 |
|-------|------|
| `--rp-rope-length` | 水平边 / 长（accent-2 / teal） |
| `--rp-rope-width` | 竖直边 / 宽（accent / blue） |
| `--rp-anchor` | 固定角（brand 实心） |
| `--rp-handle` | 拖动手柄（accent-3 + focus ring） |
| `--rp-surface` | 画布区 `--surface` + 浅网格 |

---

## 3. 技术架构

### 3.1 依赖

```bash
npm install gsap @gsap/react
```

### 3.2 目录结构

```
src/
  shared/animation/
    gsapDefaults.ts          # duration, ease, reducedMotion
    usePrefersReducedMotion.ts
  features/tools/rectangle-perimeter/
    math/
      pairsFromPerimeter.ts
      snapLength.ts
      validatePerimeter.ts
    math/pairsFromPerimeter.test.ts
    hooks/
      usePerimeterExplorer.ts
    animation/
      useRectangleScene.ts   # useGSAP + refs
      buildDemoTimeline.ts
      animateSnap.ts
    components/
      RectangleScene.tsx     # SVG
      HalfPerimeterBar.tsx
      SolutionList.tsx
      PerimeterControls.tsx
      FormulaDisplay.tsx
    pages/
      RectanglePerimeterPage.tsx
    rectangle-perimeter.css
```

### 3.3 数据流

```
PerimeterControls → setPerimeter(P)
       ↓
usePerimeterExplorer
  - half, pairs[], currentLength, currentWidth (derived)
  - setLength(L) — clamp + snap on release
       ↓
RectangleScene / HalfPerimeterBar / SolutionList (React render)
       ↓
GSAP (refs only) — snap, demo timeline, number tween
```

**React 拥有真相；GSAP 只负责运动。**

### 3.4 GSAP 集成规范（项目级 Skill 约定）

> 仓库内无独立 gsap skill，以下作为 `shared/animation` 标准，供本工具及后续工具继承。

1. **注册一次**

```typescript
// gsapDefaults.ts
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
gsap.registerPlugin(useGSAP)
```

2. **useGSAP + scope**

```typescript
useGSAP(() => {
  // animations
}, { scope: containerRef, dependencies: [length, width] })
```

3. **拖动 vs 动画**

| 阶段 | 实现 |
|------|------|
| pointermove | React state 更新 length（连续值），`gsap.set` 或直接改 SVG attr |
| pointerup | `snapLength` → `animateSnap()` |
| 演示模式 | `buildDemoTimeline` kill 上一个 timeline |

4. **Tween 目标**

- 优先 tween SVG 属性：`width`, `height`, `x2`, `y2`（线）
- 数字：`gsap.to(obj, { length: target, snap: { length: 1 }, onUpdate })`
- 避免 tween 触发布局 reflow 的 CSS `width` on block 元素

5. **Timeline 演示**

```typescript
tl.to(rect, { attr: { width, height }, duration: 0.45, ease: 'power2.inOut' })
  .to(barSegments, { /* 同步 */ }, '<')
  .add(() => setHighlightIndex(i), '+=0.5')
```

6. **清理**

- 组件 unmount：`timeline.kill()`；useGSAP context 自动 revert
- 切换周长：kill 活跃 timeline + 重置 state

7. **Reduced motion**

```typescript
const duration = reducedMotion ? 0.01 : 0.4
const ease = reducedMotion ? 'none' : 'back.out(1.2)'
```

8. **不用 Club 插件**

- 拖动：Pointer Events + 自写 `clientX → length`
- 不用 Draggable / MorphSVG（除非后续购授权）

---

## 4. 组件规格

### 4.1 `pairsFromPerimeter(perimeter: number)`

- 输入非法（奇数、<4、非整数）→ `[]` + UI 提示
- 输出 `{ length, width }[]`，`length` 从 1 到 `half-1` 递增（对应水平边从短到长）

### 4.2 `usePerimeterExplorer`

State:

- `perimeter: number`（默认 20）
- `length: number`（当前**水平边**长，可连续）
- `isDragging: boolean`
- `demoPlaying: boolean`

Derived:

- `half`, `width = half - length`, `pairs`, `activeIndex`

Actions:

- `setPerimeter`, `beginDrag`, `updateLengthFromPointer`, `endDrag`（snap）, `goToPair(index)`, `playDemo()`, `stopDemo()`

### 4.3 `RectangleScene` (SVG)

Elements:

- `#anchor` — 左上角圆点（aria-hidden 装饰）
- `#rect-fill` — 半透明填充
- `#edge-h` — 水平绳边（**长**，teal）
- `#edge-v` — 竖直绳边（**宽**，blue）
- `#handle` — 右下角，`role="slider"`, `aria-valuemin=1`, `aria-valuemax=half-1`, `aria-valuenow=length`
- `#label-length` — 贴在水平边旁；`#label-width` — 贴在竖直边旁

坐标系：

- 定点 `(padding, padding)` = 左上角
- 水平 display：`length * cellSize` → SVG `width`
- 竖直 display：`width * cellSize` → SVG `height`（注意：state 里 `width` 指竖直边「宽」）
- `cellSize` 动态：`min(40, available / max(length, verticalWidth))`

**不绘制**轨迹线、辅助斜线。

### 4.4 `HalfPerimeterBar`

- 水平条总长 = `half * unit`
- 左段 = **长**（水平），右段 = **宽**（竖直）；与矩形边一一对应，非数值大小
- GSAP 与矩形同一 timeline 同步

### 4.5 `SolutionList`

- 展示所有 pairs
- 点击某项 → `goToPair(i)` + GSAP snap
- 当前项：`aria-current="true"` + 视觉高亮
- 列表项 min-height 44px

### 4.6 `PerimeterControls`

- Chip 按钮：12, 16, 20, 24
- 数字输入：仅偶数 ≥4
- 切换周长时 reset `length` 到 `pairs[0].length`（即 1，最扁/start 态）

---

## 5. 路由与入口

### 5.1 `App.tsx`

```typescript
const RectanglePerimeterPage = lazy(() =>
  import('./features/tools/rectangle-perimeter/pages/RectanglePerimeterPage')
    .then(m => ({ default: m.RectanglePerimeterPage }))
)
// Route: path="tools/rectangle-perimeter"
```

### 5.2 首页入口（可选 MVP）

- `HomePage` 增加「周长探索」按钮 → navigate

---

## 6. 实施阶段

### Phase 0 — 基础设施（≈0.5d）

- [ ] `npm install gsap @gsap/react`
- [ ] `shared/animation/gsapDefaults.ts`
- [ ] `shared/animation/usePrefersReducedMotion.ts`
- [ ] Vitest 可运行

### Phase 1 — 数学层（≈0.5d）

- [ ] `pairsFromPerimeter.ts` + tests（周长 4, 12, 20, 奇数, 0）
- [ ] `snapLength.ts` + tests
- [ ] `validatePerimeter.ts`

**验收:** `npm test` 全绿

### Phase 2 — 状态与静态 UI（≈1d）

- [ ] `usePerimeterExplorer`
- [ ] `RectanglePerimeterPage` 布局 + CSS（无动画）
- [ ] SVG 静态矩形随 state 更新
- [ ] `PerimeterControls`, `FormulaDisplay`, `SolutionList`
- [ ] 路由注册

**验收:** 选手势/列表可切换 length，数字正确，无 GSAP

### Phase 3 — 拖动（≈1d）

- [ ] Pointer events on handle（touch + mouse）
- [ ] 拖动中 length 连续变化，width = half - length
- [ ] 边界 clamp：`length ∈ [1, half-1]`，`width = half - length`（恒 ≥ 1）
- [ ] 44px+ touch target, focus ring, keyboard ←/→ 调 length

**验收:** 手机 Safari / Chrome 拖动流畅；无轨迹线

### Phase 4 — GSAP 动画（≈1d）

- [ ] `animateSnap` — 松手吸附 + 边与数字 tween
- [ ] `HalfPerimeterBar` 联动
- [ ] `buildDemoTimeline` — 逐个演示 + 列表高亮
- [ ] reduced motion 分支
- [ ] 切换周长 / unmount 清理 timeline

**验收:** 演示模式完整播一遍；无 console 警告；kill 无泄漏

### Phase 5 — 打磨（≈0.5d）

- [ ] 首屏引导 copy
- [ ] 三主题（default / warm / tech）下对比度检查
- [ ] `npm run build` + lint
- [ ] 首页入口链接

---

## 7. 测试计划

### 7.1 单元测试（Vitest）

| 用例 | 输入 | 期望 |
|------|------|------|
| 基本 | P=20 | 9 组，(1,9)…(9,1) |
| 最小 | P=4 | 1 组 (1,1) |
| 奇数周长 | P=15 | [] |
| snap | half=10, raw=3.7 | length=4, width=6 |
| snap 边界 | raw=0.2 | length=1, width=9 |

### 7.2 手动验收

- [ ] 周长 20：拖至松手，每次吸附到整数解
- [ ] 公式区：长 + 宽 恒等于 10
- [ ] 「逐个演示」：9 组依次播放（P=20），可中途停止
- [ ] 375px 宽：无横向滚动，手柄可点
- [ ] `prefers-reduced-motion: reduce`：动画几乎瞬时
- [ ] Tab 聚焦手柄，方向键可改 length
- [ ] 三主题切换无不可读文字

---

## 8. 无障碍清单（UI/UX Pro Max）

- [ ] 拖手柄：`role="slider"` + aria 值
- [ ] 答案列表：`role="listbox"` 或 button 列表
- [ ] 颜色非唯一指示（当前项有 border + 图标）
- [ ] Focus visible on 所有 control
- [ ] 装饰 SVG `aria-hidden="true"`

---

## 9. 风险与对策

| 风险 | 对策 |
|------|------|
| GSAP 与 React state 打架 | 拖动时 state 驱动；GSAP 仅 snap/demo |
| SVG attr tween 兼容性 | 用 `AttrPlugin` 默认能力；fallback 改 transform |
| 小孩猛拖出界 | clamp + 松手 snap |
| 性能 | 单场景；无 rAF 无限循环 |
| 字体/load | 不新增 Google Font，用现有 |

---

## 10. 后续扩展（Out of scope）

- 练习模式：先猜数量再揭示
- 面积对比：「哪种最胖」
- 工具列表页 `/tools`
- 提取 `shared/animation/RopeRect` 复用组件

---

## 11. 执行顺序摘要

```
Phase 0 → Phase 1 (test) → Phase 2 (static) → Phase 3 (drag) → Phase 4 (GSAP) → Phase 5 (polish)
```

**Est. total:** 3.5–4.5 天

---

*Plan version: 1.1 — 水平边恒为长、竖直边恒为宽（已确认）；答案不去重*
