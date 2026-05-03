# Tasks

- [x] Task 1: 在 profile-header.tsx 中添加用户ID显示
  - [x] SubTask 1.1: 确认 UserProfile 类型中 id 字段的类型和来源
  - [x] SubTask 1.2: 在 StatusBadge 后添加 ID 标签，使用 `profile.id` 渲染
  - [x] SubTask 1.3: 添加防御性条件渲染（`profile.id &&`），避免 ID 为 0 时显示
  - [x] SubTask 1.4: 使用等宽字体 + 圆角边框样式，与角色标签视觉风格一致

- [x] Task 2: 验证
  - [x] SubTask 2.1: TypeScript 零错误（GetDiagnostics 确认）
  - [x] SubTask 2.2: 与经典主题 UserInfoHeader.jsx 的 ID 显示对比确认功能一致

# Task Dependencies
- Task 2 依赖 Task 1（验证需实现完成）
