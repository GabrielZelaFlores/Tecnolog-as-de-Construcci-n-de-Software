'use client'

// ===================================================================
// CAPA 4: PRESENTATION LAYER (Página principal)
// -------------------------------------------------------------------
// Orquesta los componentes UI: formulario + lista de productos.
// Toda la comunicación con el backend va por HTTP a /api/products,
// respetando la separación de capas (la UI no toca el dominio).
// ===================================================================

import { useEffect, useState, useCallback } from 'react'
import { ProductForm } from '@/presentation/components/ProductForm'
import { ProductList, type ProductItem } from '@/presentation/components/ProductList'
import { Button } from '@/components/ui/button'
import { Layers, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

export default function Home() {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      const json = await res.json()
      setProducts(json.data ?? [])
    } catch {
      toast.error('No se pudieron cargar los productos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
      toast.success('Producto eliminado')
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch {
      toast.error('No se pudo eliminar el producto')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-foreground text-background flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Tienda N-Capas</h1>
              <p className="text-xs text-muted-foreground">
                Demo de arquitectura Layered (Domain · Infrastructure · Application · Presentation)
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={loadProducts} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Recargar
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* Sidebar: formulario */}
          <aside className="lg:sticky lg:top-8 self-start">
            <ProductForm onCreated={loadProducts} />
          </aside>

          {/* Contenido: lista de productos */}
          <section>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-2xl font-bold">Catálogo de productos</h2>
              <span className="text-sm text-muted-foreground">
                {products.length} producto{products.length === 1 ? '' : 's'}
              </span>
            </div>

            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-44 rounded-xl bg-muted animate-pulse"
                    aria-hidden
                  />
                ))}
              </div>
            ) : (
              <ProductList
                products={products}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          Ejemplo educativo · Arquitectura N-Capas con Next.js + Prisma · Principios SoC & SOLID
        </div>
      </footer>
    </div>
  )
}
