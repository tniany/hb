# Tasks

- [ ] Task 1: 后端 — 新增选项（维护模式 + 自定义错误前缀）
  - [ ] 1.1: 在 `model/option.go` 的 `InitOptionMap()` 中添加 `MaintenanceMode = false`、`ApiErrorPrefix = "涵冰api-错误提示喵："`
  - [ ] 1.2: 在 `updateOptionMap()` 的 bool switch 中添加 `MaintenanceEnabled` case，在 string switch 中添加 `ApiErrorPrefix` case
  - [ ] 1.3: 在 `common/constants.go` 中添加 `var MaintenanceEnabled bool`

- [ ] Task 2: 后端 — 维护模式中间件
  - [ ] 2.1: 创建 `middleware/maintenance.go`，实现 `MaintenanceCheck()` 中间件，当 `common.MaintenanceEnabled` 为 true 时返回 503 + 自定义维护消息
  - [ ] 2.2: 在 `router/relay-router.go` 中为所有 relay 路由组注册 `MaintenanceCheck()` 中间件（放在 `SystemPerformanceCheck` 之后）

- [ ] Task 3: 后端 — 错误代码生成与消息替换
  - [ ] 3.1: 在 `controller/relay.go` 的 `Relay()` defer 块中，当 `newAPIError != nil` 时：生成 5 位随机字母错误代码
  - [ ] 3.2: 将错误代码和原始错误信息记录到日志（`model.RecordErrorLog` 的 `other` 字段中添加 `error_lookup_code`）
  - [ ] 3.3: 将 `newAPIError` 的消息替换为 `{common.OptionMap["ApiErrorPrefix"]}{错误代码}`
  - [ ] 3.4: 处理 `ToOpenAIError()` 和 `ToClaudeError()` 中的 `ErrorCode` 字段，设置为错误代码值
  - [ ] 3.5: 确保 `MessageWithRequestId` 仍然追加 request id（保持现有行为）

- [ ] Task 4: 前端(default) — 移除随机错误代码生成
  - [ ] 4.1: 修改 `web/default/src/lib/custom-error.ts`：移除 `generateErrorCode` 函数，`getCustomErrorMessage` 改为接受可选错误代码参数
  - [ ] 4.2: 修改 `web/default/src/lib/api.ts` 拦截器：从错误响应的 `error.code` 字段提取后端错误代码，传递给 `getCustomErrorMessage`
  - [ ] 4.3: 修改 `web/default/src/lib/handle-server-error.ts`：同样从错误响应提取代码

- [ ] Task 5: 前端(default) — 维护模式设置 UI
  - [ ] 5.1: 在 `web/default/src/features/system-settings/types.ts` 的 `MaintenanceSettings` 中添加 `MaintenanceEnabled`、`ApiErrorPrefix` 字段
  - [ ] 5.2: 在 `web/default/src/features/system-settings/maintenance/config.ts` 中添加默认值
  - [ ] 5.3: 在 `web/default/src/features/system-settings/maintenance/section-registry.tsx` 中添加新 section "Error Settings"
  - [ ] 5.4: 创建 `error-settings-section.tsx` 组件：维护模式开关 + 自定义错误前缀输入框

- [ ] Task 6: 前端(default) — 错误日志查看增强
  - [ ] 6.1: 在 usage-logs 中为错误日志添加 `error_lookup_code` 列显示
  - [ ] 6.2: 支持按错误代码搜索日志

- [ ] Task 7: 前端(classic) — 同步前端改动
  - [ ] 7.1: 修改 `web/classic/src/helpers/custom-error.js`：移除 `generateErrorCode`，改为接收后端代码
  - [ ] 7.2: 修改 `web/classic/src/helpers/api.js` 和 `web/classic/src/helpers/utils.jsx`：从错误响应提取代码
  - [ ] 7.3: 在经典前端的维护/操作设置中添加维护模式开关和错误前缀配置

- [ ] Task 8: i18n 翻译
  - [ ] 8.1: 在 `web/default/src/i18n/locales/zh.json` 中添加错误设置相关的翻译
  - [ ] 8.2: 在 `web/classic/src/i18n/locales/zh.json` 和 `en.json` 中添加翻译

# Task Dependencies
- Task 2 依赖 Task 1（维护模式中间件需要选项定义）
- Task 3 依赖 Task 1（错误代码生成需要错误前缀选项）
- Task 4 依赖 Task 3（前端需要后端返回错误代码）
- Task 5 依赖 Task 1（UI 需要选项定义）
- Task 7 依赖 Task 4（经典前端同步默认前端的改动）
- Task 8 与 Task 4-7 并行
