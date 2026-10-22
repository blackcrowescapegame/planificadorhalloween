# Referencia del montaje ajustado

Objetivo: adaptar el montaje de nueve props del usuario a la foto de Halloween, usando sus medidas e inventario. La foto aportada es la referencia de composición; la interfaz conserva la dirección de Factory.ai / Editor X documentada en design-decisions.md. No se rediseña el producto.

La propuesta mantiene el acceso central, sitúa la figura de 2 m al fondo derecho, el personaje adelantado en el jardín izquierdo y la escena sentada en el derecho. Las calabazas pequeñas en primer plano equilibran ambos lados. Los nombres e identidades del inventario prevalecen sobre los personajes distintos que aparecen en la foto.

| Decisión | Fuente | Aplicación |
|---|---|---|
| Acceso central despejado | Foto y cotas del usuario | Huellas fuera del sendero de 1,25 m |
| Creper al fondo derecho | Figura alta próxima a la casa en la foto; JSON de 2 m | X=6,15; Y=1,65 |
| Demonio adelantado a la izquierda | Personaje que avanza a la izquierda en la referencia | Se usa el demonio disponible en el inventario |
| Sillón / barril / espantapájaros en el lado derecho | Grupo de figuras a la derecha de la foto | Separación en X y profundidad para hacer visibles los tres |
| Barril sobre la referencia de cemento | Confirmación anterior del usuario | Centro de losa X=7,57; Y=3,95 |
| Calabazas de 0,30 m delante | Confirmación explícita del usuario y foto | Dos a izquierda, una a derecha; bases Z=0 |
| Alturas restantes sin cambios | MontajeActual.json | No se infieren nuevas medidas de una perspectiva |
| SVG / OBJ de volúmenes | Modelo existente del planificador | Geometría funcional a escala, sin sustituir el montaje por una imagen inventada |
| HTML con propuesta precargada | Necesidad de ver y editar el resultado | Guardado local separado; JSON compatible con el editor habitual |

Verificación: generador comprueba inventario, datos preservados, límites, sendero, solapamientos y una línea de visión hacia el 80 % de la altura desde el centro del acceso a 1,60 m. El visor se ejecutó en un documento simulado con sus manejadores reales; los SVG de planta y 3D se rasterizaron con sharp y la vista compuesta se inspeccionó visualmente. No se declara una prueba de interacción en navegador para esta propuesta.

El resultado conserva los rasgos de composición que el inventario permite. Las figuras colgantes, luces, telarañas y demás densidad de la referencia no están en el inventario y no se inventan como dispositivos del montaje.
