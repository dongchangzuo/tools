import type { ApiErrorCode } from '../../../shared/api/types'

export type AuthErrorContent = {
  eyebrow: string
  title: string
  message: string
  hints: string[]
}

const LOGIN_ERROR_CONTENT: Partial<Record<ApiErrorCode, AuthErrorContent>> = {
  INVALID_CREDENTIALS: {
    eyebrow: '登录失败',
    title: '邮箱或密码不正确',
    message: '邮箱或密码错误，请重试。',
    hints: [
      '请确认邮箱拼写与注册时一致（不区分大小写）。',
      '若忘记密码，可使用「重置密码」通过邮箱验证码设置新密码。',
      '还没有账号？可先注册再登录。',
    ],
  },
  VALIDATION_ERROR: {
    eyebrow: '无法登录',
    title: '请检查填写内容',
    message: '提交的信息未通过校验，请根据提示修改后重试。',
    hints: ['请填写有效的邮箱地址与密码。'],
  },
}

const DEFAULT_LOGIN_ERROR: AuthErrorContent = {
  eyebrow: '登录失败',
  title: '暂时无法登录',
  message: '登录失败，请稍后重试。',
  hints: ['请检查网络连接，或稍后再试。'],
}

export function getLoginErrorContent(code: ApiErrorCode | undefined, message?: string): AuthErrorContent {
  const preset = code ? LOGIN_ERROR_CONTENT[code] : undefined
  if (!preset) {
    return {
      ...DEFAULT_LOGIN_ERROR,
      message: message?.trim() || DEFAULT_LOGIN_ERROR.message,
    }
  }
  return {
    ...preset,
    message: message?.trim() || preset.message,
  }
}
