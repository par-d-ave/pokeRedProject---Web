# AGENTS.md
Web (TypeScript + Express + EJS) que presenta el hackrom "PokeRed QoL" de Pokémon Rojo: landing `/` y detalle técnico `/implementacion`.

## Comandos
- `npm install` · `npm run dev` (compila cliente + tsx watch) · `npm run build` (dist/ + public/js/)
- `npm run typecheck` · `npm test` (node:test + supertest) · `npm start` (node dist/server.js)

## Flujo
1. Lee `PLAN.md`. Ejecuta UN paso por vez, en orden.
2. Antes de marcar `- [x]`, cumple el DoD de la fase (`npm run typecheck` y `npm test` en verde).
3. Si algo no está definido, elige la opción más simple. No preguntes.

## Estructura
- `src/` servidor (`app.ts`, `server.ts`, `config.ts`, `routes/`, `middleware/`, `data/`)
- `src/client/` TS del navegador → compila a `public/js/` (no editar `public/js/`)
- `views/pages/` y `views/partials/` plantillas EJS
- `public/css/` (`tokens`, `base`, `components`, `pages`), `public/media/`
- `tests/*.test.ts`

## Convenciones
- TypeScript `strict`, sin `any`. Archivos kebab-case, funciones camelCase, constantes UPPER_SNAKE.
- Un archivo = una responsabilidad. Identificadores en inglés, textos visibles en español.
- Colores solo vía variables CSS de `tokens.css` (`#9bbc0f #8bac0f #306230 #0f380f`, CTA `#9a2257`).
- El contenido de las 6 mejoras vive solo en `src/data/improvements.ts`.

## Reglas estrictas
- Alcance cerrado a 6 mejoras de `README.md`: combates ×4, movimiento ×2, texto FAST, silenciar alarma HP bajo, evoluciones por intercambio → nivel 36, exclusivos de Blue en Safari Zone.
- Videos/GIFs y diffs ASM: solo placeholders estructurados (`.media-slot`, `<pre><code>` con comentario `PEGAR DIFF`). No inventes etiquetas, direcciones ni código ASM.
- Prohibido: frameworks frontend (React, Vue, Tailwind, Bootstrap), bases de datos, ORMs, bundlers.
- Prohibido ofrecer descargas de ROMs o parches `.ips`/`.bps`.
- No añadas dependencias fuera de las listadas en `PLAN.md`. No uses `console.log` salvo el log de arranque.
