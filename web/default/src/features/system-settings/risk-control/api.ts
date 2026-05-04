import { api } from '@/lib/api'
import type {
  RiskControlStats,
  IpAccountStat,
  AbnormalUserStat,
  PaginatedResponse,
} from './types'

export async function getRiskControlStats(
  startTimestamp?: number,
  endTimestamp?: number
): Promise<RiskControlStats> {
  const params: Record<string, string | number> = {}
  if (startTimestamp) params.start_timestamp = startTimestamp
  if (endTimestamp) params.end_timestamp = endTimestamp
  const res = await api.get('/api/risk_control/stats', { params })
  return res.data.data
}

export async function getMultiAccountIps(params: {
  page?: number
  page_size?: number
  start_timestamp?: number
  end_timestamp?: number
  min_accounts?: number
}): Promise<PaginatedResponse<IpAccountStat>> {
  const queryParams: Record<string, string | number> = {
    p: params.page ?? 1,
    page_size: params.page_size ?? 10,
  }
  if (params.start_timestamp) queryParams.start_timestamp = params.start_timestamp
  if (params.end_timestamp) queryParams.end_timestamp = params.end_timestamp
  if (params.min_accounts) queryParams.min_accounts = params.min_accounts
  const res = await api.get('/api/risk_control/multi_account_ips', {
    params: queryParams,
  })
  return res.data.data
}

export async function getIpUsers(params: {
  ip: string
  start_timestamp?: number
  end_timestamp?: number
}): Promise<AbnormalUserStat[]> {
  const queryParams: Record<string, string | number> = { ip: params.ip }
  if (params.start_timestamp) queryParams.start_timestamp = params.start_timestamp
  if (params.end_timestamp) queryParams.end_timestamp = params.end_timestamp
  const res = await api.get('/api/risk_control/ip_users', {
    params: queryParams,
  })
  return res.data.data
}

export async function getAbnormalUsers(params: {
  page?: number
  page_size?: number
  start_timestamp?: number
  end_timestamp?: number
  threshold?: number
}): Promise<PaginatedResponse<AbnormalUserStat>> {
  const queryParams: Record<string, string | number> = {
    p: params.page ?? 1,
    page_size: params.page_size ?? 10,
  }
  if (params.start_timestamp) queryParams.start_timestamp = params.start_timestamp
  if (params.end_timestamp) queryParams.end_timestamp = params.end_timestamp
  if (params.threshold) queryParams.threshold = params.threshold
  const res = await api.get('/api/risk_control/abnormal_users', {
    params: queryParams,
  })
  return res.data.data
}

export async function banUser(userId: number): Promise<void> {
  await api.post('/api/risk_control/ban_user', null, {
    params: { user_id: userId },
  })
}

export async function getBurstUsers(params: {
  page?: number
  page_size?: number
  start_timestamp?: number
  end_timestamp?: number
  burst_threshold?: number
}): Promise<PaginatedResponse<AbnormalUserStat>> {
  const queryParams: Record<string, string | number> = {
    p: params.page ?? 1,
    page_size: params.page_size ?? 10,
  }
  if (params.start_timestamp) queryParams.start_timestamp = params.start_timestamp
  if (params.end_timestamp) queryParams.end_timestamp = params.end_timestamp
  if (params.burst_threshold) queryParams.burst_threshold = params.burst_threshold
  const res = await api.get('/api/risk_control/burst_users', {
    params: queryParams,
  })
  return res.data.data
}

export async function getRiskControlWhitelist(): Promise<
  { user_id: number; username: string }[]
> {
  const res = await api.get('/api/risk_control/whitelist')
  return res.data.data
}

export async function addRiskControlWhitelistUser(
  userId: number
): Promise<void> {
  await api.post('/api/risk_control/whitelist/add', null, {
    params: { user_id: userId },
  })
}

export async function removeRiskControlWhitelistUser(
  userId: number
): Promise<void> {
  await api.post('/api/risk_control/whitelist/remove', null, {
    params: { user_id: userId },
  })
}
