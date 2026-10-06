// ===================================================================
// CAPA 3: APPLICATION LAYER
// -------------------------------------------------------------------
// Composición de dependencias (Composition Root parcial).
// Aquí se instancian las implementaciones concretas y se inyectan
// en los casos de uso. La capa de presentación importa este módulo
// para no acoplarse a clases concretas.
// ===================================================================

import { PrismaProductRepository } from '@/infrastructure/repositories/PrismaProductRepository'
import { NetlifyBlobProductRepository } from '@/infrastructure/repositories/NetlifyBlobProductRepository'
import {
  GetAllProductsUseCase,
  GetProductByIdUseCase,
  CreateProductUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
} from './ProductUseCases'

// Instancia única del repositorio (en un proyecto mayor, usaríamos
// un contenedor de DI; aquí mantenemos el ejemplo simple con un singleton).
const isNetlifyRuntime = process.env.NETLIFY === 'true' || Boolean(process.env.NETLIFY_SITE_ID)

const productRepository = isNetlifyRuntime
  ? new NetlifyBlobProductRepository()
  : new PrismaProductRepository()

export const useCases = {
  getAllProducts: new GetAllProductsUseCase(productRepository),
  getProductById: new GetProductByIdUseCase(productRepository),
  createProduct: new CreateProductUseCase(productRepository),
  updateProduct: new UpdateProductUseCase(productRepository),
  deleteProduct: new DeleteProductUseCase(productRepository),
}
