# 报错日志列表增强 Spec

## Why
当前报错日志页面只显示 ErrorMapping 表的错误码映射记录（HB-xxx → 原始错误），但系统中还有大量通过 `RecordErrorLog` 写入 `logs` 表（type=5）的实际错误日志未被展示。管理员需要在同一个页面看到所有错误信息，便于排查问题。

## What Changes
- 后端新增 API：查询 `logs` 表中 type=5 的错误日志（分页 + 筛选）
- 前端报错日志页面新增 Tab 切换：错误码映射 / 错误日志
- 错误日志 Tab 展示 logs 表中的错误记录，包含：时间、模型、渠道、错误内容、用户等
- 支持按模型名、渠道ID、用户名筛选错误日志

## Impact
- Affected specs: optimize-api-error-display
- Affected code:
  - `controller/error_mapping.go` — 新增错误日志查询 handler
  - `router/api-router.go` — 新增路由
  - `web/default/src/features/system-settings/maintenance/error-log-section.tsx` — 新增 Tab 和错误日志列表
  - `web/default/src/features/system-settings/maintenance/api.ts` — 新增 API 函数
  - `web/default/src/i18n/locales/*.json` — 新增翻译

## ADDED Requirements
### Requirement: 错误日志查询 API
系统 SHALL 提供管理员 API 查询 logs 表中 type=5 的错误日志，支持分页和筛选。

#### Scenario: 查询错误日志列表
- **WHEN** 管理员请求 GET /api/error_logs?p=1&page_size=20
- **THEN** 返回 logs 表中 type=5 的记录，按 created_at desc 排序，包含分页信息

#### Scenario: 按条件筛选
- **WHEN** 管理员请求 GET /api/error_logs?model_name=xxx&channel_id=1&username=xxx
- **THEN** 返回匹配条件的错误日志

### Requirement: 前端错误日志 Tab
前端报错日志页面 SHALL 提供 Tab 切换，在"错误码映射"和"错误日志"之间切换。

#### Scenario: 切换到错误日志
- **WHEN** 用户点击"错误日志" Tab
- **THEN** 显示 logs 表中的错误日志列表，包含筛选条件输入框

## MODIFIED Requirements
### Requirement: 报错日志页面
原有的错误码映射列表移至"错误码映射" Tab 下，功能不变。

## REMOVED Requirements
无
