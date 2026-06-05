# 长方形周长公式推导页 — 实现计划 v2

> **版本:** v2 — 留白 · 一问一停 · 用户节奏  
> **性质:** 对现有 `/tools/rectangle-perimeter-formula` 的 **UX 重构**（非新路由）  
> **Stack:** 不变 — React 19 + SVG + GSAP + `shared/animation`

---

## 0. 变更摘要（相对 v1 已实现页）

| v1（现页） | v2（目标） |
|------------|------------|
| 右侧算式面板 + 长说明 | **删除**；仅底部 **一句**字幕 |
| 双卡片、数字 2 弹出 | **删除**；答案推迟到揭晓步 |
| 6 步圆点 + 上一步/下一步 | **继续** 为主；上一步可选、弱化进度 |
| 自动感强的 stagger 动画 | 描边动画保留；字幕 **淡入淡出 + 停顿** |
| 信息密度高 | **大画布 + 留白**，给孩子思考时间 |

**保留：** SVG 红/绿 L 形 path、GSAP 描边、`math/`、`gsapSafe`、`rectanglePaths`、探索页互链。

**删除/替换组件：** `StepEquationPanel`、`StepNavigator`（重写为 `SubtitleBar` + `LessonControls`）。

---

## 1. 目标

### 1.1 体验目标

- 孩子 **先想**，再被引导；不在思考阶段给答案。
- 每一步 = **一个问题** + **图形变化** + **停住等继续**。
- 最后 **短揭晓** 公式，一行带过数字例。

### 1.2 教学路径（7 步）

| Step | 名称 | 画面 | 字幕（唯一文案） | 用户动作 |
|------|------|------|------------------|----------|
| **0** | 入场 | 空白 → 长方形 + a、b | （无，或极小字「准备好了吗」） | 点 **开始** |
| **1** | 思考① | 同上，静止 | **周长是多少？** | 点 **继续**（无倒计时 MVP） |
| **2** | 红绳 | 红 path 描边：左宽 + 上长 | **红色的长度是多少？** | 继续 |
| **3** | 绿绳 | 绿 path：右宽 + 下长 | **绿色的长度又是多少？** | 继续 |
| **4** | 合成 | 红 + 绿 完整保留 | **红色 + 绿色，是不是就是长方形的周长？** | 继续 |
| **5** | 揭晓 | 四边高亮 | **周长 = (a + b) × 2**（可第二行：例 5+3 → 16） | 继续 |
| **6** | 试玩 | a、b 滑块 | **自己改一改长和宽**（可选） | 链到探索页 |

**不在 Step 1–4 出现：** `b+a`、数字 2、算式推导句。

### 1.3 几何与命名（不变）

- 水平 = **长 a**，竖直 = **宽 b**
- **红：** 左下 → ↑ 左(b) → → 上(a)
- **绿：** 右上 → ↓ 右(b) → ← 下(a)

---

## 2. 设计规格

### 2.1 布局

```
┌──────────────────────────────────────────────┐
│  （极简页眉，可选：仅小字「周长公式」）        │
│                                              │
│                                              │
│            [ SVG 长方形 · 居中 ]              │
│                 大量留白                      │
│                                              │
│                                              │
├──────────────────────────────────────────────┤
│  周长是多少？                    [ 继续 ]    │  ← SubtitleBar
└──────────────────────────────────────────────┘
     ↑ 可选：[ ← 上一步 ]          探索页链接 →
```

- **无** 右侧栏；`max-width` 画布 ~720px 居中。
- 页眉 lead 缩短为一句或删除。
- Mobile：字幕 + 按钮 sticky 底栏；`min-height: 44px` 按钮。

### 2.2 字幕规则

```typescript
// content/subtitles.ts — 每步仅一句
export const SUBTITLES: Record<number, string | null> = {
  0: null,
  1: '周长是多少？',
  2: '红色的长度是多少？',
  3: '绿色的长度又是多少？',
  4: '红色 + 绿色，是不是就是长方形的周长？',
  5: '周长 = (长 + 宽) × 2',
  6: '自己改一改长和宽',
}
```

