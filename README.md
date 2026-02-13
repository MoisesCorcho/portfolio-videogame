# Documentación Técnica del Proyecto Portfolio Game

Este documento proporciona una visión detallada de la arquitectura, estructura de archivos y lógica principal del proyecto de juego desarrollado en Phaser 3 con Vite y TailwindCSS.

## 📁 Estructura del Proyecto

El proyecto está organizado de manera modular para separar la configuración, los datos, la lógica del juego y la interfaz de usuario.

### Directorios Principales (`src/`)

- **`config/`**: Configuraciones globales del juego.
- **`data/`**: Manifiestos de assets, configuraciones de animaciones y datos estáticos.
- **`player/`**: Lógica del jugador, máquina de estados y definiciones de estados.
- **`scenes/`**: Escenas de Phaser (Preloader, Juego principal).
- **`ui/`**: Componentes de interfaz de usuario (svelte, stores).
- **`utils/`**: Constantes y utilidades generales.
- **`main.js`**: Punto de entrada de la aplicación.

---

## ⚙️ Configuración e Inicialización

### `src/main.js`

Es el punto de entrada. Inicializa la instancia de `Phaser.Game` utilizando la configuración definida y monta la interfaz de usuario (Svelte) sobre el canvas del juego.

### `src/config/GameConfig.js`

Define las constantes globales de configuración:

- Dimensiones del renderizado.
- Gravedad y físicas Arcade.
- Colores de fondo.
- Niveles de zoom y dimensiones del mundo.
- Flags de depuración (`debug: import.meta.env.DEV`).

---

## 📦 Sistema de Gestión de Assets

El sistema de assets es híbrido, combinando cargas dinámicas automáticas con definiciones manuales para assets complejos.

### `src/data/AssetManifest.js`

Este archivo es el corazón de la gestión de assets.

1.  **Carga Dinámica**: Utiliza `import.meta.glob` de Vite para descubrir automáticamente todos los archivos `.png` en `public/assets/decorations/`.
2.  **Normalización de Claves**:
    - Genera claves únicas para Phaser (ej. `GH_Decoration_bookshelf`) para evitar colisiones de nombres.
    - Genera claves compatibles con Tiled (ej. `../decorations/...`) para que el mapa pueda encontrar los assets automáticamente.
3.  **Assets Estáticos**: Define manualmente spritesheets (`PLAYER`, `FURNACE`), tilemaps (`level1.json`) y fondos parallax.

### `src/scenes/Preloader.js`

Se encarga de cargar todos los recursos antes de iniciar el juego.

- Itera sobre el `ASSET_MANIFEST` generado.
- Carga imágenes, spritesheets y mapas JSON.
- Crea las animaciones globales del jugador una vez finalizada la carga (`createAnimations()`).

### `src/utils/Constants.js`

Centraliza todas las cadenas de texto mágicas (mágic strings) para claves de assets, nombres de escenas, capas de mapas y tipos de eventos, previniendo errores de tipografía.

---

## 🎮 Lógica del Juego (Escenas)

### `src/scenes/PlayScene.js`

Es la escena principal donde ocurre toda la jugabilidad.

- **`create()`**: Orquesta la inicialización del nivel en orden:
  1.  **Fondo Parallax**: `createParallaxBackground()`. Capas con diferente velocidad de desplazamiento (`setScrollFactor`).
  2.  **Animaciones de Entorno**: `createEnvironmentAnimations()`.
  3.  **Nivel (Tilemap)**: `createLevel()`. Carga el mapa de Tiled, gestiona capas de tiles y objetos.
  4.  **Jugador**: `createPlayer()`. Instancia la clase `Player`.
  5.  **Cámara**: Configura el seguimiento (`startFollow`) y límites del mundo.
- **Integración con Tiled**:
  - **Mapeo de Tilesets**: Lógica inteligente para asociar tilesets de Tiled con texturas de Phaser (coincidencia exacta o difusa).
  - **Capas de Objetos**: `processObjectLayer()` convierte objetos de Tiled en elementos interactivos o puntos de spawn.
  - **Colisiones Manuales**: `processManualCollisions()` crea cuerpos físicos invisibles basados en formas dibujadas en Tiled.

---

## 🏃‍♂️ Sistema del Jugador

El jugador utiliza una Máquina de Estados Finitos (FSM) para gestionar su comportamiento complejo.

### `src/player/Player.js`

