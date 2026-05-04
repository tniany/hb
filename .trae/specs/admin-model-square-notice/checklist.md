# 模型广场提示信息管理后台配置 - 验证清单

## 后端验证
- [x] `model/option.go` 的 `InitOptionMap()` 包含 `ModelSquareNotice` 默认值
- [x] `router/api-router.go` 注册了 `GET /api/notice/model_square` 公开路由
- [x] `controller/misc.go` 中 `GetModelSquareNotice` 正确返回提示内容

## 默认主题验证
- [x] `types.ts` 的 `GeneralSettings` 包含 `ModelSquareNotice` 字段
- [x] `system-info-section.tsx` 表单中显示模型广场提示信息编辑框
- [ ] 编辑并保存后，设置通过 `PUT /api/option/` 正确持久化

## 经典主题验证
- [x] `OtherSetting.jsx` 中显示模型广场提示信息编辑框
- [ ] 编辑并保存后，设置通过 `PUT /api/option/` 正确持久化

## 模型广场页面验证
- [x] 页面动态获取提示内容（非硬编码）
- [x] 有提示内容时，蓝色信息横幅正常显示
- [x] 提示内容为空时，横幅不显示
- [x] i18n 翻译文件 JSON 格式正确，6 个语言均已更新

## 代码验证
- [x] 所有修改文件 VS Code diagnostics 无 TypeScript 错误
- [x] 后端 Go 代码语法正确
