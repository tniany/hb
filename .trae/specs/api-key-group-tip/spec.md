# API 密钥分组提示 Spec

## Why
用户在创建 API 密钥时可能误选 auto 分组，导致密钥行为不符合预期。需要在密钥创建界面的分组选择处显示可配置的提示消息，管理员可以在系统信息设置中修改该提示内容。

## What Changes
- 后端新增 `ApiKeyGroupTip` option 存储提示文本
- 前端在 API 密钥创建/编辑表单的分组选择器下方显示该提示
- 系统信息设置页面新增"API 密钥分组提示"编辑字段

## Impact
- Affected code:
  - `model/option.go` — 新增 `ApiKeyGroupTip` option 初始化
  - `web/default/src/features/system-settings/types.ts` — GeneralSettings 新增字段
  - `web/default/src/features/system-settings/general/system-info-section.tsx` — 新增编辑字段
  - `web/default/src/features/keys/components/api-keys-mutate-drawer.tsx` — 分组选择器下方显示提示
  - `web/classic/src/pages/Setting/index.jsx` — classic 主题系统设置新增提示编辑
  - i18n 翻译

## ADDED Requirements

### Requirement: API 密钥分组提示消息
系统 SHALL 提供一个可配置的提示消息 `ApiKeyGroupTip`，存储在 option 表中。该消息在 API 密钥创建/编辑表单的分组选择器下方以 Alert 形式显示。

#### Scenario: 管理员设置提示
- **WHEN** 管理员在系统信息设置中编辑"API 密钥分组提示"
- **THEN** 保存到 `ApiKeyGroupTip` option

#### Scenario: 用户创建密钥时看到提示
- **WHEN** 用户打开 API 密钥创建/编辑表单
- **THEN** 在分组选择器下方显示 `ApiKeyGroupTip` 提示内容（若为空则不显示）

### Requirement: 系统信息设置可编辑
系统信息设置页面 SHALL 包含"API 密钥分组提示"文本编辑区域，允许管理员修改提示内容。

## MODIFIED Requirements

### Requirement: 通用设置类型
`GeneralSettings` 类型 SHALL 新增 `ApiKeyGroupTip: string` 字段。
