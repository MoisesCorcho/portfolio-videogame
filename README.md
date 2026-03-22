# Documentación Técnica del Proyecto Portfolio Game

Este documento proporciona una visión detallada de la arquitectura, estructura de archivos y lógica principal del proyecto: un videojuego de portfolio interactivo construido con Phaser 3, Svelte 5 y Vite.

---

## 🧱 Stack Tecnológico y Decisiones de Diseño

### ¿Por qué este stack?

El proyecto resuelve un problema concreto: **presentar un portfolio de desarrollo de software en forma de videojuego 2D**. Eso exige dos capas bien separadas:

1. **Un motor de juego** para el mundo interactivo (física, colisiones, animaciones, audio).
2. **Un framework de UI moderno** para mostrar contenido de portfolio (modales, formularios, datos estructurados).

Mezclar ambas responsabilidades en una sola tecnología habría resultado en código acoplado y difícil de mantener. La solución es usar cada herramienta para lo que fue diseñada:

| Tecnología | Versión | Rol |
|:-----------|:--------|:----|
| **Phaser 3** | `^3.90.0` | Motor de juego: renderizado WebGL/Canvas, física Arcade, input, animaciones, audio, escenas |
| **Svelte 5** | `^5.48.5` | UI reactiva: modales de portfolio, HUD, diálogos de NPCs |
| **Vite** | `^7.2.4` | Build tool y dev server con HMR; integra ambos mundos bajo el mismo proceso |
| **TailwindCSS** | `^4.1.18` | Estilos utilitarios para los componentes Svelte |
| **TypeScript** | `~5.9.3` | Type-checking (la configuración del proyecto es TS, el código del juego es JS) |
| **phaser-animated-tiles** | `^2.0.2` | Plugin que habilita animaciones definidas en tilesets de Tiled dentro de Phaser |
| **Prettier** | `^3.8.1` | Formateo de código unificado |

### ¿Cómo se integran Svelte y Phaser?

Son dos sistemas completamente independientes que corren en paralelo sobre el mismo `index.html`:

```
index.html
├── <canvas>          ← Phaser renderiza aquí (WebGL/Canvas)
└── <div id="ui-layer">  ← Svelte monta aquí (DOM normal)
```

`src/main.js` inicializa primero `Phaser.Game` y luego monta la app Svelte sobre `#ui-layer`. El div tiene `pointer-events: none` por defecto para no bloquear los clicks del juego, y los modales lo reactivan cuando están abiertos.

**El puente de comunicación** entre ambos mundos es un **Svelte store** (`src/ui/stores/uiStore.js`):

- Cuando el jugador interactúa con un objeto en Phaser (tecla E), `PlayScene` llama a `openModal(view, data)`.
- El store actualiza su estado reactivo.
- El componente `App.svelte` detecta el cambio y renderiza el modal correspondiente.
- Al cerrar el modal, `closeModal()` resetea el store y Phaser reanuda la escena.

Para los eventos en tiempo real (como la barra de vida), se usa el sistema de eventos nativo de Phaser: `this.scene.events.emit('player-health-changed', health, maxHealth)`, que `UIScene` escucha directamente.

---

## 📁 Estructura del Proyecto

```
src/
├── config/         Configuración global (dimensiones, física, zoom)
├── data/           AssetManifest, Animations, Dialogues, ResumeData
├── entities/       Entidades del juego (NPCs, enemigos, dummy)
│   └── enemies/    Clases de enemigos y sus estados FSM
├── player/         Jugador y su máquina de estados
│   └── states/     Un archivo por estado del jugador
├── scenes/         Escenas de Phaser
├── ui/             Componentes Svelte y stores
│   ├── components/ Modales, diálogos, HUD
│   └── stores/     Estado compartido Svelte ↔ Phaser
├── utils/          Constants.js, AudioManager.js
└── main.js         Punto de entrada
```

---

## ⚙️ Configuración e Inicialización

### `src/main.js`

Punto de entrada. Inicializa `Phaser.Game` con el orden de escenas `[Preloader, PlayScene, Level2Scene, UIScene]` y monta la app Svelte sobre `#ui-layer`. En HMR destruye la instancia previa del juego para evitar leaks de contexto WebGL.

### `src/config/GameConfig.js`

