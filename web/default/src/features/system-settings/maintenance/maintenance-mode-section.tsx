import { useEffect } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { SettingsSection } from '../components/settings-section'
import { useUpdateOption } from '../hooks/use-update-option'

const maintenanceSchema = z.object({
  MaintenanceModeMessage: z.string().optional(),
})

type MaintenanceFormValues = z.infer<typeof maintenanceSchema>

interface MaintenanceModeSectionProps {
  defaultValues: {
    MaintenanceModeEnabled: boolean
    MaintenanceModeMessage: string
  }
}

export function MaintenanceModeSection({
  defaultValues,
}: MaintenanceModeSectionProps) {
  const { t } = useTranslation()
  const updateOption = useUpdateOption()
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      MaintenanceModeMessage: defaultValues.MaintenanceModeMessage ?? '',
    },
  })

  useEffect(() => {
    form.reset({
      MaintenanceModeMessage: defaultValues.MaintenanceModeMessage ?? '',
    })
  }, [defaultValues.MaintenanceModeMessage, form])

  const onSubmit = async (values: MaintenanceFormValues) => {
    const normalized = values.MaintenanceModeMessage ?? ''
    if (normalized === (defaultValues.MaintenanceModeMessage ?? '')) {
      return
    }
    await updateOption.mutateAsync({
      key: 'MaintenanceModeMessage',
      value: normalized,
    })
  }

  return (
    <SettingsSection
      title={t('Maintenance Mode')}
      description={t('Enable maintenance mode to block all API requests')}
    >
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm font-medium'>{t('Enable Maintenance Mode')}</p>
            <p className='text-muted-foreground text-xs'>
              {t('When enabled, all API requests will return 503')}
            </p>
          </div>
          <Switch
            checked={defaultValues.MaintenanceModeEnabled}
            onCheckedChange={(checked) =>
              updateOption.mutate({
                key: 'MaintenanceModeEnabled',
                value: checked ? 'true' : 'false',
              })
            }
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='MaintenanceModeMessage'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Custom Maintenance Message')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('Leave empty to use default message')}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={updateOption.isPending}>
              {updateOption.isPending ? t('Saving...') : t('Save message')}
            </Button>
          </form>
        </Form>
      </div>
    </SettingsSection>
  )
}
