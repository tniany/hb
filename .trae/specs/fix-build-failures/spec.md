# 修复构建失败规范

## Why
GitHub Actions CI/CD 的所有构建任务（Docker、Release、Electron）均因 Go 编译错误失败。多轮修复已解决了循环导入、未使用变量和语法错误问题，但 `controller/channel_affinity_cache.go` 中仍缺少必要的包导入导致构建无法通过。

## What Changes
- 修复 `controller/oauth.go` 第 58 行的语法错误（多余的 `})`）— 已完成
- 修复 `controller/channel_affinity_cache.go` 缺少 `common` 包导入的问题

## Impact
- Affected specs: 无
- Affected code: `controller/oauth.go`（已修复），`controller/channel_affinity_cache.go`（待修复）

## ADDED Requirements
无新增需求

## MODIFIED Requirements
### Requirement: 代码编译通过
系统 SHALL 在 Go 1.25+ 环境下无语法错误地编译所有 `.go` 文件。

#### Scenario: CI/CD 构建成功
- **WHEN** 推送代码到 main 分支或创建 tag
- **THEN** 所有 GitHub Actions 工作流（Docker、Release、Electron）的 Go 编译步骤成功完成

## REMOVED Requirements
无
