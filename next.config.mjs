/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Tauri
  output: "export",
  distDir: "out",
  images: {
    unoptimized: true,
  },
}

export default nextConfig
