import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Search, Wand2 } from 'lucide-react'
import { api } from '@/lib/api'
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
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { PricingData } from '@/features/pricing/types'

function parseJsonMap(json: string): Record<string, number> {
  try {
    const parsed = JSON.parse(json)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const result: Record<string, number> = {}
      for (const [k, v] of Object.entries(parsed)) {
        const n = Number(v)
        if (Number.isFinite(n)) result[k] = n
      }
      return result
    }
  } catch {}
  return {}
}

type FillUnpricedDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRatios: Record<string, string>
  onSave: (updates: Record<string, string>) => void
}

export function FillUnpricedDialog({
  open,
  onOpenChange,
  currentRatios,
  onSave,
}: FillUnpricedDialogProps) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set())
  const [defaultRatio, setDefaultRatio] = useState('1')
  const [defaultCompletion, setDefaultCompletion] = useState('1')
  const [defaultCache, setDefaultCache] = useState('1')

  const { data: pricingData, isLoading } = useQuery({
    queryKey: ['pricing-all-models'],
    queryFn: async () => {
      const res = await api.get<PricingData>('/api/pricing')
      return res.data
    },
    enabled: open,
  })

  const unpricedModels = useMemo(() => {
    if (!pricingData?.data) return []
    const modelPrice = parseJsonMap(currentRatios.ModelPrice || '{}')
    const modelRatio = parseJsonMap(currentRatios.ModelRatio || '{}')
    const completionRatio = parseJsonMap(currentRatios.CompletionRatio || '{}')
    const cacheRatio = parseJsonMap(currentRatios.CacheRatio || '{}')
    const createCacheRatio = parseJsonMap(currentRatios.CreateCacheRatio || '{}')

    return pricingData.data
      .filter((m) => {
        const name = m.model_name
        return (
          !(name in modelPrice) &&
          !(name in modelRatio) &&
          !(name in completionRatio) &&
          !(name in cacheRatio) &&
          !(name in createCacheRatio)
        )
      })
      .map((m) => m.model_name)
      .sort()
  }, [pricingData, currentRatios])

  const filteredModels = useMemo(() => {
    if (!search) return unpricedModels
    const lower = search.toLowerCase()
    return unpricedModels.filter((name) => name.toLowerCase().includes(lower))
  }, [unpricedModels, search])

  const allFilteredSelected = filteredModels.length > 0 && filteredModels.every((m) => selectedModels.has(m))

  const toggleModel = (name: string) => {
    setSelectedModels((prev) => {
      const next = new Set(prev)
      if (next.has(name)) {
        next.delete(name)
      } else {
        next.add(name)
      }
      return next
    })
  }

  const toggleAll = () => {
    if (allFilteredSelected) {
      setSelectedModels((prev) => {
        const next = new Set(prev)
        for (const m of filteredModels) next.delete(m)
        return next
      })
    } else {
      setSelectedModels((prev) => {
        const next = new Set(prev)
        for (const m of filteredModels) next.add(m)
        return next
      })
    }
  }

  const handleConfirm = () => {
    if (selectedModels.size === 0) return
    const ratioNum = parseFloat(defaultRatio)
    const completionNum = parseFloat(defaultCompletion)
    const cacheNum = parseFloat(defaultCache)
    const modelRatio = parseJsonMap(currentRatios.ModelRatio || '{}')
    const completionRatio = parseJsonMap(currentRatios.CompletionRatio || '{}')
    const cacheRatio = parseJsonMap(currentRatios.CacheRatio || '{}')

    for (const name of selectedModels) {
      if (!isNaN(ratioNum)) modelRatio[name] = ratioNum
      if (!isNaN(completionNum)) completionRatio[name] = completionNum
      if (!isNaN(cacheNum)) cacheRatio[name] = cacheNum
    }

    onSave({
      ModelRatio: JSON.stringify(modelRatio),
      CompletionRatio: JSON.stringify(completionRatio),
      CacheRatio: JSON.stringify(cacheRatio),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{t('Fill pricing for unpriced models')}</DialogTitle>
          <DialogDescription>
            {t(
              'Found {{count}} models without pricing. Set default ratios and select models to configure.',
              { count: unpricedModels.length },
            )}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='grid grid-cols-3 gap-3'>
            <div>
              <Label className='text-xs'>{t('Default Model Ratio')}</Label>
              <Input
                type='number'
                value={defaultRatio}
                onChange={(e) => setDefaultRatio(e.target.value)}
                className='mt-1 h-8'
              />
            </div>
            <div>
              <Label className='text-xs'>{t('Default Completion Ratio')}</Label>
              <Input
                type='number'
                value={defaultCompletion}
                onChange={(e) => setDefaultCompletion(e.target.value)}
                className='mt-1 h-8'
              />
            </div>
            <div>
              <Label className='text-xs'>{t('Default Cache Ratio')}</Label>
              <Input
                type='number'
                value={defaultCache}
                onChange={(e) => setDefaultCache(e.target.value)}
                className='mt-1 h-8'
              />
            </div>
          </div>

          <div>
            <div className='relative'>
              <Search className='absolute left-2.5 top-2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder={t('Search models...')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='h-9 pl-8'
              />
            </div>
          </div>

          <div>
            <div className='mb-1.5 flex items-center gap-2'>
              <Checkbox
                checked={allFilteredSelected}
                onCheckedChange={toggleAll}
              />
              <Label className='text-xs text-muted-foreground'>
                {t('{{selected}}/{{total}} selected', {
                  selected: filteredModels.filter((m) => selectedModels.has(m)).length,
                  total: filteredModels.length,
                })}
              </Label>
            </div>
            <ScrollArea className='h-48 rounded-md border'>
              {isLoading ? (
                <div className='flex items-center justify-center py-8 text-sm text-muted-foreground'>
                  {t('Loading models...')}
                </div>
              ) : filteredModels.length === 0 ? (
                <div className='flex items-center justify-center py-8 text-sm text-muted-foreground'>
                  {t('No unpriced models found')}
                </div>
              ) : (
                <div className='divide-y p-1'>
                  {filteredModels.map((name) => (
                    <label
                      key={name}
                      className='flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted/50'
                    >
                      <Checkbox
                        checked={selectedModels.has(name)}
                        onCheckedChange={() => toggleModel(name)}
                      />
                      <span className='truncate font-mono text-xs'>{name}</span>
                    </label>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            {t('Cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedModels.size === 0}
          >
            <Wand2 className='mr-1.5 h-3.5 w-3.5' />
            {t('Apply to {{count}} models', { count: selectedModels.size })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
