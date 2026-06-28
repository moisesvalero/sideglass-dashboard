import Link from "next/link"
import type { Metadata } from "next"
import { APP_NAME, SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `Política de cookies · ${APP_NAME}`,
  description:
    "Política de cookies de Sideglass, un dashboard gratuito para monitor secundario en Windows.",
}

export default function CookiesPage() {
  return (
    <main className="landing-page min-h-screen antialiased">
      <div className="landing-ambient" aria-hidden>
        <div className="landing-ambient-cyan" />
        <div className="landing-ambient-violet" />
      </div>

      <article className="relative z-10 mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <Link
          href="/"
          className="mb-8 inline-flex text-sm text-[var(--landing-accent)] hover:underline underline-offset-2"
        >
          ← Volver al inicio
        </Link>

        <h1 className="landing-display landing-hero-title mb-8">Política de cookies</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-[var(--landing-text-soft)]">
          <section>
            <h2 className="text-lg font-semibold text-[var(--landing-text)]">
              1. ¿Qué son las cookies?
            </h2>
            <p>
              Las cookies son pequeños archivos de texto que los sitios web almacenan en tu
              navegador para recordar preferencias, mejorar la experiencia y obtener datos anónimos
              de uso.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--landing-text)]">
              2. Cookies que utilizamos
            </h2>
            <p>
              Sideglass utiliza únicamente cookies técnicas. No usamos cookies de terceros con fines
              publicitarios ni de tracking.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-[var(--landing-text)]">
                  Preferencias de usuario (localStorage):
                </strong>{" "}
                almacenamos tu configuración (widgets, layout, idioma) exclusivamente en tu
                navegador. No se envían a ningún servidor.
              </li>
              <li>
                <strong className="text-[var(--landing-text)]">Tema oscuro/claro:</strong> tu
                preferencia de tema se guarda en localStorage para mantener la coherencia visual
                entre visitas.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--landing-text)]">
              3. Cookies de terceros
            </h2>
            <p>
              Esta web no carga cookies de terceros. Los enlaces externos (GitHub, LinkedIn,
              YouTube, PayPal) son gestionados por sus respectivas plataformas bajo sus propias
              políticas de privacidad.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--landing-text)]">
              4. Gestión de cookies
            </h2>
            <p>
              Puedes eliminar o bloquear las cookies desde la configuración de tu navegador. Al ser
              cookies técnicas, el bloqueo puede afectar al funcionamiento de ciertas partes de la
              web.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--landing-text)]">5. Contacto</h2>
            <p>
              Si tienes dudas sobre esta política, puedes escribir a{" "}
              <a
                href="mailto:info@moisesvalero.es"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--landing-accent)] hover:underline"
              >
                moisesvalero.es/contact
              </a>
              .
            </p>
          </section>

          <p className="pt-4 text-sm text-[var(--landing-text-muted)]">
            Última actualización: junio 2026.
          </p>
        </div>
      </article>
    </main>
  )
}
