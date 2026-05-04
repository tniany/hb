# API 报错优化 Spec

## Why
当前 API 错误提示系统存在以下问题：
1. 前端每次渲染/重新获取时会随机生成新的错误代码（如"涵冰api-错误提示喵：XKQMR"），导致相同错误的代码不稳定
2. 上游错误信息虽然经过 MaskSensitiveInfo 处理，但仍然会泄露部分上游错误内容
3. 管理员无法通过错误代码反查原始报错信息
4. 缺少维护模式开关，无法一键拦截所有 API 请求

## What Changes
- 后端在错误发生时生成稳定的错误代码，替换原始错误信息返回给客户端
- 前端移除随机代码生成逻辑，直接使用后端返回的错误代码
- 管理员后台新增错误日志查看功能，支持通过错误代码搜索原始报错
- 新增维护模式开关，开启后所有 relay 请求返回"涵冰api-正在维护"
- 支持自定义错误前缀（默认"涵冰api-错误提示喵："）
- 移除后端 `common.MaskSensitiveInfo` 对错误消息的处理（不再需要，因为消息已被完全替换）

## Impact
- Affected specs: 无（新功能，不与现有 spec 冲突）
- Affected code:
  - `model/option.go` — 新增选项
  - `controller/relay.go` — 错误代码生成与消息替换
  - `middleware/maintenance.go` — 新增维护模式中间件
  - `router/relay-router.go` — 注册维护中间件
  - `web/default/src/lib/custom-error.ts` — 移除随机生成
  - `web/default/src/lib/api.ts` — 从响应中提取错误代码
  - `web/default/src/features/system-settings/maintenance/` — 维护设置 UI
  - `web/classic/` — 同步前端改动
  - `web/default/src/i18n/` — i18n 翻译

## ADDED Requirements

### Requirement: 后端错误代码生成
系统 SHALL 在 API 请求发生错误时，由后端生成唯一的 5 位字母错误代码，用于标识该次错误。

#### Scenario: 非流式请求报错
- **WHEN** 非流式 API 请求发生错误
- **THEN** 后端生成 5 位随机字母错误代码，将错误消息替换为 `{自定义前缀}{错误代码}`，原始错误信息写入日志

#### Scenario: 流式请求报错（控制器层面）
- **WHEN** 流式 API 请求在控制器层面（如渠道选择失败）发生错误
- **THEN** 同非流式流程，后端生成错误代码并替换消息

### Requirement: 隐藏上游错误信息
系统 SHALL 在返回给客户端的错误响应中完全隐藏上游提供商的原始错误信息。

#### Scenario: OpenAI 格式错误
- **WHEN** 上游返回 OpenAI 格式错误
- **THEN** 响应中 `error.message` 仅包含自定义前缀 + 错误代码，`error.code` 包含错误代码

#### Scenario: Claude 格式错误
- **WHEN** 上游返回 Claude 格式错误
- **THEN** 响应中 `error.message` 仅包含自定义前缀 + 错误代码，`error.type` 包含错误代码

### Requirement: 管理员错误日志查看
管理员 SHALL 能在后台查看错误日志，通过错误代码搜索原始报错信息。

#### Scenario: 查看错误日志
- **WHEN** 管理员在后台查看错误日志
- **THEN** 日志中显示错误代码列，可搜索错误代码查看对应原始错误

### Requirement: 维护模式
管理员 SHALL 能开启维护模式，开启后所有 relay API 请求返回维护提示。

#### Scenario: 维护模式开启
- **WHEN** 管理员开启维护模式
- **THEN** 所有 relay 请求返回 HTTP 503，错误消息为"涵冰api-正在维护"

#### Scenario: 维护模式关闭
- **WHEN** 管理员关闭维护模式
- **THEN** 所有请求正常处理

### Requirement: 自定义错误前缀
管理员 SHALL 能自定义错误提示前缀。

#### Scenario: 修改错误前缀
- **WHEN** 管理员在系统设置中修改错误前缀
- **THEN** 后续所有 API 错误使用新的前缀格式

## MODIFIED Requirements

### Requirement: 前端错误处理
前端错误处理逻辑需要修改为使用后端返回的错误代码，而非随机生成。

#### Scenario: 显示错误提示
- **WHEN** 前端收到 API 错误响应
- **THEN** 从响应中提取后端生成的错误代码，直接显示给用户
- **AND** 如果响应中无错误代码，回退到默认提示

## REMOVED Requirements

### Requirement: 前端随机错误代码生成
**Reason**: 错误代码改为后端生成，前端不再需要随机生成
**Migration**: 删除 `custom-error.ts` 中的 `generateErrorCode` 函数，改为从后端响应提取
