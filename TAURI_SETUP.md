# iOS Dashboard - Tauri App

Premium visionOS-style dashboard with real hardware monitoring for Windows.

## Prerequisites

1. **Rust** - Install from [rustup.rs](https://rustup.rs/)
2. **Node.js** (v18+) and **pnpm**
3. **Tauri CLI** - Install with: `cargo install tauri-cli`
4. **Windows Build Tools** (for Windows):
   - Visual Studio Build Tools with C++ workload
   - WebView2 (usually pre-installed on Windows 10/11)

## Setup

```bash
# Install dependencies
pnpm install

# Run in development mode (web only)
pnpm dev

# Run with Tauri (desktop app with real hardware monitoring)
pnpm tauri:dev
```

## Build for Production

```bash
# Build the desktop app
pnpm tauri:build
```

The installer will be created in `src-tauri/target/release/bundle/`

## Features

- **Real CPU Monitoring** - Usage percentage and temperature
- **Real RAM Monitoring** - Used/Total memory with percentage
- **Real GPU Monitoring** - NVIDIA GPUs via NVML (usage, temperature, VRAM)
- **iOS/visionOS Aesthetic** - Glassmorphism, blur effects, smooth animations
- **AI Dock** - Quick access to ChatGPT, Gemini, Claude, Perplexity, Copilot

## Hardware Monitoring

The app uses:
- `sysinfo` crate for CPU and RAM monitoring
- `nvml-wrapper` crate for NVIDIA GPU monitoring

### GPU Support

- **NVIDIA**: Full support (requires NVIDIA drivers with NVML)
- **AMD/Intel**: Currently shows CPU and RAM only (GPU data not available)

## Configuration

### Window Size
Edit `src-tauri/tauri.conf.json` to change window dimensions:

```json
{
  "app": {
    "windows": [{
      "width": 420,
      "height": 900
    }]
  }
}
```

### Refresh Rate
Edit `components/dashboard/hardware-monitor.tsx` to change the polling interval:

```typescript
const interval = setInterval(fetchSystemInfo, 1500) // 1.5 seconds
```

## Troubleshooting

### GPU not detected
- Ensure NVIDIA drivers are installed
- Check if `nvml.dll` is accessible (usually in NVIDIA driver folder)

### High CPU usage
- Increase the polling interval in `hardware-monitor.tsx`

### Build errors
- Run `cargo clean` in `src-tauri/` folder
- Ensure Rust toolchain is up to date: `rustup update`
