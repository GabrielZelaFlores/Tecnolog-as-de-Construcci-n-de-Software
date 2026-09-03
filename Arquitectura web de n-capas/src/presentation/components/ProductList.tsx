import { Card, CardContent } from '@/components/ui/card'
import { Package } from 'lucide-react'
import { ProductCard } from './ProductCard'

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
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">
            {emptyMessage ?? 'Aún no hay productos registrados.'}
          </p>
          {!emptyMessage && (
            <p className="text-sm text-muted-foreground">
              Crea el primero usando el formulario de la izquierda.
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
