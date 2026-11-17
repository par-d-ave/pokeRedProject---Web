## 1. Decisiones Técnicas y Supuestos

- **Runtime:** Node.js 22 LTS. `package.json` con `"engines": {"node": ">=22"}` y `"type": "commonjs"` (permite usar `__dirname`).
- **Lenguaje:** TypeScript `~5.6`, `strict: true`. Servidor compilado con `tsc` a `dist/`. Código de navegador compilado con un segundo `tsconfig` a `public/js/`.
- **Servidor:** Express `^4.21`. Sin bundlers, sin frameworks frontend, sin base de datos.
- **Plantillas:** EJS `^3.1` con partials (`<%- include(...) %>`). Se elige EJS para no duplicar cabecera/pie entre las dos vistas.
- **Variables de entorno:** `dotenv ^16`. Solo `PORT` (defecto `3000`) y `NODE_ENV` (defecto `development`). Se documentan en `.env.example`.
- **Desarrollo:** `tsx ^4` (`tsx watch src/server.ts`) para arranque rápido.
- **Pruebas:** `node:test` + `supertest ^7` + `@types/supertest`, ejecutadas con `node --import tsx --test "tests/**/*.test.ts"`.
- **Las 6 mejoras de la web** (las 6 primeras de la tabla "Estado" de `README.md`, ids de ancla entre paréntesis):
  1. Combates ×4 (`combates`)
  2. Movimiento ×2 (`movimiento`)
  3. Texto `FAST` instantáneo (`texto-fast`)
  4. Silenciar alarma de HP bajo (`alarma-hp`)
  5. Evoluciones por intercambio → nivel 36 (`evoluciones`)
  6. Exclusivos de Blue en Safari Zone (`safari-zone`)
- **Contenido:** todo texto sobre las mejoras sale únicamente de `README.md`. Está prohibido inventar etiquetas, direcciones de memoria o código ASM; los diffs reales se pegan después a mano en los placeholders.
- **Nomenclatura de CPU en la web:** "Game Boy (LR35902, derivada del Z80)".
- **Fuentes:** títulos y badges con `Press Start 2P` (Google Fonts, fallback `monospace`); lectura con `system-ui, sans-serif`; ensamblador con `ui-monospace, Consolas, monospace`.
- **Placeholders de media:** cajas de 480×432 px (proporción 10:9, pantalla Game Boy ×3), `max-width: 100%` y `aspect-ratio: 10 / 9`.
- **Breakpoint único:** `768px`. Por debajo, una columna.
- **Render.com:** Web Service Node. Build `npm install && npm run build`, start `npm start`, health check `/health`. Se incluye `render.yaml`.
- **Idioma:** textos visibles en español; identificadores de código en inglés.

## 2. Arquitectura de Carpetas

```text
.                                  (raíz del proyecto web)
├── AGENTS.md
├── PLAN.md
├── README.md                      (README del hackrom, solo lectura)
├── package.json
├── tsconfig.json                  (servidor: src/ → dist/)
├── tsconfig.client.json           (navegador: src/client/ → public/js/)
├── render.yaml
├── .env.example
├── .gitignore                     (node_modules/, dist/, .env, public/js/)
├── src/
│   ├── server.ts                  (listen, log de arranque)
│   ├── app.ts                     (createApp(): configura y devuelve Express)
│   ├── config.ts                  (lee PORT y NODE_ENV)
│   ├── routes/
│   │   ├── health.ts              (GET /health)
│   │   └── pages.ts               (GET /, GET /implementacion)
│   ├── middleware/
│   │   ├── not-found.ts           (404)
│   │   └── error-handler.ts       (500)
│   ├── data/
│   │   └── improvements.ts        (las 6 mejoras tipadas)
│   └── client/
│       └── copy-code.ts           (botón "Copiar código")
├── views/
│   ├── pages/
│   │   ├── landing.ejs
│   │   ├── implementacion.ejs
│   │   ├── not-found.ejs
│   │   └── error.ejs
│   └── partials/
│       ├── head.ejs
│       ├── header.ejs
│       ├── footer.ejs
│       ├── improvement-summary.ejs
│       ├── compare-slot.ejs
│       └── code-block.ejs
├── public/
│   ├── css/
│   │   ├── tokens.css             (paleta, fuentes, espaciados)
│   │   ├── base.css               (reset, tipografía, layout)
│   │   ├── components.css         (rpg-box, badge, botón, media-slot, code-block)
│   │   └── pages.css              (hero, comparativa, índice de anclas)
│   ├── js/                        (generado, ignorado por git)
│   └── media/
│       └── .gitkeep
└── tests/
    ├── health.test.ts
    ├── pages.test.ts
    └── not-found.test.ts
```

