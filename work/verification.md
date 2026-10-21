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
