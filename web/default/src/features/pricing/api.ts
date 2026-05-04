import { api } from '@/lib/api'
import type { ApiResponse, PricingData } from './types'

// ----------------------------------------------------------------------------
// Pricing APIs
// ----------------------------------------------------------------------------

// Get model pricing data
export async function getPricing(): Promise<PricingData> {
  const res = await api.get('/api/pricing')
  return res.data
}

export async function getModelSquareNotice(): Promise<ApiResponse<string>> {
  const res = await api.get<ApiResponse<string>>('/api/notice/model_square')
  return res.data
}
