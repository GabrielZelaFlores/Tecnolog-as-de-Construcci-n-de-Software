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
import type { ProductItem } from '@/presentation/components/ProductList'
import { ProductCatalog } from '@/presentation/components/ProductCatalog'
import { Button } from '@/components/ui/button'
import { Layers, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { I18nProvider, useI18n } from '@/i18n/I18nProvider'
import { LanguageSelector } from '@/presentation/components/LanguageSelector'

export default function Home() {
  return (
    <I18nProvider>
      <StorePage />
    </I18nProvider>
  )
}

function StorePage() {
  const { t } = useI18n()
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
      toast.error(t('loadError'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    const initialLoad = window.setTimeout(loadProducts, 0)
    return () => window.clearTimeout(initialLoad)
  }, [loadProducts])

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
      toast.success(t('deleteSuccess'))
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch {
      toast.error(t('deleteError'))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-foreground text-background flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{t('appTitle')}</h1>
              <p className="text-xs text-muted-foreground">
                {t('appSubtitle')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <LanguageSelector />
            <Button variant="outline" size="sm" onClick={loadProducts} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {t('reload')}
            </Button>
          </div>
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
              <h2 className="text-2xl font-bold">{t('catalogTitle')}</h2>
              <span className="text-sm text-muted-foreground">
                {products.length} {products.length === 1 ? t('productSingular') : t('productPlural')}
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
              <ProductCatalog
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
          {t('footer')}
        </div>
      </footer>
    </div>
  )
}
