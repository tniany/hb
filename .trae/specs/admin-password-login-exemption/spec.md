# 管理员密码登录豁免功能 Spec

## Why
当前系统在关闭账号密码登录（PasswordLoginEnabled=false）时，所有用户（包括管理员）都无法使用密码登录。这导致管理员在禁用普通用户密码登录后，自己也失去了密码登录能力，只能依赖 OAuth 等其他登录方式。需要允许管理员账号在密码登录关闭时仍可使用密码登录，以便进行系统管理和维护。

## What Changes
- **修改后端登录逻辑**：在 `controller/user.go` 的 Login 函数中，增加管理员角色判断，当 PasswordLoginEnabled 为 false 时，允许管理员（role >= RoleAdminUser）继续使用密码登录
- **修改前端设置界面提示**：在 basic-auth-section.tsx 中更新 Password Login 开关的描述文案，明确说明关闭后管理员仍可登录
- **添加国际化文案**：为新增的提示信息添加多语言支持（en, zh）

## Impact
- Affected specs: 用户认证系统、权限管理
- Affected code:
  - `controller/user.go` - Login 函数（核心逻辑修改）
  - `web/default/src/features/system-settings/auth/basic-auth-section.tsx` - 前端设置界面
  - `web/default/src/i18n/locales/en.json` - 英文翻译
  - `web/default/src/i18n/locales/zh.json` - 中文翻译
  - 可能影响: `web/classic/src/components/settings/SystemSetting.jsx` - 经典版前端

## ADDED Requirements

### Requirement: 管理员密码登录豁免
系统 SHALL 在 PasswordLoginEnabled 设置为 false 时，允许管理员角色用户（role >= 10）继续使用账号密码登录。

#### Scenario: 管理员在密码登录关闭时成功登录
- **WHEN** PasswordLoginEnabled = false 且用户 role >= RoleAdminUser (10)
- **AND** 用户提交正确的用户名和密码
- **THEN** 系统 SHALL 允许登录并返回成功的响应

#### Scenario: 普通用户在密码登录关闭时被拒绝
- **WHEN** PasswordLoginEnabled = false 且用户 role < RoleAdminUser (10)
- **AND** 用户尝试使用密码登录
- **THEN** 系统 SHALL 返回"密码登录已禁用"错误消息

### Requirement: 前端设置提示优化
系统 SHALL 在 Password Login 设置项的描述中明确告知管理员：即使关闭此选项，管理员账号仍可使用密码登录。

#### Scenario: 查看设置页面
- **WHEN** 管理员访问系统设置的 Basic Authentication 部分
- **THEN** Password Login 选项的描述文字 SHALL 包含"管理员不受此限制"或类似说明

## MODIFIED Requirements

### Requirement: 登录验证逻辑
**原始行为**: 当 PasswordLoginEnabled = false 时，所有用户的密码登录请求都会被拒绝。

**修改后行为**:
- 如果 PasswordLoginEnabled = true：所有用户均可使用密码登录（保持原有行为）
- 如果 PasswordLoginEnabled = false：
  - 普通用户（role < 10）：被拒绝，返回错误消息
  - 管理员用户（role >= 10）：允许继续登录流程

**实现位置**: `controller/user.go` 的 `Login()` 函数，第 33-36 行

**伪代码**:
```go
func Login(c *gin.Context) {
    // 解析请求数据
    var loginRequest LoginRequest
    err := json.NewDecoder(c.Request.Body).Decode(&loginRequest)
    if err != nil {
        common.ApiErrorI18n(c, i18n.MsgInvalidParams)
        return
    }

    // 验证用户凭据
    username := loginRequest.Username
    password := loginRequest.Password
    if username == "" || password == "" {
        common.ApiErrorI18n(c, i18n.MsgInvalidParams)
        return
    }

    user := model.User{
        Username: username,
        Password: password,
    }
    err = user.ValidateAndFill()
    if err != nil {
        // 处理验证错误...
        return
    }

    // 检查密码登录是否启用（管理员豁免）
    if !common.PasswordLoginEnabled && user.Role < common.RoleAdminUser {
        common.ApiErrorI18n(c, i18n.MsgUserPasswordLoginDisabled)
        return
    }

    // 继续后续登录流程（2FA检查、session设置等）
    ...
}
```

## REMOVED Requirements
无

## 安全考虑
1. **最小权限原则**: 仅管理员（role >= 10）获得豁免权，普通用户无法绕过限制
2. **向后兼容**: 不影响现有管理员账户的登录流程，仅在 PasswordLoginEnabled=false 时生效
3. **审计日志**: 建议在管理员通过豁免登录时记录日志（可选增强）
