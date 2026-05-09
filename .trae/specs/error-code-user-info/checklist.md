# Checklist

- [x] ErrorMapping 模型包含 Username 字段，类型为 string，有 gorm tag（size:128, index）
- [x] GORM AutoMigrate 能自动为三种数据库（SQLite/MySQL/PostgreSQL）添加 username 列
- [x] relay.go 创建 ErrorMapping 时正确写入 Username（从 gin Context 获取）
- [x] 后端 GetErrorMappings API 支持 username 查询参数进行筛选
- [x] 前端错误码映射列表显示"用户"列，格式为 `username (user_id)`
- [x] 前端错误码映射搜索详情展示触发用户信息
- [x] 前端错误码映射 Tab 新增用户名筛选输入框
- [x] 前端 API 函数 getErrorMappings 支持 username 参数
- [x] 所有新增 UI 文本有 i18n 翻译（zh/en/fr/ja/ru/vi）
- [x] 仅修改默认主题，经典主题不受影响
