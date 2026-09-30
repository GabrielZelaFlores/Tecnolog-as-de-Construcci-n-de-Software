'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react'
import { useI18n } from '@/i18n/I18nProvider'

interface ProductQuantitySelectorProps { max: number }

// STATEFUL 1: conserva y modifica la cantidad seleccionada por el usuario.
export function ProductQuantitySelector({ max }: ProductQuantitySelectorProps) {
  const { t } = useI18n()
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="flex items-center gap-1" aria-label={t('quantitySelector')}>
      <Button type="button" variant="outline" size="icon" className="h-7 w-7"
        onClick={() => setQuantity((current) => Math.max(1, current - 1))}
        disabled={quantity === 1} aria-label={t('decreaseQuantity')}>
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-7 text-center text-sm font-medium">{quantity}</span>
      <Button type="button" variant="outline" size="icon" className="h-7 w-7"
        onClick={() => setQuantity((current) => Math.min(max, current + 1))}
        disabled={quantity === max} aria-label={t('increaseQuantity')}>
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  )
}
