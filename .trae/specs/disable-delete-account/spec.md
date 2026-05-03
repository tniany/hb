# 禁用删除账户按钮 Spec

## Why
管理员希望禁止用户自行注销账户，因此需要将个人设置中安全设置的"删除账户"按钮变为灰色不可点击状态，阻止用户执行注销操作。

## What Changes
- Classic 前端（`web/classic/`）：将安全设置 Tab 中的"删除账户"按钮设为 `disabled`，并更新样式为灰色不可按状态
- Default 前端（`web/default/`）：将安全设置卡片中的"Delete Account"操作按钮设为 `disabled`，并更新样式为灰色不可按状态

## Impact
- Affected specs: 用户个人设置 - 安全设置页面
- Affected code:
  - `web/classic/src/components/settings/personal/cards/AccountManagement.jsx` — 删除账户按钮
  - `web/default/src/features/profile/components/profile-security-card.tsx` — Delete Account 操作项

## MODIFIED Requirements

### Requirement: 禁用删除账户功能
系统 SHALL 将"删除账户"按钮设置为灰色不可点击状态，用户无法触发删除账户操作。

#### Scenario: Classic 前端 - 用户查看安全设置
- **WHEN** 用户进入个人设置 → 安全设置 Tab
- **THEN** "删除账户"按钮显示为灰色不可点击状态（disabled），点击无响应

#### Scenario: Default 前端 - 用户查看安全设置
- **WHEN** 用户进入个人设置 → Security 卡片
- **THEN** "Delete Account" 操作项显示为灰色不可点击状态（disabled），点击无响应
