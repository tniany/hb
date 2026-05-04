# 模型广场提示信息管理后台配置 Spec

## Why
模型广场的提示信息（"涵冰api提醒你：本站所有模型全部免费调用，每日签到领取鱼干"）目前是硬编码的，管理员无法在后台修改。需要将其改为可通过后台管理的动态配置项，让管理员能自由编辑提示内容。

## What Changes
- 新增后端设置键 `ModelSquareNotice`，默认值为当前的提示文本
- 新增公开 API 接口 `GET /api/notice/model_square` 供前端免费获取（无需登录）
- 默认主题（新主题）在后台管理的"系统信息"（System Information）区域添加该配置项的表单字段
- 经典主题在后台管理的"其他设置"（Other Settings）区域添加该配置项的表单字段
- 模型广场页面从后端动态获取提示内容，替换当前的硬编码文本
- 留空时不显示提示横幅

## Impact
- Affected specs: `model-square-free-notice`（之前硬编码的版本将被此动态版本替代）
- Affected code:
  - `model/option.go` — `InitOptionMap()` 添加默认值
  - `router/api-router.go` — 添加公开 API 路由
  - `controller/misc.go` — 添加 GetModelSquareNotice 控制器
  - `web/default/src/features/system-settings/types.ts` — `GeneralSettings` 添加字段
  - `web/default/src/features/system-settings/general/system-info-section.tsx` — 添加表单字段
  - `web/classic/src/components/settings/OtherSetting.jsx` — 添加配置项
  - `web/default/src/features/pricing/index.tsx` — 动态获取并渲染提示
  - `web/default/src/features/pricing/api.ts` — 添加 API 调用
  - 6 个 i18n 翻译文件 — 添加新翻译键

## ADDED Requirements

### Requirement: 后端设置键 ModelSquareNotice
系统 SHALL 在 `Option` 表中支持 `ModelSquareNotice` 键，存储模型广场提示信息的 HTML/文本内容。

#### Scenario: 默认值
- **WHEN** 系统初始化且数据库中无 `ModelSquareNotice` 记录
- **THEN** 默认值为空字符串（不显示提示，管理员需手动配置）

### Requirement: 公开 API 接口
系统 SHALL 提供 `GET /api/notice/model_square` 公开接口，返回模型广场提示信息。

#### Scenario: 正常获取
- **WHEN** 前端请求 `GET /api/notice/model_square`
- **THEN** 返回 `{ success: true, data: { notice: "..." } }` 格式

#### Scenario: 未配置
- **WHEN** `ModelSquareNotice` 为空
- **THEN** 返回空字符串，前端不显示横幅

### Requirement: 默认主题后台配置
系统 SHALL 在默认主题的"系统信息"（System Information）设置区域中，为管理员提供 `ModelSquareNotice` 的编辑字段。

#### Scenario: 管理员编辑
- **WHEN** 管理员在系统信息页面填写模型广场提示信息并保存
- **THEN** 设置通过 `PUT /api/option/` 接口持久化

### Requirement: 经典主题后台配置
系统 SHALL 在经典主题的"其他设置"（Other Settings）设置区域中，为管理员提供 `ModelSquareNotice` 的编辑字段。

#### Scenario: 管理员编辑
- **WHEN** 管理员在其他设置页面填写模型广场提示信息并保存
- **THEN** 设置通过 `PUT /api/option/` 接口持久化

### Requirement: 模型广场动态提示
模型广场页面 SHALL 从后端动态获取提示信息，替代硬编码文本。

#### Scenario: 有提示内容
- **WHEN** 管理员配置了 `ModelSquareNotice` 且内容非空
- **THEN** 模型列表上方显示蓝色信息提示横幅

#### Scenario: 无提示内容
- **WHEN** `ModelSquareNotice` 为空
- **THEN** 不显示提示横幅

## MODIFIED Requirements
无

## Removed Requirements
无
