# Tasks

## Task 1: Default 主题 — 强制开启 IP 记录并隐藏开关
- [x] SubTask 1.1: 在 `web/default/src/features/profile/components/tabs/notification-tab.tsx` 中，隐藏 `record_ip_log` 的 Switch UI 元素（将包含该 Switch 的整个 `<div>` 块注释或条件渲染为不可见）
- [x] SubTask 1.2: 确保 `record_ip_log` 在设置初始化和加载时始终为 `true`（修改默认值和 `parsed` 赋值逻辑）
- [x] SubTask 1.3: 确保保存设置时 `record_ip_log` 始终发送 `true`

## Task 2: Classic 主题 — 强制开启 IP 记录并隐藏开关
- [ ] SubTask 2.1: 在 `web/classic/src/components/settings/personal/cards/NotificationSettings.jsx` 中，隐藏 `recordIpLog` 的 Switch UI 元素（隐藏隐私设置 Tab 中的 `Form.Switch` 组件）
- [ ] SubTask 2.2: 在 `web/classic/src/components/settings/PersonalSetting.jsx` 中，确保 `recordIpLog` 在状态初始化和加载时始终为 `true`
- [ ] SubTask 2.3: 确保保存设置时 `record_ip_log` 始终发送 `true`

## Task 3: Default 主题 — 统一错误提示替换
- [ ] SubTask 3.1: 创建一个工具函数 `generateErrorCode()` 生成 5 位随机大写字母错误代码，以及 `getCustomErrorMessage()` 返回 `涵冰api-错误提示喵：XXXXX` 格式的错误信息。可放在 `web/default/src/lib/` 下新建文件或扩展现有文件
- [ ] SubTask 3.2: 修改 `web/default/src/lib/api.ts` 中的 axios 响应拦截器，将所有 `toast.error(msg)` 中的 `msg` 替换为自定义错误消息（HTTP 错误和业务逻辑错误两处都要改）
- [ ] SubTask 3.3: 修改 `web/default/src/lib/handle-server-error.ts` 中的 `handleServerError` 函数，将 `toast.error(errMsg)` 替换为自定义错误消息
- [ ] SubTask 3.4: 检查 `web/default/src/features/playground/components/message-error.tsx` 中的错误展示，确保 Playground 中的错误也使用自定义格式

## Task 4: Classic 主题 — 统一错误提示替换
- [ ] SubTask 4.1: 创建一个工具函数 `generateErrorCode()` 和 `getCustomErrorMessage()`（与 Default 类似逻辑），放在 `web/classic/src/helpers/` 下
- [ ] SubTask 4.2: 修改 `web/classic/src/helpers/utils.jsx` 中的 `showError` 函数，将所有 `Toast.error(...)` 调用中的错误消息替换为自定义错误消息
- [ ] SubTask 4.3: 修改 `web/classic/src/helpers/api.js` 中的 axios 拦截器错误处理（确认是否已通过 `showError` 统一处理）
- [ ] SubTask 4.4: 检查 `web/classic/src/hooks/playground/useApiRequest.jsx` 中的 Playground 错误处理，确保流式错误也使用自定义格式

## Task 5: Default 主题 — 添加 QQ 群按钮
- [ ] SubTask 5.1: 在 `web/default/src/components/layout/components/app-header.tsx` 的右侧按钮组中添加 QQ 群按钮（链接到 `https://qm.qq.com/q/KbbU3BMdO2`，新标签页打开）
- [ ] SubTask 5.2: 在 `web/default/src/components/layout/components/public-header.tsx` 的桌面端导航区添加 QQ 群按钮
- [ ] SubTask 5.3: 确保按钮样式与 Default 主题风格一致（使用 Radix UI Button 或现有样式模式）

## Task 6: Classic 主题 — 添加 QQ 群按钮
- [x] SubTask 6.1: 在 `web/classic/src/components/layout/headerbar/ActionButtons.jsx` 的操作按钮组中添加 QQ 群按钮（链接到 `https://qm.qq.com/q/KbbU3BMdO2`，新标签页打开）
- [x] SubTask 6.2: 确保按钮样式与 Classic 主题风格一致（使用 Semi Design 组件或现有样式模式）

# Task Dependencies
- Task 1 和 Task 2 可并行执行
- Task 3 和 Task 4 可并行执行
- Task 5 和 Task 6 可并行执行
- 所有 Task 之间无依赖关系，可全部并行
