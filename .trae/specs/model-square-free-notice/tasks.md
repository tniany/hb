# Tasks

- [x] Task 1: 在模型广场页面添加免费调用提示横幅
  - [x] SubTask 1.1: 在 `pricing/index.tsx` 的 `<main>` 区域内、`<PricingToolbar>` 上方添加 `Alert` 组件，显示提示信息
  - [x] SubTask 1.2: 使用项目现有 `Alert` + `Info` 图标，采用蓝色信息风格（通过 className 自定义颜色）
  - [x] SubTask 1.3: 提示文字使用 `useTranslation` 的 `t()` 函数进行 i18n

- [x] Task 2: 添加 i18n 翻译
  - [x] SubTask 2.1: 在 `en.json` 中添加英文翻译键
  - [x] SubTask 2.2: 在 `zh.json` 中添加中文翻译（作为 fallback）
  - [x] SubTask 2.3: 在 `fr.json`、`ja.json`、`ru.json`、`vi.json` 中添加对应语言翻译

- [x] Task 3: 验证
  - [x] SubTask 3.1: 运行 typecheck 确认无编译错误
  - [x] SubTask 3.2: 检查 VS Code diagnostics 无 TypeScript 错误（所有 7 个文件 0 diagnostics）
  - [x] SubTask 3.3: 视觉确认提示横幅在页面中的位置和样式

# Task Dependencies
- Task 2 depends on Task 1（翻译需要知道具体使用的 i18n 键名）
- Task 3 depends on Task 1, Task 2（验证需要所有代码完成）
