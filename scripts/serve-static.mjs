import { createReadStream, existsSync, statSync } from "node:fs"
import { createServer } from "node:http"
import { extname, join, resolve, sep } from "node:path"

const root = resolve(process.argv[2] ?? "out")
const port = Number(process.argv[3] ?? process.env.PORT ?? 3000)

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".ics", "text/calendar; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff2", "font/woff2"],
  [".xml", "application/xml; charset=utf-8"],
])

function resolveRequestPath(url) {
  const { pathname } = new URL(url, `http://localhost:${port}`)
  const decoded = decodeURIComponent(pathname)
  const normalized = decoded === "/" ? "/index.html" : decoded
  const candidates = [normalized, `${normalized}.html`, join(normalized, "index.html")]

  for (const candidate of candidates) {
    const filePath = resolve(root, `.${candidate}`)
    if (!filePath.startsWith(`${root}${sep}`) && filePath !== root) continue
    if (existsSync(filePath) && statSync(filePath).isFile()) return filePath
  }

  return null
}

const server = createServer((req, res) => {
  const filePath = resolveRequestPath(req.url ?? "/")
  if (!filePath) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" })
    res.end("Not found")
    return
  }

  res.writeHead(200, {
    "content-type": contentTypes.get(extname(filePath)) ?? "application/octet-stream",
  })
  createReadStream(filePath).pipe(res)
})

server.listen(port, () => {
  console.log(`Static server listening on http://localhost:${port}`)
})

process.on("SIGTERM", () => server.close(() => process.exit(0)))
process.on("SIGINT", () => server.close(() => process.exit(0)))
