// Repositorio de producción para Netlify.
// Conserva el contrato del dominio y reemplaza el archivo SQLite local por
// un almacén persistente administrado por Netlify Blobs.

import { randomUUID } from 'node:crypto'
import { getStore } from '@netlify/blobs'
import { Product, CreateProductInput, UpdateProductInput } from '@/domain/entities/Product'
import { IProductRepository } from '@/domain/repositories/IProductRepository'

interface StoredProduct {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  category: string
  createdAt: string
  updatedAt: string
}

const STORE_NAME = 'n-layer-store'
const CATALOG_KEY = 'products'

const DEMO_PRODUCTS: StoredProduct[] = [
  {
    id: 'demo-headphones',
    name: 'Auriculares Bluetooth',
    description: 'Sonido envolvente y hasta 30 horas de batería.',
    price: 149.9,
    stock: 18,
    category: 'Electrónica',
    createdAt: '2026-09-30T14:00:00.000Z',
    updatedAt: '2026-09-30T14:00:00.000Z',
  },
  {
    id: 'demo-backpack',
    name: 'Mochila urbana',
    description: 'Compartimento acolchado para laptop de 15 pulgadas.',
    price: 89,
    stock: 9,
    category: 'Ropa',
    createdAt: '2026-09-30T13:00:00.000Z',
    updatedAt: '2026-09-30T13:00:00.000Z',
  },
  {
    id: 'demo-clean-code',
    name: 'Libro Clean Code',
    description: 'Buenas prácticas para escribir software mantenible.',
    price: 120,
    stock: 0,
    category: 'Libros',
    createdAt: '2026-09-30T12:00:00.000Z',
    updatedAt: '2026-09-30T12:00:00.000Z',
  },
]

function toDomain(row: StoredProduct): Product {
  return new Product(
    row.id,
    row.name,
    row.description,
    row.price,
    row.stock,
    row.category,
    new Date(row.createdAt),
    new Date(row.updatedAt),
  )
}

export class NetlifyBlobProductRepository implements IProductRepository {
  private async readAll(): Promise<StoredProduct[]> {
    const store = getStore(STORE_NAME)
    const current = await store.get(CATALOG_KEY, {
      type: 'json',
      consistency: 'strong',
    }) as StoredProduct[] | null

    if (current) return current

    const initial = DEMO_PRODUCTS.map((product) => ({ ...product }))
    const result = await store.setJSON(CATALOG_KEY, initial, { onlyIfNew: true })
    if (result.modified) return initial

    return await store.get(CATALOG_KEY, {
      type: 'json',
      consistency: 'strong',
    }) as StoredProduct[] ?? []
  }

  private async writeAll(products: StoredProduct[]): Promise<void> {
    await getStore(STORE_NAME).setJSON(CATALOG_KEY, products)
  }

  async findAll(): Promise<Product[]> {
    return (await this.readAll())
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(toDomain)
  }

  async findById(id: string): Promise<Product | null> {
    const row = (await this.readAll()).find((product) => product.id === id)
    return row ? toDomain(row) : null
  }

  async findByCategory(category: string): Promise<Product[]> {
    return (await this.readAll())
      .filter((product) => product.category === category)
      .map(toDomain)
  }

  async create(input: CreateProductInput): Promise<Product> {
    const products = await this.readAll()
    const now = new Date().toISOString()
    const created: StoredProduct = {
      id: randomUUID(),
      name: input.name,
      description: input.description ?? null,
      price: input.price,
      stock: input.stock,
      category: input.category,
      createdAt: now,
      updatedAt: now,
    }

    await this.writeAll([created, ...products])
    return toDomain(created)
  }

  async update(id: string, input: UpdateProductInput): Promise<Product | null> {
    const products = await this.readAll()
    const index = products.findIndex((product) => product.id === id)
    if (index === -1) return null

    const updated: StoredProduct = {
      ...products[index],
      ...input,
      description: input.description ?? products[index].description,
      updatedAt: new Date().toISOString(),
    }
    products[index] = updated
    await this.writeAll(products)
    return toDomain(updated)
  }

  async delete(id: string): Promise<boolean> {
    const products = await this.readAll()
    const remaining = products.filter((product) => product.id !== id)
    if (remaining.length === products.length) return false

    await this.writeAll(remaining)
    return true
  }
}
