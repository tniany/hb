/**
 * Home page constants
 * All hardcoded data for home page sections
 */
import { type TFunction } from 'i18next'

// Layout - Main base classes
export const MAIN_BASE_CLASSES = 'bg-background text-foreground w-full'

// Hero section - AI Applications (Left side)
export const AI_APPLICATIONS = [
  'LobeHub.Color',
  'Dify.Color',
  'OpenWebUI',
  'Cline',
] as const

// Hero section - AI Models (Right side)
export const AI_MODELS = [
  'Qwen.Color',
  'DeepSeek.Color',
  'Doubao.Color',
  'OpenAI',
  'Claude.Color',
  'Gemini.Color',
] as const

// Hero section - Gateway Features
export const GATEWAY_FEATURES = [
  'Cost Tracking',
  'Model Access',
  'Guardrails',
  'Observability',
  'Budgets',
  'Load Balancing',
  'Rate Limiting',
  'Token Mgmt',
  'Prompt Caching',
  'Pass-Through',
] as const

// Stats section - Default statistics
export const DEFAULT_STATS = [
  {
    value: '50',
    suffix: '+',
    description: '集成上游服务',
  },
  {
    value: '100',
    suffix: '+',
    description: '模型计费支持',
  },
  {
    value: '50',
    suffix: '+',
    description: '兼容API路由',
  },
  {
    value: '10',
    suffix: '+',
    description: '调度控制策略',
  },
] as const

// Features section - Default features
export const DEFAULT_FEATURES = [
  {
    title: '极速响应',
    description:
      '优化的网络架构，确保毫秒级响应速度',
    iconName: 'Zap',
  },
  {
    title: '安全可靠',
    description:
      '企业级安全保障，完善的权限管理体系',
    iconName: 'Shield',
  },
  {
    title: '全球覆盖',
    description: '多区域部署，提供稳定的全球访问',
    iconName: 'Globe',
  },
  {
    title: '开发者友好',
    description: '兼容主流AI应用工作流的API路由',
    iconName: 'Code',
  },
  {
    title: '高性能',
    description: '支持高并发，自动负载均衡',
    iconName: 'Gauge',
  },
  {
    title: '透明计费',
    description: '按量付费，实时用量监控',
    iconName: 'DollarSign',
  },
  {
    title: '团队协作',
    description: '多用户管理，灵活权限分配',
    iconName: 'Users',
  },
  {
    title: '开源项目',
    description: '社区驱动，可自托管、可扩展',
    iconName: 'HeartHandshake',
  },
] as const

export function getGatewayFeatures(t: TFunction) {
  return GATEWAY_FEATURES.map((feature) => t(feature))
}

export function getDefaultStats(t: TFunction) {
  return DEFAULT_STATS.map((stat) => ({
    ...stat,
    description: stat.description ? t(stat.description) : undefined,
  }))
}

export function getDefaultFeatures(t: TFunction) {
  return DEFAULT_FEATURES.map((feature) => ({
    ...feature,
    title: t(feature.title),
    description: t(feature.description),
  }))
}
