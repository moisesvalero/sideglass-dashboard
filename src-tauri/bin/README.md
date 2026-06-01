# Sensor service (LibreHardwareMonitor + PawnIO)

The Windows installer bundles **LibreHardwareMonitor** and **PawnIO_setup.exe** (2.2.0) here automatically on release builds.

- **PawnIO** is the kernel driver LHM needs for CPU package temperature on recent Windows.
- Sideglass does **not** start LHM at launch (avoids unexpected PawnIO prompts). Use **«Activar °C»** in the hardware widget or install PawnIO during setup.
- On **«Activar °C»**, Sideglass installs PawnIO (UAC) if missing, then starts LHM elevated.

For local `tauri build`, download the latest zip from [LibreHardwareMonitor releases](https://github.com/LibreHardwareMonitor/LibreHardwareMonitor/releases) and copy `LibreHardwareMonitor.exe` plus its DLLs into this folder. Also copy [PawnIO_setup.exe 2.2.0](https://github.com/namazso/PawnIO.Setup/releases/download/2.2.0/PawnIO_setup.exe) here.
