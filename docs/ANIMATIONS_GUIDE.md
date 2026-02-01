# 📖 Guía: Flujo de Animaciones (Tiled ➔ Phaser)

Esta documentación explica paso a paso cómo integrar objetos animados desde el editor Tiled hacia el motor Phaser, utilizando la arquitectura actual del proyecto.

---

## 1. El Flujo de Trabajo (Arquitectura)

Para que una animación aparezca en el juego, los datos viajan a través de los siguientes archivos:

1.  **`src/utils/Constants.js` (La Etiqueta):**
    *   **Propósito:** Centralizar los nombres de los recursos.
    *   **Acción:** Se define una constante para el nuevo asset (ej: `FURNACE: 'furnace'`).

2.  **`src/data/AssetManifest.js` (La Descarga):**
    *   **Propósito:** Decirle al cargador de Phaser qué archivos descargar.
    *   **Acción:** Se añade una entrada de tipo `spritesheet` vinculando la imagen física con su configuración de tamaño.

3.  **`src/data/Animations.js` (La Definición):**
    *   **Propósito:** Definir los cuadros (frames) y la velocidad.
    *   **Acción:** 
        *   `SPRITE_CONFIG`: Define el ancho y alto de cada cuadrito.
        *   `OBJECT_ANIMS`: Define qué frames componen cada animación (ej: frames 0 al 5).

4.  **`src/scenes/PlayScene.js` (La Implementación):**
    *   **Propósito:** El "cerebro" que lee el mapa y da vida a los objetos.
    *   **Acción:** 
        *   `createEnvironmentAnimations()`: Registra las animaciones en el motor de Phaser antes de usarlas.
        *   `createInteractables()`: Escanea las capas de objetos de Tiled y, si encuentra la propiedad `animation`, crea un Sprite y ejecuta `.play()`.

---

## 2. Paso a Paso: Agregar una Nueva Animación

Sigue este procedimiento para añadir, por ejemplo, un **Cofre Brillando**.

### Fase A: Configuración en Tiled

1.  **Capa de Objetos:** Asegúrate de estar trabajando en una capa de objetos (como `Objects` o `Decorations`). No uses capas de patrones (Tiles) si quieres control total.
2.  **Colocar Objeto:** Selecciona el primer frame del cofre en tu Ventana de Patrones y arrástralo al mapa.
3.  **Configurar Propiedades:** En el panel "Atributos" del objeto:
    *   **Nombre:** `chest` (esto se usará como `assetKey` por defecto).
    *   **Atributo Nuevo (`+`):** 
        *   Nombre: `animation`
        *   Tipo: `string`
        *   Valor: `chest_glow` (debe coincidir con el código).

### Fase B: Configuración en el Código

#### 1. Registrar el nombre (`src/utils/Constants.js`)
```javascript
export const ASSETS = {
  // ...
  CHEST: 'chest',
};
```

#### 2. Definir dimensiones y frames (`src/data/Animations.js`)
```javascript
export const SPRITE_CONFIG = {
  // ...
  CHEST: { frameWidth: 32, frameHeight: 32 },
};

export const CHEST_ANIMS = {
  GLOW: { key: 'chest_glow', start: 0, end: 3, rate: 10, repeat: -1 },
};
```

#### 3. Registrar el archivo real (`src/data/AssetManifest.js`)
```javascript
{ 
  type: 'spritesheet', 
  key: ASSETS.CHEST, 
  path: 'assets/decorations/chest.png', 
  config: SPRITE_CONFIG.CHEST 
},
```

#### 4. Registrar en el motor (`src/scenes/PlayScene.js`)
Dentro del método `createEnvironmentAnimations()`, añade el bucle para el nuevo objeto:
```javascript
createEnvironmentAnimations() {
  // ... (otros objetos)

  Object.values(CHEST_ANIMS).forEach(anim => {
    if (!this.anims.exists(anim.key)) {
      this.anims.create({
        key: anim.key,
        frames: this.anims.generateFrameNumbers(ASSETS.CHEST, { start: anim.start, end: anim.end }),
        frameRate: anim.rate,
        repeat: anim.repeat
      });
    }
  });
}
```

---

## 3. Resolución de Problemas (Troubleshooting)

| Problema | Causa Probable | Solución |
| :--- | :--- | :--- |
| **Aparece la imagen pero no se mueve.** | Falta el atributo `animation` en Tiled. | Añade el atributo `animation` (string) al objeto en Tiled. |
| **Error: "Missing animation: X"** | La animación se intenta usar antes de crearla. | Asegúrate de llamar a `createEnvironmentAnimations()` **antes** de `createInteractables()`. |
| **El objeto aparece en un lugar equivocado.** | Origen del sprite. | Phaser usa el centro por defecto, pero nosotros usamos `setOrigin(0, 1)` (esquina inferior izquierda) para coincidir con Tiled. |
| **La imagen se ve cortada o estirada.** | `frameWidth` o `frameHeight` incorrectos. | Revisa en `Animations.js` que el tamaño por frame coincida con tu archivo `.png`. |

---
*Documentación generada para el Proyecto Portfolio Game - 2024.*
