# Tasks

- [x] Task 1: 为 Common Logs 的 User 列添加移动端 badge 支持
  - [x] SubTask 1.1: 将 `common-logs-columns.tsx` 中 User 列的 meta 从 `{ label: t('User') }` 修改为 `{ label: t('User'), mobileBadge: true }`
  - [x] SubTask 1.2: 调整 User Cell 的渲染，使其在 badge 位置（CompactRow 标题行右侧）呈现紧凑的 Avatar + 用户名样式，保持与 PC 端信息一致

- [x] Task 2: 为 Task Logs 的 User 列添加移动端 badge 支持
  - [x] SubTask 2.1: 将 `task-logs-columns.tsx` 中 User 列的 meta 从 `{ label: t('User') }` 修改为 `{ label: t('User'), mobileBadge: true }`
  - [x] SubTask 2.2: 调整 User Cell 的渲染，使其在 badge 位置呈现紧凑的 Avatar + 用户名样式

- [x] Task 3: 验证构建和类型检查
  - [x] SubTask 3.1: IDE 诊断确认无类型错误

# Task Dependencies

- Task 1 和 Task 2 可以并行执行
- Task 3 依赖 Task 1 和 Task 2 完成