Extiende `Phaser.Physics.Arcade.Sprite`.

- Configura físicas (rebote, colisiones con el mundo, tamaño del cuerpo).
- Inicializa los inputs (teclado).
- Instancia la `StateMachine`.
- Define los estados posibles (`idle`, `run`, `jump`, `fall`, `landing`, `attack`).

### `src/player/StateMachine.js`

Clase genérica que gestiona las transiciones entre estados.

- **`transition(newState)`**: Cambia el estado actual y llama a los métodos `enter()`/`exit()`.
- **`step()`**: Ejecuta el método `update()` del estado activo en cada frame.

### `src/player/states/`

Cada archivo representa un comportamiento aislado (ej. `JumpState.js`, `RunState.js`), lo que facilita la adición de nuevas mecánicas sin ensuciar la clase `Player`.

---

## 🎨 Animaciones

### `src/data/Animations.js`

Registro central de todas las configuraciones de animación.

- **`PLAYER_ANIMS`**: Define rangos de frames (start/end), frameRate y repetición para el personaje.
- **`SPRITE_CONFIG`**: Define las dimensiones de los frames para spritesheets.
- **`MASTER_ANIMATIONS_REGISTRY`**: Relaciona assets (como el horno) con sus configuraciones de animación para que se creen automáticamente en la escena.

---

## 🗺️ Mapa y Niveles (Tiled)

El juego utiliza mapas creados en Tiled (`.json`).

- **Capas de Tiles**: Renderizan el suelo y decoraciones estáticas.
- **Capas de Objetos**:
  - `Ground`: Colisiones principales.
  - `Objects`: Elementos interactivos con propiedades personalizadas (`interactionType`, `animation`).
  - `Collisions`: Formas personalizadas para colisiones precisas.
- **Propiedades Personalizadas**: Se leen en `PlayScene.js` para asignar lógica (ej. abrir un modal al interactuar).

---

## 🪜 Plataformas Atravesables (One-Way Platforms)

El juego soporta plataformas que permiten saltar a través de ellas desde abajo y pararse encima.

### 🛠️ Detalles Técnicos

- **Archivos involucrados**:
  - [`src/scenes/PlayScene.js`]: Contiene la lógica de creación y el loop de actualización.
  - [`src/utils/Constants.js`]: Define el nombre de la capa (`PLATFORMS`).
- **Funciones Clave**:
  - `processOneWayPlatforms(layerName)`: Itera sobre los objetos de Tiled y crea `Phaser.Physics.Arcade.StaticGroup` de zonas invisibles.
  - `update()`: Gestiona la entrada del teclado para la mecánica de bajada.

### 🧠 ¿Cómo funciona el sistema?

1.  **Colisiones Unidireccionales**: En Phaser, cada cuerpo físico tiene flags de colisión. Para estas plataformas, configuramos `body.checkCollision.up = true` y el resto (`down`, `left`, `right`) en `false`. Esto permite que el jugador pase a través de ellas desde cualquier dirección excepto desde arriba.
2.  **Mecánica de Bajada (Drop-Down)**:
    - Cuando el jugador está tocando el suelo (`body.touching.down`) y presiona la tecla **Abajo** o **S**, el sistema verifica si está sobre un objeto de la capa `Platforms`.
    - Si es así, desactivamos temporalmente el colisionador principal (`oneWayCollider.active = false`).
    - Usamos un `this.time.delayedCall(250, ...)` para reactivar el colisionador después de 250ms, permitiendo que el jugador atraviese la plataforma hacia abajo.

### 🗺️ Configuración en Tiled

#### One-Way Platforms

1.  **Nueva Capa de Objetos**: Crea una capa de objetos llamada exactamente `Platforms` (respetando mayúsculas).
2.  **Rectángulos**: Dibuja rectángulos en esta capa donde quieras que el jugador pueda aterrizar/atravesar.
3.  **Invisibilidad**: Los objetos son invisibles en el juego, solo actúan como límites físicos.

#### Zonas de Biomas

1.  **Capa de Objetos**: Crea una capa de objetos llamada `Biomes`.
2.  **Rectángulos**: Dibuja rectángulos que cubran el área total de cada bioma (soporta profundidad Y).
3.  **Propiedad Personalizada**:
    - **Nombre**: `biome` (tipo string).
    - **Valor**: El nombre del bioma (ej: `normal`, `autumn`, `winter`). Debe coincidir con los nombres definidos en `PlayScene.js` (BIOME_ZONES).
