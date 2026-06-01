# Changelog

Todos los cambios relevantes del proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es/1.1.0/) y el proyecto usa [Versionado Semántico](https://semver.org/lang/es/).

**Versión en inglés:** [CHANGELOG.md](./CHANGELOG.md) — mantén ambos archivos sincronizados al publicar una release.

## [0.2.11] - 2026-06-01

### Corregido

- **Botón «Activar °C»: el aviso de Windows (UAC) ya aparece de verdad**. Antes se usaba PowerShell con ventana oculta, que en algunas configuraciones de Windows silenciaba el prompt y el botón parecía no hacer nada. Ahora se invoca la API nativa `ShellExecuteW` con `runas`, que fuerza el prompt sin excepciones

## [0.2.10] - 2026-06-01

### Corregido

- **Botón «Activar °C»**: ahora cierra cualquier instancia previa de LibreHardwareMonitor antes de relanzarlo elevado (una instancia no elevada bloqueaba el UAC y el botón parecía no hacer nada). Espera hasta 30 s a que aparezcan los sensores tras aceptar el aviso de Windows

### Cambiado

- **Ajustes**: panel más ancho y con dos columnas en pantallas medianas/grandes para reducir el scroll vertical
- **Landing**: pase de color (paleta cyan + soft + warm), animaciones de entrada del hero con stagger en features, microinteracciones en CTA y FAQ, contraste y tokens alineados

## [0.2.9] - 2026-06-01

### Corregido

- **Actualizaciones**: el aviso ya no queda detrás del panel de Ajustes (portal + z-index alto); la barra de progreso funciona sin Content-Length (animación + MB descargados); la instalación reutiliza la actualización ya detectada (sin volver a comprobar); mensaje de error con detalle técnico

### Cambiado

- **Landing**: changelog resumido (solo última versión), features en listas, marca visual propia, mejor contraste de texto

## [0.2.8] - 2026-06-01

### Corregido

- **Temperatura de CPU**: el botón «Activar °C» ya no se oculta cuando la GPU sí muestra grados (NVIDIA). Aparece en la fila de la CPU, junto al porcentaje
- Lectura de sensores CPU ampliada (Parent/Identifier de LHM, AMD CCD/Tdie, zona térmica ACPI de respaldo)

## [0.2.7] - 2026-06-01

### Corregido

- Error al actualizar «error opening file for writing LibreHardwareMonitor.exe»: ahora se cierra el servicio de sensores antes de instalar (en la app y mediante un hook del instalador), evitando que el archivo quede bloqueado

## [0.2.6] - 2026-06-01

### Añadido

- **Temperatura de CPU/GPU**: botón «Activar temperaturas» en el monitor de hardware que inicia el servicio de sensores bajo demanda (acepta el aviso de Windows). Lectura de sensores ampliada (más nombres y rango hasta 150 °C)
- **Actualización profesional**: aviso de «Nueva versión disponible» con sus novedades, botones **Instalar ahora** / **Ahora no**, barra de progreso durante la descarga y botón **Reiniciar** al terminar
- **Buscador de ciudades** en el clima: sugerencias automáticas al escribir (autocompletado con país y región)

### Cambiado

- El comprobador de actualizaciones ya no instala de forma instantánea: ahora el usuario decide cuándo instalar

### Añadido

- Pantalla completa con **F11** cuando la ventana del dashboard tiene el foco

### Cambiado

- Barra de título al estilo Windows: icono y nombre a la izquierda, controles a la derecha

## [0.2.4] - 2026-06-01

### Añadido

- Buscador de YouTube integrado en el panel (ya no hace falta pegar enlaces)
- Botón de ayuda en la barra de título que abre el FAQ de la web
- Sección «Acerca de» en Ajustes con la versión y enlace al código
- Entrada manual de ciudad para el clima (escribe cualquier ubicación)
- Guía paso a paso de la dirección secreta iCal de Google Calendar en la web

### Cambiado

- Las frases del día usan una lista local curada (corrige erratas, sin API externa)
- Correcciones de ortografía en la interfaz en español (tildes y ñ)

### Corregido

- La temperatura de la CPU se lee correctamente (el servicio de sensores arranca con permisos de administrador)
- «Buscar actualizaciones» ya no se queda colgado para siempre (timeout de red)

## [0.2.3] - 2026-06-01

### Añadido

- Botón **Buscar actualizaciones** en Ajustes

### Cambiado

- Barra de título estilo Windows (controles a la derecha)
- YouTube solo dentro del widget (sin ventana aparte)
- La app abre maximizada por defecto

### Corregido

- Mensajes confusos de «sin sensor» en CPU/GPU; arranque LHM más fiable
- README actualizado con capturas reales

## [0.2.2] - 2026-06-01

### Añadido

- Iconos OpenAI claros/oscuro según tema en el dock de IAs
- Capturas de landing actualizadas (vertical y horizontal)

### Cambiado

- Marca unificada como **Sideglass**
- Dock de IAs en fila inferior del layout (ya no flota encima de los widgets)
- Script de capturas: solo viewport y demo compacto en vertical

### Corregido

- Solapamiento del dock con Notas y demás widgets al hacer scroll
- CI/release: glob de recursos Tauri `bin/*` para LibreHardwareMonitor
- Icono ChatGPT invisible en modo oscuro
- Texto FAQ sin rayas largas

## [0.2.0] - 2026-06-01

### Añadido

- Diseño premium estilo macOS (cristal, temas claro/oscuro)
- Layout adaptable a monitor vertical u horizontal
- Google Calendar vía URL iCal (sin Apps Script)
- YouTube embebido en el panel (pegar enlace)
- Dock de IAs con iconos oficiales (ChatGPT, Gemini, Claude, Perplexity, Copilot)
- Clima Open-Meteo (sin API key) y ubicación automática opcional
- Temperaturas reales vía LibreHardwareMonitor (WMI)
- Reordenar widgets arrastrando
- Inicio con Windows, atajo global, notificaciones de calendario
- Interfaz en español e inglés y formato de hora 12/24h
- Landing con FAQ, guía de instalación y changelog

### Cambiado

- Ventana más grande, maximizable, recuerda tamaño y posición
- Notas locales con estilo premium

### Corregido

- Texto legible en modo claro (tokens semánticos)
- Eliminado fallback falso de temperatura CPU sin sensor

## [0.1.0] - 2025-05-31

### Añadido

- Primera versión Tauri + Next.js
- Monitor de hardware, clima, calendario, dock de IAs, notas y YouTube
