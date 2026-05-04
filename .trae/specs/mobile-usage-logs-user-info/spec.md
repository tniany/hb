# 手机端使用日志添加用户信息显示

## Why

管理员在手机端查看使用日志（Common Logs 和 Task Logs）时，用户信息仅以小字段形式出现在卡片的 2 列网格中，视觉层级很低，几乎看不到。PC 端则有 Avatar 头像 + 用户名 + 点击交互的丰富展示。需要在移动端也将用户信息突出显示。

## What Changes

- 为 Common Logs 和 Task Logs 的 User 列 meta 添加 `mobileBadge: true`，使其在移动端卡片标题行右侧显示
- 调整 User 单元格的渲染，使其在移动端（badge 位置）呈现为紧凑的 Avatar + 用户名样式

## Impact

- Affected specs: 使用日志移动端展示
- Affected code:
  - `web/default/src/features/usage-logs/components/columns/common-logs-columns.tsx` — User 列 meta 和 cell
  - `web/default/src/features/usage-logs/components/columns/task-logs-columns.tsx` — User 列 meta 和 cell

## ADDED Requirements

### Requirement: Common Logs 移动端用户信息显示

Common Logs 的 User 列 SHALL 在移动端通过 `mobileBadge` meta 在卡片标题行右侧展示用户信息。

#### Scenario: 管理员在手机端查看 Common Logs

- **WHEN** 管理员在手机端（屏幕宽度 ≤ 640px）查看 Common Logs
- **THEN** 每条日志卡片的标题行右侧显示用户信息（Avatar 头像首字母 + 用户名），与 PC 端信息一致

#### Scenario: 敏感信息关闭时

- **WHEN** 敏感信息可见性关闭（sensitiveVisible = false）
- **THEN** 移动端用户信息显示为脱敏样式（`•` 头像 + `••••` 用户名）

#### Scenario: 日志无用户名时

- **WHEN** 日志条目的 username 为空
- **THEN** 移动端 badge 区域不显示用户信息（返回 null，CompactRow 渲染为空）

### Requirement: Task Logs 移动端用户信息显示

Task Logs 的 User 列 SHALL 在移动端通过 `mobileBadge` meta 在卡片标题行右侧展示用户信息。

#### Scenario: 管理员在手机端查看 Task Logs

- **WHEN** 管理员在手机端查看 Task Logs
- **THEN** 每条日志卡片的标题行右侧显示用户信息（Avatar + 用户名），与 PC 端信息一致

### Requirement: PC 端行为不变

PC 端的使用日志展示 SHALL 保持不变，不受移动端修改影响。

## MODIFIED Requirements

### Requirement: User 列移动端布局

Common Logs 和 Task Logs 的 User 列 meta SHALL 从 `{ label: t('User') }` 修改为 `{ label: t('User'), mobileBadge: true }`，使其在 MobileCardList 的 CompactRow 布局中作为 badge 渲染在标题行右侧。

## REMoved Requirements

None
