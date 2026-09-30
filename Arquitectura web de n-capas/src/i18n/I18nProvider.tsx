'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type Language = 'es' | 'en'

const messages = {
  es: {
    appTitle: 'Tienda N-Capas',
    appSubtitle: 'Arquitectura por capas · Catálogo internacional',
    language: 'Idioma',
    spanish: 'Español',
    english: 'English',
    reload: 'Recargar',
    loadError: 'No se pudieron cargar los productos',
    deleteSuccess: 'Producto eliminado',
    deleteError: 'No se pudo eliminar el producto',
    catalogTitle: 'Catálogo de productos',
    productSingular: 'producto',
    productPlural: 'productos',
    newProduct: 'Nuevo producto',
    regexActive: 'Validación Regex activa',
    regexHelp: 'Los campos se validan antes de enviar el formulario.',
    name: 'Nombre *',
    namePlaceholder: 'Ej. Auriculares Bluetooth',
    nameError: 'Usa de 3 a 60 caracteres: letras, números y signos básicos.',
    description: 'Descripción',
    descriptionPlaceholder: 'Detalles del producto...',
    descriptionError: 'Máximo 200 caracteres; no se permiten símbolos especiales.',
    price: 'Precio (S/) *',
    pricePlaceholder: 'Ej. 149.90',
    priceError: 'Ingresa un precio mayor a 0 con máximo 2 decimales.',
    stock: 'Stock *',
    stockPlaceholder: 'Ej. 25',
    stockError: 'Ingresa un número entero entre 0 y 9999.',
    category: 'Categoría',
    select: 'Seleccione...',
    submit: 'Agregar producto',
    saving: 'Guardando...',
    createError: 'Error al crear el producto',
    formError: 'Revisa los campos marcados antes de continuar.',
    created: 'Producto agregado correctamente',
    searchPlaceholder: 'Buscar por nombre o categoría...',
    searchLabel: 'Buscar productos',
    onlyAvailable: 'Solo disponibles',
    total: 'Productos',
    available: 'Disponibles',
    outOfStock: 'Agotados',
    inStock: 'En stock',
    soldOut: 'Agotado',
    noDescription: 'Sin descripción',
    quantity: 'Cantidad',
    quantitySelector: 'Selector de cantidad',
    decreaseQuantity: 'Disminuir cantidad',
    increaseQuantity: 'Aumentar cantidad',
    delete: 'Eliminar',
    empty: 'Aún no hay productos registrados.',
    emptyHelp: 'Crea el primero usando el formulario de la izquierda.',
    noMatches: 'No hay productos que coincidan con el filtro.',
    footer: 'Ejemplo educativo · Internacionalización y validación con Regex · Next.js + Prisma',
    categoryElectronics: 'Electrónica',
    categoryClothing: 'Ropa',
    categoryHome: 'Hogar',
    categoryBooks: 'Libros',
    categoryToys: 'Juguetes',
    categoryGeneral: 'General',
  },
  en: {
    appTitle: 'N-Layer Store',
    appSubtitle: 'Layered architecture · International catalog',
    language: 'Language',
    spanish: 'Español',
    english: 'English',
    reload: 'Reload',
    loadError: 'Products could not be loaded',
    deleteSuccess: 'Product deleted',
    deleteError: 'The product could not be deleted',
    catalogTitle: 'Product catalog',
    productSingular: 'product',
    productPlural: 'products',
    newProduct: 'New product',
    regexActive: 'Regex validation active',
    regexHelp: 'Fields are validated before the form is submitted.',
    name: 'Name *',
    namePlaceholder: 'E.g. Bluetooth headphones',
    nameError: 'Use 3 to 60 characters: letters, numbers, and basic punctuation.',
    description: 'Description',
    descriptionPlaceholder: 'Product details...',
    descriptionError: 'Maximum 200 characters; special symbols are not allowed.',
    price: 'Price (S/) *',
    pricePlaceholder: 'E.g. 149.90',
    priceError: 'Enter a price greater than 0 with up to 2 decimal places.',
    stock: 'Stock *',
    stockPlaceholder: 'E.g. 25',
    stockError: 'Enter a whole number between 0 and 9999.',
    category: 'Category',
    select: 'Select...',
    submit: 'Add product',
    saving: 'Saving...',
    createError: 'Error creating the product',
    formError: 'Check the highlighted fields before continuing.',
    created: 'Product added successfully',
    searchPlaceholder: 'Search by name or category...',
    searchLabel: 'Search products',
    onlyAvailable: 'Available only',
    total: 'Products',
    available: 'Available',
    outOfStock: 'Out of stock',
    inStock: 'In stock',
    soldOut: 'Sold out',
    noDescription: 'No description',
    quantity: 'Quantity',
    quantitySelector: 'Quantity selector',
    decreaseQuantity: 'Decrease quantity',
    increaseQuantity: 'Increase quantity',
    delete: 'Delete',
    empty: 'No products have been registered yet.',
    emptyHelp: 'Create the first one using the form on the left.',
    noMatches: 'No products match the filter.',
    footer: 'Educational example · Internationalization and Regex validation · Next.js + Prisma',
    categoryElectronics: 'Electronics',
    categoryClothing: 'Clothing',
    categoryHome: 'Home',
    categoryBooks: 'Books',
    categoryToys: 'Toys',
    categoryGeneral: 'General',
  },
} as const

export type TranslationKey = keyof (typeof messages)['es']

interface I18nContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('es')

  useEffect(() => {
    document.documentElement.lang = language
    window.localStorage.setItem('app-language', language)
  }, [language])

  const value = useMemo<I18nContextValue>(() => ({
    language,
    setLanguage,
    t: (key) => messages[language][key],
  }), [language])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used inside I18nProvider')
  return context
}

const categoryKeys: Record<string, TranslationKey> = {
  'Electrónica': 'categoryElectronics',
  Ropa: 'categoryClothing',
  Hogar: 'categoryHome',
  Libros: 'categoryBooks',
  Juguetes: 'categoryToys',
  General: 'categoryGeneral',
}

export function useCategoryLabel() {
  const { t } = useI18n()
  return (category: string) => t(categoryKeys[category] ?? 'categoryGeneral')
}
