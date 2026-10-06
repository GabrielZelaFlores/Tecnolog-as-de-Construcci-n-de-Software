# Guía de entrega en Netlify

El proyecto está preparado para ejecutarse con **Prisma + SQLite en local** y con
**Netlify Blobs en producción**. Netlify detectará Next.js y ejecutará el comando
de compilación configurado en `netlify.toml`.

## 1. Crear la cuenta

1. Abre <https://app.netlify.com/signup>.
2. Regístrate con GitHub (recomendado) o con tu correo institucional.
3. Completa la verificación que solicite Netlify.

> Esta parte debe realizarla el propietario de la cuenta porque incluye inicio
> de sesión y posiblemente una verificación de identidad o correo.

## 2. Publicar el repositorio

1. Sube estos cambios a la rama `main` de GitHub.
2. En Netlify, selecciona **Add new project → Import an existing project**.
3. Elige **GitHub** y autoriza únicamente este repositorio si deseas limitar el acceso.
4. Selecciona `GabrielZelaFlores/Tecnolog-as-de-Construcci-n-de-Software`.
5. Verifica los valores detectados:
   - Base directory: `Arquitectura web de n-capas`
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Pulsa **Publish**.
7. Cuando finalice, abre la URL terminada en `.netlify.app` y prueba crear y eliminar un producto.

No hace falta configurar `DATABASE_URL` en Netlify: en producción la aplicación
usa Netlify Blobs automáticamente. Los primeros datos de demostración se crean al
abrir el catálogo por primera vez.

## 3. Capturas que debes subir

Guarda las imágenes en una carpeta llamada `evidencias` y usa estos nombres:

1. `01-cuenta-netlify.png`: panel de Netlify con tu nombre de usuario visible.
2. `02-deploy-publicado.png`: despliegue con estado **Published** y la URL visible.
3. `03-aplicacion-catalogo.png`: página completa con el formulario, el clima y los productos.
4. `04-producto-creado.png`: catálogo después de agregar un producto propio.
5. `05-repositorio-github.png`: repositorio con el código y los archivos modificados.

Evita mostrar contraseñas, tokens, correos privados o claves en las capturas.

## 4. Texto breve para acompañar la entrega

> Se desarrolló una aplicación web de catálogo de productos con ayuda de un
> agente de IA. La solución utiliza Next.js, React, TypeScript y una arquitectura
> N-Capas que separa dominio, aplicación, infraestructura y presentación. Para
> desarrollo local se usa Prisma con SQLite; en Netlify se usa Netlify Blobs para
> persistencia serverless. La aplicación incluye operaciones CRUD, validación con
> expresiones regulares, búsqueda, filtro por disponibilidad, internacionalización
> español/inglés e integración con el servicio externo Open-Meteo. El código se
> aloja en GitHub y se publica mediante despliegue continuo en Netlify.

## 5. Verificación local (opcional)

```powershell
cd "Arquitectura web de n-capas"
npm install
npm run db:push
npm run dev
```

Abre <http://localhost:3000>.