## 3. Rutas HTTP

| Método y ruta | Respuesta |
| --- | --- |
| `GET /` | `200`, `text/html`. Renderiza `views/pages/landing.ejs` con `improvements`. |
| `GET /implementacion` | `200`, `text/html`. Renderiza `views/pages/implementacion.ejs` con `improvements`. |
| `GET /health` | `200`, `application/json`, cuerpo exacto `{"status":"ok"}`. |
| `GET /css/*`, `/js/*`, `/media/*` | Estáticos servidos desde `public/` con `express.static`. |
| Cualquier otra ruta o método | `404`, `text/html`, renderiza `views/pages/not-found.ejs` con enlace a `/`. |
| Error no controlado | `500`, `text/html`, renderiza `views/pages/error.ejs`. No muestra el stack en `NODE_ENV=production`. |

- Orden de registro en `createApp()`: `x-powered-by` desactivado → estáticos → `/health` → páginas → `not-found` → `error-handler`.
- `ROOT = path.resolve(__dirname, '..')`; `views` = `ROOT/views`; `public` = `ROOT/public`. Funciona igual desde `src/` (tsx) y `dist/` (tsc).

## 4. Estructura de Vistas y Responsive

**Partials comunes**
- `head.ejs`: `<meta charset>`, viewport, `<title>` recibido por variable `title`, enlace a Google Fonts y a los 4 CSS en este orden: `tokens`, `base`, `components`, `pages`.
- `header.ejs`: barra con título pixelado y enlaces `/` y `/implementacion`.
- `footer.ejs`: texto "Basado en pret/pokered" con enlace a `https://github.com/pret/pokered`. Carga `/js/copy-code.js` con `defer` solo si la variable `withCopyScript` es `true`.

**Vista 1: Landing (`/`)** — scroll vertical, secciones en este orden:
1. **Hero:** `<h1>` con el nombre "PokeRed QoL", propuesta de valor ("Juega Pokémon Rojo sin fricción, manteniendo la compatibilidad de tus `.sav`"), caja RPG con las 6 mejoras como lista (partial `improvement-summary.ejs`, un `<li>` por mejora con badge y frase corta).
2. **Comparativa:** una fila por mejora con el partial `compare-slot.ejs`: dos columnas "ORIGINAL" y "QoL", cada una con una caja `.media-slot` (480×432) con texto placeholder "VIDEO/GIF PENDIENTE" y un comentario HTML `<!-- Reemplazar por <video> o <img> -->`.
3. **CTA:** enlace en forma de botón hacia `/implementacion`, color de acento `#9a2257`.

**Vista 2: Detalle técnico (`/implementacion`)** — una sola vista:
1. Índice de anclas (`<nav>`) con 6 enlaces a `#combates`, `#movimiento`, `#texto-fast`, `#alarma-hp`, `#evoluciones`, `#safari-zone`.
2. Seis `<section id="...">`, una por mejora: título, explicación a nivel ensamblador (RGBDS / LR35902) basada solo en `README.md`, y un `code-block.ejs` con `<pre><code id="code-<id>">` que contiene solo comentarios `; PEGAR DIFF .asm REAL AQUÍ` y un botón `<button class="copy-btn" data-copy-target="code-<id>">Copiar código</button>`.
3. Nota fija: "Compatibilidad `.sav` original: no se modifican estructuras de datos persistentes".

**Responsive**
- Desktop (≥768px): contenedor `max-width: 960px` centrado; comparativa en 2 columnas (`grid-template-columns: 1fr 1fr`); índice de anclas en una fila con `flex-wrap`.
- Móvil (<768px): una columna; comparativa apilada (ORIGINAL arriba, QoL debajo); índice de anclas con `overflow-x: auto`; `.media-slot` con `width: 100%`; bloques de código con `overflow-x: auto`.
- Estilo DMG-01: bordes de 4px sólidos `#0f380f`, sin `border-radius`, sombra dura `4px 4px 0 #0f380f`, `image-rendering: pixelated`. Fondo `#9bbc0f`, cajas `#8bac0f`, texto `#0f380f`, detalles `#306230`.

## 5. Estrategia de Pruebas

