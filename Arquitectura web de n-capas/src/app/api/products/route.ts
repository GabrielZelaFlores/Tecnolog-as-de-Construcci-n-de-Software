// ===================================================================
// CAPA 4: PRESENTATION LAYER (API REST Controller)
// -------------------------------------------------------------------
// Endpoints HTTP para productos. Esta capa SOLO se encarga de:
//   1) Parsear la request HTTP.
//   2) Llamar al caso de uso correspondiente.
//   3) Devolver una respuesta HTTP con el DTO.
// NO contiene lógica de negocio (eso vive en la capa de aplicación).
// ===================================================================

import { NextRequest, NextResponse } from 'next/server'
import { useCases } from '@/application/use-cases'
import { toDTO } from '@/application/dto/ProductDTO'

// GET /api/products            -> listar todos
// GET /api/products?category=X -> filtrar por categoría
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const products = await useCases.getAllProducts.execute()
    return NextResponse.json({ data: products.map(toDTO) })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/products -> crear un producto
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const created = await useCases.createProduct.execute({
      name: body.name,
      description: body.description,
      price: Number(body.price),
      stock: Number(body.stock),
      category: body.category || 'General',
    })
    return NextResponse.json({ data: toDTO(created) }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
