# tools

基于 React 的 **数学等式天平** 益智小游戏，并包含通用算术表达式求值库。

## 游戏说明

- 在左右 **托盘** 内直接输入四则运算算式（支持 `()`、`[]`、`{}` 混合嵌套）
- 中间为 **等号**，两侧托盘与等号组成平衡示意（无传统天平支架）
- 点击 **校验答案** 才会计算（输入过程中不计算）
- 两边结果相等：托盘同高、等号水平变绿
- 不等：较大一侧托盘下沉、等号倾斜并 **红色闪烁**
- **重置清空** 恢复初始状态

```bash
npm run dev
```

浏览器打开 Vite 提示的地址（通常 `http://localhost:5173`）。

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
