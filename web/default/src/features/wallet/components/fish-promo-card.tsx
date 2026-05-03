import { Fish, Gift, ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function FishPromoCard() {
  const { t } = useTranslation()

  return (
    <div className='overflow-hidden rounded-lg border border-amber-200/60 bg-gradient-to-r from-amber-50/80 via-orange-50/50 to-amber-50/80 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-amber-950/20'>
      <div className='flex items-center gap-3 p-3 sm:items-center sm:gap-4 sm:p-4'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40 sm:h-12 sm:w-12'>
          <Fish className='h-5 w-5 text-amber-600 dark:text-amber-400 sm:h-6 sm:w-6' />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2'>
            <p className='text-sm font-semibold sm:text-base'>
              {t('本站为公益站')}
            </p>
            <Gift className='h-3.5 w-3.5 text-amber-500 sm:h-4 sm:w-4' />
          </div>
          <p className='text-muted-foreground mt-0.5 text-xs sm:text-sm'>
            {t(
              'Join QQ group for daily check-in to get free fish!'
            )}
          </p>
        </div>
        <a
          href='/claim-fish'
          className='inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-900/50 sm:px-4 sm:py-2 sm:text-sm'
        >
          {t('Claim Fish')}
          <ExternalLink className='h-3 w-3' />
        </a>
      </div>
    </div>
  )
}
