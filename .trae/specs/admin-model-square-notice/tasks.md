# Tasks

- [x] Task 1: 后端 — 添加 ModelSquareNotice 设置键和公开 API
  - [x] SubTask 1.1: 在 `model/option.go` 的 `InitOptionMap()` 中添加 `ModelSquareNotice` 默认值（空字符串）
  - [x] SubTask 1.2: 在 `router/api-router.go` 中添加 `GET /api/notice/model_square` 公开路由
  - [x] SubTask 1.3: 在 `controller/misc.go` 中添加 `GetModelSquareNotice` 控制器，从 `common.OptionMap` 读取并返回

- [x] Task 2: 默认主题 — 系统信息区域添加配置字段
  - [x] SubTask 2.1: 在 `types.ts` 的 `GeneralSettings` 中添加 `ModelSquareNotice: string` 字段
  - [x] SubTask 2.2: 在 `system-info-section.tsx` 的 Zod schema 中添加 `ModelSquareNotice` 字段
  - [x] SubTask 2.3: 在 `system-info-section.tsx` 的表单中添加 Textarea 控件，位于 Notice 字段之后

- [x] Task 3: 经典主题 — 其他设置区域添加配置字段
  - [x] SubTask 3.1: 在 `OtherSetting.jsx` 的 inputs state 中添加 `ModelSquareNotice` 字段
  - [x] SubTask 3.2: 在通用设置区域添加 Textarea 编辑框和提交按钮

- [x] Task 4: 模型广场页面 — 动态获取提示内容
  - [x] SubTask 4.1: 在 `pricing/api.ts` 中添加 `getModelSquareNotice()` API 调用
  - [x] SubTask 4.2: 在 `pricing/hooks/` 下创建 `use-model-square-notice.ts` hook
  - [x] SubTask 4.3: 在 `pricing/index.tsx` 中使用 hook 获取提示内容，替换硬编码 Alert

- [x] Task 5: i18n 翻译
  - [x] SubTask 5.1: 在 6 个语言文件中添加新翻译键（设置标签、描述等）

- [x] Task 6: 验证
  - [x] SubTask 6.1: VS Code diagnostics 检查所有修改文件无 TypeScript 错误
  - [x] SubTask 6.2: 后端代码语法检查

# Task Dependencies
- Task 2 depends on Task 1（前端需要知道设置键名）
- Task 3 depends on Task 1（同上）
- Task 4 depends on Task 1（前端 API 需要后端接口就绪）
- Task 5 depends on Task 2, Task 3（翻译需要知道具体的 i18n 键名）
- Task 6 depends on Task 1-5（验证需要所有代码完成）
