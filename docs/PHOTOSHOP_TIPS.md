# Guía de Limpieza de Assets en Photoshop (Especial Pixel Art)

Esta guía detalla cómo eliminar los residuos o "halos" que aparecen al quitar el fondo de una imagen, asegurando bordes 100% nítidos para juegos en 2D.

---

## 🛑 El Problema: Residuos y Halos
Cuando eliminas el fondo de una imagen que tiene **suavizado (anti-aliasing)** o compresión, suelen quedar píxeles semi-transparentes en los bordes. En el Pixel Art, estos residuos se ven como una "suciedad" o un borde borroso al importar el asset al motor de juego (Phaser, Unity, etc.).

---

## ✅ Solución Principal: El Truco de "Contraer Selección"
*Este es el método más rápido y efectivo cuando el residuo es un hilo fino de píxeles.*

### Pasos:
1.  **Seleccionar el Objeto:** Mantén presionada la tecla `Ctrl` y haz **clic en la miniatura de la capa** en el panel de Capas. Esto creará una selección exacta de tus objetos.
2.  **Contraer la Selección:** Ve al menú **Selección > Modificar > Contraer** (*Select > Modify > Contract*).
3.  **Definir Grosor:** Ingresa **1 píxel** (o 2 si el residuo es muy grueso) y pulsa OK. La selección se encogerá hacia adentro.
4.  **Invertir Selección:** Presiona `Ctrl + Shift + I`. Ahora tienes seleccionado solo el "filo" exterior sucio.
5.  **Borrar:** Presiona la tecla `Supr` (*Delete*). ¡Listo! El borde ahora es totalmente nítido.

---

## 🛠️ Soluciones Alternativas

### 1. "Endurecer" Bordes con Niveles
Ideal para cuando los residuos son muchos y muy transparentes.
*   Presiona `Ctrl + L` (Niveles).
*   Cambia el canal a **Alfa**.
*   Mueve los deslizadores externos hacia el centro hasta que el borde se vuelva sólido.

### 2. Capa de Contraste (Detección Manual)
Para ver lo que la IA o la varita mágica no borraron.
*   Crea una capa debajo de tu asset.
*   Rellénala de **Rosa Neón** o un color muy llamativo.
*   Usa el **Borrador** en **Modo Lápiz** para limpiar manualmente los puntos visibles.

---

## 📤 Consejo Pro: Exportación Correcta
Para mantener la limpieza lograda, utiliza siempre:
*   **Archivo > Exportar > Guardar para Web (Heredado)**.
*   Formato: **PNG-24**.
*   Asegúrate de marcar la casilla **Transparencia**.
*   **Importante:** Verifica que el "Mate" esté en "Ninguno" para evitar que Photoshop añada un borde de color sólido.
