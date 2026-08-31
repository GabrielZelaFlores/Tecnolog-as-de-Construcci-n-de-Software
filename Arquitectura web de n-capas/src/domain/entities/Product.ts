// ===================================================================
// CAPA 1: DOMAIN LAYER
// -------------------------------------------------------------------
// Contiene las entidades puras del negocio y los contratos
// (interfaces) que deben cumplir los repositorios.
// NO depende de ningún framework ni de la base de datos.
// ===================================================================

/**
 * Entidad Product del dominio.
 * Representa un producto de e-commerce con sus reglas de negocio.
 */
export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string | null,
    public price: number,
    public stock: number,
    public category: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * Regla de negocio: un producto está disponible si tiene stock.
   */
  isAvailable(): boolean {
    return this.stock > 0
  }

  /**
   * Regla de negocio: aplica descuento si el precio supera el umbral.
   */
  applyDiscount(percentage: number): number {
    if (percentage < 0 || percentage > 100) {
      throw new Error('El porcentaje de descuento debe estar entre 0 y 100')
    }
    return this.price * (1 - percentage / 100)
  }
}

/**
 * DTO de entrada para crear un producto.
 */
export interface CreateProductInput {
  name: string
  description?: string
  price: number
  stock: number
  category: string
}

/**
 * DTO de entrada para actualizar un producto.
 */
export interface UpdateProductInput {
  name?: string
  description?: string
  price?: number
  stock?: number
  category?: string
}
