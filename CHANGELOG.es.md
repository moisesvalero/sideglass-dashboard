# Changelog

Todos los cambios relevantes del proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es/1.1.0/) y el proyecto usa [Versionado Semántico](https://semver.org/lang/es/).

**Versión en inglés:** [CHANGELOG.md](./CHANGELOG.md) — mantén ambos archivos sincronizados al publicar una release.

## [0.2.35] - 2026-07-21

### Corregido

- **Drag & Drop 2D y Límites de Redimensionamiento**: actualizada la estrategia de rejilla de `@dnd-kit` a `rectSortingStrategy` y `rectIntersection` en 2D, añadidos límites mínimos de tamaño por widget (`WIDGET_CONSTRAINTS`) para evitar encoger por debajo del tamaño visible real y solucionado el solapamiento de hora y tiempo en resoluciones de tablet

## [0.2.34] - 2026-07-21

### Corregido

- **Migración de Ajustes y Protección contra Cuelgues**: corregida la excepción crítica de renderizado en React causada cuando la configuración almacenada en localStorage incluía IDs de widgets eliminados del grid (como `ai`), filtrando IDs obsoletos durante la migración y protegiendo el renderizado del grid

## [0.2.33] - 2026-07-21

### Restaurado

- **Barra Dock Flotante de IAs**: restaurada la barra fija flotante inferior estilo macOS original con animaciones al pasar el ratón y la incorporación de Grok AI con los iconos vectoriales SVG oficiales de Icons8 para modo claro y oscuro

## [0.2.32] - 2026-07-21

### Corregido

- **Icono de Grok AI**: reemplazado por la marca vectorial SVG oficial de Icons8 con variantes adaptativas para modo claro y oscuro

## [0.2.31] - 2026-07-21

### Corregido

- **Migración del Widget de IA**: corregida la migración de la configuración guardada en localStorage para que el nuevo widget del dock de IA se añada automáticamente al layout de los usuarios existentes al actualizar

## [0.2.30] - 2026-07-21

### Añadido

- **Soporte para Grok AI**: añadida la IA Grok con su icono oficial al dock de IAs (https://grok.com)
- **Dock de IAs redimensionable**: la barra de IAs ahora es un widget estándar del dashboard, permitiendo moverla, redimensionarla y cambiar su visibilidad como el resto de widgets

### Mejorado

- **Diseño Responsive del Dashboard**: grid fluido adaptativo para pantallas móviles, tablets y monitores panorámicos con escalado automático de columnas y protección de tamaño mínimo

## [0.2.29] - 2026-06-14

### Añadido

- **AI Hub**: abre ChatGPT, Gemini, Claude, Perplexity y Microsoft Copilot desde el dock del dashboard en una ventana dedicada con webviews embebidos por pestaña y datos de sesión aislados en Windows

### Corregido

- **AI Hub multi-webview**: los webviews hijos ya no rompen la búsqueda de ventana ni el IPC tras cargar la primera pestaña
- **Dock en preview web**: los accesos a IA abren la URL del servicio en el navegador cuando no se ejecuta en Tauri

## [0.2.28] - 2026-06-09

### Corregido

- **Actualizador reparado**: la version interna de Tauri vuelve a estar sincronizada con la release, para que Sideglass detecte correctamente la actualizacion desde la app

## [0.2.27] - 2026-06-09

### Corregido

- **Arrastrar enlaces de YouTube en la app real**: Tauri ya deja pasar el drag and drop HTML5 al widget, para que los enlaces soltados desde Chrome o Edge lleguen al reproductor

## [0.2.26] - 2026-06-09

### Añadido

- **YouTube por arrastrar y soltar**: ahora puedes soltar un enlace de YouTube encima del widget y Sideglass lo reproduce directamente dentro del panel
- **Pegar enlace sigue funcionando**: si escribes o pegas una URL de YouTube en el buscador, se carga el video sin convertirlo en una busqueda

## [0.2.25] - 2026-06-03

### Corregido

- **Clima mas resistente**: el widget vuelve a cargar correctamente cuando la ciudad guardada incluye region y pais, como `Alcoy, Comunidad Valenciana, Espana`
- **Fallback de ubicacion automatica**: si Windows o WebView bloquean la geolocalizacion, Sideglass usa la ciudad manual guardada en vez de mostrar `No se pudo cargar el clima`

## [0.2.24] - 2026-06-02

### Cambiado

- **Arranque en el monitor correcto**: Sideglass guarda posicion, tamano, maximizado y monitor usado, y al iniciar con Windows reintenta restaurar la ventana en el monitor secundario cuando este vuelve a estar disponible
- **Estado clicable mas claro**: los accesos externos de Clima, Agenda y YouTube muestran cursor de mano y hover/focus visible para que se entienda que abren detalle fuera de la app

### Corregido

- **Restauracion de ventana mas robusta**: se valida que la posicion guardada siga dentro de un monitor disponible y se recoloca de forma segura si Windows cambio la configuracion de pantallas
- **Estado de ventana completo**: Tauri ahora guarda tambien el tamano de ventana, no solo posicion y maximizado

## [0.2.23] - 2026-06-02

### Cambiado

- **Layout por defecto responsive**: la primera instalacion y `Restablecer layout` usan composiciones distintas para monitores verticales y horizontales, evitando tarjetas aplastadas
- **Reloj y clima sin solapes**: la hora reserva espacio real para el panel meteorologico y ya no queda tapada por la temperatura en tarjetas grandes
- **Accesos de detalle**: al pulsar el clima se abre una vista meteorologica detallada, Agenda abre Google Calendar y el titulo de YouTube abre YouTube

### Corregido

- **Autoubicacion del clima**: Sideglass ya no cae a Madrid como fallback falso cuando la geolocalizacion no esta disponible o es demasiado imprecisa
- **Selector manual de ciudad**: al elegir una sugerencia, el campo se rellena con la ciudad seleccionada completa
- **Tests visuales del dashboard**: los e2e ahora comprueban geometria real para impedir solapes, texto recortado y widgets planos en vertical/horizontal

## [0.2.22] - 2026-06-02

### Añadido

- **Métrica útil de disco**: el estado del sistema muestra el uso real del disco principal desde Tauri, con porcentaje y GB usados/totales

### Cambiado

- **Dashboard sin scroll de página**: el grid se ajusta al alto disponible de la ventana y comprime las filas en vez de crear scroll vertical
- **Frases del día curadas**: sustituido el volcado grande de frases por una colección bilingüe corta de autores clásicos conocidos
- **Tipografía de frase diaria**: el texto de la frase usa Architects Daughter para un aspecto manuscrito más limpio
- **Tipografía Satoshi**: sustituido Inter por Satoshi empaquetada localmente como fuente principal de la app
- **Clima más escalable**: el icono y la temperatura crecen mejor cuando la tarjeta del reloj es grande

### Corregido

- **Controles de YouTube**: la X de cerrar ya no choca con el asa de arrastrar el widget en modo edición
- **Unidades del clima**: Celsius/Fahrenheit se muestran como `°C` y `°F` en vez de caracteres rotos

## [0.2.21] - 2026-06-02

### Añadido

- **Frases del día offline**: el widget de frase diaria usa un dataset local bilingüe con texto en español e inglés según el idioma de la app

### Cambiado

- **Tipografía estilo Apple en Windows**: el dashboard usa una fuente real empaquetada, con fallbacks nativos de Windows
- **Tarjetas de frase y notas responsivas**: la frase diaria escala o hace scroll dentro de tarjetas pequeñas, y el botón `+` de notas ya no se solapa con el arrastre en modo edición

## [0.2.20] - 2026-06-01

### Cambiado

- **Contenido de widgets responsivo**: reloj/clima, agenda y YouTube se adaptan al tamaño real de la tarjeta en vez de dejar huecos vacíos o desbordarse al redimensionar
- **YouTube más compacto**: altura por defecto reducida y zona de búsqueda/reproductor mejor integrada para colocarlo abajo en layouts verticales
- **Agenda**: al restablecer layout ahora usa una tarjeta de ancho completo y muestra como máximo los próximos 4 eventos

### Corregido

- **Desbordes al restablecer layout**: los eventos de agenda ya no se salen de su tarjeta ni se superponen con YouTube tras volver al layout por defecto

## [0.2.19] - 2026-06-01

### Corregido

- **Versión visible sincronizada**: Ajustes y landing ya muestran `0.2.19` en vez de quedarse en `0.2.15`
- **Release instalable completa**: el instalador/updater incluye los cambios publicados tras `0.2.18` en `main`, incluyendo vídeo de landing y frase del día manuscrita
- **Entrega del updater**: nueva versión para forzar actualización limpia y evitar que una instalación previa se quede con artefactos viejos

## [0.2.18] - 2026-06-01

### Añadido

- **Widgets redimensionables**: el modo edición permite arrastrar widgets y cambiar el tamaño de cada tarjeta desde la esquina, guardando el layout localmente
- **Nuevas capturas de marketing**: README y landing muestran capturas actualizadas del dashboard personalizable

### Corregido

- **Bloqueo del instalador al actualizar**: incluye el fix para cerrar el proceso interno `desk-dashboard.exe` antes de reemplazar archivos

## [0.2.17] - 2026-06-01

### Corregido

- **Bloqueo del instalador al actualizar**: el instalador de Windows ahora cierra el proceso interno `desk-dashboard.exe` antes de reemplazar archivos, evitando el error “Error opening file for writing”

## [0.2.16] - 2026-06-01

### Cambiado

- **Rediseño del dashboard**: tarjetas, espaciado, sistema de materiales, estados hover, estados de carga y temas claro/oscuro actualizados para un acabado más moderno estilo macOS
- **Jerarquía de widgets**: reloj/clima, hardware, calendario, notas, música y motivación tienen roles más claros y una densidad visual más cuidada, manteniendo el dock IA sin cambios

## [0.2.15] - 2026-06-01

### Corregido

- **«Activar °C» sin UAC / PawnIO no se instalaba**: la instalación de PawnIO ya no se intenta desde el proceso normal (fallaba en silencio). Un único aviso de Windows eleva Sideglass; el proceso ayudante instala PawnIO con permisos de administrador y lee la temperatura. `PawnIO_setup.exe` incluido en el instalador
- Mensajes de error más claros (UAC cancelado, falta instalador, timeout, lectura fallida)

## [0.2.14] - 2026-06-01

### Cambiado

- **Temperatura de CPU sin abrir otra app**: Sideglass ya no abre LibreHardwareMonitor. Ahora lee la temperatura del procesador directamente desde dentro de la app, hablando con el driver PawnIO (igual que hacen MSI Afterburner o HWiNFO). Funciona en Intel (MSR) y AMD Ryzen (SMN). Un proceso ayudante oculto y elevado obtiene la lectura tras un único aviso de Windows; no aparece ninguna ventana extra
- El driver PawnIO se instala dentro del propio instalador de Sideglass; al pulsar «Activar °C» solo hace falta aceptar un aviso de administrador

## [0.2.13] - 2026-06-01

### Corregido

- **Temperatura de la CPU sin instaladores raros**: al abrir Sideglass ya no se lanza LibreHardwareMonitor en segundo plano, así que desaparece el popup de PawnIO y el error `failed to open current executable 0xc0000033`. El driver PawnIO (2.2.0) se instala ahora de forma silenciosa dentro del propio instalador de Sideglass (mismo UAC), y al pulsar «Activar °C» se instala primero PawnIO si falta y luego se lanza LHM elevado
- **Mensajes claros**: si PawnIO no se instala o cancelas el aviso de Windows, el panel lo indica con instrucciones concretas

## [0.2.12] - 2026-06-01

### Corregido

- **Pantalla completa (F11)**: modo inmersivo que cubre el monitor, oculta la barra de tareas de Windows y la barra superior de la app (− □ ×). Esc para salir; restaura tamaño y posición anteriores

### Cambiado

- **FAQ web**: aclara que la URL iCal secreta es privada, solo se guarda en el PC del usuario y Sideglass no puede verla

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
