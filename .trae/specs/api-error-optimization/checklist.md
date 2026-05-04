# Checklist

- [ ] 后端 `model/option.go` 正确初始化 `MaintenanceEnabled` 和 `ApiErrorPrefix` 选项
- [ ] 后端 `common/constants.go` 声明 `MaintenanceEnabled` 变量
- [ ] 后端维护模式中间件在开启时返回 HTTP 503 + "涵冰api-正在维护"
- [ ] 后端维护中间件已注册到所有 relay 路由组
- [ ] 后端 `controller/relay.go` 在错误发生时生成 5 位字母错误代码
- [ ] 后端错误消息被替换为 `{前缀}{代码}` 格式
- [ ] 后端错误代码记录到日志 `other` 字段的 `error_lookup_code` 中
- [ ] 后端非流式和流式（控制器层面）错误均正确处理
- [ ] 前端(default) `custom-error.ts` 不再生成随机代码
- [ ] 前端(default) 从错误响应 `error.code` 提取后端错误代码
- [ ] 前端(default) 维护模式开关可正常切换
- [ ] 前端(default) 自定义错误前缀可正常保存
- [ ] 前端(default) 错误日志显示错误代码列
- [ ] 前端(classic) 同步了所有前端改动
- [ ] i18n 翻译完整覆盖所有新增文本
- [ ] 管理员可以通过错误代码在日志中搜索到原始报错
