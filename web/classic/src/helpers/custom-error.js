const ERROR_PREFIX = '涵冰api-错误提示喵：'

function generateErrorCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let code = ''
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function getCustomErrorMessage() {
  return `${ERROR_PREFIX}${generateErrorCode()}`
}
