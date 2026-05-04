import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatTimestampToDate, formatLogQuota } from '@/lib/format'
import { getMultiAccountIps } from './api'
import { IpUsersDialog } from './ip-users-dialog'
import type { IpAccountStat } from './types'

type MultiAccountIpTableProps = {
  startTimestamp?: number
  endTimestamp?: number
}

export function MultiAccountIpTable({
  startTimestamp,
  endTimestamp,
}: MultiAccountIpTableProps) {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [minAccounts, setMinAccounts] = useState(2)
  const [selectedIp, setSelectedIp] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: [
      'multi-account-ips',
      page,
      pageSize,
      minAccounts,
      startTimestamp,
      endTimestamp,
    ],
    queryFn: () =>
      getMultiAccountIps({
        page,
        page_size: pageSize,
        start_timestamp: startTimestamp,
        end_timestamp: endTimestamp,
        min_accounts: minAccounts,
      }),
  })

  const items: IpAccountStat[] = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / pageSize)

  return (
    <>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0'>
          <CardTitle>{t('Multi-Account IP Detection')}</CardTitle>
          <div className='flex items-center gap-2'>
            <span className='text-muted-foreground text-sm'>
              {t('Min Accounts')}
            </span>
            <Select
              value={String(minAccounts)}
              onValueChange={(v) => {
                setMinAccounts(Number(v))
                setPage(1)
              }}
            >
              <SelectTrigger className='h-8 w-20'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[2, 3, 4, 5, 10].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='text-muted-foreground py-8 text-center'>
              {t('Loading...')}
            </div>
          ) : items.length === 0 ? (
            <div className='text-muted-foreground py-8 text-center'>
              {t('No data')}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('IP Address')}</TableHead>
                    <TableHead>{t('Accounts')}</TableHead>
                    <TableHead>{t('Requests')}</TableHead>
                    <TableHead>{t('Quota')}</TableHead>
                    <TableHead>{t('Last Seen')}</TableHead>
                    <TableHead>{t('Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.ip}>
                      <TableCell className='font-mono'>{item.ip}</TableCell>
                      <TableCell>
                        <span className='font-semibold text-orange-500'>
                          {item.user_count}
                        </span>
                      </TableCell>
                      <TableCell>
                        {item.request_count.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {formatLogQuota(item.total_quota)}
                      </TableCell>
                      <TableCell>
                        {formatTimestampToDate(item.last_seen)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => setSelectedIp(item.ip)}
                        >
                          <Eye className='mr-1 h-4 w-4' />
                          {t('View Users')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className='mt-4 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <span className='text-muted-foreground text-sm'>
                    {t('Rows per page')}
                  </span>
                  <Select
                    value={String(pageSize)}
                    onValueChange={(v) => {
                      setPageSize(Number(v))
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className='h-8 w-20'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 20, 50].map((size) => (
                        <SelectItem key={size} value={String(size)}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-muted-foreground text-sm'>
                    {t('Page {{current}} of {{total}}', {
                      current: page,
                      total: totalPages || 1,
                    })}
                  </span>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                  >
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <IpUsersDialog
        ip={selectedIp}
        open={!!selectedIp}
        onOpenChange={(open) => {
          if (!open) setSelectedIp(null)
        }}
        startTimestamp={startTimestamp}
        endTimestamp={endTimestamp}
      />
    </>
  )
}
