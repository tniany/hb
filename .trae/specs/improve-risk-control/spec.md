# 改进风控管理 Spec

## Why
现有风控管理功能存在若干体验和逻辑问题：缺少用户白名单机制、不支持按类型筛选风控用户、API 调用错误数不应计入风控指标、多IP用户条目缺乏用户名直显、风险预览卡片样式过于突出。

## What Changes
- 新增风控白名单功能，白名单用户不出现在任何风控列表中
- 多IP检测和异常用户检测表增加类型筛选
- 移除异常用户检测中的错误数统计（后端不再查询/返回 error_count，前端移除错误数列）
- 多IP用户条目直接显示关联用户名，多余用户淡化隐藏，可点击查看全部
- 风险预览统计卡片去掉颜色变体，缩小尺寸
- 同步更新两个主题（default + classic）的前端
- 同步更新 i18n 翻译

## Impact
- Affected code:
  - `model/risk_control.go` — 新增白名单过滤逻辑，移除 error_count 查询
  - `controller/risk_control.go` — 新增白名单 CRUD 接口
  - `router/api-router.go` — 注册白名单路由
  - `model/option.go` — 新增 RiskControlWhitelist 选项
  - `web/default/src/features/system-settings/risk-control/` — 所有前端组件
  - `web/classic/src/pages/Setting/Operation/SettingsRiskControl.jsx` — classic 主题前端
  - `web/default/src/i18n/locales/zh.json` — 翻译
  - `web/classic/src/i18n/locales/zh.json` / `en.json` — 翻译

## ADDED Requirements

### Requirement: 风控用户白名单
系统 SHALL 提供风控白名单管理功能，管理员可以将指定用户 ID 添加到白名单中。白名单中的用户不出现在多IP检测、异常用户检测、风险预览统计中。

#### Scenario: 添加白名单用户
- **WHEN** 管理员通过 API 添加用户 ID 到白名单
- **THEN** 该用户 ID 被存储到 option `RiskControlWhitelist` 中（逗号分隔的用户 ID 列表）

#### Scenario: 白名单用户不出现在风控列表
- **WHEN** 查询多IP检测、异常用户检测时
- **THEN** SQL 查询自动排除白名单中的 user_id

#### Scenario: 查询白名单
- **WHEN** 管理员请求白名单列表
- **THEN** 返回白名单中的用户 ID 及对应用户名

### Requirement: 移除错误数统计
异常用户检测 SHALL NOT 包含错误数（error_count）字段。后端不再额外查询 LogTypeError 类型日志，前端不再显示错误数列。

### Requirement: 多IP用户条目直显用户名
多IP检测列表 SHALL 在每个 IP 条目中直接显示关联用户名。最多显示 3 个用户名，超出部分以淡化样式隐藏，点击可展开查看全部用户。

#### Scenario: 显示用户名
- **WHEN** 多IP检测列表加载完成
- **THEN** 每个 IP 行的"关联账号数"列替换为直接显示用户名列表（最多 3 个可见，其余淡化+可展开）

### Requirement: 风险预览卡片简化
风险预览统计卡片 SHALL 去掉所有颜色变体（border-l-4 + 颜色、文字颜色），使用统一的无色卡片样式，并缩小内边距和字号。

## MODIFIED Requirements

### Requirement: 多IP检测查询
后端 `GetMultiAccountIps` 查询 SHALL 额外返回关联用户名列表（JSON 数组），用于前端直接展示。

### Requirement: 异常用户查询
后端 `GetAbnormalUsers` 和 `GetIpUsers` SHALL 不再查询错误数（移除 LogTypeError 查询逻辑），不再返回 error_count 字段。

### Requirement: 所有风控查询增加白名单过滤
`GetMultiAccountIps`、`GetAbnormalUsers`、`GetRiskControlStats` 中涉及 user_id 的查询 SHALL 排除白名单用户。
