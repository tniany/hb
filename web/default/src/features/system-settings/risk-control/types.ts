export type IpAccountStat = {
  ip: string
  user_count: number
  request_count: number
  total_quota: number
  last_seen: number
}

export type AbnormalUserStat = {
  user_id: number
  username: string
  ip_count: number
  request_count: number
  total_quota: number
  total_tokens: number
  avg_use_time: number
  error_count: number
  first_seen: number
  last_seen: number
}

export type RiskControlStats = {
  total_users: number
  active_users: number
  multi_ip_users: number
  high_quota_users: number
  suspicious_ips: number
  total_requests: number
  error_requests: number
}

export type PaginatedResponse<T> = {
  items: T[]
  total: number
  page: number
  page_size: number
}
