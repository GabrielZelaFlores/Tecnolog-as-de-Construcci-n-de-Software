// ===================================================================
// CAPA 1: DOMAIN LAYER
// -------------------------------------------------------------------
// Contrato (interface) que define las operaciones de persistencia
// para la entidad Product. Las implementaciones concretas viven en
// la capa de infraestructura (Dependency Inversion Principle).
// ===================================================================

import { Product, CreateProductInput, UpdateProductInput } from '../entities/Product'

export interface IProductRepository {
  findAll(): Promise<Product[]>
  findById(id: string): Promise<Product | null>
  findByCategory(category: string): Promise<Product[]>
  create(input: CreateProductInput): Promise<Product>
  update(id: string, input: UpdateProductInput): Promise<Product | null>
  delete(id: string): Promise<boolean>
}