Define las constantes globales de configuración:

- Resolución de renderizado: **1024×576** (ratio 16:9).
- Zoom: **3x** (pixel-perfect scaling).
- Gravedad Arcade: **1000**.
- Dimensiones del mundo: `worldWidth: 3200`, `worldHeight: 600`.
- `debug: import.meta.env.DEV` — activa el overlay de física en desarrollo automáticamente.

### `src/utils/Constants.js`

Centraliza todos los _magic strings_: claves de assets (`ASSETS`), nombres de escenas (`SCENES`), capas de mapas (`MAP_LAYERS`), tipos de entidades (`ENTITY_TYPES`), tipos de interacción (`INTERACTION_TYPES`) y eventos de audio (`AUDIO`). Ninguna cadena de texto hardcodeada existe en el código del juego.

---

## 📦 Sistema de Gestión de Assets

### `src/data/AssetManifest.js`

Núcleo de la gestión de assets. Combina carga dinámica con definiciones manuales:

1. **Carga Dinámica**: `import.meta.glob` de Vite descubre automáticamente todos los `.png` en `public/assets/decorations/`.
2. **Normalización de Claves**:
   - Clave Phaser: `GH_Decoration_bookshelf` (para el código del juego).
   - Clave Tiled: `../decorations/...` (para que el mapa encuentre los assets automáticamente).
3. **Assets Estáticos**: Spritesheets (`PLAYER`, `PLAYER_2`, enemigos), tilemaps, audio y fondos parallax se registran manualmente.

### `src/data/Animations.js`

Registro central de animaciones:

- **`PLAYER_ANIMS`**: Rangos de frames (start/end), frameRate y repetición del jugador.
- **`SPRITE_CONFIG`**: Dimensiones de frame para cada spritesheet.
- **`MASTER_ANIMATIONS_REGISTRY`**: Asocia assets con sus configuraciones para creación automática en escena.

---

## 🎮 Escenas

### Flujo de Escenas

```
Preloader → PlayScene (Level 1)
                 ↓ (teleport)
           Level2Scene (Level 2)  ←→  UIScene (HUD paralelo)
```

### `src/scenes/Preloader.js`

Carga todos los assets y construye una pantalla de carga pixel art profesional antes de iniciar el juego.

**Pantalla de carga:**
- Fondo oscuro (`0x0d0d1e`) con 60 estrellas aleatorias de distintos tamaños y opacidades.
- Overlay de scanlines (1px cada 4px, 8% opacidad) para efecto CRT retro.
- Espada pixel art central construida con `Graphics` API (punta, hoja, guardamano, empuñadura, pomo).
- Spinner de 8 cuadrados orbitales dorados con degradado de opacidad.
- Título "THE DEVELOPER'S JOURNEY" con tween de pulso.
- Barra de progreso (404×28) con fill verde y shimmer animado.
- Texto de porcentaje y nombre del asset actual (truncado a 24 caracteres).
- Decoraciones de esquina doradas.

Al completar la carga crea las animaciones del jugador vía `createAnimations()` y transiciona a `PlayScene`.

### `src/scenes/PlayScene.js`

Escena principal de exploración (Nivel 1).

**`create()` — orden de inicialización:**
1. Fondo parallax (6 capas, scroll ratio diferente por bioma).
2. Carga del mapa Tiled `level1.json`.
3. Spawn del jugador en el objeto `START`.
4. Instancia de `AudioManager`.
5. NPCs, dummies e interactables desde la capa `Objects`.
6. Colisiones manuales y plataformas one-way.
7. Cámara con `startFollow` al jugador (zoom 3x).
8. Suscripción a eventos del store de UI para sonidos de ventanas.

**`update()`**: Llama a `audioManager.updateSpatialSounds(player)`, detecta biomas y gestiona la mecánica de bajada de plataformas.

**`shutdown`**: Llama a `audioManager.stopAllSpatialSounds()` para que los sonidos ambientes del Nivel 1 no persistan al pasar al Nivel 2.

### `src/scenes/Level2Scene.js`

Escena de combate (Nivel 2). Arquitectura paralela a `PlayScene` pero especializada en enemigos.