- **Herramienta:** `node:test` + `supertest`. Cada test importa `createApp` de `src/app.ts`; no abre puertos.
- **`tests/health.test.ts`:** `GET /health` → status `200`, `content-type` contiene `application/json`, cuerpo `{status: "ok"}`.
- **`tests/pages.test.ts`:**
  - `GET /` → `200`, `text/html`, contiene `<h1>`, la cadena `.sav`, un enlace `href="/implementacion"`, y exactamente 6 elementos con clase `compare-row`.
  - `GET /implementacion` → `200`, `text/html`, contiene los 6 ids de ancla (`id="combates"` ... `id="safari-zone"`), 6 elementos `copy-btn` y 6 `<pre>`.
- **`tests/not-found.test.ts`:** `GET /no-existe` → `404`, `text/html`, contiene un enlace a `/`.
- **Tipos:** `npm run typecheck` ejecuta `tsc --noEmit` con ambos tsconfig.
- **Manual (una vez, al final):** abrir `/` y `/implementacion` a 1280px y 375px de ancho y confirmar comparativa apilada y botón de copiar funcional.

## 6. Plan de Implementación por Fases

### Fase 0: Configuración base del proyecto
- [x] **Paso 0.1:** Crear `package.json` con `name: "pokered-qol-web"`, `engines.node: ">=22"`, y scripts: `dev` = `npm run build:client && tsx watch src/server.ts`, `build:server` = `tsc -p tsconfig.json`, `build:client` = `tsc -p tsconfig.client.json`, `build` = `npm run build:server && npm run build:client`, `typecheck` = `tsc -p tsconfig.json --noEmit && tsc -p tsconfig.client.json --noEmit`, `test` = `node --import tsx --test "tests/**/*.test.ts"`, `start` = `node dist/server.js`.
- [x] **Paso 0.2:** Ejecutar `npm install express ejs dotenv` y `npm install -D typescript tsx @types/node @types/express supertest @types/supertest`.
- [x] **Paso 0.3:** Crear `tsconfig.json` (`target: ES2022`, `module: commonjs`, `moduleResolution: node10`, `strict: true`, `rootDir: src`, `outDir: dist`, `include: ["src/**/*.ts"]`, `exclude: ["src/client"]`, `esModuleInterop: true`).
- [x] **Paso 0.4:** Crear `tsconfig.client.json` (`target: ES2022`, `module: ES2022`, `lib: ["ES2022","DOM"]`, `strict: true`, `rootDir: src/client`, `outDir: public/js`, `include: ["src/client/**/*.ts"]`).
- [x] **Paso 0.5:** Crear `.gitignore` (`node_modules/`, `dist/`, `.env`, `public/js/`) y `.env.example` con `PORT=3000` y `NODE_ENV=development`.
- [x] **Paso 0.6:** Crear `src/config.ts` que haga `import 'dotenv/config'` y exporte `config = { port: Number(process.env.PORT) || 3000, nodeEnv: process.env.NODE_ENV ?? 'development' }`.
- [x] **Paso 0.7:** Crear `src/routes/health.ts` (router con `GET /health` → `res.json({ status: 'ok' })`) y `src/app.ts` con `createApp()` que desactiva `x-powered-by`, monta el router de salud y devuelve la app.
- [x] **Paso 0.8:** Crear `src/server.ts` que llame `createApp().listen(config.port)` y registre una sola línea de log con el puerto. Crear `tests/health.test.ts` según la sección 5. Crear `src/client/copy-code.ts` vacío con `export {};` para que el tsconfig cliente compile.
- **Criterio de Terminado (DoD):** `npm run typecheck` sin errores; `npm test` pasa 1 test; `npm run dev` arranca y `curl localhost:3000/health` devuelve `{"status":"ok"}` con status 200.

### Fase 1: Motor de vistas, estáticos y manejo de errores
- [x] **Paso 1.1:** En `src/app.ts`, configurar `app.set('view engine','ejs')`, `app.set('views', ROOT/views)` y `express.static(ROOT/public)` antes del router de salud.
- [x] **Paso 1.2:** Crear `src/middleware/not-found.ts` (responde `404` con `res.status(404).render('pages/not-found', { title: 'No encontrado', withCopyScript: false })`) y `src/middleware/error-handler.ts` (firma de 4 argumentos, `500`, renderiza `pages/error`, sin stack si `nodeEnv === 'production'`).
- [x] **Paso 1.3:** Crear partials `views/partials/head.ejs`, `header.ejs`, `footer.ejs` según la sección 4 (CSS enlazados aunque los archivos aún estén vacíos).
- [x] **Paso 1.4:** Crear `views/pages/not-found.ejs` y `views/pages/error.ejs` que incluyan los 3 partials y un enlace a `/`.
- [x] **Paso 1.5:** Registrar `not-found` y `error-handler` al final de `createApp()`. Crear `tests/not-found.test.ts`.
- **Criterio de Terminado (DoD):** `npm test` pasa health y not-found; `GET /no-existe` devuelve `404` HTML con enlace a `/`.

