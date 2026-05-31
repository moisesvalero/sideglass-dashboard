/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Tauri
  output: "export",
  distDir: "out",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