**Diferencias clave respecto a PlayScene:**
- Spawna `Slime` y `DemonSlime` desde la capa `Objects` de Tiled.
- El grupo `enemies` tiene `runChildUpdate: true` para que cada enemigo llame a su propio `update`.
- El overlap entre `attackZone` y `enemies` resuelve el daño con knockback.
- Al morir el jugador emite `'player-dead'` → delay 1.2s → `openModal(GAME_OVER)`.
- **Lifecycle de UIScene:** lanza `UIScene` en `create()` con `{ parentScene: SCENES.LEVEL2 }` y la detiene en `shutdown`.

**Corrección de posición para objetos Tiled:** Los objetos tipo tile tienen su origen en la esquina inferior-izquierda. El spawn corrige: `(obj.x + w/2, obj.y - h/2)`.

### `src/scenes/UIScene.js`

Escena Phaser que corre en paralelo al juego principal, exclusivamente para el HUD.

**Barra de vida:**
- Orb rojo fill (56×54 px, escala 1.5x) recortado por una máscara rectangular.
- El ancho de la máscara representa el ratio HP/maxHP.
- Tween de 350ms (Sine.easeOut) anima el cambio de forma suave.
- Frame decorativo encima para ocultar el overflow.
- Todos los elementos tienen `scrollFactor: 0` (fijos a la cámara).

**Comunicación con la escena padre:**
1. `init(data)` captura la clave de la escena padre (`parentScene`).
2. Se suscribe al evento `'player-health-changed'` de esa escena.
3. El jugador emite ese evento en `takeDamage()`: `scene.events.emit('player-health-changed', health, maxHealth)`.
4. En restart, UIScene rewirifica los listeners para evitar duplicados.

---

## 🏃‍♂️ Sistema del Jugador

### `src/player/Player.js`

Extiende `Phaser.Physics.Arcade.Sprite`. Configura física (cuerpo 20×30 px), inputs y la `StateMachine`.

**Stats:** `maxHealth: 5`, `health: 5`, flag `isInvulnerable`.

**Inputs:**
| Tecla | Acción |
|:------|:-------|
| ←→ / A D | Movimiento |
| Space | Salto |
| J | Ataque (combo 2 hits) |
| K | Ataque crítico |
| L | Guardia |
| S / ↓ | Slide / bajar plataforma |
| E | Interactuar |

**`takeDamage(amount)`:**
- **Invulnerable** (slide activo): ignora completamente.
- **Guard**: daño a la mitad (`Math.floor`), knockback en dirección contraria al facing, flash naranja 120ms, estado sin cambio.
- **Normal**: daño completo, emite `'player-health-changed'`, transiciona a `hurt` o `dead`.

### `src/player/StateMachine.js`

FSM genérica. `transition(newState)` llama `exit()` del estado actual y `enter()` del nuevo. `step()` llama `update()` del estado activo cada frame.

### `src/player/states/` — Estados

| Estado | Descripción |
|:-------|:------------|
| `IdleState` | Estado por defecto. Espera input. |
| `RunState` | Movimiento horizontal. Pasos dinámicos según material del suelo. |
| `JumpState` | Aplica velocidad vertical. Reproduce `sfx_jump`. |
| `FallState` | Caída libre. Transiciona a Landing al tocar el suelo. |
| `LandingState` | Recuperación post-caída. Bloquea input brevemente. |
| `AttackState` | Combo de 2 hits (J). Hitbox 25×25 px reposicionado por facing. Trackea `hitEnemies` Set para evitar hits dobles en el mismo swing. |
| `CriticalAttackState` | Hit único (K). Knockback 150 px vs 80 px normal. |
| `GuardState` | Bloqueo (L sostenido). Reduce daño a la mitad. Flash naranja al recibir hit. |
| `SlideState` | Deslizamiento (S). Activa `isInvulnerable` en `enter()` y lo limpia en `exit()`. |
| `HurtState` | Daño recibido. Flash rojo, stun 250ms, knockback. |
| `DeadState` | Muerte. Animación de muerte, fade-out, dispara modal de Game Over. |

---

## 👾 Sistema de Entidades

### `src/entities/enemies/Enemy.js` — Clase Base

Extiende `Phaser.Physics.Arcade.Sprite`. Todas las clases de enemigos heredan de aquí.

