/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export → carpeta `out/` (Tauri). Build interno sigue en `.next/`.
  output: "export",
  devIndicators: false,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
