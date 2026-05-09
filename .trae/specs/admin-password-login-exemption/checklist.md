# Checklist: 管理员密码登录豁免功能

## 后端逻辑验证
- [x] Login 函数将 PasswordLoginEnabled 检查移至用户验证之后
- [x] 新增管理员角色判断：`user.Role < common.RoleAdminUser`
- [x] PasswordLoginEnabled=true 时，所有用户可正常登录
- [x] PasswordLoginEnabled=false 时，普通用户（role<10）收到错误消息
- [x] PasswordLoginEnabled=false 时，管理员（role>=10）可成功登录
- [x] 错误消息使用正确的 i18n 键（MsgUserPasswordLoginDisabled）
- [x] 登录成功后的 session 设置和响应格式未受影响

## 前端界面验证
- [x] Password Login 设置项显示更新的描述文案
- [x] 文案明确说明管理员不受此限制
- [x] 文案使用 i18n 翻译键，非硬编码文本
- [x] UI 布局和样式未受负面影响

## 国际化验证
- [x] 英文翻译文件包含新文案键值对
- [x] 中文翻译文件包含对应的中文翻译
- [x] 翻译键名符合项目命名规范
- [x] 前端组件正确引用翻译键

## 代码质量验证
- [x] Go 代码编译无错误（GetDiagnostics 通过）
- [x] TypeScript 类型检查通过（GetDiagnostics 通过）
- [x] 代码遵循项目规范（AGENTS.md 规则）
- [x] 无引入的安全漏洞
- [x] 向后兼容性保持（现有功能不受影响）

## 边界情况测试
- [x] Root User（role=100）在 PasswordLoginEnabled=false 时可登录
- [x] Admin User（role=10）在 PasswordLoginEnabled=false 时可登录
- [x] Common User（role=1）在 PasswordLoginEnabled=false 时被正确拒绝
- [x] 空用户名/密码仍被正确拦截
- [x] 2FA 验证流程与豁免逻辑兼容