- Step 5 揭晓可 GSAP 两行 sequential，仍控制在 **≤2 行**。
- `aria-live="polite"` 仅字幕区。

### 2.3 视觉

| Token | 用途 |
|-------|------|
| `--rpf-rope-red` / `--rpf-rope-green` | 保留 |
| `--rpf-subtitle-size` | `clamp(1.25rem, 4vw, 1.75rem)` |
| 背景 | 浅网格或 **纯白/浅底**，减少装饰 gradient |

**留白：** 画布区 `min-height: 50vh`；字幕区固定 ~80px，不抢垂直空间。

### 2.4 交互原则

| 规则 | 实现 |
|------|------|
| 思考步不自动前进 | **无** auto-advance timeline 串联步骤 |
| 继续前不播下一步动画 | `continue()` → `setStep(n+1)` → 再 `buildStepTimeline` |
| 描边只在进入该步时播一次 | step 2/3 各播对应 path |
| 跳过 | 首屏可选「直接看公式」→ step 5 |
| Reduced motion | 跳过描边；字幕仍切换 |

---

## 3. 技术架构（重构）

### 3.1 目录变更

```
rectangle-perimeter-formula/
  content/
    subtitles.ts              # NEW — 替换 stepContent.ts 长文案
  hooks/
    useFormulaLesson.ts       # REFACTOR — phase 驱动，去掉 isAnimating 阻塞连点过度
  animation/
    buildStepTimeline.ts      # REFACTOR — 仅入场/描边/字幕 fade，无卡片
    gsapSafe.ts               # KEEP
    strokePath.ts             # KEEP
  components/
    FormulaRectangleSvg.tsx   # KEEP（微调尺寸居中）
    SubtitleBar.tsx           # NEW — 一句字幕 + 继续/开始
    LessonControls.tsx        # NEW — 上一步、跳过、再玩一次
    DimensionSliders.tsx      # KEEP — 仅 step 6
  pages/
    RectanglePerimeterFormulaPage.tsx  # REFACTOR — 单栏布局
  rectangle-perimeter-formula.css      # REFACTOR — 留白布局

  DELETE:
    StepEquationPanel.tsx
    StepNavigator.tsx
    content/stepContent.ts（合并入 subtitles.ts）
```

### 3.2 状态机

```typescript
type LessonPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6

// useFormulaLesson
{
  phase: LessonPhase
  lengthA, widthB          // 默认 5, 3
  isAnimating: boolean    // 描边进行中时禁用「继续」
  continue: () => void    // phase+1，若 animating 则 noop
  back: () => void
  skipToReveal: () => void // → phase 5
  restart: () => void    // → phase 0
}
```

**关键：** `continue` 仅在 `!isAnimating` 时递增 phase；描边动画 `onComplete` 后 **仍不** 自动 increment — 用户必须再点继续（Step 2/3 描边可在点继续 **时** 播放，或进入 step 即播、播完才可点继续 — **推荐后者**）。

### 3.3 动画时序（每 phase）

| Phase | GSAP |
|-------|------|
| 0 | 矩形 + 标签 fade-in |
| 1 | 字幕 fade-in；**无**图形变化 |
| 2 | 红 path strokeDashoffset；完成后 `isAnimating=false` |
| 3 | 绿 path 同上 |
| 4 | 无新描边；可选四边 pulse 一次 |
| 5 | 字幕换揭晓；可选公式行 fade-in |
| 6 | 无 timeline；React 滑块 |

字幕切换：`SubtitleBar` 内 `key={phase}` + GSAP fade 或 CSS opacity 0.3s。

### 3.4 buildStepTimeline 重构要点

```typescript
// 签名简化
buildStepTimeline({ phase, refs, reducedMotion, onAnimatingChange })

// 删除：ropeCardRed/Green, countTwo, mergedEquation refs
// 删除：Step 4 卡片 stagger
// applyStepVisualState：按 phase 设 path visibility / stroke 终态
```

