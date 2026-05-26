# tools

基于 React 的数学教育平台（**数韵**），含用户认证与个人资料。单一 Vite 项目。

## 路由

| 路径 | 页面 |
|------|------|
| `/` | 首页 |
| `/login` | 登录 |
| `/register` | 注册 |
| `/reset-password` | 忘记密码 |
| `/reset-password/confirm` | 确认新密码 |
| `/profile` | 个人资料（需登录） |

```bash
npm run dev
```

浏览器打开 Vite 提示的地址（通常 `http://localhost:5173`）。

## 认证 API（Spring Boot + PostgreSQL）

前端登录/注册/重置密码页已对接 `backend/` 下的 REST API。默认请求 **`http://localhost:8000/api/v1`**（可在 `.env` 用 `VITE_API_HOST` 修改）。开发环境后端监听 **8000** 端口（`application-dev.yml`）。

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

## 开发与构建

```bash
npm run dev      # 本地开发服务器（默认 http://localhost:5173）
npm run build    # TypeScript 检查 + 生产构建
npm run lint     # ESLint
npm run preview  # 预览生产构建
```
