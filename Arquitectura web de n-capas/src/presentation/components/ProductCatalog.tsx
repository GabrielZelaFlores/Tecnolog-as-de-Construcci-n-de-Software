'use client'

import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Search } from 'lucide-react'
import { ProductList, type ProductItem } from './ProductList'
import { ProductSummary } from './ProductSummary'

interface ProductCatalogProps {
  products: ProductItem[]
  onDelete: (id: string) => void
  deletingId: string | null
}

// STATEFUL 2: guarda el texto de búsqueda y el filtro de disponibilidad.
export function ProductCatalog({ products, onDelete, deletingId }: ProductCatalogProps) {
  const [search, setSearch] = useState('')
  const [onlyAvailable, setOnlyAvailable] = useState(false)

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('es')
    return products.filter((product) => {
      const matchesText = term === '' ||
        product.name.toLocaleLowerCase('es').includes(term) ||
        product.category.toLocaleLowerCase('es').includes(term)
      return matchesText && (!onlyAvailable || product.isAvailable)
    })
  }, [products, search, onlyAvailable])

  const available = products.filter((product) => product.isAvailable).length

  return (
    <>
      <ProductSummary total={products.length} available={available}
        outOfStock={products.length - available} />
      <div className="mb-4 flex flex-col gap-3 rounded-lg border bg-background p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre o categoría..." className="pl-9"
            aria-label="Buscar productos" />
        </div>
        <div className="flex items-center gap-2">
          <Switch id="only-available" checked={onlyAvailable}
            onCheckedChange={setOnlyAvailable} />
          <Label htmlFor="only-available">Solo disponibles</Label>
        </div>
      </div>
      <ProductList products={filteredProducts} onDelete={onDelete}
        deletingId={deletingId}
        emptyMessage={products.length > 0 ? 'No hay productos que coincidan con el filtro.' : undefined} />
    </>
  )
}
