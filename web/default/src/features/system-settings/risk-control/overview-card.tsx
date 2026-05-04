import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import {
  Users,
  Activity,
  Network,
  TrendingUp,
  AlertTriangle,
  BarChart3,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getRiskControlStats } from './api'
import type { RiskControlStats } from './types'

type StatCardProps = {
  title: string
  value: number | string
  icon: React.ReactNode
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className='flex items-center gap-3 py-2'>
        <div className='text-muted-foreground'>{icon}</div>
        <div>
          <p className='text-muted-foreground text-xs'>{title}</p>
          <p className='text-lg font-bold'>{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

type OverviewCardProps = {
  startTimestamp?: number
  endTimestamp?: number
}

export function OverviewCard({
  startTimestamp,
  endTimestamp,
}: OverviewCardProps) {
  const { t } = useTranslation()

  const { data: stats, isLoading } = useQuery<RiskControlStats>({
    queryKey: ['risk-control-stats', startTimestamp, endTimestamp],
    queryFn: () => getRiskControlStats(startTimestamp, endTimestamp),
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('Risk Control Overview')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-muted-foreground py-8 text-center'>
            {t('Loading...')}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) return null

  return (
    <div className='grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6'>
      <StatCard
        title={t('Total Users')}
        value={stats.total_users}
        icon={<Users className='h-4 w-4' />}
      />
      <StatCard
        title={t('Active Users')}
        value={stats.active_users}
        icon={<Activity className='h-4 w-4' />}
      />
      <StatCard
        title={t('Total Requests')}
        value={stats.total_requests.toLocaleString()}
        icon={<BarChart3 className='h-4 w-4' />}
      />
      <StatCard
        title={t('Suspicious IPs')}
        value={stats.suspicious_ips}
        icon={<Network className='h-4 w-4' />}
      />
      <StatCard
        title={t('Multi-IP Users')}
        value={stats.multi_ip_users}
        icon={<AlertTriangle className='h-4 w-4' />}
      />
      <StatCard
        title={t('High Quota Users')}
        value={stats.high_quota_users}
        icon={<TrendingUp className='h-4 w-4' />}
      />
    </div>
  )
}
