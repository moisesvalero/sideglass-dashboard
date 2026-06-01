# Auto-actualizacion (Tauri Updater)

La clave publica esta en `src-tauri/tauri.conf.json`. La clave privada es `src-tauri/signing.key` (no se sube a git).

## Secret en GitHub (importante)

En **Settings → Secrets → Actions** crea:

| Secret | Valor |
|--------|--------|
| `TAURI_SIGNING_PRIVATE_KEY` | **Todo** el contenido de `src-tauri/signing.key` tal cual (varias lineas). No lo codifiques en base64. |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | La contraseña que pusiste al generar la clave |

Errores tipicos:

- `Invalid symbol 10` → pegaste la clave en una sola linea o con caracteres raros. Vuelve a copiar el archivo completo desde el Bloc de notas.
- No pegues `signing.key.pub` (esa es la publica).

El workflow escribe la clave en un archivo temporal y exporta `TAURI_SIGNING_PRIVATE_KEY` con la ruta a ese archivo (lo que espera el CLI de Tauri al generar `latest.json`).

## Publicar una version

```bash
git tag v0.2.1
git push origin v0.2.1
```

El workflow genera el `.exe`, `latest.json` y firmas para el updater.

## Probar en local

```bash
npm run tauri:build
```

La app comprueba actualizaciones unos segundos despues de abrir (si hay Release publicado en GitHub).
