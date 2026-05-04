# 优化API报错显示 + 维护模式 Spec

## Why
当前API调用报错直接暴露上游提供商的原始错误信息，不利于品牌形象且可能泄露内部细节。需要统一替换为品牌化错误提示，同时提供管理员查看原始报错的能力。另外需要添加维护模式开关，在维护时统一拦截API请求。

## What Changes
- API relay报错统一替换为 `涵冰api-错误提示喵：HB-{8位随机码}` 格式
- 原始报错信息存储到数据库 `error_mappings` 表，管理员可通过错误码反查
- 管理员后台维护分区新增「报错日志」子页面，支持按错误码搜索和分页浏览
- 新增维护模式开关，开启后所有API请求返回 503 + "涵冰api-正在维护"（可自定义消息）
- 仅修改默认主题（default），经典主题不涉及

## Impact
- Affected specs: 无（新功能）
- Affected code: controller/relay.go, middleware/, model/, router/, web/default/

## ADDED Requirements

### Requirement: API报错隐藏与错误码映射
系统 SHALL 将所有 relay 报错的原始错误信息替换为品牌化格式 `涵冰api-错误提示喵：HB-{8位随机码}`，并存储原始错误到数据库供管理员查阅。

#### Scenario: OpenAI格式请求报错
- **WHEN** 用户发起 /v1/chat/completions 请求且上游返回错误
- **THEN** 返回 `{"error": {"message": "涵冰api-错误提示喵：HB-A3F2B1X7", "type": "...", "code": ...}}`，原始错误存入 error_mappings 表

#### Scenario: Claude格式请求报错
- **WHEN** 用户发起 /v1/messages 请求且上游返回错误
- **THEN** 返回 `{"type": "error", "error": {"message": "涵冰api-错误提示喵：HB-A3F2B1X7", ...}}`，原始错误存入 error_mappings 表

#### Scenario: 管理员查看错误码对应原始报错
- **WHEN** 管理员在报错日志页面输入错误码 HB-A3F2B1X7
- **THEN** 显示该错误码对应的原始错误信息、状态码、渠道、模型、用户、时间等详情

#### Scenario: 管理员浏览报错日志列表
- **WHEN** 管理员打开报错日志页面
- **THEN** 分页显示最近的错误码映射记录

### Requirement: 维护模式
系统 SHALL 提供维护模式开关，开启后所有API请求被拦截并返回维护提示。

#### Scenario: 维护模式开启
- **WHEN** 管理员开启维护模式
- **THEN** 所有 relay API 请求返回 503 + `涵冰api-正在维护`（或自定义消息）

#### Scenario: 维护模式关闭
- **WHEN** 管理员关闭维护模式
- **THEN** API请求正常处理，不受影响

#### Scenario: 自定义维护消息
- **WHEN** 管理员设置了自定义维护消息
- **THEN** API返回的维护提示使用自定义消息

### Requirement: 管理员后台报错日志页面
管理员后台维护分区 SHALL 新增「报错日志」子页面。

#### Scenario: 查看报错日志列表
- **WHEN** 管理员访问报错日志页面
- **THEN** 分页显示错误码映射列表，包含错误码、原始消息摘要、状态码、模型、渠道、时间

#### Scenario: 搜索错误码
- **WHEN** 管理员输入错误码搜索
- **THEN** 显示该错误码对应的完整原始报错详情

## MODIFIED Requirements
无

## REMOVED Requirements
无
