import { createFileRoute } from '@tanstack/react-router'
import { RiskControlPage } from '@/features/system-settings/risk-control/risk-control-page'

export const Route = createFileRoute(
  '/_authenticated/system-settings/risk-control/'
)({
  component: RiskControlPage,
})
