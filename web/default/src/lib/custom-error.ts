const ERROR_PREFIX = '涵冰api-错误提示喵：'

function generateErrorCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let code = ''
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function getCustomErrorMessage(): string {
  return `${ERROR_PREFIX}${generateErrorCode()}`
}

interface ErrorMessageOptions {
  message?: string
  status?: number
  fallback?: string
}

const SENSITIVE_STATUSES = new Set([500, 502, 503])

export function getErrorMessage(options: ErrorMessageOptions): string {
  const { message, status, fallback } = options

  if (message?.trim()) {
    return message
  }

  if (!status) {
    return fallback || getCustomErrorMessage()
  }

  if (SENSITIVE_STATUSES.has(status)) {
    return getCustomErrorMessage()
  }

  return getCustomErrorMessage()
}
