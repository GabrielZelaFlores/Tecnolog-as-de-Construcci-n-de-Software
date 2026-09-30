'use client'

import { Languages } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useI18n, type Language } from '@/i18n/I18nProvider'

export function LanguageSelector() {
  const { language, setLanguage, t } = useI18n()

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <Label htmlFor="language" className="sr-only">{t('language')}</Label>
      <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
        <SelectTrigger id="language" aria-label={t('language')} className="w-[132px] bg-background">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="es">🇵🇪 {t('spanish')}</SelectItem>
          <SelectItem value="en">🇺🇸 {t('english')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
