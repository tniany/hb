# 修复维护模式开关无法点击 Spec

## Why
系统设置页面中，维护模式（Maintenance Mode）的 Switch 开关点击时抛出 `TypeError: i is not a function`，导致用户无法开启维护模式。

## What Changes
- 修复 `MaintenanceModeSection` 组件中 `onCheckedChange` 回调的调用方式
- `useUpdateOption()` 返回的是 `useMutation()` 的结果对象，需要调用 `.mutate()` 方法，而不是直接将对象当作函数调用

## Impact
- Affected code: `web/default/src/features/system-settings/maintenance/maintenance-mode-section.tsx`

## MODIFIED Requirements
### Requirement: Maintenance Mode Toggle
`onCheckedChange` 回调应正确调用 `updateOption.mutate()` 来发送更新请求。

#### Scenario: 开启维护模式
- **WHEN** 用户点击维护模式的 Switch 开关
- **THEN** 调用 `updateOption.mutate()` 发送请求，不抛出任何错误

#### Scenario: 关闭维护模式
- **WHEN** 用户再次点击 Switch 关闭维护模式
- **THEN** 同样正确调用 `updateOption.mutate()`，切换回关闭状态
