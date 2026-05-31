import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard — Panel de control para Windows",
  description: "Panel de control premium con monitor hardware nativo, estilo iOS/visionOS.",
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080814] text-white font-sans antialiased">
      <div className="fixed inset-0 z-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <span className="text-xs font-medium tracking-widest text-blue-400/70 uppercase mb-8">
          Panel de control &middot; Windows
        </span>

        <h1 className="text-5xl sm:text-6xl font-light tracking-tight leading-[1.05] mb-6 max-w-xl" style={{ letterSpacing: "-0.03em" }}>
          Tu monitor secundario merece algo mejor
        </h1>

        <p className="text-lg text-white/50 leading-relaxed max-w-lg mb-12">
          Panel vertical premium con hardware nativo, clima, calendario y acceso rapido a IAs. App de escritorio sin bordes para tu monitor secundario.
        </p>

        <a
          href="https://github.com/moisesvalero/personal-dashboard/releases"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-medium text-sm hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(59,130,246,0.15)]"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          </svg>
          Descargar para Windows
        </a>
        <span className="text-white/25 text-xs mt-3">.exe &middot; v0.1.0 &middot; Gratis y open source</span>

        {/* Preview mockup */}
        <div className="mt-20 w-full max-w-[280px]">
          <div className="relative rounded-[32px] overflow-hidden border border-white/[0.08] shadow-[0_32px_64px_rgba(0,0,0,0.5)] bg-[#0c0a1a]">
            <div className="h-7 flex items-center gap-1.5 px-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <div className="px-3 pb-4 space-y-2.5">
              <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-3 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-light tracking-tight">14:32</div>
                  <div className="text-[10px] text-white/40">domingo, 31 de mayo</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-amber-400/20" />
                  <div className="text-lg font-light">24°</div>
                </div>
              </div>
              <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-3">
                <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Agenda</div>
                {["Team Standup", "Code Review", "Design Sync"].map((e, i) => (
                  <div key={i} className="flex items-center gap-2 py-1">
                    <div className={`w-0.5 h-4 rounded-full ${["bg-red-400", "bg-blue-400", "bg-emerald-400"][i]}`} />
                    <span className="text-white/70 text-xs">{e}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-3">
                <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Sistema</div>
                {[
                  { label: "CPU", pct: 42, temp: 54 },
                  { label: "RAM", pct: 67, temp: 45 },
                  { label: "GPU", pct: 38, temp: 62 },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2 mb-1.5 last:mb-0">
                    <span className="text-white/60 text-xs w-6">{s.label}</span>
                    <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-blue-400" style={{ width: `${s.pct}%` }} />
                    </div>
                    <span className="text-white text-xs tabular-nums w-8 text-right">{s.pct}%</span>
                    <span className="text-emerald-400 text-[10px] tabular-nums w-8 text-right">{s.temp}°C</span>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-white/[0.08] border border-white/[0.12] p-2 flex justify-center gap-2">
                {["#10A37F", "#4285F4", "#D97757", "#20B2AA", "#6366F1"].map((c, i) => (
                  <div key={i} className="w-6 h-6 rounded-lg" style={{ background: `${c}30`, border: `1px solid ${c}40` }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 w-full max-w-xl">
          <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-8">Que incluye</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {[
              { label: "Hardware nativo", desc: "CPU, RAM y GPU en tiempo real via Tauri + Rust" },
              { label: "Tu calendario", desc: "Sincronizado con Google Calendar" },
              { label: "Clima real", desc: "OpenWeatherMap con tu ubicacion" },
              { label: "AI Dock", desc: "Acceso rapido a ChatGPT, Gemini, Claude" },
              { label: "Notas", desc: "Guardado local, siempre a mano" },
              { label: "YouTube", desc: "Reproductor con buscador integrado" },
            ].map((f) => (
              <div key={f.label} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
                <div className="text-sm font-medium text-white/90 mb-1">{f.label}</div>
                <div className="text-xs text-white/40 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 mb-12 w-full max-w-lg border-t border-white/[0.06] pt-8">
          <p className="text-white/40 text-sm">
            Construido con Tauri + Next.js + Rust.{" "}
            <a href="https://github.com/moisesvalero/personal-dashboard" className="text-blue-400 hover:text-blue-300 transition-colors">
              GitHub
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
