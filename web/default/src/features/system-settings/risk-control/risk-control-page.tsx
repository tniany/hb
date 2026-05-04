import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DateTimePicker } from '@/components/datetime-picker'
import { Button } from '@/components/ui/button'
import { OverviewCard } from './overview-card'
import { MultiAccountIpTable } from './multi-account-ip-table'
import { AbnormalUsersTable } from './abnormal-users-table'

const getDateDaysAgo = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

export function RiskControlPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('overview')
  const [startDate, setStartDate] = useState<Date>(getDateDaysAgo(7))
  const [endDate, setEndDate] = useState<Date>(new Date())

  const startTimestamp = Math.floor(startDate.getTime() / 1000)
  const endTimestamp = Math.floor(endDate.getTime() / 1000)

  const quickRanges = [
    { label: t('Last 24h'), days: 1 },
    { label: t('Last 7 days'), days: 7 },
    { label: t('Last 30 days'), days: 30 },
    { label: t('Last 90 days'), days: 90 },
  ]

  return (
    <div className='flex h-full w-full flex-1 flex-col'>
      <div className='faded-bottom h-full w-full overflow-y-auto scroll-smooth pe-4 pb-12'>
        <div className='space-y-4'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                {t('Risk Control')}
              </h2>
              <p className='text-muted-foreground text-sm'>
                {t(
                  'Detect multi-account users, abnormal usage patterns, and potential abuse'
                )}
              </p>
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              {quickRanges.map((range) => (
                <Button
                  key={range.days}
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setStartDate(getDateDaysAgo(range.days))
                    setEndDate(new Date())
                  }}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4'>
            <div className='flex items-center gap-2'>
              <span className='text-muted-foreground text-sm'>
                {t('Start')}
              </span>
              <DateTimePicker
                date={startDate}
                setDate={(d) => d && setStartDate(d)}
              />
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-muted-foreground text-sm'>
                {t('End')}
              </span>
              <DateTimePicker
                date={endDate}
                setDate={(d) => d && setEndDate(d)}
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value='overview'>{t('Overview')}</TabsTrigger>
              <TabsTrigger value='multi-account'>
                {t('Multi-Account IPs')}
              </TabsTrigger>
              <TabsTrigger value='abnormal'>
                {t('Abnormal Users')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value='overview'>
              <OverviewCard
                startTimestamp={startTimestamp}
                endTimestamp={endTimestamp}
              />
            </TabsContent>
            <TabsContent value='multi-account'>
              <MultiAccountIpTable
                startTimestamp={startTimestamp}
                endTimestamp={endTimestamp}
              />
            </TabsContent>
            <TabsContent value='abnormal'>
              <AbnormalUsersTable
                startTimestamp={startTimestamp}
                endTimestamp={endTimestamp}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
