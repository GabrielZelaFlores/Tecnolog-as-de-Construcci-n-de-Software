import { Card, CardContent } from '@/components/ui/card'
import { Package } from 'lucide-react'
import { ProductCard } from './ProductCard'
import { useI18n } from '@/i18n/I18nProvider'

export interface ProductItem {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  category: string
  isAvailable: boolean
  createdAt: string
}

interface ProductListProps {
  products: ProductItem[]
  onDelete: (id: string) => void
  deletingId: string | null
  emptyMessage?: string
}

export function ProductList({ products, onDelete, deletingId, emptyMessage }: ProductListProps) {
  const { t } = useI18n()
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">
            {emptyMessage ?? t('empty')}
          </p>
          {!emptyMessage && (
            <p className="text-sm text-muted-foreground">
              {t('emptyHelp')}
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onDelete={onDelete}
          isDeleting={deletingId === product.id} />
      ))}
    </div>
  )
}