### Fase 2: Datos de las 6 mejoras
- [x] **Paso 2.1:** Crear `src/data/improvements.ts` con `export interface Improvement { id: string; title: string; summary: string; detail: string; }`.
- [x] **Paso 2.2:** Exportar `improvements: readonly Improvement[]` con exactamente 6 entradas, en este orden e ids: `combates`, `movimiento`, `texto-fast`, `alarma-hp`, `evoluciones`, `safari-zone`. `summary` ≤ 100 caracteres y `detail` de 2 a 4 frases, ambos derivados solo de `README.md` (por ejemplo: evoluciones Kadabra, Graveler, Machoke y Haunter a nivel 36; Safari Zone Center con Sandshrew, Vulpix, Meowth, Bellsprout, Magmar y Pinsir).
- **Criterio de Terminado (DoD):** `npm run typecheck` sin errores; `improvements.length === 6`; ids únicos y coincidentes con los anclajes de la sección 1.

### Fase 3: Estilos DMG-01
- [x] **Paso 3.1:** Crear `public/css/tokens.css` con variables `--dmg-0: #9bbc0f; --dmg-1: #8bac0f; --dmg-2: #306230; --dmg-3: #0f380f; --cta: #9a2257;`, familias de fuente (`--font-pixel`, `--font-body`, `--font-code`) y espaciados `--space-1..4` (4, 8, 16, 32px).
- [x] **Paso 3.2:** Crear `public/css/base.css`: reset mínimo, `body` con fondo `--dmg-0`, color `--dmg-3`, `font-family: var(--font-body)`, contenedor `.container` (`max-width: 960px`, centrado, padding `--space-3`), `h1/h2/h3` con `--font-pixel` y tamaños legibles (h1 `1.25rem`, h2 `1rem`, h3 `0.875rem`).
- [x] **Paso 3.3:** Crear `public/css/components.css` con `.rpg-box`, `.badge`, `.btn-cta` (fondo `--cta`, texto `--dmg-0`), `.media-slot` (`width: 480px; max-width: 100%; aspect-ratio: 10/9; display: grid; place-items: center; border: 4px dashed var(--dmg-3)`), `.code-block` (fondo `--dmg-3`, texto `--dmg-0`, `font-family: var(--font-code)`, `overflow-x: auto`) y `.copy-btn`.
- [x] **Paso 3.4:** Crear `public/css/pages.css` con `.hero`, `.compare-row` (grid 2 columnas ≥768px, 1 columna debajo), `.anchor-nav` (flex, `overflow-x: auto` en móvil) y el `@media (min-width: 768px)` necesario.
- **Criterio de Terminado (DoD):** los 4 archivos existen, no contienen colores hex fuera de `tokens.css`, y `GET /css/tokens.css` devuelve `200` con `text/css`.

### Fase 4: Vista Landing (`/`)
- [ ] **Paso 4.1:** Crear `views/partials/improvement-summary.ejs` (renderiza un `<li>` con badge numerado, `title` y `summary` de una mejora recibida como variable `item`).
- [ ] **Paso 4.2:** Crear `views/partials/compare-slot.ejs` (renderiza un `<article class="compare-row">` con `<h3>` del título y dos `<figure class="media-slot">` etiquetados "ORIGINAL" y "QoL", más el comentario de reemplazo).
- [ ] **Paso 4.3:** Crear `views/pages/landing.ejs` con Hero, Comparativa (bucle sobre `improvements`) y CTA a `/implementacion`, incluyendo `head`, `header` y `footer`.
- [ ] **Paso 4.4:** Crear `src/routes/pages.ts` con `GET /` que renderiza `pages/landing` con `{ title: 'PokeRed QoL', improvements, withCopyScript: false }`; montar el router en `createApp()`.
- **Criterio de Terminado (DoD):** `GET /` devuelve `200` HTML con `<h1>`, la cadena `.sav`, 6 `compare-row` y enlace a `/implementacion`.

