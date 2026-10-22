# Plano de Halloween

## Fuente y cotas
Medidas.pptx tiene una diapositiva. Se usan las cotas escritas, no las proporciones de sus formas. Todas las unidades se interpretan en metros.
Terreno rectangular: 4.07 + 1.25 + 5.00 = 10.32 m de ancho, 8.70 m de fondo.
Origen de coordenadas: esquina izquierda junto a la casa. X hacia la derecha, Y hacia la calle, Z altura.
Sendero: X entre 4.07 y 5.32, Y entre 0 y 8.70.
Círculo: diámetro 1.20, separación a borde izquierdo .43 y a fachada .49. Se interpreta como palmera por la fotografía anterior. Altura pendiente, editable.
Losa: lado .50, separación de 2.00 desde borde derecho del sendero a borde izquierdo de losa. Los 4.50 se interpretan provisionalmente desde calle a borde inferior de losa; se admite referencia al centro.
Casa arriba, calle abajo, confirmado por usuario. Alimentación en centro de fachada, confirmado. Se inicia X=5.16, Y=0, Z=0; altura real pendiente.

## Referencias y decisiones
Fuente principal: Factory.ai, Refero f1ed1d46-4e76-41fe-a9f8-3017e55dc6ee. Gris claro, texto oscuro, divisores finos, radio 4px, números monoespaciados, sin sombras ni gradientes.
Control, Refero 94565ee3-1022-4150-bec1-2863506e2951: únicamente el plano con cuadrícula como superficie de trabajo. No se trasladan sus colores CTA a la escena.
Editor X, Refero 14de8ffb-7140-4d73-ad7f-94e8befaff75: selección directa y panel lateral de coordenadas, dimensiones y rotación.
Referencia visual proporcionada: diagrama de mediciones del usuario. Preservar planta, sendero azul y huella de palmera. Tonos de geometría derivados de la fuente; colores de props escogibles por el usuario.
Los props se representan con geometría funcional. Sin imágenes decorativas ni ambientación inventada.

| Decisión | Fuente | Rol | Razón |
|---|---|---|---|
| Plano amplio, panel derecho | Editor X | Edición | Mover visualmente y ajustar con cotas |
| Tipografía 14/16/24, números mono | Factory.ai | UI/medidas | Lectura a escala sin adorno |
| Azul del sendero, círculo verde | PPT del usuario | Geometría | Reconocer su dibujo |
| Naranja en selección e indicadores | Factory.ai | Estado activo | Selección y modo de trazado |
| Alturas desconocidas en cero | Mediciones disponibles | Honestidad del modelo | Evitar inventar fachada/palmera |
| Archivo autosuficiente y respaldo JSON | Solicitud de alternativa económica | Portabilidad | Uso sin cuenta ni suscripción |
| Copiar/Pegar en fila de botones de Props | Editor existente y petición del usuario | Edición de objetos | Repetir el prop con los mismos atributos y posición independiente; respetar atajos de texto dentro de formularios |

## Recorridos
Cada conexión se calcula por el suelo, con tramos verticales a los extremos y vértices adicionales de altura editable. La selección de origen admite enchufe o caja de distribución. No se interpreta una caja como nuevo enchufe sin representar su conexión.
Largo de extensión = max(0, (recorrido + reserva fija) * (1 + margen/100) - cable propio del destino). El largo comercial superior es orientativo y usa lista editable.
Cada cable se computa individualmente, incluso si comparte recorrido. El total es suma de cables, no de corredores. Cambiar o mover un prop actualiza sus conexiones.