4.  **Prioridad**: Si el jugador está dentro de varios rectángulos, se activará el primero que encuentre en la lista de objetos de Tiled.

---

## 🧩 Plugins y Extensiones

### `phaser-animated-tiles`

Este proyecto utiliza el plugin **[phaser-animated-tiles](https://www.npmjs.com/package/phaser-animated-tiles)** para habilitar la reproducción de animaciones definidas en los tilesets de Tiled dentro de Phaser 3.

#### ❓ ¿Por qué es necesario?
Phaser 3, por defecto, **NO reproduce animaciones de tiles** que se encuentren en las "Capas de Patrones" (Tile Layers) de Tiled. Solo renderiza el primer frame del tile de forma estática. Este plugin llena ese vacío, permitiendo que elementos como agua, fuego, o decoraciones animadas funcionen automáticamente sin necesidad de convertirlos en Sprites (GameObjects).

#### 🛠️ Implementación en el Proyecto
El plugin se ha instalado vía npm y se inicializa en `src/scenes/PlayScene.js`:

1.  **Importación**: Se importa directamente desde `node_modules`.
2.  **Carga**: Se carga en el método `preload()` de la escena como un `scenePlugin`.
3.  **Inicialización**: Se ejecuta `this.sys.animatedTiles.init(this.map)` en el método `create()` una vez que el mapa ha sido generado.

#### 🎨 Uso en Tiled
Para que un tile se anime en el juego:

1.  **Editor de Tilesets**:
    - Abre tu tileset en Tiled (`.tsx` o pestaña de tileset).
    - Selecciona el tile que quieres animar.
    - Ve al panel de **Animación de Teselas** (Tile Animation Editor).
    - Arrastra los frames que componen la animación y define la duración de cada uno (en ms).

2.  **Capa de Patrones (Tile Layer)**:
    - Selecciona una **Capa de Patrones** (NO una Capa de Objetos).
    - Pinta el mapa con el tile animado que acabas de configurar.

Al exportar el mapa a JSON y ejecutar el juego, el plugin detectará automáticamente estos metadatos y reproducirá la animación.

---

## 🎁 Conversión de GIFs a Sprites (EzGif)

Para integrar animaciones desde archivos GIF en Phaser, es recomendable convertirlos a Spritesheets:

1. **Herramienta**: Utiliza [EzGif - GIF to Sprite Sheet](https://ezgif.com/gif-to-sprite).
2. **Opciones de Conversión**:
   - **Tile alignment**: Selecciona `Stack horizontally`.
   - **Margin around tiles**: `0 px`.
3. **Cálculo de Dimensiones**:
   - La página de EzGif indica el alto, ancho y cantidad de frames.
   - **Importante**: Necesitamos conocer el **ancho** y **alto** exactos de un frame para poder importar de manera correcta el sprite en el software **Tiled**, asegurando que cada uno se encuadre perfectamente.

---

## 🔊 Sistema de Audio Avanzado

El juego implementa un motor de audio robusto y dinámico que sumerge al jugador en el entorno. Gestiona música de fondo adaptativa, efectos de sonido sincronizados con animaciones y audio espacial posicional.

### 📂 Gestión de Assets de Audio

Todos los archivos de audio se encuentran en `public/assets/audio/` y se cargan a través del `AssetManifest.js`.

- **Música (`/music`)**: Pistas en bucle para cada bioma (Normal, Otoño, Invierno).
- **Ambiente (`/env`)**: Loops de sonidos naturales como cascadas, viento y fuego.
- **Efectos (`/sfx`)**: Sonidos de acción (pasos, saltos, ataques, aterrizajes).

### 🧠 Arquitectura del Código

#### 1. `src/utils/AudioManager.js` (El Núcleo)
Un Singleton que centraliza todo el control de audio.
- **Cross-fading de Música**: Transiciones suaves automáticas entre pistas de biomas. Si el jugador corre de un bioma a otro, la música antigua se desvanece mientras entra la nueva.
- **Audio Espacial**: Calcula la distancia entre el jugador y las fuentes de sonido (como una fogata) en cada frame. Ajusta el volumen dinámicamente: más fuerte cerca, silencioso lejos.
- **Control Global**: Métodos para pausar, reanudar y ajustar el volumen maestro.

#### 2. Integración en `PlayScene.js`
- **Inicialización**: Crea la instancia de `AudioManager` al inicio.
- **Update Loop**: Llama a `audioManager.updateSpatialSounds(player)` en cada frame para recalcular volúmenes espaciales.
- **Detección de Biomas**: Monitorea la posición del jugador para disparar cambios de música según la zona del mapa.

#### 3. Estados del Jugador (`src/player/states/`)
El audio está desacoplado de la lógica visual y se dispara por eventos de estado:
- **`JumpState.js`**: Reproduce `sfx_jump` al iniciar el salto.
- **`LandingState.js`**: Reproduce `sfx_land` al tocar el suelo.
- **`AttackState.js`**: Reproduce `sfx_attack` sincronizado con la animación.
- **`RunState.js`**: Sistema de pasos inteligente (ver abajo).

### 🛠️ Configuración en Tiled (Guía Detallada)

Para que el sistema funcione, el mapa debe configurarse correctamente en Tiled.

#### A. Música de Biomas
1.  **Capa de Objetos**: Asegúrate de tener una capa llamada `Biomes`.
2.  **Zonas**: Dibuja rectángulos cubriendo cada área.
3.  **Propiedad `biome`**: Asigna el valor `normal`, `autumn` o `winter`. El `AudioManager` sabrá qué pista tocar.

#### B. Audio Espacial (Cascadas, Fogatas)
1.  **Capa `Audio`**: Crea una Capa de Objetos llamada **exactamente** `Audio`.
2.  **Objetos de Sonido**: Coloca un punto o rectángulo en la fuente del sonido.
3.  **Propiedades Personalizadas**:
    -   `sound` (string): Clave del sonido (ej: `WATERFALL` o `FIRE_CRACKLE`).
    -   `radius` (float): Distancia en píxeles donde se empieza a escuchar (ej: `400.0`).
    -   `volume` (float): Volumen máximo al estar encima (0.0 a 1.0).
    -   `loop` (bool): `true` (por defecto).

> **Nota Técnica**: El código procesa esta capa `Audio` solo para extraer datos. **No crea sprites visuals**, por lo que no verás cajas verdes feas en el juego.

#### C. Pasos Dinámicos (Suelo)
El juego detecta el tipo de suelo bajo los pies del jugador para cambiar el sonido de los pasos.
1.  **Editor de Tilesets**: En Tiled, edita tu tileset de suelos.
2.  **Selección**: Selecciona los tiles de piedra, madera, etc.
3.  **Propiedad `material`**: Añade una propiedad personalizada llamada `material` (string).
    -   Valor `stone` -> Reproduce `step_stone`.
    -   Sin propiedad -> Reproduce `step_grass` (por defecto).

---

## 🤖 Sistema de NPCs (Non-Player Characters)

El juego soporta NPCs con comportamientos básicos como patrullaje, integrados directamente desde Tiled.

### 🛠️ Configuración en Tiled

Para añadir un NPC al mapa:

1.  **Capa de Objetos**: Trabaja sobre la capa `Objects` (o cualquier capa de objetos procesada en `PlayScene`).
2.  **Insertar Objeto**: Coloca un objeto (Tile Object o Rectángulo) en la posición deseada.
3.  **Propiedades Personalizadas Obigatorias**:
    -   **`entity`** (string): Debe ser **`npc`**. Esto identifica al objeto como un personaje no jugable.

4.  **Propiedades Opcionales (Configuración)**:
    -   **`texture`** (string): La clave del asset en Phaser (ej: `hg_fox`, `bird_npc`). *Por defecto: `hg_fox`*.
    -   **`initialAnim`** (string): La animación que se reproduce al inicio (ej: `fox_idle`, `fox_run`). *Por defecto: `fox_idle`*.
    -   **`moveRange`** (float): Distancia en píxeles que el NPC patrullará a izquierda y derecha desde su punto de origen. *Por defecto: `100`*.
    -   **`moveSpeed`** (float): Velocidad de movimiento. *Por defecto: `50`*.

#### Ejemplo práctico (Zorro):
Crea un objeto en Tiled y añádele:
-   `entity`: `npc`
-   `texture`: `hg_fox`
-   `initialAnim`: `fox_idle`
-   `moveRange`: `150`

> **Nota**: El sistema destruye el objeto visual de Tiled y lo reemplaza por una instancia de la clase `NPC` de Phaser con físicas y lógica de patrulla.

