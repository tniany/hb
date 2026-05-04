import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Ban } from 'lucide-react'
import { toast } from 'sonner'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatTimestampToDate, formatLogQuota } from '@/lib/format'
import { getBurstUsers, banUser } from './api'
import type { AbnormalUserStat } from './types'

type BurstUsersTableProps = {
  startTimestamp?: number
  endTimestamp?: number
}

export function BurstUsersTable({
  startTimestamp,
  endTimestamp,
}: BurstUsersTableProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [burstThreshold, setBurstThreshold] = useState(50)
  const [banTarget, setBanTarget] = useState<AbnormalUserStat | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: [
      'burst-users',
      page,
      pageSize,
      burstThreshold,
      startTimestamp,
      endTimestamp,
    ],
    queryFn: () =>
      getBurstUsers({
        page,
        page_size: pageSize,
        start_timestamp: startTimestamp,
        end_timestamp: endTimestamp,
        burst_threshold: burstThreshold,
      }),
  })

  const banMutation = useMutation({
    mutationFn: (userId: number) => banUser(userId),
    onSuccess: () => {
      toast.success(t('User banned successfully'))
      setBanTarget(null)
      queryClient.invalidateQueries({ queryKey: ['burst-users'] })
    },
    onError: () => {
      toast.error(t('Failed to ban user'))
    },
  })

  const items: AbnormalUserStat[] = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / pageSize)

  return (
    <>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0'>
          <CardTitle>{t('Burst Users Detection')}</CardTitle>
          <div className='flex items-center gap-2'>
            <span className='text-muted-foreground text-sm'>
              {t('Requests per Hour')}
            </span>
            <Select
              value={String(burstThreshold)}
              onValueChange={(v) => {
                setBurstThreshold(Number(v))
                setPage(1)
              }}
            >
              <SelectTrigger className='h-8 w-24'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[20, 50, 100, 200, 500].map((n) => (
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
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('User ID')}</TableHead>
                      <TableHead>{t('Username')}</TableHead>
                      <TableHead>{t('IP Count')}</TableHead>
                      <TableHead>{t('Requests')}</TableHead>
                      <TableHead>{t('Quota')}</TableHead>
                      <TableHead>{t('Tokens')}</TableHead>
                      <TableHead>{t('Avg Time')}</TableHead>
                      <TableHead>{t('First Seen')}</TableHead>
                      <TableHead>{t('Last Seen')}</TableHead>
                      <TableHead>{t('Actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((user) => (
                      <TableRow key={user.user_id}>
                        <TableCell>{user.user_id}</TableCell>
                        <TableCell>{user.username || '-'}</TableCell>
                        <TableCell>
                          <span
                            className={
                              user.ip_count >= 3
                                ? 'font-semibold text-orange-500'
                                : ''
                            }
                          >
                            {user.ip_count}
                          </span>
                        </TableCell>
                        <TableCell>
                          {user.request_count.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {formatLogQuota(user.total_quota)}
                        </TableCell>
                        <TableCell>
                          {user.total_tokens.toLocaleString()}
                        </TableCell>
                        <TableCell>{user.avg_use_time.toFixed(2)}s</TableCell>
                        <TableCell>
                          {formatTimestampToDate(user.first_seen)}
                        </TableCell>
                        <TableCell>
                          {formatTimestampToDate(user.last_seen)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-red-500 hover:text-red-700'
                            onClick={() => setBanTarget(user)}
                          >
                            <Ban className='mr-1 h-4 w-4' />
                            {t('Ban')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

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

      <AlertDialog
        open={!!banTarget}
        onOpenChange={(open) => {
          if (!open) setBanTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Confirm Ban User')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('Are you sure you want to ban user')}{' '}
              <span className='font-semibold'>
                {banTarget?.username} (ID: {banTarget?.user_id})
              </span>
              ?{' '}
              {t(
                'This user will be disabled and unable to access the system.'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className='bg-red-500 hover:bg-red-600'
              onClick={() => {
                if (banTarget) {
                  banMutation.mutate(banTarget.user_id)
                }
              }}
            >
              {t('Ban User')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
