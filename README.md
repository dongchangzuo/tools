# tools

基于 React + Canvas 的 Vite 项目，并包含通用算术表达式求值库。

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

当前表达式求值相关测试在：

- [`src/lib/expression/evaluateExpression.test.ts`](src/lib/expression/evaluateExpression.test.ts)

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
