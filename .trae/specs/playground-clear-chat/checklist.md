# Checklist

- [x] playground-chat.tsx 中 PlaygroundChatProps 添加了 `onClearMessages` 回调 prop
- [x] 聊天区域顶部添加了 Trash2 图标按钮
- [x] 按钮仅在有消息时显示（`messages.length > 0`）
- [x] 按钮在生成中时禁用（`isGenerating`）
- [x] 点击按钮直接调用 `onClearMessages()`，无确认弹窗
- [x] index.tsx 中实现了 `handleClearMessages` 调用 `updateMessages([])`
- [x] TypeScript 零错误（GetDiagnostics 确认）
