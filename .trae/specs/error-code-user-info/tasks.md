# Tasks

- [x] Task 1: 后端 - ErrorMapping 模型新增 Username 字段
  - [x] SubTask 1.1: 在 `model/error_mapping.go` 的 ErrorMapping 结构体中新增 `Username` 字段（string, size:128, index）
  - [x] SubTask 1.2: 确认 GORM AutoMigrate 会自动为现有数据库添加新列（SQLite/MySQL/PostgreSQL 三库兼容）

- [x] Task 2: 后端 - relay.go 写入 Username
  - [x] SubTask 2.1: 在 `controller/relay.go` 创建 ErrorMapping 时，从 gin Context 中取 `c.GetString("username")` 赋值给 `Username` 字段

- [x] Task 3: 后端 - GetErrorMappings 支持 username 筛选
  - [x] SubTask 3.1: 修改 `model/error_mapping.go` 的 `GetErrorMappings` 函数，新增 username 可选参数，非空时添加 WHERE 条件
  - [x] SubTask 3.2: 修改 `controller/error_mapping.go` 的 `GetErrorMappings` handler，从 query 参数读取 username 并传入 model 层

- [x] Task 4: 前端 - 错误码映射列表显示用户列
  - [x] SubTask 4.1: 在 `error-log-section.tsx` 的 ErrorCodeMappingsTab 表头新增"用户"列
  - [x] SubTask 4.2: 表格行渲染 user 信息，格式为 `username (user_id)`，无数据时显示 "-"
  - [x] SubTask 4.3: 搜索详情区域也展示触发用户信息

- [x] Task 5: 前端 - 错误码映射支持按用户名筛选
  - [x] SubTask 5.1: 在 ErrorCodeMappingsTab 的搜索区域新增用户名输入框
  - [x] SubTask 5.2: 修改 `api.ts` 的 `getErrorMappings` 函数支持 username 参数
  - [x] SubTask 5.3: 搜索/分页时将 username 参数传递到后端

- [x] Task 6: i18n 翻译
  - [x] SubTask 6.1: 检查并添加新增文本的翻译（zh/en/fr/ja/ru/vi）

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 1
- Task 4 depends on Task 2 (后端返回数据需含 username)
- Task 5 depends on Task 3 and Task 4
- Task 6 independent (parallel)
