# 涵冰定制化改动 Spec

## Why
需要对两个前端主题（Default 和 Classic）进行统一的定制化改造：强制开启 IP 记录、隐藏真实 API 错误信息、添加 QQ 群入口。所有改动需同时在两个主题中生效，并保持各自主题的风格。

## What Changes
- 强制开启个人设置中的 IP 记录开关，并隐藏该开关 UI，使用户无法关闭
- 拦截所有前端展示的 API 错误信息，替换为统一格式的自定义错误提示：`涵冰api-错误提示喵：[随机字母错误代码]`，隐藏真实上游错误
- 在顶部导航栏添加 QQ 群按钮，点击跳转 `https://qm.qq.com/q/KbbU3BMdO2`

## Impact
- Affected specs: 用户设置面板、API 错误处理链路、顶部导航栏
- Affected code:
  - Default: `web/default/src/features/profile/components/tabs/notification-tab.tsx`、`web/default/src/lib/api.ts`、`web/default/src/lib/handle-server-error.ts`、`web/default/src/components/layout/components/app-header.tsx`、`web/default/src/components/layout/components/public-header.tsx`
  - Classic: `web/classic/src/components/settings/personal/cards/NotificationSettings.jsx`、`web/classic/src/components/settings/PersonalSetting.jsx`、`web/classic/src/helpers/api.js`、`web/classic/src/helpers/utils.jsx`、`web/classic/src/components/layout/headerbar/ActionButtons.jsx`

## ADDED Requirements

### Requirement: 强制开启 IP 记录
系统 SHALL 在用户设置中强制将 `record_ip_log` 设为 `true`，并隐藏该开关的 UI 元素，使用户无法看到或修改此设置。

#### Scenario: 用户打开个人设置页面
- **WHEN** 用户导航到个人设置页面
- **THEN** IP 记录开关不可见（隐藏），且该字段始终为 `true`

#### Scenario: 用户保存设置
- **WHEN** 用户保存其他设置
- **THEN** `record_ip_log` 字段始终为 `true`，不受用户操作影响

### Requirement: 统一错误提示替换
系统 SHALL 拦截所有在前端展示给用户的 API 错误信息，将其替换为自定义格式 `涵冰api-错误提示喵：XXXXX`（其中 XXXXX 为随机生成的字母错误代码，长度为 5 位），并隐藏真实的上游 API 错误返回内容。

#### Scenario: API 请求返回错误
- **WHEN** 任何 API 请求返回错误（HTTP 错误或业务逻辑错误）
- **THEN** 前端展示的错误信息被替换为 `涵冰api-错误提示喵：XXXXX`，不显示任何真实的错误详情

#### Scenario: 错误代码生成
- **WHEN** 错误信息被替换
- **THEN** 随机生成 5 位纯字母错误代码（A-Z，不区分大小写可统一为大写）

### Requirement: QQ 群按钮
系统 SHALL 在顶部导航栏添加 QQ 群入口按钮，点击后在新标签页打开 `https://qm.qq.com/q/KbbU3BMdO2`。

#### Scenario: 用户查看顶部导航栏
- **WHEN** 用户在任意页面查看顶部导航栏
- **THEN** 可以看到 QQ 群按钮

#### Scenario: 用户点击 QQ 群按钮
- **WHEN** 用户点击 QQ 群按钮
- **THEN** 在新浏览器标签页中打开 `https://qm.qq.com/q/KbbU3BMdO2`

## MODIFIED Requirements
无

## REMOVED Requirements
无
