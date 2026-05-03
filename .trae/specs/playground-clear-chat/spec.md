# 游乐场清除聊天记录

## Why
游乐场（Playground）目前没有一键清除所有对话记录的功能。用户需要一个垃圾桶图标按钮，点击后立即清除所有聊天消息，无需二次确认。

## What Changes
- 在游乐场聊天区域顶部添加垃圾桶图标按钮（Trash2）
- 当有聊天记录时显示，无消息时隐藏
- 点击立即清除所有消息（清空 state + localStorage），无需确认弹窗
- 生成中时禁用按钮

## Impact
- Affected specs: 无（新增功能）
- Affected code:
  - `web/default/src/features/playground/components/playground-chat.tsx` — 添加垃圾桶按钮
  - `web/default/src/features/playground/index.tsx` — 添加 `onClearMessages` 回调

## ADDED Requirements

### Requirement: 清除聊天记录按钮
系统 SHALL 在游乐场聊天区域显示一个垃圾桶图标按钮，用于一键清除所有对话记录。

#### Scenario: 有聊天记录时显示按钮
- **WHEN** 游乐场中存在至少一条消息
- **THEN** 在聊天区域顶部（消息列表上方）显示垃圾桶图标按钮

#### Scenario: 无聊天记录时隐藏按钮
- **WHEN** 游乐场中没有任何消息
- **THEN** 不显示垃圾桶按钮

#### Scenario: 点击清除
- **WHEN** 用户点击垃圾桶按钮
- **THEN** 立即清空所有消息（state 和 localStorage），不显示确认弹窗

#### Scenario: 生成中禁用
- **WHEN** 正在生成回复（isGenerating = true）
- **THEN** 垃圾桶按钮显示为禁用状态，不可点击

## MODIFIED Requirements
无

## REMOVED Requirements
无
