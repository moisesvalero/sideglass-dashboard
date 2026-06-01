# Sensor service (LibreHardwareMonitor)

The Windows installer bundles LibreHardwareMonitor here automatically (CI on release).

Sideglass starts it in the background on launch so CPU/GPU temperatures work without the user installing anything extra.

For local `tauri build`, download the latest zip from [LibreHardwareMonitor releases](https://github.com/LibreHardwareMonitor/LibreHardwareMonitor/releases) and copy `LibreHardwareMonitor.exe` plus its DLLs into this folder.
