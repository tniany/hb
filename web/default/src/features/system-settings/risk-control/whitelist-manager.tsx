import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  getRiskControlWhitelist,
  addRiskControlWhitelistUser,
  removeRiskControlWhitelistUser,
} from './api'

export function WhitelistManager() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [newUserId, setNewUserId] = useState('')

  const { data: whitelist, isLoading } = useQuery({
    queryKey: ['risk-control-whitelist'],
    queryFn: getRiskControlWhitelist,
  })

  const addMutation = useMutation({
    mutationFn: (userId: number) => addRiskControlWhitelistUser(userId),
    onSuccess: () => {
      toast.success(t('User added to whitelist'))
      setNewUserId('')
      queryClient.invalidateQueries({ queryKey: ['risk-control-whitelist'] })
    },
    onError: () => {
      toast.error(t('Failed to add user to whitelist'))
    },
  })

  const removeMutation = useMutation({
    mutationFn: (userId: number) => removeRiskControlWhitelistUser(userId),
    onSuccess: () => {
      toast.success(t('User removed from whitelist'))
      queryClient.invalidateQueries({ queryKey: ['risk-control-whitelist'] })
    },
    onError: () => {
      toast.error(t('Failed to remove user from whitelist'))
    },
  })

  const handleAdd = () => {
    const userId = parseInt(newUserId, 10)
    if (isNaN(userId) || userId <= 0) {
      toast.error(t('Please enter a valid user ID'))
      return
    }
    addMutation.mutate(userId)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Whitelist Management')}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center gap-2'>
          <Input
            placeholder={t('Enter user ID')}
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd()
            }}
            className='max-w-xs'
          />
          <Button onClick={handleAdd} disabled={addMutation.isPending}>
            {t('Add')}
          </Button>
        </div>

        {isLoading ? (
          <div className='text-muted-foreground py-8 text-center'>
            {t('Loading...')}
          </div>
        ) : !whitelist || whitelist.length === 0 ? (
          <div className='text-muted-foreground py-8 text-center'>
            {t('No data')}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('User ID')}</TableHead>
                <TableHead>{t('Username')}</TableHead>
                <TableHead>{t('Actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {whitelist.map((item) => (
                <TableRow key={item.user_id}>
                  <TableCell>{item.user_id}</TableCell>
                  <TableCell>{item.username || '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-red-500 hover:text-red-700'
                      onClick={() => removeMutation.mutate(item.user_id)}
                      disabled={removeMutation.isPending}
                    >
                      <Trash2 className='mr-1 h-4 w-4' />
                      {t('Remove')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
