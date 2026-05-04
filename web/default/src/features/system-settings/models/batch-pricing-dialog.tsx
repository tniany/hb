import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
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

type BatchPricingDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedModels: string[]
  currentRatios: {
    modelPrice: string
    modelRatio: string
    cacheRatio: string
    createCacheRatio: string
    completionRatio: string
    imageRatio: string
    audioRatio: string
    audioCompletionRatio: string
  }
  onSave: (updates: Record<string, string>) => void
}

type RatioField = {
  key: string
  optionKey: string
  label: string
}

  const RATIO_FIELDS: RatioField[] = [
    { key: 'model_price', optionKey: 'modelPrice', label: 'Model Price' },
    { key: 'model_ratio', optionKey: 'modelRatio', label: 'Model Ratio' },
    { key: 'completion_ratio', optionKey: 'completionRatio', label: 'Completion Ratio' },
    { key: 'cache_ratio', optionKey: 'cacheRatio', label: 'Cache Ratio' },
    { key: 'create_cache_ratio', optionKey: 'createCacheRatio', label: 'Create Cache Ratio' },
  ]

export function BatchPricingDialog({
  open,
  onOpenChange,
  selectedModels,
  currentRatios,
  onSave,
}: BatchPricingDialogProps) {
  const { t } = useTranslation()
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
    for (const field of RATIO_FIELDS) {
      if (!enabledFields[field.key]) continue
      const raw = currentRatios[field.optionKey as keyof typeof currentRatios] || '{}'
      let parsed: Record<string, string> = {}
      try {
        parsed = JSON.parse(raw)
      } catch {
        parsed = {}
      }
      const val = values[field.key]
      for (const model of selectedModels) {
        if (val === '' || val === undefined) {
          delete parsed[model]
        } else {
          parsed[model] = val
        }
      }
      updates[field.optionKey] = JSON.stringify(parsed)
    }
    onSave(updates)
  }

  const allEnabled = Object.values(enabledFields).some(Boolean)

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
