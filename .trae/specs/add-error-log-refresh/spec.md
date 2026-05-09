# 报错日志统计刷新按钮 Spec

## Why
当前报错日志页面的"错误码映射"和"错误日志"两个 Tab 没有手动刷新按钮。用户无法主动触发数据刷新，只能依赖 react-query 的默认缓存策略或切换页面后回来才能看到最新数据。需要添加刷新按钮方便管理员即时获取最新报错数据。

## What Changes
- 错误码映射 Tab（ErrorCodeMappingsTab）的搜索栏新增刷新按钮，点击后重新请求列表数据
- 错误日志 Tab（ErrorLogsTab）的搜索栏新增刷新按钮，点击后重新请求列表数据
- 刷新按钮使用 lucide-react 的 `RefreshCw` 图标，加载中时显示旋转动画

## Impact
- Affected specs: 报错日志页面
- Affected code:
  - `web/default/src/features/system-settings/maintenance/error-log-section.tsx` — 两个 Tab 组件新增刷新按钮

## ADDED Requirements
### Requirement: 错误码映射列表手动刷新
系统 SHALL 提供一个刷新按钮，管理员点击后立即重新请求错误码映射列表数据。

#### Scenario: 点击刷新按钮
- **WHEN** 管理员点击错误码映射 Tab 的刷新按钮
- **THEN** 列表数据重新从后端加载，按钮在加载期间显示旋转动画并禁用

### Requirement: 错误日志列表手动刷新
系统 SHALL 提供一个刷新按钮，管理员点击后立即重新请求错误日志列表数据。

#### Scenario: 点击刷新按钮
- **WHEN** 管理员点击错误日志 Tab 的刷新按钮
- **THEN** 列表数据重新从后端加载，按钮在加载期间显示旋转动画并禁用

## MODIFIED Requirements
（无）

## REMOVED Requirements
（无）
