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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RefreshCw } from 'lucide-react'
import { SettingsSection } from '../components/settings-section'
import { getErrorMappings, getErrorMappingByCode, getErrorLogs } from './api'

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
  username: string
  created_at: number
}

interface ErrorLog {
  id: number
  user_id: number
  username: string
  created_at: number
  content: string
  model_name: string
  channel: number
  token_name: string
  use_time: number
  is_stream: boolean
  other: string
  request_id: string
}

function formatTimestamp(ts: number) {
  if (!ts) return '-'
  return new Date(ts * 1000).toLocaleString()
}

function truncateText(text: string, maxLength: number = 80) {
  if (!text) return '-'
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

const PAGE_SIZE = 20

function ErrorCodeMappingsTab() {
  const { t } = useTranslation()
  const [searchCode, setSearchCode] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [page, setPage] = useState(1)
  const [filterUsername, setFilterUsername] = useState('')
  const [activeUsername, setActiveUsername] = useState('')

  const { data: listData, isLoading: listLoading, refetch, isFetching } = useQuery({
    queryKey: ['error-mappings', page, activeUsername],
    queryFn: () => getErrorMappings(page, PAGE_SIZE, activeUsername || undefined),
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
    setActiveUsername(filterUsername.trim())
    setPage(1)
  }

  const handleClear = () => {
    setSearchCode('')
    setFilterUsername('')
    setActiveSearch('')
    setActiveUsername('')
  }

  const mappings: ErrorMapping[] = activeSearch
    ? searchData?.data
      ? [searchData.data]
      : []
    : listData?.data?.items || []
  const total: number = listData?.data?.total || 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className='space-y-4'>
      <div className='flex gap-2'>
        <Input
          placeholder={t('Search by error code')}
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className='max-w-xs'
        />
        <Input
          placeholder={t('Username')}
          value={filterUsername}
          onChange={(e) => setFilterUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setActiveUsername(filterUsername.trim())
              setPage(1)
            }
          }}
          className='max-w-[150px]'
        />
        <Button variant='secondary' onClick={handleSearch}>
          {t('Search')}
        </Button>
        {(activeSearch || activeUsername) && (
          <Button variant='ghost' onClick={handleClear}>
            {t('Clear')}
          </Button>
        )}
        <Button
          variant='outline'
          size='icon'
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
        </Button>
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
              <TableHead>{t('User')}</TableHead>
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
                  {item.username ? `${item.username} (${item.user_id})` : (item.user_id ? `#${item.user_id}` : '-')}
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
          {searchData.data.username && (
            <div className='mb-3'>
              <span className='text-sm font-medium'>{t('User')}: </span>
              <span className='text-sm text-muted-foreground'>
                {searchData.data.username} (ID: {searchData.data.user_id})
              </span>
            </div>
          )}
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
    </div>
  )
}

function ErrorLogsTab() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [modelName, setModelName] = useState('')
  const [channelId, setChannelId] = useState('')
  const [username, setUsername] = useState('')
  const [filters, setFilters] = useState<{
    modelName?: string
    channelId?: string
    username?: string
  }>({})

  const { data: listData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['error-logs', page, filters],
    queryFn: () => getErrorLogs(page, PAGE_SIZE, filters),
  })

  const logs: ErrorLog[] = listData?.data?.items || []
  const total: number = listData?.data?.total || 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const handleSearch = () => {
    setFilters({
      modelName: modelName.trim() || undefined,
      channelId: channelId.trim() || undefined,
      username: username.trim() || undefined,
    })
    setPage(1)
  }

  const handleReset = () => {
    setModelName('')
    setChannelId('')
    setUsername('')
    setFilters({})
    setPage(1)
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap gap-2'>
        <Input
          placeholder={t('Model name')}
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className='max-w-[180px]'
        />
        <Input
          placeholder={t('Channel ID')}
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className='max-w-[150px]'
        />
        <Input
          placeholder={t('Username')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className='max-w-[150px]'
        />
        <Button variant='secondary' onClick={handleSearch}>
          {t('Search')}
        </Button>
        <Button variant='ghost' onClick={handleReset}>
          {t('Reset')}
        </Button>
        <Button
          variant='outline'
          size='icon'
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {isLoading && (
        <p className='text-muted-foreground text-sm'>{t('Loading')}...</p>
      )}

      {!isLoading && logs.length === 0 && (
        <p className='text-muted-foreground text-sm'>{t('No data')}</p>
      )}

      {logs.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('Time')}</TableHead>
              <TableHead>{t('Username')}</TableHead>
              <TableHead>{t('Model')}</TableHead>
              <TableHead>{t('Channel')}</TableHead>
              <TableHead>{t('Error Content')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((item) => (
              <TableRow key={item.id}>
                <TableCell className='text-xs'>
                  {formatTimestamp(item.created_at)}
                </TableCell>
                <TableCell>{item.username || '-'}</TableCell>
                <TableCell>{item.model_name || '-'}</TableCell>
                <TableCell>
                  {item.channel ? `#${item.channel}` : '-'}
                </TableCell>
                <TableCell
                  className='text-xs max-w-[300px] truncate'
                  title={item.content}
                >
                  {truncateText(item.content)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {totalPages > 1 && (
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
    </div>
  )
}

export function ErrorLogSection() {
  const { t } = useTranslation()

  return (
    <SettingsSection
      title={t('Error Logs')}
      description={t('View API error code mappings and error logs')}
    >
      <Tabs defaultValue='error-mappings'>
        <TabsList>
          <TabsTrigger value='error-mappings'>
            {t('Error Code Mappings')}
          </TabsTrigger>
          <TabsTrigger value='error-logs'>
            {t('Error Logs')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value='error-mappings'>
          <ErrorCodeMappingsTab />
        </TabsContent>
        <TabsContent value='error-logs'>
          <ErrorLogsTab />
        </TabsContent>
      </Tabs>
    </SettingsSection>
  )
}
