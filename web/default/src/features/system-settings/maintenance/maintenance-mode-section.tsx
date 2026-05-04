import { useTranslation } from 'react-i18next'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { SettingsSection } from '../components/settings-section'
import { useUpdateOption } from '../hooks/use-update-option'

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
  const { mutate: updateOption } = useUpdateOption()

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
              updateOption({
                key: 'MaintenanceModeEnabled',
                value: checked ? 'true' : 'false',
              })
            }
          />
        </div>
        <div className='mt-4'>
          <p className='text-sm font-medium mb-2'>{t('Custom Maintenance Message')}</p>
          <p className='text-muted-foreground text-xs mb-2'>
            {t('Default message will be used if empty')}
          </p>
          <Textarea
            value={defaultValues.MaintenanceModeMessage}
            onChange={(e) =>
              updateOption({
                key: 'MaintenanceModeMessage',
                value: e.target.value,
              })
            }
            placeholder={t('Leave empty to use default message')}
            rows={3}
          />
        </div>
      </div>
    </SettingsSection>
  )
}