### Fase 5: Vista Detalle Técnico (`/implementacion`) y botón de copiar
- [ ] **Paso 5.1:** Crear `views/partials/code-block.ejs` que reciba `item` y renderice `<pre class="code-block"><code id="code-<id>">; PEGAR DIFF .asm REAL AQUÍ</code></pre>` y el botón `.copy-btn` con `data-copy-target="code-<id>"`.
- [ ] **Paso 5.2:** Crear `views/pages/implementacion.ejs` con índice de anclas (`.anchor-nav`), 6 `<section id="<id>">` (título, `detail`, `code-block`) y la nota de compatibilidad `.sav`.
- [ ] **Paso 5.3:** En `src/routes/pages.ts`, añadir `GET /implementacion` que renderiza `pages/implementacion` con `{ title: 'Implementación', improvements, withCopyScript: true }`.
- [ ] **Paso 5.4:** Implementar `src/client/copy-code.ts`: al cargar, para cada `.copy-btn` añadir listener `click` que lea `document.getElementById(btn.dataset.copyTarget)?.textContent`, llame a `navigator.clipboard.writeText`, cambie el texto del botón a "¡Copiado!" durante 1500 ms y lo restaure; si la API falla, mostrar "Error" 1500 ms.
- [ ] **Paso 5.5:** Ejecutar `npm run build:client` y comprobar que existe `public/js/copy-code.js`.
- **Criterio de Terminado (DoD):** `GET /implementacion` devuelve `200` con los 6 ids de ancla, 6 `copy-btn` y 6 `<pre>`; `GET /js/copy-code.js` devuelve `200`; en el navegador, el botón copia el contenido del bloque.

### Fase 6: Pruebas completas y verificación responsive
- [ ] **Paso 6.1:** Crear `tests/pages.test.ts` con los casos de `/` y `/implementacion` definidos en la sección 5.
- [ ] **Paso 6.2:** Ejecutar `npm run typecheck && npm test` y corregir cualquier fallo sin añadir dependencias.
- [ ] **Paso 6.3:** Verificación manual a 1280px y 375px de ancho: comparativa apilada en móvil, sin scroll horizontal de página, índice de anclas desplazable, bloques de código con scroll interno.
- **Criterio de Terminado (DoD):** `npm run typecheck` y `npm test` en verde (≥5 tests); la lista de verificación manual completada sin incidencias.

### Fase 7: Despliegue en Render
- [ ] **Paso 7.1:** Crear `render.yaml` con un servicio `type: web`, `runtime: node`, `buildCommand: npm install && npm run build`, `startCommand: npm start`, `healthCheckPath: /health` y `envVars` con `NODE_ENV=production`.
- [ ] **Paso 7.2:** Ejecutar `npm run build` y luego `NODE_ENV=production npm start`; comprobar `/`, `/implementacion` y `/health` en `localhost:3000`.
- **Criterio de Terminado (DoD):** el build de producción arranca sin `tsx`, las 3 rutas responden `200` y `render.yaml` es válido (campos listados arriba presentes).

## 7. Exclusiones (Out of Scope) y Riesgos

**Fuera del MVP**
- Descarga de parches `.ips`/`.bps` o ROMs (copyright).
- CMS, panel de administración, base de datos, cuentas de usuario.
- Temas visuales adicionales o modo oscuro.
- Las mejoras 7 a 13 de la tabla de `README.md` (guardado, ticks de daño, barra de HP, Game Corner, Ultra Ball, Cerulean Cave): no aparecen en la web.
- Internacionalización (solo español).
- Analítica, cookies, formularios de contacto.
- Reproductor de video propio: se usarán `<video>`/`<img>` nativos cuando se reemplacen los placeholders.

**Riesgos técnicos**
- **Cold starts en Render (plan gratuito):** el servicio se duerme tras inactividad y la primera petición puede tardar decenas de segundos. Mitigación: `/health` ligero y respuesta sin dependencias externas en arranque.
- **Peso de videos/GIFs:** 12 medios (6 mejoras × 2) pueden penalizar la carga. Mitigación: preferir `<video muted loop playsinline preload="none">` en MP4/WebM, GIFs solo si pesan <2 MB, y `loading="lazy"` en imágenes.
- **Fuentes externas (Google Fonts):** si fallan, se usa el fallback `monospace`; el diseño no debe romperse.
- **Contenido ASM inventado por el agente ejecutor:** mitigado con la regla de solo placeholders y textos derivados de `README.md`.
- **Divergencia entre `public/js/` y `src/client/`:** `public/js/` se genera con `npm run build:client` y nunca se edita a mano.
