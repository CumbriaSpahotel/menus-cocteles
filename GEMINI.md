# Reglas del Proyecto - Menús Cócteles

## Control de Versión Global Única y 100% Automática
- Existe una **única versión global** para todo el sistema (compartida por todos los módulos, interfaz `index.html`, estilos, scripts y recursos).
- **EJECUCIÓN AUTOMÁTICA OBLIGATORIA**: Cada vez que se realice cualquier modificación, mejora, corrección o cambio en el código o estructura del sistema:
  1. El asistente actualizará **automáticamente en ese mismo turno** (sin necesidad de que el usuario lo solicite explícitamente) la versión global del sistema y la fecha de última actualización.
  2. La actualización se puede realizar ejecutando el script auxiliar del repositorio:
     ```bash
     node bump-version.js [patch|minor|major] "Descripción de los cambios" "archivos modificados"
     ```
     o actualizando de forma coordinada [`version.json`](version.json), [`index.html`](index.html) y [`REGISTRO_VERSIONES.md`](REGISTRO_VERSIONES.md).
  3. Criterio de versionado semántico (`MAJOR.MINOR.PATCH`):
     - `patch`: Correcciones de bugs, textos, pequeños ajustes de diseño, hojas de estilo o mantenimiento.
     - `minor`: Nuevas funcionalidades, nuevos formatos de exportación, nuevos componentes o selectores.
     - `major`: Cambios estructurales mayores o rediseño integral de la arquitectura.
  4. Mantener siempre estrictamente sincronizados:
     - [`version.json`](version.json)
     - Metadatos de [`index.html`](index.html) (`<title>`, `<meta name="version">` y `<meta name="last-modified">`)
     - [`REGISTRO_VERSIONES.md`](REGISTRO_VERSIONES.md)
