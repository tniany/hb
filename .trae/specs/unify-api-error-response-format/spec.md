# 统一API错误响应格式 Spec

## Why
当前 new-api 项目中存在多种不同的错误响应格式（Admin API 用 `success+message`、Relay 用 OpenAI/Claude 格式、Task 用 `code+message+statusCode`、Midjourney 用 `description+type+code` 等），且各处的 `type` 和 `code` 字段值不统一。需要将所有 API 的报错类型/结构统一起来，**`type` 和 `code` 字段全部统一为 `"hanbingfreeapi"`**。

## What Changes
- 定义统一的错误响应结构体 `UnifiedErrorResponse`
- 所有 Relay 接口（OpenAI/Claude/Gemini/Realtime/Midjourney/Task）的错误响应该结构体保持各自的**外层格式兼容**（因为不同 API 格式有客户端兼容性要求），但内部 error 对象的 **`type` 和 `code` 字段全部统一为 `"hanbingfreeapi"`**
- Admin/管理后台 API 的错误响应从 `{"success":false, "message":"..."}` 迁移到统一格式
- 新增统一的错误响应构造函数，替代散落在各处的 `c.JSON(...)` 手写错误返回
- **⚠️ 关键约束：Relay 报错的 message 字段必须继续返回 `涵冰api-错误提示喵：HB-XXXXXXXX` 格式（由 optimize-api-error-display 已实现），不得移除或修改此品牌化机制**

## Impact
- Affected specs: optimize-api-error-display（需协调，HB-xxxx 机制保持不变）
- Affected code: `common/gin.go`, `controller/relay.go`, `dto/error.go`, `types/error.go`, `service/error.go`, 各 controller 文件

## ADDED Requirements

### Requirement: 统一错误响应结构
系统 SHALL 提供统一的错误响应 DTO 结构 `UnifiedErrorResponse`，包含以下字段：
- `success`: bool — 是否成功（固定 false）
- `error_code`: string — 错误码（对应 types.ErrorCode，如 invalid_request, channel:no_available_key 等）
- `message`: string — 错误消息（人类可读，Relay 场景下为 `涵冰api-错误提示喵：HB-XXXXXXXX`）
- `type`: string — **统一固定值 `"hanbingfreeapi"`**
- `code`: string — **统一固定值 `"hanbingfreeapi"`**
- `status_code`: int — HTTP 状态码（可选）

#### Scenario: 统一错误响应序列化结果
- **WHEN** 系统构建一个统一错误响应
- **THEN** 返回的 JSON 为：`{"success": false, "error_code": "invalid_request", "message": "...", "type": "hanbingfreeapi", "code": "hanbingfreeapi", "status_code": 400}`

### Requirement: Admin API 错误格式迁移
系统 SHALL 将所有管理后台 API 的错误响应从旧格式迁移到统一格式 `UnifiedErrorResponse`。

#### Scenario: Admin API 报错
- **WHEN** 调用 Admin API 且发生错误
- **THEN** 返回 `{"success": false, "error_code": "xxx", "message": "...", "type": "hanbingfreeapi", "code": "hanbingfreeapi", "status_code": 200}`

### Requirement: Relay API 外层格式保持兼容 + type/code 全部统一为 hanbingfreeapi + HB码保留
由于 Relay API 需要兼容 OpenAI/Claude 等标准客户端 SDK，外层 JSON 结构不能改变。但 error 对象内部的 **`type` 和 `code` 字段 SHALL 全部统一为固定值 `"hanbingfreeapi"`**。

**⚠️ Relay 报错的 message 字段 SHALL 保持为 `涵冰api-错误提示喵：HB-XXXXXXXX` 格式。**

#### Scenario: OpenAI 格式 Relay 报错（HB 码 + type=hanbingfreeapi + code=hanbingfreeapi）
- **WHEN** OpenAI 格式的请求发生错误
- **THEN** 返回：
```json
{
  "error": {
    "message": "涵冰api-错误提示喵：HB-A3F2B1X7",
    "type": "hanbingfreeapi",
    "code": "hanbingfreeapi"
  }
}
```
其中 **type 和 code 都固定为 `"hanbingfreeapi"`**，message 保持 HB 码格式不变。

#### Scenario: Claude 格式 Relay 报错（HB 码 + type=hanbingfreeapi）
- **WHEN** Claude 格式的请求发生错误
- **THEN** 返回：
```json
{
  "type": "error",
  "error": {
    "type": "hanbingfreeapi",
    "message": "涵冰api-错误提示喵：HB-A3F2B1X7"
  }
}
```
其中 **error.type 固定为 `"hanbingfreeapi"`**。

#### Scenario: Midjourney 格式 Relay 报错（type=hanbingfreeapi）
- **WHEN** Midjourney 请求发生错误
- **THEN** 返回 `{"description": "<消息>", "type": "hanbingfreeapi", "code": <numeric_code>}`，**type 固定为 `"hanbingfreeapi"`**

#### Scenario: Task API 报错
- **WHEN** Task API 请求发生错误
- **THEN** 返回 `{"code": "hanbingfreeapi", "message": "...", "statusCode": <http_status>}`，**code 固定为 `"hanbingfreeapi"`**

#### Scenario: Realtime (WebSocket) 格式 Relay 报错（HB 码 + type/code=hanbingfreeapi）
- **WHEN** Realtime WebSocket 请求发生错误
- **THEN** WSS 消息中 **error.type 和 error.code 都固定为 `"hanbingfreeapi"`**，message 保持 HB 码格式

### Requirement: 统一错误响应工具函数
系统 SHALL 在 `common/gin.go` 中提供统一的错误响应构造函数：

- `ApiUnifiedError(c, errorCode, message, statusCode)` — 构造并返回 UnifiedErrorResponse（type 和 code 自动设为 "hanbingfreeapi"）
- `ApiUnifiedErrorFromNewAPIError(c, *types.NewAPIError)` — 从 NewAPIError 构造统一响应（type 和 code 自动设为 "hanbingfreeapi"）

## MODIFIED Requirements

### Requirement: common.ApiError / ApiErrorMsg 行为变更
现有的 `ApiError(c, err)` 和 `ApiErrorMsg(c, msg)` 函数 SHALL 更新为返回 `UnifiedErrorResponse` 格式，**type 和 code 字段固定为 `"hanbingfreeapi"`**。

### Requirement: types.OpenAIError.ToOpenAI() 中 type 和 code 字段
`NewAPIError.ToOpenAIError()` 方法生成的 OpenAIError：
- **`Type` 字段 SHALL 统一为 `"hanbingfreeapi"`**
- **`Code` 字段 SHALL 统一为 `"hanbingfreeapi"`**

### Requirement: types.ClaudeError.ToClaudeError() 中 type 字段
`NewAPIError.ToClaudeError()` 方法生成的 ClaudeError，其 **`Type` 字段 SHALL 统一为 `"hanbingfreeapi"`**。

### Requirement: Relay 错误输出（controller/relay.go defer 块）
Relay 错误输出逻辑 SHALL 更新：
1. **保持** `涵冰api-错误提示喵：HB-XXXXXXXX` 的消息替换逻辑不变
2. 确保 OpenAI/Realtime 格式中 **type 和 code 都统一为 `"hanbingfreeapi"`**
3. 确保 Claude 格式中 **type 统一为 `"hanbingfreeapi"`**

## REMOVED Requirements
无
