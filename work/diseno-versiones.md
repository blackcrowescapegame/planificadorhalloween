# Guardado y versiones en Azure

Dirección visual: conservar los tokens y botones del editor existente (Factory.ai y Editor X, documentados en design-decisions.md). Referencia concreta de historial: Craft Backups, Refero 2a9789bd-9bae-4d8b-8d78-09cf28080f70; se adapta su lista de versiones fechadas dentro de un diálogo, con metadatos secundarios y acción de restauración. No se trasladan su fondo azul ni sus sombras al editor.

| Decisión | Fuente | Aplicación |
|---|---|---|
| Guardar en servidor separado de descargar JSON | Petición explícita del usuario | Acción principal y botones existentes intactos |
| Historial fechado y restauración | Petición del usuario / Craft Backups | Diálogo, filas ordenadas, props/cables y etiqueta de versión actual |
| Guardar antes de restaurar | Recuperación reversible | Snapshot previo y restauración como nuevo snapshot |
| Sin localStorage ni selector de carpeta | Corrección explícita del usuario | API del mismo sitio; archivos JSON en el servidor |
| Persistencia fuera de wwwroot | Mismo Azure App Service | /home/data/planificadorhalloween; sin base de datos ni nuevo recurso |
| Fecha/hora de Santiago | Contexto del usuario | Timestamps ISO en JSON; presentación y nombres de archivo en Santiago |

Verificado con pruebas de lógica de snapshots, fallos de escritura, restauración, API real con archivos JSON, reinicio del proceso, cliente HTTP real y manejadores de UI. Los paquetes Node no necesitan dependencias externas. La interfaz mantiene el diseño del editor y tiene límites de alto/desplazamiento para la lista.

Límite: no hay un controlador de navegador disponible en esta sesión para verificar el diálogo renderizado. Azure CLI está instalado pero no tiene sesión autenticada; la configuración y el despliegue se realizan mediante el workflow existente de GitHub. No se declara verificación de persistencia en la instancia Azure hasta ejecutar ese despliegue y comprobar el sitio.
