# 领取鱼干教程 - 实现计划

## Task 1: 在侧边栏添加"领取鱼干"入口 ✅
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 在`use-sidebar-data.ts`的"Personal"组中添加新菜单项
  - 图标使用`Fish`（来自lucide-react）
  - URL设置为`/claim-fish`
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `programmatic` TR-1.1: 侧边栏渲染时包含"领取鱼干"菜单项
  - `human-judgement` TR-1.2: 菜单项显示鱼图标，文字为"领取鱼干"
- **Notes**: 无需添加到`URL_TO_CONFIG_MAP`，默认对所有用户可见
- **Status**: ✅ 已完成

## Task 2: 创建教程页面路由 ✅
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 创建`src/routes/_authenticated/claim-fish/index.tsx`
  - 使用`createFileRoute`定义路由
  - 路由组件为`ClaimFishTutorial`
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `programmatic` TR-2.1: 访问`/claim-fish`路由能正常渲染页面
  - `programmatic` TR-2.2: 页面需要登录才能访问
- **Notes**: 路由文件需添加到`routeTree.gen.ts`（TanStack Router自动生成）
- **Status**: ✅ 已完成

## Task 3: 创建教程页面组件 ✅
- **Priority**: P0
- **Depends On**: Task 2
- **Description**:
  - 创建`src/features/claim-fish/components/claim-fish-tutorial.tsx`
  - 使用卡片式布局展示步骤
  - 包含AppHeader组件保持页面头部一致
  - 页面结构：
    - 标题：领取鱼干教程
    - 步骤1：加入交流群
    - 步骤2：找到Bot机器人并私聊
    - 步骤3：发送绑定指令
    - 步骤4：签到方法
  - 使用现有UI组件（Card, Badge等）
- **Acceptance Criteria Addressed**: AC-3, AC-4
- **Test Requirements**:
  - `human-judgement` TR-3.1: 教程内容完整，包含所有必要步骤
  - `human-judgement` TR-3.2: 页面风格与现有页面一致
  - `programmatic` TR-3.3: 页面正常渲染，无控制台错误
- **Notes**: 参考profile页面的布局结构

## Task 4: 添加国际化翻译
- **Priority**: P1
- **Depends On**: Task 3
- **Description**:
  - 在`src/i18n/locales/zh.json`中添加相关翻译
  - 在`src/i18n/locales/en.json`中添加英文翻译
  - 翻译键：侧边栏菜单名、教程标题、步骤说明等
- **Acceptance Criteria Addressed**: AC-1, AC-3
- **Test Requirements**:
  - `programmatic` TR-4.1: 翻译文件JSON格式正确
  - `human-judgement` TR-4.2: 翻译内容准确自然
- **Notes**: 英文翻译可作为占位符，主要内容为中文

## Task 5: 验证和测试 ✅
- **Priority**: P0
- **Depends On**: Task 4
- **Description**:
  - 运行构建验证无错误
  - 检查侧边栏显示正常
  - 检查页面内容完整性
  - 检查页面样式一致性
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4
- **Test Requirements**:
  - `programmatic` TR-5.1: `bun run build`成功，无TypeScript错误
  - `human-judgement` TR-5.2: 侧边栏菜单项位置合理
  - `human-judgement` TR-5.3: 页面内容清晰易懂
- **Notes**: 最终验证步骤

## Task Dependencies
- Task 2 depends on Task 1 (路由需要菜单项)
- Task 3 depends on Task 2 (组件需要路由)
- Task 4 depends on Task 3 (翻译需要组件)
- Task 5 depends on Task 4 (验证需要所有任务完成)
