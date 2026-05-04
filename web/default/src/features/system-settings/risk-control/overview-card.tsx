import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import {
  Users,
  Activity,
  Network,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  XCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getRiskControlStats } from './api'
import type { RiskControlStats } from './types'

type StatCardProps = {
  title: string
  value: number | string
  icon: React.ReactNode
  variant?: 'default' | 'warning' | 'danger'
}

function StatCard({ title, value, icon, variant = 'default' }: StatCardProps) {
  const borderColor =
    variant === 'danger'
      ? 'border-l-red-500'
      : variant === 'warning'
        ? 'border-l-amber-500'
        : 'border-l-blue-500'

  return (
    <Card className={`border-l-4 ${borderColor}`}>
      <CardContent className='flex items-center gap-4 py-4'>
        <div className='text-muted-foreground'>{icon}</div>
        <div>
          <p className='text-muted-foreground text-sm'>{title}</p>
          <p className='text-2xl font-bold'>{value}</p>
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

  const errorRate =
    stats.total_requests > 0
      ? ((stats.error_requests / stats.total_requests) * 100).toFixed(2)
      : '0'

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>{t('Risk Control Overview')}</CardTitle>
        </CardHeader>
      </Card>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title={t('Total Users')}
          value={stats.total_users}
          icon={<Users className='h-5 w-5' />}
        />
        <StatCard
          title={t('Active Users')}
          value={stats.active_users}
          icon={<Activity className='h-5 w-5' />}
        />
        <StatCard
          title={t('Total Requests')}
          value={stats.total_requests.toLocaleString()}
          icon={<BarChart3 className='h-5 w-5' />}
        />
        <StatCard
          title={t('Error Rate')}
          value={`${errorRate}%`}
          icon={<XCircle className='h-5 w-5' />}
          variant={Number(errorRate) > 5 ? 'danger' : 'default'}
        />
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <StatCard
          title={t('Suspicious IPs')}
          value={stats.suspicious_ips}
          icon={<Network className='h-5 w-5' />}
          variant={stats.suspicious_ips > 0 ? 'warning' : 'default'}
        />
        <StatCard
          title={t('Multi-IP Users')}
          value={stats.multi_ip_users}
          icon={<AlertTriangle className='h-5 w-5' />}
          variant={stats.multi_ip_users > 0 ? 'warning' : 'default'}
        />
        <StatCard
          title={t('High Quota Users')}
          value={stats.high_quota_users}
          icon={<TrendingUp className='h-5 w-5' />}
          variant={stats.high_quota_users > 0 ? 'warning' : 'default'}
        />
      </div>
    </div>
  )
}
