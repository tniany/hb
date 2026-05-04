# 模型广场免费调用提示 Spec

## Why
用户访问模型广场时，可能不知道本站所有模型都是免费调用的，也不了解每日签到领取鱼干的功能。需要在模型列表上方添加一条醒目的提示信息，引导用户了解免费使用和签到机制。

## What Changes
- 在模型广场（`/pricing`）页面的模型列表上方（`<main>` 区域内、`<PricingToolbar>` 上方），添加一条 Alert 提示横幅
- 提示内容为：`涵冰api提醒你：本站所有模型全部免费调用，每日签到领取鱼干`
- 使用项目现有的 `Alert` UI 组件（`components/ui/alert.tsx`），配合 `Info` 图标，采用蓝色信息风格
- 添加对应的 i18n 翻译键（中英文）

## Impact
- Affected specs: 无现有 spec 受影响
- Affected code:
  - `web/default/src/features/pricing/index.tsx` — 在 `<main>` 区域内的模型列表上方添加 Alert 组件
  - `web/default/src/i18n/locales/en.json` — 添加英文翻译
  - `web/default/src/i18n/locales/zh.json` — 添加中文翻译
  - `web/default/src/i18n/locales/fr.json` — 添加法文翻译
  - `web/default/src/i18n/locales/ja.json` — 添加日文翻译
  - `web/default/src/i18n/locales/ru.json` — 添加俄文翻译
  - `web/default/src/i18n/locales/vi.json` — 添加越南文翻译

## ADDED Requirements

### Requirement: 模型广场免费调用提示
系统 SHALL 在模型广场页面的模型列表上方显示一条信息提示横幅，告知用户本站所有模型免费调用以及每日签到领取鱼干。

#### Scenario: 用户访问模型广场
- **WHEN** 用户访问 `/pricing` 页面
- **THEN** 在模型列表区域上方（`<PricingToolbar>` 之前）显示一条蓝色信息提示横幅
- **AND** 提示内容为：`涵冰api提醒你：本站所有模型全部免费调用，每日签到领取鱼干`
- **AND** 提示横幅使用 `Alert` 组件 + `Info` 图标
- **AND** 提示在桌面端和移动端均正常显示

## MODIFIED Requirements
无

## Removed Requirements
无
