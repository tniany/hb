import { useMemo } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { SettingsSection } from '../components/settings-section'
import { useResetForm } from '../hooks/use-reset-form'
import { useUpdateOption } from '../hooks/use-update-option'

const qqSchema = z.object({
  QQRegistrationEnabled: z.boolean(),
  QQGroupVerificationEnabled: z.boolean(),
  QQBotToken: z.string(),
  QQGroupId: z.string(),
  QQGroupName: z.string(),
})

type QQFormValues = z.infer<typeof qqSchema>

type QQSectionProps = {
  defaultValues: QQFormValues
}

export function QQSection({ defaultValues }: QQSectionProps) {
  const { t } = useTranslation()
  const updateOption = useUpdateOption()

  const formDefaults = useMemo<QQFormValues>(
    () => ({
      ...defaultValues,
    }),
    [defaultValues]
  )

  const form = useForm<QQFormValues>({
    resolver: zodResolver(qqSchema),
    defaultValues: formDefaults,
  })

  useResetForm(form, formDefaults)

  const onSubmit = async (data: QQFormValues) => {
    const updates: Array<{ key: string; value: string | boolean }> = []

    Object.entries(data).forEach(([key, value]) => {
      if (value !== defaultValues[key as keyof typeof defaultValues]) {
        updates.push({ key, value })
      }
    })

    for (const update of updates) {
      await updateOption.mutateAsync(update)
    }
  }

  return (
    <SettingsSection
      title={t('QQ Registration')}
      description={t('Configure QQ email registration and QQ group verification')}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='QQRegistrationEnabled'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                <div className='space-y-0.5'>
                  <FormLabel className='text-base'>
                    {t('QQ Registration')}
                  </FormLabel>
                  <FormDescription>
                    {t('Allow users to register with QQ email')}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='QQGroupVerificationEnabled'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                <div className='space-y-0.5'>
                  <FormLabel className='text-base'>
                    {t('QQ Group Verification')}
                  </FormLabel>
                  <FormDescription>
                    {t('Verify users through QQ group membership')}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='QQBotToken'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('QQ Bot Token')}</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder={t('Your QQ Bot Token')}
                    autoComplete='new-password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='QQGroupId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('QQ Group ID')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('Your QQ Group ID')}
                    autoComplete='off'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='QQGroupName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('QQ Group Name')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('Your QQ Group Name')}
                    autoComplete='off'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' disabled={updateOption.isPending}>
            {updateOption.isPending ? t('Saving...') : t('Save Changes')}
          </Button>
        </form>
      </Form>
    </SettingsSection>
  )
}
