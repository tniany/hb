import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatTimestampToDate, formatLogQuota } from '@/lib/format'
import { getIpUsers } from './api'
import type { AbnormalUserStat } from './types'

type IpUsersDialogProps = {
  ip: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  startTimestamp?: number
  endTimestamp?: number
}

export function IpUsersDialog({
  ip,
  open,
  onOpenChange,
  startTimestamp,
  endTimestamp,
}: IpUsersDialogProps) {
  const { t } = useTranslation()

  const { data: users, isLoading } = useQuery<AbnormalUserStat[]>({
    queryKey: ['ip-users', ip, startTimestamp, endTimestamp],
    queryFn: () =>
      getIpUsers({
        ip: ip!,
        start_timestamp: startTimestamp,
        end_timestamp: endTimestamp,
      }),
    enabled: open && !!ip,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl'>
        <DialogHeader>
          <DialogTitle>
            {t('IP Users Detail')} - {ip}
          </DialogTitle>
        </DialogHeader>
        <div className='max-h-[60vh] overflow-auto'>
          {isLoading ? (
            <div className='text-muted-foreground py-8 text-center'>
              {t('Loading...')}
            </div>
          ) : !users || users.length === 0 ? (
            <div className='text-muted-foreground py-8 text-center'>
              {t('No data')}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('User ID')}</TableHead>
                  <TableHead>{t('Username')}</TableHead>
                  <TableHead>{t('Requests')}</TableHead>
                  <TableHead>{t('Quota')}</TableHead>
                  <TableHead>{t('Tokens')}</TableHead>
                  <TableHead>{t('First Seen')}</TableHead>
                  <TableHead>{t('Last Seen')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell>{user.user_id}</TableCell>
                    <TableCell>{user.username || '-'}</TableCell>
                    <TableCell>
                      {user.request_count.toLocaleString()}
                    </TableCell>
                    <TableCell>{formatLogQuota(user.total_quota)}</TableCell>
                    <TableCell>
                      {user.total_tokens.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {formatTimestampToDate(user.first_seen)}
                    </TableCell>
                    <TableCell>
                      {formatTimestampToDate(user.last_seen)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
