'use client'

// ===================================================================
// CAPA 4: PRESENTATION LAYER (UI Component)
// -------------------------------------------------------------------
// Lista de productos con opción de eliminar. Consume /api/products.
// ===================================================================

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Package } from 'lucide-react'

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
}

export function ProductList({ products, onDelete, deletingId }: ProductListProps) {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Aún no hay productos registrados.</p>
          <p className="text-sm text-muted-foreground">
            Crea el primero usando el formulario de la izquierda.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {products.map((p) => (
        <Card key={p.id} className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base leading-tight">{p.name}</CardTitle>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <Badge variant="secondary">{p.category}</Badge>
              {p.isAvailable ? (
                <Badge variant="default">En stock ({p.stock})</Badge>
              ) : (
                <Badge variant="destructive">Agotado</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <p className="text-sm text-muted-foreground min-h-[2.5rem]">
              {p.description || 'Sin descripción'}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xl font-bold">S/ {p.price.toFixed(2)}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(p.id)}
                disabled={deletingId === p.id}
                aria-label={`Eliminar ${p.name}`}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
