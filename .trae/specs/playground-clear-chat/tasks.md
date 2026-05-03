# Tasks

- [x] Task 1: 在 playground-chat.tsx 添加清除按钮 UI
  - [x] SubTask 1.1: 在 PlaygroundChat 组件 props 中添加 `onClearMessages` 回调
  - [x] SubTask 1.2: 在聊天区域顶部（ConversationContent 内、消息列表上方）添加垃圾桶图标按钮
  - [x] SubTask 1.3: 按钮仅在 `messages.length > 0` 时显示
  - [x] SubTask 1.4: 按钮在 `isGenerating` 时禁用
  - [x] SubTask 1.5: 使用 Trash2 图标，样式与现有消息操作按钮一致

- [x] Task 2: 在 index.tsx 实现清除逻辑
  - [x] SubTask 2.1: 添加 `handleClearMessages` 函数，调用 `updateMessages([])`
  - [x] SubTask 2.2: 将回调传递给 PlaygroundChat 的 `onClearMessages` prop

- [x] Task 3: 验证
  - [x] SubTask 3.1: TypeScript 零错误（GetDiagnostics 确认）

# Task Dependencies
- Task 2 依赖 Task 1（需先定义 prop 接口）
- Task 3 依赖 Task 1 和 Task 2
