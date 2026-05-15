# 优化前端错误消息显示 Spec

## Why
当前前端使用 `getCustomErrorMessage()` 生成随机5位字母错误码（如 `涵冰api-错误提示喵：XKRBT`）来遮盖所有错误消息。这导致用户在登录失败、注册失败、修改密码等场景下只能看到无意义的随机码，无法得知真正的错误原因。应该只对敏感信息（上游API错误、内部服务器错误）进行遮盖，用户操作相关的错误应显示后端返回的具体信息。

## What Changes
- 修改 `lib/custom-error.ts`：保留随机错误码函数，新增 `getErrorMessage()` 智能分发函数
- 修改 `lib/api.ts` 拦截器：业务错误显示后端 `message`，HTTP 错误根据状态码决定是否遮盖
- 修改 `lib/handle-server-error.ts`：从 AxiosError 中提取消息，不再一律遮盖
- 修改 `playground/components/message-error.tsx`：显示真实错误消息，不再使用随机码

## Impact
- Affected specs: 无
- Affected code:
  - `web/default/src/lib/custom-error.ts` — 核心改动
  - `web/default/src/lib/api.ts` — 拦截器改动
  - `web/default/src/lib/handle-server-error.ts` — 全局错误处理改动
  - `web/default/src/features/playground/components/message-error.tsx` — Playground 错误展示改动

## ADDED Requirements
### Requirement: 智能错误消息分发
系统 SHALL 提供 `getErrorMessage(error, fallback)` 函数，根据错误类型决定显示真实消息还是随机遮盖码。

#### Scenario: 业务错误（success=false）
- **WHEN** 后端返回 `{ success: false, message: "用户名已存在" }`
- **THEN** toast 显示 "用户名已存在"

#### Scenario: HTTP 401 错误
- **WHEN** 请求返回 401 状态码
- **THEN** toast 显示后端 message（如有），否则显示随机遮盖码

#### Scenario: HTTP 500 错误
- **WHEN** 请求返回 500 状态码
- **THEN** toast 显示随机遮盖码（敏感信息不暴露）

#### Scenario: 网络错误
- **WHEN** 请求因网络问题失败（无 response）
- **THEN** toast 显示 "网络连接失败，请检查网络"

### Requirement: Playground 错误消息展示
Playground 消息气泡中的上游 API 错误 SHALL 使用随机遮盖码（`涵冰api-错误提示喵：XXXXX`），不暴露上游 API 的具体错误信息。

## MODIFIED Requirements
### Requirement: 全局错误处理
React Query mutation 的 `onError` 回调 SHALL 从 AxiosError 中提取后端消息，而非一律使用随机遮盖码。

## REMOVED Requirements
无
