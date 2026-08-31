// ===================================================================
// CAPA 2: INFRASTRUCTURE LAYER (Data Access Layer)
// -------------------------------------------------------------------
// Implementación concreta del repositorio usando Prisma ORM.
// Conoce la base de datos, pero la capa de aplicación NO lo sabe:
// solo ve la interface IProductRepository (Dependency Inversion).
// ===================================================================

import { db } from '@/lib/db'
import { Product, CreateProductInput, UpdateProductInput } from '@/domain/entities/Product'
import { IProductRepository } from '@/domain/repositories/IProductRepository'

/**
 * Mapa entre el modelo de Prisma (fila de BD) y la entidad de dominio.
 * Así la capa de dominio permanece agnóstica a Prisma.
 */
function mapToDomain(row: any): Product {
  return new Product(
    row.id,
    row.name,
    row.description,
    row.price,
    row.stock,
    row.category,
    row.createdAt,
    row.updatedAt,
  )
}

export class PrismaProductRepository implements IProductRepository {
  async findAll(): Promise<Product[]> {
    const rows = await db.product.findMany({ orderBy: { createdAt: 'desc' } })
    return rows.map(mapToDomain)
  }

  async findById(id: string): Promise<Product | null> {
    const row = await db.product.findUnique({ where: { id } })
    return row ? mapToDomain(row) : null
  }

  async findByCategory(category: string): Promise<Product[]> {
    const rows = await db.product.findMany({
      where: { category },
      orderBy: { createdAt: 'desc' },
    })
    return rows.map(mapToDomain)
  }

  async create(input: CreateProductInput): Promise<Product> {
    const row = await db.product.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        price: input.price,
        stock: input.stock,
        category: input.category,
      },
    })
    return mapToDomain(row)
  }

  async update(id: string, input: UpdateProductInput): Promise<Product | null> {
    try {
      const row = await db.product.update({
        where: { id },
        data: { ...input },
      })
      return mapToDomain(row)
    } catch {
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await db.product.delete({ where: { id } })
      return true
    } catch {
      return false
    }
  }
}
