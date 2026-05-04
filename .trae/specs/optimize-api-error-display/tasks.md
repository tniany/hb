# Tasks

- [x] Task 1: 后端 - ErrorMapping 模型与迁移
  - [x] SubTask 1.1: 创建 `model/error_mapping.go`，定义 ErrorMapping 结构体（ID, Code, Message, StatusCode, ErrorType, ChannelId, ModelName, TokenName, UserId, CreatedAt）
  - [x] SubTask 1.2: 在 `model/main.go` 的 `migrateDB()` 中添加 `&ErrorMapping{}` 到 AutoMigrate 列表
  - [x] SubTask 1.3: 实现 CRUD 函数：`CreateErrorMapping()`、`GetErrorMappingByCode()`、`GetErrorMappings(page, pageSize)`、`CleanupOldErrorMappings()`

- [x] Task 2: 后端 - Controller 与路由
  - [x] SubTask 2.1: 创建 `controller/error_mapping.go`，实现 `GetErrorMappings`（分页列表）和 `GetErrorMappingByCode`（按码查询）handler
  - [x] SubTask 2.2: 在 `router/api-router.go` 的 admin 路由组中添加 error_mapping 路由（GET /error_mappings, GET /error_mappings/:code）

- [x] Task 3: 后端 - Relay 报错拦截
  - [x] SubTask 3.1: 在 `controller/relay.go` 的 defer 错误输出块中，生成随机错误码 `HB-{8位}`
  - [x] SubTask 3.2: 将原始错误信息存入 ErrorMapping 表
  - [x] SubTask 3.3: 替换返回给用户的错误消息为 `涵冰api-错误提示喵：{错误码}`

- [x] Task 4: 后端 - 维护模式
  - [x] SubTask 4.1: 在 `model/option.go` 的 `InitOptionMap()` 中注册 `MaintenanceModeEnabled` 和 `MaintenanceModeMessage`
  - [x] SubTask 4.2: 在 `updateOptionMap()` 中处理维护模式选项变更，写入对应的全局变量
  - [x] SubTask 4.3: 创建 `middleware/maintenance.go`，检查维护模式状态，开启时返回 503
  - [x] SubTask 4.4: 在 `router/relay-router.go` 的 relay 路由组中添加维护模式中间件（在 SystemPerformanceCheck 之后、TokenAuth 之前）

- [x] Task 5: 前端（默认主题）- 维护模式设置 UI
  - [x] SubTask 5.1: 在 `types.ts` 的 `MaintenanceSettings` 中添加 `MaintenanceModeEnabled` 和 `MaintenanceModeMessage` 字段
  - [x] SubTask 5.2: 创建维护模式设置组件（开关 + 自定义消息输入框）
  - [x] SubTask 5.3: 在 `maintenance/section-registry.tsx` 中添加维护模式 section

- [x] Task 6: 前端（默认主题）- 报错日志页面
  - [x] SubTask 6.1: 创建 `api.ts` 中的报错日志 API 函数
  - [x] SubTask 6.2: 创建报错日志页面组件（错误码搜索 + 分页列表 + 详情查看）
  - [x] SubTask 6.3: 在 `maintenance/section-registry.tsx` 中添加报错日志 section

- [x] Task 7: i18n 翻译
  - [x] SubTask 7.1: 添加所有新增文本的中文翻译到 `web/default/src/i18n/locales/zh.json`

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 1
- Task 4.1, 4.2 independent
- Task 4.3 depends on Task 4.1, 4.2
- Task 4.4 depends on Task 4.3
- Task 5 independent (parallel with backend)
- Task 6.1 independent
- Task 6.2 depends on Task 6.1
- Task 6.3 depends on Task 6.2
- Task 7 independent (parallel)