**`EnemyConfig` (parámetro del constructor):**
```javascript
{
  maxHealth, speed, damage,
  visionRange,    // Distancia a la que detecta al jugador
  attackRange,    // Distancia para iniciar el ataque
  attackCooldown, // ms entre ataques
  animKeys: { idle, move, attack, hurt, death },
  attackHitbox?: { width, height, offsetX, offsetY, hitFrame },
  attackSfx?, hurtSfx?, deathSfx?
}
```

**Propiedades clave:**
- `facesLeftByDefault` — Controla la lógica de `flipX` en `facePlayer()` para spritesheets que naturalmente miran a la izquierda.
- `lastKnockbackForce` / `lastAttackerX` — Almacenados en `takeDamage()` para que `EnemyHurtState` los consuma.

**`takeDamage(amount, knockbackForce, sourceX)`:** Ignora si ya está en `hurt` o `dead`. Almacena datos de knockback y transiciona a `hurt`.

### `src/entities/enemies/Slime.js`

Enemigo básico con tres variantes de dificultad progresiva:

| Variante | HP | Velocidad | Daño | Visión | Cooldown |
|:---------|:---|:----------|:-----|:-------|:---------|
| Green | 2 | 35 | 1 | 150 px | 1200 ms |
| Blue | 3 | 50 | 2 | 200 px | 900 ms |
| Red | 5 | 65 | 3 | 250 px | 700 ms |

No tiene animación de ataque dedicada. Usa daño por contacto en `EnemyAttackState`. Si se spawnea desde Tiled con dimensiones mayores a 32×32, se escala proporcionalmente.

### `src/entities/enemies/DemonSlime.js`

Boss del Nivel 2.

- **Spritesheet:** 288×160 px por frame, 5 filas (idle, walk, attack, hurt, death).
- **Stats:** 15 HP, velocidad 45, daño 3, visión 350 px, rango de ataque 140 px, cooldown 1500 ms.
- **Hitbox de ataque:** 120×140 px, offset 100 px desde el centro (ajustado por facing), daño se ejecuta exactamente en el frame 10 de la animación.
- **`facesLeftByDefault = true`** — El spritesheet naturalmente mira a la izquierda.
- **Audio propio:** `demon_slime_attack.mp3`, `demon_slime_hurt.mp3`, `demon_slime_death.mp3` en `public/assets/audio/enemies/bosses/`.

### `src/entities/Dummy.js`

Maniquí de entrenamiento en PlayScene.

- Físicas inmóviles. Reproduce animación `HURT` al recibir daño y regresa a `IDLE` al completarla.
- Flag `isHurt` previene interrupciones de animación en hits múltiples rápidos.
- No aplica daño. Útil para probar combos del jugador.

### `src/entities/NPC.js`

NPC con patrulla opcional y sistema de diálogos. Configurado 100% desde Tiled vía propiedades personalizadas. Ver sección **Sistema de NPCs** para detalles.

### Estados FSM de Enemigos (`src/entities/enemies/states/`)

Todos los enemigos comparten estos estados genéricos:

| Estado | Comportamiento |
|:-------|:--------------|
| `EnemyIdleState` | Quieto, mirando al jugador. Transiciona a `chase` cuando el jugador entra en `visionRange`. |
| `EnemyChaseState` | Se mueve hacia el jugador. A `attack` si está en `attackRange`; vuelve a `idle` si el jugador sale de `visionRange`. |
| `EnemyAttackState` | Reproduce anim de ataque y dispara `attackSfx`. Escucha `animationupdate` para ejecutar la hitbox exactamente en `hitFrame`. Fallback para slimes: daño por contacto con timer de 200ms. |
| `EnemyHurtState` | Flash rojo, knockback (dirección relativa a `lastAttackerX`), pop vertical (-100 vy), stun 250ms → `dead` o `chase`. |
| `EnemyDeadState` | Reproduce `deathSfx` y animación de muerte, tween de fade-out, destruye el sprite. |

**Daño frame-accurate:** `EnemyAttackState` registra un listener de `animationupdate`. Al alcanzar `hitFrame`, crea un `Phaser.Geom.Rectangle` y verifica si el cuerpo del jugador intersecta. Solo ejecuta el daño una vez por swing. El listener se limpia en `exit()` para evitar memory leaks.

---

## 🖥️ Capa de UI (Svelte 5)

