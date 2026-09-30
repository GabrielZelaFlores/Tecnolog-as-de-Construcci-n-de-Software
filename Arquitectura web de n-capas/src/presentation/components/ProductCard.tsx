import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'
import { ProductQuantitySelector } from './ProductQuantitySelector'
import type { ProductItem } from './ProductList'
import { useCategoryLabel, useI18n } from '@/i18n/I18nProvider'

interface ProductCardProps {
  product: ProductItem
  onDelete: (id: string) => void
  isDeleting: boolean
}

// STATELESS 2: no guarda estado; su resultado depende de sus props.
export function ProductCard({ product, onDelete, isDeleting }: ProductCardProps) {
  const { t } = useI18n()
  const categoryLabel = useCategoryLabel()
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base leading-tight">{product.name}</CardTitle>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Badge variant="secondary">{categoryLabel(product.category)}</Badge>
          {product.isAvailable ? <Badge>{t('inStock')} ({product.stock})</Badge> :
            <Badge variant="destructive">{t('soldOut')}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <p className="min-h-[2.5rem] text-sm text-muted-foreground">
          {product.description || t('noDescription')}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold">S/ {product.price.toFixed(2)}</span>
          <Button variant="ghost" size="icon" onClick={() => onDelete(product.id)}
            disabled={isDeleting} aria-label={`${t('delete')} ${product.name}`}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
        {product.isAvailable && (
          <div className="mt-3 flex items-center justify-between border-t pt-3">
            <span className="text-xs text-muted-foreground">{t('quantity')}</span>
            <ProductQuantitySelector max={product.stock} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
