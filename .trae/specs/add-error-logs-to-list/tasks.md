# Tasks

- [x] Task 1: 后端 - 错误日志查询 API
  - [x] SubTask 1.1: 在 `controller/error_mapping.go` 中新增 `GetErrorLogs` handler，查询 logs 表 type=5 的记录，支持分页和筛选（model_name, channel_id, username）
  - [x] SubTask 1.2: 在 `router/api-router.go` 的 admin error_mappings 路由组中新增 GET /error_logs 路由

- [x] Task 2: 前端 - 错误日志 API 函数
  - [x] SubTask 2.1: 在 `maintenance/api.ts` 中新增 `getErrorLogs` API 函数

- [x] Task 3: 前端 - 报错日志页面 Tab 切换
  - [x] SubTask 3.1: 修改 `error-log-section.tsx`，添加 Tab 切换（错误码映射 / 错误日志）
  - [x] SubTask 3.2: 错误码映射 Tab 保持原有功能不变
  - [x] SubTask 3.3: 新增错误日志 Tab，展示 logs 表 type=5 的记录，包含筛选条件（模型名、渠道ID、用户名）
  - [x] SubTask 3.4: 错误日志列表显示：时间、模型、渠道、错误内容、用户名

- [x] Task 4: i18n 翻译
  - [x] SubTask 4.1: 添加新增文本的翻译（zh/en/fr/ja/ru/vi）

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 2
- Task 4 independent (parallel)
