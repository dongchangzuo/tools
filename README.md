# tools

基于 React 的数学益智小游戏集合（**等式天平**、**等量代换**），并包含通用算术表达式求值库。单一 Vite 项目，通过路由切换游戏。

## 路由

| 路径 | 游戏 |
|------|------|
| `/` | 首页（选择游戏） |
| `/balance` | 数学等式天平 |
| `/substitution` | 等量代换 · 演示 1（△ = ○） |
| `/substitution/2` | 等量代换 · 演示 2（△ + △ = ○） |
| `/substitution/3` | 等量代换 · 演示 3（△ + ○ = 15，输入数字答案） |
| `/test/apple` | Apple Canvas 组件测试（开发） |
| `/test/shapes` | 立体几何 Canvas 组件测试（开发） |
| `/test/balance-hook` | 3D 挂钩天平 Canvas 组件测试（开发） |

```bash
npm run dev
```

浏览器打开 Vite 提示的地址（通常 `http://localhost:5173`）。

## 等式天平

- **Canvas 写实天平**：厚实木纹托盘固定在横梁两端，无吊绳/悬挂杆；横梁、转轴、底座统一教具风格
- 点击左/右托盘选择输入侧，用屏幕 **虚拟键盘** 输入算式（0–9、括号、`+−×÷`、删除），算式显示在托盘顶面
- 中间 **等号** 绘于转轴处；不平衡时等号变红闪烁
- 点击 **校验答案** 才会计算（输入过程中不计算）
- 两边结果相等：托盘同高、等号水平变绿
- 不等：较大一侧托盘下沉、等号倾斜并 **红色闪烁**
- **重置清空** 恢复初始状态

## 等量代换

- **演示 1**（`/substitution`）：规则 △ = ○，题目 △ + △ = 两个空位
- **演示 2**（`/substitution/2`）：规则 △ + △ = ○，题目 △ + △ + ○ = 两个空位（仅 ○ + ○ 为正确答案）
- **演示 3**（`/substitution/3`）：规则 △ + ○ = 15，题目 △ + △ + ○ + ○ = ？（正确答案 **30**）
- 拖动图形填入等式右侧，点击 **提交** 校验

## 环境要求

- Node.js（建议 20+）
- npm

首次克隆后安装依赖：

```bash
npm install
```

## 运行测试用例

项目使用 [Vitest](https://vitest.dev/) 运行单元测试。测试文件位于 `src/**/*.test.ts`。

### 运行全部测试（一次性）

```bash
npm test
```

等价于：

```bash
npx vitest run
```

### 监听模式（改代码自动重跑）

```bash
npx vitest
```

### 只跑某个测试文件

```bash
npx vitest run src/lib/expression/evaluateExpression.test.ts
```

### 按用例名称过滤

```bash
npx vitest run -t "evaluates nested brackets"
```

### 查看帮助

```bash
npx vitest --help
```

测试文件：

- [`src/lib/expression/evaluateExpression.test.ts`](src/lib/expression/evaluateExpression.test.ts) — 表达式解析与求值
- [`src/game/balanceLogic.test.ts`](src/game/balanceLogic.test.ts) — 天平校验逻辑
- [`src/substitution/game/substitutionLogic.test.ts`](src/substitution/game/substitutionLogic.test.ts) — 等量代换校验逻辑
- [`src/modules/balance-hook/geometry.test.ts`](src/modules/balance-hook/geometry.test.ts) — 挂钩天平几何与命中

## 挂钩天平模块（`balance-hook`）

可复用 **Canvas 3D** 组件：正前方约 **45° 俯视**，金属支架 + 黄铜浅碟，钩链接到口沿。设计哲学见 [`art/oblique-suspension.md`](art/oblique-suspension.md)。`/balance` 游戏页仍使用木质托盘 + 算式，未替换。

```tsx
import { HookBalanceCanvas, BALANCE_WIDTH, BALANCE_HEIGHT } from './modules/balance-hook'

<HookBalanceCanvas tiltRad={0} onSelectSide={(side) => {}} />
```

导出参考图（需 dev 依赖 `@napi-rs/canvas`、`tsx`）：

```bash
npm run art:hook-balance
```

生成 [`art/hook-balance-oblique.png`](art/hook-balance-oblique.png)。

## 开发与构建

```bash
npm run dev      # 本地开发服务器（默认 http://localhost:5173）
npm run build    # TypeScript 检查 + 生产构建
npm run lint     # ESLint
npm run preview  # 预览生产构建
```

## 表达式求值 API

```ts
import { evaluateExpression, ExpressionError } from './lib/expression'

evaluateExpression('[(1+2)*3]-2') // 7
```

实现位于 [`src/lib/expression/`](src/lib/expression/)。
