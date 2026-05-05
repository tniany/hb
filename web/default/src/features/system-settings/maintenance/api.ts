import { api } from '@/lib/api'

export async function getErrorMappings(
  page: number = 1,
  pageSize: number = 20,
  username?: string
) {
  const params: Record<string, string | number> = { p: page, page_size: pageSize }
  if (username) params.username = username
  const res = await api.get('/api/error_mappings', {
    params,
  })
  return res.data
}

export async function getErrorMappingByCode(code: string) {
  const res = await api.get(`/api/error_mappings/${code}`)
  return res.data
}

export async function getErrorLogs(
  page: number = 1,
  pageSize: number = 20,
  filters?: { modelName?: string; channelId?: string; username?: string }
) {
  const params: Record<string, string | number> = { p: page, page_size: pageSize }
  if (filters?.modelName) params.model_name = filters.modelName
  if (filters?.channelId) params.channel_id = filters.channelId
  if (filters?.username) params.username = filters.username
  const res = await api.get('/api/error_mappings/error_logs', { params })
  return res.data
}
