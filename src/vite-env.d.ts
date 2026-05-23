/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Full API base URL, e.g. http://localhost:8081/api/v1 or /api/v1 */
  readonly VITE_API_BASE_URL?: string
  /** Backend origin only, e.g. http://localhost:8081 */
  readonly VITE_API_HOST?: string
  /** API path prefix, default /api/v1 */
  readonly VITE_API_PATH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
