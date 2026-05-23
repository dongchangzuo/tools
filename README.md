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
| `/login` | 登录 |
| `/register` | 注册 |
| `/reset-password` | 忘记密码 |
| `/reset-password/confirm` | 确认新密码 |

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

## 认证 API（Spring Boot + PostgreSQL）

前端登录/注册/重置密码页已对接 `backend/` 下的 REST API。默认请求 **`http://localhost:8000/api/v1`**（可在 `.env` 用 `VITE_API_HOST` 修改）。开发环境后端监听 **8000** 端口（`application-dev.yml`）。

| 路径 | 页面 |
|------|------|
| `/login` | 登录 |
| `/register` | 注册 |
| `/reset-password` | 忘记密码（发验证码） |
| `/reset-password/confirm` | 设置新密码 |

### 环境要求（认证）

- **Java 17+**、**Maven 3.9+**
- **Docker**（本地 PostgreSQL）
- Node.js 20+、npm（前端）

复制并按需修改 API 地址（**改 backend host 只需编辑 `.env`，无需改代码**）：

```bash
cp .env.example .env
```

| 变量 | 示例 | 说明 |
|------|------|------|
| `VITE_API_HOST` | `http://localhost:8000` | 后端 origin（协议 + 主机 + 端口） |
| `VITE_API_PATH` | `/api/v1` | API 路径前缀，默认 `/api/v1` |
| `VITE_API_BASE_URL` | `http://localhost:8000/api/v1` | 可选；若设置则**整条**作为 base，优先级最高 |

未配置时前端默认直连 `http://localhost:8000/api/v1`（`npm run preview` 也不会再打到 4173 同源）。若使用相对路径 `/api/v1`，dev/preview 会通过 `vite.config.ts` 代理到 `VITE_API_HOST` 或 `localhost:8000`。

### 启动顺序

1. **数据库**

```bash
docker compose up -d
```

Postgres：`localhost:5432`，库 `tools_auth`，用户 `tools` / `tools_secret`。

2. **后端**（在 `backend/` 目录）

```bash
cd backend
export JWT_SECRET='your-dev-secret-at-least-32-characters-long'
export JWT_RESET_SECRET='your-dev-reset-secret-at-least-32-chars'
mvn spring-boot:run
```

Flyway 会自动执行 `V1__init.sql`。开发环境下 6 位重置验证码会打印在后端日志（`EmailService`），不会发真实邮件。

3. **前端**（项目根目录）

```bash
npm run dev
```

浏览器打开 `http://localhost:5173`，使用 `/login`、`/register` 等页面联调。

### 主要接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/auth/register` | 注册；邮箱重复 `409 EMAIL_ALREADY_EXISTS` |
| POST | `/api/v1/auth/login` | 登录；失败 `401 INVALID_CREDENTIALS` |
| POST | `/api/v1/auth/forgot-password` | 发送重置码（防枚举，统一 200 文案） |
| POST | `/api/v1/auth/verify-reset-code` | 校验 6 位码，返回 `resetToken` |
| POST | `/api/v1/auth/reset-password` | 使用 `resetToken` 设置新密码 |
| GET | `/api/v1/auth/me` | `Authorization: Bearer <token>` 获取当前用户 |

后端单元测试：`cd backend && mvn test`。

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
