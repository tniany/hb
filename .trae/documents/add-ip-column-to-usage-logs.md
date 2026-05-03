# 在新版主题使用日志表格中添加 IP 列

## 背景

新版主题（web/default）的使用日志表格目前缺少 IP 地址列，而经典主题（web/classic）已经有此功能。后端 API 和前端数据模型都已包含 `ip` 字段，数据可直接使用。

## 需要修改的文件

### 1. `web/default/src/features/usage-logs/components/columns/common-logs-columns.tsx`

在 `useCommonLogsColumns` 函数中添加 IP 列：

- **位置**：插入在管理员列（Channel/User）之后、Token 列之前
- **显示逻辑**（与 Classic 主题一致）：
  - 消费日志（type=2）：有 IP 值就显示
  - 错误日志（type=5）：有 IP 值就显示
  - 充值日志（type=1）：仅管理员可见且有 IP 值时显示
  - 其他类型：不显示
- **样式**：使用琥珀色（amber）药丸样式，与详情弹窗中的 Globe 图标风格保持一致
- **交互**：点击可复制 IP 地址
- **列头**：使用 `DataTableColumnHeader`，标题为 `t('IP')`，附带 Tooltip 说明 IP 记录行为
- **敏感数据**：遵循 `sensitiveVisible` 设置，不可见时显示 `••••`
- **响应式**：设置 `mobileHidden: true`（桌面端优先，移动端隐藏）
- **i18n key**：新增 `"IP is only recorded for usage and error logs when IP recording is enabled in user settings"` 用于列头 Tooltip 提示

### 2. i18n 翻译文件

在以下 6 个翻译文件中添加新的 Tooltip 提示翻译 key：

- `web/default/src/i18n/locales/en.json`
- `web/default/src/i18n/locales/zh.json`
- `web/default/src/i18n/locales/fr.json`
- `web/default/src/i18n/locales/ja.json`
- `web/default/src/i18n/locales/ru.json`
- `web/default/src/i18n/locales/vi.json`

新 key：`"IP is only recorded for usage and error logs when IP recording is enabled in user settings"`

对应翻译：
- **en**: "IP is only recorded for usage and error logs when IP recording is enabled in user settings"
- **zh**: "仅当用户设置开启IP记录时，才会记录使用和错误日志的IP地址"
- **fr**: "L'adresse IP n'est enregistrée que pour les journaux d'utilisation et d'erreurs lorsque l'enregistrement IP est activé dans les paramètres utilisateur"
- **ja**: "ユーザー設定でIP記録が有効な場合のみ、使用ログとエラログのIPアドレスが記録されます"
- **ru**: "IP-адрес записывается только для журналов использования и ошибок, когда запись IP включена в настройках пользователя"
- **vi**: "Địa chỉ IP chỉ được ghi lại cho nhật ký sử dụng và lỗi khi bật ghi IP trong cài đặt người dùng"

## 实现细节

### IP 列渲染逻辑

```tsx
// 在管理员列（Channel、User）push 之后，Token 列 push 之前插入
const ipColumn: ColumnDef<UsageLog> = {
  accessorKey: 'ip',
  header: ({ column }) => (
    <DataTableColumnHeader
      column={column}
      title={t('IP')}
    />
  ),
  // 列头附带 Tooltip 解释
  cell: ({ row }) => {
    const log = row.original
    const ip = row.getValue('ip') as string

    // 显示条件：消费/错误日志有IP值，或管理员查看充值日志有IP值
    const showIp =
      ((log.type === 2 || log.type === 5) && ip) ||
      (isAdmin && log.type === 1 && ip)

    if (!showIp) return null

    return (
      // 使用 amber 样式药丸，点击可复制
      // 尊重 sensitiveVisible 设置
    )
  },
  meta: { label: t('IP'), mobileHidden: true },
  size: 140,
}
```

### 需要导入的依赖

- `Globe` from `lucide-react`（用于列头 Tooltip 图标或单元格图标）
- `useUsageLogsContext` 已导入（用于 `sensitiveVisible`）
- `useCopyToClipboard` from `@/hooks/use-copy-to-clipboard`（用于点击复制）

## 验证

1. 运行 `bun run build` 确认无编译错误
2. 检查页面上 IP 列在管理员和非管理员视角下的显示
3. 确认消费日志、错误日志、充值日志的 IP 显示逻辑正确
4. 确认敏感数据模式下 IP 被遮蔽
5. 确认点击 IP 可复制
6. 运行 `bun run i18n:sync` 确保翻译文件同步