### Arquitectura de Comunicación

```
Phaser (PlayScene/Level2Scene)
        │
        ├── openModal(view, data)  ──→  uiStore  ──→  App.svelte
        │                                               │
        │                                    ┌──────────┤
        │                                    │  Modal   │
        │                                    │ Dialogue │
        │                                    │  Sign    │
        │                                    │ GameOver │
        │                                    └──────────┘
        │
        └── scene.events.emit('player-health-changed')
                    │
                UIScene (Phaser, paralela)
                    │
              HUD (health bar)
```

### `src/ui/stores/uiStore.js`

```javascript
const uiStore = writable({ isOpen: false, view: null, data: null })
export const openModal = (view, data) => { ... }
export const closeModal = () => { ... }
```

El store es el único punto de acoplamiento entre Phaser y Svelte. Phaser no importa nada de Svelte; solo llama funciones del store.

### `src/ui/App.svelte`

Componente raíz. Renderiza condicionalmente según `uiStore.view`:

| Vista | Componente |
|:------|:-----------|
| `GAME_OVER` | `GameOver.svelte` |
| `NPC` | `Dialogue.svelte` |
| `SIGN` | `Sign.svelte` |
| `PROFILE`, `EXPERIENCE`, `SKILLS`, `EDUCATION`, `CERTS` | Contenido en `Modal.svelte` |

### `src/ui/components/GameOver.svelte`

Pantalla de muerte:
- Overlay oscuro (75% opacidad).
- Título "YOU DIED" en rojo (Press Start 2P), animación flickering.
- Emoji calavera con pulso y filtro grayscale.
- Botón "PLAY AGAIN" → `window.location.reload()`.

Disparado por `Level2Scene` cuando el jugador muere: delay 1.2s → `openModal(GAME_OVER)`.

### Componentes de portfolio (`src/ui/components/header/`)

- `Profile.svelte` — Datos personales y resumen profesional.
- `Experience.svelte` / `SingleExperience.svelte` — Historial laboral.
- `Skills.svelte` — Habilidades técnicas.
- `Education.svelte` — Formación académica.

Todos usan datos de `src/data/ResumeData.js`.

---

## 🔊 Sistema de Audio Avanzado

### `src/utils/AudioManager.js`

Singleton que centraliza todo el control de audio del juego.

**API completa:**

```javascript
playMusic(key, fadeDuration = 1000, targetVolume = null)
// Cross-fade: fade-out de la pista actual, fade-in de la nueva.
// Si la clave es la misma, no hace nada.

setMusicVolume(volume)
// Clamp [0,1], aplica al track actual.

playSfx(key, config = {})
// Sonido one-shot al volumen sfxVolume (0.5).

addSpatialSound(id, key, sourceObj, radius, maxVolume)
// Registra un sonido ambiente looping en una posición del mapa.
// Evita duplicados por id.

updateSpatialSounds(player)
// Llamado cada frame. Calcula distancia jugador↔fuente.
// Falloff lineal: volume = maxVolume * (1 - dist / radius)
// Si dist >= radius → volume = 0.

stopAllSpatialSounds()
// Detiene y destruye todos los sonidos espaciales, limpia el Map.
// PlayScene lo llama en shutdown para evitar que persistan en Level2.
```

**Por qué singleton:** El `AudioManager` se instancia una vez en `PlayScene` y la misma instancia se reutiliza en `Level2Scene`. Esto permite que la música continúe entre escenas si es necesario, y que el estado de volumen sea consistente.

**Cleanup entre escenas:** Al hacer `scene.start('Level2Scene')`, `PlayScene` dispara su evento `shutdown`. En ese handler se llama `stopAllSpatialSounds()` para limpiar el Map antes de que Level2 arranque. Sin esto, los sonidos de la capa `Audio` del Nivel 1 persistirían indefinidamente.

### Integración por capas

- **Música:** PlayScene detecta en qué rectángulo de la capa `Biomes` está el jugador y llama `audioManager.playMusic()`.
- **Ambiente:** Objetos de la capa `Audio` (cascadas, fogatas, viento) se registran en `addSpatialSound()`. El volumen se recalcula cada frame en `update()`.
- **SFX del jugador:** Los estados del jugador disparan SFX directamente (`JumpState` → `sfx_jump`, `LandingState` → `sfx_land`, etc.).
- **SFX de enemigos:** Los estados FSM de los enemigos reproducen SFX según las propiedades de la clase (`attackSfx`, `hurtSfx`, `deathSfx`), con fallback a SFX genéricos de slime.

