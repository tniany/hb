# Checklist

- [x] profile-header.tsx 中在 StatusBadge 后添加了 `ID: {profile.id}` 标签
- [x] 使用防御性渲染 `profile.id &&` 避免 ID 为 0 时显示空标签
- [x] ID 标签样式使用 `text-muted-foreground rounded-full border font-mono text-xs`，与页面整体风格一致
- [x] TypeScript 零错误（GetDiagnostics 确认）
- [x] 功能与经典主题 UserInfoHeader.jsx 中的 `ID: {userState?.user?.id}` 一致
