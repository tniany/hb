import { api } from '@/lib/api'

export async function getErrorMappings(
  page: number = 1,
  pageSize: number = 20
) {
  const res = await api.get('/api/error_mappings', {
    params: { p: page, page_size: pageSize },
  })
  return res.data
}

export async function getErrorMappingByCode(code: string) {
  const res = await api.get(`/api/error_mappings/${code}`)
  return res.data
}