---

## 🏃‍♂️ Sistema del Jugador (sección anterior — actualizada arriba)

---

## 🗺️ Mapa y Niveles (Tiled)

Los mapas se crean en **Tiled Map Editor** y se exportan como JSON a `public/assets/maps/`.

### Capas que el motor interpreta

| Capa | Tipo | Propósito |
|:-----|:-----|:----------|
| `Ground` | Tile Layer | Plataforma principal, colisión con el jugador |
| `Collisions` | Object Layer | Rectángulos de colisión manual para geometría irregular |
| `Platforms` | Object Layer | Plataformas one-way (atravesables desde abajo) |
| `Objects` | Object Layer | Entidades, interactables, spawn points |
| `Biomes` | Object Layer | Zonas que triggean cambio de música y fondo |
| `Audio` | Object Layer | Fuentes de sonido espacial invisibles |
| `START` | Object Layer | Punto de spawn del jugador |

### Propiedades personalizadas soportadas

**En objetos de la capa `Objects`:**

| Propiedad | Tipo | Descripción |
|:----------|:-----|:------------|
| `entity` | string | `dummy`, `npc`, `slime`, `demon_slime` — spawna la entidad correspondiente |
| `variant` | string | Para slimes: `blue`, `green`, `red` |
| `interactionType` | string | `profile`, `experience`, `skills`, `education`, `sign`, `teleport` |
| `animation` / `anim` | string | Clave de animación Phaser a reproducir sobre el objeto |
| `dialogueId` | string | ID de diálogo definido en `Dialogues.js` (para NPCs) |
| `targetScene` | string | Escena destino para teleports |
| `text` | string | Texto a mostrar en letreros (`interactionType: sign`) |
| `canMove` | bool | NPC patrulla si es `true` |
| `moveRange` | float | Distancia de patrulla en px |
| `texture` | string | Clave del sprite para NPCs |
| `initialAnim` | string | Animación inicial del NPC |

**En objetos de la capa `Biomes`:**

| Propiedad | Valor | Efecto |
|:----------|:------|:-------|
| `biome` | `normal` / `autumn` / `winter` | Cambia música y capas de fondo parallax al entrar |

**En objetos de la capa `Audio`:**

| Propiedad | Tipo | Descripción |
|:----------|:-----|:------------|
| `sound` | string | Clave del audio (`WATERFALL`, `FIRE_CRACKLE`, etc.) |
| `radius` | float | Distancia máxima de escucha en px |
| `volume` | float | Volumen máximo (0.0 a 1.0) |

**En tiles individuales del tileset:**

| Propiedad | Tipo | Efecto |
|:----------|:-----|:-------|
| `material` | `stone` / (omitido) | Cambia el SFX de pasos: piedra o hierba (default) |

---

## 🪜 Plataformas Atravesables (One-Way Platforms)

Plataformas que permiten saltar a través desde abajo y pararse encima. Bajar con ↓ o S.

**Técnica:** Se configuran cuerpos físicos con `body.checkCollision.up = true` y el resto en `false`. Al presionar ↓, el colisionador se desactiva 250ms con `delayedCall` y luego se reactiva.

**Configuración en Tiled:** Capa de objetos `Platforms`, rectángulos invisibles sobre las plataformas.

---

## 🤖 Sistema de NPCs

Configurado 100% desde Tiled via propiedades personalizadas en la capa `Objects`.

### Propiedades en Tiled

| Propiedad | Tipo | Obligatoria | Descripción |
|:----------|:-----|:-----------|:------------|
| `entity` | string | ✅ | `npc` |
| `texture` | string | ✅ | Clave del sprite |
| `initialAnim` | string | ✅ | Animación inicial |
| `canMove` | bool | ❌ | Activa patrulla |
| `moveRange` | float | ❌ | Distancia de patrulla (default: 100) |
| `dialogueId` | string | ❌ | ID en `Dialogues.js` |

### Configurar Diálogos (`src/data/Dialogues.js`)

