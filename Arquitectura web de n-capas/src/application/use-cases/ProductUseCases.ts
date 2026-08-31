// ===================================================================
// CAPA 3: APPLICATION LAYER
// -------------------------------------------------------------------
// Casos de uso (Use Cases) = lógica de negocio orquestada.
// Reciben un repositorio inyectado (Dependency Inversion) y aplican
// reglas de negocio antes de devolver datos a la presentación.
// ===================================================================

import { Product } from '@/domain/entities/Product'
import { IProductRepository } from '@/domain/repositories/IProductRepository'

/**
 * Caso de uso: listar todos los productos.
 */
export class GetAllProductsUseCase {
  constructor(private readonly repo: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.repo.findAll()
  }
}

/**
 * Caso de uso: obtener un producto por id.
 */
export class GetProductByIdUseCase {
  constructor(private readonly repo: IProductRepository) {}

  async execute(id: string): Promise<Product | null> {
    return this.repo.findById(id)
  }
}

/**
 * Caso de uso: crear un producto.
 * Aplica validaciones de negocio antes de persistir.
 */
export class CreateProductUseCase {
  constructor(private readonly repo: IProductRepository) {}

  async execute(input: {
    name: string
    description?: string
    price: number
    stock: number
    category: string
  }): Promise<Product> {
    // --- Reglas de negocio ---
    if (!input.name || input.name.trim().length < 2) {
      throw new Error('El nombre del producto debe tener al menos 2 caracteres')
    }
    if (input.price < 0) {
      throw new Error('El precio no puede ser negativo')
    }
    if (input.stock < 0) {
      throw new Error('El stock no puede ser negativo')
    }
    return this.repo.create(input)
  }
}

/**
 * Caso de uso: actualizar un producto existente.
 */
export class UpdateProductUseCase {
  constructor(private readonly repo: IProductRepository) {}

  async execute(
    id: string,
    input: {
      name?: string
      description?: string
      price?: number
      stock?: number
      category?: string
    },
  ): Promise<Product | null> {
    if (input.price !== undefined && input.price < 0) {
      throw new Error('El precio no puede ser negativo')
    }
    if (input.stock !== undefined && input.stock < 0) {
      throw new Error('El stock no puede ser negativo')
    }
    return this.repo.update(id, input)
  }
}

/**
 * Caso de uso: eliminar un producto.
 */
export class DeleteProductUseCase {
  constructor(private readonly repo: IProductRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.repo.delete(id)
  }
}
