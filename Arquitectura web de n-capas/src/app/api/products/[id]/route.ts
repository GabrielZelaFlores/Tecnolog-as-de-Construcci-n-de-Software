// ===================================================================
// CAPA 4: PRESENTATION LAYER (API REST Controller)
// -------------------------------------------------------------------
// Sub-ruta dinámica para un producto individual: /api/products/[id]
// ===================================================================

import { NextRequest, NextResponse } from 'next/server'
import { useCases } from '@/application/use-cases'
import { toDTO } from '@/application/dto/ProductDTO'

// GET /api/products/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const product = await useCases.getProductById.execute(id)
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }
    return NextResponse.json({ data: toDTO(product) })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PUT /api/products/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await req.json()
    const updated = await useCases.updateProduct.execute(id, {
      name: body.name,
      description: body.description,
      price: body.price !== undefined ? Number(body.price) : undefined,
      stock: body.stock !== undefined ? Number(body.stock) : undefined,
      category: body.category,
    })
    if (!updated) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }
    return NextResponse.json({ data: toDTO(updated) })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

// DELETE /api/products/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const ok = await useCases.deleteProduct.execute(id)
    if (!ok) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
