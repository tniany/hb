import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PricePreview } from './price-preview'

type BillingModeOption = 'keep' | 'per-token' | 'per-request'

type BatchPricingDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedModels: string[]
  currentRatios: Record<string, string>
  onSave: (updates: Record<string, string>) => void
}

type RatioField = {
  key: string
  optionKey: string
  label: string
}

const RATIO_FIELDS: RatioField[] = [
  { key: 'model_price', optionKey: 'ModelPrice', label: 'Model Price' },
  { key: 'model_ratio', optionKey: 'ModelRatio', label: 'Model Ratio' },
  { key: 'completion_ratio', optionKey: 'CompletionRatio', label: 'Completion Ratio' },
  { key: 'cache_ratio', optionKey: 'CacheRatio', label: 'Cache Ratio' },
  { key: 'create_cache_ratio', optionKey: 'CreateCacheRatio', label: 'Create Cache Ratio' },
]

export function BatchPricingDialog({
  open,
  onOpenChange,
  selectedModels,
  currentRatios,
  onSave,
}: BatchPricingDialogProps) {
  const { t } = useTranslation()
  const [billingMode, setBillingMode] = useState<BillingModeOption>('keep')
  const [enabledFields, setEnabledFields] = useState<Record<string, boolean>>({
    model_price: false,
    model_ratio: false,
    completion_ratio: false,
    cache_ratio: false,
    create_cache_ratio: false,
  })
  const [values, setValues] = useState<Record<string, string>>({
    model_price: '',
    model_ratio: '',
    completion_ratio: '',
    cache_ratio: '',
    create_cache_ratio: '',
  })

  const toggleField = (key: string) => {
    setEnabledFields((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleConfirm = () => {
    const updates: Record<string, string> = {}

    const parseMap = (raw: string): Record<string, number> => {
      try {
        const obj = JSON.parse(raw)
        if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
          const result: Record<string, number> = {}
          for (const [k, v] of Object.entries(obj)) {
            const n = Number(v)
            if (Number.isFinite(n)) result[k] = n
          }
          return result
        }
      } catch {}
      return {}
    }

    if (billingMode === 'per-request') {
      const priceVal = values.model_price
      const numPrice = parseFloat(priceVal)
      if (enabledFields.model_price && priceVal && !isNaN(numPrice)) {
        const modelPrice = parseMap(currentRatios.ModelPrice || '{}')
        const modelRatio = parseMap(currentRatios.ModelRatio || '{}')
        const completionRatio = parseMap(currentRatios.CompletionRatio || '{}')
        const cacheRatio = parseMap(currentRatios.CacheRatio || '{}')
        const createCacheRatio = parseMap(currentRatios.CreateCacheRatio || '{}')
        for (const model of selectedModels) {
          modelPrice[model] = numPrice
          delete modelRatio[model]
          delete completionRatio[model]
          delete cacheRatio[model]
          delete createCacheRatio[model]
        }
        updates['ModelPrice'] = JSON.stringify(modelPrice)
        updates['ModelRatio'] = JSON.stringify(modelRatio)
        updates['CompletionRatio'] = JSON.stringify(completionRatio)
        updates['CacheRatio'] = JSON.stringify(cacheRatio)
        updates['CreateCacheRatio'] = JSON.stringify(createCacheRatio)
      }
    } else if (billingMode === 'per-token') {
      const ratioVal = values.model_ratio
      const numRatio = parseFloat(ratioVal)
      if (enabledFields.model_ratio && ratioVal && !isNaN(numRatio)) {
        const modelPrice = parseMap(currentRatios.ModelPrice || '{}')
        const modelRatio = parseMap(currentRatios.ModelRatio || '{}')
        const completionRatio = parseMap(currentRatios.CompletionRatio || '{}')
        const cacheRatio = parseMap(currentRatios.CacheRatio || '{}')
        const createCacheRatio = parseMap(currentRatios.CreateCacheRatio || '{}')
        for (const model of selectedModels) {
          delete modelPrice[model]
          modelRatio[model] = numRatio
        }
        if (enabledFields.completion_ratio) {
          const num = parseFloat(values.completion_ratio)
          for (const model of selectedModels) {
            completionRatio[model] = isNaN(num) ? 1 : num
          }
        }
        if (enabledFields.cache_ratio) {
          const num = parseFloat(values.cache_ratio)
          for (const model of selectedModels) {
            cacheRatio[model] = isNaN(num) ? 1 : num
          }
        }
        if (enabledFields.create_cache_ratio) {
          const num = parseFloat(values.create_cache_ratio)
          for (const model of selectedModels) {
            createCacheRatio[model] = isNaN(num) ? 1 : num
          }
        }
        updates['ModelPrice'] = JSON.stringify(modelPrice)
        updates['ModelRatio'] = JSON.stringify(modelRatio)
        updates['CompletionRatio'] = JSON.stringify(completionRatio)
        updates['CacheRatio'] = JSON.stringify(cacheRatio)
        updates['CreateCacheRatio'] = JSON.stringify(createCacheRatio)
      }
    }

    for (const field of RATIO_FIELDS) {
      if (!enabledFields[field.key]) continue
      if (billingMode === 'per-request' && field.key !== 'model_price') continue
      if (billingMode === 'per-token' && field.key === 'model_price') continue
      if (updates[field.optionKey]) continue
      const raw = currentRatios[field.optionKey as keyof typeof currentRatios] || '{}'
      let parsed: Record<string, number> = {}
      try {
        const obj = JSON.parse(raw)
        if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
          for (const [k, v] of Object.entries(obj)) {
            const n = Number(v)
            if (Number.isFinite(n)) parsed[k] = n
          }
        }
      } catch {
        parsed = {}
      }
      const val = values[field.key]
      const numVal = parseFloat(val)
      for (const model of selectedModels) {
        if (val === '' || val === undefined) {
          delete parsed[model]
        } else if (field.key === 'model_price') {
          parsed[model] = isNaN(numVal) ? 0 : numVal
        } else {
          parsed[model] = isNaN(numVal) ? 1 : numVal
        }
      }
      updates[field.optionKey] = JSON.stringify(parsed)
    }
    onSave(updates)
  }

  const allEnabled = billingMode !== 'keep' || Object.values(enabledFields).some(Boolean)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {t('Batch pricing for {{count}} models', { count: selectedModels.length })}
          </DialogTitle>
          <DialogDescription>
            {t('Set pricing ratios for all selected models at once.')}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <Label className='text-xs font-medium text-muted-foreground'>
              {t('Selected Models')}
            </Label>
            <ScrollArea className='mt-1.5 h-24 rounded-md border p-2'>
              <div className='flex flex-wrap gap-1'>
                {selectedModels.map((name) => (
                  <Badge key={name} variant='secondary' className='text-xs font-normal'>
                    {name}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className='space-y-2'>
            <Label className='text-sm'>{t('Billing Mode')}</Label>
            <Select value={billingMode} onValueChange={(v) => setBillingMode(v as BillingModeOption)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='keep'>{t('Keep current')}</SelectItem>
                <SelectItem value='per-token'>{t('Per-token (ratio based)')}</SelectItem>
                <SelectItem value='per-request'>{t('Per-request (fixed price)')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {billingMode === 'per-request' && enabledFields.model_price && values.model_price && (
            <PricePreview
              modelPrice={values.model_price}
              quotaType={1}
            />
          )}

          {billingMode === 'per-token' && enabledFields.model_ratio && values.model_ratio && (
            <PricePreview
              modelRatio={values.model_ratio}
              completionRatio={enabledFields.completion_ratio ? values.completion_ratio : undefined}
              cacheRatio={enabledFields.cache_ratio ? values.cache_ratio : undefined}
              createCacheRatio={enabledFields.create_cache_ratio ? values.create_cache_ratio : undefined}
              quotaType={0}
            />
          )}

          <div className='space-y-3'>
            {RATIO_FIELDS.map((field) => (
              <div key={field.key} className='flex items-center gap-2'>
                <Checkbox
                  checked={enabledFields[field.key]}
                  onCheckedChange={() => toggleField(field.key)}
                />
                <Label className='w-36 shrink-0 text-sm'>{t(field.label)}</Label>
                <Input
                  type='number'
                  placeholder={t('Value')}
                  disabled={!enabledFields[field.key]}
                  value={values[field.key]}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  className='h-8'
                />
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            {t('Cancel')}
          </Button>
          <Button onClick={handleConfirm} disabled={!allEnabled}>
            {t('Apply')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
