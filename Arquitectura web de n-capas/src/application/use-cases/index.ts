// ===================================================================
// CAPA 3: APPLICATION LAYER
// -------------------------------------------------------------------
// Composición de dependencias (Composition Root parcial).
// Aquí se instancian las implementaciones concretas y se inyectan
// en los casos de uso. La capa de presentación importa este módulo
// para no acoplarse a clases concretas.
// ===================================================================

import { PrismaProductRepository } from '@/infrastructure/repositories/PrismaProductRepository'
import {
  GetAllProductsUseCase,
  GetProductByIdUseCase,
  CreateProductUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
} from './ProductUseCases'

// Instancia única del repositorio (en un proyecto mayor, usaríamos
// un contenedor de DI; aquí mantenemos el ejemplo simple con un singleton).
const productRepository = new PrismaProductRepository()

export const useCases = {
  getAllProducts: new GetAllProductsUseCase(productRepository),
  getProductById: new GetProductByIdUseCase(productRepository),
  createProduct: new CreateProductUseCase(productRepository),
  updateProduct: new UpdateProductUseCase(productRepository),
  deleteProduct: new DeleteProductUseCase(productRepository),
}
