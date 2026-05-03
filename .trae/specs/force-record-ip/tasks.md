# Tasks

## Task 1: 修改后端日志函数，强制记录 IP
- [x] SubTask 1.1: 修改 `model/log.go` 中的 `RecordConsumeLog` 函数，移除 `needRecordIp` 逻辑和 `GetUserSetting` 调用，直接将 `Ip` 字段设为 `c.ClientIP()`
- [x] SubTask 1.2: 修改 `model/log.go` 中的 `RecordErrorLog` 函数，同样移除 `needRecordIp` 逻辑和 `GetUserSetting` 调用，直接将 `Ip` 字段设为 `c.ClientIP()`
- [x] SubTask 1.3: 检查是否还有其他日志函数（如 `RecordLog`、`RecordLogWithAdminInfo`）也需要记录 IP，确认范围

# Task Dependencies
- 所有 SubTask 可顺序执行，都在同一文件中
