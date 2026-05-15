# Checklist

- [x] `lib/custom-error.ts` 新增 `getErrorMessage(options)` 函数
- [x] `getErrorMessage` 有 message 时返回真实消息
- [x] `getErrorMessage` 500/502/503 无 message 时返回随机遮盖码
- [x] `getErrorMessage` 网络错误时返回友好提示
- [x] `lib/api.ts` 业务错误路径使用 `getErrorMessage` 显示后端 message
- [x] `lib/api.ts` HTTP 401 路径使用 `getErrorMessage` 显示后端 message
- [x] `lib/api.ts` HTTP 其他错误路径使用 `getErrorMessage` 带 status 参数
- [x] `lib/api.ts` 不再直接调用 `getCustomErrorMessage()`
- [x] `lib/handle-server-error.ts` 从 AxiosError 提取 response.data.message
- [x] `lib/handle-server-error.ts` 调用 `getErrorMessage` 替代 `getCustomErrorMessage()`
- [x] `playground/message-error.tsx` 上游 API 错误使用随机遮盖码（不暴露上游错误信息）
- [x] `getCustomErrorMessage()` 函数仍保留且可被引用
- [x] 仅修改 `web/default/` 目录，经典前端不受影响
