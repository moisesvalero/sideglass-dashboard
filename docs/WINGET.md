# WinGet publishing

Sideglass can be submitted to the Windows Package Manager Community Repository (`microsoft/winget-pkgs`) with the generated manifests in this repo.

WinGet manifests must point to a versioned installer URL and include the exact SHA256 of that installer. Do not use the `/releases/latest/` URL for WinGet manifests because the file behind that URL changes on every release.

## Generate manifests

After a release installer exists, generate the manifests from the repository root:

```powershell
npm run winget:manifest -- --installer .\src-tauri\target\x86_64-pc-windows-msvc\release\bundle\nsis\Sideglass_0.2.24_x64-setup.exe
```

If you already know the hash, pass it directly:

```powershell
npm run winget:manifest -- --version 0.2.24 --sha256 <SHA256>
```

By default, the script reads `package.json` for the version and writes:

```txt
winget/manifests/m/MoisesValero/Sideglass/<version>/
```

The default installer URL is:

```txt
https://github.com/moisesvalero/sideglass-dashboard/releases/download/v<version>/Sideglass_x64-setup.exe
```

Override it only if the release asset name changes:

```powershell
npm run winget:manifest -- --installer .\Sideglass_x64-setup.exe --installer-url https://example.com/Sideglass_x64-setup.exe
```

## Validate locally

Install the WinGet manifest tooling:

```powershell
winget install wingetcreate
```

Validate the generated folder:

```powershell
winget validate .\winget\manifests\m\MoisesValero\Sideglass\0.2.24
```

## Submit to winget-pkgs

1. Fork and clone `https://github.com/microsoft/winget-pkgs`.
2. Copy the generated `manifests/m/MoisesValero/Sideglass/<version>/` folder into that fork.
3. Run `winget validate` from the `winget-pkgs` checkout.
4. Commit and open a PR to `microsoft/winget-pkgs`.

After Microsoft accepts the PR, users can install Sideglass with:

```powershell
winget install MoisesValero.Sideglass
```

Future releases repeat the same flow with the new version and installer hash.
