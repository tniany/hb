import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { getCustomErrorMessage, getErrorMessage } from '@/lib/custom-error'

export function handleServerError(error: unknown) {
  // eslint-disable-next-line no-console
  console.log(error)

  if (error instanceof AxiosError) {
    const message = error.response?.data?.message
    const status = error.response?.status
    toast.error(getErrorMessage({ message, status }))
  } else {
    toast.error(getCustomErrorMessage())
  }
}