```javascript
export const NPC_DIALOGUES = {
  villager_1: {
    name: 'Aldeano',
    phrases: [
      '¡Bienvenido a nuestro pueblo!',
      'Ten cuidado con los slimes del bosque.',
    ],
  },
};
```

---

## 🧩 Plugin: phaser-animated-tiles

Phaser 3 no reproduce animaciones definidas en tilesets de Tiled por defecto (renderiza solo el primer frame). Este plugin llena ese vacío.

**Inicialización en `PlayScene`:**
1. `preload()` — carga el plugin como `scenePlugin`.
2. `create()` — `this.sys.animatedTiles.init(this.map)` tras crear el mapa.

**Uso en Tiled:** Seleccioná el tile en el editor de tilesets → panel "Tile Animation" → arrastrá los frames y definí duración en ms. Pintá el mapa con ese tile. El plugin lo detecta automáticamente al exportar a JSON.

---

## 🎁 Conversión de GIFs a Spritesheets (EzGif)

Para integrar animaciones GIF en Phaser:

1. **Herramienta**: [EzGif - GIF to Sprite Sheet](https://ezgif.com/gif-to-sprite).
2. **Opciones**: `Stack horizontally`, margin `0 px`.
3. **Dimensiones**: EzGif informa ancho, alto y cantidad de frames. El `frameWidth` para Phaser = ancho total / cantidad de frames.

---

## 📐 Referencia Rápida: Propiedades Personalizadas en Tiled

### Objetos (`Objects` layer)

| Propiedad | Tipo | Ejemplo | Descripción |
|:----------|:-----|:--------|:------------|
| `interactionType` | string | `sign`, `profile` | Acción al presionar E |
| `animation` | string | `campfire_idle` | Animación Phaser sobre el objeto |
| `text` | string | `¡Peligro!` | Texto para letreros |
| `entity` | string | `npc`, `slime` | Spawna entidad |
| `sound` | string | `FIRE_CRACKLE` | Audio espacial looping |
| `radius` | float | `300.0` | Radio de escucha en px |
| `volume` | float | `0.8` | Volumen máximo |

### Zonas de Bioma (`Biomes` layer)

| Propiedad | Tipo | Valores | Descripción |
|:----------|:-----|:--------|:------------|
| `biome` | string | `normal`, `autumn`, `winter` | Triggera música y fondo |

### Tiles en Editor de Tileset

| Propiedad | Tipo | Valores | Descripción |
|:----------|:-----|:--------|:------------|
| `material` | string | `stone` | Cambia SFX de pasos |

---

## 🛠️ Agregar un Nuevo Nivel

1. Crear `src/scenes/Level3Scene.js` (copiar estructura de `Level2Scene`).
2. Registrar en el array de escenas de `src/main.js`.
3. Exportar mapa Tiled a `public/assets/maps/` y registrarlo en `AssetManifest.js` y `Constants.js`.
4. Agregar la clave del mapa a `ASSETS` y el nombre de la escena a `SCENES` en `Constants.js`.

## 🛠️ Agregar un Nuevo Enemigo

1. Crear `src/entities/enemies/MyEnemy.js` extendiendo `Enemy.js`. Pasar `EnemyConfig` (con `animKeys` y opcionalmente `attackHitbox`) a `super()`. Definir `this.facesLeftByDefault = true` si el spritesheet mira a la izquierda naturalmente.
2. Si necesita lógica de FSM especial, crear estados en `src/entities/enemies/states/` (los genéricos están ahí).
3. Agregar la clave del asset a `ASSETS` y el tipo a `ENTITY_TYPES` en `Constants.js`.
4. Registrar el spritesheet en `AssetManifest.js` (con `frameWidth`/`frameHeight`) y agregar configs de animación + `SPRITE_CONFIG` en `Animations.js`. Incluir en `MASTER_ANIMATIONS_REGISTRY`.
5. Spawnear desde Tiled usando la propiedad `entity` con el valor del tipo en `ENTITY_TYPES`.
6. En la escena, en `processObjectLayer`, agregar el branch que crea `new MyEnemy(this, x, y)` y lo agrega al grupo `enemies`.
7. Assets de audio en `public/assets/audio/enemies/bosses/`, sprites en `public/assets/sprites/enemies/bosses/`.
