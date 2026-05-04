# Tasks

- [x] Task 1: 后端 — 新增 ApiKeyGroupTip option
  - [x] 1.1 在 `model/option.go` 的 `InitOptionMap()` 中新增 `common.OptionMap["ApiKeyGroupTip"] = ""`

- [x] Task 2: 前端 (default) — 类型与设置
  - [x] 2.1 在 `types.ts` 的 `GeneralSettings` 类型中新增 `ApiKeyGroupTip: string`
  - [x] 2.2 在 `general/index.tsx` 的 `defaultGeneralSettings` 中新增 `'ApiKeyGroupTip': ''`
  - [x] 2.3 在 `general/section-registry.tsx` 的 system-info section build 中传递 `ApiKeyGroupTip: settings.ApiKeyGroupTip`
  - [x] 2.4 在 `general/system-info-section.tsx` 的 schema、type、form 中新增 ApiKeyGroupTip Textarea

- [x] Task 3: 前端 (default) — API 密钥创建表单显示提示
  - [x] 3.1 在 `api-keys-mutate-drawer.tsx` 中通过 `useSystemOptions` 获取 `ApiKeyGroupTip`
  - [x] 3.2 在分组选择器下方显示 Alert 提示（非空时才显示）

- [x] Task 4: 前端 (classic) — 同步变更
  - [x] 4.1 在 classic 主题 OtherSetting.jsx 中新增 ApiKeyGroupTip 编辑字段

- [x] Task 5: i18n 翻译
  - [x] 5.1 更新 default zh.json
  - [x] 5.2 更新 classic zh.json / en.json
