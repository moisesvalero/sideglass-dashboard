type Feature = { label: string; desc: string }
type Group = { title: string; items: Feature[] }

export function LandingFeatures({ groups }: { groups: Group[] }) {
  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <div key={group.title}>
          <h3 className="mb-4 text-center text-base font-medium text-[var(--landing-accent)]">
            {group.title}
          </h3>
          <ul className="space-y-4 max-w-xl mx-auto">
            {group.items.map((item) => (
              <li key={item.label} className="flex gap-3 text-left">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--landing-accent)]"
                  aria-hidden
                />
                <div>
                  <p className="font-medium text-white/92">{item.label}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-white/65">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
