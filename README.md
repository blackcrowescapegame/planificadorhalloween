# Planificador Halloween

Editor de props, dimensiones y cables con guardado y versiones **en el servidor**. No usa `localStorage` ni una base de datos.

## Guardado y restauración

- **Guardar en servidor** crea un snapshot JSON fechado y actualiza el montaje actual.
- **Versiones** muestra fecha/hora de Santiago, cantidad de props/cables y la versión actual. **Restaurar** guarda primero el trabajo abierto, y luego crea una nueva versión con el montaje elegido.
- **Guardar montaje** sigue descargando un JSON y **Abrir montaje** sigue importándolo. También acepta los JSON de snapshots del servidor.
- **Aplicar cambios** modifica el montaje abierto. Para conservarlo al recargar, pulsa **Guardar en servidor**.
- Al abrir el sitio se carga el último guardado del servidor. Antes de actualizar el HTML antiguo, descarga cualquier trabajo pendiente con **Guardar montaje**.

## Azure existente

La aplicación utiliza el mismo App Service `blackcrow-planner-chile-prod` y su disco persistente:

```text
/home/data/planificadorhalloween/
  actual.json
  historial/
    2026-10-22_14-30-05-123--<id>.json
```

El historial queda fuera de `wwwroot` y del paquete de despliegue; permanece durante reinicios y nuevas publicaciones. No se añade otro recurso Azure. `PLANNER_DATA_DIR` permite configurar otra carpeta persistente.

El workflow existente de GitHub en `main` ejecuta las pruebas, genera los HTML y despliega el servidor Node. Configura `WEBSITES_ENABLE_APP_SERVICE_STORAGE=true`, `PLANNER_DATA_DIR=/home/data/planificadorhalloween` y el comando `npm start`. Esta configuración utiliza App Service Linux. El historial corresponde al montaje compartido por esta aplicación.

## Desarrollo local

Se necesita Node.js 22 o posterior, sin instalar dependencias:

```text
npm test
npm run build
npm start
```

Abre `http://127.0.0.1:8768/`. En Windows puedes usar **Iniciar-planificador.cmd**. El servidor de desarrollo guarda en `montajes/guardado-servidor/`, una carpeta ignorada por Git; los datos de pruebas se generan y eliminan por separado.

Los HTML de `output/` mantienen importación, exportación y edición al abrirse como archivos, pero el guardado y las versiones requieren la página servida por Node/Azure.

## Archivos principales

- `src/app.js`, `src/index.html`: editor y controles de versiones.
- `src/server-history.js`: cliente de la API del mismo sitio.
- `src/history-store.js`: snapshots, listado y restauración reversible.
- `server.cjs`: API y servidor de los HTML; escritura de archivos temporales y renombrado para confirmar cada JSON.
- `build.cjs`: genera ambos planificadores, con la propuesta preliminar como punto de partida cuando aún no hay guardados.
- `work/package-deploy.cjs`: empaqueta únicamente código y páginas, sin montajes del servidor.

Las pruebas cubren guardar/listar/restaurar, preservación de la versión sustituida, reinicio del servidor, fallos de escritura, solicitudes simultáneas, archivos corruptos, solicitudes rechazadas y los botones existentes de descarga e importación.
