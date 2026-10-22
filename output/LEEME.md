# Plano de Halloween

Abre **Planificador-Halloween.html** con doble clic en Chrome, Edge o Firefox. El archivo funciona sin conexión, no necesita instalación, cuenta ni suscripción.

1. Revisa la pestaña **Medidas**. Todas las distancias están en metros. Casa arriba, calle abajo. El terreno mide 10,32 × 8,70 m.
2. En **Props**, elige un tipo y pulsa **Añadir**. Mueve el objeto en el plano y ajusta sus dimensiones reales. Pulsa **Aplicar cambios** para confirmar los campos. Los tamaños de los presets son de referencia.

Para repetir un objeto, selecciónalo y pulsa **Copiar prop** y luego **Pegar prop** tantas veces como necesites. También puedes usar **Ctrl+C / Ctrl+V** (Cmd+C / Cmd+V en Mac). Cada copia conserva las dimensiones, color, rotación y datos de su conector, con un identificador nuevo y una posición independiente. Los cables se conectan por separado. El botón **Duplicar** crea una copia directamente. Copiar props utiliza una copia interna del planificador, disponible durante esa sesión. Dentro de campos de texto o medidas, los atajos siguen copiando y pegando texto.

3. Selecciona **Enchufes de fachada** para corregir posición y altura. El origen inicial es el centro geométrico de la fachada, X=5,16 e Y=0. La altura del enchufe todavía debe medirse.
4. En **Cables**, elige origen y destino. Puedes conectar una caja de distribución al origen y luego conectar los dispositivos a esa caja.
5. **Trazar desvíos** permite hacer clic a lo largo del recorrido. Cada clic añade un punto antes del destino. Pulsa **Terminar trazado** al finalizar. Arrastra los puntos para corregirlos y edita su altura si el cable pasa elevado.
6. Cambia a **Volúmenes 3D** para revisar el espacio. Arrastra o usa los controles para girar. Las alturas desconocidas de palmera y fachada comienzan en cero.
7. Usa **Guardar montaje** para descargar un JSON y **Abrir montaje** para restaurarlo. El guardado automático depende del navegador y de la ruta del archivo: conserva el respaldo JSON.
8. **Exportar** descarga el plano SVG, la lista de cables CSV y el modelo OBJ del montaje actual.

## Archivos incluidos

- **Plano-base.svg**: plano vectorial sin props ni cables, editable en Inkscape. Geometría a escala 1:50 si se imprime al 100 %, sin ajustar al papel.
- **Modelo-base.obj**: modelo de la base para importar en Blender mediante Archivo > Importar > Wavefront (.obj). Coordenadas en metros. X horizontal, Y altura, Z hacia la calle. Configura el sistema de unidades métrico y revisa una dimensión conocida tras importar.
- **Montaje-base.json**: copia de las cotas iniciales, para abrir en el planificador.

## Interpretación de las medidas

Se reconstruyeron las cotas escritas en la única diapositiva de Medidas.pptx. Las formas de PowerPoint no tienen una escala uniforme y no se usaron para inferir dimensiones.

- Terreno: 4,07 m de jardín izquierdo + 1,25 m de sendero + 5,00 m de jardín derecho. Fondo: 8,70 m. Se asume perímetro rectangular y terreno plano, conforme al croquis.
- Palmera: huella circular de diámetro 1,20 m, separada 0,43 m del borde izquierdo y 0,49 m de la fachada. Centro: X=1,03, Y=1,09. El círculo se interpreta como palmera por la fotografía del jardín. La copa no se ha medido.
- Losa de cemento: lado 0,50 m. Borde izquierdo a 2,00 m del borde derecho del sendero. Los 4,50 m se interpretan provisionalmente hasta el borde de la losa más cercano a la calle. Centro resultante: X=7,57, Y=3,95. Si la medición llegaba al centro, elige **Centro de la losa** en Medidas: Y pasa a 4,20 m. El usuario confirmó qué representa la losa, pero no especificó el extremo de esa medida.
- El usuario confirmó fachada arriba, calle abajo y enchufes en el centro de la fachada. Su altura no está medida.
- No se midieron ventanas, puertas, pendiente, rejas, arbustos ni volumen de la casa. El 3D es esquemático y permite agregar alturas, no reconstruye esas formas desde las fotos.

## Cálculo de cables

Cada cable sigue una polilínea 3D: conector de origen, bajada al suelo, puntos de desvío, llegada al suelo junto al destino y subida al conector. El largo suma las distancias de todos los tramos. Al mover un dispositivo, sus extremos se actualizan.

Extensión mínima = máximo entre cero y **(recorrido + reserva fija) × (1 + margen/100) − cable propio del destino**.

Valores iniciales: 15 % de margen y 0,50 m de reserva por cable. Se pueden cambiar en Cables, globalmente o por cable. La sugerencia comercial toma el primer largo suficiente de la lista editable; por encima de la lista redondea a múltiplos de 5 m. Es una sugerencia de compra, no una verificación de disponibilidad.

El total suma cables individuales, incluso si comparten trayecto. Los recorridos no se corrigen automáticamente para evitar obstáculos. El aviso del sendero ayuda a revisar posibles cruces. Se calculan longitudes físicas, no sección eléctrica, carga, caída de tensión ni alcance permitido de cables de datos.

## Alternativas gratuitas

- Sweet Home 3D: alternativa sencilla para plano y vista 3D. Descarga la versión gratuita de escritorio desde https://www.sweethome3d.com/download/ (la página también muestra versiones de pago).
- Blender: gratuito y de código abierto, apropiado para continuar con props detallados e iluminación. https://www.blender.org/
- Inkscape: permite editar el plano vectorial SVG. https://inkscape.org/

La herramienta entregada es independiente de esos programas.
