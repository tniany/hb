import { useQuery } from '@tanstack/react-query'
import { getModelSquareNotice } from '../api'

export function useModelSquareNotice() {
  const { data, isLoading } = useQuery({
    queryKey: ['model-square-notice'],
    queryFn: getModelSquareNotice,
    staleTime: 10 * 60 * 1000,
  })

  return {
    notice: data?.data ?? '',
    isLoading,
  }
}