---

## 4. 组件规格

### 4.1 `SubtitleBar`

Props: `text: string | null`, `primaryLabel: '开始' | '继续' | '再玩一次'`, `onPrimary`, `disabled`, `phase`

- 大字居中问题；按钮右对齐或下方全宽（mobile）。
- phase 0：`text` 空，按钮「开始」。

### 4.2 `LessonControls`

- 「上一步」：phase > 0 显示
- 「直接看公式」：phase ∈ [1,4] 显示
- 底部链接探索页：phase >= 5

### 4.3 `FormulaRectangleSvg`

- 增大 `padding` / 居中；step 0 无 placeholder 长句（或极简「·」）
- path 始终挂载（已 fix null ref）

### 4.4 `RectanglePerimeterFormulaPage`

```tsx
<main className="rpf-page rpf-page--minimal">
  <FormulaRectangleSvg phase={phase} ... />
  <SubtitleBar ... />
  <LessonControls ... />
  {phase === 6 && <DimensionSliders ... />}
</main>
```

---

## 5. 实施阶段

### Phase A — 内容与布局（≈0.5d）

- [ ] 新增 `subtitles.ts`
- [ ] 删除 `StepEquationPanel`、`StepNavigator`
- [ ] 新 `SubtitleBar` + `LessonControls`
- [ ] CSS 单栏留白布局
- [ ] 页面接线，**无动画**可切 7 phase

**验收：** 每 phase 仅一句字幕；点继续逐步前进。

### Phase B — 状态与节奏（≈0.5d）

- [ ] 重构 `useFormulaLesson` → phase + `continue` 门控
- [ ] 描边未完成时禁用继续
- [ ] 上一步 / 跳过 / 再玩一次

**验收：** Step 1 停住不会自动出红绳；必须点继续。

### Phase C — GSAP（≈0.5d）

- [ ] 精简 `buildStepTimeline`（去卡片/算式 panel refs）
- [ ] 字幕 fade
- [ ] phase 切换 kill timeline + `gsapSafe`

**验收：** 无 console GSAP null 警告；红/绿各播一次。

### Phase D — 收尾（≈0.25d）

- [ ] Step 6 滑块 + 探索页链接
- [ ] reduced motion
- [ ] 375px 响应式
- [ ] `npm test` + `npm run build`
- [ ] 更新本文档 v1 归档说明

**Est. total:** 1.75–2.25 天（比重写快，因 SVG/math 可复用）

---

## 6. 测试计划

### 6.1 单元测试

- `perimeterFormula.test.ts` — 不变
- 可选：`subtitles.ts` 每 phase 仅非空字符串 ≤20 字（lint 式测试）

### 6.2 手动验收

- [ ] Phase 1 仅「周长是多少？」，**无**算式
- [ ] Phase 2 红绳播完才可继续
- [ ] Phase 3 绿绳同上，红绳仍在
- [ ] Phase 4 问句为合成问题，**仍无** b+a
- [ ] Phase 5 才出现 `(a+b)×2`
- [ ] 上一步不崩溃、path 状态正确
- [ ] 「直接看公式」→ phase 5
- [ ] 探索页链接可用

---

## 7. 无障碍

- [ ] 字幕区 `aria-live="polite"`
- [ ] 继续按钮：`aria-label="继续下一步"`
- [ ] 红/绿不单靠颜色：字幕含「红色」「绿色」
- [ ] Focus 在继续按钮上便于键盘流

---

## 8. 风险

| 风险 | 对策 |
|------|------|
| 孩子不知道点继续 | Phase 1 继续按钮 subtle pulse **一次**（非 loop） |
| 上一步 path dash 状态乱 | `applyStepVisualState(phase)` 统一重置 |
| v1 用户习惯侧边栏 | 纯替换，路由不变 |

---

## 9. 后续（Out of scope）

- 可选 10s 思考倒计时
- 演示模式自动前进
- 语音朗读字幕

---

*Plan version: 2.0 — 留白、一问一停、手动继续；重构现有 formula 页*
