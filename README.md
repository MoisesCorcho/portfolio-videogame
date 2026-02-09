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

## 🔊 Sistema de Audio

El juego implementa un sistema de audio escalable que soporta música de fondo (con transiciones suaves entre biomas), efectos de sonido (SFX) y audio espacial posicional.

### 📂 Estructura de Archivos
Los archivos de audio deben ubicarse en `public/assets/audio/` siguiendo esta estructura estricta:

```
public/assets/audio/
├── music/              # Música de fondo (loops)
│   ├── bgm_normal.mp3
│   ├── bgm_autumn.mp3
│   └── bgm_winter.mp3
├── sfx/                # Efectos de sonido (one-shot)
│   ├── step_grass.mp3
│   ├── step_stone.mp3
│   ├── jump.mp3
│   ├── land.mp3
│   └── attack_sword.mp3
└── env/                # Sonidos ambientales/espaciales
    ├── waterfall.mp3
    ├── fire_crackle.mp3
    └── wind.mp3
```

### 🛠️ Configuración en Tiled

#### 1. Música de Biomas
El sistema reutiliza la capa de objetos `Biomes` existente.
- **Lógica**: Al entrar en una zona de bioma definida en Tiled, el sistema busca automáticamente un archivo de música coincidente en `Constants.js` (`AUDIO.MUSIC.[BIOME_NAME]`).
- **Transición**: Se realiza un cross-fade automático de 1 segundo entre pistas.

#### 2. Audio Espacial (Objetos que emiten sonido)
Para añadir sonidos localizados (ej: una cascada o fuego) que cambian de volumen según la distancia:

1.  **Capa de Objetos**: Crea una capa llamada **`Audio`**.
2.  **Objeto**: Coloca un punto o rectángulo donde quieras la fuente del sonido.
3.  **Propiedades Personalizadas (Custom Properties)**:
    -   `sound` (string): **OBLIGATORIO**. La clave o nombre corto del sonido (ej: `env_waterfall` o `WATERFALL`).
    -   `loop` (bool): `true` para sonidos continuos (defecto: `true`).
    -   `radius` (float): Distancia en píxeles hasta donde se escucha el sonido (defecto: `300`).
    -   `volume` (float): Volumen máximo en el origen (0.0 a 1.0, defecto: `0.5`).

### 💻 Clases Principales

#### `src/utils/AudioManager.js`
Singleton que orquesta todo el audio.
- `playMusic(key, fade)`: Gestiona loops y cross-fades.
- `updateSpatialSounds(player)`: Calcula distancias frame a frame para ajustar volúmenes.

#### `src/scenes/PlayScene.js`
- Inicializa el `AudioManager`.
- Parsea la capa `Audio` de Tiled en `createLevel()`.
- Actualiza el audio espacial en `update()`.

