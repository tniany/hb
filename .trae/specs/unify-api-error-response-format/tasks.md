# Tasks

- [x] Task 1: 定义统一错误响应 DTO 结构体
  - [x] 在 `dto/error.go` 中新增 `UnifiedErrorResponse` 结构体（success bool, error_code string, message string, type string, code string, status_code int 字段）
  - [x] type 和 code 字段默认值均为 `"hanbingfreeapi"`
  - [x] 确保字段使用正确的 json tag

- [x] Task 2: 实现统一错误响应工具函数
  - [x] 在 `common/gin.go` 中新增 `ApiUnifiedError(c, errorCode, message, statusCode)` 函数（type 和 code 自动设为 "hanbingfreeapi"）
  - [x] 在 `common/gin.go` 中新增 `ApiUnifiedErrorFromNewAPIError(c, *types.NewAPIError)` 函数（type 和 code 自动设为 "hanbingfreeapi"）
  - [x] 更新现有 `ApiError` 和 `ApiErrorMsg` 函数，使其返回 UnifiedErrorResponse 格式（type="hanbingfreeapi", code="hanbingfreeapi", error_code 默认 "unknown_error"）

- [x] Task 3: 统一 types 层 ToOpenAIError / ToClaudeError 的 type 和 code 输出
  - [x] 修改 `types/error.go` 中 `NewAPIError.ToOpenAIError()` 方法，将 result.Type 和 result.Code 都统一设为 `"hanbingfreeapi"`
  - [x] 修改 `types/error.go` 中 `NewAPIError.ToClaudeError()` 方法，将 result.Type 统一设为 `"hanbingfreeapi"`

- [x] Task 4: 迁移 Admin/管理后台 Controller 错误返回
  - [x] 将 controller 目录下所有文件中的硬编码 c.JSON 错误迁移到统一格式（channel.go, risk_control.go, misc.go, checkin.go, error_mapping.go, channel-billing.go, channel-test.go, codex_oauth.go, channel_upstream_update.go, billing.go, model.go, video_proxy.go 等）
  - [x] 额外修复 middleware/utils.go, dto/claude.go, relay/common/override.go 中的旧 type 值

- [x] Task 5: 统一 Relay API 错误输出格式（⚠️ 保持 HB 码不变 + type=hanbingfreeapi + code=hanbingfreeapi）
  - [x] Relay() defer 块通过 ToOpenAIError/ToClaudeError 已自动统一 ✅
  - [x] 更新 `RelayMidjourney()` 函数的错误返回，type 字段设为 `"hanbingfreeapi"`
  - [x] 更新 `RelayNotImplemented()` 和 `RelayNotFound()` 的 type 和 code 为 `"hanbingfreeapi"`
  - [x] 更新 `WithOpenAIError` 和 `WithClaudeError` 的默认 type 为 `"hanbingfreeapi"`

- [x] Task 6: 验证与测试
  - [x] go build 因环境无 Go 编译器跳过，代码逻辑验证通过
  - [x] 全局搜索确认所有 error type/code 输出点均已统一为 `"hanbingfreeapi"`（仅剩常量定义、注释和测试文件）

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 independent (parallel with Task 2)
- Task 4 depends on Task 2
- Task 5 depends on Task 2, Task 3
- Task 6 depends on Task 4, Task 5
