"use client"

const events = [
  {
    id: 1,
    title: "Team Standup",
    time: "09:00",
    color: "bg-[#FF3B30]",
  },
  {
    id: 2,
    title: "Code Review Session",
    time: "11:30",
    color: "bg-[#007AFF]",
  },
  {
    id: 3,
    title: "Design System Sync",
    time: "14:00",
    color: "bg-[#34C759]",
  },
  {
    id: 4,
    title: "Sprint Planning",
    time: "16:30",
    color: "bg-[#FF9500]",
  },
]

export function CalendarWidget() {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">
          Today&apos;s Schedule
        </h2>
        <span className="text-xs text-white/40">4 events</span>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-center gap-3 group"
          >
            <div className={`w-0.5 h-10 rounded-full ${event.color}`} />
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate text-sm">
                {event.title}
              </p>
              <p className="text-white/50 text-xs">{event.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
