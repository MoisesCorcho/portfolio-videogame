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
1.  **Nueva Capa de Objetos**: Crea una capa de objetos llamada exactamente `Platforms` (respetando mayúsculas).
2.  **Creación de Colisiones**: Dibuja rectángulos en esta capa donde quieras que el jugador pueda aterrizar.
3.  **Invisibilidad**: Por defecto, los objetos en esta capa son invisibles en el juego, actuando solo como límites físicos. Esto permite total flexibilidad para colocar colisiones sobre cualquier decoración.


---

## 🎁 Conversión de GIFs a Sprites (EzGif)

Para integrar animaciones desde archivos GIF en Phaser, es recomendable convertirlos a Spritesheets:

1. **Herramienta**: Utiliza [EzGif - GIF to Sprite Sheet](https://ezgif.com/gif-to-sprite).
2. **Opciones de Conversión**:
   - **Tile alignment**: Selecciona `Stack horizontally`.
   - **Margin around tiles**: `0 px`.
3. **Cálculo de Dimensiones**:
   - La página de EzGif indica el alto, ancho y cantidad de frames.
   - **Desde Windows**: Puedes encontrar el **Alto** en los detalles del archivo. Para el **Ancho** de cada frame, divide el ancho total entre el valor del campo **Profundidad en bits** (o el número de frames).
   - **Importante**: Necesitamos conocer el **ancho** y **alto** exactos de un frame para poder importar de manera correcta el sprite en el software **Tiled**, asegurando que cada uno se encuadre perfectamente.
