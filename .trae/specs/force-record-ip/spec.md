# 强制后端记录 IP Spec

## Why
前端已强制将 `record_ip_log` 设为 `true` 并隐藏开关，但后端在记录日志时会查询用户设置。如果用户从未在设置页面点击过"保存"，数据库中 `record_ip_log` 字段不存在或为空，Go 的 `bool` 零值为 `false`，导致 IP 不被记录。需要在后端层面彻底解决，使 IP 记录不依赖于用户设置。

## What Changes
- 修改后端 `RecordConsumeLog` 和 `RecordErrorLog` 函数，不再读取用户设置，直接强制记录 IP 地址
- 简化逻辑，移除 `needRecordIp` 判断和 `GetUserSetting` 调用

## Impact
- Affected code: `model/log.go` 中的 `RecordConsumeLog`（约第 204-253 行）和 `RecordErrorLog`（约第 145-187 行）函数
- 消费日志和错误日志中的 IP 字段将始终记录客户端 IP，不再受用户设置控制

## ADDED Requirements
### Requirement: 强制记录日志 IP
系统 SHALL 在所有消费日志和错误日志中始终记录客户端 IP 地址，不受用户 `record_ip_log` 设置影响。

#### Scenario: 用户从未保存过设置
- **WHEN** 用户从未打开个人设置页面或从未点击保存
- **THEN** 其消费日志和错误日志中仍然记录 IP 地址

#### Scenario: 用户发送 API 请求
- **WHEN** 任何 API 请求产生消费日志或错误日志
- **THEN** 日志中的 `ip` 字段始终包含 `c.ClientIP()` 返回的客户端 IP

## MODIFIED Requirements
无

## REMOVED Requirements
无
