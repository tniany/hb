import { toast } from 'sonner'
import { getCustomErrorMessage } from '@/lib/custom-error'

export function handleServerError(error: unknown) {
  // eslint-disable-next-line no-console
  console.log(error)

  toast.error(getCustomErrorMessage())
}
