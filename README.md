# tools

基于 React 的数学益智小游戏集合（**等量代换**）。单一 Vite 项目，通过路由切换游戏。

## 路由

| 路径 | 游戏 |
|------|------|
| `/` | 首页 |
| `/substitution` | 等量代换 · 演示 1（△ = ○） |
| `/substitution/2` | 等量代换 · 演示 2（△ + △ = ○） |
| `/substitution/3` | 等量代换 · 演示 3（△ + ○ = 15，输入数字答案） |
| `/test/apple` | Apple Canvas 组件测试（开发） |
| `/test/shapes` | 立体几何 Canvas 组件测试（开发） |
| `/login` | 登录 |
| `/register` | 注册 |
| `/reset-password` | 忘记密码 |
| `/reset-password/confirm` | 确认新密码 |

```bash
npm run dev
```

浏览器打开 Vite 提示的地址（通常 `http://localhost:5173`）。

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
npx vitest run src/substitution/game/substitutionLogic.test.ts
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

- [`src/substitution/game/substitutionLogic.test.ts`](src/substitution/game/substitutionLogic.test.ts) — 等量代换校验逻辑

## 开发与构建

```bash
npm run dev      # 本地开发服务器（默认 http://localhost:5173）
npm run build    # TypeScript 检查 + 生产构建
npm run lint     # ESLint
npm run preview  # 预览生产构建
```
