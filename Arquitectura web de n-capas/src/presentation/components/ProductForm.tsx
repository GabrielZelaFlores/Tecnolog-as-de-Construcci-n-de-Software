'use client'

// CAPA 4: formulario de presentación con validación regex en el cliente.
// La API sigue siendo el único punto de comunicación con la lógica de negocio.

import { useState } from 'react'
import { BadgeCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCategoryLabel, useI18n } from '@/i18n/I18nProvider'

interface ProductFormProps {
  onCreated: () => void
}

const CATEGORIES = ['Electrónica', 'Ropa', 'Hogar', 'Libros', 'Juguetes', 'General']

// Expresiones regulares solicitadas para validar cada dato antes del envío.
const PATTERNS = {
  name: /^[\p{L}\p{N}][\p{L}\p{N}\s.,&'()\-]{2,59}$/u,
  description: /^[\p{L}\p{N}\s.,;:¡!¿?'"()/%+&\-\n]{0,200}$/u,
  price: /^(?!(?:0+(?:\.0{1,2})?)$)(?:0|[1-9]\d{0,5})(?:\.\d{1,2})?$/,
  stock: /^(?:0|[1-9]\d{0,3})$/,
}

type FieldName = 'name' | 'description' | 'price' | 'stock'
type TouchedFields = Record<FieldName, boolean>

const untouchedFields: TouchedFields = {
  name: false,
  description: false,
  price: false,
  stock: false,
}

export function ProductForm({ onCreated }: ProductFormProps) {
  const { t } = useI18n()
  const categoryLabel = useCategoryLabel()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [category, setCategory] = useState('General')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState<TouchedFields>(untouchedFields)

  const values: Record<FieldName, string> = { name, description, price, stock }
  const errors: Partial<Record<FieldName, string>> = {}

  if (!PATTERNS.name.test(name.trim())) errors.name = t('nameError')
  if (!PATTERNS.description.test(description.trim())) errors.description = t('descriptionError')
  if (!PATTERNS.price.test(price)) errors.price = t('priceError')
  if (!PATTERNS.stock.test(stock)) errors.stock = t('stockError')

  function markTouched(field: FieldName) {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  function fieldIsInvalid(field: FieldName) {
    return touched[field] && Boolean(errors[field])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched({ name: true, description: true, price: true, stock: true })
    setError(null)

    const hasInvalidField = (Object.keys(values) as FieldName[]).some((field) => errors[field])
    if (hasInvalidField) {
      setError(t('formError'))
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          price: Number(price),
          stock: Number(stock),
          category,
        }),
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error || t('createError'))
      }
      setName('')
      setDescription('')
      setPrice('')
      setStock('')
      setCategory('General')
      setTouched(untouchedFields)
      toast.success(t('created'))
      onCreated()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('createError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="border-b bg-muted/40 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg">{t('newProduct')}</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">{t('regexHelp')}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-medium text-emerald-800">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {t('regexActive')}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              onBlur={() => markTouched('name')}
              placeholder={t('namePlaceholder')}
              aria-invalid={fieldIsInvalid('name')}
              aria-describedby={fieldIsInvalid('name') ? 'name-error' : undefined}
              className={fieldIsInvalid('name') ? 'border-red-500 focus-visible:ring-red-500' : ''}
            />
            {fieldIsInvalid('name') && <FieldError id="name-error" message={errors.name!} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('description')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              onBlur={() => markTouched('description')}
              placeholder={t('descriptionPlaceholder')}
              rows={2}
              maxLength={201}
              aria-invalid={fieldIsInvalid('description')}
              aria-describedby={fieldIsInvalid('description') ? 'description-error' : undefined}
              className={fieldIsInvalid('description') ? 'border-red-500 focus-visible:ring-red-500' : ''}
            />
            {fieldIsInvalid('description') && <FieldError id="description-error" message={errors.description!} />}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">{t('price')}</Label>
              <Input
                id="price"
                inputMode="decimal"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                onBlur={() => markTouched('price')}
                placeholder={t('pricePlaceholder')}
                aria-invalid={fieldIsInvalid('price')}
                aria-describedby={fieldIsInvalid('price') ? 'price-error' : undefined}
                className={fieldIsInvalid('price') ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {fieldIsInvalid('price') && <FieldError id="price-error" message={errors.price!} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">{t('stock')}</Label>
              <Input
                id="stock"
                inputMode="numeric"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                onBlur={() => markTouched('stock')}
                placeholder={t('stockPlaceholder')}
                aria-invalid={fieldIsInvalid('stock')}
                aria-describedby={fieldIsInvalid('stock') ? 'stock-error' : undefined}
                className={fieldIsInvalid('stock') ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {fieldIsInvalid('stock') && <FieldError id="stock-error" message={errors.stock!} />}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{t('category')}</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder={t('select')} />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((item) => (
                  <SelectItem key={item} value={item}>{categoryLabel(item)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t('saving') : t('submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function FieldError({ id, message }: { id: string; message: string }) {
  return <p id={id} className="text-xs text-red-600" role="alert">{message}</p>
}
