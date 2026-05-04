import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SettingsSection } from '../components/settings-section'
import { getErrorMappings, getErrorMappingByCode } from './api'

interface ErrorMapping {
  id: number
  code: string
  message: string
  status_code: number
  error_type: string
  channel_id: number
  model_name: string
  token_name: string
  user_id: number
  created_at: number
}

function formatTimestamp(ts: number) {
  if (!ts) return '-'
  return new Date(ts * 1000).toLocaleString()
}

export function ErrorLogSection() {
  const { t } = useTranslation()
  const [searchCode, setSearchCode] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data: listData, isLoading: listLoading } = useQuery({
    queryKey: ['error-mappings', page],
    queryFn: () => getErrorMappings(page, 20),
    enabled: !activeSearch,
  })

  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ['error-mapping-search', activeSearch],
    queryFn: () => getErrorMappingByCode(activeSearch),
    enabled: !!activeSearch,
  })

  const handleSearch = () => {
    const trimmed = searchCode.trim()
    setActiveSearch(trimmed)
    setPage(1)
  }

  const handleClear = () => {
    setSearchCode('')
    setActiveSearch('')
  }

  const mappings: ErrorMapping[] = activeSearch
    ? searchData?.data
      ? [searchData.data]
      : []
    : listData?.data || []
  const total: number = listData?.total || 0
  const totalPages = Math.ceil(total / 20)

  return (
    <SettingsSection
      title={t('Error Logs')}
      description={t('View API error code mappings')}
    >
      <div className='flex gap-2 mb-4'>
        <Input
          placeholder={t('Search by error code')}
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className='max-w-xs'
        />
        <Button variant='secondary' onClick={handleSearch}>
          {t('Search')}
        </Button>
        {activeSearch && (
          <Button variant='ghost' onClick={handleClear}>
            {t('Clear')}
          </Button>
        )}
      </div>

      {(listLoading || searchLoading) && (
        <p className='text-muted-foreground text-sm'>{t('Loading')}...</p>
      )}

      {!listLoading && !searchLoading && mappings.length === 0 && (
        <p className='text-muted-foreground text-sm'>{t('No data')}</p>
      )}

      {mappings.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('Error Code')}</TableHead>
              <TableHead>{t('Status Code')}</TableHead>
              <TableHead>{t('Model')}</TableHead>
              <TableHead>{t('Channel')}</TableHead>
              <TableHead>{t('Error Type')}</TableHead>
              <TableHead>{t('Time')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mappings.map((item) => (
              <TableRow key={item.id}>
                <TableCell className='font-mono text-sm'>
                  {item.code}
                </TableCell>
                <TableCell>{item.status_code}</TableCell>
                <TableCell>{item.model_name || '-'}</TableCell>
                <TableCell>
                  {item.channel_id ? `#${item.channel_id}` : '-'}
                </TableCell>
                <TableCell className='text-xs'>
                  {item.error_type || '-'}
                </TableCell>
                <TableCell className='text-xs'>
                  {formatTimestamp(item.created_at)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {activeSearch && searchData?.data && (
        <div className='mt-4 rounded-md border p-4'>
          <h4 className='text-sm font-medium mb-2'>
            {t('Original Error Message')}
          </h4>
          <pre className='text-muted-foreground text-xs whitespace-pre-wrap break-all bg-muted p-3 rounded'>
            {searchData.data.message}
          </pre>
        </div>
      )}

      {!activeSearch && totalPages > 1 && (
        <div className='flex items-center justify-between mt-4'>
          <p className='text-muted-foreground text-sm'>
            {t('Total')}: {total}
          </p>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              {t('Previous')}
            </Button>
            <span className='text-sm leading-9'>
              {page} / {totalPages}
            </span>
            <Button
              variant='outline'
              size='sm'
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              {t('Next')}
            </Button>
          </div>
        </div>
      )}
    </SettingsSection>
  )
}
