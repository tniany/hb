# 个人资料页面显示用户ID

## Why
新主题（Default）的个人资料页面缺少用户ID显示，而经典主题（Classic）已有此功能。用户ID是用户的唯一辨识标识，需要在新主题中同步展示。

## What Changes
- 在 `profile-header.tsx` 的角色标签（StatusBadge）旁添加用户ID标签显示
- 以圆角边框 + 等宽字体的小标签形式展示，格式为 `ID: {id}`
- 经典主题无需修改，已有此功能

## Impact
- Affected specs: 无（新增功能）
- Affected code: `web/default/src/features/profile/components/profile-header.tsx`

## ADDED Requirements

### Requirement: 显示用户ID
系统 SHALL 在个人资料页面的用户名行中，角色标签旁显示用户的唯一数字ID。

#### Scenario: 用户访问个人资料页面
- **WHEN** 用户打开个人资料页面（`/profile`）
- **THEN** 在显示名称和角色标签右侧显示 `ID: {用户ID}` 标签

#### Scenario: 用户ID为0或不存在
- **WHEN** `profile.id` 为 0 或 falsy
- **THEN** 不显示ID标签（防御性渲染）

#### Scenario: 响应式显示
- **WHEN** 在移动端或桌面端查看
- **THEN** ID标签与其他标签对齐显示，自适应布局

## MODIFIED Requirements
无

## REMOVED Requirements
无
