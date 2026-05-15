# Tasks

- [x] Task 1: 重构 `lib/custom-error.ts` — 新增智能错误消息分发函数
  - [x] SubTask 1.1: 保留 `getCustomErrorMessage()` 函数不变（向后兼容）
  - [x] SubTask 1.2: 新增 `getErrorMessage(options)` 函数，接收 `{ message?, status?, fallback? }` 参数
  - [x] SubTask 1.3: 实现分发逻辑：
    - 有 `message` 且非空 → 返回 `message`（用户操作类错误，显示真实信息）
    - 无 `message` 且 `status` 为 500/502/503 → 返回 `getCustomErrorMessage()`（敏感信息遮盖）
    - 无 `message` 且无 `status`（网络错误）→ 返回 `fallback` 或默认文本
    - 无 `message` 但有其他状态码 → 返回 `getCustomErrorMessage()`

- [x] Task 2: 修改 `lib/api.ts` 响应拦截器 — 使用智能分发
  - [x] SubTask 2.1: 业务错误路径（success=false）：将 `response.data.message` 传入 `getErrorMessage()`
  - [x] SubTask 2.2: HTTP 错误路径（401）：将 `error.response.data.message` 传入 `getErrorMessage()`，保留 `auth.reset()` 逻辑
  - [x] SubTask 2.3: HTTP 错误路径（其他）：将 `error.response.data.message` 和 `status` 传入 `getErrorMessage()`
  - [x] SubTask 2.4: 移除 `getCustomErrorMessage()` 的直接调用，改为 `getErrorMessage()`

- [x] Task 3: 修改 `lib/handle-server-error.ts` — 从 AxiosError 提取消息
  - [x] SubTask 3.1: 判断 error 是否为 AxiosError，如果是则提取 `error.response.data.message`
  - [x] SubTask 3.2: 调用 `getErrorMessage({ message, status })` 替代 `getCustomErrorMessage()`
  - [x] SubTask 3.3: 非 AxiosError 的情况保持使用 `getCustomErrorMessage()`

- [x] Task 4: 修改 `playground/components/message-error.tsx` — 上游 API 错误使用随机遮盖码
  - [x] SubTask 4.1: Playground 消息气泡中的错误统一使用 `getCustomErrorMessage()`
  - [x] SubTask 4.2: `model_price_error` 特殊分支保留，错误内容使用随机遮盖码

- [x] Task 5: 验证所有改动
  - [x] SubTask 5.1: 确认 `getCustomErrorMessage()` 仍有被保留和使用（Playground fallback）
  - [x] SubTask 5.2: 确认所有 `getCustomErrorMessage()` 的直接调用已替换为 `getErrorMessage()`
  - [x] SubTask 5.3: 确认无 TypeScript 编译错误（本地无工具，已通过代码审查确认）

# Task Dependencies
- Task 1 独立（基础函数）
- Task 2 依赖 Task 1
- Task 3 依赖 Task 1
- Task 4 依赖 Task 1
- Task 5 依赖 Task 2, Task 3, Task 4
