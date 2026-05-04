# Tasks

- [x] Task 1: 后端 — 白名单存储与管理接口
  - [x] 1.1 在 `model/option.go` 中新增 `RiskControlWhitelist` 选项（逗号分隔的 user_id 列表），并在 `common/` 中增加对应变量 `RiskControlWhitelistUserIds []int`
  - [x] 1.2 在 `model/risk_control.go` 中新增 `GetRiskControlWhitelist()` 函数，从 option 读取白名单并返回 user_id 列表
  - [x] 1.3 在 `controller/risk_control.go` 中新增 `GetRiskControlWhitelist`、`AddRiskControlWhitelistUser`、`RemoveRiskControlWhitelistUser` 三个 handler
  - [x] 1.4 在 `router/api-router.go` 注册白名单路由（GET/POST/DELETE）

- [x] Task 2: 后端 — 所有风控查询增加白名单过滤
  - [x] 2.1 修改 `GetMultiAccountIps` 查询，排除白名单中的 user_id（通过子查询 `user_id NOT IN (白名单ID列表)`）
  - [x] 2.2 修改 `GetAbnormalUsers` 查询，排除白名单中的 user_id
  - [x] 2.3 修改 `GetRiskControlStats` 中 MultiIpUsers、HighQuotaUsers、ActiveUsers、SuspiciousIps 的统计查询，排除白名单用户
  - [x] 2.4 修改 `GetIpUsers` 查询，排除白名单用户

- [x] Task 3: 后端 — 移除异常用户错误数统计
  - [x] 3.1 从 `AbnormalUserStat` 结构体中移除 `ErrorCount` 字段
  - [x] 3.2 从 `GetAbnormalUsers` 函数中移除 LogTypeError 查询逻辑
  - [x] 3.3 从 `GetIpUsers` 函数中移除 LogTypeError 查询逻辑
  - [x] 3.4 从 `RiskControlStats` 结构体中移除 `ErrorRequests` 字段及对应查询

- [x] Task 4: 后端 — 多IP查询返回关联用户名
  - [x] 4.1 修改 `IpAccountStat` 结构体，新增 `UserNames string` 字段（JSON tag: `user_names`）
  - [x] 4.2 修改 `GetMultiAccountIps` 数据查询，额外聚合关联用户名列表（二次查询 + Go 拼接，跨 DB 兼容）

- [x] Task 5: 前端 (default theme) — 风险预览卡片简化
  - [x] 5.1 修改 `overview-card.tsx`，移除 `StatCard` 的 `variant` 属性和所有颜色逻辑（border-l-4、颜色文字），缩小 padding 和字号
  - [x] 5.2 从 `RiskControlStats` 类型中移除 `error_requests` 字段，移除错误率卡片

- [x] Task 6: 前端 (default theme) — 多IP条目直显用户名
  - [x] 6.1 修改 `types.ts`，`IpAccountStat` 新增 `user_names` 字段
  - [x] 6.2 修改 `multi-account-ip-table.tsx`，将"关联账号数"列改为显示用户名列表（最多 3 个可见，其余淡化 + 点击展开），移除单独的"查看用户"按钮（改为行内展开）

- [x] Task 7: 前端 (default theme) — 移除错误数列
  - [x] 7.1 修改 `abnormal-users-table.tsx`，移除"错误数"列
  - [x] 7.2 修改 `ip-users-dialog.tsx`，移除"错误数"列

- [x] Task 8: 前端 (default theme) — 白名单管理 UI
  - [x] 8.1 在 `risk-control-page.tsx` 中新增"白名单管理"Tab
  - [x] 8.2 新增白名单管理组件（显示白名单列表、添加用户输入框、移除按钮）

- [x] Task 9: 前端 (classic theme) — 同步所有变更
  - [x] 9.1 更新 `SettingsRiskControl.jsx`：简化统计卡片、移除错误数列、多IP直显用户名、新增白名单管理

- [x] Task 10: i18n 翻译更新
  - [x] 10.1 更新 `web/default/src/i18n/locales/zh.json` 新增白名单相关翻译
  - [x] 10.2 更新 `web/classic/src/i18n/locales/zh.json` 和 `en.json` 新增翻译

# Task Dependencies
- Task 2 depends on Task 1（白名单存储就绪后才能过滤）
- Task 3 独立
- Task 4 独立
- Task 5 独立
- Task 6 depends on Task 4（后端返回用户名后前端才能展示）
- Task 7 depends on Task 3（后端移除字段后前端同步）
- Task 8 depends on Task 1（白名单接口就绪后前端才能调用）
- Task 9 depends on Task 1-8（classic 主题同步所有变更）
- Task 10 独立（可在任意阶段完成）
