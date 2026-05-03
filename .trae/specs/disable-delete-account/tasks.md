# Tasks

- [x] Task 1: 禁用 Classic 前端的删除账户按钮
  - [x] SubTask 1.1: 在 `AccountManagement.jsx` 中将删除账户按钮添加 `disabled` 属性，使其不可点击
  - [x] SubTask 1.2: 更新按钮样式，添加灰色不可用状态样式（如 `opacity-50 cursor-not-allowed`），并移除 hover 效果
  - [x] SubTask 1.3: 移除按钮的 `onClick` 事件处理（或在 disabled 时阻止触发）

- [x] Task 2: 禁用 Default 前端的删除账户按钮
  - [x] SubTask 2.1: 在 `profile-security-card.tsx` 中将 Delete Account 操作项设置为 disabled 状态
  - [x] SubTask 2.2: 更新按钮样式，添加灰色不可用状态样式（如 `opacity-50 cursor-not-allowed pointer-events-none`），并移除 hover 效果
  - [x] SubTask 2.3: 阻止点击时触发对话框打开（不调用 `dialogs.open('delete')`）

- [x] Task 3: 验证
  - [x] SubTask 3.1: 确认 Classic 前端删除账户按钮为灰色不可点击
  - [x] SubTask 3.2: 确认 Default 前端 Delete Account 操作项为灰色不可点击
