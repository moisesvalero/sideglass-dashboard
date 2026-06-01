# Auto-actualizacion (Tauri Updater)

La clave publica esta en `src-tauri/tauri.conf.json`. La clave privada es `src-tauri/signing.key` (no se sube a git).

## Publicar una version

1. Sube el tag: `git tag v0.2.0 && git push origin v0.2.0`
2. En GitHub Actions, configura el secret `TAURI_SIGNING_PRIVATE_KEY` con el contenido de `signing.key` (o usa `TAURI_SIGNING_PRIVATE_KEY_PATH` en el runner).
3. El workflow genera el `.exe`, `latest.json` y firmas para el updater.

## Probar en local

```bash
npm run tauri:build
```

La app comprueba actualizaciones ~8 s despues de abrir (solo si hay un Release en GitHub).
