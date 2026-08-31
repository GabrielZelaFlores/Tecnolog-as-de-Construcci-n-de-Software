// ===================================================================
// CAPA 3: APPLICATION LAYER (Business Layer)
// -------------------------------------------------------------------
// DTOs (Data Transfer Objects) que viajan entre la capa de
// presentación y la capa de aplicación. Aislan el dominio del
// formato de entrada/salida HTTP.
// ===================================================================

export interface ProductDTO {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  category: string
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateProductDTO {
  name: string
  description?: string
  price: number
  stock: number
  category: string
}

export interface UpdateProductDTO {
  name?: string
  description?: string
  price?: number
  stock?: number
  category?: string
}

/**
 * Convierte una entidad de dominio en un DTO seguro para la capa HTTP.
 */
export function toDTO(product: {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  category: string
  createdAt: Date
  updatedAt: Date
  isAvailable: () => boolean
}): ProductDTO {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category: product.category,
    isAvailable: product.isAvailable(),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }
}
