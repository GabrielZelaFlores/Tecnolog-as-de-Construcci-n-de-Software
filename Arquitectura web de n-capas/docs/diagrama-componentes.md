# Diagrama de componentes — Tienda N-Capas

El diagrama muestra la separación por capas, la internacionalización, la validación con expresiones regulares y el consumo directo del servicio externo Open-Meteo desde el front end.

```mermaid
flowchart LR
  user([Usuario])

  subgraph browser["Navegador · Front end"]
    page["Página principal\nNext.js / React"]
    i18n["I18nProvider\nEspañol · English"]
    selector["LanguageSelector"]
    form["ProductForm\nValidación Regex"]
    catalog["ProductCatalog"]
    weather["ExternalWeather\nCliente HTTP"]
  end

  subgraph server["Servidor · Back end"]
    api["API REST\n/api/products"]
    usecases["Casos de uso\nApplication Layer"]
    repository["PrismaProductRepository\nInfrastructure Layer"]
    domain["Product\nDomain Layer"]
  end

  database[("SQLite\nBase de datos")]
  external[["Open-Meteo API\nServicio externo"]]

  user --> page
  page --> i18n
  i18n --> selector
  i18n --> form
  i18n --> catalog
  i18n --> weather
  form -->|"POST /api/products"| api
  catalog -->|"GET / DELETE"| api
  api --> usecases
  usecases --> domain
  usecases --> repository
  repository -->|"Prisma ORM"| database
  weather -->|"HTTPS fetch desde el front end"| external

  classDef frontend fill:#e0f2fe,stroke:#0284c7,color:#0c4a6e
  classDef backend fill:#ede9fe,stroke:#7c3aed,color:#3b0764
  classDef data fill:#ecfdf5,stroke:#059669,color:#064e3b
  classDef outside fill:#fff7ed,stroke:#ea580c,color:#7c2d12

  class page,i18n,selector,form,catalog,weather frontend
  class api,usecases,repository,domain backend
  class database data
  class external outside
```

## Responsabilidades

| Componente | Responsabilidad |
|---|---|
| `I18nProvider` | Mantener el idioma y entregar los textos traducidos a la interfaz. |
| `ProductForm` | Validar los datos con regex y enviar productos a la API interna. |
| `ProductCatalog` | Consultar, filtrar, mostrar y eliminar productos. |
| `ExternalWeather` | Consumir Open-Meteo directamente con `fetch` desde el navegador. |
| API REST | Exponer las operaciones de productos a la capa de presentación. |
| Casos de uso y dominio | Aplicar las reglas de negocio sin depender de la interfaz. |
| Repositorio Prisma | Traducir las operaciones del dominio a persistencia SQLite. |

La flecha `ExternalWeather → Open-Meteo API` demuestra que el servicio externo se consume desde el front end y no mediante la API interna de la aplicación.
