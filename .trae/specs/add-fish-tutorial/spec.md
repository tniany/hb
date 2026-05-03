# 领取鱼干教程 - 产品需求文档

## Overview
- **Summary**: 在侧边栏添加"领取鱼干"入口，新增教程页面指导用户如何通过QQ机器人领取鱼干
- **Purpose**: 降低用户领取鱼干的门槛，通过清晰的步骤说明帮助用户完成绑定和签到流程
- **Target Users**: 所有已登录用户，特别是新用户

## Goals
- 在侧边栏添加"领取鱼干"导航入口
- 创建清晰、易懂的教程页面
- 指导用户完成绑定QQ机器人和签到流程
- 保持与现有页面风格一致

## Non-Goals (Out of Scope)
- 不实现绑定功能本身（仅提供教程）
- 不实现签到功能本身（仅提供教程）
- 不修改后端API或机器人逻辑
- 不添加动画或复杂交互效果

## Background & Context
- 项目使用React 19 + TanStack Router进行路由管理
- 侧边栏导航通过`useSidebarData` hook定义
- 页面需要认证后才能访问（使用`_authenticated`路由前缀）
- 项目支持多语言（i18n），但本次需求仅需中文

## Functional Requirements
- **FR-1**: 在侧边栏"Personal"组中添加"领取鱼干"菜单项
- **FR-2**: 创建`/claim-fish`路由页面
- **FR-3**: 教程页面包含以下步骤说明：
  - 加入交流群
  - 找到Bot机器人并私聊
  - 发送绑定指令`/绑定 你的id 你的系统令牌`
  - 解释ID和系统令牌的获取方式
  - 签到方法：群聊发送`/签到`
- **FR-4**: 页面使用卡片式布局展示步骤
- **FR-5**: 页面风格与现有页面一致

## Non-Functional Requirements
- **NFR-1**: 页面响应式设计，适配桌面和移动端
- **NFR-2**: 文字清晰易读，步骤编号明确
- **NFR-3**: 页面加载速度与现有页面一致

## Constraints
- **Technical**: 使用现有UI组件库（Radix UI + Tailwind CSS）
- **Business**: 仅需中文教程，无需多语言支持
- **Dependencies**: 无外部API依赖

## Assumptions
- 用户已登录系统
- 侧边栏使用现有导航结构
- 不需要后端支持

## Acceptance Criteria

### AC-1: 侧边栏入口
- **Given**: 用户已登录并看到侧边栏
- **When**: 查看"Personal"导航组
- **Then**: 显示"领取鱼干"菜单项，图标为鱼或相关图标
- **Verification**: `human-judgment`

### AC-2: 路由访问
- **Given**: 用户点击"领取鱼干"菜单项
- **When**: 页面加载完成
- **Then**: 路由跳转到`/claim-fish`，显示教程页面
- **Verification**: `programmatic`

### AC-3: 教程内容完整性
- **Given**: 用户查看教程页面
- **When**: 滚动页面查看所有内容
- **Then**: 显示完整的绑定和签到步骤说明
- **Verification**: `human-judgment`

### AC-4: 页面风格一致性
- **Given**: 用户查看教程页面
- **When**: 与其他页面对比
- **Then**: 页面风格、字体、颜色与现有页面保持一致
- **Verification**: `human-judgment`

## Open Questions
- [ ] 交流群的具体信息是否需要填写（如群号）？
- [ ] 是否需要添加"复制指令"按钮方便用户操作？
- [ ] 教程页面是否需要返回按钮或面包屑导航？
