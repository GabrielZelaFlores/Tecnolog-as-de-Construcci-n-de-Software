# Tienda N-Capas — Arquitectura Layered (N-Layer)

Aplicación web sencilla que demuestra la **arquitectura N-Capas** (Layered Architecture)
basada en el artículo de Mehmet Ozkaya:
https://medium.com/design-microservices-architecture-with-patterns/layered-n-layer-architecture-e15ffdb7fa42

Implementa un catálogo de productos de e-commerce con operaciones CRUD y aplica los
principios **SoC (Separation of Concerns)** y **SOLID** (especialmente *Dependency
Inversion*).

---

## Stack tecnológico

| Capa              | Tecnología                                  |
|-------------------|---------------------------------------------|
| Presentación (UI) | Next.js 16 (App Router) + React 19 + Tailwind + shadcn/ui |
| Presentación (API)| Next.js Route Handlers (REST)               |
| Aplicación        | Casos de uso en TypeScript                  |
| Infraestructura   | Prisma ORM + SQLite                         |
| Dominio           | Entidades e interfaces en TypeScript        |

---

## Estructura de carpetas (N-Capas)

```
src/
├── domain/                          #  CAPA 1: DOMINIO
│   ├── entities/
│   │   └── Product.ts               # Entidad de negocio + reglas (isAvailable, applyDiscount)
│   └── repositories/
│       └── IProductRepository.ts    # Contrato (interface) del repositorio
│
├── infrastructure/                  #  CAPA 2: INFRAESTRUCTURA (Data Access)
│   └── repositories/
│       └── PrismaProductRepository.ts   # Implementación concreta con Prisma
│
├── application/                     #  CAPA 3: APLICACIÓN (Business Logic)
│   ├── dto/
│   │   └── ProductDTO.ts            # Data Transfer Objects + mapper toDTO()
│   └── use-cases/
│       ├── ProductUseCases.ts       # GetAll, GetById, Create, Update, Delete
│       └── index.ts                 # Composition Root: inyecta el repo en los use cases
│
├── presentation/                    #  CAPA 4: PRESENTACIÓN
│   └── components/
│       ├── ProductForm.tsx          # Formulario de alta
│       └── ProductList.tsx          # Grid de tarjetas + eliminar
│
└── app/                             # Punto de entrada Next.js
    ├── page.tsx                     # UI principal que orquesta los componentes
    ├── layout.tsx                   # Layout raíz con Toaster
    └── api/
        └── products/
            ├── route.ts             # GET / POST /api/products
            └── [id]/route.ts        # GET / PUT / DELETE /api/products/:id

prisma/
└── schema.prisma                    # Esquema de la BD (modelo Product)

src/lib/
└── db.ts                            # Cliente Prisma (singleton)
```

###  Flujo de dependencias (Dependency Inversion)

```
Presentación  ──►  Aplicación  ──►  Dominio (interfaces)
                                          ▲
Infraestructura  ─────────────────────────┘  (implementa las interfaces)
```

La capa de **Dominio** no conoce Prisma ni Next.js.
La capa de **Aplicación** recibe el repositorio por inyección (`new CreateProductUseCase(repo)`).
La capa de **Infraestructura** implementa `IProductRepository` usando Prisma.
La capa de **Presentación** solo llama a los casos de uso (o vía HTTP desde el cliente).

---

##  Cómo ejecutar

### 1) Requisitos previos

- Node.js 20+ (o Bun)
- SQLite (ya viene embebido, no requiere instalación)

### 2) Instalar dependencias

```bash
cd /home/z/my-project
bun install        # o: npm install
```

### 3) Crear/sincronizar la base de datos

```bash
bun run db:push    # crea el archivo db/custom.db y aplica el schema
```

### 4) Levantar el servidor de desarrollo

```bash
bun run dev        # o: npm run dev
```

Abrir en el navegador: **http://localhost:3000**

> En este sandbox, la URL pública se muestra en el panel "Preview" a la derecha.

### 5) Probar la API REST directamente

```bash
# Listar
curl http://localhost:3000/api/products

# Crear
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Mouse Logitech","description":"G502 Hero","price":120.0,"stock":10,"category":"Electrónica"}'

# Obtener uno (reemplazar <id>)
curl http://localhost:3000/api/products/<id>

# Actualizar
curl -X PUT http://localhost:3000/api/products/<id> \
  -H "Content-Type: application/json" \
  -d '{"price":99.90}'

# Eliminar
curl -X DELETE http://localhost:3000/api/products/<id>
```

---

##  Endpoints disponibles

| Método  | Ruta                     | Descripción                 |
|---------|--------------------------|-----------------------------|
| GET     | `/api/products`          | Listar todos los productos  |
| POST    | `/api/products`          | Crear un producto           |
| GET     | `/api/products/:id`      | Obtener un producto por id  |
| PUT     | `/api/products/:id`      | Actualizar un producto      |
| DELETE  | `/api/products/:id`      | Eliminar un producto        |

---

##  Cómo usar la aplicación

1. La página principal muestra el catálogo (al principio, vacío).
2. En el formulario de la izquierda, completa los datos del producto.
3. Pulsa **Agregar producto**. La nueva tarjeta aparecerá a la derecha.
4. Para eliminar, pulsa el icono de papelera en la tarjeta del producto.
5. Pulsa **Recargar** (arriba a la derecha) para volver a consultar la API.

---

##  Scripts disponibles

```bash
bun run dev        # servidor de desarrollo (puerto 3000)
bun run lint       # ESLint
bun run db:push    # sincronizar el schema Prisma con la BD
bun run db:generate# regenerar el cliente Prisma
bun run db:reset   # resetear la BD (¡borra datos!)
```
