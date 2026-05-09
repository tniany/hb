# 错误码显示触发用户信息 Spec

## Why
当前报错日志页面的"错误码映射"Tab 只展示错误码、状态码、模型、渠道、错误类型和时间，无法查看是哪个用户触发了该错误。管理员需要在排查问题时快速定位到触发错误的用户。

## What Changes
- ErrorMapping 模型新增 `Username` 字段，存储触发错误的用户名
- relay.go 创建 ErrorMapping 时同时写入 username
- 前端错误码映射列表新增"用户"列，显示 user_id 和 username
- 前端错误码映射详情（按码搜索后）也展示用户信息
- 错误码映射列表支持按用户名筛选
- i18n 翻译新增文本

## Impact
- Affected specs: 报错日志页面（错误码映射 Tab）
- Affected code:
  - `model/error_mapping.go` — 新增 Username 字段
  - `controller/relay.go` — 创建 ErrorMapping 时写入 username
  - `controller/error_mapping.go` — GetErrorMappings 支持 username 筛选
  - `web/default/src/features/system-settings/maintenance/error-log-section.tsx` — 前端展示用户列和筛选
  - `web/default/src/features/system-settings/maintenance/api.ts` — API 调用支持 username 参数
  - `web/default/src/i18n/locales/*.json` — i18n 翻译

## ADDED Requirements
### Requirement: 错误码映射显示触发用户
系统 SHALL 在错误码映射列表和详情中展示触发该错误的用户信息（user_id + username）。

#### Scenario: 管理员查看错误码映射列表
- **WHEN** 管理员打开报错日志页面的"错误码映射"Tab
- **THEN** 列表新增"用户"列，显示 `username (id)` 格式，若无用户信息则显示 "-"

#### Scenario: 管理员按错误码搜索详情
- **WHEN** 管理员搜索特定错误码
- **THEN** 详情区域展示该错误码对应的触发用户信息

#### Scenario: 管理员按用户名筛选错误码映射
- **WHEN** 管理员在错误码映射 Tab 输入用户名并搜索
- **THEN** 列表仅显示该用户触发的错误码映射记录

### Requirement: ErrorMapping 存储用户名
ErrorMapping 创建时 SHALL 同时存储 user_id 和 username，以便前端直接展示而无需额外查询。

## MODIFIED Requirements
（无）

## REMOVED Requirements
（无）
