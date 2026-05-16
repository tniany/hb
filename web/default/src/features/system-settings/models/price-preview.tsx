import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { formatBillingCurrencyFromUSD } from '@/lib/currency'

type PricePreviewProps = {
  modelRatio?: string | number
  completionRatio?: string | number
  cacheRatio?: string | number
  createCacheRatio?: string | number
  modelPrice?: string | number
  quotaType?: 0 | 1
  className?: string
}

export function PricePreview({
  modelRatio,
  completionRatio,
  cacheRatio,
  createCacheRatio,
  modelPrice,
  quotaType = 0,
  className,
}: PricePreviewProps) {
  const { t } = useTranslation()

  const prices = useMemo(() => {
    if (quotaType === 1) {
      const price = typeof modelPrice === 'string' ? parseFloat(modelPrice) : modelPrice
      if (price == null || isNaN(price)) return null
      return {
        perRequest: price,
      }
    }

    const ratio = typeof modelRatio === 'string' ? parseFloat(modelRatio) : modelRatio
    if (ratio == null || isNaN(ratio)) return null

    const compRatio = typeof completionRatio === 'string' ? parseFloat(completionRatio) : completionRatio
    const cache = typeof cacheRatio === 'string' ? parseFloat(cacheRatio) : cacheRatio
    const createCache = typeof createCacheRatio === 'string' ? parseFloat(createCacheRatio) : createCacheRatio

    return {
      input: ratio * 2,
      output: compRatio && !isNaN(compRatio) ? ratio * 2 * compRatio : null,
      cache: cache && !isNaN(cache) ? ratio * 2 * cache : null,
      createCache: createCache && !isNaN(createCache) ? ratio * 2 * createCache : null,
    }
  }, [modelRatio, completionRatio, cacheRatio, createCacheRatio, modelPrice, quotaType])

  if (!prices) {
    return (
      <div className={className}>
        <p className='text-xs text-muted-foreground'>
          {t('Enter values to see price preview')}
        </p>
      </div>
    )
  }

  if (quotaType === 1 && 'perRequest' in prices) {
    return (
      <div className={className}>
        <div className='rounded-md bg-muted/50 p-3'>
          <p className='text-xs font-medium text-muted-foreground mb-1.5'>
            {t('Price Preview')}
          </p>
          <div className='space-y-1'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-muted-foreground'>{t('Per Request')}</span>
              <span className='font-medium'>
                {formatBillingCurrencyFromUSD(prices.perRequest, {
                  digitsLarge: 4,
                  digitsSmall: 6,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if ('input' in prices) {
    return (
      <div className={className}>
        <div className='rounded-md bg-muted/50 p-3'>
          <p className='text-xs font-medium text-muted-foreground mb-1.5'>
            {t('Price Preview')} <span className='font-normal'>(per 1M tokens)</span>
          </p>
          <div className='space-y-1'>
            <PriceRow label={t('Input')} value={prices.input} />
            {prices.output !== null && (
              <PriceRow label={t('Output')} value={prices.output} />
            )}
            {prices.cache !== null && (
              <PriceRow label={t('Cache')} value={prices.cache} />
            )}
            {prices.createCache !== null && (
              <PriceRow label={t('Create cache')} value={prices.createCache} />
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}

function PriceRow({ label, value }: { label: string; value: number }) {
  return (
    <div className='flex items-center justify-between text-sm'>
      <span className='text-muted-foreground'>{label}</span>
      <span className='font-medium'>
        {formatBillingCurrencyFromUSD(value, {
          digitsLarge: 4,
          digitsSmall: 6,
        })}
      </span>
    </div>
  )
}
