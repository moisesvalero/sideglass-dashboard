import type { CSSProperties } from "react"

type Feature = { label: string; desc: string }
type Group = { title: string; items: Feature[] }

export function LandingFeatures({ groups }: { groups: Group[] }) {
  return (
    <div className="space-y-[var(--landing-space-2xl)]">
      {groups.map((group) => (
        <div key={group.title}>
          <h3 className="landing-group-title mb-[var(--landing-space-lg)]">{group.title}</h3>
          <ul className="landing-stagger mx-auto max-w-xl space-y-[var(--landing-space-md)]">
            {group.items.map((item, index) => (
              <li
                key={item.label}
                className="flex gap-3 text-left"
                style={{ "--i": index } as CSSProperties}
              >
                <span className="landing-feature-dot" aria-hidden />
                <div>
                  <p className="font-medium text-[var(--landing-text)]">{item.label}</p>
                  <p className="landing-body mt-0.5">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
