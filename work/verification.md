# Verificación

- Medidas.pptx inspeccionado leyendo XML de su única diapositiva; cotas contrastadas con captura del usuario. No se abrió en PowerPoint ni se modificó.
- 8 comprobaciones automatizadas del modelo: dimensiones, referencia de losa, tramos verticales, reserva/margen/cable propio, desvíos, movimiento de destino, caja de distribución, eliminación de cables dependientes, longitud cero, validación de JSON, nombres escapados, estructura SVG/CSV/OBJ.
- JavaScript de interfaz y modelo comprobado sintácticamente con Node.
- Revisión visual y funcional en navegador in-app, viewport escritorio 1280 × 900 y móvil 390 × 844. Plano móvil mantiene texto legible con desplazamiento de la superficie.
- Añadido un fantasma de prueba, editado X=7, Y=6, confirmado con Aplicar cambios. Cable actualizado a recorrido 6,43 m y extensión 7,96 m.
- Añadidos dos vértices por clic y editados a (6;0,5;0), (6;6;0). Recorrido 7,63 m, extensión 9,35 m, sugerencia 10 m.
- CSV descargado desde interfaz. JSON descargado y restaurado con mensaje «Montaje abierto correctamente».
- Vista 3D inspeccionada y corregida para que el terreno no oculte el sendero y la huella de la palmera. Modelo geométrico, no render fotográfico.
- Sin errores de JavaScript capturados durante las pruebas.
- SVG comprobado como XML; OBJ generado con vértices e índices válidos. Importación en Blender/Sweet Home 3D no ejecutada porque no están instalados. Se entrega OBJ estándar y SVG estándar.
- Pendiente de datos reales: altura de fachada/palmera/enchufes, props definitivos, posibles desniveles/obstáculos no medidos, extremo preciso de la cota 4,50 m.

## Copiar y pegar props

- Añadidos botones Copiar prop / Pegar prop y Ctrl+C / Ctrl+V (también Meta en Mac). Se preserva copiar/pegar texto dentro de input, textarea, select y contenteditable.
- 10 pruebas del modelo aprobadas, incluidas independencia de identificadores/propiedades, posiciones separadas al pegar repetidamente, conexiones conservadas y huellas dentro del terreno al pegar cerca de un borde.
- Prueba de los manejadores reales de teclado en documento desechable: copia, dos pegados consecutivos, snapshot estable y bypass de campos de texto.
- Prueba en navegador de copia del HTML en un origen HTTP de QA separado: una Calabaza original y dos copias, usando botones. No se leyó ni alteró el montaje abierto por el usuario en file://.
- El control del navegador bloqueó la observación del archivo file:// por política de protocolo. La actualización se hizo en el archivo fuente y la verificación en un montaje artificial por HTTP.
- El control de teclado de la herramienta intercepta Ctrl+V con su portapapeles virtual y no permite verificar el evento real en la página. Los atajos se verificaron con la prueba de manejadores, no se declara una prueba manual de esos atajos en navegador.
