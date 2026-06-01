# Sensor service (PawnIO in-process)

Sideglass reads CPU temperature **in-process** by talking to the signed **PawnIO** kernel driver (the same approach as MSI Afterburner / HWiNFO). It does **not** launch LibreHardwareMonitor.

Bundled here:

- `IntelMSR.bin` / `AMDFamily17.bin` — official signed PawnIO modules (from [namazso/PawnIO.Modules](https://github.com/namazso/PawnIO.Modules/releases)). Committed to the repo.
- `PawnIO_setup.exe` (2.2.0) and `LibreHardwareMonitor.*` — downloaded automatically by CI on release builds. The PawnIO driver is installed by the Sideglass installer.

How it works: tapping **«Activar °C»** installs PawnIO if missing, then launches a hidden elevated helper (`Sideglass.exe --sensor-helper`) that opens the PawnIO device, reads the temperature registers (Intel MSR / AMD SMN) and publishes the value to `%ProgramData%\Sideglass\cpu_temp.json`, which the main app reads. One UAC prompt, no extra window.

For local `tauri build`, also drop `PawnIO_setup.exe` 2.2.0 here (and LibreHardwareMonitor if you want the legacy WMI fallback).
